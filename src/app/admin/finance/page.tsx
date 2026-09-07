"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredCustomers,
  confirmPayment,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, TradeCustomer } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { InvoiceViewer } from "@/components/InvoiceViewer";

export default function FinanceDeskPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [selectedInvoiceReq, setSelectedInvoiceReq] = useState<PartRequest | null>(null);
  const [reconciliationRef, setReconciliationRef] = useState("");
  const [successNote, setSuccessNote] = useState<string | null>(null);

  useEffect(() => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      setCustomers(getStoredCustomers());
    });
    return unsub;
  }, []);

  const awaitingPaymentQueue = requests.filter(
    (r) => r.status === "AWAITING_PAYMENT"
  );
  const paidOrders = requests.filter(
    (r) => r.invoice && r.invoice.status === "PAID"
  );

  // Financial totals
  const totalRevenue = paidOrders.reduce(
    (sum, r) => sum + (r.invoice ? r.invoice.totalNzd : 0),
    0
  );
  const totalPending = awaitingPaymentQueue.reduce(
    (sum, r) => sum + (r.quote ? r.quote.totalNzd : 0),
    0
  );

  const handleManualReconciliation = (req: PartRequest) => {
    confirmPayment(
      req.id,
      "BANK_TRANSFER",
      "Clara Jenkins (Finance)",
      "Bank remittance matched with ANZ statement"
    );
    setSuccessNote(`Payment cleared for ${req.referenceNumber}! Tax invoice marked PAID and procurement gate released.`);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Finance & Billing Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">Officer: Clara Jenkins</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Payment Gate, Bank Reconciliation & GST Tax Invoices
          </h1>
          <p className="text-xs text-slate-500">
            Verify manual bank transfer remittances, manage trade credit accounts, and issue IRD-compliant tax receipts.
          </p>
        </div>
      </div>

      {successNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successNote}</span>
        </div>
      )}

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Total Revenue Cleared (NZD)
          </span>
          <span className="text-2xl font-black text-emerald-700 block mt-1 font-mono">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {paidOrders.length} orders settled through Autohub trust
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm bg-amber-50/20">
          <span className="text-amber-800 block text-[10px] uppercase font-bold">
            Awaiting Payment Clearance
          </span>
          <span className="text-2xl font-black text-amber-900 block mt-1 font-mono">
            ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD
          </span>
          <span className="text-[10px] text-amber-700 mt-1 block font-medium">
            {awaitingPaymentQueue.length} consignments on payment gate hold
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">
            Active Trade Credit Lines
          </span>
          <span className="text-2xl font-black text-slate-900 block mt-1 font-mono">
            $60,000 NZD
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Net 20th of the month trade accounts
          </span>
        </div>
      </div>

      {/* Payment Gate Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Orders Awaiting Bank Clearance ({awaitingPaymentQueue.length})
            </h3>
            <p className="text-xs text-slate-500">
              Match incoming ANZ bank statement transaction with request reference number.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Payment Gate Enforced
          </span>
        </div>

        {awaitingPaymentQueue.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No orders currently pending payment gate clearance.
          </div>
        ) : (
          <div className="space-y-3">
            {awaitingPaymentQueue.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-autohub-navy text-sm">
                      {req.referenceNumber}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {req.customerName}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • {req.part.partName}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Invoice: <strong>{req.invoice?.invoiceNumber || "INV-PENDING"}</strong> • Bank Account: ANZ 06-0801-0498210-00
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 font-mono block">
                      ${req.invoice?.totalNzd.toFixed(2)} NZD
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Incl. 15% GST (${req.invoice?.gstAmountNzd.toFixed(2)})
                    </span>
                  </div>

                  <button
                    id={`finance-clear-payment-${req.id}`}
                    onClick={() => handleManualReconciliation(req)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Payment & Release</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settled Transactions & Tax Invoices Register */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            GST Tax Invoice & Receipt Register ({paidOrders.length})
          </h3>
          <span className="text-xs text-slate-500">Sequential Invoicing Act 1985</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Customer Entity</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">GST (15%)</th>
                <th className="py-3 px-4 text-right">Total NZD</th>
                <th className="py-3 px-4 text-center">Tax Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidOrders.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-autohub-navy">
                    {req.invoice?.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                    {req.invoice?.receiptNumber || "-"}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {req.customerName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {req.referenceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] bg-slate-100 font-semibold px-2 py-0.5 rounded text-slate-700">
                      {req.invoice?.paymentMethod.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    ${req.invoice?.subtotalNzd.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    ${req.invoice?.gstAmountNzd.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    ${req.invoice?.totalNzd.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedInvoiceReq(req)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 mx-auto"
                    >
                      <FileText className="w-3.5 h-3.5 text-autohub-navy" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoiceReq && selectedInvoiceReq.invoice && (
        <InvoiceViewer
          invoice={selectedInvoiceReq.invoice}
          request={selectedInvoiceReq}
          isOpen={!!selectedInvoiceReq}
          onClose={() => setSelectedInvoiceReq(null)}
        />
      )}
    </div>
  );
}
