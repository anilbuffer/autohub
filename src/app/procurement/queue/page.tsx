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
  ArrowLeft,
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
  initialRequests,
  initialSuppliers,
} from "@/lib/mockData";
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

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(initialSuppliers);
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

    if (initialReqParam) {
      const match = loaded.find((r) => r.id === initialReqParam || r.referenceNumber === initialReqParam);
      if (match) setSelectedRequestId(match.id);
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

      {/* Main Content: Table List or Full Details View */}
      {!selectedRequestId || !activeReq ? (
        /* ================= FULL-WIDTH SOURCING QUEUE TABLE LIST ================= */
        <div className="space-y-4">
          {/* Triage Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by ref, vehicle, part name, customer..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Urgency Filter Chips */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">Filter:</span>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setUrgencyFilter("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    urgencyFilter === "ALL"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Requests ({filteredQueue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUrgencyFilter("URGENT")}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    urgencyFilter === "URGENT"
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Urgent OEM Only
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Table View */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 pl-6">Reference &amp; Date</th>
                    <th className="py-3.5 px-4">Requested Part</th>
                    <th className="py-3.5 px-4">Target Vehicle &amp; VIN</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Quotes Recorded</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        No active sourcing requests matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((req) => {
                      const quoteCount = req.supplierQuotes ? req.supplierQuotes.length : 0;
                      return (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition group">
                          <td className="py-3.5 px-4 pl-6">
                            <div className="font-mono font-bold text-slate-900">{req.referenceNumber}</div>
                            <div className="text-[11px] text-slate-400">{new Date(req.submittedDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{req.part.partName}</div>
                            <div className="font-mono text-[11px] text-slate-400">{req.part.oemPartNumber || "OEM Genuine Spec"}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</div>
                            <div className="font-mono text-[10px] text-slate-400">VIN: {req.vehicle.vin}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-700">{req.customerName}</div>
                            <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${req.part.genuinePreference === "GENUINE_ONLY" ? "bg-red-50 text-[#ed2025] font-bold" : "bg-slate-100 text-slate-600"}`}>
                              {req.part.genuinePreference}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${quoteCount > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                              {quoteCount} {quoteCount === 1 ? "Quote" : "Quotes"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={req.status} size="sm" />
                          </td>
                          <td className="py-3.5 px-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRequestId(req.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
                            >
                              <span>Source &amp; Quote</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= FULL-WIDTH SOURCING DETAILS VIEW ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Return Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedRequestId("")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sourcing Queue</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-500">Ref: {activeReq.referenceNumber}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">Customer: {activeReq.customerName}</span>
              <StatusBadge status={activeReq.status} />
            </div>
          </div>

          {/* Full-Width Workspace Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Part & Fitment Specs (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
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
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Exception</span>
                    </button>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Target Vehicle
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {activeReq.vehicle.variant || "Series N/A"} • {activeReq.vehicle.transmission || "Auto"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      VIN / Chassis Code
                    </span>
                    <span className="font-mono font-bold text-slate-800 mt-0.5 block truncate" title={activeReq.vehicle.vin}>
                      {activeReq.vehicle.vin}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verified Japanese JDM Spec
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Part Category &amp; Side
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {activeReq.part.category}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Placement: {activeReq.part.descriptionNotes || "Universal/Center"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      OEM Part Number
                    </span>
                    <span className="font-mono font-bold text-rose-600 mt-0.5 block">
                      {activeReq.part.oemPartNumber || "Sourcing Specialist to verify"}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Genuine catalog match
                    </span>
                  </div>
                </div>

                {/* Customer Remarks */}
                {activeReq.part.descriptionNotes && (
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
                    <span className="font-bold text-amber-900 block text-[11px]">
                      Customer Sourcing Notes:
                    </span>
                    <p className="text-slate-700 mt-0.5 italic">
                      "{activeReq.part.descriptionNotes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quotation Workspace & Landed Margin Calculator (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Supplier Quotes Comparison Panel */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Supplier Quotes Recorded ({activeReq.supplierQuotes?.length || 0})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddSupplierQuote(true)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quote</span>
                  </button>
                </div>

                {/* Quotation Cards Grid */}
                <div className="space-y-3">
                  {!activeReq.supplierQuotes || activeReq.supplierQuotes.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-400">
                      <p>No supplier quotes recorded yet for this request.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddSupplierQuote(true)}
                        className="mt-2 text-rose-600 font-bold hover:underline inline-block"
                      >
                        + Record overseas vendor quote
                      </button>
                    </div>
                  ) : (
                    activeReq.supplierQuotes.map((sq) => {
                      const isWinning = selectedSupplierQuoteId === sq.id;

                      return (
                        <div
                          key={sq.id}
                          onClick={() => setSelectedSupplierQuoteId(sq.id)}
                          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isWinning
                              ? "bg-rose-50/40 border-rose-500 ring-2 ring-rose-500/10"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">
                                {sq.supplierName}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {sq.supplierCountry}
                              </span>
                              {sq.isRecommendedByAi && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Best SLA
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-500 mt-1">
                              Lead Time: {sq.availabilityDays} days • Notes: {sq.notes || "None"}
                            </div>
                          </div>

                          <div className="flex sm:flex-col sm:items-end justify-between items-center">
                            <div className="font-mono font-bold text-xs text-slate-900">
                              {sq.partCostCurrency} {sq.partCostForeign.toLocaleString()}
                            </div>
                            <div className="font-mono text-[11px] text-rose-600 font-bold">
                              ${sq.partCostNzd.toFixed(2)} NZD
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Rate: {sq.exchangeRateToNzd}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Quote Builder & Landed Margin Calculator */}
              {winningQuote && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-slate-700" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Landed Cost &amp; Margin Calculator (NZD)
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Base Part: ${baseCostNzd.toFixed(2)} NZD
                    </span>
                  </div>

                  {/* Calculator Sliders & Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Target Margin % */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Target Gross Margin:</span>
                        <span className="font-mono font-black text-rose-600 text-sm">
                          {targetMargin}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="35"
                        step="0.5"
                        value={targetMargin}
                        onChange={(e) => setTargetMargin(parseFloat(e.target.value))}
                        className="w-full accent-rose-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>10% (Floor)</span>
                        <span>18% (Target)</span>
                        <span>35% (Premium)</span>
                      </div>
                    </div>

                    {/* Procurement Coordination Fee */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Procurement Fee:</span>
                        <span className="font-mono font-black text-slate-900 text-sm">
                          ${procurementFee.toFixed(2)} NZD
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="150"
                        step="5"
                        value={procurementFee}
                        onChange={(e) => setProcurementFee(parseFloat(e.target.value))}
                        className="w-full accent-slate-800"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>$30</span>
                        <span>$60 (Std)</span>
                        <span>$150</span>
                      </div>
                    </div>
                  </div>

                  {/* Freight Method Options */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Freight Options Included for Customer Selection:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Priority Air */}
                      <div
                        onClick={() => setSelectedFreightOption("AIR_EXPRESS")}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          selectedFreightOption === "AIR_EXPRESS"
                            ? "bg-rose-50/50 border-rose-500 ring-1 ring-rose-500"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Plane className="w-4 h-4 text-rose-600" />
                          <div>
                            <div className="font-bold text-xs text-slate-900">Priority Airfreight</div>
                            <div className="text-[10px] text-slate-400">3 - 5 business days</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs text-slate-900">
                          ${airFreightCost.toFixed(2)} NZD
                        </div>
                      </div>

                      {/* Ocean Consolidation */}
                      <div
                        onClick={() => setSelectedFreightOption("SEA_FREIGHT")}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          selectedFreightOption === "SEA_FREIGHT"
                            ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Anchor className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-bold text-xs text-slate-900">Ocean Consolidation</div>
                            <div className="text-[10px] text-slate-400">14 - 18 business days</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-xs text-slate-900">
                          ${seaFreightCost.toFixed(2)} NZD
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Landed Cost Breakdown Summary Table */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Landed Foreign Part:</span>
                      <span>${landedCostNzd.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Target Margin Amount ({targetMargin}%):</span>
                      <span className="text-emerald-400">+${calculatedMarginAmount.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Procurement &amp; Documentation:</span>
                      <span>+${procurementFee.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Selected Freight ({selectedFreightOption}):</span>
                      <span>+${activeFreightCost.toFixed(2)} NZD</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>NZ GST (15%):</span>
                      <span>+${gstAmount.toFixed(2)} NZD</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold font-sans text-white">
                      <span>Total Customer Quote (NZD):</span>
                      <span className="text-rose-400 font-mono text-base">
                        ${grandTotal.toFixed(2)} NZD
                      </span>
                    </div>
                  </div>

                  {/* Specialist Note to Customer */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Sourcing Specialist Advisory Note:
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
                    className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Issue Verified Customer Quote (${grandTotal.toFixed(2)} NZD)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
