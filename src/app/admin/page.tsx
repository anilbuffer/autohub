"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  Users,
  Settings,
  Bell,
  FileText,
  Clock,
  BarChart3,
  Database,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Send,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Search,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";
import {
  getStoredStaffUsers,
  getStoredCustomers,
  getStoredSettings,
  getStoredNotificationTemplates,
  getStoredM365Config,
  getStoredPolicyVersions,
  getAllSystemAuditLogs,
  approveCustomerAccount,
  suspendCustomerAccount,
  reactivateCustomerAccount,
  subscribeToStore,
} from "@/lib/store";
import {
  StaffUser,
  TradeCustomer,
  SystemSettings,
  NotificationTemplate,
  Microsoft365Config,
  PolicyVersion,
  AuditLogEntry,
  UserRole,
} from "@/lib/types";

export default function AdministratorOverviewPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [m365, setM365] = useState<Microsoft365Config | null>(null);
  const [policies, setPolicies] = useState<PolicyVersion[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const refresh = () => {
    setStaff(getStoredStaffUsers());
    setCustomers(getStoredCustomers());
    setSettings(getStoredSettings());
    setTemplates(getStoredNotificationTemplates());
    setM365(getStoredM365Config());
    setPolicies(getStoredPolicyVersions());
    setAuditLogs(getAllSystemAuditLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const pendingCustomers = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL"
  );
  const activeCustomers = customers.filter(
    (c) => c.billingDetails.status === "APPROVED"
  );
  const suspendedCustomers = customers.filter(
    (c) => c.billingDetails.status === "SUSPENDED"
  );

  const activeStaff = staff.filter((u) => u.status === "ACTIVE");
  const roleDistribution: Record<UserRole, number> = {
    CUSTOMER: staff.filter((u) => u.role === "CUSTOMER").length,
    SOURCING_SPECIALIST: staff.filter((u) => u.role === "SOURCING_SPECIALIST").length,
    LOGISTICS_COORDINATOR: staff.filter((u) => u.role === "LOGISTICS_COORDINATOR").length,
    FINANCE_OFFICER: staff.filter((u) => u.role === "FINANCE_OFFICER").length,
    SYSTEM_ADMIN: staff.filter((u) => u.role === "SYSTEM_ADMIN").length,
  };

  const handleApprove = (id: string) => {
    approveCustomerAccount(id, 25000);
  };

  const handleSuspend = (id: string) => {
    suspendCustomerAccount(id, "Administrative review triggered from Control Dashboard");
  };

  const handleReactivate = (id: string) => {
    reactivateCustomerAccount(id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed2025] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              System Control &amp; Root Governance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Administrator Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized orchestration across Staff Identities, 5 Roles, Customer Approvals, Platform Margins, M365, and Audit Trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refresh}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
            title="Refresh Store Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sync</span>
          </button>

          <Link
            href="/admin/staff?action=create"
            className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Invite Staff User</span>
          </Link>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Staff Users & 5 Roles */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Staff Directory
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#ed2025]" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {activeStaff.length}
              <span className="text-xs font-medium text-slate-400 font-sans ml-1.5">
                / {staff.length} Active
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Assigned across all 5 system roles
            </span>
          </div>
          <Link
            href="/admin/staff"
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1 border border-slate-200/60"
          >
            <span>Manage Staff &amp; Roles</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* KPI 2: Customer Accounts */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-purple-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Customer Accounts
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {pendingCustomers.length}
              <span className="text-xs font-medium text-purple-700 font-sans ml-1.5">
                Pending Action
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {activeCustomers.length} Approved • {suspendedCustomers.length} Suspended
            </span>
          </div>
          <Link
            href="/admin/customers"
            className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1 border border-purple-200"
          >
            <span>View Customer Accounts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 3: System Settings & Health */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                System Settings &amp; Health
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2 flex items-center gap-2">
              <span>Online</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              M365 OAuth2 • IRD GST 15% • Margin {settings?.defaultMarginPercent || 18}%
            </span>
          </div>
          <Link
            href="/admin/settings"
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1 border border-emerald-200"
          >
            <span>Open System Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* KPI 4: Audit Logs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Audit Logs
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono">
              {auditLogs.length}
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Total security &amp; operational logs
            </span>
          </div>
          <Link
            href="/admin/audit"
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-1 border border-slate-200/60"
          >
            <span>View Audit Logs</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Symmetrical 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Customer Account Approval Queue */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Customer Account Approval Queue
                </h2>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {pendingCustomers.length} Pending
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {pendingCustomers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                  All customer onboarding applications verified. No pending approvals.
                </div>
              ) : (
                pendingCustomers.slice(0, 3).map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{cust.tradingName}</span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-purple-200">
                          NZBN: {cust.nzbn}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        {cust.businessType.replace(/_/g, " ")} • Contact: {cust.primaryContact.name} ({cust.primaryContact.email})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApprove(cust.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approve ($25k)</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{activeCustomers.length} active trade accounts authorized</span>
            <Link
              href="/admin/customers"
              className="text-[#ed2025] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>View Customer Accounts</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Role Assignment & Staff Matrix */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ed2025]" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Role Assignment Across 5 Roles
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                5 System Tiers
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">System Administrator</span>
                  <span className="text-[10px] text-slate-500">Full System Control</span>
                </div>
                <span className="text-sm font-black font-mono text-purple-700">
                  {roleDistribution.SYSTEM_ADMIN}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Sourcing Specialist</span>
                  <span className="text-[10px] text-slate-500">Procurement Desk</span>
                </div>
                <span className="text-sm font-black font-mono text-amber-700">
                  {roleDistribution.SOURCING_SPECIALIST}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Logistics Coordinator</span>
                  <span className="text-[10px] text-slate-500">Freight Operations</span>
                </div>
                <span className="text-sm font-black font-mono text-cyan-700">
                  {roleDistribution.LOGISTICS_COORDINATOR}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Finance Officer</span>
                  <span className="text-[10px] text-slate-500">Billing &amp; Treasury Gate</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-700">
                  {roleDistribution.FINANCE_OFFICER}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                <div>
                  <span className="font-bold text-slate-900 block">Trade Customer</span>
                  <span className="text-[10px] text-slate-500">Client Trade Ordering Facility</span>
                </div>
                <span className="text-sm font-black font-mono text-blue-700">
                  {roleDistribution.CUSTOMER}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Manage credentials, MFA, and deactivate accounts</span>
            <Link
              href="/admin/staff"
              className="text-[#ed2025] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Open Staff &amp; Roles</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Symmetrical 6-Card Quick Module Navigation */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          System Control Modules (11 Scopes)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: System Baseline Configuration */}
          <Link
            href="/admin/settings"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#ed2025] flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#ed2025] group-hover:translate-x-0.5 transition">
                Configure →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#ed2025] transition">
                System Settings
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Default margin ({settings?.defaultMarginPercent || 18}%), freight baselines (Air ${settings?.airFreightBaseRateNzd || 185} / Sea ${settings?.seaFreightBaseRateNzd || 65}), IRD GST tax rate (15%), and request reference prefix format ({settings?.requestRefPrefix || "AH-P-"}).
              </p>
            </div>
          </Link>

          {/* Card 2: Microsoft 365 Email Setup */}
          <Link
            href="/admin/settings"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition">
                Manage →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Microsoft 365 Email
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Azure AD Tenant ID, Client ID, OAuth2 modern authentication, sender address ({m365?.senderEmail || "procurement-alerts@autohub.co.nz"}), daily quota, and test email simulator.
              </p>
            </div>
          </Link>

          {/* Card 3: Notification Templates */}
          <Link
            href="/admin/notifications"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                Edit ({templates.length}) →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                Notification Templates
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Template subjects, bodies, and event triggers (Request Submitted, Quote Issued, Gate Unlocked, Customs Cleared, Delivery). Placeholder tokens and live HTML email preview.
              </p>
            </div>
          </Link>

          {/* Card 4: Legal & Policy Versioning */}
          <Link
            href="/admin/compliance"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition">
                Versions →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Terms &amp; Policies
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Terms of Trade (v2026.1) and Privacy Policy (v2026.2) version management, effective dates, changelogs, customer consent status, and statutory NZ Privacy Act 2020 compliance.
              </p>
            </div>
          </Link>

          {/* Card 5: Full System Audit Log */}
          <Link
            href="/admin/audit"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 group-hover:translate-x-0.5 transition">
                Inspect ({auditLogs.length}) →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition">
                Audit Logs
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Comprehensive security audit trail with multi-dimensional filtering by user, actor role, action category, entity, and date range. Instant CSV and JSON export capability.
              </p>
            </div>
          </Link>

          {/* Card 6: Reference Data & Reports */}
          <Link
            href="/admin/reference-data"
            className="p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition">
                Manage →
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                Reference Data
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Maintain automotive business types, part categories with tariff guidance, and global verified suppliers (Nagoya, Tokyo, EuroParts, US Truck Hub) with live exchange rates.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Real-time System Audit Stream Preview */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent System Audit Events
            </h3>
          </div>
          <Link
            href="/admin/audit"
            className="text-xs font-bold text-[#ed2025] hover:underline inline-flex items-center gap-1"
          >
            <span>Open Audit Logs</span>
            <span>→</span>
          </Link>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="font-mono text-[10px] text-slate-400 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-bold text-slate-900 truncate">
                  {log.action}
                </span>
                {log.previousState && log.newState && (
                  <span className="hidden md:inline text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-mono">
                    {log.previousState} → {log.newState}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-shrink-0">
                <span className="font-semibold text-slate-700">{log.actorName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
                  {log.actorRole}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
