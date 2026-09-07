"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  ShieldCheck,
  Building2,
  Send,
  FileCheck,
  Printer,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Plane,
  Anchor,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Search,
} from "lucide-react";
import {
  getStoredRequests,
  markOrderedFromSupplier,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests } from "@/lib/mockData";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function SupplierOrdersPage() {
  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [tabFilter, setTabFilter] = useState<"READY" | "TRANSMITTED" | "ALL">("READY");
  const [searchQuery, setSearchQuery] = useState("");
  const [poNotes, setPoNotes] = useState("Priority packaging and air waybill dispatch. Export Bay: Centrair Nagoya Terminal.");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loaded = getStoredRequests();
    setRequests(loaded);

    const unsub = subscribeToStore(() => {
      const refreshed = getStoredRequests();
      setRequests(refreshed);
    });
    return unsub;
  }, []);

  // Derived Queues
  const readyForPoQueue = requests.filter(
    (r) => r.status === "PAYMENT_CONFIRMED"
  );
  const transmittedQueue = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "DELIVERED"
  );

  // Active Selected Request
  const activeReq =
    requests.find((r) => r.id === selectedRequestId) ||
    readyForPoQueue[0] ||
    requests[0];

  // Filtered List
  const displayedRequests =
    tabFilter === "READY"
      ? readyForPoQueue
      : tabFilter === "TRANSMITTED"
      ? transmittedQueue
      : requests;

  // Selected Winning Quote for Active Request
  const activeQuote =
    activeReq?.supplierQuotes?.find((sq) => sq.id === activeReq.quote?.selectedSupplierQuoteId) ||
    activeReq?.supplierQuotes?.[0];

  const handleTransmitPo = () => {
    if (!activeReq) return;

    markOrderedFromSupplier(
      activeReq.id,
      "Nathan Cole (Sourcing Specialist)",
      poNotes
    );

    const poCode = `PO-${activeReq.referenceNumber.replace("AH-P-", "")}`;
    setSuccessMsg(`Official Purchase Order ${poCode} transmitted to overseas vendor! Status updated to ORDERED FROM SUPPLIER.`);
    setTimeout(() => setSuccessMsg(""), 6000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Payment-Cleared Release Gate
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Supplier Purchase Order Transmission Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly gated procurement release. Transmit binding Purchase Orders (POs) to international suppliers only after customer payment clearance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero Financial Exposure Protocol Active</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Ready for PO Release
            </span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            {readyForPoQueue.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Customer payment verified and cleared
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Transmitted to Vendors
            </span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {transmittedQueue.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Orders active in overseas fulfillment
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Committed Sourcing Value
            </span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            $24,680 <span className="text-sm font-semibold text-slate-500">NZD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total active international supplier commitments
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Gate Release SLA
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            18 <span className="text-sm font-semibold text-slate-500">mins</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Average time from payment to PO transmission
          </p>
        </div>
      </div>

      {/* Main Content: Full-Width Table List or Full PO Details */}
      {!selectedRequestId || !activeReq ? (
        <div className="space-y-4">
          {/* Filter Toolbar: Tabs + Search */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setTabFilter("READY")}
                className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  tabFilter === "READY"
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ready to Order ({readyForPoQueue.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("TRANSMITTED")}
                className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  tabFilter === "TRANSMITTED"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Transmitted ({transmittedQueue.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter("ALL")}
                className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  tabFilter === "ALL"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Orders ({requests.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO ref, VIN, part, customer..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Full-Width Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 pl-6">PO Reference &amp; Date</th>
                    <th className="p-4">Requested Part</th>
                    <th className="p-4">Target Vehicle &amp; VIN</th>
                    <th className="p-4">Customer &amp; Payment</th>
                    <th className="p-4">Total (NZD)</th>
                    <th className="p-4">Gate Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {displayedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        No orders found in this category.
                      </td>
                    </tr>
                  ) : (
                    displayedRequests.map((req) => {
                      const isPaid = req.status === "PAYMENT_CONFIRMED";
                      return (
                        <tr key={req.id} className="hover:bg-slate-50/70 transition group">
                          <td className="p-4 pl-6">
                            <div className="font-mono font-bold text-slate-900">
                              PO-{req.referenceNumber.replace("AH-P-", "")}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400">
                              {req.referenceNumber}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">{req.part.partName}</div>
                            <div className="font-mono text-[11px] text-slate-400">
                              {req.part.oemPartNumber || "OEM Genuine Spec"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-800">{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</div>
                            <div className="font-mono text-[10px] text-slate-400">VIN: {req.vehicle.vin}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-700">{req.customerName}</div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {req.invoice?.paymentMethod === "TRADE_CREDIT" ? "Trade Credit" : "Bank Transfer"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-mono font-bold text-slate-900">
                              ${req.invoice?.totalNzd ? req.invoice.totalNzd.toFixed(2) : "1,280.00"} NZD
                            </div>
                            <div className="text-[10px] text-emerald-700 font-medium">Funds Cleared</div>
                          </td>
                          <td className="p-4">
                            <StatusBadge status={req.status} />
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRequestId(req.id)}
                              className={`px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5 ${
                                isPaid
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-slate-900 hover:bg-slate-800 text-white"
                              }`}
                            >
                              <span>{isPaid ? "Review & Transmit" : "View PO Details"}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
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
      ) : (
        /* ================= FULL-WIDTH PO DETAILS & TRANSMISSION CONSOLE ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Return Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedRequestId("")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Purchase Orders</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-500">
                PO: PO-{activeReq.referenceNumber.replace("AH-P-", "")}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">Ref: {activeReq.referenceNumber}</span>
              <StatusBadge status={activeReq.status} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Payment Cleared Gate Guarantee Pill */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Payment Confirmed Gate Cleared
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Receipt {activeReq.invoice?.receiptNumber || "REC-2026-00842"} verified • Funds held in Autohub Trust Account
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xs font-mono font-bold text-emerald-900">
                  ${activeReq.invoice?.totalNzd ? activeReq.invoice.totalNzd.toFixed(2) : "1,280.00"} NZD
                </div>
                <div className="text-[10px] text-emerald-700">100% Cleared</div>
              </div>
            </div>

            {/* Official PO Header & Export Details */}
            <div className="border border-slate-200 rounded-2xl p-6 space-y-4 bg-slate-50/40">
              <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-4 gap-4">
                <div>
                  <div className="text-xs font-black tracking-tight text-slate-900">
                    AUTOHUB NEW ZEALAND LIMITED — GLOBAL PROCUREMENT DESK
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Nagoya Port Logistics Bay (JP) • Auckland Trade HQ (NZBN 9429038472910)
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs font-mono font-black text-rose-600">
                    PURCHASE ORDER: PO-{activeReq.referenceNumber.replace("AH-P-", "")}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    DATE: {new Date().toLocaleDateString("en-NZ")}
                  </div>
                </div>
              </div>

              {/* Vendor & Delivery Hub Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Overseas Supplier (Vendor):
                  </span>
                  <div className="font-bold text-slate-900 mt-1">
                    {activeQuote?.supplierName || "Toyota Nagoya Wholesale Distribution Center"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Terminal Hub: {activeQuote?.supplierCountry || "Japan"} • Currency: {activeQuote?.partCostCurrency || "JPY"}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Destination &amp; Freight Consolidation:
                  </span>
                  <div className="font-bold text-slate-900 mt-1">
                    Autohub Logistics Center — Auckland Terminal Bay 4
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Method: {activeReq.quote?.selectedFreightMethod === "AIR_EXPRESS" ? "Priority Air Express (Cathay / Air NZ)" : "Ocean Consolidation (Toyofuji)"}
                  </div>
                </div>
              </div>

              {/* Line Item Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Item / OEM Part Number</th>
                      <th className="p-3">Fitment Target</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3 text-right">Unit Ex-Hub Cost</th>
                      <th className="p-3 text-right">Total Landed (NZD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">
                        {activeReq.part.partName}
                        <span className="block font-mono text-[10px] text-slate-400">
                          {activeReq.part.oemPartNumber || "OEM Genuine Spec"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model}
                        <span className="block font-mono text-[10px] text-slate-400">
                          VIN: {activeReq.vehicle.vin}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">1</td>
                      <td className="p-3 text-right font-mono font-bold">
                        {activeQuote?.partCostForeign ? `${activeQuote.partCostCurrency} ${activeQuote.partCostForeign.toLocaleString()}` : "¥48,000 JPY"}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-slate-900">
                        ${activeQuote?.partCostNzd ? activeQuote.partCostNzd.toFixed(2) : "518.40"} NZD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* PO Dispatch Instructions & Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Export Packaging &amp; Carrier Waybill Dispatch Instructions:</span>
                <span className="text-[10px] text-slate-400">Transmitted directly to overseas vendor</span>
              </label>
              <textarea
                rows={2}
                value={poNotes}
                onChange={(e) => setPoNotes(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleTransmitPo}
                disabled={activeReq.status === "ORDERED_FROM_SUPPLIER"}
                className={`flex-1 w-full py-3.5 rounded-2xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                  activeReq.status === "ORDERED_FROM_SUPPLIER"
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {activeReq.status === "ORDERED_FROM_SUPPLIER"
                    ? "PO Already Transmitted to Vendor"
                    : "Transmit Official PO to Overseas Vendor"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print PO PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
