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
  PaymentStatus,
  FinancialTransaction,
  ReconciliationRecord,
  RefundRecord,
  OfficialReceipt,
  CreditNote,
  TaxInvoice,
  ShipmentDetails,
  LogisticsMilestone,
} from "./types";
import {
  initialRequests,
  initialCustomers,
  initialSuppliers,
  initialSystemSettings,
  initialNotifications,
  initialTransactions,
  initialReconciliations,
  initialRefunds,
  initialCreditNotes,
} from "./mockData";

const STORAGE_KEYS = {
  REQUESTS: "autohub_procurly_requests_v2",
  CUSTOMERS: "autohub_procurly_customers_v2",
  SUPPLIERS: "autohub_procurly_suppliers_v2",
  SETTINGS: "autohub_procurly_settings_v2",
  ACTIVE_ROLE: "autohub_procurly_active_role_v2",
  NOTIFICATIONS: "autohub_procurly_notifications_v2",
  LOCKOUT: "autohub_procurly_lockout_v2",
  TRANSACTIONS: "autohub_procurly_transactions_v2",
  RECONCILIATIONS: "autohub_procurly_reconciliations_v2",
  REFUNDS: "autohub_procurly_refunds_v2",
  CREDIT_NOTES: "autohub_procurly_credit_notes_v2",
  INVOICE_SEQ: "autohub_procurly_inv_seq_v2",
  RECEIPT_SEQ: "autohub_procurly_rec_seq_v2",
  CREDIT_NOTE_SEQ: "autohub_procurly_cn_seq_v2",
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

// Create shipment record against an order
export function createShipmentRecord(
  requestId: string,
  shipmentData: {
    carrier: string;
    trackingNumber: string;
    originPort: string;
    destinationPort: string;
    vesselOrFlightNumber?: string;
    customsEntryNumber?: string;
    etd: string;
    eta: string;
    initialStage?: RequestStatus;
  },
  actorName: string
): PartRequest | undefined {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return undefined;

  const current = requests[index];
  const now = new Date().toISOString();
  const initialStage: RequestStatus = shipmentData.initialStage || "RECEIVED_AT_SHIPPING_FACILITY";

  const newShipment: ShipmentDetails = {
    id: `SHP-${current.referenceNumber.replace("AH-P-", "")}`,
    carrier: shipmentData.carrier,
    trackingNumber: shipmentData.trackingNumber,
    originPort: shipmentData.originPort,
    destinationPort: shipmentData.destinationPort,
    vesselOrFlightNumber: shipmentData.vesselOrFlightNumber,
    customsEntryNumber: shipmentData.customsEntryNumber,
    etd: shipmentData.etd,
    eta: shipmentData.eta,
    milestones: [
      {
        id: `M-${Date.now()}`,
        stage: initialStage.replace(/_/g, " "),
        status: initialStage,
        timestamp: now,
        location: shipmentData.originPort,
        notes: "Consignment manifest created and checked into export terminal facility.",
        carrierName: shipmentData.carrier,
        trackingReference: shipmentData.trackingNumber,
        completed: true,
      },
    ],
  };

  const updated: PartRequest = {
    ...current,
    status: initialStage,
    updatedDate: now,
    shipment: newShipment,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Shipment booking created with ${shipmentData.carrier}. Tracking: ${shipmentData.trackingNumber}. Origin: ${shipmentData.originPort} -> Destination: ${shipmentData.destinationPort}. Current Status: ${initialStage.replace(/_/g, " ")}.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: "Shipment Record Created",
        previousState: current.status,
        newState: initialStage,
        details: `Carrier: ${shipmentData.carrier} | Waybill: ${shipmentData.trackingNumber} | Flight/Vessel: ${shipmentData.vesselOrFlightNumber || "TBD"}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
  return updated;
}

// Update existing shipment details (carrier, tracking, ports, etc.)
export function updateShipmentDetails(
  requestId: string,
  updates: Partial<ShipmentDetails>,
  actorName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  if (!current.shipment) return;
  const now = new Date().toISOString();

  const updatedShipment: ShipmentDetails = {
    ...current.shipment,
    ...updates,
  };

  const updated: PartRequest = {
    ...current,
    updatedDate: now,
    shipment: updatedShipment,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Carrier & tracking details updated: ${updates.carrier || current.shipment.carrier} (Tracking: ${updates.trackingNumber || current.shipment.trackingNumber}).`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: "Shipment Details Updated",
        details: `Carrier: ${updates.carrier || current.shipment.carrier}, Tracking: ${updates.trackingNumber || current.shipment.trackingNumber}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Enable or disable a freight option per request
export function toggleFreightOptionAvailability(
  requestId: string,
  method: FreightMethod,
  available: boolean,
  reason: string,
  actorName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  if (!current.quote) return;
  const now = new Date().toISOString();

  const updatedFreightOptions = current.quote.freightOptions.map((opt) => {
    if (opt.method === method) {
      return {
        ...opt,
        available,
        disabledReason: available ? undefined : reason,
      };
    }
    return opt;
  });

  const updated: PartRequest = {
    ...current,
    updatedDate: now,
    quote: {
      ...current.quote,
      freightOptions: updatedFreightOptions,
    },
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: `Freight Option ${method} ${available ? "Enabled" : "Disabled"}`,
        details: `Status: ${available ? "Active" : "Disabled"}. Reason: ${reason}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Override freight calculation manually
export function overrideFreightOption(
  requestId: string,
  method: FreightMethod,
  costNzd: number,
  estimatedTransitDays: string,
  overrideReason: string,
  actorName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  if (!current.quote) return;
  const now = new Date().toISOString();

  const updatedFreightOptions = current.quote.freightOptions.map((opt) => {
    if (opt.method === method) {
      return {
        ...opt,
        costNzd,
        estimatedTransitDays,
        manualOverride: true,
        manualOverrideReason: overrideReason,
        available: true,
      };
    }
    return opt;
  });

  // If this method is selected or default, recalculate totals
  let newSubtotal = current.quote.subtotalNzd;
  let newGst = current.quote.gstAmountNzd;
  let newTotal = current.quote.totalNzd;

  if (current.quote.selectedFreightMethod === method || !current.quote.selectedFreightMethod) {
    newSubtotal = current.quote.basePartCostNzd + current.quote.marginAmountNzd + current.quote.procurementFeeNzd + costNzd;
    newGst = newSubtotal * 0.15;
    newTotal = newSubtotal + newGst;
  }

  const updatedQuote: CustomerQuote = {
    ...current.quote,
    freightOptions: updatedFreightOptions,
    subtotalNzd: newSubtotal,
    gstAmountNzd: newGst,
    totalNzd: newTotal,
  };

  const updated: PartRequest = {
    ...current,
    updatedDate: now,
    quote: updatedQuote,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Manual freight rate applied for ${method === "AIR_EXPRESS" ? "Air Express" : "Sea Freight"}: $${costNzd.toFixed(2)} NZD (${estimatedTransitDays}). Reason: ${overrideReason}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: `Freight Override Applied (${method})`,
        details: `Cost: $${costNzd.toFixed(2)} NZD | Transit: ${estimatedTransitDays} | Reason: ${overrideReason}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Delivery confirmation with POD docket and recipient details
export function confirmShipmentDelivery(
  requestId: string,
  deliveryDetails: {
    recipientName: string;
    podDocket?: string;
    podNotes?: string;
    actualDeliveryDate?: string;
  },
  actorName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();
  const deliveryDate = deliveryDetails.actualDeliveryDate || now;

  const existingShipment = current.shipment || {
    id: `SHP-${current.referenceNumber.replace("AH-P-", "")}`,
    carrier: "Autohub Local Express Fleet",
    trackingNumber: `POD-${Date.now().toString().slice(-6)}`,
    originPort: "Auckland Cargo Hub",
    destinationPort: `${current.deliveryAddress.city} Workshop`,
    etd: now,
    eta: now,
    milestones: [],
  };

  const deliveryMilestone: LogisticsMilestone = {
    id: `M-${Date.now()}`,
    stage: "Delivered",
    status: "DELIVERED",
    timestamp: deliveryDate,
    location: `${current.deliveryAddress.street}, ${current.deliveryAddress.suburb}, ${current.deliveryAddress.city}`,
    notes: `Official delivery confirmed. Received and signed by ${deliveryDetails.recipientName}. Docket: ${deliveryDetails.podDocket || "N/A"}. ${deliveryDetails.podNotes || ""}`,
    carrierName: existingShipment.carrier,
    trackingReference: existingShipment.trackingNumber,
    completed: true,
  };

  const updated: PartRequest = {
    ...current,
    status: "DELIVERED",
    updatedDate: now,
    shipment: {
      ...existingShipment,
      actualDeliveryDate: deliveryDate,
      podRecipientName: deliveryDetails.recipientName,
      podDocketNumber: deliveryDetails.podDocket,
      podNotes: deliveryDetails.podNotes,
      milestones: [...existingShipment.milestones, deliveryMilestone],
    },
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Consignment DELIVERED to ${current.deliveryAddress.label || current.deliveryAddress.city}. Signed by: ${deliveryDetails.recipientName}. Proof of Delivery docket: ${deliveryDetails.podDocket || "Verified by courier"}.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: "Consignment Delivered (POD Confirmed)",
        previousState: current.status,
        newState: "DELIVERED",
        details: `Recipient: ${deliveryDetails.recipientName} | Docket: ${deliveryDetails.podDocket || "N/A"} | Location: ${current.deliveryAddress.city}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Raise a logistics exception with reason and category
export function raiseLogisticsException(
  requestId: string,
  reason: string,
  category: string,
  actorName: string,
  customerNote?: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const existingShipment = current.shipment || {
    id: `SHP-${current.referenceNumber.replace("AH-P-", "")}`,
    carrier: "Autohub Logistics",
    trackingNumber: "N/A",
    originPort: "Origin Export Terminal",
    destinationPort: "Ports of Auckland",
    etd: now,
    eta: now,
    milestones: [],
  };

  const exceptionMilestone: LogisticsMilestone = {
    id: `M-${Date.now()}`,
    stage: "Logistics Exception Raised",
    status: "LOGISTICS_EXCEPTION",
    timestamp: now,
    location: existingShipment.originPort || "Transit Corridor",
    notes: `[${category}] ${reason}`,
    completed: false,
  };

  const updated: PartRequest = {
    ...current,
    status: "LOGISTICS_EXCEPTION",
    statusReason: `[${category}] ${reason}`,
    updatedDate: now,
    shipment: {
      ...existingShipment,
      exceptionReason: reason,
      exceptionCategory: category,
      milestones: [...existingShipment.milestones, exceptionMilestone],
    },
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Logistics Exception: ${category}. Reason: ${reason}. ${customerNote ? `Customer update: ${customerNote}` : "Our operations team is actively addressing the hold with the carrier."}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: `Logistics Exception Raised: ${category}`,
        previousState: current.status,
        newState: "LOGISTICS_EXCEPTION",
        details: reason,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Resolve logistics exception and return to active stage
export function resolveLogisticsException(
  requestId: string,
  targetStage: RequestStatus,
  resolutionNotes: string,
  actorName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  const existingShipment = current.shipment;

  const resolveMilestone: LogisticsMilestone = {
    id: `M-${Date.now()}`,
    stage: `Exception Cleared -> ${targetStage.replace(/_/g, " ")}`,
    status: targetStage,
    timestamp: now,
    location: existingShipment?.destinationPort || "Auckland Terminal",
    notes: `Logistics exception resolved: ${resolutionNotes}`,
    completed: true,
  };

  const updated: PartRequest = {
    ...current,
    status: targetStage,
    statusReason: undefined,
    updatedDate: now,
    shipment: existingShipment
      ? {
          ...existingShipment,
          exceptionReason: undefined,
          exceptionCategory: undefined,
          milestones: [...existingShipment.milestones, resolveMilestone],
        }
      : undefined,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "LOGISTICS-TEAM",
        senderName: actorName,
        senderRole: "LOGISTICS_COORDINATOR",
        timestamp: now,
        content: `Logistics exception resolved. Consignment resumed at ${targetStage.replace(/_/g, " ")}. Resolution notes: ${resolutionNotes}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName,
        actorRole: "LOGISTICS_COORDINATOR",
        action: "Logistics Exception Resolved",
        previousState: "LOGISTICS_EXCEPTION",
        newState: targetStage,
        details: resolutionNotes,
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

// ==========================================
// FINANCE (BILLING & CREDIT) STORE METHODS
// ==========================================

// Sequential numbering helpers
export function getNextInvoiceNumber(): string {
  if (!isBrowser()) return `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICE_SEQ);
    let seq = raw ? parseInt(raw, 10) : 892;
    seq += 1;
    localStorage.setItem(STORAGE_KEYS.INVOICE_SEQ, seq.toString());
    return `INV-2026-${seq.toString().padStart(5, "0")}`;
  } catch {
    return `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  }
}

export function getNextReceiptNumber(): string {
  if (!isBrowser()) return `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECEIPT_SEQ);
    let seq = raw ? parseInt(raw, 10) : 892;
    seq += 1;
    localStorage.setItem(STORAGE_KEYS.RECEIPT_SEQ, seq.toString());
    return `REC-2026-${seq.toString().padStart(5, "0")}`;
  } catch {
    return `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  }
}

export function getNextCreditNoteNumber(): string {
  if (!isBrowser()) return `CN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREDIT_NOTE_SEQ);
    let seq = raw ? parseInt(raw, 10) : 16;
    seq += 1;
    localStorage.setItem(STORAGE_KEYS.CREDIT_NOTE_SEQ, seq.toString());
    return `CN-2026-${seq.toString().padStart(5, "0")}`;
  } catch {
    return `CN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  }
}

// Transactions Register
export function getStoredTransactions(): FinancialTransaction[] {
  if (!isBrowser()) return initialTransactions;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
      return initialTransactions;
    }
    return JSON.parse(raw);
  } catch {
    return initialTransactions;
  }
}

export function saveTransactions(transactions: FinancialTransaction[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  notifyListeners();
}

export function addFinancialTransaction(
  txn: Omit<FinancialTransaction, "id" | "timestamp">
): FinancialTransaction {
  const transactions = getStoredTransactions();
  const newTxn: FinancialTransaction = {
    ...txn,
    id: `TXN-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date().toISOString(),
  };
  saveTransactions([newTxn, ...transactions]);
  return newTxn;
}

// Reconciliations
export function getStoredReconciliations(): ReconciliationRecord[] {
  if (!isBrowser()) return initialReconciliations;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECONCILIATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RECONCILIATIONS, JSON.stringify(initialReconciliations));
      return initialReconciliations;
    }
    return JSON.parse(raw);
  } catch {
    return initialReconciliations;
  }
}

export function saveReconciliations(records: ReconciliationRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.RECONCILIATIONS, JSON.stringify(records));
  notifyListeners();
}

