"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Plane,
  Anchor,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Search,
  Zap,
  Globe,
  Truck,
  Building2,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { AISmartSearch } from "@/components/AISmartSearch";

export default function HomePage() {
  const router = useRouter();
  const [quickRef, setQuickRef] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRef.trim()) return;
    const cleanRef = quickRef.trim().toUpperCase();
    router.push(`/portal/requests/${cleanRef}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-autohub-navy-dark via-autohub-navy to-slate-900 text-white py-16 lg:py-24 border-b border-blue-900/50">
        {/* Subtle decorative background grids & glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-autohub-red/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-autohub-red animate-pulse" />
                <span>Next-Gen Procurement & Logistics for NZ Automotive Trade</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Door-to-Door Automotive Parts{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-200">
                  Procurement & Freight
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Autohub acts as your <strong>Coordination Layer, Procurement Facilitator, and Logistics Enabler</strong>. Replace fragmented emails, spreadsheets, WeChat messages, and multiple freight agents with one intelligent door-to-door platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  id="hero-request-part-button"
                  href="/portal/new-request"
                  className="px-6 py-3.5 rounded-2xl bg-autohub-red hover:bg-autohub-red-dark text-white font-bold text-sm shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 group"
                >
                  <span>Submit Part Request</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-autohub-red" />
                  <span>Register Trade Account (NZBN)</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Approved Trade Only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Air & Sea Logistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>NZ Customs Handled</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Quick Tracker & Search Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-autohub-red flex items-center justify-center text-white">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Quick Order Tracker</h3>
                      <p className="text-[11px] text-slate-300">
                        Live lifecycle visibility across all 15 stages
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={quickRef}
                      onChange={(e) => setQuickRef(e.target.value)}
                      placeholder="Enter Reference (e.g. AH-P-000123)"
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-sm text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition uppercase font-mono tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
                  >
                    <span>Track Consignment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Demo Quick Links */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-2">
                    Explore Demo Trade Requests:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/portal/requests/AH-P-000123"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-left"
                    >
                      <span className="font-mono text-[11px] text-autohub-red font-bold block">
                        AH-P-000123
                      </span>
                      <span className="text-[11px] text-slate-200 block truncate">
                        Toyota Hiace Arm
                      </span>
                      <span className="text-[10px] text-amber-300 font-semibold block">
                        Awaiting Payment
                      </span>
                    </Link>

                    <Link
                      href="/portal/requests/AH-P-000125"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition text-left"
                    >
                      <span className="font-mono text-[11px] text-autohub-red font-bold block">
                        AH-P-000125
                      </span>
                      <span className="text-[11px] text-slate-200 block truncate">
                        Ford Ranger Turbo
                      </span>
                      <span className="text-[10px] text-sky-300 font-semibold block">
                        In Flight Transit
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Semantic Search Preview Widget */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-xs">
                <span className="text-slate-300 text-[11px] font-medium block mb-2">
                  Looking for parts history or benchmarks?
                </span>
                <AISmartSearch placeholder="Semantic search: 'Leaf inverter', 'CX-5 headlight'..." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Clarification: "Not a Catalogue" */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3 py-1 rounded-full border border-red-100">
              The Procurly Operating Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Why Procurly is NOT an Online Parts Retailer or Catalogue
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Traditional online parts catalogues sell only what sits in local storage or fixed inventories. Autohub functions as an intelligent global procurement and logistics coordination service for trade professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-600">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    The Fragmented Legacy Method
                  </h3>
                  <p className="text-xs text-slate-500">Emails, WeChat, Excel, and Multi-Carrier Chasing</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Trade customers email 4 different suppliers with blurry photos hoping for stock.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Hidden exchange rates, unexpected port handling fees, and surprise customs GST.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Parts get stuck in MPI bio-security holds without customs entries.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>Vehicles sit stranded on hoists costing dealerships hundreds per day.</span>
                </li>
              </ul>
            </div>

            {/* The Procurly Way */}
            <div className="bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-autohub-navy/10 rounded-full blur-2xl" />

              <div className="flex items-center gap-3 text-autohub-navy">
                <div className="w-10 h-10 rounded-2xl bg-autohub-navy text-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-autohub-red" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    The Procurly Coordination Layer
                  </h3>
                  <p className="text-xs text-autohub-navy font-semibold">One Request • Transparent Landed Cost • Guaranteed Delivery</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Sourcing Desk:</strong> Autohub coordinates directly across Japan, Europe, Australia, and USA genuine networks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Landed Cost Certainty:</strong> One transparent quotation in NZD covering foreign purchase, margin, freight, and 15% GST.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Freight Choice:</strong> Select Air Express (3-5 business days) or Sea Freight Consolidated based on customer urgency.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>End-to-End Tracking:</strong> Autohub manages export packing, international flight/vessel, customs clearance, and courier delivery.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Customer Workflow */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-navy bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Clear 9-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              How the End-to-End Workflow Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every request receives a sequential reference (e.g. <code>AH-P-000123</code>) and is tracked live from hoist enquiry to doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Register & Verify",
                desc: "Approved automotive dealers and trade workshops register with NZBN, workshop branches, and billing credentials.",
                icon: Building2,
              },
              {
                step: "02",
                title: "Submit Part Request",
                desc: "Provide vehicle Make, Model, Year, VIN/chassis, part name, OEM preference, and photos with instant AI cost estimates.",
                icon: Car,
              },
              {
                step: "03",
                title: "Global Sourcing",
                desc: "Autohub Sourcing Desk queries verified overseas suppliers in Japan, Germany, USA, and Australia.",
                icon: Globe,
              },
              {
                step: "04",
                title: "Quote & Freight Options",
                desc: "Receive landed cost quotation with side-by-side Air Express (3-5 days) and Sea Freight (14-18 days) pricing.",
                icon: Plane,
              },
              {
                step: "05",
                title: "Customer Approval",
                desc: "Review quote details, select desired freight method, and confirm order with 1 click.",
                icon: CheckCircle2,
              },
              {
                step: "06",
                title: "Payment Gate",
                desc: "Clear via direct bank transfer or approved trade credit line. Unlocks immediate procurement release.",
                icon: ShieldCheck,
              },
              {
                step: "07",
                title: "Overseas Dispatch",
                desc: "Part purchased from supplier, inspected, packed at Autohub export terminal, and manifested onto flight/vessel.",
                icon: Anchor,
              },
              {
                step: "08",
                title: "NZ Customs & MPI",
                desc: "Autohub clears New Zealand customs duty, biosecurity inspection, and tariffs with zero trade friction.",
                icon: ShieldCheck,
              },
              {
                step: "09",
                title: "Doorstep Delivery",
                desc: "Local express courier dispatches directly to your workshop bay or parts store with POD signature.",
                icon: Truck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-autohub-navy/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-autohub-red font-mono">
                        {item.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-14 bg-gradient-to-r from-autohub-navy to-autohub-navy-dark text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Streamline Your Workshop Parts Procurement?
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of New Zealand dealerships, panel beaters, and commercial fleet operators sourcing hard-to-find vehicle parts with door-to-door confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/portal/new-request"
              className="px-6 py-3 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-lg transition"
            >
              Submit Part Request
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-white text-autohub-navy hover:bg-slate-100 text-xs font-bold shadow transition"
            >
              Apply for Trade Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
