"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle2, Shield, Clock, FileText } from "lucide-react";
import { getStoredSettings, saveSettings, getStoredRequests } from "@/lib/store";
import { SystemSettings, AuditLogEntry } from "@/lib/types";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings());
  const [saved, setSaved] = useState(false);
  const [allAuditLogs, setAllAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setSettings(getStoredSettings());
    const requests = getStoredRequests();
    const flatLogs = requests.flatMap((r) => r.auditLogs);
    setAllAuditLogs(flatLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System Configuration & Full Audit Trail
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage system margin thresholds, freight baselines, sequential reference formats, and audit logs.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters updated and applied to quotation calculation engine.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-autohub-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Procurement & Freight Defaults
            </h3>
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700">
              Default Target Margin (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={settings.defaultMarginPercent}
              onChange={(e) => setSettings({ ...settings, defaultMarginPercent: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Applied automatically during AI quote synthesis
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700">
              Air Express Freight Base Rate (NZD)
            </label>
            <input
              type="number"
              value={settings.airFreightBaseRateNzd}
              onChange={(e) => setSettings({ ...settings, airFreightBaseRateNzd: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Baseline 3-5 day Cathay/Air NZ Priority cargo
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700">
              Ocean Sea Freight Base Rate (NZD)
            </label>
            <input
              type="number"
              value={settings.seaFreightBaseRateNzd}
              onChange={(e) => setSettings({ ...settings, seaFreightBaseRateNzd: parseFloat(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Baseline Toyofuji Ocean consolidated freight
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-2 border-t border-slate-100">
          <div>
            <label className="font-semibold block mb-1 text-slate-700">
              New Zealand GST Tax Rate
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.gstRate}
              onChange={(e) => setSettings({ ...settings, gstRate: parseFloat(e.target.value) || 0.15 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              IRD Statutory Rate (0.15 = 15%)
            </span>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700">
              Request Reference Number Format Prefix
            </label>
            <input
              type="text"
              value={settings.requestRefPrefix}
              onChange={(e) => setSettings({ ...settings, requestRefPrefix: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Generates references like AH-P-000123
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <h4 className="font-bold text-slate-800">Autohub Trust Bank Account Details (NZ Invoices)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
            <p><strong>Bank:</strong> {settings.bankAccountDetails.bankName}</p>
            <p><strong>Account Name:</strong> {settings.bankAccountDetails.accountName}</p>
            <p className="font-mono"><strong>Account No:</strong> {settings.bankAccountDetails.accountNumber}</p>
            <p className="font-mono"><strong>SWIFT / BIC:</strong> {settings.bankAccountDetails.swiftBic}</p>
          </div>
        </div>
      </form>

      {/* Global Audit Trail */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-autohub-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Full System Audit Log ({allAuditLogs.length} events)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Immutable State Tracking</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1 text-xs">
          {allAuditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-slate-900 block">{log.action}</span>
                {log.details && (
                  <span className="text-slate-600 text-[11px] block mt-0.5">{log.details}</span>
                )}
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Actor: <strong>{log.actorName}</strong> ({log.actorRole})
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-mono block">
                  {new Date(log.timestamp).toLocaleString("en-NZ")}
                </span>
                {log.newState && (
                  <span className="text-[10px] font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                    {log.newState}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