export function reconcilePaymentRecord(
  recordId: string,
  officerName: string,
  notes?: string
) {
  const records = getStoredReconciliations();
  const idx = records.findIndex((r) => r.id === recordId);
  if (idx === -1) return;

  const current = records[idx];
  records[idx] = {
    ...current,
    status: "MATCHED",
    varianceNzd: 0,
    notes: notes || `Reconciled & cleared by ${officerName}`,
    reconciledDate: new Date().toISOString(),
    reconciledBy: officerName,
  };
  saveReconciliations([...records]);
}

export function autoMatchReconciliations(officerName: string): number {
  const records = getStoredReconciliations();
  const requests = getStoredRequests();
  let matchedCount = 0;
  const now = new Date().toISOString();

  const updated = records.map((rec) => {
    if (rec.status === "MATCHED") return rec;
    // Check if expected matches request
    if (rec.requestReference) {
      const req = requests.find((r) => r.referenceNumber === rec.requestReference);
      if (req && req.invoice && req.invoice.status === "PAID") {
        matchedCount++;
        return {
          ...rec,
          status: "MATCHED" as const,
          varianceNzd: 0,
          notes: "Auto-reconciled with confirmed paid invoice",
          reconciledDate: now,
          reconciledBy: officerName,
        };
      }
    }
    return rec;
  });

  saveReconciliations(updated);
  return matchedCount;
}

