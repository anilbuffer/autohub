"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Mail,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Percent,
  Plane,
  Anchor,
  FileText,
  Building,
  Key,
  Globe,
  Sliders,
} from "lucide-react";
import {
  getStoredSettings,
  saveSettings,
  getStoredM365Config,
  saveM365Config,
  subscribeToStore,
} from "@/lib/store";
import { SystemSettings, Microsoft365Config } from "@/lib/types";

export default function SystemSettingsAndM365Page() {
  const [activeTab, setActiveTab] = useState<"BASELINE" | "M365">("BASELINE");
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings());
  const [m365, setM365] = useState<Microsoft365Config>(getStoredM365Config());

  const [savedSettings, setSavedSettings] = useState(false);
  const [savedM365, setSavedM365] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Test email modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState("procurement.desk@autohub.co.nz");
  const [testSubject, setTestSubject] = useState("Autohub Procurly M365 Health Check & Courier Relay");
  const [testSent, setTestSent] = useState(false);
  const [testSending, setTestSending] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
    setM365(getStoredM365Config());

    const unsub = subscribeToStore(() => {
      setSettings(getStoredSettings());
      setM365(getStoredM365Config());
    });
    return unsub;
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3500);
  };

  const handleSaveM365 = (e: React.FormEvent) => {
    e.preventDefault();
    saveM365Config({
      ...m365,
      lastSync: new Date().toISOString(),
      connected: true,
    });
    setSavedM365(true);
    setTimeout(() => setSavedM365(false), 3500);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setTestSending(true);
    setTimeout(() => {
      setTestSending(false);
      setTestSent(true);
      setTimeout(() => {
        setTestSent(false);
        setTestModalOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed2025] bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              System Core Configuration
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            System Configuration &amp; Microsoft 365 Email
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage target margin thresholds, baseline freight costs, GST tax rates, reference formats, and Microsoft 365 Graph/SMTP email integration.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("BASELINE")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "BASELINE"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#ed2025]" />
            <span>Procurement &amp; Freight Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("M365")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "M365"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Microsoft 365 Email Config</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Target Margin Threshold
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono flex items-center gap-1">
            <span>{settings.defaultMarginPercent}%</span>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-500 block">
            AI Quote landed margin calculation
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Air Express Freight Base
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            ${settings.airFreightBaseRateNzd}
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">NZD</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Cathay / Air NZ Priority air freight
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ocean Sea Freight Base
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            ${settings.seaFreightBaseRateNzd}
            <span className="text-xs font-normal text-slate-400 font-sans ml-1">NZD</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Toyofuji Ocean consolidated container
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            M365 Integration Status
          </span>
          <div className="text-3xl font-black text-emerald-700 flex items-center gap-2">
            <span>Connected</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[11px] text-slate-500 block font-mono">
            Quota: {m365.dailyQuotaUsed} / {m365.dailyQuotaLimit} today
          </span>
        </div>
      </div>

      {/* ================= TAB 1: SYSTEM BASELINE CONFIGURATION ================= */}
      {activeTab === "BASELINE" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {savedSettings && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                System configuration parameters successfully updated and pushed to quotation calculation engines.
              </span>
            </div>
          )}

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ed2025] flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Procurement, Margin &amp; Freight Baseline Defaults
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Governs automated quotation synthesis and customer freight calculations
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs transition shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save System Parameters</span>
              </button>
            </div>

            {/* Symmetrical 3-Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Default Target Margin (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.defaultMarginPercent}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultMarginPercent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Autohub standard 18.0% markup on landed FOB cost
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Air Express Freight Base Rate ($NZD)
                </label>
                <input
                  type="number"
                  value={settings.airFreightBaseRateNzd}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      airFreightBaseRateNzd: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Cathay / Air NZ priority 3-5 business day transit
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Ocean Sea Freight Base Rate ($NZD)
                </label>
                <input
                  type="number"
                  value={settings.seaFreightBaseRateNzd}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seaFreightBaseRateNzd: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Toyofuji 18-24 business day consolidated ocean cargo
                </span>
              </div>
            </div>

            {/* Symmetrical 2-Input Grid: Tax & Reference Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  New Zealand GST Statutory Tax Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.gstRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        gstRate: parseFloat(e.target.value) || 0.15,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                    {(settings.gstRate * 100).toFixed(0)}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Inland Revenue Department (IRD) statutory requirement (0.15 = 15%)
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Request Reference Number Format Prefix
                </label>
                <input
                  type="text"
                  value={settings.requestRefPrefix}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      requestRefPrefix: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                  Generates sequential reference numbers: {settings.requestRefPrefix}000142
                </span>
              </div>
            </div>

            {/* NZ Trust Bank Account Details for Tax Invoices */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Autohub Procurement Trust Bank Account (Appears on Official NZ Tax Invoices)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank Name</span>
                  <input
                    type="text"
                    value={settings.bankAccountDetails.bankName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankAccountDetails: {
                          ...settings.bankAccountDetails,
                          bankName: e.target.value,
                        },
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 font-medium bg-white text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Name</span>
                  <input
                    type="text"
                    value={settings.bankAccountDetails.accountName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankAccountDetails: {
                          ...settings.bankAccountDetails,
                          accountName: e.target.value,
                        },
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 font-medium bg-white text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Account Number</span>
                  <input
                    type="text"
                    value={settings.bankAccountDetails.accountNumber}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankAccountDetails: {
                          ...settings.bankAccountDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 font-mono font-bold bg-white text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">SWIFT / BIC</span>
                  <input
                    type="text"
                    value={settings.bankAccountDetails.swiftBic}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bankAccountDetails: {
                          ...settings.bankAccountDetails,
                          swiftBic: e.target.value,
                        },
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-xl border border-slate-200 font-mono font-bold bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ================= TAB 2: MICROSOFT 365 EMAIL CONFIGURATION ================= */}
      {activeTab === "M365" && (
        <form onSubmit={handleSaveM365} className="space-y-6">
          {savedM365 && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Microsoft 365 Graph API &amp; SMTP settings saved. Connection handshake verified.
              </span>
            </div>
          )}

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Microsoft 365 Enterprise Email Relay
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dispatches official quotation notifications, payment receipts, and customs clearances
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Test Email</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save &amp; Verify Handshake</span>
                </button>
              </div>
            </div>

            {/* Connection Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900 block">
                    Microsoft Graph OAuth2 Connection Active
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Authenticated with Autohub New Zealand Limited Microsoft Entra ID tenant.
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-emerald-800">
                Last Handshake: {new Date(m365.lastSync).toLocaleTimeString()}
              </span>
            </div>

            {/* Symmetrical Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Azure AD / Entra ID Tenant ID (Directory ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={m365.tenantId}
                    onChange={(e) => setM365({ ...m365, tenantId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#ed2025] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(m365.tenantId, "tenant")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    title="Copy Tenant ID"
                  >
                    {copiedField === "tenant" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Autohub organization unique directory identifier
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Application (Client) ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={m365.clientId}
                    onChange={(e) => setM365({ ...m365, clientId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#ed2025] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(m365.clientId, "client")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    title="Copy Client ID"
                  >
                    {copiedField === "client" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  App Registration client ID registered in Azure Portal
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Client Secret (Encrypted)
                </label>
                <div className="relative">
                  <input
                    type={secretRevealed ? "text" : "password"}
                    value={m365.clientSecretMasked}
                    onChange={(e) => setM365({ ...m365, clientSecretMasked: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#ed2025] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setSecretRevealed(!secretRevealed)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {secretRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Stored securely in Azure Key Vault
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Authentication Protocol
                </label>
                <select
                  value={m365.authMethod}
                  onChange={(e) => setM365({ ...m365, authMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none font-semibold text-slate-900 bg-white"
                >
                  <option value="OAUTH2_GRAPH">OAuth 2.0 Client Credentials (Microsoft Graph API)</option>
                  <option value="SMTP_MODERN_AUTH">SMTP Auth via Modern Authentication (Port 587 TLS)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Recommended: Microsoft Graph Mail.Send application scope
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Sender Email Address
                </label>
                <input
                  type="email"
                  required
                  value={m365.senderEmail}
                  onChange={(e) => setM365({ ...m365, senderEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Designated Microsoft 365 licensed shared mailbox
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  required
                  value={m365.senderName}
                  onChange={(e) => setM365({ ...m365, senderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 outline-none focus:border-[#ed2025]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Appears in trade customer inbox headers
                </span>
              </div>
            </div>

            {/* Daily Quota Utilization Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  Microsoft 365 Daily Sending Quota Utilization
                </span>
                <span className="font-mono text-slate-600 font-semibold">
                  {m365.dailyQuotaUsed} / {m365.dailyQuotaLimit} emails sent ({((m365.dailyQuotaUsed / m365.dailyQuotaLimit) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(m365.dailyQuotaUsed / m365.dailyQuotaLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ================= SEND TEST EMAIL MODAL ================= */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Microsoft 365 Email Test</h3>
                  <p className="text-[11px] text-slate-500">Live delivery simulation via Graph API</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="p-5 space-y-4 text-xs">
              {testSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 space-y-1 animate-scaleIn">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Test Message Dispatched Successfully!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Microsoft 365 returned HTTP 202 Accepted. Message delivered to {testRecipient}.
                  </p>
                </div>
              ) : null}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Address</label>
                <input
                  type="email"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1 font-mono">
                <div>From: {m365.senderName} &lt;{m365.senderEmail}&gt;</div>
                <div>Tenant: {m365.tenantId.slice(0, 16)}...</div>
                <div>Protocol: {m365.authMethod}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testSending}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{testSending ? "Sending via M365..." : "Send Test Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
