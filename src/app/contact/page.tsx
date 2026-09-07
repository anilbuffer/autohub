"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  ArrowRight,
  Headphones,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    nzbn: "",
    email: "",
    phone: "",
    inquiryType: "TRADE_ACCOUNT",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketRef(ref);
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
            Contact & Support
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Autohub Procurement Coordination Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our trade logistics specialists in Auckland and Christchurch assist approved automotive dealers, independent repairers, and commercial fleet managers across New Zealand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Contacts & Operations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                New Zealand Operations
              </h3>

              <div className="space-y-5 text-xs">
                {/* Auckland Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-autohub-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Auckland Head Office</span>
                    <span className="text-slate-600 block mt-0.5 leading-relaxed">
                      Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      MPI Approved Transitional Facility & Return Depot
                    </span>
                  </div>
                </div>

                {/* Christchurch Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-autohub-navy flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">Christchurch Logistics Depot</span>
                    <span className="text-slate-600 block mt-0.5 leading-relaxed">
                      112 Blenheim Road, Riccarton, Christchurch 8041
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      South Island Express Courier Consolidation
                    </span>
                  </div>
                </div>

                {/* Direct Hotline */}
                <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Trade Desk Hotline</span>
                    <a href="tel:+6492745422" className="text-sm font-bold text-autohub-red hover:underline font-mono">
                      +64 9 274 5422
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Trade Inquiries & Quotations</span>
                    <a href="mailto:procurement@autohub.co.nz" className="text-xs text-autohub-navy font-semibold hover:underline">
                      procurement@autohub.co.nz
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Operating Hours</span>
                    <span className="text-slate-600 block mt-0.5">Monday – Friday: 7:30 AM – 5:30 PM NZST</span>
                    <span className="text-emerald-700 font-semibold text-[11px] block mt-0.5">
                      Emergency AOG / hoist-standstill line available for approved accounts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Registration Callout */}
            <div className="bg-gradient-to-br from-autohub-navy to-slate-900 text-white rounded-3xl p-6 border border-slate-700 shadow-sm space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2 text-white">
                <Building2 className="w-4 h-4 text-autohub-red" />
                <span>Need a Fast-Track Trade Account?</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Registered New Zealand workshops and dealerships can apply online with their NZBN in under 3 minutes for immediate credit line assessment.
              </p>
              <div className="pt-1">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow"
                >
                  <span>Open Trade Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Enquiry Logged Successfully
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-3">
                      Thank You, {formData.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                      Your trade enquiry has been assigned ticket reference{" "}
                      <span className="font-mono font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded">
                        {ticketRef}
                      </span>
                      . A dedicated logistics specialist from our Auckland Trade Desk will respond within 2 business hours.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-1 text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Enquiry Summary</span>
                    <p>• Business: {formData.businessName || "Trade Client"}</p>
                    <p>• Contact Phone: {formData.phone}</p>
                    <p>• Department: {formData.inquiryType.replace("_", " ")}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 bg-autohub-navy text-white text-xs font-bold rounded-xl hover:bg-autohub-navy-dark transition shadow"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Send Enquiry to Trade Desk
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Direct transmission to Auckland & Christchurch parts logistics teams.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Marcus Reid"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Business / Dealership Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Apex Motors Penrose"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="marcus@apexmotors.co.nz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Mobile / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+64 21 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        NZBN (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.nzbn}
                        onChange={(e) => setFormData({ ...formData, nzbn: e.target.value })}
                        placeholder="942904..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Department / Inquiry Purpose *
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    >
                      <option value="TRADE_ACCOUNT">Trade Account Application & Credit Facility</option>
                      <option value="URGENT_SOURCING">Urgent Vehicle Part Sourcing Desk (AOG / Hoist Standstill)</option>
                      <option value="LOGISTICS_CUSTOMS">Logistics, Flight Milestones & NZ Customs Clearance</option>
                      <option value="BILLING_GST">Accounts, Tax Statements & 15% GST Invoicing</option>
                      <option value="GENERAL">General Automotive Trade Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Vehicle Details / Inquiry Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include vehicle Make, Model, Year, VIN/Chassis code (if known), and part descriptions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-7 py-3 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl font-bold transition shadow flex items-center justify-center gap-2 text-xs"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Enquiry to Trade Desk</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
