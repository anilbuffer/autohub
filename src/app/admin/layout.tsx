"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  Bell,
  FileText,
  Clock,
  BarChart3,
  Database,
  Search,
  Plus,
  ChevronDown,
  LogOut,
  Sparkles,
  Compass,
  Truck,
  Banknote,
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  X,
  LucideIcon,
  Shield,
  Send,
  ExternalLink,
} from "lucide-react";
import {
  getStoredRequests,
  getStoredCustomers,
  getStoredStaffUsers,
  getStoredNotificationTemplates,
  getStoredM365Config,
  getAllSystemAuditLogs,
  subscribeToStore,
} from "@/lib/store";
import {
  PartRequest,
  TradeCustomer,
  StaffUser,
  NotificationTemplate,
  Microsoft365Config,
  AuditLogEntry,
} from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customers, setCustomers] = useState<TradeCustomer[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [m365Config, setM365Config] = useState<Microsoft365Config | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refresh = () => {
    setRequests(getStoredRequests());
    setCustomers(getStoredCustomers());
    setStaffUsers(getStoredStaffUsers());
    setTemplates(getStoredNotificationTemplates());
    setM365Config(getStoredM365Config());
    setAuditLogs(getAllSystemAuditLogs());
  };

  useEffect(() => {
    refresh();
    const unsub = subscribeToStore(() => {
      refresh();
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute live badges
  const pendingApprovalsCount = customers.filter(
    (c) => c.billingDetails.status === "PENDING_APPROVAL"
  ).length;

  const activeStaffCount = staffUsers.filter((u) => u.status === "ACTIVE").length;
  const activeTemplatesCount = templates.filter((t) => t.isActive).length;
  const auditEntriesCount = auditLogs.length;

  // Derive dynamic page title
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname === "/admin/staff") return "Staff & Roles";
    if (pathname === "/admin/customers") return "Customer Accounts";
    if (pathname === "/admin/settings") return "System Settings";
    if (pathname === "/admin/notifications") return "Notification Templates";
    if (pathname === "/admin/compliance") return "Terms & Policies";
    if (pathname === "/admin/audit") return "Audit Logs";
    if (pathname === "/admin/reports") return "Reports";
    if (pathname === "/admin/reference-data") return "Reference Data";
    return "Administrator Portal";
  };

  const navGroups: NavGroup[] = [
    {
      group: "SYSTEM CONTROL",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Staff & Roles",
          href: "/admin/staff",
          icon: ShieldCheck,
          badge: activeStaffCount,
          badgeColor: "bg-slate-700",
        },
        {
          label: "Customer Accounts",
          href: "/admin/customers",
          icon: Users,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: "bg-purple-600",
        },
        {
          label: "System Settings",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
    {
      group: "COMMUNICATIONS & POLICIES",
      items: [
        {
          label: "Notification Templates",
          href: "/admin/notifications",
          icon: Bell,
          badge: activeTemplatesCount,
          badgeColor: "bg-blue-600",
        },
        {
          label: "Terms & Policies",
          href: "/admin/compliance",
          icon: FileText,
          badge: "v2026",
          badgeColor: "bg-slate-700",
        },
      ],
    },
    {
      group: "DATA & AUDIT",
      items: [
        {
          label: "Audit Logs",
          href: "/admin/audit",
          icon: Clock,
          badge: auditEntriesCount,
          badgeColor: "bg-emerald-600",
        },
        {
          label: "Reports",
          href: "/admin/reports",
          icon: BarChart3,
        },
        {
          label: "Reference Data",
          href: "/admin/reference-data",
          icon: Database,
        },
      ],
    },
  ];

  // Search filtering
  const searchResults = searchQuery.trim()
    ? [
        ...staffUsers
          .filter(
            (u) =>
              u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
              u.role.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((u) => ({
            type: "Staff User",
            title: u.name,
            subtitle: `${u.role.replace(/_/g, " ")} • ${u.email}`,
            link: "/admin/staff",
          })),
        ...customers
          .filter(
            (c) =>
              c.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.nzbn.includes(searchQuery) ||
              c.businessType.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((c) => ({
            type: "Customer Account",
            title: c.tradingName,
            subtitle: `NZBN: ${c.nzbn} • ${c.billingDetails.status}`,
            link: "/admin/customers",
          })),
        ...templates
          .filter(
            (t) =>
              t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.trigger.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.subject.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((t) => ({
            type: "Notification Template",
            title: t.name,
            subtitle: `Trigger: ${t.trigger} • ${t.channel}`,
            link: "/admin/notifications",
          })),
        ...auditLogs
          .filter(
            (a) =>
              a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.actorName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
          .map((a) => ({
            type: "Audit Event",
            title: a.action,
            subtitle: `${a.actorName} (${a.actorRole}) • ${new Date(a.timestamp).toLocaleDateString()}`,
            link: "/admin/audit",
          })),
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-row font-sans text-slate-900 antialiased selection:bg-[#ed2025] selection:text-white">
      {/* ================= LEFT SIDEBAR (DARK NAVY #070e1e) ================= */}
      <aside
        className={`bg-[#070e1e] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/60">
            <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
              {/* 3D Box Logo */}
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
                    ADMINISTRATOR • SYSTEM CONTROL
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

          {/* Primary Action Button: + QUICK SYSTEM ACTION */}
          <div className="p-3 sm:p-4">
            <Link
              id="sidebar-primary-action-button"
              href="/admin/staff?action=create"
              className={`w-full py-3 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-red-950/40 transition flex items-center justify-center gap-2 ${
                sidebarCollapsed ? "px-2" : "px-4"
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
              {!sidebarCollapsed && <span>INVITE STAFF USER</span>}
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

        {/* Bottom User Profile Section (Sarah Jenkins - Chief Systems Administrator) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 relative">
          <div
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                SJ
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate leading-tight">
                    Sarah Jenkins
                  </div>
                  <div className="text-[10px] text-purple-400 font-medium truncate">
                    System Administrator
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
                <div className="font-bold text-white">Autohub System Control</div>
                <div className="text-slate-400 font-mono text-[10px]">Level 5 • Full Root Authority</div>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>System Settings</span>
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
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Logistics &amp; Freight Desk</span>
              </Link>

              <Link
                href="/finance"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finance &amp; Treasury Portal</span>
              </Link>

              <Link
                href="/portal"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white text-slate-300 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Trade Customer Portal</span>
              </Link>

              <div className="border-t border-slate-800 pt-1 mt-1">
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
            </div>
          )}
        </div>
      </aside>

      {/* ================= RIGHT MAIN LAYOUT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar matching user reference */}
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
                href="/admin"
                className="hover:text-slate-900 transition text-slate-600 font-medium"
              >
                Admin Control
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-[#ed2025] font-semibold truncate">
                {getPageTitle()}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right: Cross-Portal Links, Search, Primary Action, Notifications */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            {/* Quick Cross-Portal Links */}
            <Link
              href="/portal"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              title="Open Trade Customer Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer</span>
            </Link>

            <Link
              href="/procurement"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              title="Open Sourcing Desk"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Sourcing</span>
            </Link>

            <Link
              href="/finance"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              title="Open Finance Portal"
            >
              <Banknote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Finance</span>
            </Link>

            {/* Global Search Bar */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center justify-between w-56 sm:w-72 lg:w-80 px-3.5 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200 text-left transition group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
                <span className="text-xs text-slate-400 truncate font-normal">
                  Search staff, customers, audit, config...
                </span>
              </div>
              <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-slate-400 border border-slate-200 shadow-2xs ml-2">
                ⌘K
              </kbd>
            </button>

            {/* Primary Action Button: + Quick Action ▾ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-[#ed2025] hover:bg-[#d3181d] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Quick Action</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    actionDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Action Dropdown Menu */}
              {actionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-50 animate-scaleIn text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    System Control Actions
                  </div>
                  <Link
                    href="/admin/staff?action=create"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#ed2025]" />
                    <span>Invite Staff User</span>
                  </Link>
                  <Link
                    href="/admin/customers"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Review Customer Accounts</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span>Configure System Settings</span>
                  </Link>
                  <Link
                    href="/admin/notifications?action=create"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span>Create Notification Template</span>
                  </Link>
                  <Link
                    href="/admin/compliance?action=publish"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Publish New Policy</span>
                  </Link>
                  <Link
                    href="/admin/audit"
                    onClick={() => setActionDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition"
                  >
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span>Inspect Audit Logs</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ed2025] text-white text-[9px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-scaleIn text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">System Notifications</span>
                    <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                      SysAdmin Alerts
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {pendingApprovalsCount > 0 ? (
                      <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-purple-900 font-bold">
                          <span>Trade Account Approvals</span>
                          <span className="text-[10px] font-mono">{pendingApprovalsCount} Pending</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Automotive businesses waiting for NZBN and credit limit sign-off.
                        </p>
                        <Link
                          href="/admin/customers"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-[11px] font-bold text-purple-700 hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          <span>Open Approval Queue</span>
                          <span>→</span>
                        </Link>
                      </div>
                    ) : null}

                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-emerald-900 font-bold">
                        <span>Microsoft 365 Connected</span>
                        <span className="text-[10px] font-mono text-emerald-700">Healthy</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        OAuth2 Graph token verified. 284/10,000 daily emails sent.
                      </p>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-slate-900 font-bold">
                        <span>NZ Privacy Act 2020</span>
                        <span className="text-[10px] font-mono text-slate-500">v2026.2 Active</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        100% of active customer accounts acknowledged statutory terms.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Admin Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ================= GLOBAL SEARCH MODAL (⌘K) ================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scaleIn">
            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search staff, 5 roles, customers, NZBN, notification templates, audit logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm text-slate-900 placeholder-slate-400 bg-transparent border-none outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div className="text-xs text-slate-400 py-6 text-center space-y-2">
                  <p className="font-semibold text-slate-600">Quick Navigation Shortcuts</p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <Link
                      href="/admin/staff"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Staff &amp; Roles
                    </Link>
                    <Link
                      href="/admin/customers"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Customer Accounts
                    </Link>
                    <Link
                      href="/admin/settings"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      System Settings
                    </Link>
                    <Link
                      href="/admin/notifications"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Notification Templates
                    </Link>
                    <Link
                      href="/admin/compliance"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Terms &amp; Policies
                    </Link>
                    <Link
                      href="/admin/audit"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Audit Logs
                    </Link>
                    <Link
                      href="/admin/reports"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Reports
                    </Link>
                    <Link
                      href="/admin/reference-data"
                      onClick={() => setSearchModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                    >
                      Reference Data
                    </Link>
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matching system entities found for &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((res, idx) => (
                    <Link
                      key={idx}
                      href={res.link}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{res.title}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                            {res.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{res.subtitle}</p>
                      </div>
                      <span className="text-xs font-bold text-[#ed2025]">Open →</span>
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
