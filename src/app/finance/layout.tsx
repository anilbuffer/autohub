"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Landmark,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Settings,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Bell,
  X,
  Compass,
  Building2,
  Home,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  Scale,
  DollarSign,
  Receipt,
  LucideIcon,
  AlertTriangle,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredCustomers,
  getStoredTransactions,
  getStoredReconciliations,
  getStoredNotifications,
  subscribeToStore,
} from "@/lib/store";
import { PartRequest, TradeCustomer, CustomerNotification, FinancialTransaction, ReconciliationRecord } from "@/lib/types";

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

export default function FinancePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshAll = () => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    setTransactions(getStoredTransactions());
    setReconciliations(getStoredReconciliations());
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    refreshAll();
    const unsub = subscribeToStore(() => {
      refreshAll();
    });
    return unsub;
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute live badges
  const awaitingPaymentCount = requests.filter(
    (r) =>
      r.status === "AWAITING_PAYMENT" ||
      (r.invoice && (r.invoice.status === "PENDING" || r.invoice.status === "PARTIALLY_PAID"))
  ).length;

  const unreconciledCount = reconciliations.filter(
    (rec) => rec.status === "VARIANCE" || rec.status === "UNALLOCATED" || rec.status === "PENDING"
  ).length;

  const pendingCreditReviews = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL" || c.billingDetails.status === "SUSPENDED"
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.read).length || 2;

  // Derive dynamic page title
  const getPageTitle = () => {
    if (pathname === "/finance") return "Finance Command Center & Treasury Desk";
    if (pathname === "/finance/payments") return "Payments Queue & Bank Remittance Recording";
    if (pathname === "/finance/reconciliation") return "Payment Reconciliation & Bank Match Desk";
    if (pathname === "/finance/invoices") return "GST Tax Invoices & Payment Receipts";
    if (pathname === "/finance/credit") return "Trade Credit Management & Validation Gate";
    if (pathname === "/finance/refunds") return "Refund Processing & Credit Notes";
    if (pathname === "/finance/transactions") return "Financial Transactions Register & General Ledger";
    if (pathname === "/finance/reports") return "Financial Analytics, Revenue & Aging Reports";
    if (pathname === "/finance/settings") return "Billing Gateway, Bank & GST Rules";
    return "Finance Portal";
  };

  const navGroups: NavGroup[] = [
    {
      group: "BILLING & TREASURY",
      items: [
        { label: "Dashboard", href: "/finance", icon: LayoutDashboard },
        {
          label: "Payments Queue",
          href: "/finance/payments",
          icon: CreditCard,
          badge: awaitingPaymentCount,
          badgeColor: "bg-[#ed2025]",
        },
        {
          label: "Reconciliation",
          href: "/finance/reconciliation",
          icon: Scale,
          badge: unreconciledCount > 0 ? unreconciledCount : undefined,
          badgeColor: "bg-blue-600",
        },
        {
          label: "Invoices & Receipts",
          href: "/finance/invoices",
          icon: FileText,
        },
        {
          label: "Trade Credit Accounts",
          href: "/finance/credit",
          icon: Landmark,
          badge: pendingCreditReviews > 0 ? pendingCreditReviews : undefined,
          badgeColor: "bg-purple-600",
        },
        {
          label: "Refunds & Credit Notes",
          href: "/finance/refunds",
          icon: RotateCcw,
        },
        {
          label: "Transactions Ledger",
          href: "/finance/transactions",
          icon: BookOpen,
        },
        {
          label: "Financial Reports",
          href: "/finance/reports",
          icon: TrendingUp,
        },
        {
          label: "Finance Config",
          href: "/finance/settings",
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
          r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.invoice?.invoiceNumber &&
            r.invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (r.invoice?.receiptNumber &&
            r.invoice.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          r.part.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Link href="/finance" className="flex items-center gap-2.5 overflow-hidden">
              {/* Procurly 3D Box Logo */}
              <div className="w-8 h-8 rounded-xl bg-[#ed2025] shadow-md shadow-red-600/30 flex items-center justify-center text-white flex-shrink-0">
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
                    PROCUR<span className="text-[#ed2025]">ly</span>
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                    FINANCE &amp; BILLING PORTAL
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

          {/* Primary Action Button: RECORD PAYMENT */}
          <div className="p-3 sm:p-4">
            <Link
              id="sidebar-record-payment-button"
              href="/finance/payments?action=record"
              className={`w-full py-3 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-red-950/40 transition flex items-center justify-center gap-2 ${
                sidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
              {!sidebarCollapsed && <span>RECORD PAYMENT</span>}
            </Link>
          </div>

          {/* Navigation Items */}
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

                    return (
                      <Link
                        key={nav.label}
                        href={nav.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          sidebarCollapsed ? "justify-center" : ""
                        } ${
                          isActive
                            ? "bg-slate-800/90 text-white font-bold shadow-sm border-l-4 border-[#ed2025] pl-2.5"
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

        {/* Bottom User Profile Section (Clara Jenkins - Senior Finance Officer) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                CJ
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    Clara Jenkins
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold truncate">
                    Senior Finance Officer
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
                <div className="font-bold text-white">Autohub New Zealand Limited</div>
                <div className="text-slate-400 font-mono text-[10px]">
                  ANZ Trust: 06-0801-0498210-00
                </div>
              </div>

              <Link
                href="/finance/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Settings className="w-3.5 h-3.5 text-[#ed2025]" />
                <span>Finance &amp; GST Settings</span>
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
                href="/operations"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>Operations &amp; Freight Hub</span>
              </Link>

              <Link
                href="/portal"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
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
        {/* Top Header Bar */}
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
                href="/finance"
                className="hover:text-slate-900 transition text-slate-600 font-medium"
              >
                Finance
              </Link>
              {pathname !== "/finance" && (
                <>
                  <span className="text-slate-400">/</span>
                  <span className="text-[#ed2025] font-semibold truncate max-w-[200px]">
                    {pathname.replace("/finance/", "").toUpperCase()}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Live Gateway Status Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ANZ Remittance &amp; NZ IRD Gateway Active</span>
            </div>

            {/* Global Search Button (⌘K) */}
            <button
              id="global-search-trigger"
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 text-xs font-medium transition"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search invoice, order ref, client...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                id="finance-quick-actions-button"
                type="button"
                onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Actions</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/90" />
              </button>

              {actionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1 animate-scaleIn">
                  <Link
                    href="/finance/payments?action=record"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <CreditCard className="w-4 h-4 text-[#ed2025]" />
                    <span>Record Bank Remittance</span>
                  </Link>
                  <Link
                    href="/finance/credit"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <Landmark className="w-4 h-4 text-purple-600" />
                    <span>Validate Trade Credit Order</span>
                  </Link>
                  <Link
                    href="/finance/reconciliation"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>Reconcile Bank Statement Feed</span>
                  </Link>
                  <Link
                    href="/finance/invoices"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50/50 text-slate-700 hover:text-[#ed2025] font-medium transition"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Generate GST Tax Invoice</span>
                  </Link>
                  <Link
                    href="/finance/refunds"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-medium transition"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Process Customer Refund</span>
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
                      Billing &amp; Treasury Alerts
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
                      href="/finance/payments"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-[#ed2025] hover:underline font-semibold"
                    >
                      View Payments Queue →
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
                placeholder="Search invoice number, order ref, client name, or VIN..."
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
                  Type an invoice number (e.g.{" "}
                  <span className="font-mono text-[#ed2025]">INV-2026-00891</span>), order reference (e.g.{" "}
                  <span className="font-mono text-[#ed2025]">AH-P-000123</span>), or client name to locate billing records.
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No billing records found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((r) => (
                    <Link
                      key={r.id}
                      href={`/finance/payments?id=${r.id}`}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-red-50/50 border border-slate-100 hover:border-red-200/80 transition group"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-[#ed2025]">
                            {r.referenceNumber}
                          </span>
                          {r.invoice && (
                            <span className="font-mono text-[11px] text-slate-500">
                              • {r.invoice.invoiceNumber}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {r.invoice?.status || r.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {r.part.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {r.customerName} • {r.vehicle.year} {r.vehicle.make} {r.vehicle.model}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-mono font-black text-sm text-slate-900">
                          ${(r.invoice?.totalNzd || r.quote?.totalNzd || 0).toFixed(2)}
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">NZD Total</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
