"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Edit2,
  UserX,
  UserCheck,
  X,
  Save,
  Clock,
  Shield,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import {
  getStoredStaffUsers,
  addStaffUser,
  updateStaffUser,
  deactivateStaffUser,
  reactivateStaffUser,
  changeStaffRole,
  subscribeToStore,
} from "@/lib/store";
import { StaffUser, UserRole } from "@/lib/types";

const ROLE_DEFINITIONS: {
  id: UserRole;
  label: string;
  badgeColor: string;
  description: string;
}[] = [
  {
    id: "SYSTEM_ADMIN",
    label: "System Administrator",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Full root access, staff provisioning, customer approvals, platform margin & M365 configs, audit logs.",
  },
  {
    id: "SOURCING_SPECIALIST",
    label: "Sourcing Specialist",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "Procurement Desk, multi-supplier quote synthesis, margin calculation, PO generation (Nagoya/Tokyo).",
  },
  {
    id: "LOGISTICS_COORDINATOR",
    label: "Logistics Coordinator",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    description: "International freight milestones, DHL/Toyofuji carrier tracking, MPI biosecurity and customs clearance.",
  },
  {
    id: "FINANCE_OFFICER",
    label: "Finance Officer",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Payments queue, bank transfer reconciliation, trade credit line authorization, IRD GST tax invoices.",
  },
  {
    id: "CUSTOMER",
    label: "Trade Customer",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Trade ordering access, part requests submission, quote review and freight selection, invoice receipts.",
  },
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "SOURCING_SPECIALIST" as UserRole,
    department: "",
    phone: "",
    mfaEnabled: true,
  });

  const refresh = () => {
    setStaff(getStoredStaffUsers());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Filter staff
  const filteredStaff = staff.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = staff.filter((u) => u.status === "ACTIVE").length;
  const inactiveCount = staff.filter((u) => u.status === "INACTIVE").length;

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      role: "SOURCING_SPECIALIST",
      department: "Global Sourcing Desk",
      phone: "+64 9 307 ",
      mfaEnabled: true,
    });
    setCreateModalOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const initials = formData.name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    addStaffUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim() || "Operations",
      status: "ACTIVE",
      mfaEnabled: formData.mfaEnabled,
      phone: formData.phone.trim(),
      avatarInitials: initials || "ST",
    });

    setCreateModalOpen(false);
  };

  const handleOpenEdit = (user: StaffUser) => {
    setSelectedStaff(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone || "",
      mfaEnabled: user.mfaEnabled,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    updateStaffUser(selectedStaff.id, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department.trim(),
      phone: formData.phone.trim(),
      mfaEnabled: formData.mfaEnabled,
    });

    setEditModalOpen(false);
    setSelectedStaff(null);
  };

  const handleToggleStatus = (user: StaffUser) => {
    if (user.status === "ACTIVE") {
      deactivateStaffUser(user.id);
    } else {
      reactivateStaffUser(user.id);
    }
  };

  const handleQuickRoleChange = (id: string, newRole: UserRole) => {
    changeStaffRole(id, newRole);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed2025] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              Identity &amp; Access Control
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Staff User Management &amp; 5-Role Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, deactivate staff user credentials, enforce multi-factor authentication, and assign permissions across the five system roles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Invite Staff User</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Staff Directory
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {staff.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Provisioned platform accounts
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Active Accounts
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {activeCount}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Authorized for live desk operations
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-purple-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
            MFA Protected
          </span>
          <div className="text-3xl font-black text-purple-700 font-mono flex items-center gap-1.5">
            <span>100%</span>
            <Lock className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-[11px] text-slate-500 block">
            Hardware &amp; TOTP authenticator enabled
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Deactivated
          </span>
          <div className="text-3xl font-black text-slate-500 font-mono">
            {inactiveCount}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Revoked access credentials
          </span>
        </div>
      </div>

      {/* Role Definitions Guide Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#ed2025]" />
            <span>Five System Roles &amp; Authority Boundaries</span>
          </h3>
          <span className="text-[11px] text-slate-400">Granular Role-Based Access Control (RBAC)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {ROLE_DEFINITIONS.map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-1.5 text-xs flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                  {r.label}
                </span>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  {r.description}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-medium pt-1">
                Role ID: {r.id}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter staff by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/60 focus:bg-white transition outline-none"
            />
          </div>
        </div>

        {/* Role & Status Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                roleFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Roles
            </button>
            {ROLE_DEFINITIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoleFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  roleFilter === r.id ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {r.label.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("INACTIVE")}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                statusFilter === "INACTIVE" ? "bg-white text-rose-700 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Staff Members &amp; Assigned Roles ({filteredStaff.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click role dropdown to modify permission tier instantly
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role (5 Roles)</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">MFA Security</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No staff members match the selected search or role filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((user) => {
                  const roleDef = ROLE_DEFINITIONS.find((r) => r.id === user.role);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                            {user.avatarInitials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleQuickRoleChange(user.id, e.target.value as UserRole)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border appearance-none cursor-pointer outline-none transition ${roleDef?.badgeColor}`}
                          title="Change user's assigned role"
                        >
                          {ROLE_DEFINITIONS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="block truncate max-w-[180px]">{user.department}</span>
                        {user.phone && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5" />
                            {user.phone}
                          </span>
                        )}
                      </td>

                      {/* MFA */}
                      <td className="py-3.5 px-4">
                        {user.mfaEnabled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Enforced</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Inactive</span>
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                        {user.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Edit user details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              user.status === "ACTIVE"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                            title={user.status === "ACTIVE" ? "Deactivate staff access" : "Reactivate staff access"}
                          >
                            {user.status === "ACTIVE" ? (
                              <>
                                <UserX className="w-3 h-3" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                <span>Reactivate</span>
                              </>
                            )}
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

      {/* ================= CREATE STAFF MODAL ================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ed2025] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Invite &amp; Provision Staff User</h3>
                  <p className="text-[11px] text-slate-500">Configure credentials and assign one of the 5 roles</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Ross"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.r@autohub.co.nz"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+64 9 307 2005"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / Branch</label>
                <input
                  type="text"
                  placeholder="e.g. Global Sourcing Desk — Nagoya"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Assign System Role (5 Roles)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025] font-semibold text-slate-900 bg-white"
                >
                  {ROLE_DEFINITIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.id})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {ROLE_DEFINITIONS.find((r) => r.id === formData.role)?.description}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mfaEnabled}
                    onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-[#ed2025] focus:ring-0"
                  />
                  <span className="font-bold text-slate-800">Enforce Multi-Factor Authentication (MFA)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Staff Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT STAFF MODAL ================= */}
      {editModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-[#ed2025]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Edit Staff Account: {selectedStaff.name}</h3>
                  <p className="text-[11px] text-slate-500">ID: {selectedStaff.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Role (5 Roles)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025] font-semibold text-slate-900 bg-white"
                >
                  {ROLE_DEFINITIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
