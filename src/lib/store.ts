import {
  PartRequest,
  TradeCustomer,
  SystemSettings,
  UserRole,
  RequestStatus,
  SupplierQuotation,
  CustomerQuote,
  FreightMethod,
  MessageItem,
  SupplierProfile,
  CustomerNotification,
  CustomerOrgUser,
} from "./types";
import {
  initialRequests,
  initialCustomers,
  initialSuppliers,
  initialSystemSettings,
  initialNotifications,
} from "./mockData";

const STORAGE_KEYS = {
  REQUESTS: "autohub_procurly_requests_v2",
  CUSTOMERS: "autohub_procurly_customers_v2",
  SUPPLIERS: "autohub_procurly_suppliers_v2",
  SETTINGS: "autohub_procurly_settings_v2",
  ACTIVE_ROLE: "autohub_procurly_active_role_v2",
  NOTIFICATIONS: "autohub_procurly_notifications_v2",
  LOCKOUT: "autohub_procurly_lockout_v2",
};

// Simple event bus for reactivity
type StoreListener = () => void;
const listeners: Set<StoreListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Store listener error:", e);
    }
  });
}

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStoredRequests(): PartRequest[] {
  if (!isBrowser()) return initialRequests;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(initialRequests));
      return initialRequests;
    }
    const parsed: PartRequest[] = JSON.parse(raw);
    // Ensure new initialRequests (e.g. REQ-000140, REQ-000141) are merged if missing
    const missing = initialRequests.filter((initReq) => !parsed.some((p) => p.id === initReq.id));
    if (missing.length > 0) {
      const merged = [...missing, ...parsed];
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return initialRequests;
  }
}

export function saveRequests(requests: PartRequest[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  notifyListeners();
}

export function getRequestById(id: string): PartRequest | undefined {
  const requests = getStoredRequests();
  return requests.find((r) => r.id === id || r.referenceNumber === id);
}

export function getStoredCustomers(): TradeCustomer[] {
  if (!isBrowser()) return initialCustomers;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(initialCustomers));
      return initialCustomers;
    }
    return JSON.parse(raw);
  } catch {
    return initialCustomers;
  }
}

export function saveCustomers(customers: TradeCustomer[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  notifyListeners();
}

export function getStoredSuppliers(): SupplierProfile[] {
  if (!isBrowser()) return initialSuppliers;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(initialSuppliers));
      return initialSuppliers;
    }
    const parsed: SupplierProfile[] = JSON.parse(raw);
    // Sync contact info if missing from older store
    let changed = false;
    const enriched = parsed.map((s) => {
      const match = initialSuppliers.find((i) => i.id === s.id);
      if (match && (!s.contactPerson || !s.contactEmail)) {
        changed = true;
        return {
          ...s,
          contactPerson: match.contactPerson,
          contactEmail: match.contactEmail,
          contactPhone: match.contactPhone,
        };
      }
      return s;
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(enriched));
    }
    return enriched;
  } catch {
    return initialSuppliers;
  }
}

export function saveSuppliers(suppliers: SupplierProfile[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  notifyListeners();
}

export function addSupplierProfile(supplier: SupplierProfile) {
  const current = getStoredSuppliers();
  const exists = current.some((s) => s.id === supplier.id);
  const updated = exists
    ? current.map((s) => (s.id === supplier.id ? supplier : s))
    : [...current, supplier];
  saveSuppliers(updated);
}

export function getStoredSettings(): SystemSettings {
  if (!isBrowser()) return initialSystemSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSystemSettings));
      return initialSystemSettings;
    }
    return JSON.parse(raw);
  } catch {
    return initialSystemSettings;
  }
}

export function saveSettings(settings: SystemSettings) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  notifyListeners();
}

export function getActiveRole(): UserRole {
  if (!isBrowser()) return "CUSTOMER";
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
    if (!raw) return "CUSTOMER";
    return raw as UserRole;
  } catch {
    return "CUSTOMER";
  }
}

export function setActiveRole(role: UserRole) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  notifyListeners();
}

