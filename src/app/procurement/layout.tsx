"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Building2,
  CheckSquare,
  Truck,
  Calculator,
  AlertTriangle,
  HelpCircle,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  User,
  ExternalLink,
  Shield,
  CreditCard,
  Bell,
  X,
  Sparkles,
  ArrowRight,
  DollarSign,
  LucideIcon,
  RefreshCw,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredSuppliers,
  getStoredNotifications,
  subscribeToStore,
  setActiveRole,
} from "@/lib/store";
import { PartRequest, SupplierProfile, CustomerNotification } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
  isModal?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export default function ProcurementPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [requests, setRequests] = useState<PartRequest[]>(getStoredRequests);
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(getStoredSuppliers);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(getStoredNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    setRequests(getStoredRequests());
    setSuppliers(getStoredSuppliers());
    setNotifications(getStoredNotifications());

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      setSuppliers(getStoredSuppliers());
      setNotifications(getStoredNotifications());
    });
    return unsub;
  }, []);

  // Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setUserMenuOpen(false);
        setNotifDropdownOpen(false);
        setHelpModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute active badge counts
  const sourcingQueueCount = requests.filter(
    (r) => r.status === "SOURCING" || r.status === "SUBMITTED"
  ).length;

  const awaitingCustomerCount = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL"
  ).length;

  const paymentConfirmedCount = requests.filter(
    (r) => r.status === "PAYMENT_CONFIRMED"
  ).length;

  const inTransitCount = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE"
  ).length;

  const exceptionsCount = requests.filter(
    (r) => r.status === "SOURCING_EXCEPTION"
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length || 2;

  // Derive dynamic page title
  const getPageTitle = () => {
    if (pathname === "/procurement") return "Sourcing Desk Command Center";
    if (pathname === "/procurement/queue") return "Sourcing Queue & Quotation Desk";
    if (pathname === "/procurement/suppliers") return "Global Supplier Reference Directory";
    if (pathname === "/procurement/orders") return "Purchase Orders (Payment Cleared Gate)";
    if (pathname === "/procurement/tracking") return "Procurement Progress & Lifecycle Tracking";
    if (pathname === "/procurement/exceptions") return "Procurement Sourcing Exceptions";
    return "Procurement Portal";
  };

  const navGroups: NavGroup[] = [
    {
      group: "SOURCING DESK",
      items: [
        { label: "Dashboard", href: "/procurement", icon: LayoutDashboard },
        {
          label: "Sourcing Queue",
          href: "/procurement/queue",
          icon: Compass,
          badge: sourcingQueueCount,
          badgeColor: "bg-amber-500",
        },
        {
          label: "Supplier Directory",
          href: "/procurement/suppliers",
          icon: Building2,
          badge: suppliers.length,
          badgeColor: "bg-slate-700",
        },
        {
          label: "Place Supplier POs",
          href: "/procurement/orders",
          icon: CheckSquare,
          badge: paymentConfirmedCount,
          badgeColor: "bg-emerald-600",
        },
        {
          label: "Progress Tracking",
          href: "/procurement/tracking",
          icon: Truck,
          badge: inTransitCount,
          badgeColor: "bg-blue-600",
        },
        {
          label: "Sourcing Exceptions",
          href: "/procurement/exceptions",
          icon: AlertTriangle,
          badge: exceptionsCount > 0 ? exceptionsCount : undefined,
          badgeColor: "bg-rose-600",
        },
      ],
    },
    {
      group: "CROSS-PORTAL SWITCH",
      items: [
        { label: "Customer Portal", href: "/portal", icon: ExternalLink },
        { label: "Admin Operations", href: "/admin", icon: Shield },
        { label: "Logistics Desk", href: "/admin/logistics", icon: Truck },
        { label: "Finance & Credit", href: "/admin/finance", icon: CreditCard },
      ],
    },
    {
      group: "PROCUREMENT SOP",
      items: [
        { label: "Sourcing SOP & Rates", href: "#sop", icon: HelpCircle, isModal: true },
      ],
    },
  ];

  // Search filtering
  const searchResults = searchQuery.trim()
    ? requests.filter(
        (r) =>
          r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row font-sans text-slate-900 antialiased selection:bg-rose-500 selection:text-white">
      {/* ================= LEFT SIDEBAR (DARK NAVY) ================= */}
      <aside
        className={`bg-[#070e1e] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/60">
            <Link href="/procurement" className="flex items-center gap-2.5 overflow-hidden">
              {/* 3D Box Logo */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-red-600 to-rose-500 shadow-md shadow-red-600/20 flex items-center justify-center text-white flex-shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-white"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-base font-black tracking-tight text-white leading-none">
                    PROCUR<span className="text-rose-500">ly</span>
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                    PROCUREMENT PORTAL
                  </div>
                </div>
              )}
            </Link>

            {/* Collapse Toggle */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white flex items-center justify-center text-xs transition"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? "→" : "‹"}
            </button>
          </div>

          {/* Primary Action Button: + SOURCING QUEUE */}
          <div className="p-3 sm:p-4">
            <Link
              id="sidebar-sourcing-queue-button"
              href="/procurement/queue"
              className={`w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2 ${
                sidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              <Compass className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
              {!sidebarCollapsed && <span>OPEN SOURCING QUEUE</span>}
            </Link>
          </div>

          {/* Navigation Items by Group */}
          <div className="px-3 py-2 space-y-6 flex-1">
            {navGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    {grp.group}
                  </div>
                )}
                <div className="space-y-0.5">
                  {grp.items.map((nav) => {
                    const Icon = nav.icon;
                    const isActive = pathname === nav.href;

                    if (nav.isModal) {
                      return (
                        <button
                          key={nav.label}
                          type="button"
                          onClick={() => setHelpModalOpen(true)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                            sidebarCollapsed ? "justify-center" : ""
                          } text-slate-400 hover:text-white hover:bg-slate-800/60`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-slate-400" />
                            {!sidebarCollapsed && <span>{nav.label}</span>}
                          </div>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={nav.label}
                        href={nav.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          sidebarCollapsed ? "justify-center" : ""
                        } ${
                          isActive
                            ? "bg-slate-800/90 text-white font-bold shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition ${
                              isActive ? "text-rose-500" : "text-slate-400"
                            }`}
                          />
                          {!sidebarCollapsed && <span>{nav.label}</span>}
                        </div>

                        {!sidebarCollapsed && nav.badge !== undefined && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                              nav.badgeColor || "bg-slate-700"
                            }`}
                          >
                            {nav.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Profile Section (Nathan Cole - Sourcing Specialist) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Amber Avatar NC */}
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                NC
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    Nathan Cole
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium truncate">
                    Sourcing Specialist
                  </div>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>

          {/* User Popover Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl space-y-1 text-xs text-slate-300 z-50 animate-scaleIn">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px]">
                <div className="font-bold text-white">Autohub Sourcing Operations</div>
                <div className="text-slate-400 font-mono text-[10px]">Desk: Nagoya &amp; NZ Trade</div>
              </div>

              <Link
                href="/portal"
                onClick={() => {
                  setUserMenuOpen(false);
                  setActiveRole("CUSTOMER");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Switch to Customer Portal</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Operations Administration</span>
              </Link>

              <Link
                href="/login"
                onClick={() => {
                  setUserMenuOpen(false);
                  setActiveRole("SOURCING_SPECIALIST");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch Role / Re-login</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  router.push("/login");
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ================= RIGHT MAIN LAYOUT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left Title */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Sourcing Desk
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-full py-2 pl-3.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-left text-xs text-slate-500 flex items-center justify-between transition group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                <span>Search requests, VINs, parts, or suppliers...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-400 shadow-sm border border-slate-200">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions (FX Rates Ticker, Help, Notifications) */}
          <div className="flex items-center gap-3">
            {/* Live FX Ticker Chip */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-500 text-[11px]">FX (NZD):</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">
                JPY: 0.0108 • USD: 1.68 • EUR: 1.82
              </span>
            </div>

            {/* Quick Sourcing Pill */}
            <Link
              href="/procurement/queue"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-900 font-semibold transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>{sourcingQueueCount} to Source</span>
            </Link>

            {/* Help Question Icon */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
              title="Procurement SOP & Guidelines"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">SOP</span>
            </button>

            {/* Notifications Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 space-y-3 animate-scaleIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">
                      Sourcing Alerts &amp; Updates
                    </span>
                    <button
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block">
                        New Sourcing Requests Pending ({sourcingQueueCount})
                      </span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        New customer requests have entered the sourcing queue and need quotes.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-900 block">
                        Payment Confirmed: POs Ready ({paymentConfirmedCount})
                      </span>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Customer payments cleared; transmit purchase orders to suppliers.
                      </p>
                    </div>
                    {exceptionsCount > 0 && (
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                        <span className="font-bold text-rose-900 block">
                          Active Exceptions ({exceptionsCount})
                        </span>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          Parts flagged with backorders or manufacturer discontinuation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global ⌘K Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type part name, reference, VIN, or customer..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
              >
                ESC
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                  <p>Type to search across all procurement requests and active quotes.</p>
                  <p className="text-[11px]">E.g. &quot;Hiace&quot;, &quot;AH-P-000123&quot;, or &quot;Control Arm&quot;</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No requests matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((req) => (
                    <Link
                      key={req.id}
                      href={`/procurement/queue?req=${req.id}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition text-xs group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 group-hover:text-rose-600">
                            {req.referenceNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {req.status}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} • {req.part.partName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Customer: {req.customerName} • VIN: {req.vehicle.vin}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sourcing SOP & Rates Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6 sm:p-8 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  Procurement Desk SOP &amp; Cost Model
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  1. Sourcing Desk Margin Policy
                </span>
                <p>
                  Standard target margin is <strong>18.0%</strong> on landed cost (part cost + overseas freight to international export hub). Margin can be tuned between 10% - 35% based on trade customer tier and volume.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  2. Landed Cost Calculation Formula
                </span>
                <p className="font-mono bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                  Landed Cost = Part Cost (NZD) + Domestic Freight to Hub (NZD)<br />
                  Customer Subtotal = Landed Cost + (Landed Cost × Margin %) + $60 Procurement Fee + International Freight<br />
                  GST = Subtotal × 15% | Total = Subtotal + GST
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  3. Standard Freight Channels
                </span>
                <p>
                  • <strong>Air Express Priority</strong> (3-5 business days) via Cathay Cargo / Air NZ: $185 NZD base.<br />
                  • <strong>Sea Freight Consolidated</strong> (14-18 business days) via Toyofuji Ocean: $65 NZD base.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  4. Payment Confirmed Gate
                </span>
                <p>
                  Supplier Purchase Orders must ONLY be marked <strong>&quot;Ordered From Supplier&quot;</strong> once customer payment has been confirmed via bank clearance or verified approved 20th-of-the-month trade credit line.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-5 py-2.5 bg-autohub-navy text-white font-bold rounded-xl text-xs"
              >
                Close Guidelines
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
