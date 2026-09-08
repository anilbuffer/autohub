"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Plus,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
  Eye,
  Receipt as ReceiptIcon,
  ChevronDown,
  Building2,
  Printer,
  Calendar,
  Layers,
} from "lucide-react";
import {
  getStoredRequests,
  recordManualPayment,
  updatePaymentStatus,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, PaymentStatus, TaxInvoice } from "@/lib/types";
import { InvoiceViewer } from "@/components/InvoiceViewer";
import { ReceiptViewer } from "@/components/ReceiptViewer";

export default function PaymentsQueuePage() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");
  const initialReqId = searchParams.get("id");

  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedRequestForPayment, setSelectedRequestForPayment] = useState<PartRequest | null>(null);
  const [bankRef, setBankRef] = useState("");
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [payerName, setPayerName] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [bankAccount, setBankAccount] = useState("06-0801-0498210-00");
  const [trustAccountConfirmed, setTrustAccountConfirmed] = useState(true);

  // Status Change modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetReqForStatus, setTargetReqForStatus] = useState<PartRequest | null>(null);
  const [newStatusChoice, setNewStatusChoice] = useState<PaymentStatus>("PAID");
  const [statusReason, setStatusReason] = useState("");

  // Document Viewers
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<{
    invoice: TaxInvoice;
    request: PartRequest;
  } | null>(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{
    invoice: TaxInvoice;
    request: PartRequest;
  } | null>(null);

  const [notificationNote, setNotificationNote] = useState<string | null>(null);

  const refresh = () => {
    const reqs = getStoredRequests();
    setRequests(reqs);
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Handle URL query trigger e.g. ?action=record&id=...
  useEffect(() => {
    if (initialAction === "record" && requests.length > 0) {
      if (initialReqId) {
        const found = requests.find((r) => r.id === initialReqId);
        if (found) {
          openRecordModal(found);
          return;
        }
      }
      // Open modal with first pending request
      const pending = requests.find((r) => r.status === "AWAITING_PAYMENT" || r.invoice?.status === "PENDING");
      if (pending) openRecordModal(pending);
      else if (requests[0]) openRecordModal(requests[0]);
    }
  }, [initialAction, initialReqId, requests]);

  const openRecordModal = (req: PartRequest) => {
    setSelectedRequestForPayment(req);
    const total = req.invoice?.totalNzd || req.quote?.totalNzd || 0;
    setAmountReceived(total);
    setBankRef(`ANZ-TRF-${Math.floor(100000 + Math.random() * 900000)}`);
    setPayerName(req.customerName);
    setPaymentNotes("Direct credit verified against ANZ Procurly Trust Account");
    setRecordModalOpen(true);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForPayment) return;

    recordManualPayment(
      selectedRequestForPayment.id,
      "BANK_TRANSFER",
      amountReceived,
      bankRef,
      "Clara Jenkins",
      paymentNotes
    );

    setNotificationNote(
      `Payment of $${amountReceived.toFixed(2)} NZD recorded for ${selectedRequestForPayment.referenceNumber}! Official receipt generated and procurement gate cleared.`
    );
    setRecordModalOpen(false);
    setTimeout(() => setNotificationNote(null), 6000);
  };

  const openStatusChangeModal = (req: PartRequest) => {
    setTargetReqForStatus(req);
    setNewStatusChoice(req.invoice?.status || "PENDING");
    setStatusReason("");
    setStatusModalOpen(true);
  };

  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReqForStatus) return;

    updatePaymentStatus(
      targetReqForStatus.id,
      newStatusChoice,
      statusReason || `Updated by Clara Jenkins via status desk`,
      "Clara Jenkins"
    );

    setNotificationNote(
      `Payment status for ${targetReqForStatus.referenceNumber} updated to ${newStatusChoice}.`
    );
    setStatusModalOpen(false);
    setTimeout(() => setNotificationNote(null), 5000);
  };

  // Helper to determine status across the 6 statuses
  const getEffectivePaymentStatus = (r: PartRequest): PaymentStatus => {
    if (r.invoice?.status) return r.invoice.status;
    if (r.status === "PAYMENT_CONFIRMED" || r.status === "DELIVERED" || r.status === "COMPLETED")
      return "PAID";
    if (r.status === "PAYMENT_DISPUTED") return "DISPUTED";
    if (r.status === "CANCELLED") return "REFUNDED";
    return "PENDING";
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const effectiveStatus = getEffectivePaymentStatus(r);

    if (selectedStatus !== "ALL" && effectiveStatus !== selectedStatus) return false;

    if (selectedMethod !== "ALL") {
      const method = r.invoice?.paymentMethod || (r.status === "AWAITING_PAYMENT" ? "BANK_TRANSFER" : "TRADE_CREDIT");
      if (method !== selectedMethod) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.referenceNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.vehicle.vin.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        (r.invoice?.invoiceNumber && r.invoice.invoiceNumber.toLowerCase().includes(q)) ||
        (r.invoice?.receiptNumber && r.invoice.receiptNumber.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Count by 6 statuses
  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => getEffectivePaymentStatus(r) === "PENDING").length,
    PARTIALLY_PAID: requests.filter((r) => getEffectivePaymentStatus(r) === "PARTIALLY_PAID").length,
    PAID: requests.filter((r) => getEffectivePaymentStatus(r) === "PAID").length,
    OVERDUE: requests.filter((r) => getEffectivePaymentStatus(r) === "OVERDUE").length,
    DISPUTED: requests.filter((r) => getEffectivePaymentStatus(r) === "DISPUTED").length,
    REFUNDED: requests.filter((r) => getEffectivePaymentStatus(r) === "REFUNDED").length,
  };

  const totalAwaitingAmount = requests
    .filter((r) => {
      const st = getEffectivePaymentStatus(r);
      return st === "PENDING" || st === "PARTIALLY_PAID" || st === "OVERDUE";
    })
    .reduce((sum, r) => sum + (r.invoice?.totalNzd || r.quote?.totalNzd || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Notification Banner */}
      {notificationNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between gap-2 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notificationNote}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationNote(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ed2025] bg-red-50 border border-red-200/80 px-2.5 py-0.5 rounded-full">
              Treasury Queue
            </span>
            <span className="text-xs text-slate-500 font-mono">
              6 Statuses Managed • ANZ Remittance Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Payments Queue &amp; Remittance Confirmation
          </h1>
          <p className="text-xs text-slate-500">
            Verify manual bank transfer deposits, transition billing statuses, generate tax receipts, and release procurement gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const pending = requests.find((r) => r.status === "AWAITING_PAYMENT" || r.invoice?.status === "PENDING") || requests[0];
              if (pending) openRecordModal(pending);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Manual Payment</span>
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Total Awaiting Remittance
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalAwaitingAmount.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">
            {counts.PENDING + counts.PARTIALLY_PAID + counts.OVERDUE} orders requiring settlement
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Confirmed &amp; Cleared (Paid)
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {counts.PAID}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Receipts issued, released to operations
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Overdue Receivables
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {counts.OVERDUE}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            Terms exceeded; follow-up required
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Disputed &amp; Refunded
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {counts.DISPUTED + counts.REFUNDED}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            Credit notes &amp; dispute holds
          </div>
        </div>
      </div>

      {/* Six Statuses Filter Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100">
          {[
            { key: "ALL", label: "All Requests", count: counts.ALL, color: "text-slate-700" },
            { key: "PENDING", label: "1. Pending Unpaid", count: counts.PENDING, color: "text-amber-700" },
            { key: "PARTIALLY_PAID", label: "2. Partially Paid", count: counts.PARTIALLY_PAID, color: "text-blue-700" },
            { key: "PAID", label: "3. Paid in Full", count: counts.PAID, color: "text-emerald-700" },
            { key: "OVERDUE", label: "4. Overdue", count: counts.OVERDUE, color: "text-rose-700" },
            { key: "DISPUTED", label: "5. Disputed", count: counts.DISPUTED, color: "text-purple-700" },
            { key: "REFUNDED", label: "6. Refunded", count: counts.REFUNDED, color: "text-slate-600" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatus === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedStatus === tab.key
                    ? "bg-[#ed2025] text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Channel Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, invoice #, client, or VIN..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025] transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Channel:</span>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 outline-none font-semibold text-slate-700"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="BANK_TRANSFER">ANZ Bank Transfer</option>
              <option value="TRADE_CREDIT">Trade Credit (Net 20th)</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 pl-6">Order Ref &amp; Invoice</th>
                <th className="py-3.5 px-4">Trade Customer</th>
                <th className="py-3.5 px-4">Vehicle &amp; Part</th>
                <th className="py-3.5 px-4 text-right">Total Due (NZD)</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No requests found matching the selected status or filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const effectiveStatus = getEffectivePaymentStatus(req);
                  const totalDue = req.invoice?.totalNzd || req.quote?.totalNzd || 0;
                  const method = req.invoice?.paymentMethod || "BANK_TRANSFER";

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      {/* Ref & Invoice */}
                      <td className="py-3.5 px-4 pl-6">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {req.referenceNumber}
                        </div>
                        {req.invoice ? (
                          <div className="font-mono text-[11px] text-slate-500">
                            {req.invoice.invoiceNumber}
                          </div>
                        ) : (
                          <div className="text-[10px] text-amber-600 font-medium">
                            No Invoice Yet
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-[180px]">
                          {req.customerName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          NZBN: {req.customerNzbn}
                        </div>
                      </td>

                      {/* Vehicle & Part */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]">
                          {req.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <div className="text-sm text-slate-900">
                          ${totalDue.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Incl. 15% GST
                        </div>
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            method === "TRADE_CREDIT"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {method === "TRADE_CREDIT" ? "Trade Credit" : "Bank Transfer"}
                        </span>
                      </td>

                      {/* Status across 6 statuses */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => openStatusChangeModal(req)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition hover:ring-2 hover:ring-offset-1 ${
                            effectiveStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:ring-emerald-400"
                              : effectiveStatus === "PARTIALLY_PAID"
                              ? "bg-blue-50 text-blue-800 border-blue-300 hover:ring-blue-400"
                              : effectiveStatus === "PENDING"
                              ? "bg-amber-50 text-amber-800 border-amber-300 hover:ring-amber-400"
                              : effectiveStatus === "OVERDUE"
                              ? "bg-rose-50 text-rose-800 border-rose-300 hover:ring-rose-400"
                              : effectiveStatus === "DISPUTED"
                              ? "bg-purple-50 text-purple-800 border-purple-300 hover:ring-purple-400"
                              : "bg-slate-100 text-slate-800 border-slate-300 hover:ring-slate-400"
                          }`}
                          title="Click to change payment status"
                        >
                          {effectiveStatus.replace(/_/g, " ")}
                        </button>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {req.invoice?.dueDate
                          ? new Date(req.invoice.dueDate).toLocaleDateString("en-NZ", {
                              month: "short",
                              day: "numeric",
                            })
                          : "3 days"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {effectiveStatus !== "PAID" && (
                            <button
                              type="button"
                              onClick={() => openRecordModal(req)}
                              className="px-3.5 py-1.5 bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
                              title="Record bank transfer remittance"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Record</span>
                            </button>
                          )}

                          {req.invoice && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedInvoiceData({
                                  invoice: req.invoice!,
                                  request: req,
                                })
                              }
                              className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                              title="View Tax Invoice"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {req.invoice?.receiptNumber && (
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedReceiptData({
                                  invoice: req.invoice!,
                                  request: req,
                                })
                              }
                              className="p-1 text-emerald-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-50 transition"
                              title="View Official Receipt"
                            >
                              <ReceiptIcon className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openStatusChangeModal(req)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                            title="Manage Status"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
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

      {/* ================= RECORD MANUAL PAYMENT MODAL ================= */}
      {recordModalOpen && selectedRequestForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ed2025] flex items-center justify-center text-white">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Record Manual Bank Transfer Remittance
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Reference: {selectedRequestForPayment.referenceNumber}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRecordModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              {/* Context Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900">
                      {selectedRequestForPayment.customerName}
                    </span>
                    <div className="text-[11px] text-slate-500">
                      {selectedRequestForPayment.part.partName} • {selectedRequestForPayment.vehicle.year} {selectedRequestForPayment.vehicle.make}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Due</span>
                    <div className="font-mono font-bold text-slate-900 text-base">
                      ${(selectedRequestForPayment.invoice?.totalNzd || selectedRequestForPayment.quote?.totalNzd || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deposit Account */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Recipient Bank Trust Account:
                </label>
                <div className="p-3 bg-slate-100 rounded-xl font-mono text-slate-800 border border-slate-200 flex items-center justify-between">
                  <span>ANZ Bank NZ Ltd — Autohub Procurly Trust</span>
                  <span className="font-bold text-slate-900">06-0801-0498210-00</span>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Bank Remittance Reference: *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    placeholder="e.g. ANZ-TRF-982104"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Amount Received ($NZD): *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Deposit Clearance Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Payer Name / Remitter:
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reconciliation Notes &amp; Verification Stamp:
                </label>
                <textarea
                  rows={2}
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. ANZ statement line matched. Full cleared balance verified."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
                />
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trustAccountConfirmed}
                  onChange={(e) => setTrustAccountConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-[#ed2025] focus:ring-[#ed2025]"
                  required
                />
                <div className="text-[11px] text-emerald-900 font-medium leading-tight">
                  <strong>Authorized Treasury Signoff:</strong> I verify that cleared funds have been received in the Autohub ANZ trust account, and authorize sequential receipt issuance and order release to procurement operations.
                </div>
              </label>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!trustAccountConfirmed}
                  className="px-5 py-2 bg-[#ed2025] hover:bg-[#d3181d] disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Release Gate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MANAGE PAYMENT STATUS MODAL (ALL 6 STATUSES) ================= */}
      {statusModalOpen && targetReqForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Payment Status Transition Desk
                </h3>
                <div className="text-[10px] text-slate-400 font-mono">
                  {targetReqForStatus.referenceNumber} • Current: {getEffectivePaymentStatus(targetReqForStatus)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusChangeSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select New Payment Status: *
                </label>
                <select
                  value={newStatusChoice}
                  onChange={(e) => setNewStatusChoice(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                >
                  <option value="PENDING">1. PENDING — Awaiting remittance</option>
                  <option value="PARTIALLY_PAID">2. PARTIALLY PAID — Deposit received</option>
                  <option value="PAID">3. PAID — Cleared in full</option>
                  <option value="OVERDUE">4. OVERDUE — Terms exceeded</option>
                  <option value="DISPUTED">5. DISPUTED — Under financial review</option>
                  <option value="REFUNDED">6. REFUNDED — Credit note issued</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mandatory Audit Remark / Justification: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Explain reason for status change (e.g. customer requested extension, chargeback filed, partial remittance received)..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl font-bold transition shadow-sm"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Viewer */}
      {selectedInvoiceData && (
        <InvoiceViewer
          invoice={selectedInvoiceData.invoice}
          request={selectedInvoiceData.request}
          isOpen={true}
          onClose={() => setSelectedInvoiceData(null)}
        />
      )}

      {/* Receipt Viewer */}
      {selectedReceiptData && (
        <ReceiptViewer
          invoice={selectedReceiptData.invoice}
          request={selectedReceiptData.request}
          isOpen={true}
          onClose={() => setSelectedReceiptData(null)}
        />
      )}
    </div>
  );
}
