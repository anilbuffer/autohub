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
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    workshopName: "",
    email: "",
    phone: "",
    inquiryTopic: "Trade Account Application & Credit Limits",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `AH-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketRef(ref);
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-[11px] font-extrabold uppercase tracking-wider text-autohub-red">
            <Building2 className="w-3.5 h-3.5 text-autohub-red" />
            <span>DIRECT SUPPORT &amp; REGIONAL HUBS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connect with the Autohub Parts Procurement Team
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Speak with our dedicated automotive parts sourcing desk or visit our nationwide New Zealand distribution centres.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dark Support Card & White Regional Depots Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card 1: Trade Support & Inquiries (Dark Card) */}
            <div className="bg-[#0c1322] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Trade Support &amp; Inquiries
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Our parts specialists are available Monday to Friday to assist with urgent hoists, VIN fitment confirmation, and custom shipping requirements.
                </p>
              </div>

              <div className="space-y-4 pt-1 text-xs">
                {/* Toll-Free Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-autohub-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Toll-Free Phone
                    </span>
                    <a
                      href="tel:08002886482"
                      className="text-sm font-bold text-white hover:text-rose-400 transition block font-mono mt-0.5"
                    >
                      0800 288 6482
                    </a>
                    <span className="text-xs text-slate-400 font-mono block">
                      Direct: +64 9 525 6800
                    </span>
                  </div>
                </div>

                {/* Direct Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-autohub-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Direct Email
                    </span>
                    <a
                      href="mailto:procurement@procurly.autohub.co.nz"
                      className="text-xs font-semibold text-slate-300 hover:text-white transition underline underline-offset-2 block mt-0.5"
                    >
                      procurement@procurly.autohub.co.nz
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-autohub-red flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      Operating Hours
                    </span>
                    <span className="text-xs text-slate-300 block mt-0.5">
                      Mon - Fri: 7:30 AM - 5:30 PM NZST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Regional Depot Locations (Clean White Card) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5">
                REGIONAL DEPOT LOCATIONS
              </h3>

              <div className="space-y-4 text-xs">
                {/* Auckland Hub */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Auckland Hub
                    </span>
                    <span className="text-slate-500 block text-[11px] leading-relaxed">
                      142 Neilson St, Penrose, Auckland 1061
                    </span>
                  </div>
                </div>

                {/* Christchurch Hub */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Christchurch Hub
                    </span>
                    <span className="text-slate-500 block text-[11px] leading-relaxed">
                      55 Lunns Road, Middleton, Christchurch 8024
                    </span>
                  </div>
                </div>

                {/* Wellington Hub */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Wellington Hub
                    </span>
                    <span className="text-slate-500 block text-[11px] leading-relaxed">
                      8 Seaview Road, Lower Hutt, 5010
                    </span>
                  </div>
                </div>

                {/* Tauranga Hub */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Tauranga Hub
                    </span>
                    <span className="text-slate-500 block text-[11px] leading-relaxed">
                      Hull Road, Mount Maunganui 3116
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send an Online Inquiry Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                      Inquiry Logged Successfully
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                      Thank You, {formData.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Your trade inquiry has been registered under ticket reference{" "}
                      <span className="font-mono font-bold text-autohub-navy bg-slate-100 px-2 py-0.5 rounded">
                        {ticketRef}
                      </span>
                      . Our Auckland and Christchurch sourcing desk will respond within 2 business hours.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left max-w-md mx-auto space-y-1.5 text-slate-600">
                    <span className="font-bold text-slate-900 block mb-1">Inquiry Details</span>
                    <p>• Workshop: <span className="font-semibold text-slate-800">{formData.workshopName || "Direct Trade Client"}</span></p>
                    <p>• Contact Phone: <span className="font-semibold text-slate-800">{formData.phone}</span></p>
                    <p>• Topic: <span className="font-semibold text-slate-800">{formData.inquiryTopic}</span></p>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Send an Online Inquiry
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Fill out the details below and our team will get back to you within 2 business hours.
                    </p>
                  </div>

                  {/* Row 1: Full Name & Workshop Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                        YOUR FULL NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. Marcus Henderson"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                        WORKSHOP / BUSINESS NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.workshopName}
                        onChange={(e) =>
                          setFormData({ ...formData, workshopName: e.target.value })
                        }
                        placeholder="e.g. Apex Auto Specialists"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address & Phone / Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="marcus@apexauto.co.nz"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                        PHONE / MOBILE *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="021 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 3: Inquiry Topic */}
                  <div>
                    <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                      INQUIRY TOPIC *
                    </label>
                    <select
                      value={formData.inquiryTopic}
                      onChange={(e) =>
                        setFormData({ ...formData, inquiryTopic: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition cursor-pointer"
                    >
                      <option value="Trade Account Application & Credit Limits">
                        Trade Account Application &amp; Credit Limits
                      </option>
                      <option value="Urgent Part Sourcing / VOR Hoist Standstill">
                        Urgent Part Sourcing / VOR Hoist Standstill
                      </option>
                      <option value="Freight Tracking & Flight Milestone Inquiries">
                        Freight Tracking &amp; Flight Milestone Inquiries
                      </option>
                      <option value="Landed Pricing & Quotation Requests">
                        Landed Pricing &amp; Quotation Requests
                      </option>
                      <option value="Consolidated Billing & GST Tax Invoices">
                        Consolidated Billing &amp; GST Tax Invoices
                      </option>
                      <option value="General Trade Support & Direct Logistics">
                        General Trade Support &amp; Direct Logistics
                      </option>
                    </select>
                  </div>

                  {/* Row 4: Message / Part Details */}
                  <div>
                    <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 block mb-1.5">
                      MESSAGE / PART DETAILS *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us what you're looking for, including any vehicle VINs or parts questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/25 transition duration-150 flex items-center justify-center gap-2"
                    >
                      <span>Send Inquiry to Autohub Desk</span>
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
