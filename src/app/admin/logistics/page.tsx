"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  Plane,
  Anchor,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import {
  getStoredRequests,
  updateShipmentStage,
  updateRequestStatus,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, RequestStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function LogisticsDeskPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null);

  // Shipment Milestone Update Form State
  const [targetStage, setTargetStage] = useState<RequestStatus>("IN_TRANSIT");
  const [carrier, setCarrier] = useState("DHL Express Global / Qantas Freight");
  const [trackingNumber, setTrackingNumber] = useState("DHL-NZ-982341990");
  const [location, setLocation] = useState("En Route Trans-Tasman");
  const [milestoneNotes, setMilestoneNotes] = useState("Flight departed on schedule");
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [exceptionReason, setExceptionReason] = useState("");

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  const activeReq = selectedRequest || requests.find((r) => r.shipment) || requests[0];

  const logisticsQueue = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
      r.status === "IN_TRANSIT" ||
      r.status === "ARRIVED_IN_NZ" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  );

  const handleAdvanceMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq) return;

    updateShipmentStage(
      activeReq.id,
      targetStage,
      carrier,
      trackingNumber,
      location,
      "Liam Patel (Logistics)",
      milestoneNotes
    );
  };

  const handleRaiseException = () => {
    if (!activeReq || !exceptionReason.trim()) return;
    updateRequestStatus(
      activeReq.id,
      "LOGISTICS_EXCEPTION",
      "Liam Patel",
      "LOGISTICS_COORDINATOR",
      exceptionReason
    );
    setExceptionOpen(false);
    setExceptionReason("");
  };

  const STAGES: { value: RequestStatus; label: string; defaultLocation: string }[] = [
    { value: "SUPPLIER_DISPATCHED", label: "Supplier Dispatched to Export Terminal", defaultLocation: "Nagoya Hub (Japan)" },
    { value: "RECEIVED_AT_SHIPPING_FACILITY", label: "Received At Export Shipping Facility", defaultLocation: "Autohub Japan International Terminal" },
    { value: "IN_TRANSIT", label: "In International Transit (Flight / Sea Line)", defaultLocation: "Airways Flight Cargo NZ0090" },
    { value: "ARRIVED_IN_NZ", label: "Arrived In New Zealand Port/Airport", defaultLocation: "Auckland International Cargo Terminal (AKL)" },
    { value: "CUSTOMS_CLEARANCE", label: "Customs Clearance & MPI Bio-Security", defaultLocation: "NZ Customs Service / MPI Auckland" },
    { value: "OUT_FOR_DELIVERY", label: "Out For Delivery with Local Express", defaultLocation: "Auckland Metro Express Fleet" },
    { value: "DELIVERED", label: "Consignment Delivered to Workshop", defaultLocation: "Customer Workshop Destination" },
  ];

  return (
    <div className="space-y-6">
      {/* Logistics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200">
              Logistics & Freight Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">Coordinator: Liam Patel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Freight Operations, Milestones & Customs NZ
          </h1>
          <p className="text-xs text-slate-500">
            Control flight and ocean milestones, assign carrier tracking numbers, and clear NZ Customs declarations.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Consignments Queue */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Active Consignments ({logisticsQueue.length})
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                Monitoring
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {logisticsQueue.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs space-y-1.5 ${
                    activeReq?.id === req.id
                      ? "bg-cyan-50/70 border-cyan-400 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-autohub-navy">
                      {req.referenceNumber}
                    </span>
                    <StatusBadge status={req.status} size="sm" showIcon={false} />
                  </div>
                  <span className="font-bold text-slate-900 block">
                    {req.vehicle.year} {req.vehicle.make} {req.vehicle.model}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {req.part.partName}
                  </span>
                  {req.shipment && (
                    <div className="text-[10px] text-slate-600 font-mono bg-white p-1 rounded border border-slate-200 flex justify-between">
                      <span>{req.shipment.carrier.split("/")[0]}</span>
                      <span className="text-autohub-navy font-bold">{req.shipment.trackingNumber}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Updater Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {activeReq ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 font-mono">
                      {activeReq.referenceNumber}
                    </h3>
                    <StatusBadge status={activeReq.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: <strong>{activeReq.customerName}</strong> • Delivery Bay: <strong>{activeReq.deliveryAddress.street}, {activeReq.deliveryAddress.city}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExceptionOpen(true)}
                    className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Raise Logistics Delay</span>
                  </button>
                  <Link
                    href={`/portal/requests/${activeReq.id}`}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                  >
                    Customer View
                  </Link>
                </div>
              </div>

              {/* Advance Milestone Action Form */}
              <form onSubmit={handleAdvanceMilestone} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold border-b pb-2">
                  <Truck className="w-4 h-4 text-autohub-navy" />
                  <span>Advance Shipment Milestone & Notify Customer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Next Stage to Execute</label>
                    <select
                      value={targetStage}
                      onChange={(e) => {
                        const val = e.target.value as RequestStatus;
                        setTargetStage(val);
                        const match = STAGES.find((s) => s.value === val);
                        if (match) setLocation(match.defaultLocation);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold"
                    >
                      {STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Carrier / Freight Partner</label>
                    <input
                      type="text"
                      required
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Tracking Reference / AWB</label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-1 text-slate-700">Current Physical Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Milestone Notes (Customer Visible)</label>
                  <input
                    type="text"
                    value={milestoneNotes}
                    onChange={(e) => setMilestoneNotes(e.target.value)}
                    placeholder="e.g. Customs tariff entry 8504.40 passed with green line clearance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <button
                  id="advance-milestone-submit-button"
                  type="submit"
                  className="w-full py-2.5 bg-autohub-navy hover:bg-autohub-navy-dark text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Shipment & Trigger Customer Notification</span>
                </button>
              </form>

              {/* Past Milestones Timeline */}
              {activeReq.shipment && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Recorded Milestones for {activeReq.shipment.trackingNumber}
                  </h4>
                  <div className="space-y-2">
                    {activeReq.shipment.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{m.stage}</span>
                          <span className="text-[11px] text-slate-500">
                            Location: {m.location} {m.notes && `• "${m.notes}"`}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(m.timestamp).toLocaleTimeString("en-NZ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 text-xs">
              Select an active consignment to manage freight milestones.
            </div>
          )}
        </div>
      </div>

      {/* Exception Modal */}
      {exceptionOpen && activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Raise Logistics Delay / Port Exception
            </h3>
            <textarea
              rows={3}
              required
              value={exceptionReason}
              onChange={(e) => setExceptionReason(e.target.value)}
              placeholder="e.g. Typhoon delay at Nagoya airport, customs secondary inspection hold..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setExceptionOpen(false)} className="px-4 py-2 border rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleRaiseException}
                className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl"
              >
                Log Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
