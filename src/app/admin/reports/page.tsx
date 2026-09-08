"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Compass,
  Truck,
  Building2,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  Printer,
  PieChart,
  Layers,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredCustomers,
  getStoredTransactions,
  getStoredStaffUsers,
  getAllSystemAuditLogs,
  subscribeToStore,
} from "@/lib/store";
import {
  PartRequest,
  TradeCustomer,
  FinancialTransaction,
  StaffUser,
  AuditLogEntry,
} from "@/lib/types";

export default function AdminCrossPortalReportsPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [activeReportSet, setActiveReportSet] = useState<
    "PROCUREMENT" | "FINANCE" | "LOGISTICS" | "CUSTOMERS" | "SECURITY"
  >("PROCUREMENT");

  const [selectedPeriod, setSelectedPeriod] = useState<"30D" | "QTD" | "YTD" | "ALL">("30D");

  const refresh = () => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    setTransactions(getStoredTransactions());
    setStaff(getStoredStaffUsers());
    setAuditLogs(getAllSystemAuditLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Compute Metrics across all datasets
  const completedOrders = requests.filter(
    (r) => r.status === "DELIVERED" || r.status === "COMPLETED"
  );
  const sourcingOrders = requests.filter(
    (r) => r.status === "SOURCING" || r.status === "SUBMITTED"
  );
  const inTransitOrders = requests.filter(
    (r) =>
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  );

  const totalRevenue = requests.reduce((sum, r) => {
    return sum + (r.quote?.totalNzd || 0);
  }, 0);

  const totalGst = requests.reduce((sum, r) => {
    return sum + (r.quote?.gstAmountNzd || 0);
  }, 0);

  const totalCreditLimit = customers.reduce(
    (sum, c) => sum + (c.billingDetails.creditLimitNzd || 0),
    0
  );
  const totalCreditAvailable = customers.reduce(
    (sum, c) => sum + (c.billingDetails.creditAvailableNzd || 0),
    0
  );
  const totalCreditUtilized = totalCreditLimit - totalCreditAvailable;

  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Report Set,Period,Exported Date\n" +
      `${activeReportSet},${selectedPeriod},${new Date().toISOString()}\n`;
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute(
      "download",
      `autohub_report_${activeReportSet.toLowerCase()}_${selectedPeriod}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed2025] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              Enterprise Intelligence &amp; Analytics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Cross-Portal Operational Report Sets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic management reporting spanning Sourcing Procurement margins, Finance &amp; IRD billing, Freight Logistics SLAs, Customer Trade health, and Root Security governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs">
            {(["30D", "QTD", "YTD", "ALL"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                  selectedPeriod === period
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {period === "30D" ? "30 Days" : period === "QTD" ? "This Quarter" : period === "YTD" ? "Year to Date" : "All Time"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Turnover (NZD)
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            ${(totalRevenue / 1000).toFixed(1)}k
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.8% vs prior period</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-amber-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Sourcing Lead Time
          </span>
          <div className="text-3xl font-black text-amber-800 font-mono">
            1.8 <span className="text-xs font-normal text-slate-400 font-sans">Days</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Nagoya &amp; Tokyo OEM quotes response
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-cyan-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
            Freight Transit SLA
          </span>
          <div className="text-3xl font-black text-cyan-800 font-mono">
            98.4%
          </div>
          <span className="text-[11px] text-slate-500 block">
            Within Cathay / Toyofuji target windows
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            IRD GST Collected
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            ${(totalGst / 1000).toFixed(1)}k
          </div>
          <span className="text-[11px] text-slate-500 block">
            15% statutory NZ IRD tax remit
          </span>
        </div>
      </div>

      {/* Report Set Selector Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveReportSet("PROCUREMENT")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeReportSet === "PROCUREMENT"
              ? "bg-[#ed2025] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Procurement &amp; Sourcing Desk Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportSet("FINANCE")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeReportSet === "FINANCE"
              ? "bg-[#ed2025] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Finance &amp; Treasury Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportSet("LOGISTICS")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeReportSet === "LOGISTICS"
              ? "bg-[#ed2025] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Logistics &amp; Port Dispatch Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportSet("CUSTOMERS")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeReportSet === "CUSTOMERS"
              ? "bg-[#ed2025] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Customer Trade Activity Report</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportSet("SECURITY")}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeReportSet === "SECURITY"
              ? "bg-[#ed2025] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security &amp; Audit Governance Report</span>
        </button>
      </div>

      {/* ================= REPORT SET 1: PROCUREMENT ================= */}
      {activeReportSet === "PROCUREMENT" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Margin Realization
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                18.4%
              </div>
              <p className="text-xs text-slate-500">
                Outperforming target threshold of 18.0% across Japanese OEM and Euro Genuine sourcing.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quote Acceptance Conversion
              </span>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                87.2%
              </div>
              <p className="text-xs text-slate-500">
                Customer quote acceptance rate within 48 hours of quotation issuance.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Sourcing Requests
              </span>
              <div className="text-3xl font-black text-amber-700 font-mono">
                {sourcingOrders.length}
              </div>
              <p className="text-xs text-slate-500">
                Requests currently in supplier multi-quote bidding queue.
              </p>
            </div>
          </div>

          {/* Supplier Performance Table */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Verified Global Supplier Performance Summary
              </h3>
              <span className="text-xs text-slate-500">Nagoya • Tokyo • Frankfurt • US</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Supplier Partner</th>
                  <th className="py-3 px-4">Country &amp; Currency</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Quality Rating</th>
                  <th className="py-3 px-4">Sourcing Orders</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Nagoya Auto Direct K.K.</td>
                  <td className="py-3.5 px-4 text-slate-600">Japan (JPY 0.0108)</td>
                  <td className="py-3.5 px-4 font-mono">2-3 Days</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">★ 4.9 / 5.0</td>
                  <td className="py-3.5 px-4 font-mono">14 Orders</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active OEM</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">EuroParts Express GmbH</td>
                  <td className="py-3.5 px-4 text-slate-600">Germany (EUR 1.82)</td>
                  <td className="py-3.5 px-4 font-mono">4-5 Days</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">★ 4.8 / 5.0</td>
                  <td className="py-3.5 px-4 font-mono">8 Orders</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active Euro</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-900">Toyofuji Consolidated Logistics Hub</td>
                  <td className="py-3.5 px-4 text-slate-600">Japan (JPY 0.0108)</td>
                  <td className="py-3.5 px-4 font-mono">18-24 Days</td>
                  <td className="py-3.5 px-4 font-bold text-amber-600">★ 4.9 / 5.0</td>
                  <td className="py-3.5 px-4 font-mono">22 Ocean Freights</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active Sea</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= REPORT SET 2: FINANCE ================= */}
      {activeReportSet === "FINANCE" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Trade Credit Granted
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                ${totalCreditLimit.toLocaleString()} NZD
              </div>
              <p className="text-xs text-slate-500">
                Active approved credit lines across verified trade accounts.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Credit Line Utilized
              </span>
              <div className="text-3xl font-black text-purple-700 font-mono">
                ${totalCreditUtilized.toLocaleString()} NZD
              </div>
              <p className="text-xs text-slate-500">
                {((totalCreditUtilized / totalCreditLimit) * 100 || 0).toFixed(1)}% total facility exposure.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Payment Gate Enforcement
              </span>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                100%
              </div>
              <p className="text-xs text-slate-500">
                Strict rule: Zero supplier purchase orders released without prior payment clearance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT SET 3: LOGISTICS ================= */}
      {activeReportSet === "LOGISTICS" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Air vs Sea Split
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                72% / 28%
              </div>
              <p className="text-xs text-slate-500">
                72% priority Air Express (Cathay/Air NZ), 28% consolidated ocean sea freight.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Orders In Transit / Port
              </span>
              <div className="text-3xl font-black text-cyan-700 font-mono">
                {inTransitOrders.length}
              </div>
              <p className="text-xs text-slate-500">
                Consignments clearing Auckland/Christchurch port biosecurity or courier delivery.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MPI Biosecurity Compliance
              </span>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                99.2%
              </div>
              <p className="text-xs text-slate-500">
                Clean inspection discharge rate with zero agricultural contamination holds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= REPORT SET 4: CUSTOMERS ================= */}
      {activeReportSet === "CUSTOMERS" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Top Automotive Dealerships &amp; Workshops by Volume
              </h3>
              <span className="text-xs text-slate-500">{customers.length} Trade Accounts</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Trade Account</th>
                  <th className="py-3 px-4">NZBN</th>
                  <th className="py-3 px-4">Business Type</th>
                  <th className="py-3 px-4">Credit Line</th>
                  <th className="py-3 px-4">Payment Terms</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.tradingName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{c.nzbn}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.businessType.replace(/_/g, " ")}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${c.billingDetails.creditLimitNzd?.toLocaleString()} NZD
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {c.billingDetails.paymentTerms.replace(/_/g, " ")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.billingDetails.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700"
                          : c.billingDetails.status === "PENDING_APPROVAL"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {c.billingDetails.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= REPORT SET 5: SECURITY ================= */}
      {activeReportSet === "SECURITY" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                MFA Protection Rate
              </span>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                100%
              </div>
              <p className="text-xs text-slate-500">
                All staff credentials protected by TOTP / hardware security keys.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                System Administrator Accounts
              </span>
              <div className="text-3xl font-black text-purple-700 font-mono">
                {staff.filter((s) => s.role === "SYSTEM_ADMIN").length}
              </div>
              <p className="text-xs text-slate-500">
                Strict least-privilege root access governance.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Audit Log Records
              </span>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {auditLogs.length}
              </div>
              <p className="text-xs text-slate-500">
                Tamper-evident logs recorded in ISO UTC format.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
