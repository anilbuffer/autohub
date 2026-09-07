"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Anchor,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Plane,
  Building2,
  Lock,
  Send,
  Sparkles,
} from "lucide-react";
import { ProcurlyLogo } from "./ProcurlyLogo";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (pathname === "/login" || pathname?.startsWith("/portal") || pathname?.startsWith("/procurement")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 4000);
      setEmailInput("");
    }
  };

  return (
    <footer className="bg-[#060a13] text-slate-400 text-xs border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* 1. Top Live Logistics Status & VOR Hotline Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-8 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              GLOBAL LOGISTICS NETWORK ACTIVE
            </span>
            <span className="text-slate-400 font-medium">
              • Air NZ Cargo (Tokyo ✈ AKL) &amp; Melbourne Depots Operating at Full Capacity
            </span>
          </div>

          <a
            href="tel:08002886482"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-300 hover:text-white hover:border-red-500/60 text-xs font-semibold transition self-start lg:self-auto"
          >
            <Phone className="w-3.5 h-3.5 text-red-400" />
            <span>24/7 VOR Parts Hotline: 0800 288 6482</span>
          </a>
        </div>

        {/* 2. Three Pillars / Guarantees Banner */}
        <div className="rounded-2xl bg-[#0b1222]/90 border border-slate-800/80 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          {/* Item 1 */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>100% Fitment Guaranteed</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Chassis and parts diagram cross-validation prior to overseas flight departure.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Landed NZD Pricing
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Consolidated single tax invoice including air freight, customs, MPI &amp; GST.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4 pt-4 md:pt-0 md:pl-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Door-to-Hoist Delivery
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rapid regional courier dispatch from Auckland &amp; Christchurch cross-dock depots.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Main Footer Links & Sourcing Lanes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pt-4">
          {/* Column 1: Brand & Alerts (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <ProcurlyLogo size="md" theme="dark" subtitle="by Autohub New Zealand Limited" />
              <span className="bg-red-950/60 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase ml-1">
                B2B TRADE
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Precision B2B automotive parts sourcing and global freight platform. Engineered exclusively for New Zealand franchised dealerships, commercial fleet operators, and certified collision workshops.
            </p>

            {/* Trade Stock & Freight Alerts Form */}
            <div className="pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>TRADE STOCK &amp; FREIGHT ALERTS</span>
              </label>
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter workshop work email..."
                  required
                  className="flex-1 bg-[#0c1322] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-autohub-red"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to alerts"
                  className="w-10 h-10 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white flex items-center justify-center transition shadow-md shadow-red-600/20 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {isSubscribed && (
                <span className="text-[11px] text-emerald-400 font-semibold block mt-1.5 animate-fadeIn">
                  ✓ Workshop email subscribed for trade alert dispatches.
                </span>
              )}
            </div>

            {/* Direct Contact */}
            <div className="space-y-1.5 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>0800 288 6482 (Toll Free NZ) / +64 9 525 6800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>procurement@procurly.autohub.co.nz</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              PLATFORM
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition">Overview</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition">How Procurly Works</Link>
              </li>
              <li>
                <Link href="/portal/new-request" className="hover:text-white transition flex items-center gap-1 text-red-400 font-semibold">
                  <span>Submit Part Request</span>
                  <span className="text-[10px]">↗</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">Register Trade Account</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">Trade Portal Sign In</Link>
              </li>
              <li>
                <Link href="/#heritage" className="hover:text-white transition">About Autohub Heritage</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Workflows (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              PORTALS &amp; WORKFLOWS
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/portal" className="hover:text-white transition">Dealer Portal</Link>
              </li>
              <li>
                <Link href="/portal/dashboard" className="hover:text-white transition">Procurement Console</Link>
              </li>
              <li>
                <Link href="/portal/logistics" className="hover:text-white transition">Operations &amp; Freight</Link>
              </li>
              <li>
                <Link href="/portal/invoices" className="hover:text-white transition">Finance &amp; Accounts</Link>
              </li>
              <li>
                <Link href="/portal/quotes" className="hover:text-white transition">Quote Comparison Matrix</Link>
              </li>
              <li>
                <Link href="/portal/requests/AH-P-000125" className="hover:text-white transition">Consignment Tracker</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Global Sourcing Lanes (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              GLOBAL SOURCING LANES
            </h4>

            <div className="space-y-2">
              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Plane className="w-3.5 h-3.5 text-sky-400" />
                  <span>Japan (Tokyo/Nagoya)</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                  Daily Express Flights
                </span>
              </div>

              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Plane className="w-3.5 h-3.5 text-sky-400" />
                  <span>Australia (Trans-Tasman)</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                  2-3 Business Days
                </span>
              </div>

              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Plane className="w-3.5 h-3.5 text-sky-400" />
                  <span>Europe &amp; UK OEM</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                  Priority Munich/Frankfurt
                </span>
              </div>

              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Anchor className="w-3.5 h-3.5 text-sky-400" />
                  <span>Consolidated Sea</span>
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 block mt-0.5">
                  Yokohama &amp; Tauranga Port
                </span>
              </div>
            </div>
          </div>

          {/* Column 5: NZ Logistics Hubs (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              NZ LOGISTICS HUBS
            </h4>

            <div className="space-y-2">
              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <h5 className="text-xs font-bold text-white">Auckland Central Hub</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  147 Neilson St, Penrose, Auckland
                </p>
              </div>

              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <h5 className="text-xs font-bold text-white">Christchurch Hub</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  55 Lunns Road, Middleton, CHC
                </p>
              </div>

              <div className="bg-[#0c1322] border border-slate-800/90 rounded-xl p-2.5 px-3">
                <h5 className="text-xs font-bold text-white">Wellington Depot</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  8 Seaview Road, Lower Hutt
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Compliance & Security Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">NZ Customs Service</span>
              <span className="text-[10px] text-slate-400 block">Bonded Importer of Record</span>
            </div>
          </div>

          <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">MPI Biosecurity</span>
              <span className="text-[10px] text-slate-400 block">Green-Lane Pre-Cleared</span>
            </div>
          </div>

          <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">MTA NZ Aligned</span>
              <span className="text-[10px] text-slate-400 block">Motor Trade Association</span>
            </div>
          </div>

          <div className="bg-[#0c1322] border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">256-Bit SSL Encrypted</span>
              <span className="text-[10px] text-slate-400 block">Bank-Grade Data Security</span>
            </div>
          </div>
        </div>

        {/* 5. Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Autohub Logistics Limited. All rights reserved. Procurly™ is a registered trademark.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-slate-300 transition">Terms of Trade</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-300 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition">Trade Credit Conditions</Link>
            <span>•</span>
            <span>NZBN: 9429038201048</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
