"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Building2,
  FileText,
  User,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  HelpCircle,
  Check,
  ChevronRight,
  Wrench,
  X,
  Phone,
  Mail,
} from "lucide-react";
import {
  getStoredRequests,
  resolveSourcingException,
  updateRequestStatus,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function SourcingExceptionsPage() {
  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [selectedReqId, setSelectedReqId] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [resolutionSuccessMsg, setResolutionSuccessMsg] = useState("");

  // Resolution Form State
  const [resolutionNotes, setResolutionNotes] = useState(
    "Customer agreed to Japanese remanufactured OEM unit with 24-month warranty. Returning to active sourcing queue."
  );

  useEffect(() => {
    const loaded = getStoredRequests();
    setRequests(loaded);

    const exceptions = loaded.filter((r) => r.status === "SOURCING_EXCEPTION");
    if (exceptions.length > 0) {
      setSelectedReqId(exceptions[0].id);
    } else if (loaded.length > 0) {
      setSelectedReqId(loaded[0].id);
    }

    const unsub = subscribeToStore(() => {
      const refreshed = getStoredRequests();
      setRequests(refreshed);
    });
    return unsub;
  }, []);

  // Exceptions Queue
  const exceptionsQueue = requests.filter((r) => r.status === "SOURCING_EXCEPTION");

  // Filtered Exceptions
  const filteredExceptions = exceptionsQueue.filter((req) => {
    if (categoryFilter !== "ALL") {
      const reason = (req.statusReason || "").toLowerCase();
      if (categoryFilter === "DISCONTINUED" && !reason.includes("discontinued")) return false;
      if (categoryFilter === "BACKORDER" && !reason.includes("backorder")) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.referenceNumber.toLowerCase().includes(q) ||
        req.part.partName.toLowerCase().includes(q) ||
        req.vehicle.make.toLowerCase().includes(q) ||
        req.vehicle.model.toLowerCase().includes(q) ||
        req.customerName.toLowerCase().includes(q) ||
        (req.statusReason && req.statusReason.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeReq =
    requests.find((r) => r.id === selectedReqId) ||
    filteredExceptions[0] ||
    exceptionsQueue[0];

  // Resolve Exception Action
  const handleResolve = () => {
    if (!activeReq) return;

    resolveSourcingException(
      activeReq.id,
      "Nathan Cole (Sourcing Specialist)",
      resolutionNotes
    );

    setResolutionSuccessMsg(
      `Exception on ${activeReq.referenceNumber} cleared! Request returned to active Sourcing Queue.`
    );
    setTimeout(() => setResolutionSuccessMsg(""), 6000);
  };

  // Cancel Request Action
  const handleCancel = () => {
    if (!activeReq) return;

    updateRequestStatus(
      activeReq.id,
      "CANCELLED",
      "Nathan Cole (Sourcing Specialist)",
      "SOURCING_SPECIALIST",
      "Part discontinued with no acceptable aftermarket or remanufactured alternative available."
    );

    setResolutionSuccessMsg(`Request ${activeReq.referenceNumber} has been marked CANCELLED.`);
    setTimeout(() => setResolutionSuccessMsg(""), 6000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-rose-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Critical Sourcing Triage
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Sourcing Exceptions &amp; AI Alternatives Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Resolve factory discontinued parts, severe manufacturer backorders, and VIN fitment splits through certified international alternatives.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{exceptionsQueue.length} Active Exception Cases</span>
        </div>
      </div>

      {/* Success Notification */}
      {resolutionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{resolutionSuccessMsg}</span>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Active Exceptions
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">
            {exceptionsQueue.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Cases awaiting resolution
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Alternative Match Rate
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            94.5%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Successful alternative part solutions found
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Resolution Velocity
            </span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            1.4 <span className="text-sm font-semibold text-slate-500">hrs</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Average time to re-route or offer alternative
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Customer Retention
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            100%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Zero trade customers lost to dead-end parts
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
            placeholder="Search exception reason, part, VIN, ref..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs font-bold w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl transition ${
              categoryFilter === "ALL" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Exceptions ({exceptionsQueue.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("DISCONTINUED")}
            className={`px-3 py-1.5 rounded-xl transition ${
              categoryFilter === "DISCONTINUED" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Factory Discontinued
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("BACKORDER")}
            className={`px-3 py-1.5 rounded-xl transition ${
              categoryFilter === "BACKORDER" ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Severe Backorders
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Exception Cases List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredExceptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-700">No active sourcing exceptions!</div>
              <p className="text-[11px] text-slate-500">
                All procurement requests are moving smoothly through standard sourcing pipelines.
              </p>
            </div>
          ) : (
            filteredExceptions.map((req) => {
              const isSelected = activeReq?.id === req.id;
              const isDiscontinued = (req.statusReason || "").toLowerCase().includes("discontinued");

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-4 sm:p-5 rounded-3xl border transition cursor-pointer relative ${
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {isDiscontinued ? "OEM Discontinued" : "Severe Backorder"}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {req.part.partName}
                      </div>
                    </div>

                    <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Customer: {req.customerName}
                  </div>

                  {req.statusReason && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-[11px] text-rose-900 line-clamp-2">
                      <span className="font-bold">Constraint:</span> {req.statusReason}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Case Investigation & Resolution Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeReq ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Case Header */}
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-slate-500">
                      {activeReq.referenceNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-700">
                      Customer: {activeReq.customerName}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                    Specialist Triage Required
                  </span>
                </div>

                <h2 className="text-lg font-black text-slate-900">
                  {activeReq.part.partName}
                </h2>
                <div className="text-xs text-slate-500">
                  {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model} • VIN: {activeReq.vehicle.vin} • OEM #{activeReq.part.oemPartNumber || "44110-60201"}
                </div>
              </div>

              {/* Diagnosis Alert Box */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-950">
                <div className="font-bold flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Sourcing Bottleneck Diagnosis</span>
                </div>
                <p className="leading-relaxed">
                  {activeReq.statusReason || "Manufacturer parts distribution centers confirm the requested genuine OEM part is no longer in regular production run."}
                </p>
              </div>

              {/* AI Alternative Recommendation */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-slate-50 to-white border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Procurly AI Recommended Alternative Match
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    High Confidence Match (98%)
                  </span>
                </div>

                {activeReq.referenceNumber === "AH-P-000130" ? (
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm">
                      Rebuilt Japanese OEM Genuine Steering Box (Koyo Seiko Rebuild Program)
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Factory rebuilt in Osaka using brand-new Japanese NOK seals, high-pressure dyno-tested, includes <strong>24-Month Unlimited Km Warranty</strong>. Available ex-stock Osaka EuroTech Spares with 3-day express air dispatch.
                    </p>
                    <div className="pt-2 flex items-center justify-between font-mono text-xs text-slate-800 border-t border-amber-200/50">
                      <span>Alternative Landed Cost: $1,280.00 NZD</span>
                      <span className="text-emerald-700 font-bold">Immediate Air Cargo Allocation</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-900 text-sm">
                      Switch Vendor to Hanseatic Auto Wholesale (Hamburg Export Terminal)
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      While BMW Dingolfing factory holds a 75-day backlog, Hanseatic Hamburg holds 1 verified physical genuine carbon panel ready for priority Lufthansa Cargo airfreight (4-day transit to Auckland Airport).
                    </p>
                    <div className="pt-2 flex items-center justify-between font-mono text-xs text-slate-800 border-t border-amber-200/50">
                      <span>Landed Part Cost: €3,200 EUR ($5,824 NZD)</span>
                      <span className="text-emerald-700 font-bold">Avoid 75-Day Factory Backlog</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Resolution Notes & Actions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Sourcing Specialist Resolution Notes:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResolve}
                  className="flex-1 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Propose Alternative &amp; Return to Sourcing Queue</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Part Request</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select an exception case to investigate resolution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
