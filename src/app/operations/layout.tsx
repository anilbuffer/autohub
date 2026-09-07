"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Package,
  Ship,
  Plane,
  Calculator,
  Sliders,
  AlertTriangle,
  HelpCircle,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Settings,
  Bell,
  X,
  Sparkles,
  ArrowRight,
  LucideIcon,
  RefreshCw,
  Home,
  Building2,
  Compass,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Anchor,
  FileCheck2,
} from "lucide-react";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import {
  getStoredRequests,
  getStoredNotifications,
  subscribeToStore,
} from "@/lib/store";
import {
  initialRequests,
  initialNotifications,
} from "@/lib/mockData";
import { PartRequest, CustomerNotification } from "@/lib/types";

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

export default function OperationsPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [requests, setRequests] = useState<PartRequest[]>(initialRequests);
  const [notifications, setNotifications] = useState<CustomerNotification[]>(initialNotifications);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    setRequests(getStoredRequests());
    setNotifications(getStoredNotifications());

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
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
        setActionDropdownOpen(false);
        setHelpModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute active badge counts for Operations
  const activeShipmentsCount = requests.filter(
    (r) =>
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "SUPPLIER_DISPATCHED" ||
      r.status === "RECEIVED_AT_SHIPPING_FACILITY" ||
      r.status === "IN_TRANSIT" ||
      r.status === "ARRIVED_IN_NZ" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  ).length;

  const inTransitCount = requests.filter((r) => r.status === "IN_TRANSIT").length;

  const exceptionsCount = requests.filter(
    (r) => r.status === "LOGISTICS_EXCEPTION"
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length || 2;

  // Derive dynamic page title
  const getPageTitle = () => {
    if (pathname === "/operations") return "Operations Command Center";
    if (pathname === "/operations/shipments") return "Active Consignments & Shipment Records";
    if (pathname === "/operations/freight") return "Freight Management & Override Desk";
    if (pathname === "/operations/lifecycle") return "Logistics Lifecycle & Milestones";
    if (pathname === "/operations/exceptions") return "Logistics Exceptions & Resolution";
    if (pathname === "/operations/settings") return "Logistics Hub & Carrier Settings";
    return "Operations Portal";
  };

  const navGroups: NavGroup[] = [
    {
      group: "LOGISTICS COMMAND",
      items: [
        { label: "Dashboard", href: "/operations", icon: LayoutDashboard },
        {
          label: "Consignments",
          href: "/operations/shipments",
          icon: Package,
          badge: activeShipmentsCount,
          badgeColor: "bg-[#ed2025]",
        },
        {
          label: "Freight & Rates",
          href: "/operations/freight",
          icon: Calculator,
        },
        {
          label: "Lifecycle Stepper",
          href: "/operations/lifecycle",
          icon: Truck,
          badge: inTransitCount > 0 ? inTransitCount : undefined,
          badgeColor: "bg-[#ed2025]",
        },
        {
          label: "Logistics Exceptions",
          href: "/operations/exceptions",
          icon: AlertTriangle,
          badge: exceptionsCount > 0 ? exceptionsCount : undefined,
          badgeColor: "bg-rose-600",
        },
        {
          label: "Carrier & Port Config",
          href: "/operations/settings",
          icon: Settings,
        },
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
          r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.shipment?.trackingNumber &&
            r.shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (r.shipment?.carrier &&
            r.shipment.carrier.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row font-sans text-slate-900 antialiased selection:bg-[#ed2025] selection:text-white">
      {/* ================= LEFT SIDEBAR (DARK NAVY) ================= */}
      <aside
        className={`bg-[#070e1e] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/60">
            <Link href="/operations" className="flex items-center gap-2.5 overflow-hidden">
              {/* Autohub Red Cargo Logo */}
              <div className="w-8 h-8 rounded-xl bg-[#ed2025] shadow-md shadow-red-600/30 flex items-center justify-center text-white flex-shrink-0">
                <Truck className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <div className="text-base font-black tracking-tight text-white leading-none">
                    OPERAT<span className="text-[#ed2025]">ions</span>
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                    LOGISTICS &amp; FREIGHT
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

          {/* Primary Action Button: + CREATE SHIPMENT */}
          <div className="p-3 sm:p-4">
            <Link
              id="sidebar-create-shipment-button"
              href="/operations/shipments?action=create"
              className={`w-full py-3 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-red-950/40 transition flex items-center justify-center gap-2 ${
                sidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
              {!sidebarCollapsed && <span>CREATE SHIPMENT</span>}
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
                            ? "bg-slate-800/90 text-white font-bold shadow-sm border-l-2 border-[#ed2025]"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition ${
                              isActive ? "text-[#ed2025]" : "text-slate-400"
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

        {/* Bottom User Profile Section (Liam Patel - Logistics Coordinator) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Autohub Red Avatar LP */}
              <div className="w-8 h-8 rounded-full bg-[#ed2025] text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                LP
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    Liam Patel
                  </div>
                  <div className="text-[10px] text-[#ed2025] font-semibold truncate">
                    Logistics Coordinator
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
                <div className="font-bold text-white">Autohub International Logistics</div>
                <div className="text-slate-400 font-mono text-[10px]">Hub: AKL Cargo &amp; Ports of Auckland</div>
              </div>

              <Link
                href="/operations/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Settings className="w-3.5 h-3.5 text-[#ed2025]" />
                <span>Logistics Settings</span>
              </Link>

              <Link
                href="/procurement"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Procurement Sourcing Desk</span>
              </Link>

              <Link
                href="/portal"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Trade Customer Portal</span>
              </Link>

              <Link
                href="/"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Public Website</span>
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
        {/* Top Header Bar matching procurement aesthetic */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 min-h-[64px] py-2.5 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Breadcrumb & Title */}
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-0.5 leading-none">
              <Link
                href="/"
                className="hover:text-slate-900 transition flex items-center gap-1 text-slate-500"
                title="Return to Public Website"
              >
                <span>Home</span>
              </Link>
              <span className="text-slate-400">/</span>
              <Link
                href="/operations"
                className="hover:text-slate-900 transition text-slate-600 font-medium"
              >
                Operations
              </Link>
              {pathname !== "/operations" && (
                <>
                  <span className="text-slate-400">/</span>
                  <span className="text-[#ed2025] font-semibold truncate max-w-[200px]">
                    {pathname.replace("/operations/", "").toUpperCase()}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Header Controls: Live status, Search, Bell, Quick Actions, Persona Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Live Corridor Status Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Air &amp; Sea Corridors Active</span>
            </div>

            {/* Global Search Button (⌘K) */}
            <button
              id="global-search-trigger"
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs font-medium transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search waybill, VIN, part...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                id="operations-quick-actions-button"
                type="button"
                onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {actionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-scaleIn">
                  <Link
                    href="/operations/shipments?action=create"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <Package className="w-4 h-4 text-[#ed2025]" />
                    <span>Create Shipment Record</span>
                  </Link>
                  <Link
                    href="/operations/freight"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <Sliders className="w-4 h-4 text-[#ed2025]" />
                    <span>Override Freight Calculation</span>
                  </Link>
                  <Link
                    href="/operations/lifecycle"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Update Lifecycle Milestone</span>
                  </Link>
                  <Link
                    href="/operations/exceptions"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-medium transition"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Raise Logistics Exception</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ed2025]" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-scaleIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="font-bold text-slate-900 text-sm">
                      Logistics Alerts &amp; Events
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#ed2025]">
                      Live Feed
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 truncate">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2 text-[11px]">
                          {notif.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <Link
                      href="/operations/shipments"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[#ed2025] hover:underline font-semibold"
                    >
                      View All Consignments →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Component */}
            <div className="border-l border-slate-200 pl-3">
              <PersonaSwitcher variant="light" />
            </div>
          </div>
        </header>

        {/* Main View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1700px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= ⌘K SEARCH MODAL ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search waybill, tracking number, VIN, vehicle or part name..."
                className="w-full bg-transparent border-none outline-none text-slate-900 text-sm font-medium placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-3">
              {searchQuery.trim() === "" ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Type an order reference (e.g. <span className="font-mono text-[#ed2025]">AH-P-000125</span>),
                  carrier, tracking number, or customer name to locate consignment records.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No logistics consignments found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((r) => (
                    <Link
                      key={r.id}
                      href={`/operations/lifecycle?id=${r.id}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-red-50/50 border border-slate-100 hover:border-red-200/80 transition group"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-[#ed2025]">
                            {r.referenceNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {r.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {r.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {r.vehicle.year} {r.vehicle.make} {r.vehicle.model} • {r.customerName}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {r.shipment ? (
                          <div className="text-xs font-mono font-bold text-[#ed2025]">
                            {r.shipment.carrier}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">No Waybill Yet</div>
                        )}
                        <span className="text-[10px] text-slate-400">Click to inspect →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">ESC</kbd> to close</span>
              <span>Quick Logistics Lookup</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= HELP & SYSTEM INFO MODAL ================= */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#ed2025] flex items-center justify-center font-bold">
                  ?
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Operations &amp; Logistics Desk Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900">Freight Management</div>
                <p>
                  Manage baseline transit times and NZD pricing for Air Express and Consolidated Sea Freight. Override calculations per request when bespoke charter or freight partner arrangements apply.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900">Consignments &amp; 6-Stage Lifecycle</div>
                <p>
                  Generate shipment records, specify international carrier and tracking waybill (displayed live to the trade customer), and advance through:
                  <br />
                  <span className="font-mono font-medium text-slate-700">
                    Received At Facility → In Transit → Arrived In NZ → Customs Clearance → Out For Delivery → Delivered.
                  </span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900">Delivery Confirmation &amp; Exceptions</div>
                <p>
                  Capture recipient signatures and POD docket numbers on arrival. Flag exceptions (Customs holds, flight delays, packaging damage) with reasons and resolution workflows.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
