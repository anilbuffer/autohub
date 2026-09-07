import React from "react";
import Link from "next/link";
import { ShieldCheck, Anchor, Plane, Award, Globe, Building2, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3 py-1 rounded-full border border-red-100">
            About Procurly & Autohub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Logistics Backbone of New Zealand&apos;s Automotive Trade
          </h1>
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Autohub New Zealand Limited has served as the trusted logistics partner connecting vehicle importers, dealerships, and fleet managers worldwide for over two decades. Procurly is the digital evolution of that expertise into parts procurement.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-autohub-navy text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-autohub-red" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Coordination Layer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We bridge the gap between New Zealand automotive businesses and verified international OEM and aftermarket suppliers, standardizing quotes and specifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-autohub-navy text-white flex items-center justify-center">
              <Globe className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Procurement Facilitator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminate foreign currency volatility, language barriers, and fragmented payment methods with transparent NZD total landed cost pricing.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-autohub-navy text-white flex items-center justify-center">
              <Anchor className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Logistics Enabler</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Air priority and ocean consolidated shipping directly from Nagoya, Singapore, Hamburg, and Melbourne with complete NZ Customs and MPI biosecurity clearance.
            </p>
          </div>
        </div>

        {/* Story / Context */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Why We Built Procurly
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In recent years, New Zealand automotive dealers and repairers have faced crippling delays sourcing replacement parts for modern Japanese, European, and American vehicles. Mechanics were spending hours emailing international brokers, translating Japanese catalogues, and tracking parcels across multiple courier websites without delivery guarantees.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Procurly consolidates every step—from initial VIN identification to international flight booking and local courier hand-off—into a single web application with complete visibility.
          </p>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Autohub NZ Ltd • Registered NZBN: 9429041234567</span>
            </div>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold transition shadow"
            >
              Apply for Trade Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
