"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Users,
  KeyRound,
  Shield,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  UserPlus,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Save,
  Check,
} from "lucide-react";
import {
  getStoredCustomers,
  saveCustomers,
  addOrganizationUser,
  removeOrganizationUser,
  updateCustomerProfile,
  getLockoutStatus,
  subscribeToStore,
} from "@/lib/store";
import { TradeCustomer, CustomerOrgUser } from "@/lib/types";

export default function SettingsPortalPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "users" | "security">("profile");
  const [customer, setCustomer] = useState<TradeCustomer | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    legalBusinessName: "",
    tradingName: "",
    nzbn: "",
    primaryName: "",
    primaryTitle: "",
    primaryEmail: "",
    primaryPhone: "",
    accountsName: "",
    accountsEmail: "",
    accountsPhone: "",
    gstNumber: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Address State & Modals
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState({
    label: "",
    street: "",
    suburb: "",
    city: "",
    postcode: "",
  });

  // User Management State & Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "Parts Specialist" as CustomerOrgUser["role"],
  });

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(true);

  // Lockout status
  const [lockoutInfo, setLockoutInfo] = useState(getLockoutStatus());

  useEffect(() => {
    const custs = getStoredCustomers();
    if (custs.length > 0) {
      loadCustomer(custs[0]);
    }
    const unsub = subscribeToStore(() => {
      const updatedCusts = getStoredCustomers();
      if (updatedCusts.length > 0) {
        loadCustomer(updatedCusts[0]);
      }
      setLockoutInfo(getLockoutStatus());
    });
    return unsub;
  }, []);

  const loadCustomer = (c: TradeCustomer) => {
    setCustomer(c);
    setProfileForm({
      legalBusinessName: c.legalBusinessName || "",
      tradingName: c.tradingName || "",
      nzbn: c.nzbn || "",
      primaryName: c.primaryContact?.name || "",
      primaryTitle: c.primaryContact?.title || "",
      primaryEmail: c.primaryContact?.email || "",
      primaryPhone: c.primaryContact?.phone || "",
      accountsName: c.accountsContact?.name || "",
      accountsEmail: c.accountsContact?.email || "",
      accountsPhone: c.accountsContact?.phone || "",
      gstNumber: c.billingDetails?.gstNumber || "104-982-120",
    });
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    updateCustomerProfile({
      legalBusinessName: profileForm.legalBusinessName,
      tradingName: profileForm.tradingName,
      nzbn: profileForm.nzbn,
      primaryContact: {
        name: profileForm.primaryName,
        title: profileForm.primaryTitle,
        email: profileForm.primaryEmail,
        phone: profileForm.primaryPhone,
      },
      accountsContact: {
        name: profileForm.accountsName,
        email: profileForm.accountsEmail,
        phone: profileForm.accountsPhone,
      },
      billingDetails: {
        ...customer.billingDetails,
        gstNumber: profileForm.gstNumber,
      },
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Address Handlers
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    if (editingAddressId) {
      // Edit existing
      const updatedAddresses = customer.deliveryAddresses.map((a) =>
        a.id === editingAddressId
          ? { ...a, ...addrForm }
          : a
      );
      updateCustomerProfile({ deliveryAddresses: updatedAddresses });
      setEditingAddressId(null);
    } else {
      // Add new
      const newAddr = {
        id: `ADDR-${Date.now()}`,
        ...addrForm,
        isDefault: customer.deliveryAddresses.length === 0,
      };
      updateCustomerProfile({
        deliveryAddresses: [...customer.deliveryAddresses, newAddr],
      });
    }

    setAddrForm({ label: "", street: "", suburb: "", city: "", postcode: "" });
    setShowAddAddressModal(false);
  };

  const handleSetDefaultAddress = (id: string) => {
    if (!customer) return;
    const updatedAddresses = customer.deliveryAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateCustomerProfile({ deliveryAddresses: updatedAddresses });
  };

  const handleDeleteAddress = (id: string) => {
    if (!customer) return;
    if (customer.deliveryAddresses.length <= 1) {
      alert("At least one delivery address must remain on file.");
      return;
    }
    const updatedAddresses = customer.deliveryAddresses.filter((a) => a.id !== id);
    if (!updatedAddresses.some((a) => a.isDefault) && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    updateCustomerProfile({ deliveryAddresses: updatedAddresses });
  };

  const openEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddrForm({
      label: addr.label,
      street: addr.street,
      suburb: addr.suburb,
      city: addr.city,
      postcode: addr.postcode,
    });
    setShowAddAddressModal(true);
  };

  // User Handlers
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;

    addOrganizationUser({
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: "ACTIVE",
    });

    setUserForm({ name: "", email: "", role: "Parts Specialist" });
    setShowAddUserModal(false);
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("Are you sure you want to revoke this user's portal access?")) {
      removeOrganizationUser(userId);
    }
  };

  // Password Handlers
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setPasswordUpdated(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordUpdated(false), 3500);
  };

  if (!customer) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Account Settings & Organisation Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage corporate credentials, workshop delivery depots, team member access, and enterprise MFA security.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
            activeTab === "profile"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Business Profile & Contacts</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
            activeTab === "addresses"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Address Book</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
            {customer.deliveryAddresses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
            activeTab === "users"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Organisation Users</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
            {customer.organizationUsers?.length || 1}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition ${
            activeTab === "security"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Password & MFA Security</span>
        </button>
      </div>

      {/* TAB 1: Business Profile & Contact Details */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Corporate Entity Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified business credentials registered with the New Zealand Companies Office.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Legal Business Name
                </label>
                <input
                  type="text"
                  value={profileForm.legalBusinessName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, legalBusinessName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-autohub-navy/20 focus:border-autohub-navy text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Trading Name
                </label>
                <input
                  type="text"
                  value={profileForm.tradingName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, tradingName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-autohub-navy/20 focus:border-autohub-navy text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  NZBN (New Zealand Business Number)
                </label>
                <input
                  type="text"
                  value={profileForm.nzbn}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, nzbn: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  GST Registration Number
                </label>
                <input
                  type="text"
                  value={profileForm.gstNumber}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, gstNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Primary Authorized Contact
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal recipient for procurement authorizations, quotes, and delivery notifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.primaryName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, primaryName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profileForm.primaryTitle}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, primaryTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.primaryEmail}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, primaryEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.primaryPhone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, primaryPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Accounts Payable Contact
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Recipient for monthly consolidated tax statements and credit facility correspondence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={profileForm.accountsName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, accountsName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Accounts Email
                </label>
                <input
                  type="email"
                  value={profileForm.accountsEmail}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, accountsEmail: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Accounts Phone
                </label>
                <input
                  type="text"
                  value={profileForm.accountsPhone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, accountsPhone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            {profileSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4" /> Changes saved successfully
              </span>
            )}
            {!profileSaved && <span />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-autohub-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Delivery Address Book */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Workshop Depots & Delivery Addresses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized destinations for direct freight dispatch from overseas ports.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingAddressId(null);
                setAddrForm({ label: "", street: "", suburb: "", city: "", postcode: "" });
                setShowAddAddressModal(true);
              }}
              className="px-4 py-2 bg-autohub-red hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Workshop Depot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.deliveryAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
                  addr.isDefault
                    ? "bg-blue-50/40 border-autohub-navy shadow-sm"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-autohub-navy" />
                      <h3 className="text-sm font-bold text-slate-900">{addr.label}</h3>
                    </div>
                    {addr.isDefault ? (
                      <span className="text-[10px] bg-autohub-navy text-white font-bold px-2.5 py-0.5 rounded-full">
                        Default Depot
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[11px] font-bold text-autohub-navy hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {addr.street}
                    <br />
                    {addr.suburb}, {addr.city} {addr.postcode}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEditAddress(addr)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Additional User Management */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Organisation Team Members
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Team members within {customer.tradingName} with role-based access to requests and billing.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-autohub-red hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-6">Member</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date Added</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {(customer.organizationUsers || [
                  {
                    id: "USR-001",
                    name: "James Wilson",
                    email: "james@autocareauckland.co.nz",
                    role: "Account Admin",
                    status: "ACTIVE",
                    addedDate: "2024-01-15",
                  },
                  {
                    id: "USR-002",
                    name: "Marcus Vance",
                    email: "marcus@autocareauckland.co.nz",
                    role: "Parts Specialist",
                    status: "ACTIVE",
                    addedDate: "2024-06-20",
                  },
                  {
                    id: "USR-003",
                    name: "Karen Chen",
                    email: "accounts@autocareauckland.co.nz",
                    role: "Accounts Payable",
                    status: "ACTIVE",
                    addedDate: "2024-08-11",
                  },
                ]).map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                      {user.addedDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {user.role !== "Account Admin" ? (
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Primary</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Password & MFA Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Password Change Card */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Change Account Password
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords must be at least 12 characters, including uppercase, lowercase, numbers, and symbols.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 12 characters"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPasswords ? "Hide" : "Show"} Passwords</span>
              </button>

              <div className="flex items-center gap-3">
                {passwordUpdated && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Password updated successfully
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-autohub-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          </form>

          {/* MFA / Two-Factor Authentication Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Two-Factor Authentication (MFA Ready)
                  </h2>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active & Enforced
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Enterprise-grade two-factor authentication protects customer procurement authorizations and financial transaction history.
                </p>
              </div>

              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  mfaEnabled
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {mfaEnabled ? "MFA Enabled" : "Enable MFA"}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Primary Method:</span>
                <span className="font-mono text-slate-600">Authenticator App (TOTP RFC 6238)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Backup Method:</span>
                <span className="font-mono text-slate-600">SMS Verification to +64 21 482 910</span>
              </div>
            </div>
          </div>

          {/* Account Lockout Security Policy Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-autohub-red" />
                  <h2 className="text-base font-bold text-slate-900">
                    Account Lockout & Brute-Force Defense
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  Automatic defense mechanism according to NZ biosecurity and financial compliance policies.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Status
                </span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal / Unlocked
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Max Failed Attempts</span>
                <span className="text-base font-bold text-slate-900 font-mono">5 Consecutive</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Lockout Duration</span>
                <span className="text-base font-bold text-slate-900 font-mono">15 Minutes Freeze</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">Unlock Procedure</span>
                <span className="text-xs font-semibold text-slate-700">Auto-resets or via Autohub Desk</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Address */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-autohub-navy" />
                <h3 className="text-sm font-bold text-slate-900">
                  {editingAddressId ? "Edit Workshop Depot" : "Add New Workshop Depot"}
                </h3>
              </div>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Depot Label / Workshop Bay
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Shore Panel & Paint Depot"
                  value={addrForm.label}
                  onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Constellation Drive"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Suburb
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rosedale"
                    value={addrForm.suburb}
                    onChange={(e) => setAddrForm({ ...addrForm, suburb: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Auckland"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="0632"
                  value={addrForm.postcode}
                  onChange={(e) => setAddrForm({ ...addrForm, postcode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-autohub-navy text-white rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invite Team Member */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-autohub-navy" />
                <h3 className="text-sm font-bold text-slate-900">
                  Invite Team Member
                </h3>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Foster"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="liam@autocareauckland.co.nz"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Assigned Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm({ ...userForm, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Parts Specialist">Parts Specialist (Create & Track Requests)</option>
                  <option value="Workshop Manager">Workshop Manager (Approve Quotes & Manage Bay)</option>
                  <option value="Accounts Payable">Accounts Payable (Invoices & Credit Facility)</option>
                  <option value="Account Admin">Account Admin (Full Organisation Access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-autohub-navy text-white rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
