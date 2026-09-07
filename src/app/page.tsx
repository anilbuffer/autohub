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
  Calculator,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Search Bar State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Vehicle Preset Data for Live Trade Sourcing Estimates
  type TradeVehicle = {
    id: string;
    label: string;
    modelName: string;
    vinChassis: string;
    airCost: number;
    seaCost: number;
    airFreight: number;
    seaFreight: number;
    airGst: number;
    seaGst: number;
    customsFee: number;
    airTransit: string;
    seaTransit: string;
  };

  const tradeVehicles: TradeVehicle[] = [
    {
      id: "hilux",
      label: "Toyota Hilux (2021)",
      modelName: "2021 Toyota Hilux - SR5 Cruiser 4WD Double Cab (Japan)",
      vinChassis: "Chassis/VIN: JTEBX3EJ9K12...",
      airCost: 2109.25,
      seaCost: 1885.0,
      airFreight: 290.0,
      seaFreight: 95.0,
      airGst: 314.25,
      seaGst: 285.0,
      customsFee: 55.0,
      airTransit: "3 - 5 Business Days",
      seaTransit: "18 - 24 Days",
    },
    {
      id: "ranger",
      label: "Ford Ranger (2022)",
      modelName: "2022 Ford Ranger - Wildtrak 2.0L Bi-Turbo 4x4 (Thailand/Japan)",
      vinChassis: "Chassis/VIN: MNAABFF50NW14...",
      airCost: 2380.5,
      seaCost: 2040.0,
      airFreight: 320.0,
      seaFreight: 110.0,
      airGst: 355.5,
      seaGst: 310.0,
      customsFee: 55.0,
      airTransit: "3 - 5 Business Days",
      seaTransit: "18 - 24 Days",
    },
    {
      id: "leaf",
      label: "Nissan Leaf (2020)",
      modelName: "2020 Nissan Leaf - e+ G 62kWh Electric (Japan)",
      vinChassis: "Chassis/VIN: ZE1-042819...",
      airCost: 1650.0,
      seaCost: 1390.0,
      airFreight: 220.0,
      seaFreight: 85.0,
      airGst: 245.0,
      seaGst: 210.0,
      customsFee: 55.0,
      airTransit: "3 - 5 Business Days",
      seaTransit: "18 - 24 Days",
    },
    {
      id: "bmw",
      label: "BMW 3 Series (2020)",
      modelName: "2020 BMW 330i - M Sport G20 Sedan (Germany)",
      vinChassis: "Chassis/VIN: WBA5R1C51LK9...",
      airCost: 2795.0,
      seaCost: 2390.0,
      airFreight: 360.0,
      seaFreight: 125.0,
      airGst: 418.0,
      seaGst: 360.0,
      customsFee: 55.0,
      airTransit: "4 - 6 Business Days",
      seaTransit: "21 - 28 Days",
    },
    {
      id: "wrx",
      label: "Subaru WRX STI (2019)",
      modelName: "2019 Subaru WRX STI - Type S EJ20 Final Edition (Japan)",
      vinChassis: "Chassis/VIN: VAB-028491...",
      airCost: 2940.0,
      seaCost: 2480.0,
      airFreight: 380.0,
      seaFreight: 130.0,
      airGst: 440.0,
      seaGst: 375.0,
      customsFee: 55.0,
      airTransit: "3 - 5 Business Days",
      seaTransit: "18 - 24 Days",
    },
  ];

  const [selectedVehicleId, setSelectedVehicleId] = useState("hilux");
  const [partCategory, setPartCategory] = useState("engine");
  const [partCondition, setPartCondition] = useState<"NEW" | "USED">("NEW");
  const [selectedFreightMethod, setSelectedFreightMethod] = useState<"AIR" | "SEA">("AIR");

  const currentVehicle = tradeVehicles.find((v) => v.id === selectedVehicleId) || tradeVehicles[0];
  const conditionMultiplier = partCondition === "NEW" ? 1.0 : 0.72;

  const airTotal = (currentVehicle.airCost * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const seaTotal = (currentVehicle.seaCost * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const airFreightStr = (currentVehicle.airFreight * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const seaFreightStr = (currentVehicle.seaFreight * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const customsFeeStr = currentVehicle.customsFee.toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const airGstStr = (currentVehicle.airGst * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const seaGstStr = (currentVehicle.seaGst * conditionMultiplier).toLocaleString("en-NZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

  // Hero Showcase Card Data & Interactive Part State
  const [heroActivePart, setHeroActivePart] = useState(0);
  const heroPartsData = [
    {
      id: "headlamp",
      chipLabel: "OEM LED Matrix Headlamp (L/H)",
      code: "OEM #81110-0KP80 • TOKYO OEM DEPOT",
      name: "OEM LED Matrix Headlamp (L/H)",
      price: "$1,840 NZD",
      flight: "Air Cargo NZ90 (NRT ✈ AKL)",
      eta: "ETA Workshop: Tomorrow 11:30 AM",
      progress: 78,
      origin: "Tokyo Export Depot",
      milestone: "NZ Customs & MPI Pre-Cleared",
      destination: "Penrose Delivery",
    },
    {
      id: "turbo",
      chipLabel: "Twin-Scroll Turbocharger Assembly",
      code: "OEM #14411-AA710 • HAMBURG OEM HUB",
      name: "Twin-Scroll Turbocharger Assembly",
      price: "$2,450 NZD",
      flight: "Air Cargo LH840 (FRA ✈ AKL)",
      eta: "ETA Workshop: Friday 9:00 AM",
      progress: 60,
      origin: "Frankfurt Air Hub",
      milestone: "Biosecurity Manifest Logged",
      destination: "Middleton Delivery",
    },
    {
      id: "caliper",
      chipLabel: "Monobloc 4-Piston Caliper Kit",
      code: "OEM #34116-799469 • NAGOYA LOGISTICS DEPOT",
      name: "Monobloc 4-Piston Caliper Kit",
      price: "$1,620 NZD",
      flight: "Air Cargo JL093 (NGO ✈ AKL)",
      eta: "ETA Workshop: Tomorrow 2:00 PM",
      progress: 85,
      origin: "Nagoya Air Cargo",
      milestone: "Auckland Courier Dispatched",
      destination: "Albany Trade Bay",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1629] via-[#162444] to-[#0f172a] text-white py-16 sm:py-24 border-b border-blue-900/40">
        {/* Subtle decorative background grids & glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-autohub-red/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-0 relative z-10">
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

            {/* Right Column: Autohub Global Air Logistics Showcase Card with Individual Imagery & Live Interactive Elements */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] group">
                {/* Ambient dynamic backlight glow */}
                <div className="absolute inset-4 bg-gradient-to-r from-red-600/30 via-emerald-500/20 to-sky-500/25 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition duration-700 pointer-events-none" />

                {/* Main Showcase Card Container */}
                <div className="relative rounded-3xl overflow-hidden bg-[#0c1222] border border-slate-700/60 shadow-2xl transition duration-300">
                  {/* 1. Top Header Bar */}
                  <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3 border-b border-slate-800/80 bg-[#0d1424]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0 shadow-inner">
                        <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                            AUTOHUB GLOBAL AIR LOGISTICS
                          </h3>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">
                          Tokyo Depot (NRT) ✈ Auckland Hub (AKL) • Flight NZ90
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] sm:text-xs font-bold shadow-xs flex-shrink-0">
                      <span className="text-[10px] sm:text-xs tracking-tighter">((•))</span>
                      <span>In Transit</span>
                    </div>
                  </div>

                  {/* 2. Middle Imagery Area (Clean Photography + Interactive Live Overlays) */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9.5] overflow-hidden bg-slate-950">
                    <img
                      src="/hero-air-cargo-clean.jpg"
                      alt="Autohub Global Air Logistics Cargo Apron"
                      className="w-full h-full object-cover block transition duration-700 ease-out group-hover:scale-[1.02]"
                      loading="eager"
                    />

                    {/* Gradient protective overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-transparent to-[#0c1222]/30 pointer-events-none" />

                    {/* Top-Left Individual Badge */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 px-2.5 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-2 select-none">
                      <div className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[11px] sm:text-xs font-bold text-white block leading-none">
                          Quality Assurance Passed
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-300 font-medium block mt-0.5">
                          Lot #0324 • Certified OEM
                        </span>
                      </div>
                    </div>

                    {/* Bottom Individual Chip Selectors */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                      {heroPartsData.map((partItem, idx) => {
                        const isSelected = heroActivePart === idx;
                        return (
                          <button
                            key={partItem.id}
                            type="button"
                            onClick={() => setHeroActivePart(idx)}
                            className={`px-3 py-1 sm:py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                              isSelected
                                ? "bg-red-600 text-white shadow-lg shadow-red-600/50 scale-[1.02]"
                                : "bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white hover:border-slate-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? "bg-white" : "bg-emerald-400"
                              }`}
                            />
                            <span>{partItem.chipLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Bottom Dynamic Details & Telemetry Area */}
                  <div className="p-4 sm:p-5 space-y-3.5 bg-[#0c1222]">
                    {/* Part Code & Price */}
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                          {heroPartsData[heroActivePart].code}
                        </span>
                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                          {heroPartsData[heroActivePart].name}
                        </h4>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono block leading-none">
                          {heroPartsData[heroActivePart].price}
                        </span>
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                          100% Guaranteed
                        </span>
                      </div>
                    </div>

                    {/* Live Transit Telemetry Track */}
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                          <Plane className="w-3.5 h-3.5 text-sky-400" />
                          <span>{heroPartsData[heroActivePart].flight}</span>
                        </div>
                        <span className="font-bold text-emerald-400">
                          {heroPartsData[heroActivePart].eta}
                        </span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-300 rounded-full transition-all duration-500"
                          style={{ width: `${heroPartsData[heroActivePart].progress}%` }}
                        />
                      </div>

                      {/* Milestones */}
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-medium">
                        <span>{heroPartsData[heroActivePart].origin}</span>
                        <span className="text-emerald-400 font-bold">
                          {heroPartsData[heroActivePart].milestone}
                        </span>
                        <span>{heroPartsData[heroActivePart].destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING INSTANT VIN / PART SEARCH BAR */}
      <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4 w-full">
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
        <div className="max-w-7xl mx-auto px-4 md:px-0">
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
        <div className="max-w-7xl mx-auto px-4 md:px-0">
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
        <div className="max-w-7xl mx-auto px-4 md:px-0">
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
      <section id="landed-calculator" className="py-20 bg-slate-50/70 border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Calculate Live Trade Sourcing Estimates
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Select a common NZ vehicle to preview our landed cost structure with Air vs Sea freight choices.
            </p>
          </div>

          {/* Main Estimator Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Top Navy Header Banner */}
            <div className="bg-[#182759] px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                  <Calculator className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Instant Landed Cost Estimator
                  </h3>
                  <p className="text-xs text-blue-200">
                    Explore transparent NZ landed pricing for popular trade parts
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live NZ Tariff Model</span>
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 sm:p-8 space-y-7">
              {/* Popular NZ Trade Vehicles Pills */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                  POPULAR NZ TRADE VEHICLES (CLICK TO TEST):
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {tradeVehicles.map((vehicle) => {
                    const isSelected = vehicle.id === selectedVehicleId;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl transition ${isSelected
                            ? "bg-[#1e3a8a] text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                          }`}
                      >
                        {vehicle.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* 1. Selected Vehicle */}
                <div className="md:col-span-5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    SELECTED VEHICLE
                  </label>
                  <div className="relative">
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      {tradeVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.modelName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1.5">{currentVehicle.vinChassis}</p>
                </div>

                {/* 2. Part Category */}
                <div className="md:col-span-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    PART CATEGORY
                  </label>
                  <div className="relative">
                    <select
                      value={partCategory}
                      onChange={(e) => setPartCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-sm appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      <option value="engine">Engine & Mechanical</option>
                      <option value="brakes">Brakes & Suspension</option>
                      <option value="transmission">Transmission & Drivetrain</option>
                      <option value="body">Body Panels & Lighting</option>
                      <option value="heavy">Commercial Heavy Duty Spares</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">Verified OEM Fitment Guaranteed</p>
                </div>

                {/* 3. Condition Required */}
                <div className="md:col-span-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    CONDITION REQUIRED
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPartCondition("NEW")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition text-center ${partCondition === "NEW"
                          ? "bg-[#1e3a8a] text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      New OEM
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartCondition("USED")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition text-center ${partCondition === "USED"
                          ? "bg-[#1e3a8a] text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      Grade A Used
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    {partCondition === "NEW" ? "Factory Sealed Packaging" : "Certified Dismantler Inspected"}
                  </p>
                </div>
              </div>

              {/* Freight Comparison Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    SELECT FREIGHT METHOD TO COMPARE
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CLICK CARD TO SELECT
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card 1: Priority Air Freight */}
                  <div
                    onClick={() => setSelectedFreightMethod("AIR")}
                    className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border-2 relative ${selectedFreightMethod === "AIR"
                        ? "border-red-500 bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                          <Plane className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="font-bold text-sm text-red-600">Priority Air Freight</span>
                      </div>
                      {selectedFreightMethod === "AIR" ? (
                        <span className="bg-autohub-red text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          ✓ SELECTED
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          SELECT
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                        ${airTotal}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">Landed NZD</span>
                    </div>

                    <div className="mt-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-700">
                        <Package className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Includes GST, Customs & Final Mile Delivery</span>
                      </span>
                    </div>

                    <div className="mt-5 space-y-2.5 text-xs border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Estimated Transit:</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded text-[11px]">
                          {currentVehicle.airTransit}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Air Freight & Export:</span>
                        <span className="font-semibold text-slate-800 font-mono">${airFreightStr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>NZ Customs, MPI & Duty:</span>
                        <span className="font-semibold text-slate-800 font-mono">${customsFeeStr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>GST (15%) & Local Courier:</span>
                        <span className="font-semibold text-slate-800 font-mono">${airGstStr}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Consolidated Sea Freight */}
                  <div
                    onClick={() => setSelectedFreightMethod("SEA")}
                    className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border-2 relative ${selectedFreightMethod === "SEA"
                        ? "border-[#1e3a8a] bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-900">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Anchor className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-bold text-sm text-slate-800">Consolidated Sea Freight</span>
                      </div>
                      {selectedFreightMethod === "SEA" ? (
                        <span className="bg-[#1e3a8a] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          ✓ SELECTED
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
                          SELECT
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                        ${seaTotal}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">Landed NZD</span>
                    </div>

                    <div className="mt-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-700">
                        <Package className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>Includes GST, Customs & Final Mile Delivery</span>
                      </span>
                    </div>

                    <div className="mt-5 space-y-2.5 text-xs border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Estimated Transit:</span>
                        <span className="font-bold text-slate-800 text-[11px]">
                          {currentVehicle.seaTransit}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Sea Freight & Port:</span>
                        <span className="font-semibold text-slate-800 font-mono">${seaFreightStr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>NZ Customs, MPI & Duty:</span>
                        <span className="font-semibold text-slate-800 font-mono">${customsFeeStr}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>GST (15%) & Local Courier:</span>
                        <span className="font-semibold text-slate-800 font-mono">${seaGstStr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <div className="w-5 h-5 rounded-full border border-red-500 text-red-500 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <span>Quotes include all import brokerage, MPI biosecurity pre-clearance, and direct workshop delivery.</span>
                </div>

                <Link
                  href="/portal/new-request"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-red-500/25 transition flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <span>Submit Exact Part Request</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW PROURLY WORKS - 4-STEP PIPELINE */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-0">
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
        <div className="max-w-7xl mx-auto px-4 md:px-0">
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

      {/* 9. THE AUTOHUB HERITAGE: TRUSTED BY HUNDREDS OF NZ DEALERSHIPS & REPAIRERS */}
      <section id="heritage" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Workshop Bay Photo Card with Individual Imagery & Live Text Elements */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group bg-slate-900 aspect-square sm:aspect-[467/492]">
                {/* 1. Imagery: Clean Workshop Bay Background Photograph */}
                <img
                  src="/heritage-workshop-clean.jpg"
                  alt="Active NZ Trade Network Automotive Workshop Bay"
                  className="w-full h-full object-cover block transition duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle protective gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

                {/* 2. Top-Left Individual Badge */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141f33]/85 backdrop-blur-md border border-white/10 shadow-lg select-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    Active NZ Trade Network Bay
                  </span>
                </div>

                {/* 3. Bottom Individual Quality Standard Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 p-4 sm:p-5 rounded-2xl bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/60 shadow-2xl transition duration-300 group-hover:border-slate-600">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#ff5252] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#ff5252]">
                      NZ WORKSHOP QUALITY STANDARD
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] font-semibold text-slate-100 leading-snug sm:leading-relaxed">
                    100% Fitment Certified prior to international air dispatch. Direct supply to Auckland, Christchurch &amp; regional repair hoists.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Autohub Group Heritage Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-900 uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                <span>AUTOHUB GROUP HERITAGE</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Trusted by Hundreds of New Zealand Dealerships & Repairers
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Autohub has pioneered vehicle logistics between Japan, the UK, Australia, and New Zealand for over two decades. Procurly extends this world-class infrastructure directly to parts procurement for trade workshops.
              </p>

              {/* Supporting Networks Header */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  SUPPORTING NZ DEALER & TRADE NETWORKS:
                </span>

                {/* 6 Network Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "TOYOTA TRADE NZ",
                    "EURO SPECIALISTS",
                    "GILTRAP FLEET",
                    "ARMSTRONG'S NETWORK",
                    "COMMERCIAL FLEETS NZ",
                    "MTA NZ CERTIFIED",
                  ].map((partner) => (
                    <div
                      key={partner}
                      className="bg-white border border-slate-200 rounded-xl py-3 px-3 text-center shadow-xs hover:border-slate-300 hover:shadow-sm transition"
                    >
                      <span className="text-[11px] font-extrabold text-slate-700 tracking-wider uppercase block">
                        {partner}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2 Feature Info Cards */}
              <div className="space-y-3 pt-2">
                {/* Direct Customs Bonded Facilities */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-4 shadow-xs hover:border-blue-200 transition">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Direct Customs Bonded Facilities
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Faster MPI biosecurity clearance and direct tariff filing with NZ Customs Service.
                    </p>
                  </div>
                </div>

                {/* Regional Delivery Hubs */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-4 shadow-xs hover:border-red-200 transition">
                  <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Regional Delivery Hubs
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Penrose (Auckland) and Middleton (Christchurch) cross-dock hubs for rapid local delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-block px-7 py-3.5 bg-autohub-red hover:bg-autohub-red-dark text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition"
                >
                  Open Your Trade Account Today
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
