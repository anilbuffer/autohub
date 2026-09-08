"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  CreditCard,
  Search,
  ExternalLink,
  AlertTriangle,
  UserCheck,
  UserX,
  X,
  Plus,
  RefreshCw,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import {
  getStoredCustomers,
  approveCustomerAccount,
  suspendCustomerAccount,
  reactivateCustomerAccount,
  updateCustomerCreditFacility,
  subscribeToStore,
} from "@/lib/store";
import { TradeCustomer } from "@/lib/types";

export default function CustomerApprovalsAndGovernancePage() {
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "SUSPENDED" | "ALL">("PENDING");
  const [businessTypeFilter, setBusinessTypeFilter] = useState("ALL");

  // Modals
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState<TradeCustomer | null>(null);
  const [suspendReason, setSuspendReason] = useState("Overdue Account Receivable Audit");
  const [customSuspendNote, setCustomSuspendNote] = useState("");

  const [newCreditLimit, setNewCreditLimit] = useState(25000);
  const [newPaymentTerms, setNewPaymentTerms] = useState<"STRICT_PREPAYMENT" | "NET_20TH_MONTH" | "NET_30">("NET_20TH_MONTH");

  const refresh = () => {
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const pending = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL"
  );
  const approved = customers.filter(
    (c) => c.billingDetails.status === "APPROVED"
  );
  const suspended = customers.filter(
    (c) => c.billingDetails.status === "SUSPENDED"
  );

  const totalCreditExposure = customers.reduce(
    (sum, c) => sum + (c.billingDetails.creditLimitNzd || 0),
    0
  );

  const filteredCustomers = customers.filter((c) => {
    const matchesTab =
      activeTab === "ALL" ||
      (activeTab === "PENDING" && c.billingDetails.status === "PENDING_APPROVAL") ||
      (activeTab === "APPROVED" && c.billingDetails.status === "APPROVED") ||
      (activeTab === "SUSPENDED" && c.billingDetails.status === "SUSPENDED");

    const matchesSearch =
      c.tradingName.toLowerCase().includes(search.toLowerCase()) ||
      c.legalBusinessName.toLowerCase().includes(search.toLowerCase()) ||
      c.nzbn.includes(search) ||
      c.primaryContact.name.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContact.email.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      businessTypeFilter === "ALL" || c.businessType === businessTypeFilter;

    return matchesTab && matchesSearch && matchesType;
  });

  const handleApprove = (id: string, creditLimit: number = 25000) => {
    approveCustomerAccount(id, creditLimit);
  };

  const handleOpenSuspend = (c: TradeCustomer) => {
    setSelectedCust(c);
    setSuspendReason("Overdue Account Receivable Audit");
    setCustomSuspendNote("");
    setSuspendModalOpen(true);
  };

  const handleConfirmSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCust) return;
    const finalReason = customSuspendNote.trim()
      ? `${suspendReason}: ${customSuspendNote.trim()}`
      : suspendReason;
    suspendCustomerAccount(selectedCust.id, finalReason);
    setSuspendModalOpen(false);
    setSelectedCust(null);
  };

  const handleReactivate = (id: string) => {
    reactivateCustomerAccount(id);
  };

  const handleOpenCreditModal = (c: TradeCustomer) => {
    setSelectedCust(c);
    setNewCreditLimit(c.billingDetails.creditLimitNzd || 25000);
    setNewPaymentTerms(c.billingDetails.paymentTerms || "NET_20TH_MONTH");
    setCreditModalOpen(true);
  };

  const handleSaveCreditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCust) return;
    updateCustomerCreditFacility(
      selectedCust.id,
      {
        creditLimitNzd: newCreditLimit,
        paymentTerms: newPaymentTerms,
      },
      "Sarah Jenkins"
    );
    setCreditModalOpen(false);
    setSelectedCust(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              Customer Account Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Trade Customer Onboarding Queue &amp; Account Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify New Zealand Business Numbers (NZBN), authorize commercial trade credit facilities, and execute instant account suspension or reactivation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-purple-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
            Pending Approval Queue
          </span>
          <div className="text-3xl font-black text-purple-700 font-mono">
            {pending.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Awaiting NZBN &amp; credit limit sign-off
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Approved Trade Accounts
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {approved.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Authorized automotive trade clients
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-amber-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Suspended Accounts
          </span>
          <div className="text-3xl font-black text-amber-700 font-mono">
            {suspended.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Administrative or payment hold
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Trade Credit Granted
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            ${(totalCreditExposure / 1000).toFixed(0)}k
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">NZD</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Active credit line exposure
          </span>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("PENDING")}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "PENDING"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Approval Queue</span>
            {pending.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold">
                {pending.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("APPROVED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "APPROVED"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Approved Accounts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
              {approved.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SUSPENDED")}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "SUSPENDED"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Suspended Queue</span>
            {suspended.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-mono font-bold">
                {suspended.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3.5 py-2 rounded-xl font-bold transition ${
              activeTab === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({customers.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by NZBN, trade name, contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/60 focus:bg-white transition outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "PENDING" && pending.length > 0 ? (
        /* Detailed Pending Approval Cards */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Accounts Requiring Review &amp; Credit Allocation
            </h3>
            <span className="text-xs text-purple-700 font-bold">
              {pending.length} Application{pending.length > 1 ? "s" : ""} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pending.map((cust) => (
              <div
                key={cust.id}
                className="p-6 bg-white rounded-2xl sm:rounded-3xl border border-purple-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-black text-slate-900">
                        {cust.tradingName}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        NZBN: {cust.nzbn}
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                        {cust.businessType.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <FileCheck className="w-3 h-3" />
                        <span>Privacy Act 2020 Compliant</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Legal Name: <strong className="text-slate-700">{cust.legalBusinessName}</strong> • GST: {cust.billingDetails.gstNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(cust.id, 25000)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve &amp; Grant $25k Credit</span>
                    </button>
                  </div>
                </div>

                {/* Symmetrical 3-Column Profile Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Primary Contact
                    </span>
                    <span className="font-bold text-slate-800 block">{cust.primaryContact.name} ({cust.primaryContact.title})</span>
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {cust.primaryContact.email}
                    </span>
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.primaryContact.phone}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Accounts Payable
                    </span>
                    <span className="font-bold text-slate-800 block">{cust.accountsContact.name}</span>
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {cust.accountsContact.email}
                    </span>
                    <span className="text-slate-600 block flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.accountsContact.phone}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Delivery Depot
                    </span>
                    <span className="font-bold text-slate-800 block">
                      {cust.deliveryAddresses[0]?.street}
                    </span>
                    <span className="text-slate-600 block">
                      {cust.deliveryAddresses[0]?.suburb}, {cust.deliveryAddresses[0]?.city} {cust.deliveryAddresses[0]?.postcode}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Terms: {cust.compliance?.termsVersion || "v2026.1"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Main Customers Table (Approved, Suspended, or Search results) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Trade Accounts Directory ({filteredCustomers.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            NZBN Verified Automotive Businesses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Business / Trade Name</th>
                <th className="py-3 px-4">NZBN</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Credit Facility (NZD)</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No trade customer accounts found in this view.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{cust.tradingName}</span>
                        <span className="text-[11px] text-slate-500">{cust.legalBusinessName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {cust.nzbn}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                        {cust.businessType.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 font-mono">
                          ${cust.billingDetails.creditLimitNzd?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Avail: ${cust.billingDetails.creditAvailableNzd?.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="text-[10px] font-mono font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {cust.billingDetails.paymentTerms.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {cust.billingDetails.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Approved</span>
                        </span>
                      )}
                      {cust.billingDetails.status === "PENDING_APPROVAL" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                          <span>Pending</span>
                        </span>
                      )}
                      {cust.billingDetails.status === "SUSPENDED" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCreditModal(cust)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                          title="Adjust Credit Limit"
                        >
                          Credit Terms
                        </button>

                        {cust.billingDetails.status === "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleOpenSuspend(cust)}
                            className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition flex items-center gap-1"
                            title="Suspend customer trading facility"
                          >
                            <UserX className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {cust.billingDetails.status === "SUSPENDED" && (
                          <button
                            type="button"
                            onClick={() => handleReactivate(cust.id)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition flex items-center gap-1"
                            title="Reactivate customer trading facility"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Reactivate</span>
                          </button>
                        )}

                        {cust.billingDetails.status === "PENDING_APPROVAL" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(cust.id, 25000)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SUSPEND ACCOUNT MODAL ================= */}
      {suspendModalOpen && selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Suspend Trade Account</h3>
                  <p className="text-[11px] text-slate-500">{selectedCust.tradingName} (NZBN: {selectedCust.nzbn})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSuspendModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSuspend} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Suspension Reason</label>
                <select
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-slate-900 bg-white font-medium"
                >
                  <option value="Overdue Account Receivable Audit">Overdue Account Receivable Audit (Net 20/30 Exceeded)</option>
                  <option value="NZBN Status Verification Pending">NZBN Status Verification Pending (NZ Companies Office)</option>
                  <option value="Director Change / Ownership Transition">Director Change / Ownership Transition</option>
                  <option value="Suspected Fraud / Unauthorized Part Requests">Suspected Fraud / Unauthorized Part Requests</option>
                  <option value="Customer Voluntary Administrative Hold">Customer Voluntary Administrative Hold</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Internal Notes</label>
                <textarea
                  rows={3}
                  placeholder="Provide specific context for this administrative action (recorded in audit log)..."
                  value={customSuspendNote}
                  onChange={(e) => setCustomSuspendNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                Suspending this account will immediately lock the customer from submitting new parts procurement requests or accessing credit facilities until reactivated by an administrator.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSuspendModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Confirm Account Suspension</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT CREDIT TERMS MODAL ================= */}
      {creditModalOpen && selectedCust && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Adjust Trade Credit &amp; Terms</h3>
                  <p className="text-[11px] text-slate-500">{selectedCust.tradingName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreditModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCreditModal} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Approved Credit Limit ($NZD)</label>
                <input
                  type="number"
                  step="5000"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none font-mono text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Current available: ${selectedCust.billingDetails.creditAvailableNzd?.toLocaleString()} NZD
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Settlement Payment Terms</label>
                <select
                  value={newPaymentTerms}
                  onChange={(e) => setNewPaymentTerms(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none text-slate-900 bg-white font-medium"
                >
                  <option value="STRICT_PREPAYMENT">Strict Prepayment (Payment Cleared Gate required)</option>
                  <option value="NET_20TH_MONTH">Net 20th of the Following Month</option>
                  <option value="NET_30">Net 30 Days from Tax Invoice</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <span>Save Facility Terms</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
