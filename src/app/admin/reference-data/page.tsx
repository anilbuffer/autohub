"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Database,
  Building2,
  Boxes,
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Save,
  Globe,
  Plane,
  Anchor,
  Truck,
  DollarSign,
  Tag,
  Briefcase,
  Star,
} from "lucide-react";
import {
  getStoredBusinessTypes,
  saveBusinessTypes,
  updateBusinessType,
  addBusinessType,
  getStoredPartCategories,
  savePartCategories,
  updatePartCategory,
  addPartCategory,
  getStoredSuppliers,
  saveSuppliers,
  subscribeToStore,
} from "@/lib/store";
import {
  ReferenceBusinessType,
  ReferencePartCategory,
  SupplierProfile,
} from "@/lib/types";

export default function ReferenceDataManagementPage() {
  const [activeTab, setActiveTab] = useState<"BUSINESS_TYPES" | "PART_CATEGORIES" | "SUPPLIERS">("BUSINESS_TYPES");
  const [businessTypes, setBusinessTypes] = useState<ReferenceBusinessType[]>([]);
  const [partCategories, setPartCategories] = useState<ReferencePartCategory[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>([]);
  const [search, setSearch] = useState("");

  // Modals
  const [btModalOpen, setBtModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [supModalOpen, setSupModalOpen] = useState(false);

  const [editingBt, setEditingBt] = useState<ReferenceBusinessType | null>(null);
  const [editingCat, setEditingCat] = useState<ReferencePartCategory | null>(null);
  const [editingSup, setEditingSup] = useState<SupplierProfile | null>(null);

  // Form states
  const [btForm, setBtForm] = useState({
    code: "",
    name: "",
    description: "",
    defaultCreditLimitNzd: 25000,
    isActive: true,
  });

  const [catForm, setCatForm] = useState({
    code: "",
    name: "",
    description: "",
    defaultFreightMode: "AIR_EXPRESS" as "AIR_EXPRESS" | "SEA_FREIGHT",
    customsTariffCode: "",
    isActive: true,
  });

  const [supForm, setSupForm] = useState({
    name: "",
    country: "Japan",
    currency: "JPY",
    exchangeRateToNzd: 0.0108,
    category: "Japanese OEM Genuine",
    leadTimeDays: 2,
    rating: 4.9,
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });

  const refresh = () => {
    setBusinessTypes(getStoredBusinessTypes());
    setPartCategories(getStoredPartCategories());
    setSuppliers(getStoredSuppliers());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
    });
    return unsub;
  }, []);

  // Filtered
  const filteredBT = businessTypes.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCat = partCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.customsTariffCode.includes(search)
  );

  const filteredSup = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  // Business Type Handlers
  const handleOpenCreateBT = () => {
    setEditingBt(null);
    setBtForm({
      code: "",
      name: "",
      description: "",
      defaultCreditLimitNzd: 25000,
      isActive: true,
    });
    setBtModalOpen(true);
  };

  const handleOpenEditBT = (bt: ReferenceBusinessType) => {
    setEditingBt(bt);
    setBtForm({
      code: bt.code,
      name: bt.name,
      description: bt.description,
      defaultCreditLimitNzd: bt.defaultCreditLimitNzd,
      isActive: bt.isActive,
    });
    setBtModalOpen(true);
  };

  const handleSaveBT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!btForm.code.trim() || !btForm.name.trim()) return;

    if (editingBt) {
      updateBusinessType(editingBt.id, {
        code: btForm.code.trim(),
        name: btForm.name.trim(),
        description: btForm.description.trim(),
        defaultCreditLimitNzd: btForm.defaultCreditLimitNzd,
        isActive: btForm.isActive,
      });
    } else {
      addBusinessType({
        code: btForm.code.trim(),
        name: btForm.name.trim(),
        description: btForm.description.trim(),
        defaultCreditLimitNzd: btForm.defaultCreditLimitNzd,
        isActive: btForm.isActive,
      });
    }
    setBtModalOpen(false);
  };

  const handleToggleBT = (bt: ReferenceBusinessType) => {
    updateBusinessType(bt.id, { isActive: !bt.isActive });
  };

  // Part Category Handlers
  const handleOpenCreateCat = () => {
    setEditingCat(null);
    setCatForm({
      code: "",
      name: "",
      description: "",
      defaultFreightMode: "AIR_EXPRESS",
      customsTariffCode: "8708.29.00",
      isActive: true,
    });
    setCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: ReferencePartCategory) => {
    setEditingCat(cat);
    setCatForm({
      code: cat.code,
      name: cat.name,
      description: cat.description,
      defaultFreightMode: cat.defaultFreightMode,
      customsTariffCode: cat.customsTariffCode,
      isActive: cat.isActive,
    });
    setCatModalOpen(true);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.code.trim() || !catForm.name.trim()) return;

    if (editingCat) {
      updatePartCategory(editingCat.id, {
        code: catForm.code.trim(),
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        defaultFreightMode: catForm.defaultFreightMode,
        customsTariffCode: catForm.customsTariffCode.trim(),
        isActive: catForm.isActive,
      });
    } else {
      addPartCategory({
        code: catForm.code.trim(),
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        defaultFreightMode: catForm.defaultFreightMode,
        customsTariffCode: catForm.customsTariffCode.trim(),
        isActive: catForm.isActive,
      });
    }
    setCatModalOpen(false);
  };

  const handleToggleCat = (cat: ReferencePartCategory) => {
    updatePartCategory(cat.id, { isActive: !cat.isActive });
  };

  // Supplier Handlers
  const handleOpenCreateSup = () => {
    setEditingSup(null);
    setSupForm({
      name: "",
      country: "Japan",
      currency: "JPY",
      exchangeRateToNzd: 0.0108,
      category: "Japanese OEM Genuine",
      leadTimeDays: 2,
      rating: 4.9,
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
    });
    setSupModalOpen(true);
  };

  const handleOpenEditSup = (s: SupplierProfile) => {
    setEditingSup(s);
    setSupForm({
      name: s.name,
      country: s.country,
      currency: s.currency,
      exchangeRateToNzd: s.exchangeRateToNzd,
      category: s.category,
      leadTimeDays: s.leadTimeDays,
      rating: s.rating,
      contactPerson: s.contactPerson || "",
      contactEmail: s.contactEmail || "",
      contactPhone: s.contactPhone || "",
    });
    setSupModalOpen(true);
  };

  const handleSaveSup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supForm.name.trim()) return;

    const currentSups = getStoredSuppliers();
    if (editingSup) {
      const updated = currentSups.map((s) =>
        s.id === editingSup.id ? { ...s, ...supForm } : s
      );
      saveSuppliers(updated);
    } else {
      const newSup: SupplierProfile = {
        ...supForm,
        id: `SUP-${Date.now().toString().slice(-3)}`,
      };
      saveSuppliers([...currentSups, newSup]);
    }
    setSupModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Enterprise Data Dictionaries
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Master Reference Data Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer core taxonomies: New Zealand trade business types, vehicle part classifications with customs tariffs, and global verified suppliers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "BUSINESS_TYPES" && (
            <button
              type="button"
              onClick={handleOpenCreateBT}
              className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Business Type</span>
            </button>
          )}

          {activeTab === "PART_CATEGORIES" && (
            <button
              type="button"
              onClick={handleOpenCreateCat}
              className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Part Category</span>
            </button>
          )}

          {activeTab === "SUPPLIERS" && (
            <button
              type="button"
              onClick={handleOpenCreateSup}
              className="px-4 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Global Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Symmetrical 4-Stat KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Business Types
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {businessTypes.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Automotive trade client classifications
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Part Categories
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {partCategories.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            With HS tariff &amp; air/sea defaults
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Verified Global Suppliers
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {suppliers.length}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Japan, Europe &amp; United States hubs
          </span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Currency Feeds
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono">
            4 <span className="text-xs font-sans text-slate-500 font-normal">Active</span>
          </div>
          <span className="text-[11px] text-slate-500 block">
            JPY 0.0108 • EUR 1.82 • USD 1.68 • NZD
          </span>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("BUSINESS_TYPES")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "BUSINESS_TYPES"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#ed2025]" />
            <span>Business Types ({businessTypes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PART_CATEGORIES")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "PART_CATEGORIES"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-[#ed2025]" />
            <span>Part Categories ({partCategories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SUPPLIERS")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "SUPPLIERS"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#ed2025]" />
            <span>Suppliers Directory ({suppliers.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/60 focus:bg-white transition outline-none"
          />
        </div>
      </div>

      {/* ================= TAB 1: BUSINESS TYPES ================= */}
      {activeTab === "BUSINESS_TYPES" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Automotive Trade Business Classifications
            </h3>
            <span className="text-xs text-slate-500">NZ Automotive Industry Association Mappings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">System Code</th>
                  <th className="py-3 px-4">Display Label</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Default Credit Baseline</th>
                  <th className="py-3 px-4">Registered Accounts</th>
                  <th className="py-3 px-4">Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBT.map((bt) => (
                  <tr key={bt.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{bt.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{bt.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs">{bt.description}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${bt.defaultCreditLimitNzd?.toLocaleString()} NZD
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{bt.customerCount} Accounts</td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleBT(bt)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          bt.isActive ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                            bt.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBT(bt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PART CATEGORIES ================= */}
      {activeTab === "PART_CATEGORIES" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Vehicle Parts Taxonomies &amp; Tariff Codes
            </h3>
            <span className="text-xs text-slate-500">NZ Customs Service Harmonized Tariff Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Category Code</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Default Freight</th>
                  <th className="py-3 px-4">Customs Tariff HS Code</th>
                  <th className="py-3 px-4">Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCat.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cat.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{cat.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs">{cat.description}</td>
                    <td className="py-3.5 px-4">
                      {cat.defaultFreightMode === "AIR_EXPRESS" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          <Plane className="w-3 h-3" />
                          <span>Air Express</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                          <Anchor className="w-3 h-3" />
                          <span>Sea Freight</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold">
                      {cat.customsTariffCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleCat(cat)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          cat.isActive ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                            cat.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCat(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SUPPLIERS ================= */}
      {activeTab === "SUPPLIERS" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-fadeIn">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Verified Global Parts Suppliers
            </h3>
            <span className="text-xs text-slate-500">Live Currency Rates &amp; Lead Times</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Supplier Partner</th>
                  <th className="py-3 px-4">Country &amp; Currency</th>
                  <th className="py-3 px-4">Exchange Rate to NZD</th>
                  <th className="py-3 px-4">Specialty Category</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Primary Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredSup.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {s.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{s.country}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">({s.currency})</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {s.exchangeRateToNzd}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{s.category}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{s.leadTimeDays} Days</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">★ {s.rating}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span>{s.contactPerson || "—"}</span>
                      {s.contactEmail && (
                        <span className="text-[10px] text-slate-400 block truncate">{s.contactEmail}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditSup(s)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT BUSINESS TYPE ================= */}
      {btModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingBt ? "Edit Business Type" : "Add Automotive Business Type"}
              </h3>
              <button
                type="button"
                onClick={() => setBtModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBT} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">System Code (UPPERCASE)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MOTORCYCLE_DEALER"
                  value={btForm.code}
                  onChange={(e) => setBtForm({ ...btForm, code: e.target.value.toUpperCase().replace(/\s+/g, "_") })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Licensed Motorcycle Dealership"
                  value={btForm.name}
                  onChange={(e) => setBtForm({ ...btForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Business description and industry classification..."
                  value={btForm.description}
                  onChange={(e) => setBtForm({ ...btForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Default Credit Limit ($NZD)</label>
                <input
                  type="number"
                  step="5000"
                  value={btForm.defaultCreditLimitNzd}
                  onChange={(e) => setBtForm({ ...btForm, defaultCreditLimitNzd: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBtModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow"
                >
                  Save Business Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT PART CATEGORY ================= */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCat ? "Edit Part Category" : "Add Vehicle Part Category"}
              </h3>
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCat} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Code (UPPERCASE)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EXHAUST_EMIS"
                  value={catForm.code}
                  onChange={(e) => setCatForm({ ...catForm, code: e.target.value.toUpperCase().replace(/\s+/g, "_") })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exhaust &amp; Catalytic Converters"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Parts included in this category..."
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Default Freight Mode</label>
                  <select
                    value={catForm.defaultFreightMode}
                    onChange={(e) => setCatForm({ ...catForm, defaultFreightMode: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none bg-white font-medium"
                  >
                    <option value="AIR_EXPRESS">Air Express (Priority)</option>
                    <option value="SEA_FREIGHT">Sea Freight (Consolidated)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customs Tariff HS Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8708.92.00"
                    value={catForm.customsTariffCode}
                    onChange={(e) => setCatForm({ ...catForm, customsTariffCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono outline-none focus:border-[#ed2025]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT SUPPLIER ================= */}
      {supModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSup ? "Edit Supplier Partner" : "Add Global Supplier Partner"}
              </h3>
              <button
                type="button"
                onClick={() => setSupModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSup} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Osaka OEM Parts Direct K.K."
                  value={supForm.name}
                  onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#ed2025]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={supForm.country}
                    onChange={(e) => setSupForm({ ...supForm, country: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Currency Code</label>
                  <input
                    type="text"
                    required
                    value={supForm.currency}
                    onChange={(e) => setSupForm({ ...supForm, currency: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Exchange Rate to NZD</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={supForm.exchangeRateToNzd}
                    onChange={(e) => setSupForm({ ...supForm, exchangeRateToNzd: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialty Category</label>
                  <input
                    type="text"
                    required
                    placeholder="Japanese Genuine OEM"
                    value={supForm.category}
                    onChange={(e) => setSupForm({ ...supForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Avg Lead Time (Days)</label>
                  <input
                    type="number"
                    required
                    value={supForm.leadTimeDays}
                    onChange={(e) => setSupForm({ ...supForm, leadTimeDays: parseInt(e.target.value) || 2 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Kenji Takahashi"
                    value={supForm.contactPerson}
                    onChange={(e) => setSupForm({ ...supForm, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="sales@osakaoem.jp"
                    value={supForm.contactEmail}
                    onChange={(e) => setSupForm({ ...supForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSupModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white font-bold transition shadow"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
