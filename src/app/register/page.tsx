"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Plus,
  Trash2,
  Clock,
  FileText,
  AlertCircle,
  Truck,
  Phone,
  Mail,
} from "lucide-react";
import { saveCustomers, getStoredCustomers } from "@/lib/store";
import { TradeCustomer } from "@/lib/types";

interface SavedAddress {
  id: string;
  label: string;
  street: string;
  suburb: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [appReference, setAppReference] = useState("");
  const [submissionTimestamp, setSubmissionTimestamp] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Business details
    legalBusinessName: "South Pacific Automotive Group Ltd",
    tradingName: "SP Motors Auckland",
    nzbn: "9429049988776",
    businessType: "INDEPENDENT_DEALER" as const,
    website: "https://spmotors.co.nz",
    branchesCount: 2,

    // Step 2: Contact details
    // Primary Contact
    primaryContactName: "David Campbell",
    primaryContactTitle: "Managing Director",
    primaryContactEmail: "david@spmotors.co.nz",
    primaryContactPhone: "+64 9 525 8890",
    // Accounts Contact
    accountsContactName: "Fiona Stewart",
    accountsContactEmail: "fiona@spmotors.co.nz",
    accountsContactPhone: "+64 9 525 8891",
    // Delivery Contact (Goods Inward)
    deliveryContactName: "Mark Robinson",
    deliveryContactPhone: "+64 21 884 9210",
    deliveryContactEmail: "workshop@spmotors.co.nz",
    deliveryNotes: "Deliver directly to Hoist Bay 3 / Goods Inward roller door on Church Street",

    // Step 3: Billing details
    billingAddress: "140 Church Street, Onehunga, Auckland 1061",
    gstNumber: "128-492-381",
    creditRequested: true,
    creditLimitRequestedNzd: 25000,

    // Step 4: Delivery details (Default + Saved Addresses)
    defaultDeliveryLabel: "Onehunga Main Service Depot (Default)",
    defaultDeliveryStreet: "140 Church Street",
    defaultDeliverySuburb: "Onehunga",
    defaultDeliveryCity: "Auckland",
    defaultDeliveryPostcode: "1061",

