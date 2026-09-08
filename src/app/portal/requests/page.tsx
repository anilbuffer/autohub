"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  Download,
  ArrowRight,
  Car,
  Calendar,
  DollarSign,
} from "lucide-react";
import { getStoredRequests, subscribeToStore } from "@/lib/store";
import { PartRequest } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function RequestsHistoryPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  const filtered = requests.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        r.referenceNumber.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.vehicle.vin.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = [
      "Reference",
      "Vehicle Make",
      "Vehicle Model",
      "Year",
      "VIN",
      "Part Name",
      "Status",
      "Quoted NZD",
      "Submitted Date",
    ];
    const rows = filtered.map((r) => [
      r.referenceNumber,
      r.vehicle.make,
      r.vehicle.model,
      r.vehicle.year,
      r.vehicle.vin,
      `"${r.part.partName.replace(/"/g, '""')}"`,
      r.status,
      r.quote ? r.quote.totalNzd.toFixed(2) : "0.00",
      r.submittedDate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `autohub_procurly_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Procurement Request History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete audit record of past and present automotive parts requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/portal/new-request"
            className="px-4 py-2 bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            + New Request
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by ref, make, model, VIN, part..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-autohub-navy text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-autohub-navy text-xs"
          >
            <option value="ALL">All Lifecycles</option>
            <option value="SOURCING">Sourcing Desk</option>
            <option value="AWAITING_CUSTOMER_APPROVAL">Review Quote</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="PAYMENT_CONFIRMED">Payment Cleared</option>
            <option value="ORDERED_FROM_SUPPLIER">Ordered From Supplier</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="CUSTOMS_CLEARANCE">Customs Clearance NZ</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 pl-6">Reference</th>
                <th className="py-3.5 px-4">Vehicle Specs</th>
                <th className="py-3.5 px-4">Part Requirement</th>
                <th className="py-3.5 px-4">Lifecycle Status</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Total Landed (NZD)</th>
                <th className="py-3.5 px-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No requests found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 pl-6">
                      <Link
                        href={`/portal/requests/${req.id}`}
                        className="font-mono font-bold text-slate-900 hover:text-[#ed2025] block transition"
                      >
                        {req.referenceNumber}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        VIN: {req.vehicle.vin}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-medium text-slate-800 block truncate">
                        {req.part.partName}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Qty: {req.part.quantity} • {req.part.conditionRequirement}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(req.submittedDate).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {req.quote ? `$${req.quote.totalNzd.toFixed(2)}` : "Pending Quote"}
                    </td>

                    <td className="py-3.5 px-4 pr-6 text-right">
                      <Link
                        href={`/portal/requests/${req.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-xs"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
