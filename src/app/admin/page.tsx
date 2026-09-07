"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Truck,
  Banknote,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { getStoredRequests, getStoredCustomers, subscribeToStore } from "@/lib/store";
import { PartRequest, TradeCustomer } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AISmartSearch } from "@/components/AISmartSearch";

export default function AdminOverviewPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);

  useEffect(() => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      setCustomers(getStoredCustomers());
    });
    return unsub;
  }, []);

  const sourcingQueue = requests.filter(
    (r) => r.status === "SUBMITTED" || r.status === "SOURCING"
  );
  const quotesIssued = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  );
  const paymentsQueue = requests.filter(
    (r) => r.status === "AWAITING_PAYMENT"
  );
  const logisticsQueue = requests.filter(
    (r) =>
      r.status === "PAYMENT_CONFIRMED" ||
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  );
  const pendingCustomers = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL"
  );

  return (
    <div className="space-y-6">
      {/* Overview Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Autohub Operations Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-functional view across Sourcing, Logistics, Billing, and Customer Governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/sourcing"
            className="px-4 py-2 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow"
          >
            Go to Sourcing Queue ({sourcingQueue.length})
          </Link>
        </div>
      </div>

      {/* Global AI Semantic Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-autohub-red" />
          Global Staff Order & Vehicle Search
        </span>
        <AISmartSearch placeholder="Search any vehicle, OEM part number, customer NZBN, or VIN..." />
      </div>

      {/* Role Work Queues Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sourcing Desk Card */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Sourcing Desk
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {sourcingQueue.length}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Requests awaiting supplier quotes
            </span>
          </div>
          <Link
            href="/admin/sourcing"
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1"
          >
            <span>Open Sourcing Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Finance Desk Card */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Finance & Billing
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {paymentsQueue.length}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Orders at Payment Gate
            </span>
          </div>
          <Link
            href="/admin/finance"
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1"
          >
            <span>Open Payments Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Logistics Desk Card */}
        <div className="bg-white rounded-3xl p-5 border border-blue-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Logistics & Customs
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {logisticsQueue.length}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Consignments in transit & port
            </span>
          </div>
          <Link
            href="/admin/logistics"
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1"
          >
            <span>Open Logistics Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Customer Approvals Card */}
        <div className="bg-white rounded-3xl p-5 border border-purple-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Customer Approvals
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {pendingCustomers.length}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Trade accounts pending NZBN check
            </span>
          </div>
          <Link
            href="/admin/customers"
            className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Global Recent Activity Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Active System Sourcing & Logistics Stream
          </h3>
          <span className="text-xs text-slate-500">
            Total {requests.length} Requests Managed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Vehicle Specs</th>
                <th className="py-3 px-4">Part</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Value (NZD)</th>
                <th className="py-3 px-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.slice(0, 6).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-autohub-navy">
                    {req.referenceNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {req.customerName}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {req.part.partName}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {req.quote ? `$${req.quote.totalNzd.toFixed(2)}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      href={`/portal/requests/${req.id}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-autohub-navy hover:text-white rounded-lg text-slate-700 text-xs font-semibold transition"
                    >
                      Open
                    </Link>
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
