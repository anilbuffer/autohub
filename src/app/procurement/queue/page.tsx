"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Building2,
  CheckSquare,
  Truck,
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
  Edit3,
  FileText,
  Boxes,
  HelpCircle,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Send,
  Calendar,
  User,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSuppliers,
  addSupplierQuote,
  issueCustomerQuote,
  subscribeToStore,
  updateRequestStatus,
} from "@/lib/store";
import {
  PartRequest,
  SupplierQuotation,
  CustomerQuote,
  SupplierProfile,
  FreightMethod,
} from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AIQuoteModal } from "@/components/AIQuoteModal";

export default function SourcingQueuePage() {
  const searchParams = useSearchParams();
  const initialReqParam = searchParams.get("req");

  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(getStoredSuppliers);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");

  // Filters
  const [urgencyFilter, setUrgencyFilter] = useState<"ALL" | "URGENT" | "STANDARD">("ALL");
  const [makeFilter, setMakeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAddSupplierQuote, setShowAddSupplierQuote] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState("");

  // Manual Supplier Quote Capture Form State
  const [quoteSupplierId, setQuoteSupplierId] = useState("SUP-01");
  const [foreignCost, setForeignCost] = useState<number>(48000);
  const [foreignFreight, setForeignFreight] = useState<number>(3200);
  const [quoteAvailabilityDays, setQuoteAvailabilityDays] = useState<number>(2);
  const [quoteNotes, setQuoteNotes] = useState("Factory direct dispatch from Nagoya export hub");

  // Exception Form State
  const [exceptionCategory, setExceptionCategory] = useState("Factory Discontinued");
  const [exceptionReason, setExceptionReason] = useState("");

  // Load store data
  useEffect(() => {
    const loaded = getStoredRequests();
    setRequests(loaded);
    setSuppliers(getStoredSuppliers());

    // Sourcing queue requests
    const sourcingReqs = loaded.filter((r) => r.status === "SOURCING" || r.status === "SUBMITTED");

    if (initialReqParam) {
      const match = loaded.find((r) => r.id === initialReqParam || r.referenceNumber === initialReqParam);
      if (match) setSelectedRequestId(match.id);
      else if (sourcingReqs.length > 0) setSelectedRequestId(sourcingReqs[0].id);
    } else if (sourcingReqs.length > 0) {
      setSelectedRequestId(sourcingReqs[0].id);
    } else if (loaded.length > 0) {
      setSelectedRequestId(loaded[0].id);
    }

    const unsub = subscribeToStore(() => {
      const refreshed = getStoredRequests();
      setRequests(refreshed);
      setSuppliers(getStoredSuppliers());
    });
    return unsub;
  }, [initialReqParam]);

  // Derived Queues
  const sourcingQueue = requests.filter(
    (r) => r.status === "SOURCING" || r.status === "SUBMITTED"
  );

  // Active Selected Request
  const activeReq =
    requests.find((r) => r.id === selectedRequestId) ||
    sourcingQueue[0] ||
    requests[0];

  // Set default winning quote whenever activeReq changes
  useEffect(() => {
    if (activeReq?.supplierQuotes && activeReq.supplierQuotes.length > 0) {
      const rec =
        activeReq.supplierQuotes.find((sq) => sq.isRecommendedByAi) ||
        activeReq.supplierQuotes[0];
      setSelectedSupplierQuoteId(rec.id);
    } else {
      setSelectedSupplierQuoteId("");
    }
  }, [activeReq?.id]);

  // Filtered Sourcing Requests
  const filteredQueue = sourcingQueue.filter((req) => {
    if (urgencyFilter === "URGENT" && req.part.genuinePreference !== "GENUINE_ONLY") return false;
    if (makeFilter !== "ALL" && req.vehicle.make !== makeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.referenceNumber.toLowerCase().includes(q) ||
        req.part.partName.toLowerCase().includes(q) ||
        req.vehicle.make.toLowerCase().includes(q) ||
        req.vehicle.model.toLowerCase().includes(q) ||
        req.vehicle.vin.toLowerCase().includes(q) ||
        req.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculations for Active Request & Selected Supplier Quote
  const winningQuote =
    activeReq?.supplierQuotes?.find((sq) => sq.id === selectedSupplierQuoteId) ||
    activeReq?.supplierQuotes?.[0];

  const baseCostNzd = winningQuote ? winningQuote.partCostNzd : 0;
  const domesticFreightNzd = winningQuote ? winningQuote.domesticFreightNzd : 0;
  const landedCostNzd = parseFloat((baseCostNzd + domesticFreightNzd).toFixed(2));
  const calculatedMarginAmount = parseFloat((landedCostNzd * (targetMargin / 100)).toFixed(2));
  const activeFreightCost =
    selectedFreightOption === "AIR_EXPRESS" ? airFreightCost : seaFreightCost;
  const subtotalBeforeGst = parseFloat(
    (landedCostNzd + calculatedMarginAmount + procurementFee + activeFreightCost).toFixed(2)
  );
  const gstAmount = parseFloat((subtotalBeforeGst * 0.15).toFixed(2));
  const grandTotal = parseFloat((subtotalBeforeGst + gstAmount).toFixed(2));

  // Handle Issuing Customer Quote
  const handleIssueQuote = () => {
    if (!activeReq || !winningQuote) return;

    const quotePayload: CustomerQuote = {
      id: `QTE-2026-${activeReq.referenceNumber.replace("AH-P-", "")}`,
      quoteNumber: `QTE-2026-${activeReq.referenceNumber.replace("AH-P-", "")}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      selectedSupplierQuoteId: winningQuote.id,
      basePartCostNzd: baseCostNzd,
      targetMarginPercentage: targetMargin,
      marginAmountNzd: calculatedMarginAmount,
      procurementFeeNzd: procurementFee,
      landedCostNzd: landedCostNzd,
      freightOptions: [
        {
          method: "AIR_EXPRESS",
          carrierName: "Cathay Pacific Cargo Priority / Air NZ",
          estimatedTransitDays: "3 - 5 business days",
          costNzd: airFreightCost,
          available: true,
        },
        {
          method: "SEA_FREIGHT",
          carrierName: "Toyofuji Ocean Consolidation Line",
          estimatedTransitDays: "14 - 18 business days",
          costNzd: seaFreightCost,
          available: true,
        },
      ],
      selectedFreightMethod: selectedFreightOption,
      subtotalNzd: subtotalBeforeGst,
      gstAmountNzd: gstAmount,
      totalNzd: grandTotal,
      termsAccepted: false,
      status: "ISSUED",
      revisionNotes: sourcingNotesToCustomer,
    };

    issueCustomerQuote(activeReq.id, quotePayload);
    setQuoteSuccessMsg(`Quote ${quotePayload.quoteNumber} issued for $${grandTotal.toFixed(2)} NZD!`);
    setTimeout(() => setQuoteSuccessMsg(""), 5000);
  };

  // Handle Recording New Supplier Quote
  const handleSaveSupplierQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    const sup = suppliers.find((s) => s.id === quoteSupplierId) || suppliers[0];
    const nzdPart = parseFloat((foreignCost * sup.exchangeRateToNzd).toFixed(2));
    const nzdFreight = parseFloat((foreignFreight * sup.exchangeRateToNzd).toFixed(2));

    const newQuote: SupplierQuotation = {
      id: `SQ-${Date.now()}`,
      supplierId: sup.id,
      supplierName: sup.name,
      supplierCountry: sup.country,
      partCostCurrency: sup.currency,
      partCostForeign: foreignCost,
      exchangeRateToNzd: sup.exchangeRateToNzd,
      partCostNzd: nzdPart,
      domesticFreightForeign: foreignFreight,
      domesticFreightNzd: nzdFreight,
      availabilityDays: quoteAvailabilityDays,
      notes: quoteNotes,
      isRecommendedByAi: false,
    };

    addSupplierQuote(activeReq.id, newQuote);
    setShowAddSupplierQuote(false);
    setSelectedSupplierQuoteId(newQuote.id);
  };

  // Handle Raising Exception
  const handleRaiseException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    const fullReason = `${exceptionCategory}: ${exceptionReason}`;
    updateRequestStatus(
      activeReq.id,
      "SOURCING_EXCEPTION",
      "Nathan Cole (Sourcing Specialist)",
      "SOURCING_SPECIALIST",
      fullReason
    );
    setShowExceptionModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              Sourcing Operations Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Sourcing Queue &amp; Quotation Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare international supplier quotes in real time, build landed costs, set target margins, and issue verified customer quotations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeReq) {
                setShowAiModal(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Quote Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddSupplierQuote(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-900/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Supplier Quote</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {quoteSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{quoteSuccessMsg}</span>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: REQUEST SELECTION QUEUE (5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Triage Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Sourcing Queue ({filteredQueue.length})
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUrgencyFilter("ALL")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    urgencyFilter === "ALL"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setUrgencyFilter("URGENT")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    urgencyFilter === "URGENT"
                      ? "bg-rose-600 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  Urgent OEM
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ref, vehicle, part name, customer..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          {/* Request Cards List */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredQueue.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200">
                No active requests matching criteria.
              </div>
            ) : (
              filteredQueue.map((req) => {
                const isSelected = activeReq?.id === req.id;
                const quoteCount = req.supplierQuotes ? req.supplierQuotes.length : 0;

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`p-4 rounded-3xl border transition cursor-pointer relative ${
                      isSelected
                        ? "bg-white border-rose-500 shadow-md ring-2 ring-rose-500/10"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900">
                            {req.referenceNumber}
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="text-xs font-bold text-slate-800 mt-1">
                          {req.part.partName}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          quoteCount > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {quoteCount} {quoteCount === 1 ? "Quote" : "Quotes"}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-2">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • VIN: {req.vehicle.vin}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        {req.customerName}
                      </span>
                      <span className="font-mono text-slate-500">
                        {req.part.oemPartNumber || "OEM Spec"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SOURCING & QUOTATION WORKSPACE (7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {activeReq ? (
            <>
              {/* Part & Fitment Specifications Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-500">
                        {activeReq.referenceNumber}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-700">
                        Customer: {activeReq.customerName}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {activeReq.part.partName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowExceptionModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Raise Exception</span>
                    </button>
                  </div>
                </div>

                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      OEM Part Number
                    </span>
                    <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                      {activeReq.part.oemPartNumber || "Pending Sourcing"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Vehicle VIN
                    </span>
                    <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate">
                      {activeReq.vehicle.vin}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Preference
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">
                      {activeReq.part.genuinePreference.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Weight Estimate
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">
                      {activeReq.part.weightEstKg ? `${activeReq.part.weightEstKg} kg` : "Est. 5.0 kg"}
                    </span>
                  </div>
                </div>

                {activeReq.part.descriptionNotes && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600">
                    <span className="font-bold text-slate-700 mr-1.5">Customer Notes:</span>
                    {activeReq.part.descriptionNotes}
                  </div>
                )}
              </div>

              {/* Side-by-Side Supplier Quotations Matrix */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Recorded Supplier Quotes ({activeReq.supplierQuotes ? activeReq.supplierQuotes.length : 0})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Select winning quote to feed into Landed Cost &amp; Margin Builder
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddSupplierQuote(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quote</span>
                  </button>
                </div>

                {!activeReq.supplierQuotes || activeReq.supplierQuotes.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                    <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">No Supplier Quotes Recorded Yet</div>
                    <p className="text-[11px] text-slate-500">
                      Contact international vendors or click &quot;Record Supplier Quote&quot; above to enter vendor pricing.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeReq.supplierQuotes.map((sq) => {
                      const isSelected = selectedSupplierQuoteId === sq.id;
                      return (
                        <div
                          key={sq.id}
                          onClick={() => setSelectedSupplierQuoteId(sq.id)}
                          className={`p-4 rounded-2xl border transition cursor-pointer relative ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-md"
                              : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold">{sq.supplierName}</div>
                              <div className={`text-[10px] mt-0.5 ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                                {sq.supplierCountry} • Lead Time: {sq.availabilityDays} days
                              </div>
                            </div>

                            {sq.isRecommendedByAi && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>AI Pick</span>
                              </span>
                            )}
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200/40 flex items-baseline justify-between">
                            <div>
                              <div className="text-[10px] opacity-70">Overseas Cost</div>
                              <div className="font-mono font-bold text-xs">
                                {sq.partCostForeign.toLocaleString()} {sq.partCostCurrency}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] opacity-70">Landed NZD</div>
                              <div className="font-mono font-black text-sm">
                                ${(sq.partCostNzd + sq.domesticFreightNzd).toFixed(2)} NZD
                              </div>
                            </div>
                          </div>

                          {sq.notes && (
                            <div className={`mt-2 text-[10px] line-clamp-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                              {sq.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interactive Customer Landed Cost & Margin Builder */}
              {winningQuote && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Customer Landed Cost &amp; Margin Builder
                      </h3>
                      <p className="text-xs text-slate-500">
                        Synthesize verified NZ trade customer quotation
                      </p>
                    </div>

                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800">
                      Selected: {winningQuote.supplierName}
                    </span>
                  </div>

                  {/* Target Margin Slider */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-rose-600" />
                        Target Sourcing Margin:
                      </span>
                      <span className="font-mono font-black text-rose-600 text-sm">
                        {targetMargin.toFixed(1)}% (+${calculatedMarginAmount.toFixed(2)} NZD)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      step="0.5"
                      value={targetMargin}
                      onChange={(e) => setTargetMargin(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>10.0% (High-Volume Trade)</span>
                      <span>18.0% (Standard Benchmark)</span>
                      <span>35.0% (Prestige / Rare OEM)</span>
                    </div>
                  </div>

                  {/* Freight Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800">
                      Primary International Freight Channel:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          selectedFreightOption === "AIR_EXPRESS"
                            ? "bg-rose-50/70 border-rose-400 text-slate-900 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="freight"
                            checked={selectedFreightOption === "AIR_EXPRESS"}
                            onChange={() => setSelectedFreightOption("AIR_EXPRESS")}
                            className="accent-rose-600"
                          />
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <Plane className="w-3.5 h-3.5 text-rose-600" />
                              <span>Air Express Priority</span>
                            </div>
                            <div className="text-[10px] text-slate-500">3 - 5 business days</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs">${airFreightCost.toFixed(2)} NZD</span>
                      </label>

                      <label
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          selectedFreightOption === "SEA_FREIGHT"
                            ? "bg-rose-50/70 border-rose-400 text-slate-900 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="freight"
                            checked={selectedFreightOption === "SEA_FREIGHT"}
                            onChange={() => setSelectedFreightOption("SEA_FREIGHT")}
                            className="accent-rose-600"
                          />
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <Anchor className="w-3.5 h-3.5 text-blue-600" />
                              <span>Sea Freight Consolidated</span>
                            </div>
                            <div className="text-[10px] text-slate-500">14 - 18 business days</div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs">${seaFreightCost.toFixed(2)} NZD</span>
                      </label>
                    </div>
                  </div>

                  {/* Pricing Breakdown Summary Table */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Landed Part Cost (Ex-Supplier Hub):</span>
                      <span>${landedCostNzd.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sourcing Margin ({targetMargin.toFixed(1)}%):</span>
                      <span className="text-rose-400">+${calculatedMarginAmount.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Procurement Facilitation Fee:</span>
                      <span>+${procurementFee.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>International Freight ({selectedFreightOption === "AIR_EXPRESS" ? "Air" : "Sea"}):</span>
                      <span>+${activeFreightCost.toFixed(2)} NZD</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-slate-300">
                      <span>Subtotal (excl. GST):</span>
                      <span>${subtotalBeforeGst.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>NZ GST (15%):</span>
                      <span>+${gstAmount.toFixed(2)} NZD</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700 flex justify-between font-black text-sm text-white">
                      <span>Total Customer Quote (incl. GST):</span>
                      <span className="text-emerald-400">${grandTotal.toFixed(2)} NZD</span>
                    </div>
                  </div>

                  {/* Notes to Customer Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      Sourcing Specialist Advisory Notes to Customer:
                    </label>
                    <textarea
                      rows={2}
                      value={sourcingNotesToCustomer}
                      onChange={(e) => setSourcingNotesToCustomer(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>

                  {/* Issue Quote CTA */}
                  <button
                    type="button"
                    onClick={handleIssueQuote}
                    className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Issue Verified Customer Quote (${grandTotal.toFixed(2)} NZD)</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select a request from the queue to start quotation.
            </div>
          )}
        </div>
      </div>

      {/* ================= RECORD SUPPLIER QUOTE MODAL ================= */}
      {showAddSupplierQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Record Overseas Supplier Quote
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSupplierQuote(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplierQuote} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Select Supplier:</label>
                <select
                  value={quoteSupplierId}
                  onChange={(e) => setQuoteSupplierId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.country} • {s.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Part Cost (Foreign Currency):</label>
                  <input
                    type="number"
                    value={foreignCost}
                    onChange={(e) => setForeignCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Domestic Freight (Foreign):</label>
                  <input
                    type="number"
                    value={foreignFreight}
                    onChange={(e) => setForeignFreight(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Availability / Lead Time (Days):</label>
                <input
                  type="number"
                  value={quoteAvailabilityDays}
                  onChange={(e) => setQuoteAvailabilityDays(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Notes / Hub Inventory Condition:</label>
                <input
                  type="text"
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierQuote(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Save Supplier Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RAISE EXCEPTION MODAL ================= */}
      {showExceptionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Flag Sourcing Exception
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExceptionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRaiseException} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Exception Category:</label>
                <select
                  value={exceptionCategory}
                  onChange={(e) => setExceptionCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Factory Discontinued">Factory Discontinued (OEM Obsolete)</option>
                  <option value="Severe Manufacturer Backorder">Severe Manufacturer Backorder (&gt;30 days)</option>
                  <option value="Fitment / Chassis Split Conflict">Fitment / Chassis Split Conflict</option>
                  <option value="Supplier Price Surge">Supplier Price Surge (&gt;25% over estimate)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Detailed Sourcing Specialist Reason:</label>
                <textarea
                  rows={3}
                  required
                  value={exceptionReason}
                  onChange={(e) => setExceptionReason(e.target.value)}
                  placeholder="Explain the supplier constraint and recommended alternative course of action..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExceptionModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Confirm &amp; Route to Exceptions Desk
                </button>
              </div>
            </form>
          </div>
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
