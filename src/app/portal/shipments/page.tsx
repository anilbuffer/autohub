"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Plane,
  Anchor,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Package,
} from "lucide-react";
import { getStoredRequests, subscribeToStore } from "@/lib/store";
import { PartRequest } from "@/lib/types";

export default function ShipmentsPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Filter requests that have shipment information or are in transit/delivered
  const shipmentRequests = requests.filter((r) => {
    const isRelevant =
      r.shipment ||
      ["ORDERED_FROM_SUPPLIER", "SUPPLIER_DISPATCHED", "IN_TRANSIT", "CUSTOMS_CLEARANCE", "OUT_FOR_DELIVERY", "DELIVERED"].includes(r.status);
    if (!isRelevant) return false;
    if (filter === "IN_TRANSIT") return r.status === "IN_TRANSIT" || r.status === "SUPPLIER_DISPATCHED" || r.status === "CUSTOMS_CLEARANCE";
    if (filter === "DELIVERED") return r.status === "DELIVERED";
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Shipment Tracking & Freight Dispatch</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Maintained by Autohub Logistics Desk
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Door-to-door consignment tracking from overseas factories to your workshop bay.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Consignments
          </button>
          <button
            type="button"
            onClick={() => setFilter("IN_TRANSIT")}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === "IN_TRANSIT"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Active In Transit
          </button>
          <button
            type="button"
            onClick={() => setFilter("DELIVERED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              filter === "DELIVERED"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Shipments Cards Grid */}
      <div className="space-y-4">
        {shipmentRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 text-xs">
            No shipment consignments matching filter.
          </div>
        ) : (
          shipmentRequests.map((req) => {
            const shp = req.shipment;
            const isDelivered = req.status === "DELIVERED";
            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 hover:border-slate-300 transition"
              >
                {/* Consignment Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                        isDelivered
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isDelivered ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Plane className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {req.referenceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-blue-50 text-blue-800 border-blue-200"
                          }`}
                        >
                          {req.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-semibold mt-0.5">
                        {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • {req.part.partName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center sm:flex-col sm:items-end justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Waybill / Tracking No.
                    </span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                      {shp?.trackingNumber || `AH-AWB-${req.referenceNumber.replace("AH-P-", "")}`}
                    </span>
                  </div>
                </div>

                {/* Ports & Logistics Route info */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">Origin Port</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{shp?.originPort || "Nagoya Terminal (NGO)"}</span>
                    <span className="text-[11px] text-slate-500">Japan Central Export</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">Destination Depot</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{shp?.destinationPort || "Auckland Port (AKL)"}</span>
                    <span className="text-[11px] text-slate-500">{req.deliveryAddress.label}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">Carrier / Flight</span>
                    <span className="font-bold text-slate-900 mt-0.5 block">{shp?.carrier || "Autohub Air Express Priority"}</span>
                    <span className="text-[11px] font-mono text-slate-500">{shp?.vesselOrFlightNumber || "CX-0284"}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase block font-bold">MPI Biosecurity</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Green Lane Cleared
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{shp?.customsEntryNumber || "CUS-2026-AKL-84920"}</span>
                  </div>
                </div>

                {/* Milestone Progress Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Transit Milestones
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supplier Dispatch</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">Overseas Depot</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Export Departure</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">Flight Loaded</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      isDelivered ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-blue-50/60 border-blue-200 text-blue-950"
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Customs Clearance</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">MPI Inspected</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      isDelivered ? "bg-emerald-50/60 border-emerald-200 text-emerald-950" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                        <span>Workshop Delivery</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {isDelivered ? "Signed & Bay Placed" : "Scheduled Courier"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Destination Address: <strong>{req.deliveryAddress.street}, {req.deliveryAddress.suburb}, {req.deliveryAddress.city}</strong>
                  </span>
                  <Link
                    href={`/portal/requests/${req.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Full Request & Logistics View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
