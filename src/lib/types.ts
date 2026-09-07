export type RequestStatus =
  | "SUBMITTED"
  | "SOURCING"
  | "QUOTE_PREPARED"
  | "AWAITING_CUSTOMER_APPROVAL"
  | "AWAITING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "ORDERED_FROM_SUPPLIER"
  | "SUPPLIER_DISPATCHED"
  | "RECEIVED_AT_SHIPPING_FACILITY"
  | "IN_TRANSIT"
  | "ARRIVED_IN_NZ"
  | "CUSTOMS_CLEARANCE"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "SOURCING_EXCEPTION"
  | "LOGISTICS_EXCEPTION"
  | "PAYMENT_DISPUTED"
  | "CUSTOMER_REJECTED"
  | "CANCELLED"
  | "ON_HOLD";

export type UserRole =
  | "CUSTOMER"
  | "SOURCING_SPECIALIST"
  | "LOGISTICS_COORDINATOR"
  | "FINANCE_OFFICER"
  | "SYSTEM_ADMIN";

export type FreightMethod = "AIR_EXPRESS" | "SEA_FREIGHT";

export type PartCondition = "NEW_GENUINE" | "NEW_AFTERMARKET" | "RECONDITIONED_OEM" | "USED_TESTED";

export interface SupplierProfile {
  id: string;
  name: string;
  country: string;
  currency: string;
  exchangeRateToNzd: number;
  category: string;
  leadTimeDays: number;
  rating: number;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string; // Mandatory
  chassisNumber?: string;
  registrationPlate?: string; // e.g. NZ rego "NZZ482"
  engineCode?: string;
  variant?: string;
  transmission?: "AUTOMATIC" | "MANUAL" | "CVT" | "DCT";
  driveConfiguration?: "4WD" | "AWD" | "FWD" | "RWD";
}

export interface PartRequirement {
  partName: string;
  oemPartNumber?: string;
  quantity: number;
  genuinePreference: "GENUINE_ONLY" | "AFTERMARKET_ACCEPTABLE" | "ANY";
  conditionRequirement: PartCondition;
  category: string;
  weightEstKg?: number;
  descriptionNotes?: string;
  attachments?: {
    name: string;
    size: string;
    url: string;
    type: "photo" | "schematic" | "document";
  }[];
}

export interface SupplierQuotation {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierCountry: string; // e.g., Japan, Germany, USA, Australia
  partCostCurrency: string; // JPY, USD, EUR, AUD
  partCostForeign: number;
  exchangeRateToNzd: number;
  partCostNzd: number;
  domesticFreightForeign: number;
  domesticFreightNzd: number;
  availabilityDays: number;
  notes?: string;
  isRecommendedByAi?: boolean;
}

export interface FreightOption {
  method: FreightMethod;
  carrierName: string;
  estimatedTransitDays: string; // e.g. "3 - 5 business days"
  costNzd: number;
  co2Rating?: string;
  available: boolean;
  manualOverride?: boolean;
}

export interface CustomerQuote {
  id: string;
  quoteNumber: string; // e.g. "QTE-2026-00123"
  createdAt: string;
  expiresAt: string;
  selectedSupplierQuoteId: string;
  basePartCostNzd: number;
  targetMarginPercentage: number;
  marginAmountNzd: number;
  procurementFeeNzd: number;
  landedCostNzd: number; // base cost + domestic freight
  freightOptions: FreightOption[];
  selectedFreightMethod?: FreightMethod;
  subtotalNzd: number;
  gstAmountNzd: number; // 15% NZ GST
  totalNzd: number;
  termsAccepted: boolean;
  status: "DRAFT" | "ISSUED" | "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED";
  customerFeedback?: string;
}

export interface LogisticsMilestone {
  id: string;
  stage: string;
  status: RequestStatus;
  timestamp: string;
  location: string;
  notes?: string;
  carrierName?: string;
  trackingReference?: string;
  completed: boolean;
}

export interface ShipmentDetails {
  id: string;
  carrier: string;
  trackingNumber: string;
  originPort: string;
  destinationPort: string;
  vesselOrFlightNumber?: string;
  customsEntryNumber?: string;
  etd: string;
  eta: string;
  actualDeliveryDate?: string;
  podSignatureUrl?: string;
  milestones: LogisticsMilestone[];
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  timestamp: string;
  content: string;
  isInternalOnly: boolean; // Staff notes hidden from customer
  isAiGenerated?: boolean;
  attachments?: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  previousState?: string;
  newState?: string;
  details?: string;
}

export interface TaxInvoice {
  invoiceNumber: string; // e.g. "INV-2026-00842"
  receiptNumber?: string; // e.g. "REC-2026-00842"
  dateIssued: string;
  dueDate: string;
  paidDate?: string;
  customerName: string;
  customerNzbn: string;
  customerGstNumber: string;
  billingAddress: string;
  paymentMethod: "BANK_TRANSFER" | "TRADE_CREDIT";
  paymentReference: string; // e.g. "AH-P-000123"
  subtotalNzd: number;
  gstRate: number; // 0.15
  gstAmountNzd: number;
  totalNzd: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "REFUNDED";
}

export interface PartRequest {
  id: string;
  referenceNumber: string; // Format: AH-P-000123
  customerId: string;
  customerName: string;
  customerNzbn: string;
  customerContactEmail: string;
  deliveryAddress: {
    label: string;
    street: string;
    suburb: string;
    city: string;
    postcode: string;
    isDefault?: boolean;
  };
  submittedDate: string;
  updatedDate: string;
  status: RequestStatus;
  statusReason?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  vehicle: VehicleInfo;
  part: PartRequirement;
  supplierQuotes: SupplierQuotation[];
  quote?: CustomerQuote;
  shipment?: ShipmentDetails;
  invoice?: TaxInvoice;
  messages: MessageItem[];
  auditLogs: AuditLogEntry[];
}

export interface TradeCustomer {
  id: string;
  legalBusinessName: string;
  tradingName: string;
  nzbn: string;
  businessType: "FRANCHISED_DEALERSHIP" | "INDEPENDENT_DEALER" | "PANEL_BEATER" | "MECHANICAL_WORKSHOP" | "FLEET_OPERATOR";
  website?: string;
  branchesCount: number;
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  accountsContact: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddresses: {
    id: string;
    label: string;
    street: string;
    suburb: string;
    city: string;
    postcode: string;
    isDefault: boolean;
  }[];
  billingDetails: {
    address: string;
    gstNumber: string;
    creditRequested: boolean;
    creditLimitNzd: number;
    creditAvailableNzd: number;
    paymentTerms: "STRICT_PREPAYMENT" | "NET_20TH_MONTH" | "NET_30";
    status: "APPROVED" | "PENDING_APPROVAL" | "SUSPENDED";
  };
  compliance: {
    termsVersion: string;
    privacyPolicyConsentDate: string;
    nzPrivacyActAcknowledged: boolean;
  };
}

export interface SystemSettings {
  defaultMarginPercent: number; // e.g. 18%
  airFreightBaseRateNzd: number;
  seaFreightBaseRateNzd: number;
  gstRate: number; // 0.15
  requestRefPrefix: string; // "AH-P-"
  autoAssignRoleQueues: boolean;
  bankAccountDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string; // e.g. "12-3101-0495821-00"
    swiftBic: string;
  };
}
