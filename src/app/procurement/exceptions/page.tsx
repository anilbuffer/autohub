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
  ArrowLeft,
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
import { initialRequests } from "@/lib/mockData";
import { PartRequest } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function SourcingExceptionsPage() {
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
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

  const activeReq = requests.find((r) => r.id === selectedReqId);

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

      {/* Exceptions Table List View (Full Width) */}
      {!selectedReqId || !activeReq ? (
        <div className="space-y-4">
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

          {/* Full-Width Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Case Ref &amp; Type</th>
                    <th className="py-3 px-4">Requested Part</th>
                    <th className="py-3 px-4">Vehicle &amp; Customer</th>
                    <th className="py-3 px-4">Sourcing Constraint</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExceptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <div className="font-bold text-slate-700">No active sourcing exceptions!</div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          All procurement requests are moving smoothly through standard sourcing pipelines.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredExceptions.map((req) => {
                      const isDiscontinued = (req.statusReason || "").toLowerCase().includes("discontinued");

                      return (
                        <tr
                          key={req.id}
                          className="hover:bg-rose-50/40 transition-colors group cursor-pointer"
                          onClick={() => setSelectedReqId(req.id)}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            <div>{req.referenceNumber}</div>
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                              isDiscontinued ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-900"
                            }`}>
                              {isDiscontinued ? "OEM Discontinued" : "Severe Backorder"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-slate-900 font-bold block">{req.part.partName}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              OEM #{req.part.oemPartNumber || "N/A"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-900 font-medium">
                              {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Customer: {req.customerName}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="text-rose-900 text-[11px] font-medium bg-rose-50/80 p-2 rounded-xl border border-rose-100 line-clamp-2">
                              {req.statusReason || "Manufacturer parts distribution confirmed constraint."}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReqId(req.id);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm shadow-rose-900/10 transition"
                            >
                              <span>Triage &amp; Resolve</span>
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
        /* Full-Width Case Resolution Workspace */
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedReqId("")}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>← Back to Sourcing Exceptions</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Case:</span>
              <span className="font-mono font-bold text-slate-900">{activeReq.referenceNumber}</span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                {(activeReq.statusReason || "").toLowerCase().includes("discontinued") ? "OEM Discontinued" : "Severe Backorder"}
              </span>
            </div>
          </div>

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

              <h2 className="text-xl font-black text-slate-900">
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
        </div>
      )}
    </div>
  );
}
