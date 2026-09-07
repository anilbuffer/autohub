"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Package,
  Globe,
  Plus,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Plane,
  Anchor,
  X,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSuppliers,
  addSupplierQuote,
  issueCustomerQuote,
  markOrderedFromSupplier,
  updateRequestStatus,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, SupplierQuotation, CustomerQuote, FreightOption, SupplierProfile } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AIQuoteModal } from "@/components/AIQuoteModal";

export default function SourcingDeskPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(getStoredSuppliers());
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAddSupplierQuote, setShowAddSupplierQuote] = useState(false);
  const [exceptionModalOpen, setExceptionModalOpen] = useState(false);
  const [exceptionReason, setExceptionReason] = useState("");

  // Manual supplier quote form
  const [selectedSupplierId, setSelectedSupplierId] = useState("SUP-01");
  const [foreignCost, setForeignCost] = useState<number>(45000);
  const [foreignFreight, setForeignFreight] = useState<number>(3000);
  const [notes, setNotes] = useState("Direct from supplier warehouse");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  const sourcingQueue = requests.filter(
    (r) => r.status === "SUBMITTED" || r.status === "SOURCING"
  );
  const quotesIssued = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  );
  const orderedQueue = requests.filter(
    (r) => r.status === "PAYMENT_CONFIRMED"
  );

  const activeReq = selectedRequest || sourcingQueue[0] || requests[0];

  const handleAddQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    const sup = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    const partCostNzd = parseFloat((foreignCost * sup.exchangeRateToNzd).toFixed(2));
    const freightNzd = parseFloat((foreignFreight * sup.exchangeRateToNzd).toFixed(2));

    const quote: SupplierQuotation = {
      id: `SQ-${Date.now()}`,
      supplierId: sup.id,
      supplierName: sup.name,
      supplierCountry: sup.country,
      partCostCurrency: sup.currency,
      partCostForeign: foreignCost,
      exchangeRateToNzd: sup.exchangeRateToNzd,
      partCostNzd,
      domesticFreightForeign: foreignFreight,
      domesticFreightNzd: freightNzd,
      availabilityDays: sup.leadTimeDays,
      notes,
    };

    addSupplierQuote(activeReq.id, quote);
    setShowAddSupplierQuote(false);
  };

  const handleRaiseException = () => {
    if (!activeReq || !exceptionReason.trim()) return;
    updateRequestStatus(
      activeReq.id,
      "SOURCING_EXCEPTION",
      "Nathan Cole",
      "SOURCING_SPECIALIST",
      exceptionReason
    );
    setExceptionModalOpen(false);
    setExceptionReason("");
  };

  const handleOrderFromSupplier = (reqId: string) => {
    markOrderedFromSupplier(reqId, "Nathan Cole (Sourcing)", "PO transmitted to Nagoya OEM warehouse");
  };

  return (
    <div className="space-y-6">
      {/* Promotion banner to Dedicated Procurement Portal */}
      <div className="bg-gradient-to-r from-[#070e1e] to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Dedicated Portal Available
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">
            Switch to the New Procurement Portal (Sourcing Desk)
          </h2>
          <p className="text-xs text-slate-400">
            Enjoy full symmetric dark navy layout, side-by-side multi-currency quotes, margin calculators, and PO dispatch.
          </p>
        </div>
        <Link
          href="/procurement"
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>Launch Procurement Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {/* Sourcing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              Sourcing Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">Specialist: Nathan Cole</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Global Supplier Quotations & Sourcing Queue
          </h1>
          <p className="text-xs text-slate-500">
            Compare international supplier quotes (JPY, EUR, USD, AUD), calculate margins, and build customer quotes.
          </p>
        </div>

        {activeReq && (
          <div className="flex items-center gap-2">
            <button
              id="open-ai-quote-synthesis-button"
              onClick={() => setShowAiModal(true)}
              className="px-4 py-2.5 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>AI Quote Synthesis Engine</span>
            </button>
          </div>
        )}
      </div>

      {/* Sourcing Desk Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sourcing Queue & Payment Cleared Queue */}
        <div className="lg:col-span-4 space-y-6">
          {/* Queue 1: Sourcing Required */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Needs Sourcing ({sourcingQueue.length})
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                Action Required
              </span>
            </div>

            {sourcingQueue.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Sourcing queue clear. No new requests.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sourcingQueue.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-3 rounded-2xl border transition cursor-pointer text-xs ${
                      activeReq?.id === req.id
                        ? "bg-amber-50/70 border-amber-400 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-autohub-navy">
                        {req.referenceNumber}
                      </span>
                      <StatusBadge status={req.status} size="sm" showIcon={false} />
                    </div>
                    <span className="font-bold text-slate-800 block mt-1">
                      {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                    </span>
                    <span className="text-slate-500 block truncate text-[11px]">
                      {req.part.partName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Queue 2: Ready to Order (Payment Gate Cleared!) */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Payment Confirmed: Place PO ({orderedQueue.length})
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Payment Cleared
              </span>
            </div>

            {orderedQueue.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No requests currently awaiting PO placement.
              </p>
            ) : (
              <div className="space-y-2">
                {orderedQueue.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-mono font-bold text-emerald-950">{req.referenceNumber}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">${req.quote?.totalNzd.toFixed(2)} NZD</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {req.vehicle.make} {req.vehicle.model} - {req.part.partName}
                    </p>
                    <button
                      id="place-supplier-po-button"
                      onClick={() => handleOrderFromSupplier(req.id)}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark &quot;Ordered From Supplier&quot;</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Supplier Directory Reference */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block border-b border-slate-100 pb-2">
              Verified Supplier Directory ({suppliers.length})
            </span>
            <div className="space-y-2 text-xs">
              {suppliers.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.2 rounded">
                      {s.country} ({s.currency})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {s.category} • Lead: {s.leadTimeDays}d • Rating: {s.rating}★
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Sourcing Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {activeReq ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Active Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 font-mono">
                      {activeReq.referenceNumber}
                    </h3>
                    <StatusBadge status={activeReq.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: <strong>{activeReq.customerName}</strong> (NZBN: {activeReq.customerNzbn})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExceptionModalOpen(true)}
                    className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Raise Sourcing Exception</span>
                  </button>

                  <button
                    id="add-supplier-quote-button"
                    onClick={() => setShowAddSupplierQuote(true)}
                    className="px-3.5 py-1.5 bg-autohub-navy text-white hover:bg-autohub-navy-dark rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Supplier Quote</span>
                  </button>
                </div>
              </div>

              {/* Vehicle & Part Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] block">Vehicle</span>
                  <span className="font-bold text-slate-900 block">
                    {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">VIN / Chassis</span>
                  <span className="font-mono font-bold text-slate-900 block truncate">
                    {activeReq.vehicle.vin}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Part Name</span>
                  <span className="font-bold text-slate-900 block truncate">
                    {activeReq.part.partName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">OEM Code</span>
                  <span className="font-mono font-bold text-slate-900 block">
                    {activeReq.part.oemPartNumber || "N/A"}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Supplier Quotations Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Captured Supplier Quotations ({activeReq.supplierQuotes.length})
                  </h4>
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="text-xs font-bold text-autohub-red hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Recommended Quote via AI</span>
                  </button>
                </div>

                {activeReq.supplierQuotes.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
                    <p>No supplier quotes recorded yet for this request.</p>
                    <p className="text-[11px] text-slate-400">
                      Use the <strong>AI Quote Synthesis Engine</strong> or manually add quotes from the overseas supplier directory.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeReq.supplierQuotes.map((sq) => (
                      <div
                        key={sq.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          sq.isRecommendedByAi
                            ? "bg-blue-50/50 border-autohub-navy shadow-sm"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{sq.supplierName}</span>
                          {sq.isRecommendedByAi && (
                            <span className="text-[10px] bg-autohub-navy text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-autohub-red" /> AI Recommended
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Foreign Cost</span>
                            <span className="font-bold text-slate-800 font-mono">
                              {sq.partCostForeign.toLocaleString()} {sq.partCostCurrency}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Converted NZD</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              ${sq.partCostNzd.toFixed(2)} NZD
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Overseas Freight</span>
                            <span className="font-mono">${sq.domesticFreightNzd.toFixed(2)} NZD</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Lead Time</span>
                            <span>{sq.availabilityDays} day(s)</span>
                          </div>
                        </div>
                        {sq.notes && (
                          <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-100">
                            &quot;{sq.notes}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Quote Status */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Customer Quotation Status
                  </h4>
                  {activeReq.quote && (
                    <span className="text-xs font-mono font-bold text-slate-700">
                      Quote: {activeReq.quote.quoteNumber} (${activeReq.quote.totalNzd.toFixed(2)} NZD)
                    </span>
                  )}
                </div>

                {!activeReq.quote ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
                    <span>No customer quote has been issued yet.</span>
                    <button
                      onClick={() => setShowAiModal(true)}
                      className="px-4 py-2 bg-autohub-red hover:bg-autohub-red-dark text-white font-bold rounded-xl text-xs transition shadow"
                    >
                      Build & Issue Quotation
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Quote Issued to {activeReq.customerName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Total $${activeReq.quote.totalNzd.toFixed(2)} NZD • Margin: {activeReq.quote.targetMarginPercentage}% (+${activeReq.quote.marginAmountNzd.toFixed(2)})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowAiModal(true)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100"
                    >
                      Revise Quote
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs border border-slate-200">
              Select a request from the queue to start sourcing.
            </div>
          )}
        </div>
      </div>

      {/* Record Supplier Quote Modal */}
      {showAddSupplierQuote && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleAddQuoteSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Record Supplier Quotation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSupplierQuote(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Select Supplier</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.country} - {s.currency})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Foreign Part Cost</label>
                <input
                  type="number"
                  required
                  value={foreignCost}
                  onChange={(e) => setForeignCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Foreign Freight (to hub)</label>
                <input
                  type="number"
                  required
                  value={foreignFreight}
                  onChange={(e) => setForeignFreight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Supplier Sourcing Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddSupplierQuote(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-autohub-navy text-white font-bold rounded-xl shadow"
              >
                Save Supplier Quote
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sourcing Exception Modal */}
      {exceptionModalOpen && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Raise Sourcing Exception for {activeReq.referenceNumber}
            </h3>
            <p className="text-slate-600 text-[11px]">
              Provide a mandatory reason for placing this procurement request on hold or exception status.
            </p>
            <textarea
              rows={3}
              required
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              placeholder="e.g. Part discontinued by factory in Japan, backorder 60+ days, or superseded OEM part number required..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setExceptionModalOpen(false)}
                className="px-4 py-2 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseException}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
              >
                Confirm Exception
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Quote Modal */}
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