// Generate unique sequential reference number
export function generateNextReference(): string {
  const requests = getStoredRequests();
  const settings = getStoredSettings();
  const highestNum = requests.reduce((max, r) => {
    const num = parseInt(r.referenceNumber.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 128);
  const nextNum = (highestNum + 1).toString().padStart(6, "0");
  return `${settings.requestRefPrefix}${nextNum}`;
}

// Create new part request from customer form
export function createPartRequest(
  data: Omit<PartRequest, "id" | "referenceNumber" | "submittedDate" | "updatedDate" | "status" | "supplierQuotes" | "messages" | "auditLogs">
): PartRequest {
  const requests = getStoredRequests();
  const refNum = generateNextReference();
  const now = new Date().toISOString();

  const newRequest: PartRequest = {
    ...data,
    id: `REQ-${refNum.replace("AH-P-", "")}`,
    referenceNumber: refNum,
    submittedDate: now,
    updatedDate: now,
    status: "SOURCING", // Automatically routed to sourcing queue
    supplierQuotes: [],
    messages: [
      {
        id: `MSG-${Date.now()}-1`,
        senderId: "SYSTEM",
        senderName: "Procurly AI Coordinator",
        senderRole: "SYSTEM_ADMIN",
        timestamp: now,
        content: `Request ${refNum} received. Auto-allocated to Sourcing Desk. Our procurement specialists are currently obtaining global supplier quotes.`,
        isInternalOnly: false,
        isAiGenerated: true,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}-1`,
        timestamp: now,
        actorName: data.customerName,
        actorRole: "CUSTOMER",
        action: "Part Request Submitted",
        newState: "SUBMITTED",
        details: `Requested ${data.part.quantity}x ${data.part.partName} for ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}`,
      },
      {
        id: `AUD-${Date.now()}-2`,
        timestamp: now,
        actorName: "System Automation",
        actorRole: "SYSTEM_ADMIN",
        action: "Status Updated",
        previousState: "SUBMITTED",
        newState: "SOURCING",
        details: "Assigned to Sourcing Desk queue",
      },
    ],
  };

  saveRequests([newRequest, ...requests]);
  return newRequest;
}

// Update request status with audit tracking
export function updateRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  actorName: string,
  actorRole: UserRole,
  reason?: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const prevStatus = current.status;
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    status: newStatus,
    statusReason: reason,
    updatedDate: now,
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole,
        action: `Status changed to ${newStatus.replace(/_/g, " ")}`,
        previousState: prevStatus,
        newState: newStatus,
        details: reason,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Add supplier quote to request
export function addSupplierQuote(requestId: string, quote: SupplierQuotation) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    supplierQuotes: [...current.supplierQuotes, quote],
    updatedDate: now,
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: "Sourcing Specialist",
        actorRole: "SOURCING_SPECIALIST",
        action: `Added Supplier Quote from ${quote.supplierName}`,
        details: `Cost: $${quote.partCostNzd.toFixed(2)} NZD (${quote.partCostForeign} ${quote.partCostCurrency})`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Issue customer quote
export function issueCustomerQuote(requestId: string, quote: CustomerQuote) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    quote,
    status: "AWAITING_CUSTOMER_APPROVAL",
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "SOURCING-TEAM",
        senderName: "Nathan Cole (Sourcing Desk)",
        senderRole: "SOURCING_SPECIALIST",
        timestamp: now,
        content: `Quotation ${quote.quoteNumber} has been finalized and issued. Total $${quote.totalNzd.toFixed(2)} NZD incl GST with Air Express and Sea Freight transit options. Please review and select your preferred freight method.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: "Nathan Cole",
        actorRole: "SOURCING_SPECIALIST",
        action: "Customer Quote Issued",
        previousState: current.status,
        newState: "AWAITING_CUSTOMER_APPROVAL",
        details: `Quote ${quote.quoteNumber} issued for $${quote.totalNzd.toFixed(2)} NZD (incl GST)`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Reissue revised customer quote
export function reissueCustomerQuote(requestId: string, quote: CustomerQuote, revisionNotes: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();
  const revNum = (current.quote?.revisionNumber || 1) + 1;

  const revisedQuote: CustomerQuote = {
    ...quote,
    revisionNumber: revNum,
    revisionNotes,
    status: "ISSUED",
  };

  const updated: PartRequest = {
    ...current,
    quote: revisedQuote,
    status: "AWAITING_CUSTOMER_APPROVAL",
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "SOURCING-TEAM",
        senderName: "Nathan Cole (Sourcing Desk)",
        senderRole: "SOURCING_SPECIALIST",
        timestamp: now,
        content: `Quotation ${quote.quoteNumber} (Rev ${revNum}) reissued with updated terms: ${revisionNotes}. Revised total: $${quote.totalNzd.toFixed(2)} NZD incl GST.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: "Nathan Cole",
        actorRole: "SOURCING_SPECIALIST",
        action: `Customer Quote Reissued (Rev ${revNum})`,
        previousState: current.status,
        newState: "AWAITING_CUSTOMER_APPROVAL",
        details: `Rev ${revNum}: ${revisionNotes} ($${quote.totalNzd.toFixed(2)} NZD)`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Resolve sourcing exception and return to active sourcing queue
export function resolveSourcingException(requestId: string, actorName: string, notes?: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    status: "SOURCING",
    statusReason: undefined,
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "SOURCING-TEAM",
        senderName: actorName,
        senderRole: "SOURCING_SPECIALIST",
        timestamp: now,
        content: `Sourcing exception resolved. Request returned to active sourcing queue. ${notes || ""}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "SOURCING_SPECIALIST",
        action: "Sourcing Exception Cleared",
        previousState: current.status,
        newState: "SOURCING",
        details: notes || "Exception condition resolved; returned to sourcing queue",
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Customer accepts quote and selects freight option
export function acceptCustomerQuote(requestId: string, selectedFreight: FreightMethod, customerName: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  if (!current.quote) return;
  const now = new Date().toISOString();
  const quote = current.quote;

  const freightOption = quote.freightOptions.find((f) => f.method === selectedFreight) || quote.freightOptions[0];
  const subtotal = quote.basePartCostNzd + quote.marginAmountNzd + quote.procurementFeeNzd + freightOption.costNzd;
  const gst = subtotal * 0.15;
  const total = subtotal + gst;

  const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const updated: PartRequest = {
    ...current,
    status: "AWAITING_PAYMENT",
    updatedDate: now,
    quote: {
      ...quote,
      selectedFreightMethod: selectedFreight,
      subtotalNzd: subtotal,
      gstAmountNzd: gst,
      totalNzd: total,
      termsAccepted: true,
      status: "ACCEPTED",
    },
    invoice: {
      invoiceNumber: invoiceNum,
      dateIssued: now,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      customerName: current.customerName,
      customerNzbn: current.customerNzbn,
      customerGstNumber: "128-492-381",
      billingAddress: `${current.deliveryAddress.street}, ${current.deliveryAddress.suburb}, ${current.deliveryAddress.city}`,
      paymentMethod: "BANK_TRANSFER",
      paymentReference: current.referenceNumber,
      subtotalNzd: subtotal,
      gstRate: 0.15,
      gstAmountNzd: gst,
      totalNzd: total,
      status: "PENDING",
    },
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: current.customerId,
        senderName: customerName,
        senderRole: "CUSTOMER",
        timestamp: now,
        content: `Quote accepted with ${selectedFreight === "AIR_EXPRESS" ? "Air Express Priority" : "Sea Freight Consolidated"} freight. Please provide bank clearance or process against approved trade account.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: customerName,
        actorRole: "CUSTOMER",
        action: "Quote Accepted",
        previousState: "AWAITING_CUSTOMER_APPROVAL",
        newState: "AWAITING_PAYMENT",
        details: `Selected ${selectedFreight}. Invoice ${invoiceNum} generated for $${total.toFixed(2)} NZD.`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Finance confirms payment or customer pays via trade credit
export function confirmPayment(
  requestId: string,
  paymentMethod: "BANK_TRANSFER" | "TRADE_CREDIT",
  actorName: string,
  notes?: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  if (!current.invoice) return;
  const now = new Date().toISOString();
  const receiptNum = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  // If trade credit was used, update customer available credit
  if (paymentMethod === "TRADE_CREDIT") {
    const customers = getStoredCustomers();
    const custIdx = customers.findIndex((c) => c.id === current.customerId);
    if (custIdx !== -1) {
      const cust = customers[custIdx];
      const newAvail = Math.max(0, cust.billingDetails.creditAvailableNzd - current.invoice.totalNzd);
      customers[custIdx] = {
        ...cust,
        billingDetails: {
          ...cust.billingDetails,
          creditAvailableNzd: newAvail,
        },
      };
      saveCustomers(customers);
    }
  }

  const updated: PartRequest = {
    ...current,
    status: "PAYMENT_CONFIRMED",
    updatedDate: now,
    invoice: {
      ...current.invoice,
      paymentMethod,
      receiptNumber: receiptNum,
      paidDate: now,
      status: "PAID",
    },
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "FINANCE-TEAM",
        senderName: actorName,
        senderRole: "FINANCE_OFFICER",
        timestamp: now,
        content: `Payment confirmed via ${paymentMethod.replace(/_/g, " ")}. Receipt ${receiptNum} issued. Procurement gate released to operations.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "FINANCE_OFFICER",
        action: "Payment Gate Cleared",
        previousState: "AWAITING_PAYMENT",
        newState: "PAYMENT_CONFIRMED",
        details: `Verified payment of $${current.invoice.totalNzd.toFixed(2)} NZD. ${notes || ""}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Mark ordered from supplier
export function markOrderedFromSupplier(requestId: string, actorName: string, poNotes?: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    status: "ORDERED_FROM_SUPPLIER",
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "SOURCING-TEAM",
        senderName: actorName,
        senderRole: "SOURCING_SPECIALIST",
        timestamp: now,
        content: `Official purchase order placed with supplier. Parts entering packaging and dispatch to Autohub international export terminal.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "SOURCING_SPECIALIST",
        action: "Ordered From Supplier",
        previousState: current.status,
        newState: "ORDERED_FROM_SUPPLIER",
        details: poNotes || "PO dispatched to overseas supplier network",
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Update or create shipment and advance milestone
export function updateShipmentStage(
  requestId: string,
  newStage: RequestStatus,
  carrier: string,
  trackingNumber: string,
  location: string,
  actorName: string,
  notes?: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const existingShipment = current.shipment || {
    id: `SHP-${current.referenceNumber.replace("AH-P-", "")}`,
    carrier,
    trackingNumber,
    originPort: "Centrair Nagoya Terminal (Japan)",
    destinationPort: "Ports of Auckland / AKL Airport (NZ)",
    etd: now,
    eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    milestones: [],
  };

  const newMilestone = {
    id: `M-${Date.now()}`,
    stage: newStage.replace(/_/g, " "),
    status: newStage,
    timestamp: now,
    location,
    notes,
    carrierName: carrier,
    trackingReference: trackingNumber,
    completed: true,
  };

  const updated: PartRequest = {
    ...current,
    status: newStage,
    updatedDate: now,
    shipment: {
      ...existingShipment,
      carrier,
      trackingNumber,
      actualDeliveryDate: newStage === "DELIVERED" ? now : existingShipment.actualDeliveryDate,
      milestones: [...existingShipment.milestones, newMilestone],
    },
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Shipment update: Status changed to ${newStage.replace(/_/g, " ")}. Location: ${location}. Carrier: ${carrier} (Tracking: ${trackingNumber}).`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: `Logistics Milestone: ${newStage.replace(/_/g, " ")}`,
        previousState: current.status,
        newState: newStage,
        details: `Carrier: ${carrier}, Tracking: ${trackingNumber}, Location: ${location}. ${notes || ""}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Add message to request with sender details and optional attachments
export function addRequestMessage(
  requestId: string,
  senderId: string,
  senderName: string,
  senderRole: UserRole,
  content: string,
  isInternalOnly: boolean = false,
  attachments?: string[],
  isAiGenerated: boolean = false
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const newMessage: MessageItem = {
    id: `MSG-${Date.now()}`,
    senderId: senderId || (senderRole === "CUSTOMER" ? current.customerId : "STAFF"),
    senderName,
    senderRole,
    timestamp: now,
    content,
    isInternalOnly,
    isAiGenerated,
    attachments,
  };

  const updated: PartRequest = {
    ...current,
    messages: [...current.messages, newMessage],
    updatedDate: now,
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Add message to request thread
export function addMessageToRequest(
  requestId: string,
  content: string,
  senderName: string,
  senderRole: UserRole,
  isInternalOnly: boolean = false,
  isAiGenerated: boolean = false,
  attachments?: string[]
) {
  addRequestMessage(
    requestId,
    senderRole === "CUSTOMER" ? "" : "STAFF",
    senderName,
    senderRole,
    content,
    isInternalOnly,
    attachments,
    isAiGenerated
  );
}

// Approve pending trade customer account
export function approveCustomerAccount(customerId: string, creditLimitNzd: number = 25000) {
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return;

  customers[index] = {
    ...customers[index],
    billingDetails: {
      ...customers[index].billingDetails,
      status: "APPROVED",
      creditLimitNzd,
      creditAvailableNzd: creditLimitNzd,
      paymentTerms: "NET_20TH_MONTH",
    },
  };

  saveCustomers([...customers]);
}

// Reject Customer Quote
export function rejectCustomerQuote(requestId: string, reason: string, customerName: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    status: "CUSTOMER_REJECTED",
    updatedDate: now,
    quote: current.quote
      ? {
          ...current.quote,
          status: "REJECTED",
          customerFeedback: reason,
        }
      : undefined,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: current.customerId,
        senderName: customerName,
        senderRole: "CUSTOMER",
        timestamp: now,
        content: `Customer declined quotation. Reason: ${reason}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: customerName,
        actorRole: "CUSTOMER",
        action: "Quote Rejected",
        previousState: current.status,
        newState: "CUSTOMER_REJECTED",
        details: reason,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Request Quote Revision / More Info
export function requestQuoteRevision(requestId: string, notes: string, customerName: string) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const updated: PartRequest = {
    ...current,
    status: "SOURCING",
    updatedDate: now,
    quote: current.quote
      ? {
          ...current.quote,
          status: "REVISION_REQUESTED",
          customerFeedback: notes,
        }
      : undefined,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: current.customerId,
        senderName: customerName,
        senderRole: "CUSTOMER",
        timestamp: now,
        content: `Customer requested quotation revision: ${notes}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: customerName,
        actorRole: "CUSTOMER",
        action: "Revision Requested",
        previousState: current.status,
        newState: "SOURCING",
        details: notes,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Notifications management
export function getStoredNotifications(): CustomerNotification[] {
  if (!isBrowser()) return initialNotifications;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    return JSON.parse(raw);
  } catch {
    return initialNotifications;
  }
}

export function saveNotifications(notifs: CustomerNotification[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  notifyListeners();
}

export function markNotificationAsRead(id: string) {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
}

export function markAllNotificationsAsRead() {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
}

// Account Lockout & Security
interface LockoutData {
  failedAttempts: number;
  lockedUntil: number | null;
}

export function getLockoutStatus(): { isLocked: boolean; remainingMinutes: number; failedAttempts: number } {
  if (!isBrowser()) return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCKOUT);
    if (!raw) return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
    const data: LockoutData = JSON.parse(raw);
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      const remainingMs = data.lockedUntil - Date.now();
      return {
        isLocked: true,
        remainingMinutes: Math.ceil(remainingMs / 60000),
        failedAttempts: data.failedAttempts,
      };
    }
    return { isLocked: false, remainingMinutes: 0, failedAttempts: data.failedAttempts || 0 };
  } catch {
    return { isLocked: false, remainingMinutes: 0, failedAttempts: 0 };
  }
}

export function recordFailedLogin(): { isLocked: boolean; remainingMinutes: number; failedAttempts: number } {
  if (!isBrowser()) return { isLocked: false, remainingMinutes: 0, failedAttempts: 1 };
  try {
    const current = getLockoutStatus();
    const attempts = current.failedAttempts + 1;
    let lockedUntil: number | null = null;
    if (attempts >= 5) {
      lockedUntil = Date.now() + 15 * 60 * 1000; // 15 mins
    }
    const data: LockoutData = { failedAttempts: attempts, lockedUntil };
    localStorage.setItem(STORAGE_KEYS.LOCKOUT, JSON.stringify(data));
    return {
      isLocked: attempts >= 5,
      remainingMinutes: attempts >= 5 ? 15 : 0,
      failedAttempts: attempts,
    };
  } catch {
    return { isLocked: false, remainingMinutes: 0, failedAttempts: 1 };
  }
}

export function clearFailedLogins() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.LOCKOUT);
}

// Organization User Management
export function addOrganizationUser(user: Omit<CustomerOrgUser, "id" | "addedDate">) {
  const customers = getStoredCustomers();
  if (customers.length === 0) return;
  const customer = customers[0];
  const newUser: CustomerOrgUser = {
    ...user,
    id: `USR-${Date.now()}`,
    addedDate: new Date().toISOString().split("T")[0],
  };
  const updatedCustomer: TradeCustomer = {
    ...customer,
    organizationUsers: [...(customer.organizationUsers || []), newUser],
  };
  customers[0] = updatedCustomer;
  saveCustomers([...customers]);
}

export function removeOrganizationUser(userId: string) {
  const customers = getStoredCustomers();
  if (customers.length === 0) return;
  const customer = customers[0];
  const updatedUsers = (customer.organizationUsers || []).filter((u) => u.id !== userId);
  const updatedCustomer: TradeCustomer = {
    ...customer,
    organizationUsers: updatedUsers,
  };
  customers[0] = updatedCustomer;
  saveCustomers([...customers]);
}

export function updateCustomerProfile(profile: Partial<TradeCustomer>) {
  const customers = getStoredCustomers();
  if (customers.length === 0) return;
  const customer = customers[0];
  const updatedCustomer: TradeCustomer = {
    ...customer,
    ...profile,
  };
  customers[0] = updatedCustomer;
  saveCustomers([...customers]);
}

