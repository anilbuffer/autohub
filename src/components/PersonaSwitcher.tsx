"use client";

import React, { useState, useEffect } from "react";
import { UserRole } from "@/lib/types";
import { getActiveRole, setActiveRole, subscribeToStore } from "@/lib/store";
import { Users, Shield, Compass, Truck, Banknote, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES: {
  id: UserRole;
  label: string;
  sublabel: string;
  deskUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: "CUSTOMER",
    label: "Trade Customer",
    sublabel: "Apex Motors Auckland",
    deskUrl: "/portal",
    icon: Building2,
    color: "bg-blue-600 text-white",
  },
  {
    id: "SOURCING_SPECIALIST",
    label: "Sourcing Desk",
    sublabel: "Nathan Cole (Procurement)",
    deskUrl: "/procurement",
    icon: Compass,
    color: "bg-amber-600 text-white",
  },
  {
    id: "LOGISTICS_COORDINATOR",
    label: "Logistics Desk",
    sublabel: "Liam Patel (Freight & Port)",
    deskUrl: "/admin/logistics",
    icon: Truck,
    color: "bg-cyan-700 text-white",
  },
  {
    id: "FINANCE_OFFICER",
    label: "Finance Desk",
    sublabel: "Billing & Credit Gate",
    deskUrl: "/admin/finance",
    icon: Banknote,
    color: "bg-emerald-700 text-white",
  },
  {
    id: "SYSTEM_ADMIN",
    label: "Admin & Approvals",
    sublabel: "Customer Queue & Settings",
    deskUrl: "/admin/customers",
    icon: Shield,
    color: "bg-slate-900 text-white",
  },
];

export const PersonaSwitcher: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>("CUSTOMER");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setCurrentRole(getActiveRole());
    const unsubscribe = subscribeToStore(() => {
      setCurrentRole(getActiveRole());
    });
    return unsubscribe;
  }, []);

  const handleSelectRole = (role: UserRole, url: string) => {
    setActiveRole(role);
    setCurrentRole(role);
    setIsOpen(false);
    router.push(url);
  };

  const activeConfig = ROLES.find((r) => r.id === currentRole) || ROLES[0];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="relative inline-block text-left z-50">
      {/* Switcher Button */}
      <button
        id="persona-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 transition shadow-sm border border-slate-700 text-xs font-medium"
        title="1-Click Role Switcher for Procurly B2B Demonstration"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-slate-400 font-normal">Active Role:</span>
        <span className="font-semibold text-white flex items-center gap-1.5">
          <ActiveIcon className="w-3.5 h-3.5 text-autohub-red" />
          {activeConfig.label}
        </span>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded ml-1 border border-slate-700">
          Switch
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 py-2.5 px-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-autohub-navy" />
                Select Persona to Experience Portal
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant 1-click role switcher across customer and 4 Autohub staff workflows.
              </p>
            </div>

            <div className="mt-1 space-y-1">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isCurrent = r.id === currentRole;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRole(r.id, r.deskUrl)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
                      isCurrent
                        ? "bg-autohub-navy/10 border border-autohub-navy/30 text-autohub-navy"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{r.label}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-autohub-navy text-white px-1.5 py-0.2 rounded font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {r.sublabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 px-3 flex justify-between items-center text-[11px] text-slate-400">
              <span>Procurly B2B Role Engine</span>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-autohub-red hover:underline font-semibold"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
