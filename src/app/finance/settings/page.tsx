"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Building2,
  DollarSign,
  Save,
  CheckCircle2,
  Landmark,
  FileText,
  Lock,
} from "lucide-react";
import {
  getStoredSettings,
  saveSettings,
  subscribeToStore,
} from "@/lib/store";
import { SystemSettings } from "@/lib/types";
import { initialSystemSettings } from "@/lib/mockData";

export default function FinanceSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(initialSystemSettings);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getStoredSettings());
    const unsub = subscribeToStore(() => {
      setSettings(getStoredSettings());
    });
    return unsub;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setSavedNote("Finance and billing gateway settings saved successfully!");
    setTimeout(() => setSavedNote(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl pb-16">
      {/* Toast */}
      {savedNote && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{savedNote}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
            Treasury Config
          </span>
          <span className="text-xs text-slate-500 font-mono">
            ANZ Trust &amp; Inland Revenue NZ Settings
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
          Billing Gateway, Bank &amp; GST Rules
        </h1>
        <p className="text-xs text-slate-500">
          Configure direct bank remittance accounts, statutory Goods and Services Tax rates, and sequential invoice numbering schemes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Bank Account Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Landmark className="w-4 h-4 text-[#ed2025]" />
            <h3 className="text-sm font-bold text-slate-900">
              ANZ Trust Account for Direct Remittances
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Bank Name:
              </label>
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Account Name:
              </label>
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#ed2025]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                NZ Bank Account Number:
              </label>
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                SWIFT / BIC Code:
              </label>
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-[#ed2025]"
              />
            </div>
          </div>
        </div>

        {/* GST & Numbering Scheme */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              New Zealand GST &amp; Numbering Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Statutory NZ GST Rate (%):
              </label>
              <input
                type="number"
                step="0.01"
                value={(settings.gstRate * 100).toFixed(1)}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gstRate: (parseFloat(e.target.value) || 15) / 100,
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Standard New Zealand Goods and Services Tax: 15.0%
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Order Request Prefix:
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default: AH-P- (e.g. AH-P-000125)
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#ed2025] hover:bg-[#d3181d] text-white rounded-xl font-bold transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Finance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
