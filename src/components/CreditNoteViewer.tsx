"use client";

import React from "react";
import { CreditNote } from "@/lib/types";
import { Printer, RotateCcw, ShieldCheck, X } from "lucide-react";

interface CreditNoteViewerProps {
  creditNote: CreditNote;
  isOpen: boolean;
  onClose: () => void;
}

export const CreditNoteViewer: React.FC<CreditNoteViewerProps> = ({
  creditNote,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const dateStr = new Date(creditNote.dateIssued).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-scaleIn">
        {/* Top Controls */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Official GST Credit Note • Autohub Finance Desk</span>
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

        {/* Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-slate-800 bg-white space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  AUTOHUB
                </span>
                <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider">
                  CREDIT NOTE
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
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                CREDIT ADJUSTMENT
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-2 font-mono">
                {creditNote.creditNoteNumber}
              </h2>
              <p className="text-xs text-slate-500">
                <strong>Referenced Invoice:</strong> {creditNote.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Date Issued:</strong> {dateStr}
              </p>
            </div>
          </div>

          {/* Client details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Credited To:
              </h4>
              <p className="font-bold text-slate-900">{creditNote.customerName}</p>
              <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                NZBN: {creditNote.customerNzbn} • GST: {creditNote.customerGstNumber}
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">{creditNote.billingAddress}</p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Refund Method &amp; Reference:
              </h4>
              <p className="text-slate-700">
                <strong>Method:</strong>{" "}
                <span className="font-semibold text-slate-900">
                  {creditNote.refundMethod === "BANK_DIRECT_CREDIT"
                    ? "Direct Bank Credit (NZ Account)"
                    : "Trade Credit Line Restoration"}
                </span>
              </p>
              <p className="text-slate-700 text-[11px] mt-0.5">
                <strong>Order Reference:</strong> {creditNote.requestReference}
              </p>
            </div>
          </div>

          {/* Reason Alert */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <span className="font-bold block mb-1">Reason for Credit Adjustment:</span>
            <span>{creditNote.reason}</span>
          </div>

          {/* Amount Box */}
          <div className="border border-rose-200 bg-rose-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                Total Credit Value (NZD)
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Applicable against future procurement or remitted to bank
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-rose-700 font-mono">
                ${creditNote.creditAmountNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] font-mono text-rose-800">NZD Incl. 15% GST</div>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Compliant with NZ GST Act 1985 Section 25 (Credit &amp; Debit Notes)</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Authorized Officer
              </span>
              <span className="font-bold text-slate-900">{creditNote.officerName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
