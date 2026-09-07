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
} from "lucide-react";
import { saveCustomers, getStoredCustomers } from "@/lib/store";
import { TradeCustomer } from "@/lib/types";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [appReference, setAppReference] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Business details
    legalBusinessName: "South Pacific Automotive Group Ltd",
    tradingName: "SP Motors Auckland",
    nzbn: "9429049988776",
    businessType: "INDEPENDENT_DEALER" as const,
    website: "https://spmotors.co.nz",
    branchesCount: 2,

    // Step 2: Contact details
    primaryContactName: "David Campbell",
    primaryContactTitle: "Managing Director",
    primaryContactEmail: "david@spmotors.co.nz",
    primaryContactPhone: "+64 9 525 8890",
    accountsContactName: "Fiona Stewart",
    accountsContactEmail: "fiona@spmotors.co.nz",
    accountsContactPhone: "+64 9 525 8891",

    // Step 3: Billing & GST
    billingAddress: "140 Church Street, Onehunga, Auckland 1061",
    gstNumber: "133-982-104",
    creditRequested: true,
    creditLimitRequestedNzd: 25000,

    // Step 4: Delivery details
    deliveryLabel: "Onehunga Main Service Depot",
    deliveryStreet: "140 Church Street",
    deliverySuburb: "Onehunga",
    deliveryCity: "Auckland",
    deliveryPostcode: "1061",

    // Step 5: Account setup & compliance
    accountEmail: "david@spmotors.co.nz",
    password: "Password123!",
    mfaEnabled: true,
    agreeTerms: true,
    agreePrivacy: true,
  });

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

    const newCustomerId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const reference = `APP-NZBN-${formData.nzbn.slice(-6)}`;
    setAppReference(reference);

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
      deliveryAddresses: [
        {
          id: `ADDR-${Date.now()}`,
          label: formData.deliveryLabel,
          street: formData.deliveryStreet,
          suburb: formData.deliverySuburb,
          city: formData.deliveryCity,
          postcode: formData.deliveryPostcode,
          isDefault: true,
        },
      ],
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
        termsVersion: "v2025.1",
        privacyPolicyConsentDate: new Date().toISOString(),
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
    { num: 4, title: "Delivery Hub", icon: MapPin },
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
          <p className="text-xs text-slate-600">
            Exclusive procurement and freight access for New Zealand automotive dealers and registered workshops.
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
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Application Pending Verification
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Registration Submitted Successfully
              </h2>
              <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.tradingName}</strong>. Your trade account application has been logged under reference{" "}
                <span className="font-mono font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded">
                  {appReference}
                </span>
                .
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <h4 className="font-bold text-slate-800 text-xs">What Happens Next?</h4>
              <p className="text-slate-600">
                1. Autohub Compliance team cross-checks your NZBN (<code>{formData.nzbn}</code>) against the New Zealand Companies Office register.
              </p>
              <p className="text-slate-600">
                2. Credit assessment will be completed for your requested ${formData.creditLimitRequestedNzd.toLocaleString()} NZD trade credit line.
              </p>
              <p className="text-slate-600">
                3. Your portal login credentials will be activated within 2-4 business hours.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/admin/customers"
                className="px-5 py-2.5 bg-autohub-navy text-white text-xs font-bold rounded-xl shadow hover:bg-autohub-navy-dark transition"
              >
                View in Admin Customer Queue (Staff Demo)
              </Link>
              <Link
                href="/portal"
                className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Go to Trade Portal Demo
              </Link>
            </div>
          </div>
        ) : (
          /* Step-by-Step Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  Step 1: Business Identification
                </h3>

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
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Business Classification
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
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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
                      value={formData.branchesCount}
                      onChange={(e) => setFormData({ ...formData, branchesCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  Step 2: Key Stakeholders & Contacts
                </h3>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 mb-2">
                  Primary contact receives quotations and authorization requests. Accounts contact receives monthly tax statements.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Contact Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.primaryContactName}
                      onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.primaryContactTitle}
                      onChange={(e) => setFormData({ ...formData, primaryContactTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.primaryContactEmail}
                      onChange={(e) => setFormData({ ...formData, primaryContactEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Primary Mobile / Direct Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.primaryContactPhone}
                      onChange={(e) => setFormData({ ...formData, primaryContactPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Accounts Payable Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Accounts Contact</label>
                      <input
                        type="text"
                        value={formData.accountsContactName}
                        onChange={(e) => setFormData({ ...formData, accountsContactName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Accounts Email</label>
                      <input
                        type="email"
                        value={formData.accountsContactEmail}
                        onChange={(e) => setFormData({ ...formData, accountsContactEmail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Accounts Phone</label>
                      <input
                        type="tel"
                        value={formData.accountsContactPhone}
                        onChange={(e) => setFormData({ ...formData, accountsContactPhone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Billing & GST */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  Step 3: Billing & Tax Compliance
                </h3>

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
                      placeholder="e.g. 128-492-381"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Billing Address (for Tax Invoices) *
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

                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-autohub-navy">
                        Apply for Autohub Trade Credit Facility
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Monthly account terms (20th of the month following invoice) for expedited order release.
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
                    <div className="pt-2 border-t border-blue-200">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Requested Monthly Credit Limit (NZD)
                      </label>
                      <select
                        value={formData.creditLimitRequestedNzd}
                        onChange={(e) => setFormData({ ...formData, creditLimitRequestedNzd: parseInt(e.target.value) })}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value={10000}>$10,000 NZD</option>
                        <option value={25000}>$25,000 NZD (Standard Trade)</option>
                        <option value={50000}>$50,000 NZD (Dealership Group)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Delivery Addresses */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  Step 4: Default Workshop Delivery Address
                </h3>

                <p className="text-xs text-slate-500">
                  Where our express couriers and sea container haulage will drop off imported vehicle consignments.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Depot / Workshop Location Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.deliveryLabel}
                      onChange={(e) => setFormData({ ...formData, deliveryLabel: e.target.value })}
                      placeholder="e.g. Main Hoist Bay / Goods Inward"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.deliveryStreet}
                      onChange={(e) => setFormData({ ...formData, deliveryStreet: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Suburb</label>
                      <input
                        type="text"
                        value={formData.deliverySuburb}
                        onChange={(e) => setFormData({ ...formData, deliverySuburb: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">City / Region *</label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={formData.deliveryPostcode}
                        onChange={(e) => setFormData({ ...formData, deliveryPostcode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Account Setup & Compliance */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-slate-900 border-b pb-2">
                  Step 5: Account Security & Compliance Acceptance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Portal Login Email *
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
                      Password *
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

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mfaEnabled}
                      onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Enable Multi-Factor Authentication (MFA Ready)
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Requires TOTP or SMS verification when approving quotations exceeding $1,000 NZD.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Accept Autohub Procurly Terms & Conditions (v2025.1) *
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        I confirm that our business will abide by international procurement conditions and payment gates.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                      className="w-4 h-4 text-autohub-navy rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">
                        New Zealand Privacy Act 2020 Compliance *
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Consent to the collection and handling of business contact and shipping details strictly for customs and delivery purposes.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
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
