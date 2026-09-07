"use client";

import React from "react";
import { TaxInvoice, PartRequest } from "@/lib/types";
import { Printer, CheckCircle2, ShieldCheck, X } from "lucide-react";

interface ReceiptViewerProps {
  invoice: TaxInvoice;
  request?: PartRequest;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  invoice,
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNumber = invoice.receiptNumber || `REC-2026-${invoice.invoiceNumber.replace("INV-2026-", "")}`;
  const paidDateStr = invoice.paidDate
    ? new Date(invoice.paidDate).toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-NZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-scaleIn">
        {/* Top Modal Controls */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Official GST Payment Receipt • Autohub Finance Desk</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-slate-800 bg-white space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  AUTOHUB
                </span>
                <span className="bg-[#ed2025] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                  FINANCE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Autohub New Zealand Limited
              </p>
              <p className="text-xs text-slate-500">
                Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                <strong>NZBN:</strong> 9429041234567 • <strong>GST No:</strong> 104-982-120
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                PAYMENT RECEIVED
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-2 font-mono">
                {receiptNumber}
              </h2>
              <p className="text-xs text-slate-500">
                <strong>Related Tax Invoice:</strong> {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Date Cleared:</strong> {paidDateStr}
              </p>
            </div>
          </div>

          {/* Customer & Remittance Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Received From:
              </h4>
              <p className="font-bold text-slate-900">{invoice.customerName}</p>
              <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                NZBN: {invoice.customerNzbn}
              </p>
              {invoice.billingAddress && (
                <p className="text-slate-500 text-[11px] mt-0.5">{invoice.billingAddress}</p>
              )}
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Settlement Details:
              </h4>
              <p className="text-slate-700">
                <strong>Method:</strong>{" "}
                <span className="font-semibold text-slate-900">
                  {invoice.paymentMethod === "TRADE_CREDIT"
                    ? "Trade Credit Facility (Net 20th)"
                    : "Direct Bank Remittance (ANZ Trust)"}
                </span>
              </p>
              <p className="text-slate-700 font-mono text-[11px] mt-0.5">
                <strong>Payment Ref:</strong> {invoice.paymentReference}
              </p>
              {request && (
                <p className="text-slate-700 text-[11px] mt-0.5">
                  <strong>Order / VIN:</strong> {request.referenceNumber} • {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                </p>
              )}
            </div>
          </div>

          {/* Amount Paid Highlight */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Total Payment Received &amp; Cleared
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Inclusive of 15.0% New Zealand Goods and Services Tax (GST)
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-emerald-700 font-mono">
                ${invoice.totalNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] font-mono text-emerald-800">NZD Cleared in Full</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Line Description</th>
                  <th className="py-2.5 px-4 text-right">Amount (NZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-2 px-4 font-sans text-slate-800">
                    Automotive Parts Sourcing &amp; Procurement Total (Excl. GST)
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${invoice.subtotalNzd.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-sans text-slate-800">
                    New Zealand GST (15.0%)
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${invoice.gstAmountNzd.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold font-sans">
                  <td className="py-2.5 px-4 text-slate-900">Total Paid:</td>
                  <td className="py-2.5 px-4 text-right text-emerald-700 font-mono text-sm">
                    ${invoice.totalNzd.toFixed(2)}
                  </td>
                </tr>
                <tr className="font-sans text-slate-500 text-[11px]">
                  <td className="py-2 px-4">Outstanding Balance Remaining:</td>
                  <td className="py-2 px-4 text-right font-mono font-bold text-slate-800">
                    $0.00 NZD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Official Stamp & Signoff */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autohub International Trust Account • Bank Verification Sealed</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Authorized By
              </span>
              <span className="font-bold text-slate-900">Clara Jenkins</span>, Senior Finance Officer
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
