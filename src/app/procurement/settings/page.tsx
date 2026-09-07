"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Percent,
  DollarSign,
  Truck,
  ShieldCheck,
  Bell,
  KeyRound,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  Compass,
  FileCheck,
  AlertTriangle,
  Sliders,
  Check,
  Eye,
  EyeOff,
  Laptop,
} from "lucide-react";

interface SpecialistProfile {
  fullName: string;
  jobTitle: string;
  deskId: string;
  email: string;
  phone: string;
  mobile: string;
  deskLocation: string;
  timeZone: string;
  specializations: string[];
}

interface DeskPreferences {
  defaultMarginPct: number;
  baseProcurementFee: number;
  defaultFreightMethod: "SEA_CONSOLIDATED" | "AIR_EXPRESS";
  preferredExportHub: string;
  autoApplyGst: boolean;
  currencyFormat: string;
}

interface NotificationSettings {
  newRequestAlert: boolean;
  supplierQuoteReceived: boolean;
  exceptionAlerts: boolean;
  paymentConfirmedPORelease: boolean;
  dailySummaryEmail: boolean;
}

const STORAGE_KEY_PROFILE = "autohub_procurement_specialist_profile";
const STORAGE_KEY_PREFS = "autohub_procurement_specialist_prefs";
const STORAGE_KEY_NOTIFS = "autohub_procurement_specialist_notifs";

