import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Anchor,
  Plane,
  Award,
  Globe,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileText,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-slate-50 py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
            About Procurly & Autohub
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Logistics Backbone of New Zealand&apos;s Automotive Trade
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Autohub New Zealand Limited has served as the premier cross-border logistics provider connecting international vehicle manufacturers and distributors with New Zealand dealers and workshops for over two decades. Procurly is the digital evolution of that expertise into parts procurement.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-autohub-navy font-mono block">25+</span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">Years in NZ Trade Logistics</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono block">250,000+</span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">Vehicles & Containers Moved</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-autohub-red font-mono block">99.4%</span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">On-Time Clearance Rate</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <span className="text-3xl sm:text-4xl font-black text-sky-600 font-mono block">6 Hubs</span>
            <span className="text-xs font-semibold text-slate-600 mt-1 block">Global Network Depots</span>
          </div>
        </div>

        {/* Three Core Operating Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900">Our Three Operating Pillars</h2>
            <p className="text-xs text-slate-500 mt-1">
              How Autohub functions as an integrated supply chain partner rather than a simple retailer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-autohub-navy text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-autohub-red" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Coordination Layer</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We bridge the gap between New Zealand automotive businesses and verified international OEM and aftermarket suppliers. We verify vehicle chassis codes, standardize specifications, and guarantee 100% fitment before dispatch.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-autohub-navy text-white flex items-center justify-center">
                <Globe className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Procurement Facilitator</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We eliminate foreign currency volatility, language barriers, and fragmented payment methods. Kiwi workshops receive transparent NZD total landed cost pricing with claimable 15% GST invoices.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-autohub-navy text-white flex items-center justify-center">
                <Anchor className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Logistics Enabler</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Air priority (3-5 days) and ocean consolidated containers directly from Tokyo, Frankfurt, and Los Angeles into our Auckland and Christchurch depots with complete NZ Customs and MPI biosecurity clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Global Network Depots */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Autohub Global Logistics Network</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical consolidation facilities handling your consignments worldwide.
              </p>
            </div>
            <span className="text-xs font-bold text-autohub-navy bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 self-start sm:self-auto">
              Weekly Air & Sea Departures
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                city: "Nagoya & Tokyo, Japan",
                flag: "🇯🇵",
                role: "JDM & OEM Parts Consolidation Hub",
                desc: "Direct access to Toyota, Nissan, Honda, Subaru, and Isuzu domestic distributor networks with daily export packaging.",
              },
              {
                city: "Frankfurt & Hamburg, Germany",
                flag: "🇩🇪",
                role: "European Luxury & Performance Hub",
                desc: "Air consolidations for Porsche, BMW, Mercedes-Benz, Audi, and Volkswagen genuine assemblies.",
              },
              {
                city: "Los Angeles, USA",
                flag: "🇺🇸",
                role: "North American Fleet & Spares Depot",
                desc: "Air and ocean containers for Ford, GM, Dodge, Tesla, and heavy commercial machinery.",
              },
              {
                city: "Melbourne, Australia",
                flag: "🇦🇺",
                role: "Trans-Tasman Express Depot",
                desc: "Rapid 48-hour trans-Tasman air courier for heavy Australian fleet components.",
              },
              {
                city: "Auckland, New Zealand",
                flag: "🇳🇿",
                role: "NZ Customs Clearance & North Island Distribution",
                desc: "Level 2, 86 Highbrook Drive, East Tamaki. MPI Approved Transitional Facility & return triage depot.",
              },
              {
                city: "Christchurch, New Zealand",
                flag: "🇳🇿",
                role: "South Island Logistics & Courier Depot",
                desc: "112 Blenheim Road, Riccarton. Dedicated South Island hoist bay courier dispatches.",
              },
            ].map((hub) => (
              <div key={hub.city} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{hub.flag}</span>
                  <span className="text-sm font-bold text-slate-900">{hub.city}</span>
                </div>
                <span className="text-[11px] font-bold text-autohub-red block">{hub.role}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{hub.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-br from-slate-900 to-autohub-navy text-white rounded-3xl p-8 sm:p-12 border border-slate-700 shadow-xl space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-white/10 px-3 py-1 rounded-full border border-white/15">
            Our Origin Story
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why We Created Procurly
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            <p>
              In recent years, New Zealand automotive repairers and dealerships have faced crippling delays sourcing replacement parts for modern Japanese, European, and American vehicles. Mechanics were spending hours emailing international brokers, translating Japanese EPC catalogues, risking wire transfers to unfamiliar overseas suppliers, and tracking parcels across multiple courier websites without delivery guarantees.
            </p>
            <p>
              Vehicles sat on workshop hoists for 6 to 12 weeks, costing dealerships thousands in lost bay productivity and customer loan cars.
            </p>
            <p>
              Procurly was developed to solve this supply crisis. By uniting Autohub&apos;s 25-year international logistics network with an intelligent VIN-matching digital coordination layer, Kiwi workshops can now obtain transparent NZD landed quotations in minutes and receive genuine parts directly to their workshop bay in days.
            </p>
          </div>

          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Autohub New Zealand Limited</span>
              <span className="text-[11px] text-slate-400 font-mono">
                Registered NZBN: 9429041234567 • GST: 128-492-381
              </span>
            </div>
            <Link
              href="/register"
              className="px-6 py-3 rounded-2xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Apply for Trade Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
