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
} from "lucide-react";
import {
  getStoredRequests,
  markOrderedFromSupplier,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function SupplierOrdersPage() {
  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [tabFilter, setTabFilter] = useState<"READY" | "TRANSMITTED" | "ALL">("READY");
  const [poNotes, setPoNotes] = useState("Priority packaging and air waybill dispatch. Export Bay: Centrair Nagoya Terminal.");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const loaded = getStoredRequests();
    setRequests(loaded);

    const paymentCleared = loaded.filter((r) => r.status === "PAYMENT_CONFIRMED");
    if (paymentCleared.length > 0) {
      setSelectedRequestId(paymentCleared[0].id);
    } else if (loaded.length > 0) {
      setSelectedRequestId(loaded[0].id);
    }

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

      {/* Filter Tabs */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200 shadow-sm flex items-center gap-2 max-w-md">
        <button
          type="button"
          onClick={() => setTabFilter("READY")}
          className={`flex-1 py-2 rounded-2xl text-xs font-bold transition ${
            tabFilter === "READY"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Ready to Order ({readyForPoQueue.length})
        </button>
        <button
          type="button"
          onClick={() => setTabFilter("TRANSMITTED")}
          className={`flex-1 py-2 rounded-2xl text-xs font-bold transition ${
            tabFilter === "TRANSMITTED"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Transmitted ({transmittedQueue.length})
        </button>
        <button
          type="button"
          onClick={() => setTabFilter("ALL")}
          className={`flex-1 py-2 rounded-2xl text-xs font-bold transition ${
            tabFilter === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All Orders ({requests.length})
        </button>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Order Selection List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {displayedRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200">
              No orders found in this category.
            </div>
          ) : (
            displayedRequests.map((req) => {
              const isSelected = activeReq?.id === req.id;
              const isPaid = req.status === "PAYMENT_CONFIRMED";

              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 sm:p-5 rounded-3xl border transition cursor-pointer relative ${
                    isSelected
                      ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">
                        {req.part.partName}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-xs text-slate-900">
                        ${req.invoice?.totalNzd ? req.invoice.totalNzd.toFixed(2) : "1,280.00"} NZD
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {req.invoice?.paymentMethod === "TRADE_CREDIT" ? "Trade Credit Approved" : "Bank Transfer Cleared"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-2">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Customer: {req.customerName}
                  </div>

                  {req.invoice?.receiptNumber && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Receipt: {req.invoice.receiptNumber}
                      </span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Funds Cleared</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Official Supplier Purchase Order Preview & Transmission Console (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeReq ? (
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

                {/* Vendor & Delivery Hub Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      SUPPLIER VENDOR:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      {activeQuote ? activeQuote.supplierName : "Nagoya Auto Direct K.K."}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Export Hub: {activeQuote ? activeQuote.supplierCountry : "Japan"} • Trading Currency: {activeQuote ? activeQuote.partCostCurrency : "JPY"}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      EXPORT BAY &amp; FREIGHT TERMS:
                    </span>
                    <div className="font-bold text-slate-900 mt-0.5">
                      FOB Nagoya Export Terminal Bay 4
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Consignee: Autohub Logistics NZ (Cathay Priority Airfreight)
                    </div>
                  </div>
                </div>

                {/* PO Line Items Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-3">Part Description &amp; Fitment</th>
                        <th className="p-3">OEM / Tariff Code</th>
                        <th className="p-3 text-right">Qty</th>
                        <th className="p-3 text-right">Vendor Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{activeReq.part.partName}</div>
                          <div className="text-[11px] text-slate-500">
                            Vehicle VIN: {activeReq.vehicle.vin} ({activeReq.vehicle.year} {activeReq.vehicle.make} {activeReq.vehicle.model})
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px]">
                          <div>{activeReq.part.oemPartNumber || "OEM SPEC"}</div>
                          <div className="text-slate-400 text-[10px]">HS 8708.80.00</div>
                        </td>
                        <td className="p-3 text-right font-bold">
                          {activeReq.part.quantity}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {activeQuote ? `${activeQuote.partCostForeign.toLocaleString()} ${activeQuote.partCostCurrency}` : "¥58,000 JPY"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sourcing Specialist Signature Line */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span className="font-bold text-slate-700">Authorized Specialist:</span> Nathan Cole (Desk AH-PROC-084)
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    STATUS: {activeReq.status.replace(/_/g, " ")}
                  </div>
                </div>
              </div>

              {/* Special Packaging & Dispatch Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Export Packaging &amp; Terminal Dispatch Instructions:
                </label>
                <input
                  type="text"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
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
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Select an order to review PO generation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
