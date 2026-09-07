"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Package,
  Plane,
  Anchor,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Download,
  Printer,
  FileText,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Send,
  Building2,
  Check,
} from "lucide-react";
import {
  getRequestById,
  acceptCustomerQuote,
  confirmPayment,
  updateRequestStatus,
  subscribeToStore,
  getActiveRole,
} from "@/lib/store";
import { PartRequest, FreightMethod } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { LifecycleTracker } from "@/components/LifecycleTracker";
import { InvoiceViewer } from "@/components/InvoiceViewer";
import { MessagingThread } from "@/components/MessagingThread";
import { AIQuoteModal } from "@/components/AIQuoteModal";

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;

  const [request, setRequest] = useState<PartRequest | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"quote" | "payment" | "logistics" | "messages" | "audit">("quote");
  const [selectedFreight, setSelectedFreight] = useState<FreightMethod>("AIR_EXPRESS");
  const [termsConfirmed, setTermsConfirmed] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAiQuoteModal, setShowAiQuoteModal] = useState(false);

  useEffect(() => {
    if (requestId) {
      setRequest(getRequestById(requestId));
    }
    const unsub = subscribeToStore(() => {
      if (requestId) {
        setRequest(getRequestById(requestId));
      }
    });
    return unsub;
  }, [requestId]);

  if (!request) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Request Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested reference <strong>{requestId}</strong> could not be located in the database.
        </p>
        <Link
          href="/portal"
          className="inline-block px-4 py-2 bg-autohub-navy text-white text-xs font-bold rounded-xl"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const activeRole = getActiveRole();
  const quote = request.quote;
  const isAwaitingApproval = request.status === "AWAITING_CUSTOMER_APPROVAL";
  const isAwaitingPayment = request.status === "AWAITING_PAYMENT";
  const hasPaid = [
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
  ].includes(request.status);

  const handleAcceptQuote = () => {
    acceptCustomerQuote(request.id, selectedFreight, request.customerName);
    setActiveTab("payment");
  };

  const handlePayDirectTransfer = () => {
    confirmPayment(
      request.id,
      "BANK_TRANSFER",
      request.customerName,
      "Direct bank transfer remittance notification"
    );
  };

  const handlePayTradeCredit = () => {
    confirmPayment(
      request.id,
      "TRADE_CREDIT",
      request.customerName,
      "Executed against approved 20th of the month trade credit line"
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back link & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {request.referenceNumber}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {request.vehicle.year} {request.vehicle.make} {request.vehicle.model} • {request.part.partName}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {request.invoice && (
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-autohub-navy" />
              <span>Tax Invoice</span>
            </button>
          )}

          {activeRole !== "CUSTOMER" && request.status === "SOURCING" && (
            <button
              onClick={() => setShowAiQuoteModal(true)}
              className="px-4 py-2 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <span>Build AI Quotation</span>
            </button>
          )}
        </div>
      </div>

      {/* 15-Stage Visual Stepper */}
      <LifecycleTracker status={request.status} currentMilestoneNote={request.statusReason} />

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("quote")}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === "quote"
              ? "bg-autohub-navy text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Quotation & Sourcing
        </button>

        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "payment"
              ? "bg-autohub-navy text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Payment Gate</span>
          {isAwaitingPayment && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("logistics")}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === "logistics"
              ? "bg-autohub-navy text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Shipment Tracking & Port
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === "messages"
              ? "bg-autohub-navy text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>Communications</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
            {request.messages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
            activeTab === "audit"
              ? "bg-autohub-navy text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Audit History ({request.auditLogs.length})
        </button>
      </div>

      {/* TAB 1: Quotation & Sourcing */}
      {activeTab === "quote" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Vehicle & Part Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
                <Car className="w-4 h-4 text-autohub-navy" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Vehicle Specifications
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Make & Model:</span>
                  <span className="font-bold text-slate-800">
                    {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">VIN / Chassis:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {request.vehicle.vin}
                  </span>
                </div>
                {request.vehicle.registrationPlate && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Registration Plate:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {request.vehicle.registrationPlate}
                    </span>
                  </div>
                )}
                {request.vehicle.engineCode && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Engine Code:</span>
                    <span className="text-slate-800">{request.vehicle.engineCode}</span>
                  </div>
                )}
                {request.vehicle.transmission && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">Transmission:</span>
                    <span className="text-slate-800">{request.vehicle.transmission}</span>
                  </div>
                )}
                {request.vehicle.driveConfiguration && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Drive Configuration:</span>
                    <span className="text-slate-800">{request.vehicle.driveConfiguration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Part Requirement Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
                <Package className="w-4 h-4 text-autohub-navy" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Part Details
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Part Name</span>
                  <span className="font-bold text-slate-900 block">{request.part.partName}</span>
                </div>
                {request.part.oemPartNumber && (
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400">OEM Part Number:</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {request.part.oemPartNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Condition Requirement:</span>
                  <span className="font-semibold text-slate-800">{request.part.conditionRequirement}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Preference:</span>
                  <span className="text-slate-800">{request.part.genuinePreference}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="font-bold text-slate-800">{request.part.quantity} unit(s)</span>
                </div>
              </div>

              {request.part.descriptionNotes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800 block mb-1">Customer Workshop Notes:</strong>
                  {request.part.descriptionNotes}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quotation & Decision Card */}
          <div className="lg:col-span-7 space-y-6">
            {!quote ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Sourcing Desk In Progress
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Autohub procurement specialists are querying overseas supplier inventories in Japan and Europe. You will receive an alert as soon as your formal quotation with freight options is prepared.
                </p>
                {activeRole !== "CUSTOMER" && (
                  <button
                    onClick={() => setShowAiQuoteModal(true)}
                    className="px-5 py-2.5 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold shadow transition"
                  >
                    Generate AI Quote Now (Staff)
                  </button>
                )}
              </div>
            ) : (
              /* Formal Quotation Card */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-autohub-navy bg-blue-50 px-2 py-0.5 rounded">
                        Formal Quotation
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        {quote.quoteNumber}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Total Landed Cost Schedule (NZD)
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Valid Until</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(quote.expiresAt).toLocaleDateString("en-NZ", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Freight Options Selector */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Your Freight Transit Option:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quote.freightOptions.map((opt) => {
                      const isSelected = selectedFreight === opt.method;
                      const isAir = opt.method === "AIR_EXPRESS";
                      return (
                        <div
                          key={opt.method}
                          onClick={() => isAwaitingApproval && setSelectedFreight(opt.method)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-autohub-navy bg-blue-50/50 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {isAir ? (
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                                  <Plane className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                                  <Anchor className="w-4 h-4" />
                                </div>
                              )}
                              <span className="text-xs font-bold text-slate-900">
                                {isAir ? "Air Express Priority" : "Ocean Consolidated"}
                              </span>
                            </div>
                            <input
                              type="radio"
                              name="freightChoice"
                              checked={isSelected}
                              onChange={() => setSelectedFreight(opt.method)}
                              className="w-4 h-4 text-autohub-navy"
                            />
                          </div>

                          <span className="text-[11px] text-slate-500 block">
                            {opt.carrierName}
                          </span>
                          <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-600 font-medium">
                              Transit: {opt.estimatedTransitDays}
                            </span>
                            <span className="text-xs font-bold text-autohub-navy">
                              +${opt.costNzd.toFixed(2)} NZD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Breakdown Schedule */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Part Cost & Supplier Acquisition:</span>
                    <span className="font-mono">${(quote.basePartCostNzd + quote.marginAmountNzd).toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Autohub Procurement & Verification Fee:</span>
                    <span className="font-mono">${quote.procurementFeeNzd.toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Selected International Freight ({selectedFreight === "AIR_EXPRESS" ? "Air" : "Sea"}):</span>
                    <span className="font-mono">
                      ${(selectedFreight === "AIR_EXPRESS" ? quote.freightOptions[0].costNzd : (quote.freightOptions[1]?.costNzd || 65)).toFixed(2)} NZD
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">${quote.subtotalNzd.toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>New Zealand GST (15%):</span>
                    <span className="font-mono font-medium">${quote.gstAmountNzd.toFixed(2)} NZD</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                    <span>Total Landed Price (Door-to-Door):</span>
                    <span className="text-base text-autohub-navy font-mono">
                      ${quote.totalNzd.toFixed(2)} NZD
                    </span>
                  </div>
                </div>

                {/* Quote Action Buttons */}
                {isAwaitingApproval && (
                  <div className="space-y-4 pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsConfirmed}
                        onChange={(e) => setTermsConfirmed(e.target.checked)}
                        className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                      />
                      <span>
                        I confirm vehicle compatibility, delivery address, and agree to the Autohub procurement conditions.
                      </span>
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        id="customer-accept-quote-button"
                        onClick={handleAcceptQuote}
                        disabled={!termsConfirmed}
                        className="flex-1 py-3 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Quote & Proceed to Payment</span>
                      </button>

                      <button
                        onClick={() => updateRequestStatus(request.id, "CUSTOMER_REJECTED", request.customerName, "CUSTOMER", "Customer rejected quotation")}
                        className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {quote.status === "ACCEPTED" && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <div>
                        <span className="font-bold block">Quotation Accepted</span>
                        <span className="text-[11px] text-emerald-700">
                          Selected {quote.selectedFreightMethod === "AIR_EXPRESS" ? "Air Express Priority" : "Sea Freight"}.
                        </span>
                      </div>
                    </div>
                    {isAwaitingPayment && (
                      <button
                        onClick={() => setActiveTab("payment")}
                        className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Go to Payment Gate
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Payment Gate */}
      {activeTab === "payment" && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-autohub-navy" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Autohub Procurement Payment Gate
                </h3>
                <p className="text-xs text-slate-500">
                  Strict enforcement: Overseas purchase orders are executed only upon verified bank remittance or approved trade credit.
                </p>
              </div>
            </div>

            {hasPaid ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID & CLEARED
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 animate-pulse">
                AWAITING PAYMENT
              </span>
            )}
          </div>

          {/* Amount Due Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Amount Due (NZD)</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 block">
                ${(request.quote?.totalNzd || 682.18).toFixed(2)} NZD
              </span>
              <span className="text-[11px] text-slate-400">Includes 15% GST and Door-to-Door Freight</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Mandatory Reference</span>
              <span className="text-sm sm:text-base font-black text-autohub-red font-mono bg-slate-800 px-2.5 py-1 rounded border border-slate-700 block mt-1">
                {request.referenceNumber}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          {!hasPaid ? (
            <div className="space-y-6 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Method 1: Direct Bank Transfer */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-autohub-navy" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Option A: Direct Bank Transfer (NZ)
                    </h4>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p><strong>Bank:</strong> ANZ Bank New Zealand Ltd</p>
                    <p><strong>Account:</strong> Autohub NZ Ltd — Procurly</p>
                    <p className="font-mono text-slate-900"><strong>Number:</strong> 06-0801-0498210-00</p>
                    <p className="text-autohub-red font-bold font-mono"><strong>Ref:</strong> {request.referenceNumber}</p>
                  </div>
                  <button
                    id="confirm-bank-transfer-button"
                    onClick={handlePayDirectTransfer}
                    className="w-full py-2.5 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold transition shadow"
                  >
                    I Have Sent Bank Transfer
                  </button>
                </div>

                {/* Method 2: Trade Credit Facility */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-autohub-navy" />
                      <h4 className="text-xs font-bold text-autohub-navy">
                        Option B: Approved Trade Credit Line
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Instant order release. Billed on your monthly trade statement (20th of the following month).
                    </p>
                    <div className="mt-3 text-xs bg-white p-2.5 rounded-xl border border-blue-200 text-slate-700">
                      <span>Available Credit: </span>
                      <strong className="text-emerald-700 font-mono">$18,450.00 NZD</strong>
                    </div>
                  </div>

                  <button
                    id="pay-via-credit-line-button"
                    onClick={handlePayTradeCredit}
                    className="w-full py-2.5 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize with Trade Credit</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-950">
                Payment Gate Unlocked & Confirmed
              </h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Payment verified. Purchase order has been cleared for international supplier procurement and shipping allocation.
              </p>
              {request.invoice && (
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
                >
                  Download Receipt & Tax Invoice
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Logistics & Port Tracking */}
      {activeTab === "logistics" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-autohub-navy" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  International Freight & Customs Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Status maintained and verified by Autohub operations desk.
                </p>
              </div>
            </div>

            {request.shipment && (
              <span className="text-xs font-mono font-bold text-autohub-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                Tracking: {request.shipment.trackingNumber}
              </span>
            )}
          </div>

          {!request.shipment ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <Anchor className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
              <p className="font-bold text-slate-800">Shipment Consignment Pending</p>
              <p>
                Once payment is confirmed, Autohub logistics assigns international flight or ocean vessel tracking codes.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Manifest Info Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Freight Carrier</span>
                  <span className="font-bold text-slate-800 block">{request.shipment.carrier}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Origin Terminal</span>
                  <span className="font-bold text-slate-800 block truncate">{request.shipment.originPort}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Arrival Hub (NZ)</span>
                  <span className="font-bold text-slate-800 block truncate">{request.shipment.destinationPort}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Customs Entry No</span>
                  <span className="font-mono font-bold text-slate-800 block">
                    {request.shipment.customsEntryNumber || "NZ-CUS-PENDING"}
                  </span>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Logistics Milestones
                </h4>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {request.shipment.milestones.map((m, idx) => (
                    <div key={m.id} className="relative group">
                      <div
                        className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          m.completed
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{m.stage}</span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(m.timestamp).toLocaleString("en-NZ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Location: <strong>{m.location}</strong>
                        </p>
                        {m.notes && (
                          <p className="text-[11px] text-slate-500 mt-0.5 italic">
                            &quot;{m.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Communications Thread */}
      {activeTab === "messages" && (
        <MessagingThread request={request} />
      )}

      {/* TAB 5: Audit Log */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            System Event & State Audit Trail
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {request.auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900 block">{log.action}</span>
                  {log.details && (
                    <span className="text-slate-600 text-[11px] block mt-0.5">{log.details}</span>
                  )}
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Actor: {log.actorName} ({log.actorRole})
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {new Date(log.timestamp).toLocaleString("en-NZ")}
                  </span>
                  {log.newState && (
                    <span className="text-[10px] font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {log.newState}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {request.invoice && (
        <InvoiceViewer
          invoice={request.invoice}
          request={request}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {/* Staff AI Quote Modal */}
      <AIQuoteModal
        request={request}
        isOpen={showAiQuoteModal}
        onClose={() => setShowAiQuoteModal(false)}
      />
    </div>
  );
}
