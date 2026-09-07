"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  Truck,
  Plane,
  Ship,
  MapPin,
  CheckCircle2,
  Building2,
  Sliders,
  Phone,
  Mail,
  User,
  ExternalLink,
  Save,
} from "lucide-react";

export default function LogisticsSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [coordinatorName, setCoordinatorName] = useState("Liam Patel");
  const [coordinatorTitle, setCoordinatorTitle] = useState("Lead International Logistics Coordinator");
  const [coordinatorEmail, setCoordinatorEmail] = useState("operations@autohub.co.nz");
  const [coordinatorPhone, setCoordinatorPhone] = useState("+64 9 520 1895");
  const [primaryHub, setPrimaryHub] = useState("Auckland International Airport (AKL) / Ports of Auckland");
  const [customsClientCode, setCustomsClientCode] = useState("NZ-CUS-AH-98421");
  const [mpiRegistration, setMpiRegistration] = useState("MPI-BIO-REG-2026-AKL");
  const [autoNotifyCustomer, setAutoNotifyCustomer] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl pb-16">
      {/* Toast Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium text-xs flex items-center justify-between shadow-md animate-scaleIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Logistics desk configurations saved successfully!</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ed2025] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
              Terminal Preferences &amp; Coordinator Profile
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Logistics Hub Configuration
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Default port pairings, customs brokerage client codes, and operations desk profile.
          </p>
        </div>

        <Link
          href="/operations"
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
        >
          Return to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Coordinator Profile Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-[#ed2025] text-white flex items-center justify-center font-bold text-sm">
              LP
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Logistics Specialist Identity
              </h3>
              <p className="text-slate-500 text-[11px]">
                Appears on consignment milestone updates and customer communication threads.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                value={coordinatorTitle}
                onChange={(e) => setCoordinatorTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Direct Operations Email</label>
              <input
                type="email"
                value={coordinatorEmail}
                onChange={(e) => setCoordinatorEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operations Desk Phone</label>
              <input
                type="text"
                value={coordinatorPhone}
                onChange={(e) => setCoordinatorPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Customs & Bio-Security Gate Config */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                NZ Customs &amp; MPI Bio-Security Identifiers
              </h3>
              <p className="text-slate-500 text-[11px]">
                Electronic clearance codes linked to CusMod and Trade Single Window (TSW).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customs Client Code (Declarant)</label>
              <input
                type="text"
                value={customsClientCode}
                onChange={(e) => setCustomsClientCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">MPI Transitional Facility Approval Number</label>
              <input
                type="text"
                value={mpiRegistration}
                onChange={(e) => setMpiRegistration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Primary Receiving Port &amp; Terminal</label>
              <input
                type="text"
                value={primaryHub}
                onChange={(e) => setPrimaryHub(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotifyCustomer}
                onChange={(e) => setAutoNotifyCustomer(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
              />
              <span className="font-semibold text-slate-800">
                Automatically push SMS / email dispatch notifications to trade customers upon Customs Green Line clearance
              </span>
            </label>
          </div>
        </div>

        {/* Preferred Freight Partner Accounts */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Integrated Freight Carrier Accounts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Air New Zealand Cargo</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Corporate AWB API: Connected</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>DHL Express Global</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Express Priority Account: #940210</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Toyofuji Shipping Line</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Nagoya / Yokohama Ocean Berth</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow-md shadow-red-900/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Hub Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
