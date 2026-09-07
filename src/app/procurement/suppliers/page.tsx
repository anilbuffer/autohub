"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  Star,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  User,
  MapPin,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  getStoredSuppliers,
  addSupplierProfile,
  subscribeToStore,
} from "@/lib/store";
import { initialSuppliers } from "@/lib/mockData";
import { SupplierProfile } from "@/lib/types";

export default function SupplierDirectoryPage() {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(initialSuppliers);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // New Supplier Form State
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Japan");
  const [currency, setCurrency] = useState("JPY");
  const [exchangeRate, setExchangeRate] = useState<number>(0.0108);
  const [category, setCategory] = useState("Japanese OEM Genuine");
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);
  const [rating, setRating] = useState<number>(4.8);
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    setSuppliers(getStoredSuppliers());
    const unsub = subscribeToStore(() => {
      setSuppliers(getStoredSuppliers());
    });
    return unsub;
  }, []);

  const handleCountryChange = (c: string) => {
    setCountry(c);
    if (c === "Japan") {
      setCurrency("JPY");
      setExchangeRate(0.0108);
      setCategory("Japanese OEM Genuine");
    } else if (c === "Germany") {
      setCurrency("EUR");
      setExchangeRate(1.82);
      setCategory("VAG, BMW, Mercedes Genuine");
    } else if (c === "USA") {
      setCurrency("USD");
      setExchangeRate(1.68);
      setCategory("American Truck & SUV");
    } else if (c === "Australia") {
      setCurrency("AUD");
      setExchangeRate(1.10);
      setCategory("Ute & Commercial Fleet");
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSup: SupplierProfile = {
      id: `SUP-${Date.now().toString().slice(-4)}`,
      name,
      country,
      currency,
      exchangeRateToNzd: exchangeRate,
      category,
      leadTimeDays,
      rating,
      contactPerson,
      contactEmail,
      contactPhone,
    };

    addSupplierProfile(newSup);
    setShowAddModal(false);
    setSuccessMsg(`Supplier ${name} registered successfully with active export terminal!`);
    setTimeout(() => setSuccessMsg(""), 5000);

    // Reset
    setName("");
    setContactPerson("");
    setContactEmail("");
    setContactPhone("");
  };

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((s) => {
    if (countryFilter !== "ALL" && s.country !== countryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Global Sourcing Network
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Overseas &amp; Domestic Supplier Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified international distributors, OEM dealers, and commercial parts alliances across Japan, Europe, USA, and Australia.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-900/20 transition flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New International Supplier</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Content: Table/Grid List or Full Details Dossier */}
      {!selectedSupplierId || !activeSupplier ? (
        <div className="space-y-6">
          {/* Supplier Network KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Active Global Alliances
                </span>
                <Building2 className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {suppliers.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Contracted wholesale supply agreements
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Certified OEM Genuine Hubs
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                3
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Toyota Japan, VAG Germany, GM / Ford US
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Average Dispatch SLA
                </span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                2.6 <span className="text-sm font-semibold text-slate-500">days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Lead time to overseas export facility
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Network Quality Score
                </span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2 flex items-baseline gap-1">
                4.86 <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                99.1% OEM fitment accuracy guarantee
              </p>
            </div>
          </div>

          {/* Filter & View Toolbar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor name, country, category, contact..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Country Filter Chips & View Mode Switcher */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 text-[11px]">
                {["ALL", "Japan", "Germany", "USA", "Australia"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCountryFilter(c)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${
                      countryFilter === c
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {c === "ALL" ? "All Hubs" : c}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode("GRID")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === "GRID" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("TABLE")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === "TABLE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* ================= SUPPLIERS GRID VIEW ================= */}
          {viewMode === "GRID" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm group-hover:bg-slate-900 group-hover:text-white transition">
                        {sup.country === "Japan" ? "JP" : sup.country === "Germany" ? "DE" : sup.country === "USA" ? "US" : "AU"}
                      </div>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{sup.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-base font-black text-slate-900 leading-tight">
                        {sup.name}
                      </div>
                      <div className="text-xs font-bold text-red-600 mt-1">
                        {sup.category}
                      </div>
                    </div>

                    {/* Hub Details */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Export Hub Country:</span>
                        <span className="font-bold text-slate-800">{sup.country}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Trading Currency:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {sup.currency} (1 {sup.currency} = ${sup.exchangeRateToNzd} NZD)
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Avg Hub Dispatch SLA:</span>
                        <span className="font-bold text-slate-800">{sup.leadTimeDays} business days</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">ID: {sup.id}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSupplierId(sup.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
                    >
                      <span>View Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ================= SUPPLIERS TABLE VIEW ================= */
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Vendor &amp; ID</th>
                      <th className="p-4">Country &amp; Currency</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Lead Time</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Primary Contact</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredSuppliers.map((sup) => (
                      <tr key={sup.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-slate-900">{sup.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{sup.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{sup.country}</div>
                          <div className="font-mono text-[10px] text-slate-500">
                            {sup.currency} • Rate: {sup.exchangeRateToNzd}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-red-600">{sup.category}</span>
                        </td>
                        <td className="p-4 font-bold">{sup.leadTimeDays} days</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold text-amber-700">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{sup.rating.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{sup.contactPerson || "Operations Desk"}</div>
                          <div className="text-[11px] text-slate-400">{sup.contactEmail}</div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSupplierId(sup.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= FULL-WIDTH SUPPLIER DOSSIER VIEW ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Return Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedSupplierId("")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Supplier Directory</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-slate-500">ID: {activeSupplier.id}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">{activeSupplier.country} Hub</span>
              <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{activeSupplier.rating.toFixed(2)} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Supplier Dossier Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-md">
                {activeSupplier.country === "Japan" ? "JP" : activeSupplier.country === "Germany" ? "DE" : activeSupplier.country === "USA" ? "US" : "AU"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">{activeSupplier.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-slate-500">Contracted Global Supplier</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">{activeSupplier.name}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Primary export terminal facility located in {activeSupplier.country} with direct freight routing to New Zealand.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href="/procurement/queue"
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
              >
                <span>Process Quotes for Vendor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* KPI Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Trading Currency</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{activeSupplier.currency}</div>
              <p className="text-xs text-slate-500 mt-1">FX Rate: 1 {activeSupplier.currency} = ${activeSupplier.exchangeRateToNzd} NZD</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lead Time SLA</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{activeSupplier.leadTimeDays} <span className="text-sm font-normal text-slate-500">days</span></div>
              <p className="text-xs text-slate-500 mt-1">Average dispatch to export terminal</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Network Rating</span>
              <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{activeSupplier.rating.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Based on fitment accuracy &amp; speed</p>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">OEM Guarantee</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">99.1%</div>
              <p className="text-xs text-slate-500 mt-1">Verified Japanese &amp; European catalog match</p>
            </div>
          </div>

          {/* Details & Contacts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logistics & Hub Details */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Building2 className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Export Terminal &amp; Warehousing Facility
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Facility Location:</span>
                  <span className="font-bold text-slate-900">{activeSupplier.country} Authorized Export Facility</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Commercial Terms:</span>
                  <span className="font-bold text-slate-900">Net 30 Trade Account / Telegraphic Transfer</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Freight Routing:</span>
                  <span className="font-bold text-slate-900">Air Express &amp; Ocean Ro-Ro / FCL Consolidations</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Packaging Standards:</span>
                  <span className="font-bold text-slate-900">Heavy-duty export crate &amp; anti-corrosion barrier</span>
                </div>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Designated Operations &amp; Sourcing Contacts
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Representative</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{activeSupplier.contactPerson || "International Desk Manager"}</span>
                  </div>
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                {activeSupplier.contactEmail && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Export PO Email</span>
                      <a href={`mailto:${activeSupplier.contactEmail}`} className="font-bold text-red-600 hover:underline text-xs mt-0.5 block">
                        {activeSupplier.contactEmail}
                      </a>
                    </div>
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                {activeSupplier.contactPhone && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Wire / Terminal Phone</span>
                      <span className="font-mono font-bold text-slate-900 text-xs mt-0.5 block">{activeSupplier.contactPhone}</span>
                    </div>
                    <Phone className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REGISTER SUPPLIER MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Register International Wholesale Supplier
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Supplier / Company Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yokohama Parts Export Corp"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Country:</label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  >
                    <option value="Japan">Japan (JPY)</option>
                    <option value="Germany">Germany (EUR)</option>
                    <option value="USA">USA (USD)</option>
                    <option value="Australia">Australia (AUD)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Exchange Rate to NZD:</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Specialist Category:</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Lead Time (Days):</label>
                  <input
                    type="number"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Primary Contact Person:</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Kenji Takahashi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Official Sourcing Email:</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="orders@supplier.jp"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Direct Phone / WhatsApp:</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+81 52..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