    // Step 5: Account setup & compliance
    accountEmail: "david@spmotors.co.nz",
    password: "Password123!",
    mfaEnabled: true,
    mfaType: "TOTP_AUTHENTICATOR",
    agreeTerms: true,
    agreePrivacy: true,
    termsVersion: "v2025.2",
  });

  // Additional Saved Delivery Addresses List
  const [additionalAddresses, setAdditionalAddresses] = useState<SavedAddress[]>([
    {
      id: "ADDR-2",
      label: "Penrose Express Collision Center",
      street: "45 Station Road",
      suburb: "Penrose",
      city: "Auckland",
      postcode: "1061",
      isDefault: false,
    },
  ]);

  const [newAddrLabel, setNewAddrLabel] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrSuburb, setNewAddrSuburb] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrPostcode, setNewAddrPostcode] = useState("");
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;

    const newAddr: SavedAddress = {
      id: `ADDR-${Date.now()}`,
      label: newAddrLabel || `Branch ${additionalAddresses.length + 2}`,
      street: newAddrStreet,
      suburb: newAddrSuburb,
      city: newAddrCity,
      postcode: newAddrPostcode,
      isDefault: false,
    };

    setAdditionalAddresses([...additionalAddresses, newAddr]);
    setNewAddrLabel("");
    setNewAddrStreet("");
    setNewAddrSuburb("");
    setNewAddrCity("");
    setNewAddrPostcode("");
    setShowAddAddressModal(false);
  };

  const handleRemoveAddress = (id: string) => {
    setAdditionalAddresses(additionalAddresses.filter((a) => a.id !== id));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toISOString();
    setSubmissionTimestamp(timestamp);

    const newCustomerId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const reference = `APP-NZBN-${formData.nzbn.slice(-6)}`;
    setAppReference(reference);

    const allDeliveryAddresses = [
      {
        id: "ADDR-DEFAULT",
        label: formData.defaultDeliveryLabel,
        street: formData.defaultDeliveryStreet,
        suburb: formData.defaultDeliverySuburb,
        city: formData.defaultDeliveryCity,
        postcode: formData.defaultDeliveryPostcode,
        isDefault: true,
      },
      ...additionalAddresses,
    ];

    const newCustomer: TradeCustomer = {
      id: newCustomerId,
      legalBusinessName: formData.legalBusinessName,
      tradingName: formData.tradingName,
      nzbn: formData.nzbn,
      businessType: formData.businessType,
      website: formData.website,
      branchesCount: Number(formData.branchesCount),
      primaryContact: {
        name: formData.primaryContactName,
        title: formData.primaryContactTitle,
        email: formData.primaryContactEmail,
        phone: formData.primaryContactPhone,
      },
      accountsContact: {
        name: formData.accountsContactName,
        email: formData.accountsContactEmail,
        phone: formData.accountsContactPhone,
      },
      deliveryAddresses: allDeliveryAddresses,
      billingDetails: {
        address: formData.billingAddress,
        gstNumber: formData.gstNumber,
        creditRequested: formData.creditRequested,
        creditLimitNzd: formData.creditRequested ? formData.creditLimitRequestedNzd : 0,
        creditAvailableNzd: 0,
        paymentTerms: "STRICT_PREPAYMENT",
        status: "PENDING_APPROVAL",
      },
      compliance: {
        termsVersion: formData.termsVersion,
        privacyPolicyConsentDate: timestamp,
        nzPrivacyActAcknowledged: true,
      },
    };

    const existing = getStoredCustomers();
    saveCustomers([newCustomer, ...existing]);

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEPS = [
    { num: 1, title: "Business Details", icon: Building2 },
    { num: 2, title: "Contacts", icon: Users },
    { num: 3, title: "Billing & GST", icon: CreditCard },
    { num: 4, title: "Delivery Hubs", icon: MapPin },
    { num: 5, title: "Compliance & MFA", icon: ShieldCheck },
  ];

  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top title */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Approved Trade Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Register for Procurly by Autohub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Exclusive global procurement and freight access for New Zealand automotive dealerships, panel repairers, and mechanical workshops.
          </p>
        </div>

        {/* Multi-step progress tracker */}
        {!submitted && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isCurrent = currentStep === s.num;
                const isDone = currentStep > s.num;
                return (
                  <div key={s.num} className="flex flex-col items-center flex-1 text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-autohub-navy text-white ring-4 ring-blue-100"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                        isCurrent ? "text-autohub-navy font-bold" : "text-slate-500"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Application Pending Verification
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Trade Registration Submitted Successfully
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.tradingName}</strong>. Your trade account application has been received and logged under reference{" "}
                <span className="font-mono font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded">
                  {appReference}
                </span>
                .
              </p>
            </div>

            {/* Verification Metadata summary card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left text-xs space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800">Compliance Capture Record</span>
                <span className="font-mono text-[10px] text-slate-500">
                  Timestamp: {submissionTimestamp || new Date().toISOString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">NZBN & Entity</span>
                  <span className="font-mono font-bold text-slate-800">{formData.nzbn}</span>
                  <span className="block text-[11px] text-slate-600 truncate">{formData.legalBusinessName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">GST Registration</span>
                  <span className="font-mono font-bold text-slate-800">{formData.gstNumber}</span>
                  <span className="block text-[11px] text-slate-600">Goods & Services Tax 15%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Primary & Accounts Contacts</span>
                  <span className="font-bold text-slate-800">{formData.primaryContactName}</span>
                  <span className="block text-[11px] text-slate-500">Accounts: {formData.accountsContactName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Delivery Contact (Goods Inward)</span>
                  <span className="font-bold text-slate-800">{formData.deliveryContactName}</span>
                  <span className="block text-[11px] text-slate-500 font-mono">{formData.deliveryContactPhone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold mb-1">
                  Saved Workshop Delivery Hubs ({1 + additionalAddresses.length})
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-3 h-3 text-autohub-red" />
                    <span>Default: {formData.defaultDeliveryLabel} ({formData.defaultDeliveryCity})</span>
                  </li>
                  {additionalAddresses.map((addr) => (
                    <li key={addr.id} className="flex items-center gap-1.5 pl-4 text-slate-500">
                      <span>• {addr.label} ({addr.city})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Terms: <strong>{formData.termsVersion}</strong></span>
                <span>Privacy Act 2020: <strong>Accepted</strong></span>
                <span>MFA: <strong>{formData.mfaEnabled ? "Configured" : "Optional"}</strong></span>
              </div>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-left text-xs space-y-1.5 max-w-xl mx-auto">
              <h4 className="font-bold text-autohub-navy flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-autohub-navy" />
                <span>Next Verification Steps</span>
              </h4>
              <p className="text-slate-600">
                1. <strong>Companies Office Validation:</strong> NZBN (<code>{formData.nzbn}</code>) is verified against the official New Zealand Companies Register.
              </p>
              <p className="text-slate-600">
                2. <strong>Trade Credit Assessment:</strong> Requested credit facility (${formData.creditLimitRequestedNzd.toLocaleString()} NZD) is reviewed by Autohub Finance.
              </p>
              <p className="text-slate-600">
                3. <strong>Portal Activation:</strong> Login activation email will be delivered to <code>{formData.accountEmail}</code> within 2 to 4 business hours.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-autohub-navy text-white text-xs font-bold rounded-xl shadow hover:bg-autohub-navy-dark transition"
              >
                Go to Sign In
              </Link>
              <Link
                href="/"
                className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Step-by-Step Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Step 1: Business Identification
                  </h3>
                  <span className="text-[11px] text-slate-500">Page 1 of 5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Legal Registered Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.legalBusinessName}
                      onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Trading / Dealership Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tradingName}
                      onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      NZBN (13-digit New Zealand Business Number) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={13}
                      value={formData.nzbn}
                      onChange={(e) => setFormData({ ...formData, nzbn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                    <span className="text-[10px] text-emerald-600 mt-1 block">
                      ✓ NZ Companies Office Verified Format
                    </span>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Business Classification *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none bg-white"
                    >
                      <option value="INDEPENDENT_DEALER">Independent Motor Vehicle Dealer</option>
                      <option value="FRANCHISED_DEALERSHIP">Franchised Dealership Group</option>
                      <option value="MECHANICAL_WORKSHOP">Automotive Mechanical Workshop</option>
                      <option value="PANEL_BEATER">Collision & Panel Repairer</option>
                      <option value="FLEET_OPERATOR">Commercial Fleet Operator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Company Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourdealership.co.nz"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Number of Operating Branches
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formData.branchesCount}
                      onChange={(e) => setFormData({ ...formData, branchesCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details (Primary, Accounts, Delivery) */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Step 2: Key Stakeholders & Operational Contacts
                  </h3>
                  <span className="text-[11px] text-slate-500">Page 2 of 5</span>
                </div>

                {/* Primary Contact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-autohub-navy font-bold text-xs">
                    <Users className="w-4 h-4 text-autohub-red" />
                    <span>1. Primary Trade Authoriser (Authorises Quotes & Orders)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.primaryContactName}
                        onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Job Title</label>
                      <input
                        type="text"
                        value={formData.primaryContactTitle}
                        onChange={(e) => setFormData({ ...formData, primaryContactTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.primaryContactEmail}
                        onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Direct Phone / Mobile *</label>
                      <input
                        type="tel"
                        required
                        value={formData.primaryContactPhone}
                        onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Accounts Payable Contact */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-autohub-navy font-bold text-xs">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>2. Accounts Payable Contact (Receives Invoices & Statements)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.accountsContactName}
                        onChange={(e) => setFormData({ ...formData, accountsContactName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Accounts Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.accountsContactEmail}
                        onChange={(e) => setFormData({ ...formData, accountsContactEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Accounts Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.accountsContactPhone}
                        onChange={(e) => setFormData({ ...formData, accountsContactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Contact (Goods Inward) */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-autohub-navy font-bold text-xs">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>3. Delivery / Goods Inward Contact (Receives Couriers & Containers)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Delivery Lead Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryContactName}
                        onChange={(e) => setFormData({ ...formData, deliveryContactName: e.target.value })}
                        placeholder="e.g. Mark Robinson (Head Technician)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Bay Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.deliveryContactPhone}
                        onChange={(e) => setFormData({ ...formData, deliveryContactPhone: e.target.value })}
                        placeholder="+64 21 000 0000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Workshop Email</label>
                      <input
                        type="email"
                        value={formData.deliveryContactEmail}
                        onChange={(e) => setFormData({ ...formData, deliveryContactEmail: e.target.value })}
                        placeholder="workshop@company.co.nz"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="text-xs">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Delivery Bay Special Instructions / Access Notes
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryNotes}
                      onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                      placeholder="e.g. Forklift on site, roller door open 7:30am - 5:00pm, tail-lift required for heavy pallets"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Billing & GST */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Step 3: Billing & Tax Compliance
                  </h3>
                  <span className="text-[11px] text-slate-500">Page 3 of 5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      NZ GST Registration Number (8 or 9 digits) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      placeholder="128-492-381"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Goods & Services Tax Act 1985 (15% GST Invoicing)
                    </span>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Billing Registered Address (for Tax Invoices) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Trade Credit Application Facility */}
                <div className="bg-blue-50/70 border border-blue-200 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-autohub-navy">
                        Apply for Autohub Trade Credit Account Facility
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Monthly trading terms (20th of the month following invoice) for instant order release without prepayments.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.creditRequested}
                      onChange={(e) => setFormData({ ...formData, creditRequested: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded"
                    />
                  </div>

                  {formData.creditRequested && (
                    <div className="pt-3 border-t border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Requested Monthly Credit Facility
                        </label>
                        <select
                          value={formData.creditLimitRequestedNzd}
                          onChange={(e) => setFormData({ ...formData, creditLimitRequestedNzd: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        >
                          <option value={10000}>$10,000 NZD (Small Workshop)</option>
                          <option value={25000}>$25,000 NZD (Standard Trade)</option>
                          <option value={50000}>$50,000 NZD (Multi-Hoist Center)</option>
                          <option value={100000}>$100,000 NZD (Dealership Group)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          Settlement Payment Terms
                        </label>
                        <div className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs">
                          20th of Month Following Invoice (Direct Credit)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Delivery Details (Default + Multiple Saved Addresses) */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Step 4: Default Delivery Hub & Saved Addresses
                  </h3>
                  <span className="text-[11px] text-slate-500">Page 4 of 5</span>
                </div>

                {/* Primary / Default Delivery Address */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-autohub-navy uppercase text-[11px] tracking-wider">
                      Default Workshop Delivery Depot
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Primary Destination
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Location Label *</label>
                    <input
                      type="text"
                      required
                      value={formData.defaultDeliveryLabel}
                      onChange={(e) => setFormData({ ...formData, defaultDeliveryLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.defaultDeliveryStreet}
                      onChange={(e) => setFormData({ ...formData, defaultDeliveryStreet: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Suburb</label>
                      <input
                        type="text"
                        value={formData.defaultDeliverySuburb}
                        onChange={(e) => setFormData({ ...formData, defaultDeliverySuburb: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.defaultDeliveryCity}
                        onChange={(e) => setFormData({ ...formData, defaultDeliveryCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={formData.defaultDeliveryPostcode}
                        onChange={(e) => setFormData({ ...formData, defaultDeliveryPostcode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Multiple Saved Delivery Addresses */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Additional Saved Delivery Hubs / Branches
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Save multiple delivery locations for quick dispatch during order checkout.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-3 py-1.5 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Saved Address</span>
                    </button>
                  </div>

                  {additionalAddresses.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                      No additional branch addresses added yet. Click &quot;Add Saved Address&quot; above if your business operates multiple hoists or satellite workshops.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {additionalAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{addr.label}</span>
                            <span className="text-slate-500 text-[11px]">
                              {addr.street}, {addr.suburb && `${addr.suburb}, `}{addr.city} {addr.postcode}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAddress(addr.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                            title="Remove address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline Modal / Expandable form to add address */}
                  {showAddAddressModal && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3 text-xs animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-autohub-navy">Add Additional Branch Location</span>
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Location Label (e.g. Christchurch Branch Depot)"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Street Address *"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Suburb"
                          value={newAddrSuburb}
                          onChange={(e) => setNewAddrSuburb(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City *"
                            value={newAddrCity}
                            onChange={(e) => setNewAddrCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Postcode"
                            value={newAddrPostcode}
                            onChange={(e) => setNewAddrPostcode(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddAddress}
                          className="px-4 py-1.5 rounded-xl bg-autohub-navy text-white font-bold hover:bg-autohub-navy-dark shadow"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Account Setup & Compliance Acceptance */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Step 5: Account Security & Compliance Acceptance
                  </h3>
                  <span className="text-[11px] text-slate-500">Page 5 of 5</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Portal Sign-In Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.accountEmail}
                      onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Secure Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* MFA Configuration */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="mfaCheckbox"
                      checked={formData.mfaEnabled}
                      onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <label htmlFor="mfaCheckbox" className="font-bold text-slate-800 block cursor-pointer">
                        Enable Multi-Factor Authentication (MFA Ready)
                      </label>
                      <p className="text-slate-500 text-[11px]">
                        Protects your trade credit line and requires TOTP or SMS verification when approving quotations exceeding $1,000 NZD.
                      </p>
                    </div>
                  </div>

                  {formData.mfaEnabled && (
                    <div className="pt-2 pl-7 flex gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mfaType"
                          value="TOTP_AUTHENTICATOR"
                          checked={formData.mfaType === "TOTP_AUTHENTICATOR"}
                          onChange={() => setFormData({ ...formData, mfaType: "TOTP_AUTHENTICATOR" })}
                          className="text-autohub-navy"
                        />
                        <span>Authenticator App (Google/Microsoft Authenticator)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mfaType"
                          value="SMS"
                          checked={formData.mfaType === "SMS"}
                          onChange={() => setFormData({ ...formData, mfaType: "SMS" })}
                          className="text-autohub-navy"
                        />
                        <span>SMS Direct Code</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Legal & NZ Privacy Act 2020 Checkboxes */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Accept Autohub Procurly Terms & Conditions ({formData.termsVersion}) *
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        I confirm that our business will abide by international procurement conditions, customs release guidelines, and payment gates. Read{" "}
                        <Link href="/terms" target="_blank" className="text-autohub-red underline">
                          Terms & Conditions
                        </Link>
                        .
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        New Zealand Privacy Act 2020 Compliance Acceptance *
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        I consent to the collection and handling of business contact, VIN, and shipping details strictly for customs declarations and delivery logistics. Version captured with timestamp upon submission.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Form Nav Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-autohub-navy hover:bg-autohub-navy-dark text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="submit-registration-form-button"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold transition shadow flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Application for Approval</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
