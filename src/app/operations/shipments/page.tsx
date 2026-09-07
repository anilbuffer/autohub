"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Truck,
  Plane,
  Ship,
  Search,
  Plus,
  Edit3,
  ExternalLink,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Eye,
  Sliders,
  ArrowRight,
  Filter,
} from "lucide-react";
import {
  getStoredRequests,
  createShipmentRecord,
  updateShipmentDetails,
  subscribeToStore,
} from "@/lib/store";
import { initialRequests } from "@/lib/mockData";
import { PartRequest, RequestStatus, ShipmentDetails } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function ConsignmentsShipmentsPage() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");
  const createIdParam = searchParams.get("createId");

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "AIR" | "SEA" | "CUSTOMS" | "EXCEPTIONS">("ALL");

  // Create Shipment Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [carrier, setCarrier] = useState("Air New Zealand Cargo / DHL Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [originPort, setOriginPort] = useState("Centrair Nagoya Terminal (NGO)");
  const [destinationPort, setDestinationPort] = useState("Auckland International Airport (AKL)");
  const [vesselOrFlightNumber, setVesselOrFlightNumber] = useState("NZ0090");
  const [customsEntryNumber, setCustomsEntryNumber] = useState("");
  const [etd, setEtd] = useState(new Date().toISOString().split("T")[0]);
  const [eta, setEta] = useState(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [initialStage, setInitialStage] = useState<RequestStatus>("RECEIVED_AT_SHIPPING_FACILITY");

  // Edit Carrier/Tracking Inline Modal State
  const [editTargetRequest, setEditTargetRequest] = useState<PartRequest | null>(null);
  const [editCarrier, setEditCarrier] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [editFlightVessel, setEditFlightVessel] = useState("");

  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  // Handle URL params trigger
  useEffect(() => {
    if (actionParam === "create" || createIdParam) {
      if (createIdParam) {
        setSelectedRequestId(createIdParam);
        const req = requests.find((r) => r.id === createIdParam);
        if (req) {
          prefillDefaultsForRequest(req);
        }
      }
      setIsCreateModalOpen(true);
    }
  }, [actionParam, createIdParam, requests]);

  const prefillDefaultsForRequest = (req: PartRequest) => {
    const isAir = req.quote?.selectedFreightMethod === "AIR_EXPRESS";
    if (isAir) {
      setCarrier("Air New Zealand Cargo / DHL Express");
      setTrackingNumber(`AWB-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setVesselOrFlightNumber("NZ0090");
      setOriginPort("Centrair Nagoya Air Cargo (NGO)");
      setDestinationPort("Auckland International Airport (AKL)");
      setCustomsEntryNumber(`CUS-2026-AKL-${Math.floor(10000 + Math.random() * 90000)}`);
    } else {
      setCarrier("Toyofuji Shipping Line / Armacup");
      setTrackingNumber(`BOL-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setVesselOrFlightNumber("Trans-Future 7 v.24");
      setOriginPort("Port of Nagoya (Japan)");
      setDestinationPort("Ports of Auckland (AKL)");
      setCustomsEntryNumber(`CUS-2026-SEA-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  const handleOpenCreateModal = (reqId?: string) => {
    if (reqId) {
      setSelectedRequestId(reqId);
      const req = requests.find((r) => r.id === reqId);
      if (req) prefillDefaultsForRequest(req);
    } else {
      // Default to first paid order without shipment
      const eligible = requests.find((r) => !r.shipment && r.status === "PAYMENT_CONFIRMED");
      if (eligible) {
        setSelectedRequestId(eligible.id);
        prefillDefaultsForRequest(eligible);
      } else if (requests.length > 0) {
        setSelectedRequestId(requests[0].id);
        prefillDefaultsForRequest(requests[0]);
      }
    }
    setIsCreateModalOpen(true);
  };

  const handleSaveNewShipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestId || !trackingNumber.trim()) return;

    createShipmentRecord(
      selectedRequestId,
      {
        carrier,
        trackingNumber: trackingNumber.trim(),
        originPort,
        destinationPort,
        vesselOrFlightNumber: vesselOrFlightNumber.trim() || undefined,
        customsEntryNumber: customsEntryNumber.trim() || undefined,
        etd,
        eta,
        initialStage,
      },
      "Liam Patel (Logistics Coordinator)"
    );

    setIsCreateModalOpen(false);
    setSuccessToast(`Shipment booking ${trackingNumber} created and assigned to customer portal!`);
    setTimeout(() => setSuccessToast(""), 5000);
  };

  const handleOpenEditCarrier = (req: PartRequest) => {
    setEditTargetRequest(req);
    setEditCarrier(req.shipment?.carrier || "Air New Zealand Cargo");
    setEditTracking(req.shipment?.trackingNumber || "");
    setEditFlightVessel(req.shipment?.vesselOrFlightNumber || "");
  };

  const handleSaveEditCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTargetRequest || !editTracking.trim()) return;

    updateShipmentDetails(
      editTargetRequest.id,
      {
        carrier: editCarrier.trim(),
        trackingNumber: editTracking.trim(),
        vesselOrFlightNumber: editFlightVessel.trim() || undefined,
      },
      "Liam Patel (Logistics)"
    );

    setEditTargetRequest(null);
    setSuccessToast(`Carrier & tracking details updated for ${editTargetRequest.referenceNumber}!`);
    setTimeout(() => setSuccessToast(""), 5000);
  };

  // Filter requests
  const filteredList = requests.filter((r) => {
    if (filterMode === "AIR" && r.quote?.selectedFreightMethod !== "AIR_EXPRESS") return false;
    if (filterMode === "SEA" && r.quote?.selectedFreightMethod !== "SEA_FREIGHT") return false;
    if (filterMode === "CUSTOMS" && r.status !== "CUSTOMS_CLEARANCE" && r.status !== "ARRIVED_IN_NZ") return false;
    if (filterMode === "EXCEPTIONS" && r.status !== "LOGISTICS_EXCEPTION") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.referenceNumber.toLowerCase().includes(q) ||
        r.part.partName.toLowerCase().includes(q) ||
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.vehicle.vin.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        (r.shipment?.carrier && r.shipment.carrier.toLowerCase().includes(q)) ||
        (r.shipment?.trackingNumber && r.shipment.trackingNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs flex items-center justify-between shadow-md animate-scaleIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast("")}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ed2025] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
              International Consignment Register
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Shipment Manifests &amp; Carrier Waybills
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Create new shipment records against approved purchase orders and maintain customer-facing tracking references.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="open-create-shipment-modal-button"
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold text-xs shadow-md shadow-red-900/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Shipment Record</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
          {[
            { id: "ALL", label: `All Consignments (${requests.length})` },
            { id: "AIR", label: "Air Express Priority" },
            { id: "SEA", label: "Consolidated Sea Freight" },
            { id: "CUSTOMS", label: "Customs Clearance Gate" },
            { id: "EXCEPTIONS", label: "Exceptions Active" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filterMode === tab.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search waybill, VIN, part, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Consignments List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Consignment / PO</th>
                <th className="py-3.5 px-4">Vehicle &amp; Part</th>
                <th className="py-3.5 px-4">Carrier &amp; Customer Tracking</th>
                <th className="py-3.5 px-4">Route &amp; ETD / ETA</th>
                <th className="py-3.5 px-4">Lifecycle Stage</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No consignments matched your search or filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((r) => {
                  const s = r.shipment;
                  const isAir = r.quote?.selectedFreightMethod === "AIR_EXPRESS";

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-cyan-50/40 transition group"
                    >
                      {/* Ref & Customer */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{r.referenceNumber}</span>
                          {isAir ? (
                            <span className="text-[10px] text-blue-600" title="Air Express">
                              ✈️
                            </span>
                          ) : (
                            <span className="text-[10px] text-cyan-600" title="Sea Freight">
                              🚢
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {r.customerName}
                        </div>
                      </td>

                      {/* Vehicle & Part */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 truncate max-w-[200px]">
                          {r.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          VIN: {r.vehicle.vin}
                        </div>
                      </td>

                      {/* Carrier & Tracking Number (Customer Visible) */}
                      <td className="py-4 px-4">
                        {s ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{s.carrier}</span>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCarrier(r)}
                                className="text-slate-400 hover:text-cyan-700 transition"
                                title="Edit Carrier & Tracking Waybill"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                                {s.trackingNumber}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Customer Visible
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              No Shipment Record
                            </span>
                            <div className="mt-1">
                              <button
                                type="button"
                                onClick={() => handleOpenCreateModal(r.id)}
                                className="text-[11px] font-bold text-cyan-700 hover:underline flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Create Record Now</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Route & ETD / ETA */}
                      <td className="py-4 px-4">
                        {s ? (
                          <div className="text-[11px] space-y-0.5">
                            <div className="text-slate-700 font-medium truncate max-w-[180px]">
                              {s.originPort} → {s.destinationPort}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ETA: {new Date(s.eta).toLocaleDateString("en-NZ", { month: "short", day: "numeric" })}
                              {s.vesselOrFlightNumber ? ` • ${s.vesselOrFlightNumber}` : ""}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">TBD</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/operations/lifecycle?id=${r.id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-800 font-bold text-xs transition"
                          >
                            Milestones
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCarrier(r)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            title="Quick Edit Carrier Waybill"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE SHIPMENT RECORD MODAL ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#ed2025] text-white flex items-center justify-center shadow-md shadow-red-600/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create International Shipment Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign carrier, waybill, and routing to make tracking visible to the trade customer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNewShipment} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Target Order Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Purchase Order / Request Reference *
                </label>
                <select
                  value={selectedRequestId}
                  onChange={(e) => {
                    setSelectedRequestId(e.target.value);
                    const req = requests.find((r) => r.id === e.target.value);
                    if (req) prefillDefaultsForRequest(req);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.referenceNumber} — {r.customerName} ({r.part.partName.slice(0, 40)}...) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Carrier & Tracking Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Carrier Name (Displayed to Customer) *
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g. Air New Zealand Cargo / DHL Express"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tracking Number / Waybill (AWB / BOL) *
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. AWB-99412048"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Flight / Vessel & Customs Entry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Flight or Vessel Number
                  </label>
                  <input
                    type="text"
                    value={vesselOrFlightNumber}
                    onChange={(e) => setVesselOrFlightNumber(e.target.value)}
                    placeholder="e.g. NZ0090 or Pacific Trader v.42"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NZ Customs Entry Number (Broker Reference)
                  </label>
                  <input
                    type="text"
                    value={customsEntryNumber}
                    onChange={(e) => setCustomsEntryNumber(e.target.value)}
                    placeholder="e.g. CUS-2026-AKL-88192"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Origin & Destination Ports */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Origin Export Terminal *
                  </label>
                  <input
                    type="text"
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                    placeholder="e.g. Centrair Nagoya Terminal (NGO)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Destination NZ Port / Airport *
                  </label>
                  <input
                    type="text"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    placeholder="e.g. Auckland International Airport (AKL)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* ETD & ETA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimated Departure Date (ETD)
                  </label>
                  <input
                    type="date"
                    value={etd}
                    onChange={(e) => setEtd(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Estimated Arrival Date (ETA)
                  </label>
                  <input
                    type="date"
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Initial Stage */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Initial Milestone Stage
                </label>
                <select
                  value={initialStage}
                  onChange={(e) => setInitialStage(e.target.value as RequestStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="RECEIVED_AT_SHIPPING_FACILITY">
                    Stage 1: Received At Shipping Facility (Export Terminal Checked In)
                  </option>
                  <option value="IN_TRANSIT">
                    Stage 2: In Transit (Flight / Sea Line Departed)
                  </option>
                </select>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
                <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Customer Portal Live Preview:</span>
                </div>
                <div className="text-[11px] text-cyan-900">
                  Trade customer will see: Carrier &ldquo;<span className="font-bold">{carrier}</span>&rdquo; with Tracking #&ldquo;<span className="font-mono font-bold">{trackingNumber || "PENDING"}</span>&rdquo; and live progress stepper.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow-md shadow-red-900/20"
                >
                  Confirm &amp; Publish Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT CARRIER / TRACKING MODAL ================= */}
      {editTargetRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Carrier &amp; Tracking Waybill
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {editTargetRequest.referenceNumber} • {editTargetRequest.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditTargetRequest(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCarrier} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Carrier Name (Visible to Customer)
                </label>
                <input
                  type="text"
                  value={editCarrier}
                  onChange={(e) => setEditCarrier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tracking Number / Waybill (AWB / BOL)
                </label>
                <input
                  type="text"
                  value={editTracking}
                  onChange={(e) => setEditTracking(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Flight or Vessel Number
                </label>
                <input
                  type="text"
                  value={editFlightVessel}
                  onChange={(e) => setEditFlightVessel(e.target.value)}
                  placeholder="e.g. NZ0090"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditTargetRequest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
