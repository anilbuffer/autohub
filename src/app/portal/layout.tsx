"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  MapPin,
  CreditCard,
  Building2,
  Bell,
  Search,
} from "lucide-react";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { getStoredCustomers, subscribeToStore } from "@/lib/store";
import { TradeCustomer } from "@/lib/types";

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [customer, setCustomer] = useState<TradeCustomer | null>(null);

  useEffect(() => {
    const customers = getStoredCustomers();
    setCustomer(customers[0]);
    const unsub = subscribeToStore(() => {
      const updated = getStoredCustomers();
      setCustomer(updated[0]);
    });
    return unsub;
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/portal", icon: LayoutDashboard },
    { label: "+ New Request", href: "/portal/new-request", icon: PlusCircle, isHighlight: true },
    { label: "Request History", href: "/portal/requests", icon: Clock },
    { label: "Address Book", href: "/portal/settings", icon: MapPin },
  ];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Customer Header Strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Account Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-autohub-navy text-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    {customer?.tradingName || "Apex Motors Auckland"}
                  </h2>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Approved Trade
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  NZBN: {customer?.nzbn || "9429041234567"} • Primary: {customer?.primaryContact.name || "Marcus Vance"}
                </p>
              </div>
            </div>

            {/* Credit Line & Actions */}
            <div className="flex items-center gap-4 text-xs">
              {/* Trade Credit Status */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-autohub-navy" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Trade Credit Line</span>
                  <span className="font-bold text-slate-800">
                    ${(customer?.billingDetails.creditAvailableNzd || 18450).toLocaleString()} NZD{" "}
                    <span className="text-slate-400 font-normal">avail. of ${(customer?.billingDetails.creditLimitNzd || 25000).toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Portal Persona Switcher */}
              <PersonaSwitcher />
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    link.isHighlight
                      ? "bg-autohub-red text-white hover:bg-autohub-red-dark shadow-sm"
                      : isActive
                      ? "bg-autohub-navy text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
