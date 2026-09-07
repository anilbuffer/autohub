"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Printer,
  FileText,
  DollarSign,
  ShieldCheck,
  Building2,
  Eye,
  Check,
  X,
  CreditCard,
  Landmark,
} from "lucide-react";
import {
  getStoredRefunds,
  getStoredCreditNotes,
  getStoredRequests,
  processRefund,
  subscribeToStore,
} from "@/lib/store";
import { RefundRecord, CreditNote, PartRequest } from "@/lib/types";
import { CreditNoteViewer } from "@/components/CreditNoteViewer";

export default function RefundsProcessingPage() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // New refund modal
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundType, setRefundType] = useState<"FULL" | "PARTIAL" | "FREIGHT_CREDIT" | "GOODWILL">("FULL");
  const [refundReason, setRefundReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<"BANK_DIRECT_CREDIT" | "TRADE_CREDIT_BALANCE">("BANK_DIRECT_CREDIT");

  // Credit Note document viewer
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);

  const refresh = () => {
    setRefunds(getStoredRefunds());
    setCreditNotes(getStoredCreditNotes());
    setRequests(getStoredRequests());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const openProcessRefundModal = (req?: PartRequest) => {
    const target = req || requests[0];
    if (target) {
      setSelectedReqId(target.id);
      const total = target.invoice?.totalNzd || target.quote?.totalNzd || 100;
      setRefundAmount(total);
      setRefundReason("Overseas supplier stockout; customer order cancelled");
      setRefundMethod(target.invoice?.paymentMethod === "TRADE_CREDIT" ? "TRADE_CREDIT_BALANCE" : "BANK_DIRECT_CREDIT");
    }
    setProcessModalOpen(true);
  };

  const handleProcessRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqId) return;

    const refund = processRefund(
      selectedReqId,
      refundAmount,
      refundType,
      refundReason,
      refundMethod,
      "Clara Jenkins",
      "Refund processed via Finance Treasury Desk"
    );

    setSuccessNote(
      `Refund of $${refundAmount.toFixed(2)} NZD processed! Credit Note ${refund.creditNoteNumber} issued.`
    );
    setProcessModalOpen(false);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  const filteredRefunds = refunds.filter((ref) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ref.creditNoteNumber.toLowerCase().includes(q) ||
      ref.requestReference.toLowerCase().includes(q) ||
      ref.customerName.toLowerCase().includes(q) ||
      ref.reason.toLowerCase().includes(q) ||
      ref.invoiceNumber.toLowerCase().includes(q)
    );
  });

  const totalRefundAmountNzd = refunds.reduce((sum, r) => sum + r.amountNzd, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast */}
      {successNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNote}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNote(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
              Credit Note &amp; Reversals Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">
              NZ GST Act 1985 Section 25 Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Refund Processing &amp; Official Credit Notes
          </h1>
          <p className="text-xs text-slate-500">
            Process full or partial order cancellations, defective part return settlements, and issue sequential credit notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openProcessRefundModal()}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Process New Refund</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Total Refunds Processed
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            ${totalRefundAmountNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {refunds.length} credit notes
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Direct Bank Remittance Refunds
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {refunds.filter((r) => r.refundMethod === "BANK_DIRECT_CREDIT").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Remitted via ANZ Trust Direct Credit
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Trade Credit Restorations
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {refunds.filter((r) => r.refundMethod === "TRADE_CREDIT_BALANCE").length}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            Credit headroom restored to accounts
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Latest Credit Note #
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {creditNotes[0]?.creditNoteNumber || "CN-2026-00015"}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Official IRD compliant records
          </div>
        </div>
      </div>

      {/* Refunds Register Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Processed Refunds &amp; Credit Notes Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Chronological log of all credit notes and voucher adjustments.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credit note #, order ref, client..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Credit Note #</th>
                <th className="py-3 px-4">Date Processed</th>
                <th className="py-3 px-4">Trade Customer</th>
                <th className="py-3 px-4">Referenced Order &amp; Invoice</th>
                <th className="py-3 px-4 text-right">Refund Amount</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-right">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRefunds.map((ref) => {
                const cn = creditNotes.find((c) => c.creditNoteNumber === ref.creditNoteNumber);

                return (
                  <tr key={ref.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      {ref.creditNoteNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {new Date(ref.timestamp).toLocaleDateString("en-NZ", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {ref.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-800">
                        {ref.requestReference}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        {ref.invoiceNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 text-sm">
                      ${ref.amountNzd.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          ref.refundMethod === "TRADE_CREDIT_BALANCE"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ref.refundMethod === "TRADE_CREDIT_BALANCE"
                          ? "Trade Credit Line"
                          : "Bank Direct Credit"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate text-[11px]">
                      {ref.reason}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {ref.officerName}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {cn ? (
                        <button
                          type="button"
                          onClick={() => setSelectedCreditNote(cn)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Credit Note</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Archived</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PROCESS REFUND MODAL ================= */}
      {processModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">
                  Issue Customer Refund &amp; Credit Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setProcessModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessRefundSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select Order / Request: *
                </label>
                <select
                  required
                  value={selectedReqId}
                  onChange={(e) => {
                    setSelectedReqId(e.target.value);
                    const target = requests.find((r) => r.id === e.target.value);
                    if (target) {
                      setRefundAmount(target.invoice?.totalNzd || target.quote?.totalNzd || 100);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.referenceNumber} • {r.customerName} • ${(r.invoice?.totalNzd || r.quote?.totalNzd || 0).toFixed(2)} NZD
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Refund Type:
                  </label>
                  <select
                    value={refundType}
                    onChange={(e) => setRefundType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                  >
                    <option value="FULL">Full Order Refund</option>
                    <option value="PARTIAL">Partial Part Settlement</option>
                    <option value="FREIGHT_CREDIT">Freight Cost Credit</option>
                    <option value="GOODWILL">Commercial Goodwill</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Refund Amount ($NZD): *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-rose-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Settlement Method:
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="BANK_DIRECT_CREDIT">Direct Bank Credit (Remit ex-ANZ Trust)</option>
                  <option value="TRADE_CREDIT_BALANCE">Restore Available Trade Credit Line</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reason for Refund: *
                </label>
                <textarea
                  required
                  rows={2}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Overseas supplier out of stock, customer cancellation before dispatch, damaged in transit..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProcessModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Process &amp; Issue Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Note Viewer */}
      {selectedCreditNote && (
        <CreditNoteViewer
          creditNote={selectedCreditNote}
          isOpen={true}
          onClose={() => setSelectedCreditNote(null)}
        />
      )}
    </div>
  );
}
