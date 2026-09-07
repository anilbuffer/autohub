"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Plane,
  Ship,
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
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Package,
  UserCheck,
  FileCheck,
  Sliders,
  X,
  Send,
  AlertCircle,
} from "lucide-react";
import {
  getStoredRequests,
  updateShipmentStage,
  confirmShipmentDelivery,
  raiseLogisticsException,
  resolveLogisticsException,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests } from "@/lib/mockData";
import { PartRequest, RequestStatus, LogisticsMilestone } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function LogisticsLifecyclePage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [selectedReqId, setSelectedReqId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Milestone Update Form State
  const [targetStage, setTargetStage] = useState<RequestStatus>("IN_TRANSIT");
  const [updateLocation, setUpdateLocation] = useState("Centrair Nagoya Terminal (Japan)");
  const [updateCarrier, setUpdateCarrier] = useState("Air New Zealand Cargo / DHL Express");
  const [updateTracking, setUpdateTracking] = useState("");
  const [updateNotes, setUpdateNotes] = useState("Cargo container manifested and inspected.");

  // Delivery Confirmation Modal State
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("Dave Campbell");
  const [podDocket, setPodDocket] = useState(`POD-${Math.floor(100000 + Math.random() * 900000)}`);
  const [podNotes, setPodNotes] = useState("Received in good order at workshop goods inwards bay. Seal intact.");

  // Raise Exception Modal State
  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [exceptionCategory, setExceptionCategory] = useState("Customs Clearance & MPI Hold");
  const [exceptionReason, setExceptionReason] = useState("MPI Biosecurity quarantine inspection required at AKL international air cargo terminal.");
  const [exceptionCustomerNote, setExceptionCustomerNote] = useState("Autohub logistics agent on site presenting timber fumigation documentation.");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Set initial selected request
  useEffect(() => {
    if (idParam) {
      setSelectedReqId(idParam);
    } else if (requests.length > 0 && !selectedReqId) {
      // Pick first request with shipment or in transit
      const active = requests.find((r) => r.shipment || r.status === "IN_TRANSIT") || requests[0];
      if (active) setSelectedReqId(active.id);
    }
  }, [idParam, requests, selectedReqId]);

  const activeReq = requests.find((r) => r.id === selectedReqId) || requests[0];

  // Sync stage updater defaults when active request changes
  useEffect(() => {
    if (activeReq) {
      setUpdateCarrier(activeReq.shipment?.carrier || "Air New Zealand Cargo / DHL Express");
      setUpdateTracking(activeReq.shipment?.trackingNumber || "");

      // Default next stage
      const current = activeReq.status;
      if (current === "ORDERED_FROM_SUPPLIER" || current === "SUPPLIER_DISPATCHED") {
        setTargetStage("RECEIVED_AT_SHIPPING_FACILITY");
        setUpdateLocation("Centrair Nagoya Terminal (Japan)");
      } else if (current === "RECEIVED_AT_SHIPPING_FACILITY") {
        setTargetStage("IN_TRANSIT");
        setUpdateLocation("Airborne Trans-Pacific (Flight NZ0090)");
      } else if (current === "IN_TRANSIT") {
        setTargetStage("ARRIVED_IN_NZ");
        setUpdateLocation("Auckland International Airport (AKL)");
      } else if (current === "ARRIVED_IN_NZ") {
        setTargetStage("CUSTOMS_CLEARANCE");
        setUpdateLocation("NZ Customs Service & MPI Biosecurity Auckland");
      } else if (current === "CUSTOMS_CLEARANCE") {
        setTargetStage("OUT_FOR_DELIVERY");
        setUpdateLocation("Auckland Metro Express Fleet");
      } else if (current === "OUT_FOR_DELIVERY") {
        setTargetStage("DELIVERED");
        setUpdateLocation(activeReq.deliveryAddress.city);
      }
    }
  }, [activeReq]);

  // The 6 exact requested lifecycle steps
  const LIFECYCLE_STEPS: { stage: RequestStatus; title: string; defaultLoc: string; desc: string }[] = [
    {
      stage: "RECEIVED_AT_SHIPPING_FACILITY",
      title: "1. Received At Shipping Facility",
      defaultLoc: "Centrair Nagoya Terminal (Japan)",
      desc: "Checked in at overseas export consolidation hub, crated and barcoded.",
    },
    {
      stage: "IN_TRANSIT",
      title: "2. In Transit",
      defaultLoc: "Airborne Trans-Pacific / High Seas",
      desc: "Manifested on international carrier flight or ocean container vessel.",
    },
    {
      stage: "ARRIVED_IN_NZ",
      title: "3. Arrived In New Zealand",
      defaultLoc: "Auckland Cargo Hub / Ports of Auckland",
      desc: "Touched down in New Zealand port of entry, unloaded to bond store.",
    },
    {
      stage: "CUSTOMS_CLEARANCE",
      title: "4. Customs Clearance",
      defaultLoc: "NZ Customs & MPI Biosecurity",
      desc: "Customs tariff assessment and MPI biosecurity clearance checks.",
    },
    {
      stage: "OUT_FOR_DELIVERY",
      title: "5. Out For Delivery",
      defaultLoc: "Local Express Courier Dispatch",
      desc: "Dispatched with local transport fleet for direct workshop delivery.",
    },
    {
      stage: "DELIVERED",
      title: "6. Delivered",
      defaultLoc: "Customer Workshop Goods Bay",
      desc: "Delivered and signed for at customer premises with POD docket.",
    },
  ];

  const getStepIndex = (st: RequestStatus) => {
    if (st === "ORDERED_FROM_SUPPLIER" || st === "SUPPLIER_DISPATCHED") return 0;
    if (st === "RECEIVED_AT_SHIPPING_FACILITY") return 0;
    if (st === "IN_TRANSIT") return 1;
    if (st === "ARRIVED_IN_NZ") return 2;
    if (st === "CUSTOMS_CLEARANCE") return 3;
    if (st === "OUT_FOR_DELIVERY") return 4;
    if (st === "DELIVERED" || st === "COMPLETED") return 5;
    if (st === "LOGISTICS_EXCEPTION") return -1;
    return 0;
  };

  const currentStepIdx = activeReq ? getStepIndex(activeReq.status) : 0;

  // Submit Milestone Update
  const handleAdvanceMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    if (targetStage === "DELIVERED") {
      // Prompt official delivery confirmation modal
      setIsDeliveryModalOpen(true);
      return;
    }

    updateShipmentStage(
      activeReq.id,
      targetStage,
      updateCarrier,
      updateTracking,
      updateLocation,
      "Liam Patel (Logistics)",
      updateNotes
    );

    setToastMessage(`Milestone advanced to ${targetStage.replace(/_/g, " ")}! Store state updated.`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Submit Official Delivery Confirmation
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !recipientName.trim()) return;

    confirmShipmentDelivery(
      activeReq.id,
      {
        recipientName: recipientName.trim(),
        podDocket: podDocket.trim(),
        podNotes: podNotes.trim(),
      },
      "Liam Patel (Logistics Coordinator)"
    );

    setIsDeliveryModalOpen(false);
    setToastMessage(`Delivery confirmed for ${activeReq.referenceNumber}! POD docket ${podDocket} saved.`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Submit Logistics Exception
  const handleRaiseException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !exceptionReason.trim()) return;

    raiseLogisticsException(
      activeReq.id,
      exceptionReason.trim(),
      exceptionCategory,
      "Liam Patel (Logistics Coordinator)",
      exceptionCustomerNote.trim()
    );

    setIsExceptionModalOpen(false);
    setToastMessage(`Logistics exception logged on ${activeReq.referenceNumber} (${exceptionCategory})!`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Resolve Exception
  const handleResolveException = () => {
    if (!activeReq) return;

    resolveLogisticsException(
      activeReq.id,
      "CUSTOMS_CLEARANCE",
      "Documentation verified and quarantine hold cleared by MPI biosecurity inspector.",
      "Liam Patel (Logistics)"
    );

    setToastMessage(`Exception cleared for ${activeReq.referenceNumber}! Resumed at Customs Clearance.`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Search filtered requests for sidebar selector
  const selectorList = requests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.referenceNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.part.partName.toLowerCase().includes(q) ||
      r.vehicle.make.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs flex items-center justify-between shadow-md animate-scaleIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ed2025] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
              International Lifecycle Console
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            6-Stage Logistics Lifecycle &amp; Delivery Confirmation
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Progress shipments step-by-step from overseas consolidation to final workshop sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsExceptionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Raise Exception</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeliveryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Delivery (POD)</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Selector, Right Lifecycle Stepper & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Consignment Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Consignment ({selectorList.length})
              </h3>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ref, part, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {selectorList.map((r) => {
                const isSelected = r.id === selectedReqId;
                const isAir = r.quote?.selectedFreightMethod === "AIR_EXPRESS";

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReqId(r.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-cyan-50/70 border-cyan-400 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {r.referenceNumber}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>

                    <div className="font-bold text-xs text-slate-900 truncate">
                      {r.part.partName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-[140px]">{r.customerName}</span>
                      <span className="font-mono text-[10px]">
                        {isAir ? "✈️ Air Express" : "🚢 Sea Freight"}
                      </span>
                    </div>

                    {r.shipment && (
                      <div className="text-[10px] font-mono text-cyan-700 truncate bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                        {r.shipment.carrier}: {r.shipment.trackingNumber}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Stepper & Update Forms (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeReq ? (
            <>
              {/* Active Consignment Summary Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">
                        {activeReq.referenceNumber}
                      </span>
                      <StatusBadge status={activeReq.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Customer: <span className="font-bold text-slate-800">{activeReq.customerName}</span> (NZBN: {activeReq.customerNzbn})
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800">
                      {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      VIN: {activeReq.vehicle.vin}
                    </div>
                  </div>
                </div>

                {/* Exception Alert Banner if active */}
                {activeReq.status === "LOGISTICS_EXCEPTION" && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-rose-900">
                          Active Logistics Hold: {activeReq.shipment?.exceptionCategory || "Discrepancy Reported"}
                        </div>
                        <div className="text-[11px] text-rose-700">
                          {activeReq.statusReason || activeReq.shipment?.exceptionReason || "Consignment is currently flagged with an active exception."}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResolveException}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex-shrink-0"
                    >
                      Clear &amp; Resume Hold
                    </button>
                  </div>
                )}

                {/* Customer Waybill Banner */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-600" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {activeReq.shipment?.carrier || "Carrier Pending Booking"}
                      </span>
                      {activeReq.shipment?.trackingNumber && (
                        <span className="ml-2 font-mono font-bold text-cyan-700">
                          #{activeReq.shipment.trackingNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Displayed to Customer
                  </span>
                </div>
              </div>

              {/* 6-Stage Visual Stepper */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Logistics Lifecycle Progress
                </h3>

                <div className="space-y-4">
                  {LIFECYCLE_STEPS.map((step, idx) => {
                    const isCompleted = currentStepIdx > idx || activeReq.status === "DELIVERED";
                    const isCurrent = currentStepIdx === idx && activeReq.status !== "DELIVERED";

                    return (
                      <div
                        key={step.stage}
                        className={`p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                          isCurrent
                            ? "bg-cyan-50/70 border-cyan-400 shadow-xs"
                            : isCompleted
                            ? "bg-slate-50/60 border-slate-200"
                            : "bg-white border-slate-100 opacity-60"
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isCompleted
                              ? "bg-emerald-600 text-white"
                              : isCurrent
                              ? "bg-cyan-600 text-white animate-pulse"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-slate-900">
                              {step.title}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                                Current Milestone
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Cleared
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestone Advance Form */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Manual Milestone Status Update
                    </h3>
                    <p className="text-slate-500 text-xs">
                      Advance the consignment to the next stage or jump directly with custom location details.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Coordinator: Liam Patel
                  </span>
                </div>

                <form onSubmit={handleAdvanceMilestone} className="space-y-4 text-xs">
                  {/* Target Stage Select */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Advance to Milestone Stage *
                    </label>
                    <select
                      value={targetStage}
                      onChange={(e) => {
                        const val = e.target.value as RequestStatus;
                        setTargetStage(val);
                        const match = LIFECYCLE_STEPS.find((s) => s.stage === val);
                        if (match) setUpdateLocation(match.defaultLoc);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {LIFECYCLE_STEPS.map((s) => (
                        <option key={s.stage} value={s.stage}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location & Carrier */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Current Checkpoint Location *
                      </label>
                      <input
                        type="text"
                        value={updateLocation}
                        onChange={(e) => setUpdateLocation(e.target.value)}
                        placeholder="e.g. Centrair Nagoya Terminal (Japan)"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Carrier Name (Customer Visible) *
                      </label>
                      <input
                        type="text"
                        value={updateCarrier}
                        onChange={(e) => setUpdateCarrier(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Tracking & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Waybill / Tracking Reference *
                      </label>
                      <input
                        type="text"
                        value={updateTracking}
                        onChange={(e) => setUpdateTracking(e.target.value)}
                        placeholder="e.g. AWB-99281902"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Milestone Dispatch Notes
                      </label>
                      <input
                        type="text"
                        value={updateNotes}
                        onChange={(e) => setUpdateNotes(e.target.value)}
                        placeholder="e.g. Cargo container broken down, MPI inspection scheduled"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      Advances stage, appends milestone audit event, and notifies customer.
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      <span>Update Milestone State</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Complete Milestone Audit Timeline */}
              {activeReq.shipment?.milestones && activeReq.shipment.milestones.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Milestone Audit Log &amp; Checkpoints
                  </h3>

                  <div className="space-y-3">
                    {activeReq.shipment.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900">
                            {m.stage}
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{m.location}</span>
                          </div>
                          {m.notes && (
                            <div className="text-[11px] text-slate-500 italic mt-0.5">
                              &ldquo;{m.notes}&rdquo;
                            </div>
                          )}
                        </div>
                        <div className="text-right text-[10px] text-slate-400 font-mono flex-shrink-0">
                          {new Date(m.timestamp).toLocaleString("en-NZ", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select a consignment from the left to view lifecycle progress.
            </div>
          )}
        </div>
      </div>

      {/* ================= DELIVERY CONFIRMATION MODAL ================= */}
      {isDeliveryModalOpen && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Delivery Confirmation (POD)
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {activeReq.referenceNumber} • {activeReq.customerName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDeliveryModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-[11px]">
                Confirming delivery transitions this consignment to <span className="font-bold">DELIVERED</span>, closes the transit SLA, and delivers a receipt notification to the customer.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Name (Goods Inwards Sign-off) *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Dave Campbell (Workshop Foreman)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Proof of Delivery (POD) Docket / Receipt Number *
                </label>
                <input
                  type="text"
                  value={podDocket}
                  onChange={(e) => setPodDocket(e.target.value)}
                  placeholder="e.g. POD-AKL-992140"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Delivery Inspection &amp; Bay Notes
                </label>
                <textarea
                  rows={2}
                  value={podNotes}
                  onChange={(e) => setPodNotes(e.target.value)}
                  placeholder="e.g. Delivered intact, packaging undamaged, inspected by foreman"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
                >
                  Confirm Delivery Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RAISE LOGISTICS EXCEPTION MODAL ================= */}
      {isExceptionModalOpen && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Raise Logistics Exception
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {activeReq.referenceNumber} • {activeReq.customerName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExceptionModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseException} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Exception Category *
                </label>
                <select
                  value={exceptionCategory}
                  onChange={(e) => setExceptionCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Customs Clearance & MPI Hold">Customs Clearance &amp; MPI Biosecurity Hold</option>
                  <option value="Flight Delay / Airport Offload">Flight Departure Cancellation / Airport Offload</option>
                  <option value="Marine Port Congestion">Port of Auckland / Tauranga Berth Delay</option>
                  <option value="Packaging Damage (Repack Required)">Packaging Damage at Export Facility (Repack Required)</option>
                  <option value="Delivery Address Unreachable">Workshop Closed / Delivery Address Unreachable</option>
                  <option value="Carrier Routing Discrepancy">Carrier Routing Discrepancy / Missing Waybill</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Exception Reason &amp; Operational Details *
                </label>
                <textarea
                  rows={3}
                  value={exceptionReason}
                  onChange={(e) => setExceptionReason(e.target.value)}
                  placeholder="Explain why the cargo is on hold and next steps..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer-Facing Dispatch Update (Optional)
                </label>
                <input
                  type="text"
                  value={exceptionCustomerNote}
                  onChange={(e) => setExceptionCustomerNote(e.target.value)}
                  placeholder="Message explaining status transparently to the customer..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExceptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-xs"
                >
                  Raise Exception Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
