"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plane,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { getStoredRequests, subscribeToStore } from "@/lib/store";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { AISmartSearch } from "@/components/AISmartSearch";

export default function CustomerDashboardPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Filter requests
  const filtered = requests.filter((r) => {
    if (filterStatus !== "ALL" && r.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.referenceNumber.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        (r.part.oemPartNumber && r.part.oemPartNumber.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Action required requests
  const quotesToApprove = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  );
  const awaitingPayment = requests.filter((r) => r.status === "AWAITING_PAYMENT");
  const inTransit = requests.filter(
    (r) =>
      r.status === "IN_TRANSIT" ||
      r.status === "ARRIVED_IN_NZ" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick AI Lookup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Procurement & Logistics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time sourcing progress, approve overseas quotations, and track door-to-door delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            id="dashboard-new-request-button"
            href="/portal/new-request"
            className="px-4 py-2.5 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Part Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold">Active Orders</span>
            <Clock className="w-4 h-4 text-autohub-navy" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {requests.filter((r) => r.status !== "DELIVERED" && r.status !== "COMPLETED").length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across global coordination
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200 bg-purple-50/20 shadow-sm">
          <div className="flex items-center justify-between text-purple-800 text-xs mb-2">
            <span className="font-bold">Quotes To Approve</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">
            {quotesToApprove.length}
          </div>
          <span className="text-[11px] text-purple-700 mt-1 block font-medium">
            Action required to initiate dispatch
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-2">
            <span className="font-bold">Awaiting Payment</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">
            {awaitingPayment.length}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">
            Bank transfer / credit release
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200 bg-blue-50/20 shadow-sm">
          <div className="flex items-center justify-between text-blue-800 text-xs mb-2">
            <span className="font-bold">In-Transit Shipments</span>
            <Plane className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">
            {inTransit.length}
          </div>
          <span className="text-[11px] text-blue-700 mt-1 block font-medium">
            Air Cargo / Ocean / Customs NZ
          </span>
        </div>
      </div>

      {/* Action-Required Banners */}
      {quotesToApprove.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-purple-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-autohub-red" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold">
                Action Required: Quotation Prepared for {quotesToApprove[0].referenceNumber}
              </h3>
              <p className="text-xs text-slate-300">
                {quotesToApprove[0].vehicle.year} {quotesToApprove[0].vehicle.make} {quotesToApprove[0].vehicle.model} • {quotesToApprove[0].part.partName}
              </p>
            </div>
          </div>
          <Link
            id="review-quote-banner-cta"
            href={`/portal/requests/${quotesToApprove[0].id}`}
            className="px-4 py-2 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Review Quote & Select Freight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {awaitingPayment.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                Payment Pending Clearance: {awaitingPayment[0].referenceNumber}
              </h3>
              <p className="text-xs text-amber-800">
                Total: ${awaitingPayment[0].quote?.totalNzd.toFixed(2)} NZD • Provide bank transfer receipt or release via Trade Credit line.
              </p>
            </div>
          </div>
          <Link
            href={`/portal/requests/${awaitingPayment[0].id}`}
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Complete Payment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Semantic Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <AISmartSearch />
      </div>

      {/* Table & Filtering */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Filter controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-autohub-navy" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Your Automotive Part Requests ({filtered.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-autohub-navy"
            >
              <option value="ALL">All Statuses</option>
              <option value="SOURCING">Sourcing Desk</option>
              <option value="AWAITING_CUSTOMER_APPROVAL">Review Quote</option>
              <option value="AWAITING_PAYMENT">Awaiting Payment</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="CUSTOMS_CLEARANCE">Customs Clearance NZ</option>
              <option value="DELIVERED">Delivered</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, vehicle, VIN..."
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-autohub-navy w-48 sm:w-60"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Vehicle Identification</th>
                <th className="py-3.5 px-4">Requested Part</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quoted Value</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No requests match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-blue-50/40 transition group"
                  >
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/portal/requests/${req.id}`}
                        className="font-mono font-bold text-autohub-navy hover:text-autohub-red flex items-center gap-1.5"
                      >
                        <span>{req.referenceNumber}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        VIN: {req.vehicle.vin}
                        {req.vehicle.registrationPlate && ` • Plate: ${req.vehicle.registrationPlate}`}
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

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(req.submittedDate).toLocaleDateString("en-NZ", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {req.quote ? `$${req.quote.totalNzd.toFixed(2)} NZD` : (
                        <span className="text-slate-400 text-[11px] font-normal">Sourcing...</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/portal/requests/${req.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-autohub-navy hover:text-white text-slate-700 text-xs font-semibold transition"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
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
