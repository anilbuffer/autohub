"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Users,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Printer,
  ExternalLink,
} from "lucide-react";
import {
  getStoredTransactions,
  getStoredCustomers,
  subscribeToStore,
} from "@/lib/store";
import { FinancialTransaction, TransactionType, TradeCustomer } from "@/lib/types";

interface PartyLedgerSummary {
  id: string;
  partyName: string;
  legalBusinessName: string;
  nzbn: string;
  businessType: string;
  creditLimitNzd: number;
  creditAvailableNzd: number;
  paymentTerms: string;
  creditStatus: string;
  totalInvoicedNzd: number;
  totalTradeCreditSettledNzd: number;
  totalBankPaidNzd: number;
  totalRefundsNzd: number;
  netOutstandingBalanceNzd: number;
  transactionsCount: number;
  transactions: FinancialTransaction[];
}

export default function TransactionsRegisterPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [viewMode, setViewMode] = useState<"JOURNAL" | "PARTY_WISE">("JOURNAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDirection, setSelectedDirection] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [channelFilter, setChannelFilter] = useState<"ALL" | "TRADE_CREDIT" | "BANK_TRANSFER">("ALL");
  const [expandedPartyId, setExpandedPartyId] = useState<string | null>(null);

  const refresh = () => {
    setTransactions(getStoredTransactions());
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Filtered transactions for Journal view
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedType !== "ALL" && t.type !== selectedType) return false;
      if (selectedDirection !== "ALL" && t.direction !== selectedDirection) return false;
      if (selectedStatus !== "ALL" && t.status !== selectedStatus) return false;

      if (channelFilter === "TRADE_CREDIT") {
        const isTradeCredit =
          t.paymentMethod === "TRADE_CREDIT" ||
          t.type === "TRADE_CREDIT_UTILIZED";
        if (!isTradeCredit) return false;
      }

      if (channelFilter === "BANK_TRANSFER") {
        const isBankTransfer =
          t.paymentMethod === "BANK_TRANSFER" ||
          t.type === "PAYMENT_RECEIVED";
        if (!isBankTransfer) return false;
      }

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
  }, [transactions, selectedType, selectedDirection, selectedStatus, channelFilter, searchQuery]);

  // Derive Party-Wise Ledger Summaries
  const partySummaries: PartyLedgerSummary[] = useMemo(() => {
    // Collect all known parties from customers and transactions
    const partyMap = new Map<string, PartyLedgerSummary>();

    // Seed from stored customers
    customers.forEach((c) => {
      partyMap.set(c.nzbn || c.id, {
        id: c.id,
        partyName: c.tradingName,
        legalBusinessName: c.legalBusinessName,
        nzbn: c.nzbn,
        businessType: c.businessType.replace(/_/g, " "),
        creditLimitNzd: c.billingDetails.creditLimitNzd || 0,
        creditAvailableNzd: c.billingDetails.creditAvailableNzd || 0,
        paymentTerms: c.billingDetails.paymentTerms || "Net 20th",
        creditStatus: c.billingDetails.status,
        totalInvoicedNzd: 0,
        totalTradeCreditSettledNzd: 0,
        totalBankPaidNzd: 0,
        totalRefundsNzd: 0,
        netOutstandingBalanceNzd: 0,
        transactionsCount: 0,
        transactions: [],
      });
    });

    // Populate transactions into parties
    transactions.forEach((txn) => {
      const key = txn.customerNzbn || txn.customerName;
      let party = partyMap.get(key);
      if (!party) {
        party = Array.from(partyMap.values()).find(
          (p) => p.partyName.toLowerCase() === txn.customerName.toLowerCase()
        );
      }

      if (!party) {
        party = {
          id: `PARTY-${txn.customerNzbn || Math.random().toString(36).substr(2, 6)}`,
          partyName: txn.customerName,
          legalBusinessName: txn.customerName,
          nzbn: txn.customerNzbn || "N/A",
          businessType: "COMMERCIAL_CLIENT",
          creditLimitNzd: 25000,
          creditAvailableNzd: 18000,
          paymentTerms: "Net 20th",
          creditStatus: "APPROVED",
          totalInvoicedNzd: 0,
          totalTradeCreditSettledNzd: 0,
          totalBankPaidNzd: 0,
          totalRefundsNzd: 0,
          netOutstandingBalanceNzd: 0,
          transactionsCount: 0,
          transactions: [],
        };
        partyMap.set(key, party);
      }

      party.transactions.push(txn);
      party.transactionsCount += 1;

      if (txn.type === "INVOICE_ISSUED") {
        party.totalInvoicedNzd += txn.amountNzd;
      } else if (txn.type === "TRADE_CREDIT_UTILIZED" || txn.paymentMethod === "TRADE_CREDIT") {
        party.totalTradeCreditSettledNzd += txn.amountNzd;
      } else if (txn.type === "PAYMENT_RECEIVED" || txn.paymentMethod === "BANK_TRANSFER") {
        party.totalBankPaidNzd += txn.amountNzd;
      } else if (txn.type === "REFUND_PROCESSED") {
        party.totalRefundsNzd += txn.amountNzd;
      }
    });

    // Compute net balance per party
    partyMap.forEach((p) => {
      p.netOutstandingBalanceNzd = Math.max(
        0,
        p.totalInvoicedNzd - (p.totalTradeCreditSettledNzd + p.totalBankPaidNzd) + p.totalRefundsNzd
      );
    });

    const list = Array.from(partyMap.values());

    // Apply search and channel filters to party view
    return list.filter((p) => {
      if (channelFilter === "TRADE_CREDIT" && p.totalTradeCreditSettledNzd === 0) return false;
      if (channelFilter === "BANK_TRANSFER" && p.totalBankPaidNzd === 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.partyName.toLowerCase().includes(q) ||
          p.legalBusinessName.toLowerCase().includes(q) ||
          p.nzbn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, transactions, channelFilter, searchQuery]);

  // Metrics
  const totalInflow = transactions
    .filter((t) => t.direction === "INFLOW")
    .reduce((sum, t) => sum + t.amountNzd, 0);

  const totalOutflow = transactions
    .filter((t) => t.direction === "OUTFLOW")
    .reduce((sum, t) => sum + t.amountNzd, 0);

  const tradeCreditTxnsCount = transactions.filter(
    (t) => t.paymentMethod === "TRADE_CREDIT" || t.type === "TRADE_CREDIT_UTILIZED"
  ).length;

  const bankPaidTxnsCount = transactions.filter(
    (t) => t.paymentMethod === "BANK_TRANSFER" || t.type === "PAYMENT_RECEIVED"
  ).length;

  const totalPartiesInvoiced = partySummaries.reduce((sum, p) => sum + p.totalInvoicedNzd, 0);
  const totalPartiesTradeCredit = partySummaries.reduce((sum, p) => sum + p.totalTradeCreditSettledNzd, 0);
  const totalPartiesBankPaid = partySummaries.reduce((sum, p) => sum + p.totalBankPaidNzd, 0);
  const totalPartiesOutstanding = partySummaries.reduce((sum, p) => sum + p.netOutstandingBalanceNzd, 0);

  // CSV Exporters
  const handleExportJournalCSV = () => {
    const headers = [
      "Transaction ID",
      "Timestamp",
      "Type",
      "Reference",
      "Invoice #",
      "Receipt #",
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
      `autohub_general_ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPartyLedgerCSV = () => {
    const headers = [
      "Party Name",
      "Legal Business Name",
      "NZBN",
      "Business Type",
      "Credit Limit NZD",
      "Total Invoiced NZD",
      "Trade Credit Settled NZD",
      "Bank Paid NZD",
      "Net Outstanding NZD",
      "Payment Terms",
      "Credit Status",
      "Total Transactions",
    ];

    const rows = partySummaries.map((p) => [
      `"${p.partyName.replace(/"/g, '""')}"`,
      `"${p.legalBusinessName.replace(/"/g, '""')}"`,
      p.nzbn,
      p.businessType,
      p.creditLimitNzd.toFixed(2),
      p.totalInvoicedNzd.toFixed(2),
      p.totalTradeCreditSettledNzd.toFixed(2),
      p.totalBankPaidNzd.toFixed(2),
      p.netOutstandingBalanceNzd.toFixed(2),
      p.paymentTerms,
      p.creditStatus,
      p.transactionsCount,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `autohub_party_wise_ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
              General Ledger
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Immutable Double-Entry Financial Log
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Financial Transactions &amp; General Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Audit-grade double entry journal register, customer party-wise statements, and verified payment channel records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("JOURNAL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "JOURNAL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-700" />
              <span>Journal View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("PARTY_WISE")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "PARTY_WISE"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#ed2025]" />
              <span>Party-Wise Ledger</span>
              <span className="text-[10px] bg-red-100 text-[#ed2025] font-bold px-1.5 py-0.2 rounded-full">
                {partySummaries.length}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={viewMode === "JOURNAL" ? handleExportJournalCSV : handleExportPartyLedgerCSV}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      {viewMode === "JOURNAL" ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
              Total Trade Parties
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {partySummaries.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Registered commercial accounts
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
              Total Party Receivables
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ${totalPartiesInvoiced.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-blue-600 mt-1">
              Tax invoices issued to date
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
              Settled (Credit + Bank)
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              ${(totalPartiesTradeCredit + totalPartiesBankPaid).toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              Trade Credit: ${totalPartiesTradeCredit.toLocaleString()} • Bank: ${totalPartiesBankPaid.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">
              Net Outstanding Balance
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">
              ${totalPartiesOutstanding.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-rose-500 mt-1 font-semibold">
              Current receivables awaiting settlement
            </div>
          </div>
        </div>
      )}

      {/* Main Filter & Content Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Trade Credit and Bank Paid Quick Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 text-xs">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                viewMode === "JOURNAL"
                  ? "Search ID, ref, client, invoice..."
                  : "Search party name, legal entity, NZBN..."
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
            />
          </div>

          {/* Trade Credit & Bank Paid Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Channel Filter:</span>

            <button
              type="button"
              onClick={() => setChannelFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                channelFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              <span>All Ledger</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {transactions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter("TRADE_CREDIT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                channelFilter === "TRADE_CREDIT"
                  ? "bg-purple-900 text-white border-purple-800 shadow-sm"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              <span>Trade Credit</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                channelFilter === "TRADE_CREDIT" ? "bg-purple-700 text-white" : "bg-purple-200 text-purple-800"
              }`}>
                {tradeCreditTxnsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setChannelFilter("BANK_TRANSFER")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                channelFilter === "BANK_TRANSFER"
                  ? "bg-emerald-900 text-white border-emerald-800 shadow-sm"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bank Paid</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                channelFilter === "BANK_TRANSFER" ? "bg-emerald-700 text-white" : "bg-emerald-200 text-emerald-800"
              }`}>
                {bankPaidTxnsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Filters (Journal Mode only) */}
        {viewMode === "JOURNAL" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-100 text-xs">
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
        )}

        {/* ================= VIEW 1: JOURNAL CHRONOLOGICAL TABLE ================= */}
        {viewMode === "JOURNAL" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Customer Party</th>
                  <th className="py-3 px-4 text-right">Amount (NZD)</th>
                  <th className="py-3 px-4">Method / Channel</th>
                  <th className="py-3 px-4">Officer</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No ledger transactions found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
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
                          NZBN: {txn.customerNzbn}
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
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          txn.paymentMethod === "TRADE_CREDIT" ? "text-purple-700" : "text-emerald-700"
                        }`}>
                          {txn.paymentMethod.replace(/_/g, " ")}
                        </span>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= VIEW 2: PARTY-WISE LEDGER LIST ================= */}
        {viewMode === "PARTY_WISE" && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Showing accounts and statement ledgers grouped by commercial party ({partySummaries.length} parties)</span>
              <span className="text-[11px] text-slate-400">Click a party row to expand line-by-line statement ledger</span>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
              {partySummaries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No parties matching search or channel filter criteria.
                </div>
              ) : (
                partySummaries.map((party) => {
                  const isExpanded = expandedPartyId === party.id;

                  return (
                    <div key={party.id} className="bg-white hover:bg-slate-50/50 transition">
                      {/* Party Header Row */}
                      <div
                        onClick={() => setExpandedPartyId(isExpanded ? null : party.id)}
                        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className="mt-0.5 w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition flex-shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-[#ed2025]" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900">
                                {party.partyName}
                              </h3>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                NZBN: {party.nzbn}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                {party.creditStatus === "APPROVED" ? "Credit Approved" : party.creditStatus}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400">
                                Terms: {party.paymentTerms}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {party.legalBusinessName} • {party.businessType} • {party.transactionsCount} transactions recorded
                            </div>
                          </div>
                        </div>

                        {/* Party Financial Summary Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right self-end md:self-center">
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Invoiced</span>
                            <span className="font-mono font-bold text-xs text-slate-900">
                              ${party.totalInvoicedNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-bold text-purple-600 block uppercase">Trade Credit</span>
                            <span className="font-mono font-bold text-xs text-purple-700">
                              ${party.totalTradeCreditSettledNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-bold text-emerald-600 block uppercase">Bank Paid</span>
                            <span className="font-mono font-bold text-xs text-emerald-700">
                              ${party.totalBankPaidNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] font-bold text-rose-600 block uppercase">Net Due</span>
                            <span className="font-mono font-black text-sm text-rose-600">
                              ${party.netOutstandingBalanceNzd.toLocaleString("en-NZ", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Party Statement Ledger */}
                      {isExpanded && (
                        <div className="bg-slate-50/80 p-4 sm:p-6 border-t border-slate-200 animate-fadeIn space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-[#ed2025]" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                Party Account Statement Ledger • {party.partyName}
                              </h4>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-3">
                              <span>Facility Limit: <strong>${party.creditLimitNzd.toLocaleString()} NZD</strong></span>
                              <span>•</span>
                              <span>Available: <strong className="text-emerald-700">${party.creditAvailableNzd.toLocaleString()} NZD</strong></span>
                            </div>
                          </div>

                          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="py-2.5 px-3">Date</th>
                                  <th className="py-2.5 px-3">Transaction ID</th>
                                  <th className="py-2.5 px-3">Type</th>
                                  <th className="py-2.5 px-3">Reference / Invoices</th>
                                  <th className="py-2.5 px-3 text-right">Debit (NZD)</th>
                                  <th className="py-2.5 px-3 text-right">Credit (NZD)</th>
                                  <th className="py-2.5 px-3">Channel</th>
                                  <th className="py-2.5 px-3">Officer</th>
                                  <th className="py-2.5 px-3 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {party.transactions.length === 0 ? (
                                  <tr>
                                    <td colSpan={9} className="py-8 text-center text-slate-400">
                                      No ledger transactions recorded yet for this trade party.
                                    </td>
                                  </tr>
                                ) : (
                                  party.transactions.map((t) => {
                                    const isDebit = t.type === "INVOICE_ISSUED";
                                    const isCredit = t.type === "PAYMENT_RECEIVED" || t.type === "TRADE_CREDIT_UTILIZED";

                                    return (
                                      <tr key={t.id} className="hover:bg-slate-50 transition">
                                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                          {new Date(t.timestamp).toLocaleDateString("en-NZ", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </td>
                                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                                          {t.id}
                                        </td>
                                        <td className="py-2.5 px-3">
                                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                            {t.type.replace(/_/g, " ")}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-3 font-mono text-[11px]">
                                          <div className="font-bold text-slate-800">{t.referenceNumber}</div>
                                          {t.invoiceNumber && (
                                            <div className="text-[10px] text-slate-400">{t.invoiceNumber}</div>
                                          )}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                          {isDebit ? `$${t.amountNzd.toFixed(2)}` : "—"}
                                        </td>
                                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                                          {isCredit ? `$${t.amountNzd.toFixed(2)}` : "—"}
                                        </td>
                                        <td className="py-2.5 px-3 text-[11px]">
                                          <span className={`font-semibold ${
                                            t.paymentMethod === "TRADE_CREDIT" ? "text-purple-700" : "text-emerald-700"
                                          }`}>
                                            {t.paymentMethod.replace(/_/g, " ")}
                                          </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-[11px] text-slate-500">
                                          {t.officerName}
                                        </td>
                                        <td className="py-2.5 px-3 text-center">
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            {t.status}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
