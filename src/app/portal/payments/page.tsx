"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Receipt,
  DollarSign,
  TrendingUp,
  Landmark,
  ChevronRight,
} from "lucide-react";
import { getStoredRequests, getStoredCustomers, subscribeToStore } from "@/lib/store";
import { PartRequest, TradeCustomer, TaxInvoice } from "@/lib/types";
import { InvoiceViewer } from "@/components/InvoiceViewer";

export default function PaymentsPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customer, setCustomer] = useState<TradeCustomer | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: TaxInvoice; request: PartRequest } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "OVERDUE">("ALL");

  useEffect(() => {
    setRequests(getStoredRequests());
    const custs = getStoredCustomers();
    if (custs.length > 0) setCustomer(custs[0]);

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      const updatedCusts = getStoredCustomers();
      if (updatedCusts.length > 0) setCustomer(updatedCusts[0]);
    });
    return unsub;
  }, []);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Compile list of all requests that have an invoice or payment requirement
  const invoicedRequests = requests.filter((r) => r.invoice || r.quote);

  const filteredInvoices = invoicedRequests.filter((r) => {
    const invStatus = r.invoice?.status || (r.status === "AWAITING_PAYMENT" ? "PENDING" : "PAID");
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PAID") return invStatus === "PAID";
    if (statusFilter === "PENDING") return invStatus === "PENDING";
    if (statusFilter === "OVERDUE") return invStatus === "OVERDUE";
    return true;
  });

  const totalPaid = requests
    .filter((r) => r.invoice?.status === "PAID")
    .reduce((sum, r) => sum + (r.invoice?.totalNzd || 0), 0);

  const totalPending = requests
    .filter((r) => r.status === "AWAITING_PAYMENT" || (r.invoice && r.invoice.status === "PENDING"))
    .reduce((sum, r) => sum + (r.quote?.totalNzd || r.invoice?.totalNzd || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Payments & Trade Credit Facility
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your corporate billing, bank remittance details, approved credit lines, and tax documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/documents"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <FolderArchiveIcon className="w-3.5 h-3.5 text-autohub-navy" />
            <span>Document Vault</span>
          </Link>
        </div>
      </div>

      {/* Credit Account & Facility Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approved Trade Credit Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 via-[#0a1226] to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Approved Trade Account
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Terms: Net 20th Month
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-2">
                {customer?.tradingName || "AutoCare Auckland"} Credit Line
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                NZBN: {customer?.nzbn || "9429041234567"} • GST No: {customer?.billingDetails.gstNumber || "104-982-120"}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Available Sourcing Credit</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
                ${(customer?.billingDetails.creditAvailableNzd || 18450).toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                of ${(customer?.billingDetails.creditLimitNzd || 25000).toLocaleString("en-NZ")} facility limit
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 relative z-10">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>Credit Utilized: $6,550.00 (26.2%)</span>
              <span className="text-emerald-400">Available: $18,450.00 (73.8%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: "73.8%" }}
              />
            </div>
          </div>

          {/* Quick Credit Info Footnote */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant quote authorization</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero supplier pre-payment hold</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Consolidated monthly invoicing</span>
            </div>
          </div>
        </div>

        {/* Bank Transfer Remittance Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-autohub-navy font-bold text-xs">
                <Landmark className="w-4 h-4 text-autohub-red" />
                <span>Bank Transfer Instructions</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                ANZ New Zealand
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              For prepayment orders, please remit funds using the details below. Payments clear same business day.
            </p>

            <div className="space-y-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Bank:</span>
                <span className="font-semibold text-slate-900">ANZ Bank New Zealand</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Account Name:</span>
                <span className="font-semibold text-slate-900">Autohub NZ Ltd - Trade</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 text-[11px]">Account No:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-autohub-navy">06-0801-0498210-00</span>
                  <button
                    onClick={() => copyToClipboard("06-0801-0498210-00", "acc")}
                    className="text-slate-400 hover:text-slate-700 transition"
                    title="Copy Account Number"
                  >
                    {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">SWIFT / BIC:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">ANZBNZ22</span>
                  <button
                    onClick={() => copyToClipboard("ANZBNZ22", "swift")}
                    className="text-slate-400 hover:text-slate-700 transition"
                    title="Copy SWIFT Code"
                  >
                    {copiedField === "swift" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500 text-[11px]">Reference:</span>
                <span className="font-bold text-autohub-red bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                  [Your Request #] e.g. AH-P-000123
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Fast Clearance: Within 2 Hours</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-Reconciled
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Paid YTD</span>
            <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
              ${totalPaid.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-block">
              All IRD tax receipts archived
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Pending Remittance</span>
            <div className="text-xl font-bold text-amber-600 mt-1 font-mono">
              ${totalPending.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
              Awaiting direct bank clearance or trade order
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Payment Method</span>
            <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-autohub-navy" />
              <span>Net 20th Month Credit</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
              Direct Bank Transfer backup
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Payment History & Status Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Payment History & Tax Invoices
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official records, transaction statuses, and GST compliance tax invoices.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(["ALL", "PAID", "PENDING", "OVERDUE"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === filter
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {filter === "ALL" ? "All Records" : filter}
              </button>
            ))}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No transactions found for this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-6">Invoice #</th>
                  <th className="py-3 px-6">Request & Vehicle</th>
                  <th className="py-3 px-6">Method</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Amount (NZD)</th>
                  <th className="py-3 px-6 text-right">GST (15%)</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredInvoices.map((req) => {
                  const inv = req.invoice || {
                    invoiceNumber: `INV-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}`,
                    receiptNumber: req.status === "DELIVERED" || req.status === "PAYMENT_CONFIRMED" || req.status === "COMPLETED" ? `REC-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}` : undefined,
                    dateIssued: req.submittedDate,
                    dueDate: req.submittedDate,
                    customerName: req.customerName,
                    customerNzbn: req.customerNzbn,
                    customerGstNumber: "104-982-120",
                    billingAddress: "42 Great South Road, Penrose, Auckland 1061",
                    paymentMethod: "TRADE_CREDIT" as const,
                    paymentReference: req.referenceNumber,
                    subtotalNzd: (req.quote?.totalNzd || 485) / 1.15,
                    gstRate: 0.15,
                    gstAmountNzd: (req.quote?.totalNzd || 485) - (req.quote?.totalNzd || 485) / 1.15,
                    totalNzd: req.quote?.totalNzd || 485,
                    status: req.status === "AWAITING_PAYMENT" ? ("PENDING" as const) : req.status === "PAYMENT_DISPUTED" ? ("OVERDUE" as const) : ("PAID" as const),
                  };

                  const isPaid = inv.status === "PAID" || req.status === "PAYMENT_CONFIRMED" || req.status === "DELIVERED" || req.status === "IN_TRANSIT" || req.status === "ORDERED_FROM_SUPPLIER";

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6 font-mono font-bold text-autohub-navy">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href={`/portal/requests/${req.id}`}
                          className="font-bold text-slate-900 hover:text-autohub-red transition flex items-center gap-1.5"
                        >
                          <span>{req.referenceNumber}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </Link>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • {req.part.partName}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {inv.paymentMethod === "TRADE_CREDIT" ? "Trade Credit" : "Bank Transfer"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            PAID
                          </span>
                        ) : req.status === "PAYMENT_DISPUTED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            FAILED / DISPUTE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            AWAITING PAYMENT
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                        ${inv.totalNzd.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-500">
                        ${inv.gstAmountNzd.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice({ invoice: inv, request: req })}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            title="Download Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-autohub-navy" />
                            <span>Invoice</span>
                          </button>
                          {isPaid && (
                            <button
                              onClick={() => setSelectedInvoice({ invoice: inv, request: req })}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                              title="Download Receipt"
                            >
                              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Receipt</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Invoice & Receipt Modal Viewer */}
      {selectedInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice.invoice}
          request={selectedInvoice.request}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

function FolderArchiveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <path d="M12 11v6" />
      <path d="m9 14 3 3 3-3" />
    </svg>
  );
}
