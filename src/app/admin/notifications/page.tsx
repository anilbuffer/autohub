"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Eye,
  X,
  Save,
  Clock,
  Sparkles,
  Send,
  Smartphone,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  getStoredNotificationTemplates,
  saveNotificationTemplates,
  updateNotificationTemplate,
  addNotificationTemplate,
  toggleNotificationTemplate,
  subscribeToStore,
} from "@/lib/store";
import { NotificationTemplate, UserRole } from "@/lib/types";

const TRIGGER_LABELS: Record<string, { label: string; color: string }> = {
  REQUEST_SUBMITTED: { label: "Request Submitted", color: "bg-blue-50 text-blue-700 border-blue-200" },
  QUOTE_ISSUED: { label: "Quotation Prepared", color: "bg-amber-50 text-amber-700 border-amber-200" },
  PAYMENT_CONFIRMED: { label: "Payment Confirmed (Gate Cleared)", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ORDER_DISPATCHED: { label: "Supplier Dispatched", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  CUSTOMS_CLEARED: { label: "MPI & Customs Cleared", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-purple-50 text-purple-700 border-purple-200" },
  ACCOUNT_APPROVED: { label: "Trade Account Approved", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  ACCOUNT_SUSPENDED: { label: "Account Suspended", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

const AVAILABLE_VARIABLES = [
  { token: "{customerName}", label: "Customer Name" },
  { token: "{referenceNumber}", label: "Request Ref (e.g. AH-P-000123)" },
  { token: "{partName}", label: "Part Requirement" },
  { token: "{makeModel}", label: "Vehicle (Make & Model)" },
  { token: "{quoteTotal}", label: "Quote Total (NZD)" },
  { token: "{freightMethod}", label: "Freight Method (Air/Sea)" },
  { token: "{carrier}", label: "Carrier (e.g. DHL / Mainfreight)" },
  { token: "{trackingNumber}", label: "Carrier Tracking Code" },
  { token: "{eta}", label: "Estimated Delivery ETA" },
];

export default function NotificationTemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState<string>("ALL");
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    trigger: "REQUEST_SUBMITTED" as any,
    recipientRole: "CUSTOMER" as UserRole,
    channel: "BOTH" as "EMAIL_M365" | "IN_APP" | "BOTH",
    subject: "",
    body: "",
    isActive: true,
  });

  const refresh = () => {
    setTemplates(getStoredNotificationTemplates());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.trigger.toLowerCase().includes(search.toLowerCase());

    const matchesTrigger =
      selectedTrigger === "ALL" || t.trigger === selectedTrigger;

    const matchesChannel =
      selectedChannel === "ALL" || t.channel === selectedChannel;

    return matchesSearch && matchesTrigger && matchesChannel;
  });

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      trigger: "REQUEST_SUBMITTED",
      recipientRole: "CUSTOMER",
      channel: "BOTH",
      subject: "Autohub Procurly: [{referenceNumber}] Update",
      body: "Kia Ora {customerName},\n\nWe have an update regarding your request {referenceNumber} ({partName}).\n\nNgā mihi,\nAutohub Operations Team",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: NotificationTemplate) => {
    setEditingTemplate(t);
    setFormData({
      name: t.name,
      trigger: t.trigger,
      recipientRole: t.recipientRole,
      channel: t.channel,
      subject: t.subject,
      body: t.body,
      isActive: t.isActive,
    });
    setModalOpen(true);
  };

  const handleOpenPreview = (t: NotificationTemplate) => {
    setPreviewTemplate(t);
    setPreviewModalOpen(true);
  };

  const handleInsertToken = (token: string) => {
    setFormData((prev) => ({
      ...prev,
      body: prev.body + " " + token,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject.trim() || !formData.body.trim()) return;

    if (editingTemplate) {
      updateNotificationTemplate(editingTemplate.id, {
        name: formData.name.trim(),
        trigger: formData.trigger,
        recipientRole: formData.recipientRole,
        channel: formData.channel,
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        isActive: formData.isActive,
      });
    } else {
      addNotificationTemplate({
        name: formData.name.trim(),
        trigger: formData.trigger,
        recipientRole: formData.recipientRole,
        channel: formData.channel,
        subject: formData.subject.trim(),
        body: formData.body.trim(),
        variables: AVAILABLE_VARIABLES.map((v) => v.token.replace(/[{}]/g, "")),
        isActive: formData.isActive,
      });
    }

    setModalOpen(false);
    setEditingTemplate(null);
  };

  const handleToggle = (id: string) => {
    toggleNotificationTemplate(id);
  };

  // Render mock HTML email preview
  const renderEmailPreview = (t: NotificationTemplate) => {
    const sampleBody = t.body
      .replace(/{customerName}/g, "Apex Motors Auckland")
      .replace(/{referenceNumber}/g, "AH-P-000123")
      .replace(/{partName}/g, "Alternator OEM 12V 130A")
      .replace(/{makeModel}/g, "2020 Toyota Hilux GR-Sport")
      .replace(/{quoteTotal}/g, "$485.00 NZD")
      .replace(/{carrier}/g, "Cathay Pacific Cargo / DHL Express")
      .replace(/{trackingNumber}/g, "DHL-NZ-98210928")
      .replace(/{eta}/g, "Tomorrow 2:00 PM");

    return (
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs font-sans space-y-4">
        {/* Email Header */}
        <div className="bg-[#070e1e] p-4 rounded-xl text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ed2025] flex items-center justify-center font-bold text-white text-xs">
              P
            </div>
            <div>
              <span className="font-bold tracking-tight block">
                PROCUR<span className="text-[#ed2025]">ly</span> by Autohub
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                Automated System Dispatcher &lt;procurement-alerts@autohub.co.nz&gt;
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Auth: M365 Graph TLS
          </span>
        </div>

        {/* Subject Header */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Subject</div>
          <div className="font-bold text-slate-900 text-sm">
            {t.subject
              .replace(/{referenceNumber}/g, "AH-P-000123")
              .replace(/{partName}/g, "Alternator OEM 12V 130A")
              .replace(/{makeModel}/g, "2020 Toyota Hilux GR-Sport")
              .replace(/{carrier}/g, "DHL Express")}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 whitespace-pre-line text-slate-800 leading-relaxed font-sans">
          {sampleBody}
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-400 text-center space-y-0.5">
          <p>Autohub New Zealand Limited • 83 Carbine Road, Mt Wellington, Auckland 1060</p>
          <p>NZBN: 9429038291029 • Governed under the New Zealand Privacy Act 2020</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Automated Communications
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Notification Template Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subjects, bodies, trigger events, and dynamic variable tokens for Microsoft 365 automated emails and in-app staff advisories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Notification Template</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Templates
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {templates.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            System lifecycle event templates
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-blue-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
            Active Automations
          </span>
          <div className="text-3xl font-black text-blue-700 font-mono">
            {templates.filter((t) => t.isActive).length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Dispatched automatically by backend
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Microsoft 365 Relays
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            {templates.filter((t) => t.channel === "EMAIL_M365" || t.channel === "BOTH").length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Sent via Graph API client credentials
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-purple-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
            Dynamic Variables
          </span>
          <div className="text-3xl font-black text-purple-700 font-mono">
            {AVAILABLE_VARIABLES.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Placeholder tokens supported
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates by name, subject, trigger..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/60 focus:bg-white transition outline-none"
            />
          </div>
        </div>

        {/* Trigger Event Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTrigger("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
              selectedTrigger === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            All Events
          </button>
          {Object.keys(TRIGGER_LABELS).slice(0, 5).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedTrigger(key)}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                selectedTrigger === key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              {TRIGGER_LABELS[key].label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Template Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            No notification templates found matching your search or trigger filter.
          </div>
        ) : (
          filteredTemplates.map((t) => {
            const triggerInfo = TRIGGER_LABELS[t.trigger] || {
              label: t.trigger,
              color: "bg-slate-100 text-slate-700",
            };

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${triggerInfo.color}`}>
                      {triggerInfo.label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                        {t.channel === "BOTH" ? "M365 Email + In-App" : t.channel === "EMAIL_M365" ? "M365 Email Only" : "In-App Only"}
                      </span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                        To: {t.recipientRole.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                      Subject: {t.subject}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-3 whitespace-pre-line leading-relaxed">
                    {t.body}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(t.id)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        t.isActive ? "bg-emerald-600" : "bg-slate-300"
                      }`}
                      title={t.isActive ? "Disable automation" : "Enable automation"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          t.isActive ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {t.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(t)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition flex items-center gap-1 text-[11px]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= CREATE / EDIT TEMPLATE MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingTemplate ? "Edit Notification Template" : "Create Notification Template"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure trigger events, subject lines, and token placeholders</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Customs MPI Biosecurity Clearance Customer Advisory"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Trigger Lifecycle Event</label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none font-medium bg-white"
                  >
                    {Object.keys(TRIGGER_LABELS).map((k) => (
                      <option key={k} value={k}>
                        {TRIGGER_LABELS[k].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Recipient Persona</label>
                  <select
                    value={formData.recipientRole}
                    onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none font-medium bg-white"
                  >
                    <option value="CUSTOMER">Customer Trade Account</option>
                    <option value="SOURCING_SPECIALIST">Sourcing Specialist (Procurement)</option>
                    <option value="LOGISTICS_COORDINATOR">Logistics Coordinator</option>
                    <option value="FINANCE_OFFICER">Finance Officer</option>
                    <option value="SYSTEM_ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none font-medium bg-white"
                  >
                    <option value="BOTH">Microsoft 365 Email + In-App</option>
                    <option value="EMAIL_M365">Microsoft 365 Email Only</option>
                    <option value="IN_APP">In-App Notification Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Subject Template</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none focus:border-[#ed2025]"
                />
              </div>

              {/* Dynamic Token Clickable Chips */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px]">
                  Click to Insert Dynamic Placeholder Tokens:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_VARIABLES.map((v) => (
                    <button
                      key={v.token}
                      type="button"
                      onClick={() => handleInsertToken(v.token)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-700 transition"
                      title={v.label}
                    >
                      + {v.token}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Message Body</label>
                <textarea
                  rows={6}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-sans outline-none focus:border-[#ed2025] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="tmpl-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#ed2025] focus:ring-0"
                />
                <label htmlFor="tmpl-active" className="font-bold text-slate-800 cursor-pointer">
                  Activate this notification automation immediately
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold transition shadow flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PREVIEW EMAIL MODAL ================= */}
      {previewModalOpen && previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Email Rendering Preview</h3>
                  <p className="text-[11px] text-slate-500">Rendered with realistic mock payload</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {renderEmailPreview(previewTemplate)}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
