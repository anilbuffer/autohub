"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Package,
  Ship,
  Plane,
  Calculator,
  Sliders,
  AlertTriangle,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
  Eye,
  FileCheck2,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  ExternalLink,
  Plus,
} from "lucide-react";
import {
  getStoredRequests,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests } from "@/lib/mockData";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function OperationsCommandCenterPage() {
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [selectedStage, setSelectedStage] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Filter queues
  const readyToShip = requests.filter(
    (r) =>
      (r.status === "PAYMENT_CONFIRMED" || r.status === "ORDERED_FROM_SUPPLIER") &&
      !r.shipment
  );

  const receivedFacility = requests.filter(
    (r) => r.status === "RECEIVED_AT_SHIPPING_FACILITY" || r.status === "SUPPLIER_DISPATCHED"
  );

  const inTransit = requests.filter(
    (r) => r.status === "IN_TRANSIT"
  );

  const arrivedNZ = requests.filter(
    (r) => r.status === "ARRIVED_IN_NZ"
  );

  const customsClearance = requests.filter(
    (r) => r.status === "CUSTOMS_CLEARANCE"
  );

  const outForDelivery = requests.filter(
    (r) => r.status === "OUT_FOR_DELIVERY"
  );

  const delivered = requests.filter(
    (r) => r.status === "DELIVERED" || r.status === "COMPLETED"
  );

  const exceptions = requests.filter(
    (r) => r.status === "LOGISTICS_EXCEPTION"
  );

  // Air vs Sea counts
  const airActiveCount = requests.filter(
    (r) =>
      r.quote?.selectedFreightMethod === "AIR_EXPRESS" &&
      r.status !== "DELIVERED" &&
      r.status !== "COMPLETED"
  ).length;

  const seaActiveCount = requests.filter(
    (r) =>
      r.quote?.selectedFreightMethod === "SEA_FREIGHT" &&
      r.status !== "DELIVERED" &&
      r.status !== "COMPLETED"
  ).length;

  // Filtered requests list
  const filteredRequests = requests.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.referenceNumber.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.shipment?.carrier && r.shipment.carrier.toLowerCase().includes(q)) ||
        (r.shipment?.trackingNumber && r.shipment.trackingNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedStage === "ALL") return true;
    if (selectedStage === "READY_TO_SHIP") return readyToShip.some((x) => x.id === r.id);
    if (selectedStage === "RECEIVED_AT_SHIPPING_FACILITY")
      return r.status === "RECEIVED_AT_SHIPPING_FACILITY" || r.status === "SUPPLIER_DISPATCHED";
    if (selectedStage === "IN_TRANSIT") return r.status === "IN_TRANSIT";
    if (selectedStage === "ARRIVED_IN_NZ") return r.status === "ARRIVED_IN_NZ";
    if (selectedStage === "CUSTOMS_CLEARANCE") return r.status === "CUSTOMS_CLEARANCE";
    if (selectedStage === "OUT_FOR_DELIVERY") return r.status === "OUT_FOR_DELIVERY";
    if (selectedStage === "DELIVERED") return r.status === "DELIVERED" || r.status === "COMPLETED";
    if (selectedStage === "LOGISTICS_EXCEPTION") return r.status === "LOGISTICS_EXCEPTION";

    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#070e1e] via-[#0d1c3a] to-[#070e1e] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ed2025]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#ed2025] animate-pulse" />
              <span>International Air &amp; Ocean Logistics Gateway</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Cross-Border Automotive Freight Desk
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Consolidated cargo tracking across Japan, Europe, Australia, and the Americas.
              Manage freight calculations, live waybills, customs entry clearance, and final workshop delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/operations/shipments?action=create"
              className="px-4 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold text-xs transition shadow-lg shadow-red-900/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Shipment</span>
            </Link>
            <Link
              href="/operations/freight"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-[#ed2025]" />
              <span>Freight Rules</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Ready to Ship */}
        <button
          type="button"
          onClick={() => setSelectedStage("READY_TO_SHIP")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "READY_TO_SHIP"
              ? "bg-amber-500/10 border-amber-500/80 shadow-md ring-2 ring-amber-500/20"
              : "bg-white border-slate-200/80 hover:border-amber-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Ready to Book
            </span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">
            {readyToShip.length}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-1">
            Payment Cleared POs
          </div>
        </button>

        {/* Card 2: In International Transit */}
        <button
          type="button"
          onClick={() => setSelectedStage("IN_TRANSIT")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "IN_TRANSIT"
              ? "bg-blue-500/10 border-blue-500/80 shadow-md ring-2 ring-blue-500/20"
              : "bg-white border-slate-200/80 hover:border-blue-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              In Transit
            </span>
            <Plane className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">
            {inTransit.length}
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">
            Air &amp; Sea En Route
          </div>
        </button>

        {/* Card 3: Arrived in NZ */}
        <button
          type="button"
          onClick={() => setSelectedStage("ARRIVED_IN_NZ")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "ARRIVED_IN_NZ"
              ? "bg-indigo-500/10 border-indigo-500/80 shadow-md ring-2 ring-indigo-500/20"
              : "bg-white border-slate-200/80 hover:border-indigo-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Arrived in NZ
            </span>
            <MapPin className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">
            {arrivedNZ.length}
          </div>
          <div className="text-[10px] text-indigo-600 font-medium mt-1">
            AKL / CHC Terminals
          </div>
        </button>

        {/* Card 4: Customs & MPI */}
        <button
          type="button"
          onClick={() => setSelectedStage("CUSTOMS_CLEARANCE")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "CUSTOMS_CLEARANCE"
              ? "bg-cyan-500/10 border-cyan-500/80 shadow-md ring-2 ring-cyan-500/20"
              : "bg-white border-slate-200/80 hover:border-cyan-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Customs &amp; MPI
            </span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">
            {customsClearance.length}
          </div>
          <div className="text-[10px] text-cyan-600 font-medium mt-1">
            Biosecurity Verification
          </div>
        </button>

        {/* Card 5: Out For Delivery */}
        <button
          type="button"
          onClick={() => setSelectedStage("OUT_FOR_DELIVERY")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "OUT_FOR_DELIVERY"
              ? "bg-emerald-500/10 border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20"
              : "bg-white border-slate-200/80 hover:border-emerald-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Out for Delivery
            </span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none">
            {outForDelivery.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            Local Courier Courier
          </div>
        </button>

        {/* Card 6: Exceptions */}
        <button
          type="button"
          onClick={() => setSelectedStage("LOGISTICS_EXCEPTION")}
          className={`p-4 rounded-2xl border text-left transition-all ${
            selectedStage === "LOGISTICS_EXCEPTION"
              ? "bg-rose-500/10 border-rose-500/80 shadow-md ring-2 ring-rose-500/20"
              : "bg-white border-slate-200/80 hover:border-rose-300 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
              Exceptions
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 leading-none">
            {exceptions.length}
          </div>
          <div className="text-[10px] text-rose-500 font-medium mt-1">
            Holds Requiring Action
          </div>
        </button>
      </div>

      {/* 6-Stage Interactive Logistics Lifecycle Funnel */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              International Logistics Lifecycle Funnel
            </h3>
            <p className="text-slate-500 text-xs">
              Click a stage to filter active consignments below or manage milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedStage("ALL")}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedStage === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              Show All ({requests.length})
            </button>
          </div>
        </div>

        {/* 6 Steps Stepper Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            {
              num: "1",
              stage: "RECEIVED_AT_SHIPPING_FACILITY",
              title: "Export Facility",
              subtitle: "Received & Crated",
              count: receivedFacility.length,
              color: "text-cyan-700 bg-cyan-50 border-cyan-200",
            },
            {
              num: "2",
              stage: "IN_TRANSIT",
              title: "In Transit",
              subtitle: "Flight / Ocean Line",
              count: inTransit.length,
              color: "text-blue-700 bg-blue-50 border-blue-200",
            },
            {
              num: "3",
              stage: "ARRIVED_IN_NZ",
              title: "Arrived in NZ",
              subtitle: "Port / Bond Store",
              count: arrivedNZ.length,
              color: "text-indigo-700 bg-indigo-50 border-indigo-200",
            },
            {
              num: "4",
              stage: "CUSTOMS_CLEARANCE",
              title: "Customs & MPI",
              subtitle: "Bio-Security Gate",
              count: customsClearance.length,
              color: "text-teal-700 bg-teal-50 border-teal-200",
            },
            {
              num: "5",
              stage: "OUT_FOR_DELIVERY",
              title: "Out for Delivery",
              subtitle: "Final Metro Courier",
              count: outForDelivery.length,
              color: "text-emerald-700 bg-emerald-50 border-emerald-200",
            },
            {
              num: "6",
              stage: "DELIVERED",
              title: "Delivered",
              subtitle: "POD Confirmed",
              count: delivered.length,
              color: "text-slate-700 bg-slate-50 border-slate-200",
            },
          ].map((step) => {
            const isSelected = selectedStage === step.stage;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setSelectedStage(step.stage)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? "ring-2 ring-cyan-600 shadow-md bg-white border-cyan-500"
                    : `${step.color} hover:shadow-xs`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/80 border border-slate-200/60">
                    Stage {step.num}
                  </span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded-full bg-white/90">
                    {step.count}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 leading-tight">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Corridors & Priority Holds Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Global Corridors */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Active International Trade Corridors
              </h3>
              <p className="text-slate-500 text-xs">
                Real-time terminal throughput and average transit performance to NZ ports.
              </p>
            </div>
            <Link
              href="/operations/settings"
              className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Corridors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Corridor 1: Japan (Nagoya NGO) -> Auckland AKL */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs">
                  🇯🇵 ✈️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Japan Central Hub (Centrair NGO) → Auckland (AKL)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Air Express: Cathay / Air NZ (3-5 Days) • Ocean: Toyofuji (16 Days)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    SLA 99.4% On-Time
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Direct Flight NZ0090 Active
                  </div>
                </div>
              </div>
            </div>

            {/* Corridor 2: Germany (Frankfurt FRA) -> Auckland AKL */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs">
                  🇩🇪 ✈️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Germany Central Spares Hub (FRA) → Auckland (AKL)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Air Express: Lufthansa Cargo &amp; DHL Express (4-5 Days)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    SLA 98.2% On-Time
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Clearance Green Lane
                  </div>
                </div>
              </div>
            </div>

            {/* Corridor 3: Australia (MEL/SYD) -> Christchurch CHC */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-sm shadow-2xs">
                  🇦🇺 ✈️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Australia Trans-Tasman (MEL/SYD) → Christchurch (CHC)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Air Express: Qantas Freight &amp; Air NZ (1-3 Days)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Rapid Gate 1.9d Avg
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Daily Freight Capacity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Attention Desk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Action Items &amp; Holds
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                {exceptions.length + readyToShip.length} Urgent
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Exceptions item */}
              {exceptions.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/operations/exceptions?id=${ex.id}`}
                  className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/80 hover:bg-rose-100/60 transition block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-rose-800">
                      {ex.referenceNumber}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-200/80 text-rose-900">
                      HOLD ACTIVE
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {ex.part.partName}
                  </div>
                  <div className="text-[11px] text-rose-700 mt-0.5 line-clamp-1">
                    {ex.statusReason || "Logistics exception raised"}
                  </div>
                </Link>
              ))}

              {/* Ready to ship item */}
              {readyToShip.slice(0, 2).map((r) => (
                <Link
                  key={r.id}
                  href={`/operations/shipments?createId=${r.id}`}
                  className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 hover:bg-amber-100/60 transition block"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-amber-800">
                      {r.referenceNumber}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                      BOOK SHIPMENT
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {r.part.partName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {r.customerName} • Paid &amp; ready to manifest
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/operations/exceptions"
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>View All Logistics Exceptions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Consignments Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live Consignments &amp; Waybill Register
            </h3>
            <p className="text-slate-500 text-xs">
              Showing {filteredRequests.length} active consignments across global corridors.
            </p>
          </div>

          {/* Search box & filter indicator */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search waybill, VIN, part..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <Link
              href="/operations/shipments"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs transition flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Full Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 sm:px-6">Consignment / Order</th>
                <th className="py-3 px-4">Vehicle &amp; Part</th>
                <th className="py-3 px-4">Freight Method</th>
                <th className="py-3 px-4">Carrier &amp; Waybill</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No consignments found in this stage or query.
                  </td>
                </tr>
              ) : (
                filteredRequests.slice(0, 10).map((r) => {
                  const isAir = r.quote?.selectedFreightMethod === "AIR_EXPRESS";
                  const isSea = r.quote?.selectedFreightMethod === "SEA_FREIGHT";
                  const hasShipment = !!r.shipment;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-cyan-50/40 transition group"
                    >
                      {/* Order Ref & Customer */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-mono font-bold text-slate-900">
                          {r.referenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {r.customerName}
                        </div>
                      </td>

                      {/* Vehicle & Part */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">
                          {r.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                        </div>
                      </td>

                      {/* Freight Method */}
                      <td className="py-3.5 px-4">
                        {isAir ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 font-semibold text-[10px]">
                            <Plane className="w-3 h-3" />
                            <span>Air Express</span>
                          </span>
                        ) : isSea ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 font-semibold text-[10px]">
                            <Ship className="w-3 h-3" />
                            <span>Sea Freight</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">TBD</span>
                        )}
                      </td>

                      {/* Carrier & Tracking Number */}
                      <td className="py-3.5 px-4">
                        {hasShipment ? (
                          <div>
                            <div className="font-semibold text-slate-900">
                              {r.shipment?.carrier}
                            </div>
                            <div className="font-mono text-[10px] text-cyan-700 font-bold">
                              {r.shipment?.trackingNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            No Waybill Booked
                          </span>
                        )}
                      </td>

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/operations/lifecycle?id=${r.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#ed2025] font-semibold text-[11px] transition"
                            title="Manage Milestones"
                          >
                            Milestones
                          </Link>
                          <Link
                            href={`/operations/freight?id=${r.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-semibold text-[11px] transition"
                            title="Inspect Freight Pricing"
                          >
                            Freight
                          </Link>
                        </div>
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
  );
}