// Refunds & Credit Notes
export function getStoredRefunds(): RefundRecord[] {
  if (!isBrowser()) return initialRefunds;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFUNDS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REFUNDS, JSON.stringify(initialRefunds));
      return initialRefunds;
    }
    return JSON.parse(raw);
  } catch {
    return initialRefunds;
  }
}

export function saveRefunds(refunds: RefundRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.REFUNDS, JSON.stringify(refunds));
  notifyListeners();
}

export function getStoredCreditNotes(): CreditNote[] {
  if (!isBrowser()) return initialCreditNotes;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREDIT_NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(initialCreditNotes));
      return initialCreditNotes;
    }
    return JSON.parse(raw);
  } catch {
    return initialCreditNotes;
  }
}

export function saveCreditNotes(notes: CreditNote[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.CREDIT_NOTES, JSON.stringify(notes));
  notifyListeners();
}

// Record Manual Payment against request (Bank Transfer Confirmation)
export function recordManualPayment(
  requestId: string,
  paymentMethod: "BANK_TRANSFER" | "TRADE_CREDIT",
  amountReceived: number,
  bankRef: string,
  officerName: string,
  notes?: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const totalDue = current.invoice?.totalNzd || current.quote?.totalNzd || amountReceived;
  const now = new Date().toISOString();
  const receiptNum = getNextReceiptNumber();
  const isFullPayment = amountReceived >= totalDue;
  const newStatus: PaymentStatus = isFullPayment ? "PAID" : "PARTIALLY_PAID";

  const updatedInvoice: TaxInvoice = current.invoice
    ? {
        ...current.invoice,
        receiptNumber: receiptNum,
        paymentMethod,
        paymentReference: bankRef || current.referenceNumber,
        paidDate: now,
        partiallyPaidAmountNzd: amountReceived,
        status: newStatus,
        statusNotes: notes,
      }
    : {
        invoiceNumber: getNextInvoiceNumber(),
        receiptNumber: receiptNum,
        dateIssued: now,
        dueDate: now,
        paidDate: now,
        customerName: current.customerName,
        customerNzbn: current.customerNzbn,
        customerGstNumber: "128-492-381",
        billingAddress: `${current.deliveryAddress.street}, ${current.deliveryAddress.city}`,
        paymentMethod,
        paymentReference: bankRef || current.referenceNumber,
        subtotalNzd: totalDue / 1.15,
        gstRate: 0.15,
        gstAmountNzd: totalDue - totalDue / 1.15,
        totalNzd: totalDue,
        partiallyPaidAmountNzd: amountReceived,
        status: newStatus,
        statusNotes: notes,
      };

  const updated: PartRequest = {
    ...current,
    status: isFullPayment ? "PAYMENT_CONFIRMED" : current.status,
    invoice: updatedInvoice,
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "FINANCE-TEAM",
        senderName: officerName,
        senderRole: "FINANCE_OFFICER",
        timestamp: now,
        content: `Payment of $${amountReceived.toFixed(2)} NZD recorded via ${paymentMethod.replace(/_/g, " ")}. Bank ref: ${bankRef}. Official Receipt ${receiptNum} issued. ${isFullPayment ? "Procurement gate released to operations." : "Partial balance received."}`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: officerName,
        actorRole: "FINANCE_OFFICER",
        action: "Manual Payment Confirmed",
        previousState: current.status,
        newState: isFullPayment ? "PAYMENT_CONFIRMED" : current.status,
        details: `Recorded remittance of $${amountReceived.toFixed(2)} NZD (${newStatus}). Bank ref: ${bankRef}. ${notes || ""}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);

  // Record in general ledger
  addFinancialTransaction({
    type: "PAYMENT_RECEIVED",
    referenceNumber: current.referenceNumber,
    invoiceNumber: updatedInvoice.invoiceNumber,
    receiptNumber: receiptNum,
    customerName: current.customerName,
    customerNzbn: current.customerNzbn,
    amountNzd: amountReceived,
    paymentMethod,
    direction: "INFLOW",
    officerName,
    status: "SETTLED",
    notes: `Manual bank transfer confirmed: ${bankRef}. ${notes || ""}`,
  });

  // Record in reconciliation
  const reconciliations = getStoredReconciliations();
  const newRecon: ReconciliationRecord = {
    id: `REC-${Date.now()}`,
    bankDate: now.split("T")[0],
    bankReference: bankRef || `ANZ-TRF-${Math.floor(100000 + Math.random() * 900000)}`,
    payerName: current.customerName,
    bankAccount: "06-0801-0498210-00",
    receivedAmountNzd: amountReceived,
    invoiceNumber: updatedInvoice.invoiceNumber,
    requestReference: current.referenceNumber,
    expectedAmountNzd: totalDue,
    varianceNzd: amountReceived - totalDue,
    status: isFullPayment ? "MATCHED" : "VARIANCE",
    notes: `Direct bank remittance reconciled with ${updatedInvoice.invoiceNumber}`,
    reconciledDate: now,
    reconciledBy: officerName,
  };
  saveReconciliations([newRecon, ...reconciliations]);
}

// Update payment status across all 6 statuses
export function updatePaymentStatus(
  requestId: string,
  newStatus: PaymentStatus,
  reason: string,
  officerName: string
) {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return;

  const current = requests[index];
  const now = new Date().toISOString();

  let reqStatus: RequestStatus = current.status;
  if (newStatus === "PAID") reqStatus = "PAYMENT_CONFIRMED";
  if (newStatus === "PENDING") reqStatus = "AWAITING_PAYMENT";
  if (newStatus === "DISPUTED") reqStatus = "PAYMENT_DISPUTED";

  const updatedInvoice: TaxInvoice = current.invoice
    ? {
        ...current.invoice,
        status: newStatus,
        statusNotes: reason,
        paidDate: newStatus === "PAID" ? now : current.invoice.paidDate,
      }
    : {
        invoiceNumber: getNextInvoiceNumber(),
        dateIssued: now,
        dueDate: now,
        customerName: current.customerName,
        customerNzbn: current.customerNzbn,
        customerGstNumber: "128-492-381",
        billingAddress: `${current.deliveryAddress.street}, ${current.deliveryAddress.city}`,
        paymentMethod: "BANK_TRANSFER",
        paymentReference: current.referenceNumber,
        subtotalNzd: 400.0,
        gstRate: 0.15,
        gstAmountNzd: 60.0,
        totalNzd: 460.0,
        status: newStatus,
        statusNotes: reason,
      };

  const updated: PartRequest = {
    ...current,
    status: reqStatus,
    invoice: updatedInvoice,
    updatedDate: now,
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: officerName,
        actorRole: "FINANCE_OFFICER",
        action: `Payment Status Changed to ${newStatus}`,
        previousState: current.invoice?.status || "UNKNOWN",
        newState: newStatus,
        details: reason,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);
}

// Validate trade credit and release order
export function validateAndReleaseCreditOrder(
  requestId: string,
  officerName: string,
  overrideReason?: string
): { success: boolean; message: string } {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return { success: false, message: "Request not found" };

  const current = requests[index];
  const customers = getStoredCustomers();
  const custIdx = customers.findIndex((c) => c.id === current.customerId);
  const customer = custIdx !== -1 ? customers[custIdx] : null;

  const totalDue = current.invoice?.totalNzd || current.quote?.totalNzd || 0;

  // Validation rules
  if (!overrideReason && customer) {
    if (customer.billingDetails.status !== "APPROVED") {
      return {
        success: false,
        message: `Customer credit facility is ${customer.billingDetails.status}. Managerial override required.`,
      };
    }
    if (customer.billingDetails.creditAvailableNzd < totalDue) {
      return {
        success: false,
        message: `Order total ($${totalDue.toFixed(2)}) exceeds customer available credit line ($${customer.billingDetails.creditAvailableNzd.toFixed(2)}). Managerial override required.`,
      };
    }
  }

  // Deduct customer credit
  if (customer) {
    const newAvail = Math.max(0, customer.billingDetails.creditAvailableNzd - totalDue);
    customers[custIdx] = {
      ...customer,
      billingDetails: {
        ...customer.billingDetails,
        creditAvailableNzd: newAvail,
      },
    };
    saveCustomers([...customers]);
  }

  const now = new Date().toISOString();
  const receiptNum = getNextReceiptNumber();

  const updatedInvoice: TaxInvoice = current.invoice
    ? {
        ...current.invoice,
        paymentMethod: "TRADE_CREDIT",
        receiptNumber: receiptNum,
        paidDate: now,
        status: "PAID",
        statusNotes: overrideReason ? `Managerial override: ${overrideReason}` : "Trade credit validated",
      }
    : {
        invoiceNumber: getNextInvoiceNumber(),
        receiptNumber: receiptNum,
        dateIssued: now,
        dueDate: now,
        paidDate: now,
        customerName: current.customerName,
        customerNzbn: current.customerNzbn,
        customerGstNumber: "128-492-381",
        billingAddress: `${current.deliveryAddress.street}, ${current.deliveryAddress.city}`,
        paymentMethod: "TRADE_CREDIT",
        paymentReference: current.referenceNumber,
        subtotalNzd: totalDue / 1.15,
        gstRate: 0.15,
        gstAmountNzd: totalDue - totalDue / 1.15,
        totalNzd: totalDue,
        status: "PAID",
      };

  const updated: PartRequest = {
    ...current,
    status: "PAYMENT_CONFIRMED",
    invoice: updatedInvoice,
    updatedDate: now,
    messages: [
      ...current.messages,
      {
        id: `MSG-${Date.now()}`,
        senderId: "FINANCE-TEAM",
        senderName: officerName,
        senderRole: "FINANCE_OFFICER",
        timestamp: now,
        content: `Trade credit release validated for $${totalDue.toFixed(2)} NZD. ${overrideReason ? `Approved via managerial override: ${overrideReason}.` : "Charged against Net 20th Month credit facility."} Procurement PO unlocked.`,
        isInternalOnly: false,
      },
    ],
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: officerName,
        actorRole: "FINANCE_OFFICER",
        action: "Credit Validation & Order Release",
        previousState: current.status,
        newState: "PAYMENT_CONFIRMED",
        details: `Trade credit authorized: $${totalDue.toFixed(2)} NZD. ${overrideReason ? `Override reason: ${overrideReason}` : "Automatic credit line check passed."}`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);

  // Record in transaction ledger
  addFinancialTransaction({
    type: "TRADE_CREDIT_UTILIZED",
    referenceNumber: current.referenceNumber,
    invoiceNumber: updatedInvoice.invoiceNumber,
    receiptNumber: receiptNum,
    customerName: current.customerName,
    customerNzbn: current.customerNzbn,
    amountNzd: totalDue,
    paymentMethod: "TRADE_CREDIT",
    direction: "INFLOW",
    officerName,
    status: "SETTLED",
    notes: `Trade credit release authorized. ${overrideReason || "Standard facility execution"}`,
  });

  return {
    success: true,
    message: `Trade credit validated for ${current.referenceNumber}! Order released to sourcing desk.`,
  };
}

// Process refund and issue credit note
export function processRefund(
  requestId: string,
  amount: number,
  refundType: "FULL" | "PARTIAL" | "FREIGHT_CREDIT" | "GOODWILL",
  reason: string,
  method: "BANK_DIRECT_CREDIT" | "TRADE_CREDIT_BALANCE",
  officerName: string,
  notes?: string
): RefundRecord {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  const current = index !== -1 ? requests[index] : null;

  const now = new Date().toISOString();
  const creditNoteNum = getNextCreditNoteNumber();
  const customerName = current?.customerName || "Trade Customer";
  const customerNzbn = current?.customerNzbn || "9429041234567";
  const refNum = current?.referenceNumber || `AH-P-000${Math.floor(100 + Math.random() * 900)}`;
  const invNum = current?.invoice?.invoiceNumber || `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const refundRecord: RefundRecord = {
    id: `REF-${Date.now()}`,
    creditNoteNumber: creditNoteNum,
    requestId,
    requestReference: refNum,
    customerName,
    customerNzbn,
    invoiceNumber: invNum,
    amountNzd: amount,
    refundType,
    reason,
    refundMethod: method,
    bankReference: method === "BANK_DIRECT_CREDIT" ? `ANZ-REF-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
    officerName,
    timestamp: now,
    status: "COMPLETED",
    notes,
  };

  const refunds = getStoredRefunds();
  saveRefunds([refundRecord, ...refunds]);

  // Generate credit note document
  const creditNotes = getStoredCreditNotes();
  const newCreditNote: CreditNote = {
    creditNoteNumber: creditNoteNum,
    invoiceNumber: invNum,
    requestReference: refNum,
    dateIssued: now,
    customerName,
    customerNzbn,
    customerGstNumber: "128-492-381",
    billingAddress: current ? `${current.deliveryAddress.street}, ${current.deliveryAddress.city}` : "Auckland, New Zealand",
    originalInvoiceTotalNzd: current?.invoice?.totalNzd || amount,
    creditAmountNzd: amount,
    refundMethod: method,
    reason,
    officerName,
  };
  saveCreditNotes([newCreditNote, ...creditNotes]);

  // If trade credit balance, restore credit available
  if (method === "TRADE_CREDIT_BALANCE" && current) {
    const customers = getStoredCustomers();
    const custIdx = customers.findIndex((c) => c.id === current.customerId);
    if (custIdx !== -1) {
      const cust = customers[custIdx];
      customers[custIdx] = {
        ...cust,
        billingDetails: {
          ...cust.billingDetails,
          creditAvailableNzd: Math.min(
            cust.billingDetails.creditLimitNzd,
            cust.billingDetails.creditAvailableNzd + amount
          ),
        },
      };
      saveCustomers([...customers]);
    }
  }

  // Update request if found
  if (current && index !== -1) {
    const isFullRefund = refundType === "FULL" || amount >= (current.invoice?.totalNzd || 0);
    const updated: PartRequest = {
      ...current,
      status: isFullRefund ? "CANCELLED" : current.status,
      invoice: current.invoice
        ? {
            ...current.invoice,
            creditNoteNumber: creditNoteNum,
            status: isFullRefund ? "REFUNDED" : current.invoice.status,
            statusNotes: `Refund of $${amount.toFixed(2)} NZD processed (${creditNoteNum}): ${reason}`,
          }
        : undefined,
      updatedDate: now,
      messages: [
        ...current.messages,
        {
          id: `MSG-${Date.now()}`,
          senderId: "FINANCE-TEAM",
          senderName: officerName,
          senderRole: "FINANCE_OFFICER",
          timestamp: now,
          content: `Refund of $${amount.toFixed(2)} NZD processed via ${method.replace(/_/g, " ")}. Credit Note ${creditNoteNum} issued. Reason: ${reason}.`,
          isInternalOnly: false,
        },
      ],
      auditLogs: [
        {
          id: `AUD-${Date.now()}`,
          timestamp: now,
          actorName: officerName,
          actorRole: "FINANCE_OFFICER",
          action: "Refund Processed & Credit Note Issued",
          previousState: current.invoice?.status || "PAID",
          newState: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
          details: `Amount: $${amount.toFixed(2)} NZD (${method}). Credit Note: ${creditNoteNum}. Reason: ${reason}`,
        },
        ...current.auditLogs,
      ],
    };
    requests[index] = updated;
    saveRequests([...requests]);
  }

  // Record in ledger
  addFinancialTransaction({
    type: "REFUND_PROCESSED",
    referenceNumber: refNum,
    invoiceNumber: invNum,
    creditNoteNumber: creditNoteNum,
    customerName,
    customerNzbn,
    amountNzd: amount,
    paymentMethod: method === "BANK_DIRECT_CREDIT" ? "BANK_TRANSFER" : "TRADE_CREDIT",
    direction: "OUTFLOW",
    officerName,
    status: "SETTLED",
    notes: `Refund processed: ${reason}. Credit Note: ${creditNoteNum}`,
  });

  return refundRecord;
}

// Generate Tax Invoice for approved request
export function generateTaxInvoiceForRequest(requestId: string, officerName: string): TaxInvoice | null {
  const requests = getStoredRequests();
  const index = requests.findIndex((r) => r.id === requestId);
  if (index === -1) return null;

  const current = requests[index];
  const now = new Date().toISOString();
  const invNum = getNextInvoiceNumber();
  const subtotal = current.quote?.subtotalNzd || 450.0;
  const gst = current.quote?.gstAmountNzd || subtotal * 0.15;
  const total = current.quote?.totalNzd || subtotal + gst;

  const invoice: TaxInvoice = {
    invoiceNumber: invNum,
    dateIssued: now,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: current.customerName,
    customerNzbn: current.customerNzbn,
    customerGstNumber: "128-492-381",
    billingAddress: `${current.deliveryAddress.street}, ${current.deliveryAddress.city}`,
    paymentMethod: "BANK_TRANSFER",
    paymentReference: current.referenceNumber,
    subtotalNzd: subtotal,
    gstRate: 0.15,
    gstAmountNzd: gst,
    totalNzd: total,
    status: "PENDING",
  };

  const updated: PartRequest = {
    ...current,
    status: current.status === "AWAITING_CUSTOMER_APPROVAL" ? "AWAITING_PAYMENT" : current.status,
    invoice,
    updatedDate: now,
    auditLogs: [
      {
        id: `AUD-${Date.now()}`,
        timestamp: now,
        actorName: officerName,
        actorRole: "FINANCE_OFFICER",
        action: "Tax Invoice Generated",
        details: `Sequential invoice ${invNum} generated for $${total.toFixed(2)} NZD`,
      },
      ...current.auditLogs,
    ],
  };

  requests[index] = updated;
  saveRequests([...requests]);

  addFinancialTransaction({
    type: "INVOICE_ISSUED",
    referenceNumber: current.referenceNumber,
    invoiceNumber: invNum,
    customerName: current.customerName,
    customerNzbn: current.customerNzbn,
    amountNzd: total,
    paymentMethod: "BANK_TRANSFER",
    direction: "NEUTRAL",
    officerName,
    status: "SETTLED",
    notes: `Sequential Tax Invoice ${invNum} generated`,
  });

  return invoice;
}

// Update Trade Customer Credit Facility
export function updateCustomerCreditFacility(
  customerId: string,
  updates: {
    creditLimitNzd?: number;
    status?: "APPROVED" | "PENDING_APPROVAL" | "SUSPENDED";
    paymentTerms?: "STRICT_PREPAYMENT" | "NET_20TH_MONTH" | "NET_30";
  },
  officerName: string
) {
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === customerId);
  if (index === -1) return;

  const current = customers[index];
  const oldLimit = current.billingDetails.creditLimitNzd;
  const newLimit = updates.creditLimitNzd !== undefined ? updates.creditLimitNzd : oldLimit;
  const utilized = Math.max(0, oldLimit - current.billingDetails.creditAvailableNzd);
  const newAvailable = Math.max(0, newLimit - utilized);

  const updated: TradeCustomer = {
    ...current,
    billingDetails: {
      ...current.billingDetails,
      creditLimitNzd: newLimit,
      creditAvailableNzd: newAvailable,
      status: updates.status !== undefined ? updates.status : current.billingDetails.status,
      paymentTerms: updates.paymentTerms !== undefined ? updates.paymentTerms : current.billingDetails.paymentTerms,
    },
  };

  customers[index] = updated;
  saveCustomers([...customers]);

  // Log transaction
  if (updates.creditLimitNzd !== undefined && updates.creditLimitNzd !== oldLimit) {
    addFinancialTransaction({
      type: "CREDIT_ADJUSTMENT",
      referenceNumber: `CR-FAC-${current.id}`,
      customerName: current.tradingName || current.legalBusinessName,
      customerNzbn: current.nzbn,
      amountNzd: Math.abs(newLimit - oldLimit),
      paymentMethod: "CREDIT_ADJUSTMENT",
      direction: "NEUTRAL",
      officerName,
      status: "SETTLED",
      notes: `Credit facility limit adjusted from $${oldLimit.toLocaleString()} to $${newLimit.toLocaleString()} NZD (${updates.status || current.billingDetails.status})`,
    });
  }
}


