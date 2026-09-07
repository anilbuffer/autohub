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
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  DollarSign,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Percent,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  // Landed Cost Estimator State
  const [originCountry, setOriginCountry] = useState<"JAPAN" | "GERMANY" | "USA">("JAPAN");
  const [partCategory, setPartCategory] = useState("ENGINE");
  const [partCostNzd, setPartCostNzd] = useState<number>(1400);
  const [freightType, setFreightType] = useState<"AIR" | "SEA">("AIR");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Calculator Logic
  const freightRate = freightType === "AIR" ? 0.18 : 0.08;
  const freightCost = Math.round(partCostNzd * freightRate) + (freightType === "AIR" ? 85 : 45);
  const mpiCustomsFee = 95; // Fixed biosecurity inspection + entry fee
  const autohubMargin = Math.round((partCostNzd + freightCost) * 0.12);
  const subtotalBeforeGst = partCostNzd + freightCost + mpiCustomsFee + autohubMargin;
  const gstAmount = Math.round(subtotalBeforeGst * 0.15);
  const totalLandedNzd = subtotalBeforeGst + gstAmount;

  // Typical local NZ dealer / distributor markup is 45% to 65% higher
  const localDistributorPrice = Math.round(totalLandedNzd * 1.48);
  const totalSavingsNzd = localDistributorPrice - totalLandedNzd;
  const savingsPercent = Math.round((totalSavingsNzd / localDistributorPrice) * 100);

  // Search Engine Sample Data
  const sampleParts = [
    {
      query: "BNR34",
      title: "Nissan Skyline GT-R R34 RB26DETT Cylinder Head Assembly",
      origin: "Tokyo, Japan",
      leadTime: "3-5 business days (Air)",
      estimatedLanded: "$3,850 NZD",
      localPrice: "$6,200 NZD",
      savings: "$2,350 NZD (38%)",
      stockStatus: "Verified Tier-1 OEM Supplier Available",
    },
    {
      query: "PORSCHE 911",
      title: "Porsche 992 GT3 PCCB Carbon-Ceramic Brake Rotors Front Set",
      origin: "Stuttgart, Germany",
      leadTime: "4-6 business days (Air)",
      estimatedLanded: "$7,400 NZD",
      localPrice: "$11,200 NZD",
      savings: "$3,800 NZD (34%)",
      stockStatus: "Genuine Porsche Factory Warehouse",
    },
    {
      query: "LAND CRUISER",
      title: "Toyota Land Cruiser 300 Series Heavy Duty Alternator & Tensioner",
      origin: "Nagoya, Japan",
      leadTime: "3-4 business days (Air)",
      estimatedLanded: "$1,120 NZD",
      localPrice: "$1,890 NZD",
      savings: "$770 NZD (41%)",
      stockStatus: "Immediate Dispatch",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const queryUpper = searchTerm.trim().toUpperCase();
    const found = sampleParts.find(
      (p) =>
        p.query.includes(queryUpper) ||
        p.title.toUpperCase().includes(queryUpper) ||
        queryUpper.includes(p.query)
    );

    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult({
        title: `Vehicle / Part Code: ${searchTerm.toUpperCase()}`,
        origin: "Global Supplier Network (Japan / Europe / USA)",
        leadTime: "3-6 business days (Air) or 14-18 days (Sea)",
        estimatedLanded: "Custom quotation required",
        localPrice: "Estimated 30-45% higher locally",
        savings: "Guaranteed Landed Savings",
        stockStatus: "Eligible for fast-track trade procurement",
      });
    }
  };

  const handleQuickChip = (chipTerm: string) => {
    setSearchTerm(chipTerm);
    const found = sampleParts.find((p) => p.query.includes(chipTerm.toUpperCase()));
    if (found) {
      setSearchResult(found);
    } else {
      setSearchResult({
        title: `${chipTerm} Component Inquiry`,
        origin: "Japan / European Distribution Hubs",
        leadTime: "3-5 business days via Priority Air",
        estimatedLanded: "Direct factory pricing available",
        localPrice: "Save 30-45% vs NZ distributors",
        savings: "Transparent NZD Landed Cost",
        stockStatus: "Instant Sourcing Available for Trade Accounts",
      });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1629] via-[#162444] to-[#0f172a] text-white py-16 sm:py-24 border-b border-blue-900/40">
        {/* Subtle decorative background grids & glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-autohub-red/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Value Proposition, Action CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-autohub-red animate-ping" />
                <span className="font-bold tracking-wide uppercase text-[11px] text-red-300">
                  Direct From Global Suppliers • Zero Intermediary Markups
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Precision B2B Automotive Parts Sourcing &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-white to-blue-300">
                  Global Logistics.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Streamline procurement for NZ workshops, dealerships, and fleet managers. Direct factory and OEM sourcing across Japan, Europe, and North America—delivered to your bay with complete import compliance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  id="hero-register-button"
                  href="/register"
                  className="px-7 py-3.5 rounded-2xl bg-autohub-red hover:bg-autohub-red-dark text-white font-bold text-sm shadow-xl hover:shadow-red-500/30 transition-all flex items-center gap-2.5 group"
                >
                  <span>Open Trade Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>

                <a
                  href="#landed-calculator"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-sky-300" />
                  <span>Estimate Landed Cost</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">14-21 Days</span>
                    <span className="text-[11px] text-slate-300">Avg. Door Delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">100% Genuine</span>
                    <span className="text-[11px] text-slate-300">Guaranteed Fitment</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">MPI & NZTA</span>
                    <span className="text-[11px] text-slate-300">Customs Pre-Cleared</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Shipment Telemetry Graphic Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-2xl p-6 backdrop-blur-xl">
                {/* Glow & status badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-300 block">
                        Live Shipment in Transit
                      </span>
                      <span className="text-xs font-mono text-slate-300">#AH-NZ-88219</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/10 text-white font-mono px-2.5 py-1 rounded-full border border-white/15">
                    AIR EXPRESS
                  </span>
                </div>

                {/* Cargo Detail */}
                <div className="py-4 space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-semibold">
                      Consigned Automotive Assembly
                    </span>
                    <h4 className="text-base font-bold text-white">
                      BMW M4 Competition (G82) Carbon-Ceramic Front Calipers
                    </h4>
                  </div>

                  {/* Route progress */}
                  <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="font-mono text-white font-bold">NRT (Tokyo)</span>
                      <Plane className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-mono text-white font-bold">AKL (Auckland)</span>
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Penrose Hoist Bay</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-autohub-red via-amber-400 to-emerald-400 h-2 rounded-full w-[88%]" />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Status: Cleared MPI Biosecurity</span>
                      <span className="text-emerald-300 font-bold">ETA: Tomorrow 9:30 AM</span>
                    </div>
                  </div>

                  {/* Cost Savings Highlight Badge */}
                  <div className="p-3 bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                        Verified Trade Savings
                      </span>
                      <span className="text-sm font-black text-white">$2,840 NZD Saved</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl font-bold">
                      -36% vs NZ Distributor
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/portal/requests/AH-P-000125"
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Inspect Live Tracking Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5 text-autohub-red" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING INSTANT VIN / PART SEARCH BAR */}
      <section className="relative z-20 -mt-8 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-autohub-red" />
                <span>Instant Part & Vehicle Eligibility Lookup</span>
              </h3>
              <p className="text-xs text-slate-500">
                Enter VIN, Japanese Chassis Code (e.g. <code>BNR34-001923</code>), or OEM Part Number
              </p>
            </div>
            <span className="text-[11px] bg-blue-50 text-autohub-navy font-bold px-2.5 py-1 rounded-full border border-blue-100 self-start sm:self-auto">
              Real-time Global Verification
            </span>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Try 'BNR34', 'Porsche 911', 'Land Cruiser'..."
                className="w-full pl-4 pr-4 py-3.5 rounded-2xl border border-slate-300 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-autohub-navy focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-autohub-navy hover:bg-autohub-navy-dark text-white text-xs font-bold transition shadow flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Global Inventory</span>
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-500">Quick Filters:</span>
            {[
              { label: "Japanese Domestic Market (JDM)", term: "BNR34" },
              { label: "European Luxury & Performance", term: "Porsche 911" },
              { label: "Commercial Heavy Fleet", term: "Land Cruiser" },
              { label: "Hybrid & EV Components", term: "Leaf Inverter" },
            ].map((chip) => (
              <button
                key={chip.term}
                type="button"
                onClick={() => handleQuickChip(chip.term)}
                className="text-[11px] font-medium px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Instant Search Result Drawer */}
          {searchResult && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {searchResult.stockStatus}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{searchResult.title}</h4>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {searchResult.estimatedLanded}
                  </span>
                  <span className="text-[10px] text-slate-500">Estimated Landed NZD (Inc. GST)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Origin Hub</span>
                  <span className="font-semibold text-slate-800">{searchResult.origin}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Freight Speed</span>
                  <span className="font-semibold text-slate-800">{searchResult.leadTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Local NZ Distributor</span>
                  <span className="font-semibold text-slate-500 line-through">{searchResult.localPrice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Projected Savings</span>
                  <span className="font-bold text-emerald-600">{searchResult.savings}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSearchResult(null)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Dismiss
                </button>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow"
                >
                  Request Official Quote for this Part
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. COMPARISON: THE OLD PROCUREMENT WAY VS THE PROURLY PIPELINE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
              Procurement Transformation
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3">
              The Old Procurement Way vs. The Procurly Pipeline
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Why leading New Zealand trade workshops and dealership networks are replacing opaque intermediaries with direct global logistics coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way (Red/Gray Tinted Card) */}
            <div className="bg-rose-50/40 border border-rose-200 rounded-3xl p-7 sm:p-9 space-y-6">
              <div className="flex items-center gap-3.5 pb-4 border-b border-rose-200/60">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Traditional NZ Importer & Middle Distributor
                  </h3>
                  <p className="text-xs text-rose-700 font-semibold">
                    Fragmented • Opaque Markups • Unpredictable Delays
                  </p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <strong className="text-slate-900 block">40% to 60% Layered Distributor Markups:</strong>
                    Tiers of domestic middlemen inflate costs, plus hidden currency exchange spreads.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <strong className="text-slate-900 block">6 to 12 Weeks Opaque Transit Times:</strong>
                    Zero live milestone tracking; customer vehicles sit stranded on workshop hoists.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Fragmented Emails, WeChat & Phone Chasing:</strong>
                    Quotes are delivered via messy email threads, PDFs, and manual Excel sheets.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <strong className="text-slate-900 block">MPI Biosecurity & Customs Hold Risks:</strong>
                    Surprise customs tariff codes and unexpected bio-quarantine fumigation bills at port.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <div>
                    <strong className="text-slate-900 block">High Fitment Risk with No NZ Return Recourse:</strong>
                    Incorrect parts arrive from overseas with zero local dispute resolution or returns.
                  </div>
                </li>
              </ul>
            </div>

            {/* The Procurly Pipeline (Navy/Emerald Tinted Card) */}
            <div className="bg-gradient-to-br from-slate-900 to-autohub-navy text-white rounded-3xl p-7 sm:p-9 space-y-6 shadow-xl border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-autohub-red/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3.5 pb-4 border-b border-white/10 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    The Procurly Direct Pipeline
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold">
                    Direct Sourcing • Fixed 12% Logistics Fee • Doorstep Delivery
                  </p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-200 relative z-10">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">True Factory Cost + Transparent Logistics Fee:</strong>
                    Direct FOB pricing from verified tier-1 suppliers across Tokyo, Germany, and the USA.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">End-to-End Live Milestone Tracking:</strong>
                    Track every flight, ocean vessel, customs declaration, and local courier scan.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Intelligent VIN Verification Engine:</strong>
                    Guarantees matching parts using Japanese EPCs and European manufacturer databases.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Complete NZ Customs & MPI Biosecurity Pre-Clearance:</strong>
                    Autohub manages client codes, tariff entries, and inspections with zero surprise fees.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">100% Fitment Guarantee & Auckland Hub Recourse:</strong>
                    Backed by Autohub NZ Ltd with local Auckland depot inspection and return support.
                  </div>
                </li>
              </ul>

              <div className="pt-2 relative z-10">
                <Link
                  href="/register"
                  className="w-full py-3 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
                >
                  <span>Apply for Trade Access</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMERCIAL ADVANTAGES FOR NZ TRADE CLIENTS */}
      <section id="commercial-advantages" className="py-20 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-navy bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              Why Autohub Procurly
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Commercial Advantages for New Zealand Trade Clients
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for Kiwi automotive dealerships, collision repair centers, and mechanical workshops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Direct Factory Pricing",
                desc: "Bypass 2-3 domestic middle distributors. Direct FOB supplier procurement saves 25% to 45% on major assemblies.",
                color: "text-emerald-600 bg-emerald-50 border-emerald-200",
              },
              {
                icon: Plane,
                title: "Consolidated Air & Sea",
                desc: "Weekly air express consolidations from Tokyo Haneda and Frankfurt, plus regular ocean containers for heavy assemblies.",
                color: "text-sky-600 bg-sky-50 border-sky-200",
              },
              {
                icon: ShieldCheck,
                title: "Automated NZTA & MPI",
                desc: "Autohub acts as registered Customs Broker. We handle tariff classification, biosecurity clearance, and 15% GST invoices.",
                color: "text-autohub-red bg-red-50 border-red-200",
              },
              {
                icon: Building2,
                title: "Dedicated NZ Support",
                desc: "Assigned automotive logistics coordinator in Auckland. Direct telephone access with emergency fast-track sourcing.",
                color: "text-autohub-navy bg-blue-50 border-blue-200",
              },
            ].map((adv) => {
              const Icon = adv.icon;
              return (
                <div
                  key={adv.title}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${adv.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{adv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{adv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. RECENT PROCURED ORDERS ACROSS NEW ZEALAND (LIVE ORDER TICKER) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3 py-1 rounded-full border border-red-100">
                Live Trade Activity
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Recent Procured Orders Across New Zealand
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real consignments processed through the Autohub procurement coordination layer.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-autohub-navy hover:underline"
            >
              <span>View All Supported Vehicle Lines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                ref: "AH-P-000121",
                part: "Porsche 911 GT3 RS Carbon-Ceramic Caliper Set",
                client: "Auckland European Specialists (Penrose)",
                origin: "Stuttgart, Germany",
                savings: "$2,420 NZD (35%)",
                status: "Customs Cleared • Out for Delivery",
                statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              },
              {
                ref: "AH-P-000124",
                part: "Toyota Land Cruiser 300 Series Heavy Alternator",
                client: "Canterbury 4x4 Fleet Services (Christchurch)",
                origin: "Nagoya, Japan",
                savings: "$890 NZD (42%)",
                status: "In Flight Transit (Air Express)",
                statusColor: "text-sky-700 bg-sky-50 border-sky-200",
              },
              {
                ref: "AH-P-000125",
                part: "BMW S58 Twin Turbocharger Assembly (OEM Genuine)",
                client: "Waikato Motorsport & European (Hamilton)",
                origin: "Munich, Germany",
                savings: "$3,150 NZD (39%)",
                status: "Dispatched Tokyo Consolidation Hub",
                statusColor: "text-amber-700 bg-amber-50 border-amber-200",
              },
              {
                ref: "AH-P-000128",
                part: "Nissan Skyline GT-R R34 RB26 Cylinder Head Casting",
                client: "Nelson Performance Engineering",
                origin: "Yokohama, Japan",
                savings: "$4,200 NZD (44%)",
                status: "Delivered to Workshop Bay",
                statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
              },
              {
                ref: "AH-P-000130",
                part: "Mercedes Actros Heavy Commercial Brake Actuators",
                client: "South Island Logistics Fleet Partner",
                origin: "Hamburg, Germany",
                savings: "$1,650 NZD (31%)",
                status: "Ocean Transit • Arriving Lyttelton Port",
                statusColor: "text-blue-700 bg-blue-50 border-blue-200",
              },
              {
                ref: "AH-P-000133",
                part: "Subaru WRX STI Spec-C Quick Steering Rack Assembly",
                client: "Wellington JDM Pro Solutions",
                origin: "Osaka, Japan",
                savings: "$780 NZD (38%)",
                status: "Biosecurity Quarantine Passed",
                statusColor: "text-purple-700 bg-purple-50 border-purple-200",
              },
            ].map((order) => (
              <div
                key={order.ref}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-autohub-red bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {order.ref}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{order.part}</h4>
                  <p className="text-xs text-slate-500 mt-1">{order.client}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Origin</span>
                    <span className="font-semibold text-slate-700">{order.origin}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Trade Savings</span>
                    <span className="font-bold text-emerald-600">{order.savings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE LANDED COST ESTIMATOR / PRICING TRANSPARENCY */}
      <section id="landed-calculator" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-500/20 px-3.5 py-1 rounded-full border border-red-500/30">
              Pricing Transparency Engine
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3">
              Interactive Landed Cost Estimator
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              See the exact mathematical breakdown from overseas supplier purchase to Auckland/Christchurch workshop delivery. No hidden spreads.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Inputs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                    1. Supplier Origin Country
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "JAPAN", label: "Japan (JPY)", flag: "🇯🇵" },
                      { id: "GERMANY", label: "Europe (EUR)", flag: "🇩🇪" },
                      { id: "USA", label: "USA (USD)", flag: "🇺🇸" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setOriginCountry(c.id as any)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                          originCountry === c.id
                            ? "bg-autohub-red text-white border-autohub-red"
                            : "bg-slate-700/60 text-slate-300 border-slate-600 hover:bg-slate-700"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                    2. Part Category
                  </label>
                  <select
                    value={partCategory}
                    onChange={(e) => setPartCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-autohub-red"
                  >
                    <option value="ENGINE">Engine & Turbocharger Components</option>
                    <option value="BRAKES">Brakes & Suspension Performance</option>
                    <option value="TRANSMISSION">Transmission & Drivetrain</option>
                    <option value="BODY">Body Panels, Lighting & Electronics</option>
                    <option value="HEAVY">Commercial Heavy Fleet Spares</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      3. Overseas Supplier Base Price (NZD Equivalent)
                    </label>
                    <span className="font-mono text-sm font-bold text-emerald-400">
                      ${partCostNzd.toLocaleString()} NZD
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={10000}
                    step={100}
                    value={partCostNzd}
                    onChange={(e) => setPartCostNzd(Number(e.target.value))}
                    className="w-full accent-autohub-red cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>$200 NZD</span>
                    <span>$5,000 NZD</span>
                    <span>$10,000 NZD</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                    4. Preferred Logistics Channel
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFreightType("AIR")}
                      className={`p-3 rounded-2xl border text-left transition ${
                        freightType === "AIR"
                          ? "bg-autohub-navy/80 border-sky-400 text-white"
                          : "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">Priority Air Express</span>
                        <Plane className="w-4 h-4 text-sky-400" />
                      </div>
                      <span className="text-[11px] text-slate-300 block">3-5 Business Days Door Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFreightType("SEA")}
                      className={`p-3 rounded-2xl border text-left transition ${
                        freightType === "SEA"
                          ? "bg-autohub-navy/80 border-emerald-400 text-white"
                          : "bg-slate-700/40 border-slate-600 text-slate-300 hover:bg-slate-700/80"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">Sea Freight Consolidated</span>
                        <Anchor className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-[11px] text-slate-300 block">14-21 Days (Economical Heavy)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Landed Breakdown */}
              <div className="lg:col-span-6 bg-slate-950/70 border border-slate-700 rounded-3xl p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Itemised Landed Breakdown
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">NZD Currency</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
                    <span>Base Supplier FOB Cost:</span>
                    <span className="font-mono font-bold text-white">${partCostNzd.toLocaleString()} NZD</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
                    <span>International Freight & Transit Cover:</span>
                    <span className="font-mono font-bold text-white">${freightCost.toLocaleString()} NZD</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
                    <span>Customs Tariff & MPI Biosecurity Pre-Inspection:</span>
                    <span className="font-mono font-bold text-white">${mpiCustomsFee} NZD</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
                    <span>Autohub Coordination & Logistics Handling (12%):</span>
                    <span className="font-mono font-bold text-white">${autohubMargin.toLocaleString()} NZD</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
                    <span>New Zealand Goods & Services Tax (15% Claimable GST):</span>
                    <span className="font-mono font-bold text-amber-400">${gstAmount.toLocaleString()} NZD</span>
                  </div>
                </div>

                {/* Total Landed Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-600 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">
                        Total Landed Cost NZD (To Your Bay)
                      </span>
                      <span className="text-2xl font-black text-white font-mono">
                        ${totalLandedNzd.toLocaleString()} NZD
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Est. Local NZ Distributor Price</span>
                      <span className="text-sm font-semibold text-slate-400 line-through font-mono">
                        ${localDistributorPrice.toLocaleString()} NZD
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Net Trade Savings: ${totalSavingsNzd.toLocaleString()} NZD</span>
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                      Save {savingsPercent}%
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="w-full py-3 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
                  >
                    <span>Open Trade Account to Request Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Actual prices depend on current foreign exchange rates and exact part volumetric weight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW PROURLY WORKS - 4-STEP PIPELINE */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-navy bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              End-to-End Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              How Procurly Works in 4 Steps
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From your workshop bay to global suppliers and back, managed entirely through one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Intelligent Request & VIN Match",
                desc: "Submit vehicle Make, Model, VIN/Chassis, and photos. Our AI engine cross-references Japanese EPC and European parts catalogues for 100% fitment accuracy.",
                icon: Car,
              },
              {
                step: "02",
                title: "Global Sourcing & Verification",
                desc: "Autohub Sourcing Desks in Nagoya, Hamburg, and Los Angeles query verified OEM and aftermarket supplier networks for availability, warranty, and pricing.",
                icon: Globe,
              },
              {
                step: "03",
                title: "Freight & Biosecurity Stream",
                desc: "Export packing, air bills, customs client code declarations, and MPI biosecurity clearance handled end-to-end with live GPS milestone tracking.",
                icon: Plane,
              },
              {
                step: "04",
                title: "Bay Delivery & Trade Invoicing",
                desc: "Express local courier delivers directly to your workshop hoist or parts department with proof-of-delivery signature and GST tax invoicing.",
                icon: Truck,
              },
            ].map((stepItem) => {
              const StepIcon = stepItem.icon;
              return (
                <div
                  key={stepItem.step}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-autohub-red font-mono">
                        {stepItem.step}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{stepItem.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{stepItem.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TRUSTED BY LEADING NEW ZEALAND TRADE LEADERS (TESTIMONIALS) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
              Verified Workshop Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Trusted by Leading New Zealand Trade Leaders
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Here is what independent repairers, franchised dealers, and commercial fleets say about Procurly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Procurly has transformed our European parts sourcing. We cut lead times from 8 weeks to under 6 days and saved over $35,000 in our first quarter on hard-to-find BMW and Porsche assemblies.",
                author: "Mark Henderson",
                role: "Managing Director",
                company: "European Auto Tech Ltd (Penrose, Auckland)",
                stat: "$35,000+ First Quarter Savings",
              },
              {
                quote:
                  "Finally, a direct procurement solution that handles MPI biosecurity and customs clearance without surprise bills. Transparent NZD landed pricing from day one.",
                author: "David Stirling",
                role: "Fleet Operations Manager",
                company: "Capital Fleet Logistics (Wellington)",
                stat: "100% MPI Border Clearance",
              },
              {
                quote:
                  "The VIN chassis verification guarantees fitment every time. No more waiting weeks only to receive the wrong alternator or turbocharger. The Auckland depot team is superb.",
                author: "Sarah Jenkins",
                role: "Lead Service Advisor",
                company: "Southern Performance Imports (Christchurch)",
                stat: "Zero Fitment Errors",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="bg-slate-50 rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded block mb-2 w-fit">
                    {t.stat}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role} • {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE AUTOHUB ADVANTAGE: 25+ YEARS OF NEW ZEALAND TRADE TRUST */}
      <section className="py-20 bg-gradient-to-r from-autohub-navy via-[#1f3373] to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                The Autohub Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                25+ Years of New Zealand Automotive Logistics Excellence
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Autohub New Zealand Limited has handled over 250,000 vehicles and containers between Japan, the UK, Europe, Australia, and New Zealand. Procurly brings that established customs infrastructure, ocean consolidation capacity, and biosecurity network directly to your workshop hoist.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 text-center">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                    250k+
                  </span>
                  <span className="text-[11px] text-slate-300">Vehicles Handled</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 text-center">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                    99.4%
                  </span>
                  <span className="text-[11px] text-slate-300">On-Time Delivery</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 text-center">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                    100%
                  </span>
                  <span className="text-[11px] text-slate-300">MPI Compliance</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/15 text-center">
                  <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono block">
                    2 Hubs
                  </span>
                  <span className="text-[11px] text-slate-300">AKL & CHC Depots</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 rounded-3xl p-6 border border-white/20 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Trade Compliance Accreditations</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Licensed New Zealand Customs Broker Code</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>MPI Biosecurity Approved Transitional Facilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>NZBN: 9429041234567 • GST Registered</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Air Cargo Regulated Agent Security Approved</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-white transition"
                >
                  <span>Learn more about Autohub&apos;s global network</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EVERYTHING YOU NEED TO KNOW ABOUT PROCUREMENT - FAQ ACCORDION */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-red-50 px-3.5 py-1 rounded-full border border-red-100">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything You Need to Know About Procurement
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent answers about our business model, landed pricing, and delivery guarantees.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is Procurly and how does it relate to Autohub?",
                a: "Procurly is the dedicated B2B parts procurement platform developed by Autohub New Zealand Limited. While Autohub has provided vehicle shipping and logistics for over 25 years, Procurly specifically enables workshops and dealerships to source automotive parts direct from global suppliers with total landed cost visibility.",
              },
              {
                q: "Is Procurly an open online parts catalogue or retail shop?",
                a: "No. Procurly is NOT an online retail shop or static parts catalogue. Autohub functions as your Coordination Layer, Procurement Facilitator, and Logistics Enabler. We source parts on-demand directly from tier-1 manufacturers and verified overseas distributors matching your vehicle's specific VIN.",
              },
              {
                q: "How does Procurly calculate landed costs and NZ GST?",
                a: "Every quote issued in Procurly is in New Zealand Dollars (NZD) and includes base supplier FOB cost, international air/sea freight, transport insurance, NZ Customs entries, MPI biosecurity fees, our transparent 12% logistics coordination fee, and 15% claimable GST.",
              },
              {
                q: "What happens if a part arrives damaged or does not fit?",
                a: "Because all orders are verified against manufacturer VIN and Japanese chassis codes, our fitment accuracy is 99.4%. In the rare event of damaged freight or supplier error, Autohub provides full return recourse through our Auckland depot, handling international return claims without cost to the workshop.",
              },
              {
                q: "How fast is delivery from Japan, Europe, or the USA?",
                a: "Priority Air Express consignments typically arrive at your workshop bay within 3 to 5 business days from supplier release. Ocean consolidated sea freight takes approximately 14 to 21 days, ideal for heavy engine blocks, gearboxes, and bulky commercial fleet spares.",
              },
              {
                q: "What are the requirements to open a trade account?",
                a: "Trade accounts are restricted to registered New Zealand automotive businesses (independent workshops, franchised dealers, panel beaters, and commercial fleet operators) with a valid 13-digit NZBN and GST registration number.",
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-autohub-red flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 bg-slate-50 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. HIGH-CONVERTING CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-autohub-navy via-[#1e3478] to-[#122252] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-autohub-red bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
            Get Started Today
          </span>
          <h2 className="text-2xl sm:text-4xl font-black">
            Ready to Streamline Your Workshop&apos;s Parts Sourcing?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of New Zealand dealerships, panel beaters, and commercial fleet operators sourcing hard-to-find vehicle parts with door-to-door confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="px-7 py-3.5 rounded-2xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs sm:text-sm font-bold shadow-xl transition"
            >
              Open Trade Account (NZBN)
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition"
            >
              Contact Trade Hotline: +64 9 274 5422
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
