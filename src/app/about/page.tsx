import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plane,
  Building2,
  MapPin,
  Anchor,
  Globe,
  Truck,
  Sparkles,
  Zap,
  CreditCard,
  Headphones,
} from "lucide-react";

export const metadata = {
  title: "About Us | Pioneering Automotive Supply Chains & Trade Procurement",
  description:
    "Autohub has pioneered cross-border automotive logistics for over 25 years. Procurly delivers bonded direct-to-hoist parts procurement for New Zealand workshops.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#080d1a] text-white pt-20 pb-24 overflow-hidden border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-sky-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>25+ Years Cross-Border Logistics Leadership</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Pioneering Automotive Supply Chains &amp; Trade Procurement
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            From 25 years engineered by Autohub to resolve the greatest challenge facing New Zealand workshops: collision repairers, and specialty workshops from fragmented, slow, and opaque vehicle parts sourcing.
          </p>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 max-w-4xl mx-auto">
            <div className="bg-[#101726]/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800/90 text-center shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-white block tracking-tight">
                250,000+
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                Parts Sourced
              </span>
            </div>

            <div className="bg-[#101726]/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800/90 text-center shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-emerald-400 block tracking-tight">
                15,000+
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                Active NZ Workshops
              </span>
            </div>

            <div className="bg-[#101726]/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800/90 text-center shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-amber-400 block tracking-tight">
                100%
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                Fitment Guarantee Rate
              </span>
            </div>

            <div className="bg-[#101726]/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-800/90 text-center shadow-lg">
              <span className="text-2xl sm:text-4xl font-extrabold text-sky-400 block tracking-tight">
                4 Gateways
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1.5 block">
                Dedicated NZ Depots
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EVOLUTION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Text copy */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-autohub-red bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-3">
                  THE EVOLUTION
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  From Complete Vehicle Logistics to Precision Component Sourcing
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  For over two decades, Autohub has served as New Zealand&apos;s foremost automotive transit backbone, moving hundreds of thousands of vehicles across borders from major vehicle hubs in Japan, the United Kingdom, Australia, and New Zealand.
                </p>
                <p>
                  With the rapid emergence of modern vehicle technology—complex sensors, hybrid/electric systems, and European platforms—New Zealand automotive workshops began facing crippling delays. Mechanics were spending days tracking down obscure parts through unverified overseas suppliers, suffering import duties, and awaiting months for delivery.
                </p>
                <p>
                  Procurly was built to solve this: an end-to-end intelligent digital platform backed by Autohub&apos;s established bonded freight infrastructure. Direct factory connections, swift air clearance, and reliable door-to-door transit.
                </p>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Air Freight Direct</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Wharf-to-Door Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Workshop Inspection Image Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] sm:aspect-[14/11] group bg-slate-900">
                <img
                  src="/heritage-workshop-clean.jpg"
                  alt="Certified Bonded Inspection Hub"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1322]/85 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certified Bonded Inspection Hub</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#0c1322]/90 backdrop-blur-md border border-slate-700/60 shadow-xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-autohub-red block mb-1">
                    DIRECT SOURCING GUARANTEE
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    Every component sourced undergoes 3-point physical fitment checks and damage inspection before international dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PHYSICAL GATEWAYS & CROSS-DOCK DISTRIBUTION HUBS */}
      <section className="py-20 bg-[#f8fafc] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-100 inline-block">
              ⚡ NATIONWIDE DISTRIBUTION NETWORK
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Physical Gateways &amp; Cross-Dock Distribution Hubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Strategic distribution footprints ensuring delivery to every garage across New Zealand within hours.
            </p>
          </div>

          {/* 4 Hub Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hub 1: Auckland */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-autohub-red block">
                    NORTH ISLAND MAIN HUB
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Auckland Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    142 Neilson St, Penrose, Auckland 1061
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Dispatch Active
                </span>
                <span className="font-semibold text-slate-500">Capacity: 98%</span>
              </div>
            </div>

            {/* Hub 2: Christchurch */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-autohub-red block">
                    SOUTH ISLAND MAIN HUB
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Christchurch Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    55 Lunns Road, Middleton, Christchurch 8024
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Dispatch Active
                </span>
                <span className="font-semibold text-slate-500">Daily Trans-shipment</span>
              </div>
            </div>

            {/* Hub 3: Wellington */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-autohub-red block">
                    CENTRAL REGION DEPOT
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Wellington Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    8 Seaview Road, Lower Hutt, 5010
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Dispatch Active
                </span>
                <span className="font-semibold text-slate-500">Overnight North/South</span>
              </div>
            </div>

            {/* Hub 4: Tauranga */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-autohub-red block">
                    PORT CONSOLIDATION
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Tauranga Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Hull Road, Mount Maunganui 3116
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Dispatch Active
                </span>
                <span className="font-semibold text-slate-500">Sea Freight Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. END-TO-END CUSTOMS BONDED SUPPLY LINES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Air Cargo Image Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] sm:aspect-[14/11] group bg-slate-900">
                <img
                  src="/hero-air-cargo-clean.jpg"
                  alt="Autohub Scheduled Air Cargo Carrier"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1322]/85 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-lg">
                  <Plane className="w-3.5 h-3.5 text-sky-400" />
                  <span>Scheduled Air Cargo Carrier</span>
                </div>

                {/* Floating Bottom Bar */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-[#0c1322]/90 backdrop-blur-md border border-slate-700/60 shadow-xl flex items-center justify-between text-xs text-white">
                  <span className="font-bold">Scheduled Air Cargo Carrier</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    Tokyo / Nagoya ➔ AKL Daily
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100 inline-block mb-3">
                  LOGISTICS PIPELINE
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  End-to-End Customs Bonded Supply Lines
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                By controlling the entire logistics chain from overseas collection to New Zealand workshop delivery, Procurly eliminates intermediaries, markups, and unpredictable customs delays that traditionally stall vehicle repairs.
              </p>

              {/* 3 Bullet Points */}
              <div className="space-y-4 pt-1 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Rapid Air Freight Direct: </span>
                    <span className="text-slate-600">
                      Priority daily freight slots on Air New Zealand &amp; Nippon Cargo flights directly connecting Tokyo/Nagoya to Auckland.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Biosecurity &amp; MPI Clearance Guaranteed: </span>
                    <span className="text-slate-600">
                      Pre-cleared in customs bond before landing, eliminating wharf and customs inspection delays.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Consolidated Ocean Shipping: </span>
                    <span className="text-slate-600">
                      For bulk container shipments and oversized commercial assemblies from Japan and Europe.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR CORE COMMITMENTS TO KIWI WORKSHOPS */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100 inline-block">
              ⭐ OUR CORE PROMISE TO NZ TRADE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Our Core Commitments to Kiwi Workshops
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Dedicated to eliminating downtime and maximizing bay revenue for every New Zealand repair business.
            </p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Direct Sourcing Network
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No intermediary brokers or markups. We source direct from verified overseas suppliers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-autohub-red flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Rapid 24/48hr Delivery
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Overnight and express air freight options direct to your workshop door across NZ.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                B2B Trade Pricing &amp; Credit Lines
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Streamlined business accounts with consolidated monthly billing and transparent landed NZD pricing.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Dedicated NZ Support
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct phone and digital account support with experienced automotive parts specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PARTNER CTA BANNER */}
      <section className="py-16 bg-slate-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-950 via-[#0a1226] to-[#0f172a] rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Partner with New Zealand&apos;s Leading Sourcing Platform
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Access direct trade pricing and priority freight for your workshop today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 flex-shrink-0 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition duration-150"
              >
                Apply for Trade Account
              </Link>
              <Link
                href="/#how-it-works"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Explore Our Sourcing Lanes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
