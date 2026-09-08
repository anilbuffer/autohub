"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Shield,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  AlertTriangle,
  X,
  Save,
  FileCheck,
  Eye,
  Calendar,
  Lock,
} from "lucide-react";
import {
  getStoredPolicyVersions,
  publishPolicyVersion,
  subscribeToStore,
} from "@/lib/store";
import { PolicyVersion } from "@/lib/types";

export default function PolicyCompliancePage() {
  const [policies, setPolicies] = useState<PolicyVersion[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyVersion | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "TERMS_AND_CONDITIONS" as "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY",
    version: "v2026.2",
    title: "Commercial Automotive Procurement Terms of Trade",
    effectiveDate: new Date().toISOString().split("T")[0],
    publishedBy: "Sarah Jenkins",
    changelog: "",
    content: "",
    requireReconsent: true,
  });

  const refresh = () => {
    setPolicies(getStoredPolicyVersions());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  const tcPolicies = policies.filter((p) => p.type === "TERMS_AND_CONDITIONS");
  const ppPolicies = policies.filter((p) => p.type === "PRIVACY_POLICY");

  const currentTC = tcPolicies.find((p) => p.isCurrent) || tcPolicies[0];
  const currentPP = ppPolicies.find((p) => p.isCurrent) || ppPolicies[0];

  const handleOpenPublish = (type: "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY") => {
    const nextVer = type === "TERMS_AND_CONDITIONS" ? "v2026.2" : "v2026.3";
    const defaultTitle =
      type === "TERMS_AND_CONDITIONS"
        ? "Commercial Automotive Procurement Terms of Trade"
        : "Privacy & Data Protection Policy (NZ Privacy Act 2020)";

    setFormData({
      type,
      version: nextVer,
      title: defaultTitle,
      effectiveDate: new Date().toISOString().split("T")[0],
      publishedBy: "Sarah Jenkins",
      changelog: "",
      content:
        type === "TERMS_AND_CONDITIONS"
          ? currentTC?.content || ""
          : currentPP?.content || "",
      requireReconsent: true,
    });
    setModalOpen(true);
  };

  const handleOpenView = (p: PolicyVersion) => {
    setSelectedPolicy(p);
    setViewModalOpen(true);
  };

  const handleSavePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.version.trim() || !formData.title.trim() || !formData.content.trim()) return;

    publishPolicyVersion({
      type: formData.type,
      version: formData.version.trim(),
      title: formData.title.trim(),
      effectiveDate: formData.effectiveDate,
      publishedBy: formData.publishedBy,
      changelog: formData.changelog.trim() || "Routine policy revisions and regulatory alignment.",
      content: formData.content.trim(),
    });

    setModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              Statutory Governance &amp; Legal Compliance
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Terms &amp; Conditions and Privacy Policy Version Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain legal terms of trade, customer privacy protections under the New Zealand Privacy Act 2020, and manage active version releases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenPublish("TERMS_AND_CONDITIONS")}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New T&amp;C Version</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenPublish("PRIVACY_POLICY")}
            className="px-3.5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Publish New Privacy Version</span>
          </button>
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Terms Version
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono flex items-center gap-2">
            <span>{currentTC?.version || "v2026.1"}</span>
            <span className="text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            Effective: {currentTC?.effectiveDate}
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-indigo-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
            Active Privacy Policy
          </span>
          <div className="text-3xl font-black text-indigo-700 font-mono flex items-center gap-2">
            <span>{currentPP?.version || "v2026.2"}</span>
            <span className="text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            NZ Privacy Act 2020 IPP Compliant
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Trade Consent Rate
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            100%
          </div>
          <span className="text-[11px] text-slate-500 block">
            All active trade accounts acknowledged terms
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Archived Audit History
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {policies.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Historical legal revisions preserved
          </span>
        </div>
      </div>

      {/* Symmetrical 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Terms & Conditions Versions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Terms of Trade Versions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPublish("TERMS_AND_CONDITIONS")}
                className="text-xs font-bold text-[#ed2025] hover:underline"
              >
                + Publish Revision
              </button>
            </div>

            {/* Current Active Card */}
            {currentTC && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {currentTC.version}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      CURRENT RELEASE
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Effective: {currentTC.effectiveDate}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800">{currentTC.title}</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Changelog Summary:</span>
                  {currentTC.changelog}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Published by {currentTC.publishedBy} on {currentTC.publishedDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenView(currentTC)}
                    className="font-bold text-slate-900 hover:text-[#ed2025] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Full Terms</span>
                  </button>
                </div>
              </div>
            )}

            {/* Version History List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Version History (Superseded Releases)
              </span>

              {tcPolicies.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-700">{p.version}</span>
                    <span className="text-slate-500 text-[11px] truncate max-w-[200px]">
                      {p.changelog}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">{p.effectiveDate}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenView(p)}
                      className="text-slate-700 hover:text-slate-900 font-bold"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Enforced on trade checkout and invoice clearance</span>
            <Link href="/terms" target="_blank" className="text-[#ed2025] hover:underline flex items-center gap-1 font-bold">
              <span>View Public Terms</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Column: Privacy Policy Versions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Privacy Policy Versions (NZ Privacy Act 2020)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPublish("PRIVACY_POLICY")}
                className="text-xs font-bold text-[#ed2025] hover:underline"
              >
                + Publish Revision
              </button>
            </div>

            {/* Current Active Card */}
            {currentPP && (
              <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-950 text-sm">
                      {currentPP.version}
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      CURRENT RELEASE
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Effective: {currentPP.effectiveDate}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800">{currentPP.title}</p>
                <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Statutory IPP Alignment:</span>
                  {currentPP.changelog}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Published by {currentPP.publishedBy} on {currentPP.publishedDate}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenView(currentPP)}
                    className="font-bold text-indigo-900 hover:text-[#ed2025] flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Full Policy</span>
                  </button>
                </div>
              </div>
            )}

            {/* Version History List */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Version History (Superseded Releases)
              </span>

              {ppPolicies.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-700">{p.version}</span>
                    <span className="text-slate-500 text-[11px] truncate max-w-[200px]">
                      {p.changelog}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">{p.effectiveDate}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenView(p)}
                      className="text-slate-700 hover:text-slate-900 font-bold"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Governed under the Privacy Commissioner New Zealand</span>
            <Link href="/privacy" target="_blank" className="text-[#ed2025] hover:underline flex items-center gap-1 font-bold">
              <span>View Public Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= PUBLISH NEW POLICY MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ed2025] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Publish New {formData.type === "TERMS_AND_CONDITIONS" ? "Terms & Conditions" : "Privacy Policy"} Version
                  </h3>
                  <p className="text-[11px] text-slate-500">Supercedes current active release across all customer portals</p>
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

            <form onSubmit={handleSavePublish} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Version Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. v2026.2"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Effective Date</label>
                  <input
                    type="date"
                    required
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Policy Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Summary of Modifications (Changelog)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated Section 8 for electric vehicle lithium battery freight clearance protocols..."
                  value={formData.changelog}
                  onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Full Legal Text</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs outline-none focus:border-[#ed2025] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reconsent"
                  checked={formData.requireReconsent}
                  onChange={(e) => setFormData({ ...formData, requireReconsent: e.target.checked })}
                  className="rounded text-[#ed2025] focus:ring-0"
                />
                <label htmlFor="reconsent" className="font-bold text-slate-800 cursor-pointer">
                  Require active trade accounts to acknowledge this revision upon their next login
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
                  <span>Publish Version Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW FULL POLICY MODAL ================= */}
      {viewModalOpen && selectedPolicy && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{selectedPolicy.version}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                    {selectedPolicy.type.replace(/_/g, " ")}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedPolicy.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">Changelog:</span>
                <p className="text-slate-600">{selectedPolicy.changelog}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Effective Date: {selectedPolicy.effectiveDate} • Published By: {selectedPolicy.publishedBy}
                </span>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 whitespace-pre-line text-slate-800 leading-relaxed font-mono">
                {selectedPolicy.content}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
