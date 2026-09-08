"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Search,
  Filter,
  Download,
  Shield,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  X,
  ArrowRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { getAllSystemAuditLogs, subscribeToStore } from "@/lib/store";
import { AuditLogEntry, UserRole } from "@/lib/types";

export default function SystemAuditTrailPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<"TODAY" | "7D" | "30D" | "ALL">("ALL");

  const refresh = () => {
    setAuditLogs(getAllSystemAuditLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
      (log.previousState && log.previousState.toLowerCase().includes(search.toLowerCase())) ||
      (log.newState && log.newState.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || log.actorRole === roleFilter;

    let matchesCategory = true;
    if (categoryFilter === "GOVERNANCE") {
      matchesCategory = log.action.toLowerCase().includes("account") || log.action.toLowerCase().includes("customer");
    } else if (categoryFilter === "STAFF") {
      matchesCategory = log.action.toLowerCase().includes("staff") || log.action.toLowerCase().includes("role");
    } else if (categoryFilter === "CONFIG") {
      matchesCategory = log.action.toLowerCase().includes("config") || log.action.toLowerCase().includes("microsoft 365") || log.action.toLowerCase().includes("policy");
    } else if (categoryFilter === "FINANCE") {
      matchesCategory = log.action.toLowerCase().includes("payment") || log.action.toLowerCase().includes("credit") || log.action.toLowerCase().includes("invoice");
    }

    let matchesDate = true;
    if (dateFilter !== "ALL") {
      const logDate = new Date(log.timestamp).getTime();
      const now = Date.now();
      if (dateFilter === "TODAY") {
        matchesDate = now - logDate < 24 * 60 * 60 * 1000;
      } else if (dateFilter === "7D") {
        matchesDate = now - logDate < 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === "30D") {
        matchesDate = now - logDate < 30 * 24 * 60 * 60 * 1000;
      }
    }

    return matchesSearch && matchesRole && matchesCategory && matchesDate;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Timestamp", "Actor Name", "Actor Role", "Action", "Previous State", "New State", "Details"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${(l.previousState || "").replace(/"/g, '""')}"`,
      `"${(l.newState || "").replace(/"/g, '""')}"`,
      `"${(l.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `autohub_system_audit_log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `autohub_system_audit_log_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setCategoryFilter("ALL");
    setDateFilter("ALL");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
              Tamper-Evident System Audit Trail
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Full System Audit Log with Multi-Dimensional Filters
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit record of staff provisioning, 5-role updates, customer account approvals/suspensions, baseline rate modifications, and M365 email dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
            title="Download CSV report"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
            title="Download JSON report"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-600" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={refresh}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Audit Records
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {auditLogs.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            System actions captured
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-blue-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Filtered Matches
          </span>
          <div className="text-3xl font-black text-blue-700 font-mono">
            {filteredLogs.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Matching current query criteria
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-purple-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
            Security &amp; Role Changes
          </span>
          <div className="text-3xl font-black text-purple-700 font-mono">
            {auditLogs.filter((l) => l.action.toLowerCase().includes("role") || l.action.toLowerCase().includes("deactivated") || l.action.toLowerCase().includes("staff")).length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Access credential transitions
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Customer Governance Actions
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {auditLogs.filter((l) => l.action.toLowerCase().includes("customer") || l.action.toLowerCase().includes("approved") || l.action.toLowerCase().includes("suspended")).length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Onboarding &amp; trade credit events
          </span>
        </div>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by action, actor name, reference, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/60 focus:bg-white transition outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SYSTEM_ADMIN">System Administrator</option>
              <option value="SOURCING_SPECIALIST">Sourcing Specialist</option>
              <option value="LOGISTICS_COORDINATOR">Logistics Coordinator</option>
              <option value="FINANCE_OFFICER">Finance Officer</option>
              <option value="CUSTOMER">Customer</option>
            </select>

            {/* Event Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="GOVERNANCE">Customer Governance (Approval / Suspend)</option>
              <option value="STAFF">Staff &amp; 5-Role Changes</option>
              <option value="CONFIG">System Config &amp; M365</option>
              <option value="FINANCE">Finance &amp; Credit Adjustments</option>
            </select>

            {/* Date Range Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDateFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  dateFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("TODAY")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  dateFilter === "TODAY" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("7D")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  dateFilter === "7D" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter("30D")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  dateFilter === "30D" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                30 Days
              </button>
            </div>

            {(search || roleFilter !== "ALL" || categoryFilter !== "ALL" || dateFilter !== "ALL") && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-2.5 py-2 text-[11px] font-bold text-[#ed2025] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Audit Event Records ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Sorted Newest First (UTC ISO-8601)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action / Event</th>
                <th className="py-3 px-4">State Transition</th>
                <th className="py-3 px-4">Details &amp; Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No system audit logs match the current search or filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-slate-900 block">{log.actorName}</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {log.actorRole}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {log.id}
                        </span>
                      </td>

                      {/* State Transition */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.previousState && log.newState ? (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {log.previousState}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                              {log.newState}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs sm:max-w-md">
                        <p className="truncate sm:whitespace-normal">{log.details || "—"}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
