"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Receipt as ReceiptIcon,
  Download,
  Building2,
  DollarSign,
  Layers,
  ArrowRight,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  getStoredRequests,
  generateTaxInvoiceForRequest,
  getNextInvoiceNumber,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, TaxInvoice } from "@/lib/types";
import { InvoiceViewer } from "@/components/InvoiceViewer";
import { ReceiptViewer } from "@/components/ReceiptViewer";

export default function InvoicesAndReceiptsPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"INVOICES" | "RECEIPTS" | "PENDING_GEN">("INVOICES");
  const [searchQuery, setSearchQuery] = useState("");
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Document modal viewers
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<{
    invoice: TaxInvoice;
    request: PartRequest;
  } | null>(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{
    invoice: TaxInvoice;
    request: PartRequest;
  } | null>(null);

  // Generate invoice modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedReqForInvoice, setSelectedReqForInvoice] = useState<PartRequest | null>(null);

  const refresh = () => {
    setRequests(getStoredRequests());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Requests that have invoices
  const invoicedRequests = requests.filter((r) => r.invoice !== undefined);

  // Requests that have receipts
  const receiptedRequests = requests.filter(
    (r) => r.invoice && (r.invoice.receiptNumber || r.invoice.status === "PAID")
  );

  // Requests with approved quote but no invoice yet
  const pendingGenerationRequests = requests.filter(
    (r) => r.quote && !r.invoice
  );

  const handleGenerateInvoice = (req: PartRequest) => {
    const inv = generateTaxInvoiceForRequest(req.id, "Clara Jenkins");
    if (inv) {
      setSuccessNote(
        `Sequential Tax Invoice ${inv.invoiceNumber} generated for ${req.referenceNumber}! NZ IRD standards applied.`
      );
      setGenerateModalOpen(false);
      setTimeout(() => setSuccessNote(null), 5000);
    }
  };

  // Filter lists
  const filteredInvoices = invoicedRequests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.invoice?.invoiceNumber.toLowerCase().includes(q) ||
      r.referenceNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.part.partName.toLowerCase().includes(q)
    );
  });

  const filteredReceipts = receiptedRequests.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.invoice?.receiptNumber && r.invoice.receiptNumber.toLowerCase().includes(q)) ||
      r.invoice?.invoiceNumber.toLowerCase().includes(q) ||
      r.referenceNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q)
    );
  });

  const totalInvoicedNzd = invoicedRequests.reduce(
    (sum, r) => sum + (r.invoice?.totalNzd || 0),
    0
  );
  const totalGstNzd = invoicedRequests.reduce(
    (sum, r) => sum + (r.invoice?.gstAmountNzd || 0),
    0
  );
  const totalReceiptsCount = receiptedRequests.length;

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              IRD Tax Compliance Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Autohub GST No: 104-982-120
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Sequential GST Tax Invoices &amp; Official Receipts
          </h1>
          <p className="text-xs text-slate-500">
            Generate and audit New Zealand Goods and Services Tax Act 1985 compliant tax invoices with continuous sequential numbering and official receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingGenerationRequests.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedReqForInvoice(pendingGenerationRequests[0]);
                setGenerateModalOpen(true);
              }}
              className="px-4 py-2 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Tax Invoice ({pendingGenerationRequests.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Total Invoiced Volume
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalInvoicedNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {invoicedRequests.length} sequential tax invoices
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            15% NZ GST Invoiced
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ${totalGstNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Itemized on all customer tax invoices
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Official Receipts Issued
          </div>
          <div className="text-2xl font-black text-blue-700 font-mono">
            {totalReceiptsCount}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">
            Sequential payment clearance receipts
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Next Sequential Invoice #
          </div>
          <div className="text-2xl font-black text-purple-700 font-mono">
            {getNextInvoiceNumber()}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">
            Next available auto-number
          </div>
        </div>
      </div>

      {/* Main Tabbed Desk */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("INVOICES")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "INVOICES"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tax Invoices ({invoicedRequests.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("RECEIPTS")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "RECEIPTS"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <ReceiptIcon className="w-3.5 h-3.5" />
              <span>Official Receipts ({totalReceiptsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("PENDING_GEN")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "PENDING_GEN"
                  ? "bg-[#ed2025] text-white shadow-xs"
                  : "bg-red-50 hover:bg-red-100 text-[#ed2025]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pending Generation ({pendingGenerationRequests.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice #, receipt #, client..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
            />
          </div>
        </div>

        {/* TAB 1: TAX INVOICES TABLE */}
        {activeTab === "INVOICES" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date Issued</th>
                  <th className="py-3 px-4">Trade Customer</th>
                  <th className="py-3 px-4">Order Ref &amp; Part</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">15% GST</th>
                  <th className="py-3 px-4 text-right">Total (NZD)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((req) => {
                  const inv = req.invoice!;
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(inv.dateIssued).toLocaleDateString("en-NZ", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{inv.customerName}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          NZBN: {inv.customerNzbn}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-slate-800">
                          {req.referenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {req.part.partName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${inv.subtotalNzd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        ${inv.gstAmountNzd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${inv.totalNzd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            inv.status === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : inv.status === "PENDING"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedInvoiceData({
                                invoice: inv,
                                request: req,
                              })
                            }
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Tax Invoice</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: RECEIPTS TABLE */}
        {activeTab === "RECEIPTS" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date Cleared</th>
                  <th className="py-3 px-4">Related Invoice</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Settlement Channel</th>
                  <th className="py-3 px-4 text-right">Amount Cleared</th>
                  <th className="py-3 px-4 text-center">Receipt Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReceipts.map((req) => {
                  const inv = req.invoice!;
                  const receiptNum = inv.receiptNumber || `REC-2026-${inv.invoiceNumber.replace("INV-2026-", "")}`;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-xs">
                        {receiptNum}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {inv.paidDate
                          ? new Date(inv.paidDate).toLocaleDateString("en-NZ", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Cleared"}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {inv.customerName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            inv.paymentMethod === "TRADE_CREDIT"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {inv.paymentMethod === "TRADE_CREDIT" ? "Trade Credit" : "Bank Transfer"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                        ${inv.totalNzd.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                          PAID IN FULL
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedReceiptData({
                              invoice: inv,
                              request: req,
                            })
                          }
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <ReceiptIcon className="w-3 h-3" />
                          <span>View Official Receipt</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PENDING GENERATION TABLE */}
        {activeTab === "PENDING_GEN" && (
          <div className="overflow-x-auto">
            {pendingGenerationRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                All approved quotes have sequential tax invoices generated! No requests pending generation.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Vehicle &amp; Part</th>
                    <th className="py-3 px-4">Quote Number</th>
                    <th className="py-3 px-4 text-right">Quote Total (NZD)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingGenerationRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {req.referenceNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {req.customerName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{req.part.partName}</div>
                        <div className="text-[11px] text-slate-500">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {req.quote?.quoteNumber}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${(req.quote?.totalNzd || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleGenerateInvoice(req)}
                          className="px-3 py-1.5 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Generate Tax Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

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
