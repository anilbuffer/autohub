"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Compass,
  Truck,
  Banknote,
  Users,
  Settings,
  LayoutDashboard,
  Search,
  Bell,
} from "lucide-react";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { getStoredRequests, subscribeToStore } from "@/lib/store";
import { PartRequest } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [requests, setRequests] = useState<PartRequest[]>([]);

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
    });
    return unsub;
  }, []);

  const sourcingCount = requests.filter(
    (r) => r.status === "SUBMITTED" || r.status === "SOURCING"
  ).length;
  const financeCount = requests.filter((r) => r.status === "AWAITING_PAYMENT").length;
  const logisticsCount = requests.filter(
    (r) =>
      r.status === "PAYMENT_CONFIRMED" ||
      r.status === "ORDERED_FROM_SUPPLIER" ||
      r.status === "IN_TRANSIT" ||
      r.status === "CUSTOMS_CLEARANCE" ||
      r.status === "OUT_FOR_DELIVERY"
  ).length;

  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Sourcing Desk", href: "/admin/sourcing", icon: Compass, badge: sourcingCount },
    { label: "Logistics Desk", href: "/admin/logistics", icon: Truck, badge: logisticsCount },
    { label: "Finance & Billing", href: "/admin/finance", icon: Banknote, badge: financeCount },
    { label: "Customer Approvals", href: "/admin/customers", icon: Users },
    { label: "System Config", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex-1 bg-slate-100 flex flex-col">
      {/* Staff Header Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-autohub-red text-white flex items-center justify-center font-bold shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    Autohub Operations Administration
                  </h2>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
                    Staff Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Coordination Layer • Sourcing Desk • Freight Dispatch • IRD Billing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PersonaSwitcher />
            </div>
          </div>

          {/* Role Desks Navigation */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800 overflow-x-auto text-xs font-semibold">
            {adminNav.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${isActive
                    ? "bg-autohub-navy text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive
                        ? "bg-autohub-red text-white"
                        : "bg-slate-700 text-slate-200"
                        }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Content Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
