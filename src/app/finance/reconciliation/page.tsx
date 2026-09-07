"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scale,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  Upload,
  Layers,
  Sparkles,
  DollarSign,
  Landmark,
  Building2,
  Plus,
} from "lucide-react";
import {
  getStoredReconciliations,
  getStoredRequests,
  reconcilePaymentRecord,
  autoMatchReconciliations,
  saveReconciliations,
  subscribeToStore,
} from "@/lib/store";
import { ReconciliationRecord, PartRequest } from "@/lib/types";

export default function ReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>([]);
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Manual reconcile modal state
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ReconciliationRecord | null>(null);
  const [varianceResolutionType, setVarianceResolutionType] = useState<string>("ABSORB_FEE");
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Import mock bank line modal
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [newBankRef, setNewBankRef] = useState("");
  const [newPayer, setNewPayer] = useState("");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newOrderRef, setNewOrderRef] = useState("");

  const refresh = () => {
    setReconciliations(getStoredReconciliations());
    setRequests(getStoredRequests());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const handleAutoMatch = () => {
    const matched = autoMatchReconciliations("Clara Jenkins");
    setSuccessNote(`Auto-Match completed! Successfully matched and reconciled records against cleared invoices.`);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  const openResolveModal = (rec: ReconciliationRecord) => {
    setSelectedRecord(rec);
    setVarianceResolutionType(rec.varianceNzd < 0 ? "ABSORB_FEE" : "CREDIT_CUSTOMER");
    setResolutionNotes(
      rec.varianceNzd < 0
        ? `Absorb $${Math.abs(rec.varianceNzd).toFixed(2)} NZD interbank fee as write-off`
        : `Record $${rec.varianceNzd.toFixed(2)} NZD surplus as customer credit balance`
    );
    setResolveModalOpen(true);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    reconcilePaymentRecord(
      selectedRecord.id,
      "Clara Jenkins",
      resolutionNotes || `Variance resolved via ${varianceResolutionType}`
    );

    setSuccessNote(`Variance for ${selectedRecord.bankReference} resolved and reconciled.`);
    setResolveModalOpen(false);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  const handleImportBankLine = (e: React.FormEvent) => {
    e.preventDefault();
    const matchingReq = requests.find((r) => r.referenceNumber === newOrderRef);
    const expected = matchingReq?.invoice?.totalNzd || matchingReq?.quote?.totalNzd || undefined;
    const variance = expected !== undefined ? newAmount - expected : newAmount;

    const newRecord: ReconciliationRecord = {
      id: `REC-${Date.now()}`,
      bankDate: new Date().toISOString().split("T")[0],
      bankReference: newBankRef || `ANZ-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      payerName: newPayer || "Direct Remitter",
      bankAccount: "06-0801-0498210-00",
      receivedAmountNzd: newAmount,
      invoiceNumber: matchingReq?.invoice?.invoiceNumber,
      requestReference: newOrderRef || undefined,
      expectedAmountNzd: expected,
      varianceNzd: variance,
      status: Math.abs(variance) < 0.01 ? "MATCHED" : newOrderRef ? "VARIANCE" : "UNALLOCATED",
      notes: "Manual bank statement entry added to feed",
    };

    saveReconciliations([newRecord, ...reconciliations]);
    setSuccessNote(`Bank statement line ${newRecord.bankReference} added to reconciliation feed!`);
    setImportModalOpen(false);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  const filteredReconciliations = reconciliations.filter((rec) => {
    if (statusFilter !== "ALL" && rec.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        rec.bankReference.toLowerCase().includes(q) ||
        rec.payerName.toLowerCase().includes(q) ||
        (rec.requestReference && rec.requestReference.toLowerCase().includes(q)) ||
        (rec.invoiceNumber && rec.invoiceNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalBankReceived = reconciliations.reduce((sum, r) => sum + r.receivedAmountNzd, 0);
  const totalExpected = reconciliations
    .filter((r) => r.expectedAmountNzd !== undefined)
    .reduce((sum, r) => sum + (r.expectedAmountNzd || 0), 0);
  const totalMatchedCount = reconciliations.filter((r) => r.status === "MATCHED").length;

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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
              Treasury Reconciliation Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Expected Receivables vs Cleared Bank Remittances
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Payment Reconciliation (Expected vs Received)
          </h1>
          <p className="text-xs text-slate-500">
            Audit bank deposits into the ANZ Procurly Trust Account against issued tax invoices, resolve variances, and allocate unassigned remittances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoMatch}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Match Engine</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setNewBankRef(`ANZ-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
              setNewPayer("");
              setNewAmount(485);
              setNewOrderRef("AH-P-000123");
              setImportModalOpen(true);
            }}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Simulate Bank Line</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Bank Deposits Received
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalBankReceived.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ANZ Trust Account 06-0801-0498210-00
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Expected Invoiced Total
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            ${totalExpected.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">
            Across active matched orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Reconciliation Rate
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {reconciliations.length > 0 ? ((totalMatchedCount / reconciliations.length) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            {totalMatchedCount} of {reconciliations.length} items fully matched
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Active Discrepancies
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {reconciliations.length - totalMatchedCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            Variances or unallocated deposits
          </div>
        </div>
      </div>

      {/* Main Reconciliation Table */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {["ALL", "MATCHED", "VARIANCE", "UNALLOCATED", "PENDING"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {st === "ALL" ? "All Lines" : st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bank ref, order ref, client..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Bank Statement Feed</th>
                <th className="py-3 px-4">Payer / Remitter</th>
                <th className="py-3 px-4 text-right">Received (NZD)</th>
                <th className="py-3 px-4">Matched Invoice &amp; Order</th>
                <th className="py-3 px-4 text-right">Expected (NZD)</th>
                <th className="py-3 px-4 text-right">Variance</th>
                <th className="py-3 px-4 text-center">Recon Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReconciliations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No reconciliation items match the current filter.
                  </td>
                </tr>
              ) : (
                filteredReconciliations.map((rec) => {
                  const isMatched = rec.status === "MATCHED";
                  const isVariance = rec.status === "VARIANCE";
                  const isUnallocated = rec.status === "UNALLOCATED";

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                      {/* Bank Statement Line */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {rec.bankReference}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          Date: {rec.bankDate}
                        </div>
                      </td>

                      {/* Payer */}
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {rec.payerName}
                        {rec.notes && (
                          <div className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]">
                            {rec.notes}
                          </div>
                        )}
                      </td>

                      {/* Received Amount */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-sm text-slate-900">
                        ${rec.receivedAmountNzd.toFixed(2)}
                      </td>

                      {/* Matched Order */}
                      <td className="py-3 px-4">
                        {rec.requestReference ? (
                          <div>
                            <span className="font-mono font-bold text-slate-900">
                              {rec.requestReference}
                            </span>
                            {rec.invoiceNumber && (
                              <span className="text-[10px] text-slate-500 block font-mono">
                                {rec.invoiceNumber}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Unallocated Deposit
                          </span>
                        )}
                      </td>

                      {/* Expected */}
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {rec.expectedAmountNzd !== undefined ? (
                          `$${rec.expectedAmountNzd.toFixed(2)}`
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Variance */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {Math.abs(rec.varianceNzd) < 0.01 ? (
                          <span className="text-emerald-600">$0.00</span>
                        ) : rec.varianceNzd < 0 ? (
                          <span className="text-rose-600">
                            -${Math.abs(rec.varianceNzd).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-blue-600">
                            +${rec.varianceNzd.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            isMatched
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : isVariance
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : isUnallocated
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        {!isMatched ? (
                          <button
                            type="button"
                            onClick={() => openResolveModal(rec)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10px] transition shadow-xs"
                          >
                            Resolve
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1 text-emerald-600 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cleared</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RESOLVE VARIANCE MODAL ================= */}
      {resolveModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Resolve Reconciliation Variance
                </h3>
                <div className="text-[10px] text-slate-400 font-mono">
                  Bank Reference: {selectedRecord.bankReference}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResolveModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Amount Received:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${selectedRecord.receivedAmountNzd.toFixed(2)} NZD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Invoice Total:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${(selectedRecord.expectedAmountNzd || 0).toFixed(2)} NZD
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span>Net Discrepancy:</span>
                  <span
                    className={selectedRecord.varianceNzd < 0 ? "text-rose-600 font-mono" : "text-blue-600 font-mono"}
                  >
                    {selectedRecord.varianceNzd < 0 ? "-" : "+"}${Math.abs(selectedRecord.varianceNzd).toFixed(2)} NZD
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Variance Resolution Strategy:
                </label>
                <select
                  value={varianceResolutionType}
                  onChange={(e) => setVarianceResolutionType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="ABSORB_FEE">Absorb Bank Processing Fee (Write-off)</option>
                  <option value="CREDIT_CUSTOMER">Credit Customer Ledger for Overpayment</option>
                  <option value="ALLOCATE_MANUAL">Allocate to Order Reference</option>
                  <option value="PARTIAL_ACCEPT">Accept as Partial Settlement</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reconciliation Audit Note:
                </label>
                <textarea
                  required
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl font-bold transition shadow-sm"
                >
                  Reconcile &amp; Clear Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SIMULATE / IMPORT BANK STATEMENT LINE ================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Add Bank Statement Remittance Line
                </h3>
                <div className="text-[10px] text-slate-400 font-mono">
                  ANZ Direct Credit Inflow Feed
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportBankLine} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Bank Reference / Statement Code: *
                </label>
                <input
                  type="text"
                  required
                  value={newBankRef}
                  onChange={(e) => setNewBankRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Payer / Client Name: *
                </label>
                <input
                  type="text"
                  required
                  value={newPayer}
                  onChange={(e) => setNewPayer(e.target.value)}
                  placeholder="e.g. AutoCare Auckland Limited"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Received Amount ($NZD): *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Matched Order Reference (Optional):
                </label>
                <input
                  type="text"
                  value={newOrderRef}
                  onChange={(e) => setNewOrderRef(e.target.value)}
                  placeholder="e.g. AH-P-000123"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Insert Statement Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
