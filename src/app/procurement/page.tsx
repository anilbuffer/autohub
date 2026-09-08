"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Building2,
  CheckSquare,
  Truck,
  AlertTriangle,
  Search,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  Anchor,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
  Eye,
  Sliders,
  FileCheck,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSuppliers,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests, initialSuppliers } from "@/lib/mockData";
import { PartRequest, SupplierProfile, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AIQuoteModal } from "@/components/AIQuoteModal";

export default function ProcurementCommandCenterPage() {
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(initialSuppliers);
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiModalRequest, setAiModalRequest] = useState<PartRequest | null>(null);

  // FX Sensitivity Simulator State
  const [jpyShift, setJpyShift] = useState<number>(0); // -5% to +5%

  useEffect(() => {
    setRequests(getStoredRequests());
    setSuppliers(getStoredSuppliers());

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      setSuppliers(getStoredSuppliers());
    });
    return unsub;
  }, []);

  // Derived Queues
  const sourcingQueue = requests.filter(
    (r) => r.status === "SOURCING" || r.status === "SUBMITTED"
  );
  const quotesIssuedQueue = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  );
  const paymentAwaitingQueue = requests.filter(
    (r) => r.status === "AWAITING_PAYMENT"
  );
  const poGateQueue = requests.filter(
    (r) => r.status === "PAYMENT_CONFIRMED"
  );
  const inTransitQueue = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
      r.status === "IN_TRANSIT" ||
      r.status === "ARRIVED_IN_NZ" ||
      r.status === "CUSTOMS_CLEARANCE"
  );
  const deliveredQueue = requests.filter(
    (r) => r.status === "OUT_FOR_DELIVERY" || r.status === "DELIVERED" || r.status === "COMPLETED"
  );
  const exceptionsQueue = requests.filter(
    (r) => r.status === "SOURCING_EXCEPTION"
  );

  // Total Pipeline Value ($NZD)
  const totalPipelineValue = requests.reduce((acc, r) => {
    if (r.quote?.totalNzd) return acc + r.quote.totalNzd;
    if (r.invoice?.totalNzd) return acc + r.invoice.totalNzd;
    return acc + 1200; // conservative estimate for in-sourcing
  }, 0);

  // Funnel Filtered Requests
  const filteredRequests = requests.filter((r) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.referenceNumber.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q);
      if (!matchSearch) return false;
    }

    if (selectedFunnelStage === "ALL") return true;
    if (selectedFunnelStage === "SOURCING") return r.status === "SOURCING" || r.status === "SUBMITTED";
    if (selectedFunnelStage === "QUOTED") return r.status === "AWAITING_CUSTOMER_APPROVAL";
    if (selectedFunnelStage === "PAYMENT") return r.status === "AWAITING_PAYMENT";
    if (selectedFunnelStage === "PO_GATE") return r.status === "PAYMENT_CONFIRMED";
    if (selectedFunnelStage === "IN_TRANSIT") return inTransitQueue.some((t) => t.id === r.id);
    if (selectedFunnelStage === "DELIVERED") return deliveredQueue.some((d) => d.id === r.id);
    if (selectedFunnelStage === "EXCEPTIONS") return r.status === "SOURCING_EXCEPTION";
    return true;
  });

  // Base JPY Rate = 0.0108 NZD (1 JPY = 0.0108 NZD, or ~92.5 JPY per NZD)
  const baseJpyRate = 0.0108;
  const simulatedJpyRate = baseJpyRate * (1 + jpyShift / 100);
  const samplePartJpy = 65000;
  const sampleCostBase = samplePartJpy * baseJpyRate;
  const sampleCostSimulated = samplePartJpy * simulatedJpyRate;
  const sampleDifference = sampleCostSimulated - sampleCostBase;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* ================= COMMAND CENTER HERO BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a152d] to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl shadow-slate-950/20">
        {/* Decorative Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[11px] tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                COMMAND CENTER LIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DESK AH-PROC-084 • NATHAN COLE
              </span>
              <span className="hidden sm:inline text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">
                NAGOYA LOGISTICS TERMINAL &amp; AUCKLAND TRADE HQ
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Global Procurement <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Command Center</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time multi-currency JDM and European OEM sourcing desk. Monitor supplier quotation turnaround velocity, enforce the payment gate, and coordinate door-to-door freight milestones.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link
              href="/procurement/queue"
              className="flex-1 lg:flex-none px-5 py-3 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs tracking-wide shadow-lg shadow-red-950/30 transition flex items-center justify-center gap-2 group"
            >
              <Compass className="w-4 h-4 text-white transition group-hover:rotate-45" />
              <span>Sourcing Queue ({sourcingQueue.length})</span>
            </Link>

            <Link
              href="/procurement/orders"
              className="flex-1 lg:flex-none px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
            >
              <CheckSquare className="w-4 h-4 text-white" />
              <span>PO Gate ({poGateQueue.length})</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                const req = sourcingQueue[0] || requests[0];
                setAiModalRequest(req);
                setShowAiModal(true);
              }}
              className="px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">AI Quote Synthesizer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4 EXECUTIVE KPI METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Sourcing Velocity */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Sourcing Velocity
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              3.4 <span className="text-base font-semibold text-slate-500">hrs</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 42% faster
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Average request-to-quote issuance (SLA target: &lt;6 hrs)
          </p>
        </div>

        {/* Metric 2: Supplier On-Time Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Supplier SLA Reliability
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              98.4%
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +1.2% this mo
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            5 International verified hubs (Nagoya, Osaka, Munich, LA, Sydney)
          </p>
        </div>

        {/* Metric 3: Average Landed Margin */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Average Landed Margin
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              21.4%
            </span>
            <span className="text-xs font-bold text-slate-500">
              Target: 18.0%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Net procurement profit margin across active quotes
          </p>
        </div>

        {/* Metric 4: Active Sourcing Pipeline */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Pipeline Value
            </span>
            <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ${totalPipelineValue.toLocaleString("en-NZ", { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              NZD
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {requests.length} Total orders across end-to-end lifecycle
          </p>
        </div>
      </div>

      {/* ================= HIGH PRIORITY OPERATIONAL RADAR ================= */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-5 sm:p-6 border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-sm">
              !
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                High-Priority Operational Radar
              </h2>
              <p className="text-xs text-slate-500">
                Actionable gates requiring Sourcing Specialist attention right now
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {sourcingQueue.length + poGateQueue.length + exceptionsQueue.length} Pending Actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: Urgent Quote Needed */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-700">AH-P-000140</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                  Air Priority SLA
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                2022 Toyota Prado KDSS Cylinder
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                2 Japanese supplier quotes recorded. Landed cost calculated. Ready to issue customer quote.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Customer: AutoCare AKL</span>
              <Link
                href="/procurement/queue?req=AH-P-000140"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>Finalize Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Payment Cleared PO Gate */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-emerald-700">AH-P-000124</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Payment Verified
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                2022 Ford Ranger Bi-Turbo Intercooler
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                $1,280.00 NZD payment cleared via Trade Credit. Release funds and transmit purchase order to supplier.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Hub: Nagoya Terminal</span>
              <Link
                href="/procurement/orders"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Transmit PO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Active Sourcing Exception */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200/80 shadow-sm flex flex-col justify-between hover:border-rose-400 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-rose-700">AH-P-000130</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                  OEM Discontinued
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                1996 Land Cruiser 80 Steering Box
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Factory discontinued by Toyota Japan. Verified Japanese remanufactured alternative available.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Match: 24m Warranty</span>
              <Link
                href="/procurement/exceptions"
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>Review Alternative</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7-STAGE PROCUREMENT PIPELINE FUNNEL ================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Procurement Lifecycle Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Click any stage to filter active orders across Autohub’s door-to-door workflow
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, VIN, part..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        {/* Funnel Stage Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {/* Stage ALL */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("ALL")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "ALL"
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Overview
            </div>
            <div className="text-base font-black mt-0.5">{requests.length}</div>
            <div className="text-[10px] opacity-80 mt-1">All Orders</div>
          </button>

          {/* Stage 1: Sourcing */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("SOURCING")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "SOURCING"
                ? "bg-amber-600 text-white border-amber-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Stage 1
            </div>
            <div className="text-base font-black mt-0.5">{sourcingQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">In Sourcing</div>
          </button>

          {/* Stage 2: Quoted */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("QUOTED")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "QUOTED"
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Stage 2
            </div>
            <div className="text-base font-black mt-0.5">{quotesIssuedQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">Quotes Issued</div>
          </button>

          {/* Stage 3: Awaiting Payment */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("PAYMENT")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "PAYMENT"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Stage 3
            </div>
            <div className="text-base font-black mt-0.5">{paymentAwaitingQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">Awaiting Pay</div>
          </button>

          {/* Stage 4: PO Gate */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("PO_GATE")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "PO_GATE"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Stage 4
            </div>
            <div className="text-base font-black mt-0.5">{poGateQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">PO Release Gate</div>
          </button>

          {/* Stage 5: In Transit */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("IN_TRANSIT")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "IN_TRANSIT"
                ? "bg-sky-600 text-white border-sky-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Stage 5
            </div>
            <div className="text-base font-black mt-0.5">{inTransitQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">In Freight / Port</div>
          </button>

          {/* Stage 6: Exceptions */}
          <button
            type="button"
            onClick={() => setSelectedFunnelStage("EXCEPTIONS")}
            className={`p-3 rounded-2xl text-left border transition ${
              selectedFunnelStage === "EXCEPTIONS"
                ? "bg-[#ed2025] text-white border-[#ed2025] shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
              Exceptions
            </div>
            <div className="text-base font-black mt-0.5">{exceptionsQueue.length}</div>
            <div className="text-[10px] opacity-80 mt-1">Sourcing Alert</div>
          </button>
        </div>

        {/* Filtered Pipeline Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              Showing {filteredRequests.length} Orders in Active Pipeline
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Stage:</span>
              <span className="text-xs font-bold text-slate-800">
                {selectedFunnelStage}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {filteredRequests.map((req) => {
              const quoteCount = req.supplierQuotes ? req.supplierQuotes.length : 0;
              return (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {req.vehicle.make.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <StatusBadge status={req.status} />
                        {quoteCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {quoteCount} {quoteCount === 1 ? "quote" : "quotes"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {req.part.partName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • VIN: {req.vehicle.vin} • Customer: {req.customerName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {req.quote?.totalNzd
                          ? `$${req.quote.totalNzd.toFixed(2)} NZD`
                          : req.invoice?.totalNzd
                          ? `$${req.invoice.totalNzd.toFixed(2)} NZD`
                          : "Evaluating Quotes"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {req.quote?.selectedFreightMethod === "AIR_EXPRESS"
                          ? "Air Express"
                          : req.quote?.selectedFreightMethod === "SEA_FREIGHT"
                          ? "Sea Freight"
                          : "Freight Pending"}
                      </div>
                    </div>

                    {/* Contextual Jump Button */}
                    {req.status === "SOURCING_EXCEPTION" ? (
                      <Link
                        href="/procurement/exceptions"
                        className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <span>Resolve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : req.status === "PAYMENT_CONFIRMED" ? (
                      <Link
                        href="/procurement/orders"
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <span>Transmit PO</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : req.status === "IN_TRANSIT" || req.status === "CUSTOMS_CLEARANCE" ? (
                      <Link
                        href="/procurement/tracking"
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <span>Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/procurement/queue?req=${req.referenceNumber}`}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <span>Workspace</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= FX SENSITIVITY WATCH & DESK LAUNCHER ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: FX Risk & Japanese Yen Sensitivity Calculator */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Global FX Currency &amp; Landed Margin Sensitivity
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Simulate exchange rate fluctuations and protect trade margin realization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Live Rate:</span>
              <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800">
                1 JPY = {baseJpyRate} NZD
              </span>
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">JPY Currency Shift Simulation:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded-lg text-xs ${
                  jpyShift > 0
                    ? "bg-rose-100 text-rose-800"
                    : jpyShift < 0
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {jpyShift > 0 ? `+${jpyShift}% (JPY Stronger)` : jpyShift < 0 ? `${jpyShift}% (JPY Weaker)` : "0% (Spot Baseline)"}
              </span>
            </div>

            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={jpyShift}
              onChange={(e) => setJpyShift(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-10% Weaker (Margin Boost)</span>
              <span>Baseline (Spot)</span>
              <span>+10% Stronger (Margin Compression)</span>
            </div>
          </div>

          {/* Impact Calculation Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Simulated Rate
              </div>
              <div className="text-base font-mono font-black text-slate-800 mt-1">
                {simulatedJpyRate.toFixed(5)} <span className="text-[10px] text-slate-500">NZD</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {(1 / simulatedJpyRate).toFixed(1)} ¥ per $1 NZD
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Sample ¥65,000 Part Cost
              </div>
              <div className="text-base font-mono font-black text-slate-800 mt-1">
                ${sampleCostSimulated.toFixed(2)} <span className="text-[10px] text-slate-500">NZD</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Spot baseline: ${sampleCostBase.toFixed(2)} NZD
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Landed Cost Variance
              </div>
              <div
                className={`text-base font-mono font-black mt-1 ${
                  sampleDifference > 0
                    ? "text-rose-600"
                    : sampleDifference < 0
                    ? "text-emerald-600"
                    : "text-slate-800"
                }`}
              >
                {sampleDifference > 0
                  ? `+$${sampleDifference.toFixed(2)} NZD`
                  : sampleDifference < 0
                  ? `-$${Math.abs(sampleDifference).toFixed(2)} NZD`
                  : "$0.00 NZD"}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {sampleDifference > 0 ? "Absorbed in margin" : "Extra profit realized"}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Dedicated Desk Launchers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Dedicated Procurement Desks
          </h3>
          <p className="text-xs text-slate-500">
            Direct access to specialized sourcing consoles
          </p>

          <div className="space-y-2 pt-1">
            <Link
              href="/procurement/queue"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                    Sourcing Queue &amp; Quotes
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {sourcingQueue.length} Active requests to source
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
            </Link>

            <Link
              href="/procurement/suppliers"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                    Supplier Directory
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {suppliers.length} Verified overseas vendors
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
            </Link>

            <Link
              href="/procurement/orders"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                    Place Supplier POs
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {poGateQueue.length} Payment-cleared release gate
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
            </Link>

            <Link
              href="/procurement/tracking"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                    Progress &amp; Port Tracking
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {inTransitQueue.length} Freight consignments in flight
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
            </Link>

            <Link
              href="/procurement/exceptions"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">
                    Sourcing Exceptions
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {exceptionsQueue.length} Discontinued / delay items
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= AI QUOTE MODAL ================= */}
      {aiModalRequest && (
        <AIQuoteModal
          request={aiModalRequest}
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
        />
      )}
    </div>
  );
}
