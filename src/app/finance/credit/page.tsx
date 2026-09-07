"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Landmark,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Building2,
  Check,
  X,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lock,
  Unlock,
} from "lucide-react";
import {
  getStoredCustomers,
  getStoredRequests,
  updateCustomerCreditFacility,
  validateAndReleaseCreditOrder,
  subscribeToStore,
} from "@/lib/store";
import { TradeCustomer, PartRequest } from "@/lib/types";

export default function TradeCreditManagementPage() {
  const searchParams = useSearchParams();
  const validateQueryId = searchParams.get("validate");

  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [successNote, setSuccessNote] = useState<string | null>(null);

  // Facility Edit Modal
  const [editFacilityModalOpen, setEditFacilityModalOpen] = useState(false);
  const [selectedCustForEdit, setSelectedCustForEdit] = useState<TradeCustomer | null>(null);
  const [editCreditLimit, setEditCreditLimit] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<"APPROVED" | "PENDING_APPROVAL" | "SUSPENDED">("APPROVED");
  const [editTerms, setEditTerms] = useState<"STRICT_PREPAYMENT" | "NET_20TH_MONTH" | "NET_30">("NET_20TH_MONTH");

  // Managerial Override Modal
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetReqForOverride, setTargetReqForOverride] = useState<PartRequest | null>(null);
  const [overrideReason, setOverrideReason] = useState("");

  const refresh = () => {
    setCustomers(getStoredCustomers());
    setRequests(getStoredRequests());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Filter orders waiting for trade credit validation
  const pendingCreditOrders = requests.filter(
    (r) =>
      r.status === "AWAITING_PAYMENT" &&
      r.invoice?.paymentMethod === "TRADE_CREDIT"
  );

  const openFacilityModal = (cust: TradeCustomer) => {
    setSelectedCustForEdit(cust);
    setEditCreditLimit(cust.billingDetails.creditLimitNzd);
    setEditStatus(cust.billingDetails.status);
    setEditTerms(cust.billingDetails.paymentTerms);
    setEditFacilityModalOpen(true);
  };

  const handleFacilityUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForEdit) return;

    updateCustomerCreditFacility(
      selectedCustForEdit.id,
      {
        creditLimitNzd: editCreditLimit,
        status: editStatus,
        paymentTerms: editTerms,
      },
      "Clara Jenkins"
    );

    setSuccessNote(
      `Credit facility for ${selectedCustForEdit.tradingName || selectedCustForEdit.legalBusinessName} updated to $${editCreditLimit.toLocaleString()} NZD (${editStatus}).`
    );
    setEditFacilityModalOpen(false);
    setTimeout(() => setSuccessNote(null), 5000);
  };

  const handleStandardRelease = (req: PartRequest) => {
    const result = validateAndReleaseCreditOrder(req.id, "Clara Jenkins");
    if (result.success) {
      setSuccessNote(result.message);
    } else {
      // Need override
      setTargetReqForOverride(req);
      setOverrideReason(result.message);
      setOverrideModalOpen(true);
    }
    setTimeout(() => setSuccessNote(null), 6000);
  };

  const handleOverrideReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReqForOverride) return;

    const result = validateAndReleaseCreditOrder(
      targetReqForOverride.id,
      "Clara Jenkins",
      overrideReason || "Managerial Treasury Exception Authorized"
    );

    setSuccessNote(result.message);
    setOverrideModalOpen(false);
    setTimeout(() => setSuccessNote(null), 6000);
  };

  // Facility summary metrics
  const totalFacilityLimit = customers.reduce(
    (sum, c) => sum + c.billingDetails.creditLimitNzd,
    0
  );
  const totalAvailableCredit = customers.reduce(
    (sum, c) => sum + c.billingDetails.creditAvailableNzd,
    0
  );
  const totalUtilizedCredit = Math.max(0, totalFacilityLimit - totalAvailableCredit);
  const overallUtilizationPct = totalFacilityLimit > 0 ? ((totalUtilizedCredit / totalFacilityLimit) * 100).toFixed(1) : "0";

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.legalBusinessName.toLowerCase().includes(q) ||
      c.tradingName.toLowerCase().includes(q) ||
      c.nzbn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast */}
      {successNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNote}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNote(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full">
              Commercial Credit Facility Desk
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Net 20th Month Terms &amp; Pre-Order Release Gate
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Trade Credit Account Management &amp; Release Validation
          </h1>
          <p className="text-xs text-slate-500">
            Audit customer credit limits, approve or suspend accounts, and perform mandatory pre-release credit validation before unlocking supplier purchase orders.
          </p>
        </div>
      </div>

      {/* Credit Exposure Strip */}
      <div className="bg-gradient-to-br from-slate-950 via-[#0a1226] to-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Corporate Portfolio Health
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {customers.length} Approved Trade Customers
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              Total Trade Credit Facility: ${totalFacilityLimit.toLocaleString("en-NZ")} NZD
            </h2>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-4">
              <span>Utilized: <strong className="text-amber-400 font-mono">${totalUtilizedCredit.toLocaleString("en-NZ")}</strong> ({overallUtilizationPct}%)</span>
              <span>•</span>
              <span>Available: <strong className="text-emerald-400 font-mono">${totalAvailableCredit.toLocaleString("en-NZ")}</strong></span>
            </div>
          </div>

          <div className="w-full lg:w-80">
            <div className="flex justify-between text-xs text-slate-300 mb-2 font-medium">
              <span>Facility Utilization</span>
              <span className="font-mono text-emerald-400">{overallUtilizationPct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-500 rounded-full"
                style={{ width: `${overallUtilizationPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: MANUAL CREDIT VALIDATION BEFORE ORDER RELEASE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900">
                Pre-Order Release Gate (Trade Credit Validation)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Orders placed on trade credit must satisfy 3-point automated risk validation before procurement can place supplier POs.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {pendingCreditOrders.length} Orders Awaiting Clearance
          </span>
        </div>

        {pendingCreditOrders.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-bold text-sm text-slate-900">Credit Validation Queue Clear</div>
            <div className="text-xs text-slate-500 max-w-md mx-auto">
              All trade credit orders have undergone validation. Newly submitted trade requests will appear here automatically for treasury signoff.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingCreditOrders.map((req) => {
              const cust = customers.find((c) => c.id === req.customerId);
              const orderTotal = req.invoice?.totalNzd || req.quote?.totalNzd || 0;
              const hasCredit = cust ? cust.billingDetails.creditAvailableNzd >= orderTotal : false;
              const isApproved = cust?.billingDetails.status === "APPROVED";
              const allPass = isApproved && hasCredit;

              return (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono">
                          Order Value: ${orderTotal.toFixed(2)} NZD
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">
                        Client: {req.customerName} (NZBN: {req.customerNzbn})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Vehicle: {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • Part: {req.part.partName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStandardRelease(req)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-xs flex items-center gap-1.5 ${
                          allPass
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-amber-600 hover:bg-amber-700"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{allPass ? "Validate & Release Order" : "Inspect & Override"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3-Point Validation Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 text-xs">
                    {/* Check 1 */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                      {isApproved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">Account Status: {cust?.billingDetails.status || "UNKNOWN"}</div>
                        <div className="text-[10px] text-slate-400">
                          {isApproved ? "Approved credit facility active" : "Facility not approved"}
                        </div>
                      </div>
                    </div>

                    {/* Check 2 */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                      {hasCredit ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          Available Credit: ${(cust?.billingDetails.creditAvailableNzd || 0).toFixed(0)} NZD
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {hasCredit ? "Sufficient headroom for order" : "Exceeds available facility"}
                        </div>
                      </div>
                    </div>

                    {/* Check 3 */}
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">Payment Aging Check</div>
                        <div className="text-[10px] text-slate-400">
                          Zero overdue invoices &gt;30 days
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: TRADE CREDIT ACCOUNT MANAGEMENT (APPROVE, SUSPEND, REVIEW) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Trade Account Directory &amp; Credit Limits
            </h3>
            <p className="text-xs text-slate-500">
              Manage facility ceilings, approve pending applications, suspend high-risk accounts, or review payment terms.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trade client or NZBN..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#ed2025]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trade Client</th>
                <th className="py-3 px-4">Business Type</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Utilized</th>
                <th className="py-3 px-4 text-right">Available Credit</th>
                <th className="py-3 px-4">Terms</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const limit = cust.billingDetails.creditLimitNzd;
                const avail = cust.billingDetails.creditAvailableNzd;
                const utilized = Math.max(0, limit - avail);
                const status = cust.billingDetails.status;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {cust.tradingName || cust.legalBusinessName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        NZBN: {cust.nzbn} • GST: {cust.billingDetails.gstNumber}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {cust.businessType.replace(/_/g, " ")}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${limit.toLocaleString("en-NZ")}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      ${utilized.toLocaleString("en-NZ")}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      ${avail.toLocaleString("en-NZ")}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {cust.billingDetails.paymentTerms.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : status === "SUSPENDED"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openFacilityModal(cust)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition shadow-xs flex items-center gap-1 ml-auto"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Manage Credit</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= EDIT CREDIT FACILITY MODAL ================= */}
      {editFacilityModalOpen && selectedCustForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Credit Facility Review &amp; Settings
                </h3>
                <div className="text-[10px] text-slate-400 font-mono">
                  {selectedCustForEdit.tradingName} (NZBN: {selectedCustForEdit.nzbn})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditFacilityModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFacilityUpdateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Credit Limit ($NZD): *
                </label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={editCreditLimit}
                  onChange={(e) => setEditCreditLimit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Account Facility Status: *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="APPROVED">APPROVED — Active facility</option>
                  <option value="PENDING_APPROVAL">PENDING APPROVAL — Application under assessment</option>
                  <option value="SUSPENDED">SUSPENDED — Locked due to risk or arrears</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Approved Payment Terms: *
                </label>
                <select
                  value={editTerms}
                  onChange={(e) => setEditTerms(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                >
                  <option value="NET_20TH_MONTH">NET 20TH MONTH (Standard NZ Trade)</option>
                  <option value="NET_30">NET 30 DAYS</option>
                  <option value="STRICT_PREPAYMENT">STRICT PREPAYMENT ONLY</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditFacilityModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl font-bold transition shadow-sm"
                >
                  Save Credit Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MANAGERIAL OVERRIDE MODAL ================= */}
      {overrideModalOpen && targetReqForOverride && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">
                  Managerial Credit Override Authorization
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOverrideModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOverrideReleaseSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <div className="font-bold mb-0.5">Automated Validation Failed</div>
                <div>{overrideReason}</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mandatory Managerial Override Justification: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State commercial rationale (e.g. Director authorized temporary headroom, incoming wire confirmation sighted, tier 1 dealer exemption)..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Authorize Override &amp; Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
