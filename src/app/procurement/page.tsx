"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Building2,
  CheckSquare,
  Truck,
  Calculator,
  AlertTriangle,
  Search,
  Plus,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  Anchor,
  X,
  ExternalLink,
  Edit3,
  ShieldAlert,
  FileText,
  Boxes,
  HelpCircle,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Tag,
  Star,
  Layers,
  Send,
  Calendar,
  User,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSuppliers,
  addSupplierQuote,
  issueCustomerQuote,
  reissueCustomerQuote,
  markOrderedFromSupplier,
  updateRequestStatus,
  resolveSourcingException,
  addSupplierProfile,
  subscribeToStore,
} from "@/lib/store";
import {
  PartRequest,
  SupplierQuotation,
  CustomerQuote,
  FreightOption,
  SupplierProfile,
  FreightMethod,
} from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AIQuoteModal } from "@/components/AIQuoteModal";

export type ActiveTab = "queue" | "suppliers" | "orders" | "tracking" | "exceptions";

export function ProcurementDashboardContent({ defaultTab }: { defaultTab?: ActiveTab }) {
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab") as ActiveTab | null;
  const initialReqParam = searchParams.get("req");

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (defaultTab) return defaultTab;
    if (initialTabParam && ["queue", "suppliers", "orders", "tracking", "exceptions"].includes(initialTabParam)) {
      return initialTabParam;
    }
    return "queue";
  });

  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(getStoredSuppliers);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);

  // Search & Filter States
  const [queueSearch, setQueueSearch] = useState("");
  const [queueFilter, setQueueFilter] = useState<"ALL" | "SOURCING" | "SUBMITTED" | "EXCEPTION">("ALL");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierCountryFilter, setSupplierCountryFilter] = useState("ALL");

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAddSupplierQuote, setShowAddSupplierQuote] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showPoModal, setShowPoModal] = useState(false);
  const [poTargetReq, setPoTargetReq] = useState<PartRequest | null>(null);

  // Manual Supplier Quote Capture Form
  const [quoteSupplierId, setQuoteSupplierId] = useState("SUP-01");
  const [foreignCost, setForeignCost] = useState<number>(45000);
  const [foreignFreight, setForeignFreight] = useState<number>(3500);
  const [quoteAvailabilityDays, setQuoteAvailabilityDays] = useState<number>(2);
  const [quoteNotes, setQuoteNotes] = useState("Direct from supplier hub inventory");

  // Quote Builder & Margin Calculator State
  const [selectedSupplierQuoteId, setSelectedSupplierQuoteId] = useState<string>("");
  const [targetMargin, setTargetMargin] = useState<number>(18.0);
  const [procurementFee, setProcurementFee] = useState<number>(60.0);
  const [airFreightCost, setAirFreightCost] = useState<number>(185.0);
  const [seaFreightCost, setSeaFreightCost] = useState<number>(65.0);
  const [selectedFreightOption, setSelectedFreightOption] = useState<FreightMethod>("AIR_EXPRESS");
  const [sourcingNotesToCustomer, setSourcingNotesToCustomer] = useState(
    "Genuine OEM specification part sourced directly from Japan authorized dealer network."
  );

  // Revision Form State
  const [revisionNotes, setRevisionNotes] = useState("");

  // Exception Form State
  const [exceptionCategory, setExceptionCategory] = useState("Factory Discontinued");
  const [exceptionReason, setExceptionReason] = useState("");

  // Add Supplier Form State
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierCountry, setNewSupplierCountry] = useState("Japan");
  const [newSupplierCurrency, setNewSupplierCurrency] = useState("JPY");
  const [newSupplierFxRate, setNewSupplierFxRate] = useState<number>(0.0108);
  const [newSupplierCategory, setNewSupplierCategory] = useState("Japanese OEM Genuine");
  const [newSupplierLeadDays, setNewSupplierLeadDays] = useState<number>(3);
  const [newSupplierPerson, setNewSupplierPerson] = useState("");
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [newSupplierPhone, setNewSupplierPhone] = useState("");

  // PO Placement State
  const [poNumberInput, setPoNumberInput] = useState("");
  const [poDispatchBay, setPoDispatchBay] = useState("Centrair Export Terminal Nagoya");
  const [poNotes, setPoNotes] = useState("Priority packaging and air waybill dispatch");

  // Load store data
  useEffect(() => {
    const loadedRequests = getStoredRequests();
    setRequests(loadedRequests);
    setSuppliers(getStoredSuppliers());

    if (initialReqParam) {
      const match = loadedRequests.find((r) => r.id === initialReqParam || r.referenceNumber === initialReqParam);
      if (match) setSelectedRequest(match);
    }

    const unsub = subscribeToStore(() => {
      const reqs = getStoredRequests();
      setRequests(reqs);
      setSuppliers(getStoredSuppliers());
      if (selectedRequest) {
        const refreshed = reqs.find((r) => r.id === selectedRequest.id);
        if (refreshed) setSelectedRequest(refreshed);
      }
    });
    return unsub;
  }, [initialReqParam]);

  // Derived Queues
  const sourcingQueue = requests.filter(
    (r) => r.status === "SOURCING" || r.status === "SUBMITTED"
  );
  const quotesIssuedQueue = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  );
  const poGateQueue = requests.filter(
    (r) => r.status === "PAYMENT_CONFIRMED"
  );
  const orderedQueue = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE"
  );
  const exceptionsQueue = requests.filter(
    (r) => r.status === "SOURCING_EXCEPTION"
  );

  // Active Selected Request in Queue Tab
  const activeReq = selectedRequest || sourcingQueue[0] || requests[0];

  // Set default winning supplier quote when active request changes
  useEffect(() => {
    if (activeReq?.supplierQuotes && activeReq.supplierQuotes.length > 0) {
      const rec = activeReq.supplierQuotes.find((sq) => sq.isRecommendedByAi) || activeReq.supplierQuotes[0];
      setSelectedSupplierQuoteId(rec.id);
    } else {
      setSelectedSupplierQuoteId("");
    }
  }, [activeReq?.id]);

  // Calculations for Active Request & Selected Supplier Quote
  const winningQuote = activeReq?.supplierQuotes?.find((sq) => sq.id === selectedSupplierQuoteId) || activeReq?.supplierQuotes?.[0];
  const baseCostNzd = winningQuote ? winningQuote.partCostNzd : 0;
  const domesticFreightNzd = winningQuote ? winningQuote.domesticFreightNzd : 0;
  const landedCostNzd = parseFloat((baseCostNzd + domesticFreightNzd).toFixed(2));
  const calculatedMarginAmount = parseFloat((landedCostNzd * (targetMargin / 100)).toFixed(2));
  const currentFreightCost = selectedFreightOption === "AIR_EXPRESS" ? airFreightCost : seaFreightCost;
  const calculatedSubtotal = parseFloat((landedCostNzd + calculatedMarginAmount + procurementFee + currentFreightCost).toFixed(2));
  const calculatedGst = parseFloat((calculatedSubtotal * 0.15).toFixed(2));
  const calculatedTotal = parseFloat((calculatedSubtotal + calculatedGst).toFixed(2));

  // Handle Capture Manual Supplier Quote
  const handleSaveSupplierQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    const sup = suppliers.find((s) => s.id === quoteSupplierId) || suppliers[0];
    const partNzd = parseFloat((foreignCost * sup.exchangeRateToNzd).toFixed(2));
    const freightNzd = parseFloat((foreignFreight * sup.exchangeRateToNzd).toFixed(2));

    const newSq: SupplierQuotation = {
      id: `SQ-${Date.now()}`,
      supplierId: sup.id,
      supplierName: sup.name,
      supplierCountry: sup.country,
      partCostCurrency: sup.currency,
      partCostForeign: foreignCost,
      exchangeRateToNzd: sup.exchangeRateToNzd,
      partCostNzd: partNzd,
      domesticFreightForeign: foreignFreight,
      domesticFreightNzd: freightNzd,
      availabilityDays: quoteAvailabilityDays || sup.leadTimeDays,
      notes: quoteNotes,
      isRecommendedByAi: activeReq.supplierQuotes.length === 0,
    };

    addSupplierQuote(activeReq.id, newSq);
    setSelectedSupplierQuoteId(newSq.id);
    setShowAddSupplierQuote(false);
  };

  // Handle Issue Official Customer Quote
  const handleIssueCustomerQuote = () => {
    if (!activeReq || !winningQuote) return;

    const freightOptions: FreightOption[] = [
      {
        method: "AIR_EXPRESS",
        carrierName: "Autohub Air Priority Express (Cathay Cargo / Air NZ)",
        estimatedTransitDays: "3 - 5 business days",
        costNzd: airFreightCost,
        available: true,
      },
      {
        method: "SEA_FREIGHT",
        carrierName: "Autohub Ocean Consolidated (Toyofuji Shipping)",
        estimatedTransitDays: "14 - 18 business days",
        costNzd: seaFreightCost,
        available: true,
      },
    ];

    const quoteNum = activeReq.quote?.quoteNumber || `QTE-2026-${activeReq.referenceNumber.replace("AH-P-", "")}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const quote: CustomerQuote = {
      id: `QTE-${Date.now()}`,
      quoteNumber: quoteNum,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      selectedSupplierQuoteId: winningQuote.id,
      basePartCostNzd: baseCostNzd,
      targetMarginPercentage: targetMargin,
      marginAmountNzd: calculatedMarginAmount,
      procurementFeeNzd: procurementFee,
      landedCostNzd: landedCostNzd,
      freightOptions,
      selectedFreightMethod: selectedFreightOption,
      subtotalNzd: calculatedSubtotal,
      gstAmountNzd: calculatedGst,
      totalNzd: calculatedTotal,
      termsAccepted: false,
      status: "ISSUED",
      revisionNumber: 1,
    };

    issueCustomerQuote(activeReq.id, quote);
  };

  // Handle Revise Customer Quote
  const handleReissueQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !winningQuote) return;

    const freightOptions: FreightOption[] = [
      {
        method: "AIR_EXPRESS",
        carrierName: "Autohub Air Priority Express (Cathay Cargo / Air NZ)",
        estimatedTransitDays: "3 - 5 business days",
        costNzd: airFreightCost,
        available: true,
      },
      {
        method: "SEA_FREIGHT",
        carrierName: "Autohub Ocean Consolidated (Toyofuji Shipping)",
        estimatedTransitDays: "14 - 18 business days",
        costNzd: seaFreightCost,
        available: true,
      },
    ];

    const quoteNum = activeReq.quote?.quoteNumber || `QTE-2026-${activeReq.referenceNumber.replace("AH-P-", "")}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const updatedQuote: CustomerQuote = {
      id: activeReq.quote?.id || `QTE-${Date.now()}`,
      quoteNumber: quoteNum,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      selectedSupplierQuoteId: winningQuote.id,
      basePartCostNzd: baseCostNzd,
      targetMarginPercentage: targetMargin,
      marginAmountNzd: calculatedMarginAmount,
      procurementFeeNzd: procurementFee,
      landedCostNzd: landedCostNzd,
      freightOptions,
      selectedFreightMethod: selectedFreightOption,
      subtotalNzd: calculatedSubtotal,
      gstAmountNzd: calculatedGst,
      totalNzd: calculatedTotal,
      termsAccepted: false,
      status: "ISSUED",
    };

    reissueCustomerQuote(activeReq.id, updatedQuote, revisionNotes || "Revised margin & landed freight allocation");
    setShowRevisionModal(false);
    setRevisionNotes("");
  };

  // Handle Raise Sourcing Exception
  const handleConfirmException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !exceptionReason.trim()) return;

    const fullReason = `[${exceptionCategory}] ${exceptionReason.trim()}`;
    updateRequestStatus(
      activeReq.id,
      "SOURCING_EXCEPTION",
      "Nathan Cole",
      "SOURCING_SPECIALIST",
      fullReason
    );
    setShowExceptionModal(false);
    setExceptionReason("");
  };

  // Handle Resolve Sourcing Exception
  const handleResolveException = (reqId: string) => {
    resolveSourcingException(reqId, "Nathan Cole", "Part specification resolved with overseas dealer network");
  };

  // Handle Transmit PO & Mark Ordered From Supplier
  const handleMarkOrdered = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poTargetReq) return;

    const notes = `PO Ref: ${poNumberInput || "PO-JP-2026-" + Math.floor(1000 + Math.random() * 9000)} | Bay: ${poDispatchBay} | ${poNotes}`;
    markOrderedFromSupplier(poTargetReq.id, "Nathan Cole (Sourcing)", notes);
    setShowPoModal(false);
    setPoTargetReq(null);
    setPoNumberInput("");
  };

  // Handle Add New Supplier
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    const newSup: SupplierProfile = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      name: newSupplierName.trim(),
      country: newSupplierCountry,
      currency: newSupplierCurrency,
      exchangeRateToNzd: newSupplierFxRate,
      category: newSupplierCategory,
      leadTimeDays: newSupplierLeadDays,
      rating: 4.8,
      contactPerson: newSupplierPerson.trim() || "Account Manager",
      contactEmail: newSupplierEmail.trim() || "orders@supplier.com",
      contactPhone: newSupplierPhone.trim() || "+81 3 0000 0000",
    };

    addSupplierProfile(newSup);
    setShowAddSupplierModal(false);
    setNewSupplierName("");
    setNewSupplierPerson("");
    setNewSupplierEmail("");
    setNewSupplierPhone("");
  };

  // Filtered Queue
  const filteredQueue = requests.filter((req) => {
    if (queueFilter === "SOURCING" && req.status !== "SOURCING") return false;
    if (queueFilter === "SUBMITTED" && req.status !== "SUBMITTED") return false;
    if (queueFilter === "EXCEPTION" && req.status !== "SOURCING_EXCEPTION") return false;
    if (queueFilter === "ALL" && !["SOURCING", "SUBMITTED", "AWAITING_CUSTOMER_APPROVAL", "SOURCING_EXCEPTION"].includes(req.status)) {
      return false;
    }
    if (queueSearch.trim()) {
      const q = queueSearch.toLowerCase();
      return (
        req.referenceNumber.toLowerCase().includes(q) ||
        req.vehicle.make.toLowerCase().includes(q) ||
        req.vehicle.model.toLowerCase().includes(q) ||
        req.part.partName.toLowerCase().includes(q) ||
        req.customerName.toLowerCase().includes(q) ||
        req.vehicle.vin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    if (supplierCountryFilter !== "ALL" && s.country !== supplierCountryFilter) return false;
    if (supplierSearch.trim()) {
      const q = supplierSearch.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ================= TOP GREETING & COMMAND BANNER ================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>SOURCING DESK OPERATIONS</span>
            <span className="text-amber-300">•</span>
            <span className="font-mono">NATHAN COLE</span>
            <span className="text-amber-300">•</span>
            <span>NAGOYA HUB &amp; NZ TRADE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Procurement Desk &amp; Sourcing Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Compare multi-currency overseas supplier quotations, evaluate landed costs, compute target margins, build and issue verified customer proposals, and transmit supplier POs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeReq && (
            <button
              id="open-ai-engine-banner"
              type="button"
              onClick={() => setShowAiModal(true)}
              className="px-4 py-3 rounded-2xl bg-autohub-navy hover:bg-autohub-navy-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-autohub-red animate-pulse" />
              <span>AI Quote Synthesis Engine</span>
            </button>
          )}

          <button
            id="record-quote-banner"
            type="button"
            onClick={() => setShowAddSupplierQuote(true)}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>RECORD SUPPLIER QUOTE</span>
          </button>
        </div>
      </div>

      {/* ================= 4 KPI STAT CARDS (SYMMETRIC TO CUSTOMER PORTAL) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Needs Sourcing */}
        <div
          onClick={() => {
            setActiveTab("queue");
            setQueueFilter("SOURCING");
          }}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-amber-300 transition"
        >
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
              SOURCING QUEUE
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {sourcingQueue.length.toString().padStart(2, "0")}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold block">
              Needs Supplier Quotes
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Quotes Issued */}
        <div
          onClick={() => {
            setActiveTab("queue");
            setQueueFilter("ALL");
          }}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-blue-300 transition"
        >
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
              QUOTES ISSUED
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {quotesIssuedQueue.length.toString().padStart(2, "0")}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Awaiting Customer Approval
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Payment Cleared / Ready for PO (Highlighted) */}
        <div
          onClick={() => setActiveTab("orders")}
          className="bg-emerald-50/40 rounded-2xl p-5 border-2 border-emerald-400 shadow-sm flex items-start justify-between cursor-pointer hover:bg-emerald-50/70 transition"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-emerald-950 block">
                PAYMENT CONFIRMED
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950">
              {poGateQueue.length.toString().padStart(2, "0")}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block">
              Ready to Place Supplier PO
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Supplier Network */}
        <div
          onClick={() => setActiveTab("suppliers")}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-start justify-between cursor-pointer hover:border-slate-400 transition"
        >
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
              SUPPLIER NETWORK
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {suppliers.length.toString().padStart(2, "0")}
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Japan • USA • EU • AU
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= ACTION REQUIRED CALLOUT BANNER ================= */}
      {(sourcingQueue.length > 0 || poGateQueue.length > 0 || exceptionsQueue.length > 0) && (
        <div className="bg-amber-50/40 rounded-3xl p-5 sm:p-6 border border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-amber-950">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs">
                !
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-950 leading-tight">
                  High Priority Sourcing Actions
                </h3>
                <p className="text-xs text-amber-800">
                  {sourcingQueue.length} requests awaiting quotation • {poGateQueue.length} payment-cleared orders ready for PO dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("orders")}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>PO Placement Gate ({poGateQueue.length})</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-amber-200/60 pt-1">
            {/* Action Item 1: Sourcing Queue Head */}
            {sourcingQueue.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-slate-900">{req.referenceNumber}</span>
                    <span className="font-semibold text-slate-800">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{req.supplierQuotes.length} Quotes Recorded</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-900">{req.part.partName}</strong> • OEM: {req.part.oemPartNumber || "N/A"} • Customer: {req.customerName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setActiveTab("queue");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    SOURCE / COMPARE →
                  </button>
                </div>
              </div>
            ))}

            {/* Action Item 2: PO Cleared Head */}
            {poGateQueue.slice(0, 1).map((req) => (
              <div
                key={req.id}
                className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono font-bold text-emerald-950">{req.referenceNumber}</span>
                    <span className="font-semibold text-slate-800">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Payment Cleared (${req.quote?.totalNzd.toFixed(2)} NZD)</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-900">{req.part.partName}</strong> • Customer settled via {req.invoice?.paymentMethod || "Bank Transfer"}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      setPoTargetReq(req);
                      setShowPoModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                  >
                    TRANSMIT SUPPLIER PO →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MAIN NAVIGATION TABS ================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-2 flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("queue")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${
            activeTab === "queue"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Sourcing Queue &amp; Quotation Desk</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === "queue" ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {sourcingQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("suppliers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${
            activeTab === "suppliers"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Supplier Reference List</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === "suppliers" ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {suppliers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>PO Placement Gate</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === "orders" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {poGateQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tracking")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${
            activeTab === "tracking"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Progress Tracking</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === "tracking" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
            }`}
          >
            {orderedQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("exceptions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition whitespace-nowrap ${
            activeTab === "exceptions"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Sourcing Exceptions</span>
          {exceptionsQueue.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white">
              {exceptionsQueue.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= TAB 1: SOURCING QUEUE & QUOTATION DESK ================= */}
      {activeTab === "queue" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sourcing Queue List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Sourcing Queue ({filteredQueue.length})
                  </h3>
                  <p className="text-[10px] text-slate-400">Select request to compare quotes</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setQueueFilter("ALL")}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      queueFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setQueueFilter("SOURCING")}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      queueFilter === "SOURCING" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    Sourcing
                  </button>
                </div>
              </div>

              {/* Filter Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by ref, vehicle, part..."
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none"
                />
              </div>

              {/* Request Cards */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredQueue.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No requests match filter.
                  </p>
                ) : (
                  filteredQueue.map((req) => {
                    const isSelected = activeReq?.id === req.id;
                    const quotesCount = req.supplierQuotes.length;
                    return (
                      <div
                        key={req.id}
                        onClick={() => setSelectedRequest(req)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-1.5 ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-300"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">
                            {req.referenceNumber}
                          </span>
                          <StatusBadge status={req.status} size="sm" showIcon={false} />
                        </div>

                        <div className="font-bold text-slate-900 truncate">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </div>

                        <div className="text-slate-600 truncate text-[11px]">
                          {req.part.partName}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                          <span>{req.customerName}</span>
                          <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {quotesCount} {quotesCount === 1 ? "quote" : "quotes"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Workspace */}
          <div className="lg:col-span-8 space-y-6">
            {activeReq ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                {/* Workspace Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 font-mono tracking-tight">
                        {activeReq.referenceNumber}
                      </h3>
                      <StatusBadge status={activeReq.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer: <strong className="text-slate-800">{activeReq.customerName}</strong> • NZBN: {activeReq.customerNzbn} • Email: {activeReq.customerContactEmail}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setShowExceptionModal(true)}
                      className="px-3 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Raise Exception</span>
                    </button>

                    <button
                      onClick={() => setShowAddSupplierQuote(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Capture Supplier Quote</span>
                    </button>
                  </div>
                </div>

                {/* Vehicle & Part Requirements Specification Card */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2 font-bold text-slate-800 uppercase tracking-wider">
                    <span>Part &amp; Fitment Specifications</span>
                    <span className="text-[11px] font-mono text-slate-500 font-normal">
                      Quantity: <strong>{activeReq.part.quantity}x</strong> • Condition: <strong>{activeReq.part.conditionRequirement}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Vehicle</span>
                      <span className="font-bold text-slate-900 block">
                        {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">VIN / Chassis</span>
                      <span className="font-mono font-bold text-slate-900 block truncate" title={activeReq.vehicle.vin}>
                        {activeReq.vehicle.vin}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Requested Part</span>
                      <span className="font-bold text-slate-900 block truncate" title={activeReq.part.partName}>
                        {activeReq.part.partName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">OEM Code</span>
                      <span className="font-mono font-bold text-slate-900 block">
                        {activeReq.part.oemPartNumber || "Pending Identification"}
                      </span>
                    </div>
                  </div>

                  {activeReq.part.descriptionNotes && (
                    <div className="pt-2 text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-800 block mb-0.5">Workshop Notes:</span>
                      &quot;{activeReq.part.descriptionNotes}&quot;
                    </div>
                  )}
                </div>

                {/* ================= SIDE-BY-SIDE SUPPLIER QUOTATION COMPARISON ================= */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <span>Side-by-Side Supplier Quotations</span>
                        <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
                          {activeReq.supplierQuotes.length} Available
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Compare foreign currency costs, converted NZD, domestic freight, and lead times.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAiModal(true)}
                        className="text-xs font-bold text-autohub-red hover:underline flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>AI Quote Engine</span>
                      </button>
                    </div>
                  </div>

                  {activeReq.supplierQuotes.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500 space-y-3">
                      <Boxes className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-semibold text-slate-700">No supplier quotes recorded yet for this request.</p>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        Capture quotes from Nagoya, Tokyo, Hamburg, or California, or let AI generate synthetic market benchmarks.
                      </p>
                      <button
                        onClick={() => setShowAddSupplierQuote(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                      >
                        + Capture First Supplier Quote
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeReq.supplierQuotes.map((sq, idx) => {
                        const isSelected = selectedSupplierQuoteId === sq.id;
                        const isLowestPrice =
                          activeReq.supplierQuotes.length > 1 &&
                          activeReq.supplierQuotes.every((other) => other.id === sq.id || sq.partCostNzd <= other.partCostNzd);
                        const isFastest =
                          activeReq.supplierQuotes.length > 1 &&
                          activeReq.supplierQuotes.every((other) => other.id === sq.id || sq.availabilityDays <= other.availabilityDays);

                        return (
                          <div
                            key={sq.id}
                            onClick={() => setSelectedSupplierQuoteId(sq.id)}
                            className={`p-5 rounded-2xl border transition cursor-pointer text-xs space-y-3 relative ${
                              isSelected
                                ? "bg-blue-50/50 border-autohub-navy shadow-md ring-2 ring-autohub-navy/20"
                                : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                            }`}
                          >
                            {/* Badges Bar */}
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="font-bold text-slate-900 text-sm">{sq.supplierName}</span>
                              <div className="flex items-center gap-1">
                                {sq.isRecommendedByAi && (
                                  <span className="text-[9px] bg-autohub-navy text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5 text-autohub-red" /> AI Recommended
                                  </span>
                                )}
                                {isLowestPrice && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                                    Best Price
                                  </span>
                                )}
                                {isFastest && (
                                  <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                                    Fastest ({sq.availabilityDays}d)
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <div>
                                <span className="text-slate-400 text-[10px] block">Foreign Part Cost</span>
                                <span className="font-bold text-slate-800 font-mono">
                                  {sq.partCostForeign.toLocaleString()} {sq.partCostCurrency}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block">Converted Part NZD</span>
                                <span className="font-bold text-emerald-700 font-mono text-xs">
                                  ${sq.partCostNzd.toFixed(2)} NZD
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block">Domestic Freight to Hub</span>
                                <span className="font-mono text-slate-700">
                                  ${sq.domesticFreightNzd.toFixed(2)} NZD
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block">Landed Cost at Hub</span>
                                <span className="font-bold text-slate-900 font-mono">
                                  ${(sq.partCostNzd + sq.domesticFreightNzd).toFixed(2)} NZD
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Country: <strong>{sq.supplierCountry}</strong></span>
                              <span>Lead Time: <strong>{sq.availabilityDays} day(s)</strong></span>
                            </div>

                            {sq.notes && (
                              <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100 truncate">
                                &quot;{sq.notes}&quot;
                              </p>
                            )}

                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                {isSelected ? "Selected for Customer Quote" : "Click to select"}
                              </span>
                              <button
                                type="button"
                                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                                  isSelected
                                    ? "bg-autohub-navy text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {isSelected ? "Selected Winning Quote ✓" : "Select Quote"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ================= MARGIN & LANDED COST CALCULATION ENGINE ================= */}
                {winningQuote && (
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                          <Calculator className="w-4 h-4 text-autohub-navy" />
                          <span>Customer Landed Cost &amp; Margin Builder</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Selected Quote: <strong>{winningQuote.supplierName}</strong> (${landedCostNzd.toFixed(2)} NZD landed to hub)
                        </p>
                      </div>

                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                        Margin: +${calculatedMarginAmount.toFixed(2)} NZD ({targetMargin}%)
                      </span>
                    </div>

                    {/* Interactive Sliders & Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      {/* Margin % Slider */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-800">Target Margin %</label>
                          <span className="font-mono font-bold text-autohub-navy">{targetMargin}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="40"
                          step="0.5"
                          value={targetMargin}
                          onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 18)}
                          className="w-full accent-autohub-navy"
                        />
                        <span className="text-[10px] text-slate-400 block">Standard: 18.0% | Tier 1: 15.0%</span>
                      </div>

                      {/* Procurement Handling Fee */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                        <label className="font-bold text-slate-800 block">Procurement Fee (NZD)</label>
                        <input
                          type="number"
                          value={procurementFee}
                          onChange={(e) => setProcurementFee(parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 text-xs"
                        />
                        <span className="text-[10px] text-slate-400 block">Covers customs clearance &amp; MPI processing</span>
                      </div>

                      {/* Freight Option Selection */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                        <label className="font-bold text-slate-800 block">Default Freight Method</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedFreightOption("AIR_EXPRESS")}
                            className={`p-2 rounded-xl text-[11px] font-bold text-center border transition ${
                              selectedFreightOption === "AIR_EXPRESS"
                                ? "bg-rose-50 border-rose-400 text-rose-800"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            Air (${airFreightCost})
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedFreightOption("SEA_FREIGHT")}
                            className={`p-2 rounded-xl text-[11px] font-bold text-center border transition ${
                              selectedFreightOption === "SEA_FREIGHT"
                                ? "bg-blue-50 border-blue-400 text-blue-800"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            Sea (${seaFreightCost})
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block">Both options will be presented to customer</span>
                      </div>
                    </div>

                    {/* Breakdown Formula Table */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-slate-900 text-xs block mb-1">
                        Landed Cost &amp; Price Breakdown
                      </span>
                      <div className="divide-y divide-slate-100 text-[11px]">
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">Overseas Part Cost ({winningQuote.supplierName}):</span>
                          <span className="font-mono font-semibold text-slate-800">${baseCostNzd.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">Overseas Domestic Freight to Export Hub:</span>
                          <span className="font-mono font-semibold text-slate-800">${domesticFreightNzd.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between bg-slate-50/50 px-2 rounded-lg font-bold">
                          <span className="text-slate-800">Total Landed Cost to Hub:</span>
                          <span className="font-mono text-slate-900">${landedCostNzd.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">Target Gross Margin ({targetMargin}%):</span>
                          <span className="font-mono font-semibold text-emerald-700">+${calculatedMarginAmount.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">Autohub Procurement &amp; Compliance Handling:</span>
                          <span className="font-mono font-semibold text-slate-800">+${procurementFee.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">
                            International Freight ({selectedFreightOption === "AIR_EXPRESS" ? "Air Priority 3-5d" : "Ocean Consolidated 14-18d"}):
                          </span>
                          <span className="font-mono font-semibold text-slate-800">+${currentFreightCost.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between border-t font-semibold">
                          <span className="text-slate-700">Subtotal (excl GST):</span>
                          <span className="font-mono text-slate-900">${calculatedSubtotal.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-1.5 flex justify-between">
                          <span className="text-slate-500">New Zealand GST (15%):</span>
                          <span className="font-mono font-semibold text-slate-800">${calculatedGst.toFixed(2)} NZD</span>
                        </div>
                        <div className="py-2 flex justify-between text-sm font-black bg-slate-900 text-white px-3 rounded-xl">
                          <span>Total Customer Quotation:</span>
                          <span className="font-mono text-amber-400">${calculatedTotal.toFixed(2)} NZD</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Quote Issue & Revise Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        {activeReq.quote ? (
                          <span className="text-xs font-semibold text-slate-700">
                            Current Status: Quote <strong>{activeReq.quote.quoteNumber}</strong> issued ({activeReq.quote.status})
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Ready to issue official quote to {activeReq.customerName}.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {activeReq.quote ? (
                          <button
                            onClick={() => setShowRevisionModal(true)}
                            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                            Revise &amp; Reissue Quote
                          </button>
                        ) : (
                          <button
                            onClick={handleIssueCustomerQuote}
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-900/20 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Issue Quote to Customer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200">
                Select a request from the queue to start sourcing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SUPPLIER REFERENCE LIST ================= */}
      {activeTab === "suppliers" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Overseas &amp; Domestic Supplier Reference Directory
              </h3>
              <p className="text-xs text-slate-500">
                Verified international distributors, OEM dealers, and commercial parts alliances.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddSupplierModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Supplier</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                placeholder="Search by supplier name, contact, category, country..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none"
              />
            </div>

            <select
              value={supplierCountryFilter}
              onChange={(e) => setSupplierCountryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none text-slate-700 font-medium"
            >
              <option value="ALL">All Countries</option>
              <option value="Japan">Japan (JPY)</option>
              <option value="USA">USA (USD)</option>
              <option value="Germany">Germany (EUR)</option>
              <option value="Australia">Australia (AUD)</option>
            </select>
          </div>

          {/* Supplier Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition text-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">{s.category}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                    {s.country} ({s.currency})
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact: <strong>{s.contactPerson || "Account Desk"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${s.contactEmail}`} className="text-blue-600 hover:underline">
                      {s.contactEmail || "orders@supplier.com"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.contactPhone || "+81 00 0000 0000"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Exchange Rate</span>
                    <span className="font-mono font-bold text-slate-800">1 {s.currency} = ${s.exchangeRateToNzd} NZD</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Avg Lead Time</span>
                    <span className="font-semibold text-slate-800">{s.leadTimeDays} business days</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{s.rating} / 5.0</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Verified Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PO PLACEMENT GATE (PAYMENT CONFIRMED) ================= */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Payment Gate Cleared
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Purchase Order Placement Desk ({poGateQueue.length})
              </h3>
              <p className="text-xs text-slate-500">
                Customer payment verified. Transmit official purchase orders to overseas suppliers and mark &quot;Ordered From Supplier&quot;.
              </p>
            </div>
          </div>

          {poGateQueue.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">PO Queue Clear</p>
              <p>All cleared customer orders have been dispatched to suppliers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {poGateQueue.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-950 text-sm">
                        {req.referenceNumber}
                      </span>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="flex items-center gap-2 font-mono text-emerald-900 text-xs font-bold">
                      <span>Total Paid:</span>
                      <span className="text-sm text-emerald-950">${req.quote?.totalNzd.toFixed(2)} NZD</span>
                      <span className="text-[10px] font-normal text-emerald-700">({req.invoice?.paymentMethod})</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-slate-700 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Customer</span>
                      <strong className="text-slate-900">{req.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Vehicle</span>
                      <strong className="text-slate-900">{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Part Requested</span>
                      <strong className="text-slate-900">{req.part.partName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Selected Freight</span>
                      <strong className="text-slate-900">{req.quote?.selectedFreightMethod || "AIR_EXPRESS"}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setPoTargetReq(req);
                        setPoNumberInput(`PO-JP-2026-${req.referenceNumber.replace("AH-P-", "")}`);
                        setShowPoModal(true);
                      }}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Transmit PO &amp; Mark &quot;Ordered From Supplier&quot;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PROCUREMENT PROGRESS TRACKING ================= */}
      {activeTab === "tracking" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Procurement Pipeline &amp; Lifecycle Tracking
              </h3>
              <p className="text-xs text-slate-500">
                Real-time progress of all parts from submission to overseas dispatch and Bay delivery.
              </p>
            </div>
          </div>

          {/* Pipeline Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Stage 1: Needs Sourcing */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Needs Sourcing
                </span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px]">
                  {sourcingQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {sourcingQueue.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRequest(r);
                      setActiveTab("queue");
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 cursor-pointer hover:border-amber-400 transition"
                  >
                    <div className="flex justify-between font-mono font-bold text-slate-900">
                      <span>{r.referenceNumber}</span>
                      <span className="text-[10px] text-slate-400">{r.part.quantity}x</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] truncate">{r.vehicle.make} {r.vehicle.model}</p>
                    <p className="text-slate-500 text-[10px] truncate">{r.part.partName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 2: Quote Issued */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Quotes Issued
                </span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px]">
                  {quotesIssuedQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {quotesIssuedQueue.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRequest(r);
                      setActiveTab("queue");
                    }}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1 cursor-pointer hover:border-blue-400 transition"
                  >
                    <div className="flex justify-between font-mono font-bold text-slate-900">
                      <span>{r.referenceNumber}</span>
                      <span className="text-emerald-700 font-bold">${r.quote?.totalNzd.toFixed(2)}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] truncate">{r.vehicle.make} {r.vehicle.model}</p>
                    <p className="text-slate-500 text-[10px] truncate">{r.part.partName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 3: Payment Cleared / Ready for PO */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Payment Cleared
                </span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px]">
                  {poGateQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {poGateQueue.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setPoTargetReq(r);
                      setShowPoModal(true);
                    }}
                    className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-300 text-xs space-y-1 cursor-pointer hover:bg-emerald-100/50 transition"
                  >
                    <div className="flex justify-between font-mono font-bold text-emerald-950">
                      <span>{r.referenceNumber}</span>
                      <span className="text-[10px] text-emerald-700">Place PO →</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] truncate">{r.vehicle.make} {r.vehicle.model}</p>
                    <p className="text-slate-500 text-[10px] truncate">{r.part.partName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 4: Ordered & In Transit */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Ordered / In Transit
                </span>
                <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px]">
                  {orderedQueue.length}
                </span>
              </div>
              <div className="space-y-2">
                {orderedQueue.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between font-mono font-bold text-slate-900">
                      <span>{r.referenceNumber}</span>
                      <StatusBadge status={r.status} size="sm" showIcon={false} />
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px] truncate">{r.vehicle.make} {r.vehicle.model}</p>
                    <p className="text-slate-500 text-[10px] truncate">{r.part.partName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SOURCING EXCEPTIONS DESK ================= */}
      {activeTab === "exceptions" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Exceptions Gate
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Sourcing Exceptions Desk ({exceptionsQueue.length})
              </h3>
              <p className="text-xs text-slate-500">
                Requests flagged with supplier discontinuation, severe backorders, or fitment conflicts.
              </p>
            </div>
          </div>

          {exceptionsQueue.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">No Active Exceptions</p>
              <p>All procurement requests are moving smoothly through standard channels.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exceptionsQueue.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-rose-50/40 rounded-2xl border border-rose-200 text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-950 text-sm">
                        {req.referenceNumber}
                      </span>
                      <StatusBadge status={req.status} />
                    </div>

                    <span className="text-xs text-slate-500">
                      Customer: <strong>{req.customerName}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Vehicle</span>
                      <strong className="text-slate-900">{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Part Name</span>
                      <strong className="text-slate-900">{req.part.partName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">VIN</span>
                      <span className="font-mono text-slate-800">{req.vehicle.vin}</span>
                    </div>
                  </div>

                  {req.statusReason && (
                    <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-rose-900 font-medium">
                      <span className="font-bold block text-[10px] uppercase tracking-wider text-rose-700 mb-0.5">
                        Exception Reason:
                      </span>
                      {req.statusReason}
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => handleResolveException(req.id)}
                      className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow"
                    >
                      Resolve Exception &amp; Return to Sourcing Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: CAPTURE SUPPLIER QUOTATION ================= */}
      {showAddSupplierQuote && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scaleIn">
          <form
            onSubmit={handleSaveSupplierQuote}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Supplier Quotation
                </h3>
                <p className="text-[11px] text-slate-500">For {activeReq.referenceNumber} • {activeReq.part.partName}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSupplierQuote(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Select Supplier</label>
              <select
                value={quoteSupplierId}
                onChange={(e) => setQuoteSupplierId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country} - {s.currency} • FX: {s.exchangeRateToNzd})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700">Foreign Part Cost</label>
                <input
                  type="number"
                  required
                  value={foreignCost}
                  onChange={(e) => setForeignCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700">Foreign Freight to Hub</label>
                <input
                  type="number"
                  required
                  value={foreignFreight}
                  onChange={(e) => setForeignFreight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Live NZD Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
              {(() => {
                const s = suppliers.find((x) => x.id === quoteSupplierId) || suppliers[0];
                const pNzd = foreignCost * s.exchangeRateToNzd;
                const fNzd = foreignFreight * s.exchangeRateToNzd;
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Converted Part Cost:</span>
                      <span className="font-mono font-bold text-slate-800">${pNzd.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Converted Domestic Freight:</span>
                      <span className="font-mono font-bold text-slate-800">${fNzd.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Total Landed Cost to Hub:</span>
                      <span className="font-mono text-emerald-800">${(pNzd + fNzd).toFixed(2)} NZD</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Lead Time to Hub (Days)</label>
              <input
                type="number"
                value={quoteAvailabilityDays}
                onChange={(e) => setQuoteAvailabilityDays(parseInt(e.target.value, 10) || 2)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Supplier Notes &amp; Terms</label>
              <textarea
                rows={2}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddSupplierQuote(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow"
              >
                Save Supplier Quote
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: REVISE CUSTOMER QUOTE ================= */}
      {showRevisionModal && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scaleIn">
          <form
            onSubmit={handleReissueQuote}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Revise &amp; Reissue Quote
                </h3>
                <p className="text-[11px] text-slate-500">
                  Quote {activeReq.quote?.quoteNumber} • Rev {(activeReq.quote?.revisionNumber || 1) + 1}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Reason for Revision</label>
              <textarea
                rows={3}
                required
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="e.g. Customer requested consolidated sea freight option, reduced margin to 15% for trade account volume..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Revised Landed Cost:</span>
                <span className="font-mono font-bold">${landedCostNzd.toFixed(2)} NZD</span>
              </div>
              <div className="flex justify-between">
                <span>Target Margin:</span>
                <span className="font-mono font-bold">{targetMargin}% (+${calculatedMarginAmount.toFixed(2)} NZD)</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1 text-slate-900">
                <span>New Total (incl GST):</span>
                <span className="font-mono text-emerald-700">${calculatedTotal.toFixed(2)} NZD</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
              >
                Confirm &amp; Reissue Quote
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: SOURCING EXCEPTION ================= */}
      {showExceptionModal && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scaleIn">
          <form
            onSubmit={handleConfirmException}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Raise Sourcing Exception
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExceptionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Exception Category</label>
              <select
                value={exceptionCategory}
                onChange={(e) => setExceptionCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Factory Discontinued">Factory Discontinued / End of Life</option>
                <option value="Severe Backorder 60+ Days">Extended Backorder (60+ Days)</option>
                <option value="Superseded OEM Number Required">Superseded OEM Part Number Required</option>
                <option value="Supplier Price Spike >25%">Supplier Price Surge (&gt;25%)</option>
                <option value="VIN / Fitment Incompatibility">Vehicle VIN / Fitment Conflict</option>
                <option value="Other Sourcing Block">Other Sourcing Block</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Specific Reason / Details</label>
              <textarea
                rows={3}
                required
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                placeholder="Provide detailed context for the trade customer and operations team..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowExceptionModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
              >
                Flag Sourcing Exception
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: ADD NEW SUPPLIER ================= */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scaleIn">
          <form
            onSubmit={handleAddSupplier}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-autohub-navy" />
                <h3 className="text-base font-bold text-slate-900">
                  Register New Supplier Reference
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSupplierModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Supplier Legal Name</label>
              <input
                type="text"
                required
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="e.g. Yokohama Genuine Parts Corp"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700">Country</label>
                <select
                  value={newSupplierCountry}
                  onChange={(e) => {
                    setNewSupplierCountry(e.target.value);
                    if (e.target.value === "Japan") {
                      setNewSupplierCurrency("JPY");
                      setNewSupplierFxRate(0.0108);
                    } else if (e.target.value === "USA") {
                      setNewSupplierCurrency("USD");
                      setNewSupplierFxRate(1.68);
                    } else if (e.target.value === "Germany") {
                      setNewSupplierCurrency("EUR");
                      setNewSupplierFxRate(1.82);
                    } else if (e.target.value === "Australia") {
                      setNewSupplierCurrency("AUD");
                      setNewSupplierFxRate(1.10);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Japan">Japan</option>
                  <option value="USA">USA</option>
                  <option value="Germany">Germany</option>
                  <option value="Australia">Australia</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700">Exchange Rate to NZD</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={newSupplierFxRate}
                  onChange={(e) => setNewSupplierFxRate(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Specialty Category</label>
              <input
                type="text"
                required
                value={newSupplierCategory}
                onChange={(e) => setNewSupplierCategory(e.target.value)}
                placeholder="e.g. Japanese OEM Genuine / Aftermarket Spares"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold block mb-1 text-slate-700">Contact Person</label>
                <input
                  type="text"
                  value={newSupplierPerson}
                  onChange={(e) => setNewSupplierPerson(e.target.value)}
                  placeholder="e.g. Kenji Tanaka"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700">Contact Email</label>
                <input
                  type="email"
                  value={newSupplierEmail}
                  onChange={(e) => setNewSupplierEmail(e.target.value)}
                  placeholder="orders@supplier.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-slate-700">Phone</label>
                <input
                  type="text"
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  placeholder="+81 3 1234 5678"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Standard Lead Time (Days)</label>
              <input
                type="number"
                value={newSupplierLeadDays}
                onChange={(e) => setNewSupplierLeadDays(parseInt(e.target.value, 10) || 3)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddSupplierModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
              >
                Add Supplier to Directory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: PO TRANSMIT / MARK ORDERED ================= */}
      {showPoModal && poTargetReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-scaleIn">
          <form
            onSubmit={handleMarkOrdered}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Transmit Purchase Order to Overseas Supplier
                </h3>
                <p className="text-[11px] text-slate-500">
                  For {poTargetReq.referenceNumber} • Payment Confirmed (${poTargetReq.quote?.totalNzd.toFixed(2)} NZD)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Supplier PO Reference</label>
              <input
                type="text"
                required
                value={poNumberInput}
                onChange={(e) => setPoNumberInput(e.target.value)}
                placeholder="e.g. PO-JP-2026-00918"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">Target Export Consolidation Terminal</label>
              <input
                type="text"
                required
                value={poDispatchBay}
                onChange={(e) => setPoDispatchBay(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700">PO Packaging &amp; Dispatch Instructions</label>
              <textarea
                rows={2}
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <span className="font-bold block">Status Transition Notice:</span>
              <p>
                Submitting this will transition <strong>{poTargetReq.referenceNumber}</strong> to <strong>&quot;ORDERED_FROM_SUPPLIER&quot;</strong>, alert the international logistics team, and update the customer tracking timeline.
              </p>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowPoModal(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow"
              >
                Confirm &amp; Mark &quot;Ordered From Supplier&quot;
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= AI QUOTE MODAL ================= */}
      {activeReq && (
        <AIQuoteModal
          request={activeReq}
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
        />
      )}
    </div>
  );
}

export default function ProcurementDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mx-auto mb-3" />
          <span>Loading Sourcing Desk Command Center...</span>
        </div>
      }
    >
      <ProcurementDashboardContent />
    </React.Suspense>
  );
}
