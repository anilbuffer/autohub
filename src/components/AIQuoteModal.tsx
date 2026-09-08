"use client";

import React, { useState } from "react";
import { PartRequest, CustomerQuote, FreightOption } from "@/lib/types";
import { generateAiQuoteRecommendation } from "@/lib/aiService";
import { issueCustomerQuote, addSupplierQuote, getStoredCustomers } from "@/lib/store";
import { Sparkles, Calculator, Plane, Anchor, CheckCircle2, DollarSign, X, Building2, ShieldCheck, Boxes } from "lucide-react";

interface AIQuoteModalProps {
  request: PartRequest;
  isOpen: boolean;
  onClose: () => void;
  onQuoteIssued?: () => void;
}

export const AIQuoteModal: React.FC<AIQuoteModalProps> = ({
  request,
  isOpen,
  onClose,
  onQuoteIssued,
}) => {
  const [targetMargin, setTargetMargin] = useState<number>(18.0);
  const [procurementFee, setProcurementFee] = useState<number>(60.0);
  const [airFreightCost, setAirFreightCost] = useState<number>(185.0);
  const [seaFreightCost, setSeaFreightCost] = useState<number>(65.0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiData, setAiData] = useState(() => generateAiQuoteRecommendation(request));

  const allCustomers = getStoredCustomers();
  const matchedCustomer = allCustomers.find(
    (c) => c.id === request.customerId || c.nzbn === request.customerNzbn
  ) || allCustomers[0];

  if (!isOpen) return null;

  const handleRecalculate = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const fresh = generateAiQuoteRecommendation(request);
      setAiData(fresh);
      setIsSynthesizing(false);
    }, 400);
  };

  const reqQty = request.part.quantity || 1;
  const baseCost = aiData.recommendedSupplierQuote.partCostNzd;
  const domesticFreight = aiData.recommendedSupplierQuote.domesticFreightNzd;
  const landedCost = baseCost + domesticFreight;
  const unitLandedCost = landedCost / reqQty;
  const marginAmt = parseFloat((landedCost * (targetMargin / 100)).toFixed(2));

  // Air option totals
  const subtotalAir = landedCost + marginAmt + procurementFee + airFreightCost;
  const gstAir = subtotalAir * 0.15;
  const totalAir = subtotalAir + gstAir;

  // Sea option totals
  const subtotalSea = landedCost + marginAmt + procurementFee + seaFreightCost;
  const gstSea = subtotalSea * 0.15;
  const totalSea = subtotalSea + gstSea;

  const handleIssueQuote = () => {
    // 1. Add AI supplier quote to request
    addSupplierQuote(request.id, aiData.recommendedSupplierQuote);

    // 2. Build final customer quote
    const freightOptions: FreightOption[] = [
      {
        method: "AIR_EXPRESS",
        carrierName: "Autohub Air Priority (via Cathay Cargo)",
        estimatedTransitDays: "3 - 5 business days",
        costNzd: airFreightCost,
        available: true,
      },
      {
        method: "SEA_FREIGHT",
        carrierName: "Autohub Ocean Consolidated (Toyofuji Shipping)",
        estimatedTransitDays: "14 - 18 business days",
        costNzd: seaFreightCost,
        available: true,
      },
    ];

    const quoteNumber = `QTE-2026-${request.referenceNumber.replace("AH-P-", "")}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const finalQuote: CustomerQuote = {
      id: `QTE-${Date.now()}`,
      quoteNumber,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      selectedSupplierQuoteId: aiData.recommendedSupplierQuote.id,
      basePartCostNzd: baseCost,
      targetMarginPercentage: targetMargin,
      marginAmountNzd: marginAmt,
      procurementFeeNzd: procurementFee,
      landedCostNzd: landedCost,
      freightOptions,
      subtotalNzd: subtotalAir, // default to Air calculation
      gstAmountNzd: gstAir,
      totalNzd: totalAir,
      termsAccepted: false,
      status: "ISSUED",
    };

    issueCustomerQuote(request.id, finalQuote);
    if (onQuoteIssued) onQuoteIssued();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-autohub-navy to-autohub-navy-dark text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-autohub-red font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-autohub-red animate-pulse" />
            <span>AI Sourcing & Landed Cost Synthesis Engine</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            Build Quotation for {request.referenceNumber}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Vehicle: {request.vehicle.year} {request.vehicle.make} {request.vehicle.model} • Part: {request.part.partName} (Qty: {reqQty})
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trade Onboarding Account Sync Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#ed2025]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Trade Customer Onboarding Sync
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Commercial Account
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Trading Party</span>
                <span className="font-bold text-white truncate block">
                  {matchedCustomer?.tradingName || request.customerName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">NZBN</span>
                <span className="font-mono text-slate-300 block">
                  {matchedCustomer?.nzbn || request.customerNzbn || "9429041234567"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Credit Facility</span>
                <span className="font-bold text-emerald-400 block">
                  {matchedCustomer?.billingDetails?.status === "APPROVED"
                    ? `Approved ($${(matchedCustomer.billingDetails.creditLimitNzd || 50000).toLocaleString()})`
                    : "Prepayment Required"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Delivery Depot</span>
                <span className="text-slate-300 truncate block">
                  {matchedCustomer?.deliveryAddresses?.[0]?.city || request.deliveryAddress?.city || "Auckland"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-autohub-navy flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <p className="font-bold text-autohub-navy mb-1">
                Optimal Sourcing Channel Identified
              </p>
              {aiData.confidenceNotes}
            </div>
          </div>

          {/* Supplier Cost Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-autohub-navy" />
                Supplier Sourcing Details (Nagoya / Overseas Hub)
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800">
                Order Qty: {reqQty} unit{reqQty > 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Supplier & Qty</span>
                <span className="font-bold text-slate-800 truncate block">
                  {aiData.recommendedSupplierQuote.supplierName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {aiData.recommendedSupplierQuote.supplierCountry} • {reqQty} pcs
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Foreign Cost ({aiData.recommendedSupplierQuote.partCostCurrency})</span>
                <span className="font-bold text-slate-800 block">
                  {aiData.recommendedSupplierQuote.partCostForeign.toLocaleString()} {aiData.recommendedSupplierQuote.partCostCurrency}
                </span>
                <span className="text-[10px] text-slate-500">
                  Unit: {(aiData.recommendedSupplierQuote.unitCostForeign || (aiData.recommendedSupplierQuote.partCostForeign / reqQty)).toLocaleString()} {aiData.recommendedSupplierQuote.partCostCurrency}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Total Part NZD</span>
                <span className="font-bold text-slate-900 block">
                  ${baseCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">
                  ${(baseCost / reqQty).toFixed(2)} / unit
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Total Landed Cost</span>
                <span className="font-bold text-emerald-700 block">
                  ${landedCost.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500">
                  ${unitLandedCost.toFixed(2)} / unit landed
                </span>
              </div>
            </div>
          </div>

          {/* Margin & Fee Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Target Margin (%)</span>
                <span className="text-autohub-navy font-mono">{targetMargin}%</span>
              </label>
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Yield: +${marginAmt.toFixed(2)} NZD</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Procurement Fee (NZD)</span>
                <span className="text-slate-700 font-mono">${procurementFee}</span>
              </label>
              <input
                type="number"
                value={procurementFee}
                onChange={(e) => setProcurementFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Coordination & Handling</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Air Freight Rate (NZD)</span>
                <span className="text-slate-700 font-mono">${airFreightCost}</span>
              </label>
              <input
                type="number"
                value={airFreightCost}
                onChange={(e) => setAirFreightCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-autohub-navy focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">3-5 Day Priority Air</span>
            </div>
          </div>

          {/* Freight Options Comparison Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
              Customer Quote Preview with Dual Freight Options
            </div>
            <div className="divide-y divide-slate-200">
              {/* Air Express */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Option A: Air Express Priority
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Transit: 3 - 5 business days • Direct Cathay/Air NZ Cargo
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-autohub-navy block">
                    ${totalAir.toFixed(2)} NZD
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Incl. 15% GST (${gstAir.toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Sea Freight */}
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Anchor className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Option B: Ocean Consolidated
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Transit: 14 - 18 business days • Toyofuji Shipping line
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800 block">
                    ${totalSea.toFixed(2)} NZD
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Incl. 15% GST (${gstSea.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleRecalculate}
            disabled={isSynthesizing}
            className="text-xs font-semibold text-slate-600 hover:text-autohub-navy flex items-center gap-1.5"
          >
            <Sparkles className={`w-3.5 h-3.5 text-autohub-red ${isSynthesizing ? "animate-spin" : ""}`} />
            <span>Re-run AI Synthesis</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              id="issue-quote-submit-button"
              onClick={handleIssueQuote}
              className="px-5 py-2.5 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue Official Quotation to Customer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
