"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Package,
  Car,
  Truck,
  FileText,
  Receipt,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { getStoredRequests, subscribeToStore } from "@/lib/store";
import { PartRequest, TaxInvoice } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { InvoiceViewer } from "@/components/InvoiceViewer";

export default function OrdersPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: TaxInvoice; request: PartRequest } | null>(null);

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Approved orders are those that have been approved, ordered, dispatched, in transit, or delivered
  const approvedOrders = requests.filter(
    (r) =>
      [
        "AWAITING_PAYMENT",
        "PAYMENT_CONFIRMED",
        "ORDERED_FROM_SUPPLIER",
        "SUPPLIER_DISPATCHED",
        "RECEIVED_AT_SHIPPING_FACILITY",
        "IN_TRANSIT",
        "ARRIVED_IN_NZ",
        "CUSTOMS_CLEARANCE",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "COMPLETED",
      ].includes(r.status) || r.quote?.status === "ACCEPTED"
  );

  const filtered = approvedOrders.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.referenceNumber.toLowerCase().includes(q) ||
      r.vehicle.make.toLowerCase().includes(q) ||
      r.vehicle.model.toLowerCase().includes(q) ||
      r.part.partName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Approved Procurement Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track confirmed parts orders moving through global supplier acquisition, freight, and biosecurity clearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/shipments"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Shipment Tracking</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter orders by reference number, vehicle, or part description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-900"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No approved orders match your query</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-6">Order Ref</th>
                  <th className="py-3 px-6">Vehicle & Specs</th>
                  <th className="py-3 px-6">Part Information</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Delivery Depot</th>
                  <th className="py-3 px-6 text-right">Value (NZD)</th>
                  <th className="py-3 px-6 text-right">Documents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filtered.map((req) => {
                  const inv = req.invoice || {
                    invoiceNumber: `INV-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}`,
                    receiptNumber: `REC-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}`,
                    dateIssued: req.submittedDate,
                    dueDate: req.submittedDate,
                    customerName: req.customerName,
                    customerNzbn: req.customerNzbn,
                    customerGstNumber: "104-982-120",
                    billingAddress: "42 Great South Road, Penrose, Auckland 1061",
                    paymentMethod: "TRADE_CREDIT" as const,
                    paymentReference: req.referenceNumber,
                    subtotalNzd: (req.quote?.totalNzd || 485) / 1.15,
                    gstRate: 0.15,
                    gstAmountNzd: (req.quote?.totalNzd || 485) - (req.quote?.totalNzd || 485) / 1.15,
                    totalNzd: req.quote?.totalNzd || 485,
                    status: "PAID" as const,
                  };

                  return (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6 font-mono font-bold text-autohub-navy">
                        <Link
                          href={`/portal/requests/${req.id}`}
                          className="hover:text-autohub-red transition flex items-center gap-1.5"
                        >
                          <span>{req.referenceNumber}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          VIN: {req.vehicle.vin}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 max-w-xs truncate">
                          {req.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          OEM: {req.part.oemPartNumber || "Verified Match"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-[11px]">
                        <div className="font-medium text-slate-900">{req.deliveryAddress.label}</div>
                        <div>{req.deliveryAddress.suburb}, {req.deliveryAddress.city}</div>
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                        ${(req.quote?.totalNzd || 485).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice({ invoice: inv, request: req })}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            title="Download Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-autohub-navy" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => setSelectedInvoice({ invoice: inv, request: req })}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                            title="Download Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Invoice & Receipt Modal Viewer */}
      {selectedInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice.invoice}
          request={selectedInvoice.request}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
