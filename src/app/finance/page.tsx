"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  Scale,
  FileText,
  Landmark,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredCustomers,
  getStoredTransactions,
  getStoredReconciliations,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, TradeCustomer, FinancialTransaction, ReconciliationRecord, TaxInvoice } from "@/lib/types";
import { InvoiceViewer } from "@/components/InvoiceViewer";
import { ReceiptViewer } from "@/components/ReceiptViewer";

export default function FinanceDashboardPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>([]);

  const [selectedInvoiceData, setSelectedInvoiceData] = useState<{
    invoice: TaxInvoice;
    request?: PartRequest;
  } | null>(null);
  const [selectedReceiptData, setSelectedReceiptData] = useState<{
    invoice: TaxInvoice;
    request?: PartRequest;
  } | null>(null);

  const refresh = () => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    setTransactions(getStoredTransactions());
    setReconciliations(getStoredReconciliations());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Compute key financial metrics
  const paidRequests = requests.filter(
    (r) => r.invoice?.status === "PAID" || r.status === "PAYMENT_CONFIRMED"
  );
  const totalRealizedRevenue = paidRequests.reduce(
    (sum, r) => sum + (r.invoice?.totalNzd || r.quote?.totalNzd || 0),
    0
  );

  const awaitingPaymentRequests = requests.filter(
    (r) =>
      r.status === "AWAITING_PAYMENT" ||
      (r.invoice && (r.invoice.status === "PENDING" || r.invoice.status === "PARTIALLY_PAID"))
  );
  const totalOutstandingReceivables = awaitingPaymentRequests.reduce(
    (sum, r) => sum + (r.invoice?.totalNzd || r.quote?.totalNzd || 0),
    0
  );

  const activeQuotePipeline = requests
    .filter((r) => r.quote && r.status === "AWAITING_CUSTOMER_APPROVAL")
    .reduce((sum, r) => sum + (r.quote?.totalNzd || 0), 0);

  const tradeCreditOrders = awaitingPaymentRequests.filter(
    (r) => r.invoice?.paymentMethod === "TRADE_CREDIT"
  );

  const unreconciledItems = reconciliations.filter(
    (rec) => rec.status !== "MATCHED"
  );

  const totalCreditFacilityLimit = customers.reduce(
    (sum, c) => sum + c.billingDetails.creditLimitNzd,
    0
  );
  const totalCreditAvailable = customers.reduce(
    (sum, c) => sum + c.billingDetails.creditAvailableNzd,
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#070e1e] via-[#0d1c3a] to-[#070e1e] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ed2025]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autohub Treasury &amp; Trade Credit Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Finance &amp; Corporate Billing Desk
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Real-time payment clearance, direct ANZ bank remittance reconciliation, sequential GST tax invoices,
              and trade credit facility risk controls for commercial automotive fleets and workshops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/finance/payments?action=record"
              className="px-4 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold text-xs transition shadow-lg shadow-red-900/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Record Payment</span>
            </Link>
            <Link
              href="/finance/reconciliation"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Bank Reconciliation</span>
            </Link>
            <Link
              href="/finance/reports"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Realized Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Realized Revenue
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            ${totalRealizedRevenue.toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{paidRequests.length} paid orders settled</span>
          </div>
        </div>

        {/* Metric 2: Outstanding Receivables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Receivables Due
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            ${totalOutstandingReceivables.toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-amber-600 font-medium mt-1.5 flex items-center gap-1">
            <span>{awaitingPaymentRequests.length} awaiting clearance</span>
          </div>
        </div>

        {/* Metric 3: Quote Pipeline */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quote Pipeline
            </span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            ${activeQuotePipeline.toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-blue-600 font-medium mt-1.5">
            Active Issued Quotes
          </div>
        </div>

        {/* Metric 4: Trade Credit Available */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Trade Credit Lines
            </span>
            <Landmark className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            ${totalCreditAvailable.toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1.5">
            of ${(totalCreditFacilityLimit / 1000).toFixed(0)}k limit active
          </div>
        </div>

        {/* Metric 5: Unreconciled Feed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Unreconciled
            </span>
            <Scale className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            {unreconciledItems.length}
          </div>
          <div className="text-[10px] text-cyan-700 font-medium mt-1.5">
            Bank Statement Lines
          </div>
        </div>

        {/* Metric 6: NZ GST Pool */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              GST Collected
            </span>
            <ShieldCheck className="w-4 h-4 text-[#ed2025]" />
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none font-mono">
            ${(totalRealizedRevenue * 0.15 / 1.15).toLocaleString("en-NZ", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-[#ed2025] font-medium mt-1.5">
            15% NZ IRD Remittance
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Payments Action Queue & Trade Credit Release Gate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Payments Awaiting Clearance */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Payments Queue: Awaiting Remittance
                </h3>
                <p className="text-xs text-slate-500">
                  Requests with quotes accepted or tax invoices issued awaiting bank receipt confirmation.
                </p>
              </div>
              <Link
                href="/finance/payments"
                className="text-xs font-bold text-[#ed2025] hover:underline flex items-center gap-1"
              >
                <span>Full Queue ({awaitingPaymentRequests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[420px] overflow-y-auto">
              {awaitingPaymentRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  All requests have verified payments! No orders currently pending clearance.
                </div>
              ) : (
                awaitingPaymentRequests.slice(0, 5).map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            req.invoice?.paymentMethod === "TRADE_CREDIT"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {req.invoice?.paymentMethod === "TRADE_CREDIT" ? "Trade Credit" : "Bank Transfer"}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {req.invoice?.status || "PENDING"}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {req.part.partName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {req.customerName} • {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                      <div className="font-mono font-black text-sm text-slate-900">
                        ${(req.invoice?.totalNzd || req.quote?.totalNzd || 0).toFixed(2)}
                      </div>
                      <Link
                        href={`/finance/payments?action=record&id=${req.id}`}
                        className="px-2.5 py-1 bg-[#ed2025] hover:bg-[#d3181d] text-white text-[10px] font-bold rounded-lg transition shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Record Payment</span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ANZ Trust Account: <strong>06-0801-0498210-00</strong></span>
            <Link
              href="/finance/payments"
              className="text-[#ed2025] font-semibold hover:underline"
            >
              Manage All Statuses →
            </Link>
          </div>
        </div>

        {/* Right Column: Trade Credit Validation Gate */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Trade Credit Release Gate
                </h3>
                <p className="text-xs text-slate-500">
                  Manual validation desk verifying customer credit lines before releasing orders to procurement.
                </p>
              </div>
              <Link
                href="/finance/credit"
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <span>Credit Accounts ({customers.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[420px] overflow-y-auto">
              {tradeCreditOrders.length === 0 ? (
                <div className="py-8 space-y-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">Trade Credit Gate Clear</div>
                      <div className="text-slate-600 mt-0.5">
                        All trade credit orders have been validated. You can view existing customer credit facility limits and balances.
                      </div>
                    </div>
                  </div>

                  {customers.slice(0, 3).map((cust) => (
                    <div key={cust.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {cust.tradingName || cust.legalBusinessName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          NZBN: {cust.nzbn} • Terms: {cust.billingDetails.paymentTerms.replace(/_/g, " ")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-emerald-700">
                          ${cust.billingDetails.creditAvailableNzd.toLocaleString("en-NZ")} Avail
                        </div>
                        <div className="text-[10px] text-slate-400">
                          of ${cust.billingDetails.creditLimitNzd.toLocaleString("en-NZ")} limit
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                tradeCreditOrders.map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                          Trade Credit
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {req.part.partName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Client: {req.customerName}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                      <div className="font-mono font-black text-sm text-slate-900">
                        ${(req.invoice?.totalNzd || req.quote?.totalNzd || 0).toFixed(2)}
                      </div>
                      <Link
                        href={`/finance/credit?validate=${req.id}`}
                        className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold rounded-lg transition shadow-xs flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Validate Credit</span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Risk Policy: <strong>Strict Net 20th Cap</strong></span>
            <Link
              href="/finance/credit"
              className="text-purple-700 font-semibold hover:underline"
            >
              Open Credit Desk →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Financial Transactions Register (Live Ledger)
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of all invoices, payments, trade credit draws, and refunds processed across the procurement platform.
            </p>
          </div>
          <Link
            href="/finance/transactions"
            className="text-xs font-bold text-[#ed2025] hover:underline flex items-center gap-1"
          >
            <span>View Full Ledger ({transactions.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4 text-right">Amount (NZD)</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.slice(0, 6).map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(txn.timestamp).toLocaleDateString("en-NZ", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        txn.type === "PAYMENT_RECEIVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : txn.type === "TRADE_CREDIT_UTILIZED"
                          ? "bg-purple-100 text-purple-800"
                          : txn.type === "REFUND_PROCESSED"
                          ? "bg-rose-100 text-rose-800"
                          : txn.type === "CREDIT_ADJUSTMENT"
                          ? "bg-cyan-100 text-cyan-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {txn.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {txn.referenceNumber}
                    {txn.invoiceNumber && (
                      <span className="text-[10px] text-slate-400 block">
                        {txn.invoiceNumber}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-800 font-medium truncate max-w-[200px]">
                    {txn.customerName}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span
                      className={
                        txn.direction === "INFLOW"
                          ? "text-emerald-700"
                          : txn.direction === "OUTFLOW"
                          ? "text-rose-600"
                          : "text-slate-900"
                      }
                    >
                      {txn.direction === "INFLOW" ? "+" : txn.direction === "OUTFLOW" ? "-" : ""}
                      ${txn.amountNzd.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {txn.paymentMethod.replace(/_/g, " ")}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {txn.officerName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoiceData && (
        <InvoiceViewer
          invoice={selectedInvoiceData.invoice}
          request={selectedInvoiceData.request || requests[0]}
          isOpen={true}
          onClose={() => setSelectedInvoiceData(null)}
        />
      )}

      {/* Receipt Viewer Modal */}
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
