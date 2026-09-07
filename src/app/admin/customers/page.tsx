"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  CreditCard,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  getStoredCustomers,
  approveCustomerAccount,
  saveCustomers,
  subscribeToStore,
} from "@/lib/store";
import { TradeCustomer } from "@/lib/types";

export default function CustomerApprovalsPage() {
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [selectedCust, setSelectedCust] = useState<TradeCustomer | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCustomers(getStoredCustomers());
    const unsub = subscribeToStore(() => {
      setCustomers(getStoredCustomers());
    });
    return unsub;
  }, []);

  const pending = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL"
  );
  const approved = customers.filter(
    (c) => c.billingDetails.status === "APPROVED"
  );

  const handleApprove = (id: string, creditLimit: number = 25000) => {
    approveCustomerAccount(id, creditLimit);
  };

  const handleSuspend = (id: string) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            billingDetails: {
              ...c.billingDetails,
              status: "SUSPENDED" as const,
            },
          }
        : c
    );
    saveCustomers(updated);
  };

  const handleReactivate = (id: string) => {
    const updated = customers.map((c) =>
      c.id === id
        ? {
            ...c,
            billingDetails: {
              ...c.billingDetails,
              status: "APPROVED" as const,
            },
          }
        : c
    );
    saveCustomers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
              Customer Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Trade Account Onboarding & Verification Queue
          </h1>
          <p className="text-xs text-slate-500">
            Verify New Zealand Business Numbers (NZBN) and authorize automotive trade access & credit lines.
          </p>
        </div>
      </div>

      {/* Pending Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Pending Trade Approvals ({pending.length})
            </h3>
          </div>
          <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full">
            Action Required
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            All trade applications verified. Zero accounts currently pending approval.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((cust) => (
              <div
                key={cust.id}
                className="p-5 bg-purple-50/40 rounded-2xl border border-purple-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {cust.tradingName}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                      NZBN: {cust.nzbn}
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                      {cust.businessType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Legal: {cust.legalBusinessName} • Primary Contact: {cust.primaryContact.name} ({cust.primaryContact.email} / {cust.primaryContact.phone})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Depot: {cust.deliveryAddresses[0]?.street}, {cust.deliveryAddresses[0]?.city} • Terms v2025.1 Accepted
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`approve-customer-${cust.id}`}
                    onClick={() => handleApprove(cust.id, 25000)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Grant $25k Credit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Customer Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Active Trade Customer Directory ({approved.length})
          </h3>
          <span className="text-xs text-slate-500">
            NZBN Trade Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trading Name</th>
                <th className="py-3 px-4">NZBN</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Primary Contact</th>
                <th className="py-3 px-4">Credit Limit</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approved.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {cust.tradingName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {cust.nzbn}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {cust.businessType.replace(/_/g, " ")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {cust.primaryContact.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    ${cust.billingDetails.creditLimitNzd.toLocaleString()} NZD
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">
                    ${cust.billingDetails.creditAvailableNzd.toLocaleString()} NZD
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleSuspend(cust.id)}
                      className="text-rose-600 hover:underline text-[11px] font-semibold"
                    >
                      Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