export default function ProcurementProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications" | "security">("profile");

  // Profile Form State
  const [profile, setProfile] = useState<SpecialistProfile>({
    fullName: "Nathan Cole",
    jobTitle: "Senior Sourcing & Procurement Specialist",
    deskId: "AH-PROC-084",
    email: "nathan.cole@autohub.co.nz",
    phone: "+64 9 887 9200 ext 402",
    mobile: "+64 21 555 7891",
    deskLocation: "Nagoya Logistics Hub & Auckland Trade HQ",
    timeZone: "Pacific/Auckland (UTC+12) / Asia/Tokyo (UTC+9)",
    specializations: ["JDM OEM Parts", "European Prestige", "Direct Auction Sourcing", "HS Tariff Classification"],
  });

  // Desk Preferences State
  const [preferences, setPreferences] = useState<DeskPreferences>({
    defaultMarginPct: 18.0,
    baseProcurementFee: 60,
    defaultFreightMethod: "SEA_CONSOLIDATED",
    preferredExportHub: "Port of Nagoya Export Center (Aichi, Japan)",
    autoApplyGst: true,
    currencyFormat: "NZD",
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newRequestAlert: true,
    supplierQuoteReceived: true,
    exceptionAlerts: true,
    paymentConfirmedPORelease: true,
    dailySummaryEmail: false,
  });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Toast / Save feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedProf = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedProf) setProfile(JSON.parse(savedProf));

      const savedPrefs = localStorage.getItem(STORAGE_KEY_PREFS);
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));

      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg("");
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      triggerToast("Specialist profile updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
      triggerToast("Desk sourcing defaults and margin policy saved!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
      triggerToast("Alert and notification preferences saved!");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
    triggerToast("Security password updated successfully!");
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 text-xs font-semibold animate-scaleIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1329] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            {/* Amber Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-600 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-amber-900/40 ring-4 ring-slate-800">
                NC
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[9px] text-white" title="Active Sourcing Desk Session">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {profile.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Sourcing Specialist
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-semibold">
                  {profile.deskId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                {profile.jobTitle} • {profile.deskLocation}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1 font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                  Desk Status: Active &amp; Online
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
            <div className="bg-slate-800/60 backdrop-blur rounded-2xl px-4 py-3 border border-slate-700/60 text-center min-w-[100px]">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Default Margin
              </div>
              <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                {preferences.defaultMarginPct.toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur rounded-2xl px-4 py-3 border border-slate-700/60 text-center min-w-[100px]">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Base Fee
              </div>
              <div className="text-lg font-black text-white font-mono mt-0.5">
                ${preferences.baseProcurementFee} NZD
              </div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur rounded-2xl px-4 py-3 border border-slate-700/60 text-center min-w-[100px]">
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Hub Gate
              </div>
              <div className="text-xs font-bold text-emerald-400 mt-1.5">
                Nagoya (JP)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "preferences"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Desk Defaults &amp; Margins</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Sourcing Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "security"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security &amp; Session</span>
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                Specialist Identification &amp; Contact
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Your contact details are shown on customer quotation sheets, trade invoices, and supplier procurement letters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Official Sourcing Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Desk ID / Employee Reference
                </label>
                <input
                  type="text"
                  value={profile.deskId}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-500 bg-slate-100 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Assigned by Autohub Systems Administration.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Direct Line (Office Extension)
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile / WhatsApp (Supplier Hotline)
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Operational Desk &amp; Logistics Hub
                </label>
                <input
                  type="text"
                  value={profile.deskLocation}
                  onChange={(e) => setProfile({ ...profile, deskLocation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>
            </div>

            {/* Specializations Tag Area */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Sourcing Specialization Domains
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    {spec}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                Tags indicate which vehicle make/model inquiries are automatically routed to your desk queue.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Details</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Desk Defaults & Margins */}
      {activeTab === "preferences" && (
        <form onSubmit={handleSavePreferences} className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                Sourcing Desk Cost Modeling &amp; Margin Defaults
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure standard calculations used when building customer quotation breakdowns in the Sourcing Queue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Default Target Margin */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-amber-600" />
                    Target Sourcing Margin %
                  </label>
                  <span className="px-2 py-0.5 bg-amber-500 text-white font-mono font-black text-xs rounded-lg">
                    {preferences.defaultMarginPct.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="0.5"
                  value={preferences.defaultMarginPct}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      defaultMarginPct: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Default percentage added to landed cost. Can be tuned per-quote based on customer trade tier.
                </p>
              </div>

              {/* Base Procurement Fee */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Base Procurement Service Fee
                  </label>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    ${preferences.baseProcurementFee} NZD
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={preferences.baseProcurementFee}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      baseProcurementFee: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-slate-900"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Standard fixed handling and export documentation fee included in customer quotes.
                </p>
              </div>

              {/* Preferred Export Hub */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary International Export Hub
                </label>
                <select
                  value={preferences.preferredExportHub}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      preferredExportHub: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                >
                  <option value="Port of Nagoya Export Center (Aichi, Japan)">
                    Port of Nagoya Export Center (Aichi, Japan) - Primary
                  </option>
                  <option value="Port of Yokohama Ocean Hub (Kanagawa, Japan)">
                    Port of Yokohama Ocean Hub (Kanagawa, Japan)
                  </option>
                  <option value="Kansai International Air Freight Terminal (Osaka)">
                    Kansai International Air Freight Terminal (Osaka)
                  </option>
                  <option value="Fukuoka Kyushu Consolidated Warehouse">
                    Fukuoka Kyushu Consolidated Warehouse
                  </option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Domestic supplier delivery addresses default to this facility.
                </span>
              </div>

              {/* Default Freight Channel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Recommended Freight Method
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        defaultFreightMethod: "SEA_CONSOLIDATED",
                      })
                    }
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2.5 ${
                      preferences.defaultFreightMethod === "SEA_CONSOLIDATED"
                        ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs">Sea Consolidated</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        14-18 business days
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        defaultFreightMethod: "AIR_EXPRESS",
                      })
                    }
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2.5 ${
                      preferences.defaultFreightMethod === "AIR_EXPRESS"
                        ? "bg-amber-50 border-amber-400 text-amber-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs">Air Priority Express</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        3-5 business days
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggle: GST Auto Calculate */}
              <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Automatically Append New Zealand GST (15%)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Ensures all customer-facing quotation totals reflect landed NZ customs tax compliance.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      autoApplyGst: !preferences.autoApplyGst,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    preferences.autoApplyGst ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                      preferences.autoApplyGst ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Desk Defaults</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Sourcing Alerts & Notifications */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSaveNotifications} className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                Desk Notification Triggers &amp; Operational Alerts
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Control the real-time notifications dispatched to your browser and sourcing inbox.
              </p>
            </div>

            <div className="space-y-4">
              {/* Alert 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    New Trade Customer Part Requests
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Dispatched immediately when a garage, workshop, or fleet operator submits a new procurement inquiry.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      newRequestAlert: !notifications.newRequestAlert,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    notifications.newRequestAlert ? "bg-slate-900" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                      notifications.newRequestAlert ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Alert 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Supplier Quotes Received &amp; Catalog Matching
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Notifies when Japanese or German suppliers return pricing via EDI or supplier portal sync.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      supplierQuoteReceived: !notifications.supplierQuoteReceived,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    notifications.supplierQuoteReceived ? "bg-slate-900" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                      notifications.supplierQuoteReceived ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Alert 3 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-rose-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Sourcing Exceptions &amp; Backorder Alerts
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Critical alerts when parts are reported discontinued, out of stock, or price variation exceeds 10%.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      exceptionAlerts: !notifications.exceptionAlerts,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    notifications.exceptionAlerts ? "bg-rose-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                      notifications.exceptionAlerts ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Alert 4 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Payment Confirmed PO Release Gate
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Immediate notification when customer funds clear, enabling the PO to be placed with the overseas supplier.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      paymentConfirmedPORelease: !notifications.paymentConfirmedPORelease,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition relative p-0.5 ${
                    notifications.paymentConfirmedPORelease ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                      notifications.paymentConfirmedPORelease ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Alert Preferences</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Security & Session */}
      {activeTab === "security" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Change Password Card */}
          <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-slate-900">
                Security Credentials &amp; Access Key
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage your credentials for signing into Autohub Procurement Desk.
              </p>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Password changed successfully.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none transition"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>

          {/* Active Session & 2FA Status Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Hardware YubiKey &amp; Authenticator App
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                  Enforced
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your account is protected by mandatory 2-Factor Authentication per Autohub corporate procurement compliance policies.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Current Workstation Session
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Auckland HQ Desk • Windows 11
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
                IP: 118.93.42.10 (Autohub Trade VPN) • Authenticated via Azure AD SSO.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
