"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Plane,
  Anchor,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  MapPin,
  Calendar,
  ShieldCheck,
  Building2,
  FileText,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  getStoredRequests,
  updateRequestStatus,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProcurementTrackingPage() {
  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [selectedReqId, setSelectedReqId] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<"ALL" | "AIR" | "SEA" | "CUSTOMS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  useEffect(() => {
    const loaded = getStoredRequests();
    setRequests(loaded);

    const activeTransit = loaded.filter(
      (r) =>
        r.status === "ORDERED_FROM_SUPPLIER" ||
        r.status === "SUPPLIER_DISPATCHED" ||
        r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
        r.status === "IN_TRANSIT" ||
        r.status === "ARRIVED_IN_NZ" ||
        r.status === "CUSTOMS_CLEARANCE" ||
        r.status === "OUT_FOR_DELIVERY"
    );

    if (activeTransit.length > 0) {
      setSelectedReqId(activeTransit[0].id);
    } else if (loaded.length > 0) {
      setSelectedReqId(loaded[0].id);
    }

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Filtered Tracking Items
  const trackingList = requests.filter((r) => {
    const isFreight =
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
      r.status === "IN_TRANSIT" ||
      r.status === "ARRIVED_IN_NZ" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY" ||
      r.status === "DELIVERED";

    if (!isFreight) return false;

    if (modeFilter === "AIR" && r.quote?.selectedFreightMethod !== "AIR_EXPRESS") return false;
    if (modeFilter === "SEA" && r.quote?.selectedFreightMethod !== "SEA_FREIGHT") return false;
    if (modeFilter === "CUSTOMS" && r.status !== "CUSTOMS_CLEARANCE" && r.status !== "ARRIVED_IN_NZ") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.referenceNumber.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.vehicle.vin.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.shipment?.trackingNumber && r.shipment.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeReq = requests.find((r) => r.id === selectedReqId) || trackingList[0] || requests[0];

  // Counts
  const airCount = requests.filter((r) => r.quote?.selectedFreightMethod === "AIR_EXPRESS").length;
  const seaCount = requests.filter((r) => r.quote?.selectedFreightMethod === "SEA_FREIGHT").length;
  const customsCount = requests.filter((r) => r.status === "CUSTOMS_CLEARANCE" || r.status === "ARRIVED_IN_NZ").length;
  const inFlightCount = requests.filter((r) => r.status === "IN_TRANSIT").length;

  // Advance Milestone Simulator
  const handleAdvanceMilestone = () => {
    if (!activeReq) return;

    let nextStatus: RequestStatus = "IN_TRANSIT";
    if (activeReq.status === "ORDERED_FROM_SUPPLIER") nextStatus = "SUPPLIER_DISPATCHED";
    else if (activeReq.status === "SUPPLIER_DISPATCHED") nextStatus = "RECEIVED_AT_SHIPPING_FACILITY";
    else if (activeReq.status === "RECEIVED_AT_SHIPPING_FACILITY") nextStatus = "IN_TRANSIT";
    else if (activeReq.status === "IN_TRANSIT") nextStatus = "ARRIVED_IN_NZ";
    else if (activeReq.status === "ARRIVED_IN_NZ") nextStatus = "CUSTOMS_CLEARANCE";
    else if (activeReq.status === "CUSTOMS_CLEARANCE") nextStatus = "OUT_FOR_DELIVERY";
    else if (activeReq.status === "OUT_FOR_DELIVERY") nextStatus = "DELIVERED";

    updateRequestStatus(
      activeReq.id,
      nextStatus,
      "Nathan Cole (Sourcing Specialist)",
      "SOURCING_SPECIALIST",
      `Logistics milestone advanced to ${nextStatus.replace(/_/g, " ")}`
    );

    setActionSuccessMsg(`Milestone advanced to ${nextStatus.replace(/_/g, " ")}! Store state updated.`);
    setTimeout(() => setActionSuccessMsg(""), 5000);
  };

  // Lifecycle Steps
  const steps = [
    { label: "Ordered from Supplier", status: "ORDERED_FROM_SUPPLIER" },
    { label: "Received at Export Facility", status: "RECEIVED_AT_SHIPPING_FACILITY" },
    { label: "In International Transit", status: "IN_TRANSIT" },
    { label: "Arrived in NZ Port", status: "ARRIVED_IN_NZ" },
    { label: "Customs & Biosecurity", status: "CUSTOMS_CLEARANCE" },
    { label: "Final Bay Delivery", status: "DELIVERED" },
  ];

  const getStepIndex = (st: RequestStatus) => {
    if (st === "ORDERED_FROM_SUPPLIER") return 0;
    if (st === "SUPPLIER_DISPATCHED") return 1;
    if (st === "RECEIVED_AT_SHIPPING_FACILITY") return 1;
    if (st === "IN_TRANSIT") return 2;
    if (st === "ARRIVED_IN_NZ") return 3;
    if (st === "CUSTOMS_CLEARANCE") return 4;
    if (st === "OUT_FOR_DELIVERY" || st === "DELIVERED" || st === "COMPLETED") return 5;
    return -1;
  };

  const currentStepIdx = activeReq ? getStepIndex(activeReq.status) : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              International Logistics Console
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Procurement Progress &amp; Port Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor international air cargo waybills, ocean consolidation containers, NZ Customs / MPI biosecurity releases, and final workshop bay deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
          <Truck className="w-4 h-4 text-blue-600" />
          <span>Cathay Pacific Cargo &amp; Toyofuji Line Connected</span>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Active Consignments
            </span>
            <Package className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {trackingList.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Orders between overseas supplier &amp; workshop
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Priority Airfreight (3-5d)
            </span>
            <Plane className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">
            {airCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Cathay Pacific / Air NZ Cargo express routes
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Ocean Consolidation (14-18d)
            </span>
            <Anchor className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600 mt-2">
            {seaCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Toyofuji Transporter Ro-Ro / FCL containers
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              NZ Customs / MPI Clear
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            {customsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Ports of Auckland &amp; AKL Airport cargo bays
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracking #, reference, VIN, part..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setModeFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl transition ${
              modeFilter === "ALL" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Modes
          </button>
          <button
            type="button"
            onClick={() => setModeFilter("AIR")}
            className={`px-3 py-1.5 rounded-xl transition ${
              modeFilter === "AIR" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Air Express
          </button>
          <button
            type="button"
            onClick={() => setModeFilter("SEA")}
            className={`px-3 py-1.5 rounded-xl transition ${
              modeFilter === "SEA" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Ocean Freight
          </button>
          <button
            type="button"
            onClick={() => setModeFilter("CUSTOMS")}
            className={`px-3 py-1.5 rounded-xl transition ${
              modeFilter === "CUSTOMS" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Customs Gate
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Shipment Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {trackingList.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200">
              No active shipments in this category.
            </div>
          ) : (
            trackingList.map((req) => {
              const isSelected = activeReq?.id === req.id;
              const isAir = req.quote?.selectedFreightMethod === "AIR_EXPRESS";

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-4 sm:p-5 rounded-3xl border transition cursor-pointer relative ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
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

                    <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {isAir ? (
                        <>
                          <Plane className="w-3 h-3 text-rose-600" />
                          <span>Air</span>
                        </>
                      ) : (
                        <>
                          <Anchor className="w-3 h-3 text-blue-600" />
                          <span>Sea</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Customer: {req.customerName}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-blue-700 font-bold">
                      {req.shipment?.trackingNumber || "AW-729481"}
                    </span>
                    <span className="text-slate-400">
                      {req.shipment?.carrier || "Cathay Pacific Cargo"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Interactive Logistics Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeReq ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Header & Carrier Info */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-500">
                      {activeReq.referenceNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <StatusBadge status={activeReq.status} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    {activeReq.part.partName}
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Consigned to {activeReq.customerName} ({activeReq.deliveryAddress.city})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdvanceMilestone}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/20 transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Advance Milestone</span>
                </button>
              </div>

              {/* 6-Stage Visual Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">
                  Live Logistics Milestone Progression:
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="relative flex justify-between items-center">
                    {/* Background connector line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
                      style={{
                        width: `${Math.max(0, Math.min(100, (currentStepIdx / (steps.length - 1)) * 100))}%`,
                      }}
                    />

                    {steps.map((st, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={st.label} className="relative z-10 flex flex-col items-center group">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                              isCompleted
                                ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                : "bg-white text-slate-400 border border-slate-300"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`hidden md:block text-[10px] font-bold mt-2 text-center max-w-[80px] leading-tight ${
                              isCurrent ? "text-blue-700 font-black" : isCompleted ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Waybill & Flight/Vessel Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    CARRIER &amp; TRACKING
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {activeReq.shipment?.carrier || "Cathay Pacific Cargo Priority"}
                  </div>
                  <div className="flex items-center gap-2 font-mono font-bold text-blue-700">
                    <span>Waybill: {activeReq.shipment?.trackingNumber || "CX-0882-941"}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Vessel/Flight: {activeReq.shipment?.vesselOrFlightNumber || "CX0882 (B747-8F)"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    PORT ROUTING &amp; TRANSIT
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    Centrair Nagoya Terminal (NGO) → Auckland (AKL)
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600">
                    <span>ETD: 2 Sept 2026</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">ETA: 6 Sept 2026</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold">
                    Customs Entry: {activeReq.shipment?.customsEntryNumber || "NZ-CUS-2026-88192"}
                  </div>
                </div>
              </div>

              {/* Delivery Address & Bay Instructions */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    FINAL WORKSHOP DESTINATION:
                  </span>
                  <span className="font-bold text-slate-900">
                    {activeReq.customerName}
                  </span>
                </div>
                <div className="text-slate-700 font-medium">
                  {activeReq.deliveryAddress.street}, {activeReq.deliveryAddress.suburb}, {activeReq.deliveryAddress.city} {activeReq.deliveryAddress.postcode}
                </div>
                <div className="text-[11px] text-slate-500">
                  Delivery Bay Notes: Forklift available on site. Goods inward open 7:30 AM - 5:00 PM.
                </div>
              </div>

              {/* Bottom Quick Links */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/procurement/queue?req=${activeReq.referenceNumber}`}
                  className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Original Sourcing Quotation</span>
                </Link>

                <span className="font-mono text-[11px] text-slate-400">
                  Last Updated: {new Date(activeReq.updatedDate).toLocaleDateString("en-NZ")}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select an active consignment to view milestones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
