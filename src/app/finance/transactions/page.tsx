"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import {
  getStoredTransactions,
  subscribeToStore,
} from "@/lib/store";
import { FinancialTransaction, TransactionType } from "@/lib/types";

export default function TransactionsRegisterPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDirection, setSelectedDirection] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const refresh = () => {
    setTransactions(getStoredTransactions());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Timestamp",
      "Type",
      "Reference",
      "Invoice #",
      "Receipt #",
      "Credit Note #",
      "Customer Name",
      "Customer NZBN",
      "Amount NZD",
      "Direction",
      "Payment Method",
      "Officer",
      "Status",
      "Notes",
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.timestamp,
      t.type,
      t.referenceNumber,
      t.invoiceNumber || "",
      t.receiptNumber || "",
      t.creditNoteNumber || "",
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.customerNzbn,
      t.amountNzd.toFixed(2),
      t.direction,
      t.paymentMethod,
      t.officerName,
      t.status,
      `"${(t.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `autohub_transactions_register_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (selectedType !== "ALL" && t.type !== selectedType) return false;
    if (selectedDirection !== "ALL" && t.direction !== selectedDirection) return false;
    if (selectedStatus !== "ALL" && t.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.customerNzbn.toLowerCase().includes(q) ||
        (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(q)) ||
        (t.receiptNumber && t.receiptNumber.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const totalInflow = transactions
    .filter((t) => t.direction === "INFLOW")
    .reduce((sum, t) => sum + t.amountNzd, 0);

  const totalOutflow = transactions
    .filter((t) => t.direction === "OUTFLOW")
    .reduce((sum, t) => sum + t.amountNzd, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
              General Ledger
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Immutable Financial Transaction Log
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Financial Transactions Register
          </h1>
          <p className="text-xs text-slate-500">
            Real-time audit register of all tax invoices issued, payments cleared, credit facilities drawn, and refund disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Total Ledger Entries
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {transactions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Audited financial movements
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Gross Payments Inflow
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            ${totalInflow.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Bank transfer &amp; trade credit settlements
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Gross Disbursements / Outflow
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            ${totalOutflow.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-rose-500 mt-1">
            Refunds &amp; credit notes disbursed
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
            Net Treasury Flow
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${(totalInflow - totalOutflow).toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
            Positive net operating cash
          </div>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Filters Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pb-4 border-b border-slate-100 text-xs">
          <div className="sm:col-span-1">
            <label className="font-bold text-slate-600 block mb-1 text-[11px]">
              Search Register:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID, ref, client, invoice..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1 text-[11px]">
              Transaction Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="INVOICE_ISSUED">Invoice Issued</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
              <option value="TRADE_CREDIT_UTILIZED">Trade Credit Utilized</option>
              <option value="REFUND_PROCESSED">Refund Processed</option>
              <option value="CREDIT_ADJUSTMENT">Credit Adjustment</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1 text-[11px]">
              Cash Direction:
            </label>
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Directions</option>
              <option value="INFLOW">Inflow (+)</option>
              <option value="OUTFLOW">Outflow (-)</option>
              <option value="NEUTRAL">Neutral (Invoice/Adj)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-600 block mb-1 text-[11px]">
              Settlement Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SETTLED">SETTLED</option>
              <option value="PENDING_SETTLEMENT">PENDING SETTLEMENT</option>
              <option value="REVERSED">REVERSED</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Amount (NZD)</th>
                <th className="py-3 px-4">Method / Channel</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                    {txn.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
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
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-800 text-xs">
                      {txn.referenceNumber}
                    </div>
                    {txn.invoiceNumber && (
                      <div className="text-[10px] text-slate-400">
                        {txn.invoiceNumber}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 truncate max-w-[180px]">
                      {txn.customerName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {txn.customerNzbn}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm">
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
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        txn.status === "SETTLED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
