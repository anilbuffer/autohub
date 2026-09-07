"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calculator,
  Plane,
  Ship,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Search,
  ArrowRight,
  DollarSign,
  Clock,
  ShieldCheck,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  Info,
  Check,
  X,
  Lock,
  Unlock,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSettings,
  saveSettings,
  toggleFreightOptionAvailability,
  overrideFreightOption,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests, initialSystemSettings } from "@/lib/mockData";
import { PartRequest, FreightMethod, SystemSettings } from "@/lib/types";

export default function FreightManagementPage() {
  const searchParams = useSearchParams();
  const targetIdParam = searchParams.get("id");

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [settings, setSettings] = useState<SystemSettings>(initialSystemSettings);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReqId, setSelectedReqId] = useState<string>("");

  // Override Modal State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideReq, setOverrideReq] = useState<PartRequest | null>(null);
  const [overrideMethod, setOverrideMethod] = useState<FreightMethod>("AIR_EXPRESS");
  const [overrideCost, setOverrideCost] = useState<number>(185);
  const [overrideTransit, setOverrideTransit] = useState<string>("3 - 5 business days");
  const [overrideReason, setOverrideReason] = useState<string>("Negotiated volume discount with international freight partner");

  // Disable Modal State
  const [disableModalReq, setDisableModalReq] = useState<PartRequest | null>(null);
  const [disableMethod, setDisableMethod] = useState<FreightMethod>("AIR_EXPRESS");
  const [disableReason, setDisableReason] = useState<string>("Exceeds volumetric dimension limits for international air cargo");

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    setSettings(getStoredSettings());

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      setSettings(getStoredSettings());
    });
    return unsub;
  }, []);

  // Handle URL pre-selection
  useEffect(() => {
    if (targetIdParam) {
      setSelectedReqId(targetIdParam);
    } else if (requests.length > 0 && !selectedReqId) {
      const withQuote = requests.find((r) => r.quote);
      if (withQuote) setSelectedReqId(withQuote.id);
    }
  }, [targetIdParam, requests, selectedReqId]);

  const activeReq = requests.find((r) => r.id === selectedReqId) || requests.find((r) => r.quote);

  // Global settings change
  const handleUpdateGlobalRates = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setToastMessage("Global baseline freight rates updated successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Open override modal
  const handleOpenOverride = (req: PartRequest, method: FreightMethod) => {
    setOverrideReq(req);
    setOverrideMethod(method);

    const existing = req.quote?.freightOptions.find((f) => f.method === method);
    if (existing) {
      setOverrideCost(existing.costNzd);
      setOverrideTransit(existing.estimatedTransitDays);
    } else {
      setOverrideCost(method === "AIR_EXPRESS" ? 185 : 65);
      setOverrideTransit(method === "AIR_EXPRESS" ? "3 - 5 business days" : "14 - 18 business days");
    }
    setOverrideReason("Special rate negotiated with carrier terminal dispatch");
    setIsOverrideModalOpen(true);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReq || overrideCost <= 0) return;

    overrideFreightOption(
      overrideReq.id,
      overrideMethod,
      Number(overrideCost),
      overrideTransit.trim(),
      overrideReason.trim(),
      "Liam Patel (Logistics)"
    );

    setIsOverrideModalOpen(false);
    setToastMessage(`Freight calculation override applied to ${overrideReq.referenceNumber} ($${Number(overrideCost).toFixed(2)} NZD)!`);
    setTimeout(() => setToastMessage(""), 5000);
  };

  // Toggle availability
  const handleToggleAvailability = (req: PartRequest, method: FreightMethod, currentlyAvailable: boolean) => {
    if (currentlyAvailable) {
      // Prompt for reason to disable
      setDisableModalReq(req);
      setDisableMethod(method);
    } else {
      // Re-enable immediately
      toggleFreightOptionAvailability(
        req.id,
        method,
        true,
        "Re-enabled by logistics coordinator",
        "Liam Patel (Logistics)"
      );
      setToastMessage(`Freight option ${method === "AIR_EXPRESS" ? "Air Express" : "Sea Freight"} re-enabled for ${req.referenceNumber}!`);
      setTimeout(() => setToastMessage(""), 4000);
    }
  };

  const handleConfirmDisable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableModalReq || !disableReason.trim()) return;

    toggleFreightOptionAvailability(
      disableModalReq.id,
      disableMethod,
      false,
      disableReason.trim(),
      "Liam Patel (Logistics)"
    );

    setDisableModalReq(null);
    setToastMessage(`Freight option ${disableMethod === "AIR_EXPRESS" ? "Air Express" : "Sea Freight"} disabled for ${disableModalReq.referenceNumber}!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Filter requests with quotes
  const quotedRequests = requests.filter((r) => {
    if (!r.quote) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.referenceNumber.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
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
            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
              Freight Matrix &amp; Pricing Management
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Air Express vs. Consolidated Ocean Freight
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure baseline transit times and NZD costs, enable/disable options per consignment, and execute manual calculation overrides.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (activeReq) handleOpenOverride(activeReq, "AIR_EXPRESS");
            }}
            disabled={!activeReq}
            className="px-4 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold text-xs shadow-md shadow-red-900/20 transition flex items-center gap-2 disabled:opacity-50"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
            <span>Override Freight Rate</span>
          </button>
        </div>
      </div>

      {/* Global Baseline Freight Rate Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Global Default Freight Rate Cards
            </h3>
            <p className="text-slate-500 text-xs">
              System-wide base rates used when calculating customer quotes from international terminals.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            NZD Currency (15% GST Applicable)
          </span>
        </div>

        <form onSubmit={handleUpdateGlobalRates} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Air Express Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Air Express Priority
                  </h4>
                  <span className="text-[11px] text-blue-700 font-medium">
                    Cathay Cargo, Air New Zealand, Qantas Freight, DHL Express
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                SLA: 3 - 5 Days
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Base Rate ($NZD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.airFreightBaseRateNzd}
                    onChange={(e) =>
                      setSettings({ ...settings, airFreightBaseRateNzd: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Transit SLA
                </label>
                <input
                  type="text"
                  defaultValue="3 - 5 business days"
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standard rate applied for high-urgency mechanical parts, electronics, and packages under 35kg. Includes direct airport-to-airport uplift and rapid MPI green lane sorting.
            </p>
          </div>

          {/* Consolidated Ocean Freight Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Consolidated Ocean Freight
                  </h4>
                  <span className="text-[11px] text-cyan-800 font-medium">
                    Toyofuji Shipping, Armacup, Wallenius Wilhelmsen
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                SLA: 14 - 18 Days
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Base Rate ($NZD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.seaFreightBaseRateNzd}
                    onChange={(e) =>
                      setSettings({ ...settings, seaFreightBaseRateNzd: Number(e.target.value) })
                    }
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Default Transit SLA
                </label>
                <input
                  type="text"
                  defaultValue="14 - 18 business days"
                  className="w-full p-2 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Consolidated ocean container service for heavy suspension assemblies, body panels, subframes, and non-critical inventory. Port-to-port Auckland / Lyttelton handling.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
            >
              Update Global Rate Cards
            </button>
          </div>
        </form>
      </div>

      {/* Per-Request Freight Management Desk */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Per-Request Freight Controls &amp; Calculation Overrides
            </h3>
            <p className="text-slate-500 text-xs">
              Enable or disable specific freight options per request, or apply manual price and transit overrides.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search request or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Request Reference</th>
                <th className="py-3.5 px-4">Part &amp; Weight</th>
                <th className="py-3.5 px-4">Air Express Status</th>
                <th className="py-3.5 px-4">Sea Freight Status</th>
                <th className="py-3.5 px-4">Quote Total (NZD)</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Override Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotedRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No requests with issued quotations found.
                  </td>
                </tr>
              ) : (
                quotedRequests.map((r) => {
                  const airOpt = r.quote?.freightOptions.find((f) => f.method === "AIR_EXPRESS");
                  const seaOpt = r.quote?.freightOptions.find((f) => f.method === "SEA_FREIGHT");

                  const isAirAvailable = airOpt ? airOpt.available : false;
                  const isSeaAvailable = seaOpt ? seaOpt.available : false;

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-cyan-50/30 transition group"
                    >
                      {/* Ref & Customer */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-mono font-bold text-slate-900">
                          {r.referenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {r.customerName}
                        </div>
                      </td>

                      {/* Part & Weight */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">
                          {r.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Weight Est: {r.part.weightEstKg ? `${r.part.weightEstKg} kg` : "N/A"} • {r.vehicle.year} {r.vehicle.make}
                        </div>
                      </td>

                      {/* Air Express Control */}
                      <td className="py-4 px-4">
                        {airOpt ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleAvailability(r, "AIR_EXPRESS", isAirAvailable)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                                  isAirAvailable
                                    ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                }`}
                                title="Click to toggle option on/off"
                              >
                                {isAirAvailable ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                <span>{isAirAvailable ? "Enabled" : "Disabled"}</span>
                              </button>
                              <span className="font-mono font-bold text-slate-800">
                                ${airOpt.costNzd.toFixed(2)}
                              </span>
                            </div>

                            {airOpt.manualOverride && (
                              <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                                <span>★ Overridden: {airOpt.manualOverrideReason || "Manual rate"}</span>
                              </div>
                            )}

                            {!isAirAvailable && airOpt.disabledReason && (
                              <div className="text-[10px] text-slate-500 italic">
                                Reason: {airOpt.disabledReason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Included</span>
                        )}
                      </td>

                      {/* Sea Freight Control */}
                      <td className="py-4 px-4">
                        {seaOpt ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleAvailability(r, "SEA_FREIGHT", isSeaAvailable)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 ${
                                  isSeaAvailable
                                    ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                                    : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                }`}
                                title="Click to toggle option on/off"
                              >
                                {isSeaAvailable ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                <span>{isSeaAvailable ? "Enabled" : "Disabled"}</span>
                              </button>
                              <span className="font-mono font-bold text-slate-800">
                                ${seaOpt.costNzd.toFixed(2)}
                              </span>
                            </div>

                            {seaOpt.manualOverride && (
                              <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
                                <span>★ Overridden: {seaOpt.manualOverrideReason || "Manual rate"}</span>
                              </div>
                            )}

                            {!isSeaAvailable && seaOpt.disabledReason && (
                              <div className="text-[10px] text-slate-500 italic">
                                Reason: {seaOpt.disabledReason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Included</span>
                        )}
                      </td>

                      {/* Quote Total */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-black text-slate-900">
                          ${r.quote?.totalNzd ? r.quote.totalNzd.toFixed(2) : "0.00"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Incl. 15% GST
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenOverride(r, "AIR_EXPRESS")}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                            title="Override Air Rate"
                          >
                            <Plane className="w-3 h-3" />
                            <span>Override Air</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenOverride(r, "SEA_FREIGHT")}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-[11px] transition flex items-center gap-1"
                            title="Override Sea Rate"
                          >
                            <Ship className="w-3 h-3" />
                            <span>Override Sea</span>
                          </button>
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

      {/* ================= MANUAL OVERRIDE MODAL ================= */}
      {isOverrideModalOpen && overrideReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Override Freight Calculation
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {overrideReq.referenceNumber} • {overrideReq.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOverrideModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4 text-xs">
              {/* Freight Method Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Freight Option to Override
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOverrideMethod("AIR_EXPRESS")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                      overrideMethod === "AIR_EXPRESS"
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>Air Express</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideMethod("SEA_FREIGHT")}
                    className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                      overrideMethod === "SEA_FREIGHT"
                        ? "bg-cyan-700 text-white border-cyan-700 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <Ship className="w-3.5 h-3.5" />
                    <span>Sea Freight</span>
                  </button>
                </div>
              </div>

              {/* Overridden Cost */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Freight Rate ($NZD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={overrideCost}
                    onChange={(e) => setOverrideCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Custom Transit SLA */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adjusted Estimated Transit Time *
                </label>
                <input
                  type="text"
                  value={overrideTransit}
                  onChange={(e) => setOverrideTransit(e.target.value)}
                  placeholder="e.g. 2 - 3 business days (Charter Flight)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Rationale / Reason */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Override Rationale &amp; Audit Reason *
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Volume discount with DHL Nagoya or oversized freight concession"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Live recalculated preview */}
              {overrideReq.quote && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-900">
                    Recalculation Impact:
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Base Landed Part:</span>
                    <span>${overrideReq.quote.basePartCostNzd.toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Overridden Freight ({overrideMethod}):</span>
                    <span className="font-bold text-cyan-800">${Number(overrideCost).toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
                    <span>Estimated New Total (incl. 15% GST):</span>
                    <span className="text-cyan-800">
                      $
                      {(
                        (overrideReq.quote.basePartCostNzd +
                          overrideReq.quote.marginAmountNzd +
                          overrideReq.quote.procurementFeeNzd +
                          Number(overrideCost)) *
                        1.15
                      ).toFixed(2)}{" "}
                      NZD
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow-xs"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DISABLE OPTION REASON MODAL ================= */}
      {disableModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Disable Freight Option
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {disableModalReq.referenceNumber} • {disableMethod}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDisableModalReq(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDisable} className="space-y-4 text-xs">
              <p className="text-slate-600">
                Specify why this freight method cannot be offered to the customer for this consignment (e.g. oversize packaging, hazardous material, or airline restriction).
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Disabling Option *
                </label>
                <textarea
                  rows={3}
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDisableModalReq(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-xs"
                >
                  Disable Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
