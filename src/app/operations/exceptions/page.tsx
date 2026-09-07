"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  X,
  FileText,
  MapPin,
  Truck,
  Plane,
  Building2,
  Calendar,
} from "lucide-react";
import {
  getStoredRequests,
  resolveLogisticsException,
  raiseLogisticsException,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests } from "@/lib/mockData";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function LogisticsExceptionsPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Resolution Modal State
  const [resolveTargetReq, setResolveTargetReq] = useState<PartRequest | null>(null);
  const [resumeStage, setResumeStage] = useState<RequestStatus>("CUSTOMS_CLEARANCE");
  const [resolutionNotes, setResolutionNotes] = useState(
    "MPI Biosecurity inspection passed. Export timber fumigation certificate re-verified. Green Line released to domestic transit."
  );

  // Raise Exception Modal State
  const [isRaiseModalOpen, setIsRaiseModalOpen] = useState(false);
  const [targetReqId, setTargetReqId] = useState("");
  const [newCategory, setNewCategory] = useState("Customs Clearance & MPI Hold");
  const [newReason, setNewReason] = useState("");
  const [newCustomerNote, setNewCustomerNote] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  const exceptionsList = requests.filter((r) => r.status === "LOGISTICS_EXCEPTION");

  // Auto-open resolve modal if ID passed
  useEffect(() => {
    if (idParam) {
      const match = requests.find((r) => r.id === idParam);
      if (match && match.status === "LOGISTICS_EXCEPTION") {
        setResolveTargetReq(match);
      }
    }
  }, [idParam, requests]);

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveTargetReq || !resolutionNotes.trim()) return;

    resolveLogisticsException(
      resolveTargetReq.id,
      resumeStage,
      resolutionNotes.trim(),
      "Liam Patel (Logistics Coordinator)"
    );

    setResolveTargetReq(null);
    setToastMessage(`Logistics exception cleared for ${resolveTargetReq.referenceNumber}! Resumed at ${resumeStage.replace(/_/g, " ")}.`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  const handleRaiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReqId || !newReason.trim()) return;

    raiseLogisticsException(
      targetReqId,
      newReason.trim(),
      newCategory,
      "Liam Patel (Logistics Coordinator)",
      newCustomerNote.trim() || undefined
    );

    setIsRaiseModalOpen(false);
    setNewReason("");
    setNewCustomerNote("");
    setToastMessage(`Logistics exception raised successfully!`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  const filteredExceptions = exceptionsList.filter((r) => {
    if (selectedCategory !== "ALL") {
      const cat = r.shipment?.exceptionCategory || "";
      if (!cat.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.referenceNumber.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.statusReason && r.statusReason.toLowerCase().includes(q))
      );
    }
    return true;
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
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Logistics Exception &amp; Hold Desk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Active Consignment Holds &amp; Discrepancy Resolution
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Manage biosecurity holds, airport offloads, port congestion, and delivery reschedules with complete audit records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const eligible = requests.find((r) => r.status !== "LOGISTICS_EXCEPTION" && r.shipment);
              if (eligible) setTargetReqId(eligible.id);
              setIsRaiseModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-900/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Raise Logistics Exception</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
          {[
            { id: "ALL", label: `All Exceptions (${exceptionsList.length})` },
            { id: "Customs", label: "MPI & Customs Holds" },
            { id: "Flight", label: "Airline Offloads" },
            { id: "Port", label: "Port Congestion" },
            { id: "Packaging", label: "Packaging Damage" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedCategory === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, reason, part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Exceptions Grid / Cards */}
      {filteredExceptions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No Active Logistics Holds
          </h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto mt-1">
            All international consignments are moving on-schedule through air and sea corridors without reported exceptions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredExceptions.map((r) => {
            const cat = r.shipment?.exceptionCategory || "Customs Clearance & MPI Hold";
            const reason = r.statusReason || r.shipment?.exceptionReason || "Logistics exception raised";

            return (
              <div
                key={r.id}
                className="bg-white rounded-3xl border border-rose-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-rose-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {r.referenceNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {cat}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Updated {new Date(r.updatedDate).toLocaleDateString("en-NZ")}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {r.part.partName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Customer: {r.customerName} • {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                    </p>
                  </div>

                  {/* Exception Reason Box */}
                  <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                    <div className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Operational Reason:</span>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      {reason}
                    </p>
                  </div>

                  {/* Route & Carrier details */}
                  {r.shipment && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Carrier:</span>
                        <span className="font-semibold text-slate-900">{r.shipment.carrier}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Waybill:</span>
                        <span className="font-mono font-bold text-cyan-700">{r.shipment.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Terminal Checkpoint:</span>
                        <span className="text-slate-800">{r.shipment.originPort} → {r.shipment.destinationPort}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resolution CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/operations/lifecycle?id=${r.id}`}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    View Timeline
                  </Link>

                  <button
                    type="button"
                    onClick={() => setResolveTargetReq(r)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resolve &amp; Release Hold</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= RESOLUTION MODAL ================= */}
      {resolveTargetReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Resolve Logistics Hold
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {resolveTargetReq.referenceNumber} • {resolveTargetReq.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResolveTargetReq(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resume to Milestone Stage *
                </label>
                <select
                  value={resumeStage}
                  onChange={(e) => setResumeStage(e.target.value as RequestStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="CUSTOMS_CLEARANCE">Stage 4: Customs Clearance (MPI Green Line Passed)</option>
                  <option value="IN_TRANSIT">Stage 2: In Transit (Flight / Vessel Resumed)</option>
                  <option value="ARRIVED_IN_NZ">Stage 3: Arrived In New Zealand (Terminal Cleared)</option>
                  <option value="OUT_FOR_DELIVERY">Stage 5: Out For Delivery (Dispatched to Workshop)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Resolution Notes &amp; Inspector Verdict *
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="State how the hold was cleared (e.g. fumigation cert presented, flight rebooked)..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                Clearing the hold returns the consignment to active tracking, clears the exception banner, and records a clearance event on the milestone timeline.
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolveTargetReq(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
                >
                  Confirm Hold Cleared
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RAISE EXCEPTION MODAL ================= */}
      {isRaiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Raise New Logistics Exception
                </h3>
                <p className="text-xs text-slate-500">
                  Flag an active consignment with an operational hold.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRaiseModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRaiseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Consignment *
                </label>
                <select
                  value={targetReqId}
                  onChange={(e) => setTargetReqId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                >
                  {requests
                    .filter((r) => r.status !== "LOGISTICS_EXCEPTION")
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.referenceNumber} — {r.customerName} ({r.part.partName.slice(0, 35)}...) [{r.status}]
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Exception Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Customs Clearance & MPI Hold">Customs Clearance &amp; MPI Biosecurity Hold</option>
                  <option value="Flight Delay / Airport Offload">Flight Departure Cancellation / Airport Offload</option>
                  <option value="Marine Port Congestion">Port of Auckland / Tauranga Berth Delay</option>
                  <option value="Packaging Damage (Repack Required)">Packaging Damage at Overseas Terminal</option>
                  <option value="Delivery Address Unreachable">Delivery Address Unreachable / Workshop Closed</option>
                  <option value="Carrier Routing Discrepancy">Carrier Routing Discrepancy / AWB Error</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Operational Reason &amp; Hold Details *
                </label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why the cargo is on hold..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Dispatch Note (Optional)
                </label>
                <input
                  type="text"
                  value={newCustomerNote}
                  onChange={(e) => setNewCustomerNote(e.target.value)}
                  placeholder="Customer-facing explanation..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRaiseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-xs"
                >
                  Confirm Hold Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
