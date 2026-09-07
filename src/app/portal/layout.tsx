"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Truck,
  MessageSquare,
  CreditCard,
  FolderOpen,
  Bell,
  Settings,
  HelpCircle,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  LogOut,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  LucideIcon,
  Home,
  Compass,
} from "lucide-react";
import {
  getStoredCustomers,
  getStoredRequests,
  getStoredNotifications,
  subscribeToStore,
} from "@/lib/store";
import { TradeCustomer, PartRequest, CustomerNotification } from "@/lib/types";

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

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [customer, setCustomer] = useState<TradeCustomer | null>(null);
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  useEffect(() => {
    const custs = getStoredCustomers();
    setCustomer(custs[0] || null);
    setRequests(getStoredRequests());
    setNotifications(getStoredNotifications());

    const unsub = subscribeToStore(() => {
      const updatedCusts = getStoredCustomers();
      setCustomer(updatedCusts[0] || null);
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
        setHelpModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute active badge counts
  const actionRequiredCount = requests.filter(
    (r) => r.status === "AWAITING_CUSTOMER_APPROVAL" || r.status === "AWAITING_PAYMENT" || r.status === "PAYMENT_DISPUTED"
  ).length;

  const inTransitCount = requests.filter(
    (r) => r.status === "IN_TRANSIT" || r.status === "CUSTOMS_CLEARANCE" || r.status === "SUPPLIER_DISPATCHED"
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length || 3;

  // Derive dynamic page title
  const getPageTitle = () => {
    if (pathname === "/portal") return "Dashboard";
    if (pathname === "/portal/new-request") return "Submit New Part Request";
    if (pathname === "/portal/requests") return "Procurement Requests";
    if (pathname.startsWith("/portal/requests/")) return "Request Details";
    if (pathname === "/portal/orders") return "Approved Orders";
    if (pathname === "/portal/shipments") return "Shipment Tracking";
    if (pathname === "/portal/messages") return "Messages & Sourcing Inquiries";
    if (pathname === "/portal/payments") return "Payments & Trade Credit";
    if (pathname === "/portal/documents") return "Tax Invoices & Customs Records";
    if (pathname === "/portal/notifications") return "Notifications Inbox";
    if (pathname === "/portal/settings") return "Account Settings & Address Book";
    return "Customer Portal";
  };

  const navGroups: NavGroup[] = [
    {
      group: "MAIN",
      items: [
        { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
        { label: "Requests", href: "/portal/requests", icon: FileText, badge: actionRequiredCount || 3, badgeColor: "bg-rose-500" },
        { label: "Orders", href: "/portal/orders", icon: CheckSquare },
        { label: "Shipments", href: "/portal/shipments", icon: Truck, badge: inTransitCount || 2, badgeColor: "bg-blue-500" },
        { label: "Messages", href: "/portal/messages", icon: MessageSquare, badge: 2, badgeColor: "bg-blue-600" },
        { label: "Payments", href: "/portal/payments", icon: CreditCard },
        { label: "Documents", href: "/portal/documents", icon: FolderOpen },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        { label: "Notifications", href: "/portal/notifications", icon: Bell, badge: 24, badgeColor: "bg-slate-700" },
        { label: "Settings", href: "/portal/settings", icon: Settings },
      ],
    },
    {
      group: "SUPPORT",
      items: [
        { label: "Help & Support", href: "#help", icon: HelpCircle, isModal: true },
      ],
    },
  ];

  // Global search filtering
  const searchResults = searchQuery.trim()
    ? requests.filter(
        (r) =>
          r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Link href="/portal" className="flex items-center gap-2.5 overflow-hidden">
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
                    PROCUR<span className="text-autohub-red">ly</span>
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                    CUSTOMER PORTAL
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

          {/* Primary Action: + NEW PARTS REQUEST */}
          <div className="p-3 sm:p-4">
            <Link
              id="sidebar-new-request-button"
              href="/portal/new-request"
              className={`w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2 ${
                sidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
              {!sidebarCollapsed && <span>NEW PARTS REQUEST</span>}
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

        {/* Bottom User Profile Section */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {/* Blue Avatar JW */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                JW
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    James Wilson
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Customer
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
                <div className="font-bold text-white">AutoCare Auckland</div>
                <div className="text-slate-400 font-mono text-[10px]">NZBN: 9429041234567</div>
              </div>

              <Link
                href="/portal/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white transition"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings & Users</span>
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
                href="/admin"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Operations Admin Desk</span>
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
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 min-h-[64px] py-2.5 px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Left Title & Breadcrumbs */}
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
                href="/portal"
                className="hover:text-slate-900 transition text-slate-600 font-medium"
              >
                Customer Portal
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-rose-600 font-semibold truncate">
                {getPageTitle()}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
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
                <span>Search requests, orders or shipments...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-400 shadow-sm border border-slate-200">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions (Cross-Portal Links, Credit info, Help, Notifications) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Quick Sourcing Desk Link */}
            <Link
              href="/procurement"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              title="Open Procurement Sourcing Desk"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Sourcing Desk</span>
            </Link>

            <Link
              href="/"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              title="Return to Public Website"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Website</span>
            </Link>


            {/* Quick Credit Status Chip */}
            <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-500 text-[11px]">Trade Credit:</span>
              <span className="font-bold text-slate-800">
                ${(customer?.billingDetails?.creditAvailableNzd || 18450).toLocaleString()} NZD
              </span>
            </div>

            {/* Help Question Icon */}
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Help</span>
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Notifications</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                        {unreadNotifsCount} New
                      </span>
                    </div>
                    <Link
                      href="/portal/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[11px] text-rose-600 font-semibold hover:underline"
                    >
                      View All →
                    </Link>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-2xl text-xs transition border ${
                          notif.read
                            ? "bg-white border-slate-100 text-slate-500"
                            : "bg-blue-50/50 border-blue-100 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-[11px]">
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {notif.message}
                        </p>
                        {notif.linkUrl && (
                          <Link
                            href={notif.linkUrl}
                            onClick={() => setNotifDropdownOpen(false)}
                            className="inline-block mt-1 text-[10px] font-bold text-rose-600 hover:underline"
                          >
                            Open Request →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= COMMAND PALETTE / ⌘K SEARCH MODAL ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search requests by ID (AH-P-000123), VIN, make, model or part..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                  <p>Start typing to search automotive requests, quotes, or shipments.</p>
                  <p className="text-[11px] font-mono">Try searching &apos;Toyota&apos;, &apos;AH-P-000123&apos;, &apos;Hiace&apos;, or &apos;Control Arm&apos;</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No records matching &quot;<strong>{searchQuery}</strong>&quot;.
                </div>
              ) : (
                searchResults.map((r) => (
                  <Link
                    key={r.id}
                    href={`/portal/requests/${r.id}`}
                    onClick={() => setSearchModalOpen(false)}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          {r.referenceNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-semibold text-slate-700">
                          {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {r.part.partName}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">
                        ${r.quote?.totalNzd.toFixed(2) || "0.00"} NZD
                      </span>
                      <span className="text-[10px] text-rose-600 font-semibold">
                        View Details →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press <strong>ESC</strong> to close</span>
              <span>Autohub Precision Parts Sourcing</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= HELP & SUPPORT MODAL ================= */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Autohub Support Desk</h3>
                  <p className="text-[11px] text-slate-500">New Zealand Automotive Trade Assistance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Trade Procurement Hotline</span>
                <a href="tel:+6492745422" className="text-sm font-black text-slate-900 font-mono hover:text-rose-600 transition">
                  +64 9 274 5422
                </a>
                <p className="text-[11px] text-slate-500 mt-1">Available Monday - Friday, 7:30 AM - 5:30 PM NZST</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Biosecurity & MPI Clearance Desk</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Green Lane Auto-Clearance Active
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Direct inquiries: mpi-clearance@procurly.autohub.co.nz</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">General Sourcing Support</span>
                <p className="text-[11px] text-slate-700">Email: support@procurly.autohub.co.nz</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Depots: Auckland (Penrose) & Christchurch (Riccarton)</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHelpModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Close Support Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
