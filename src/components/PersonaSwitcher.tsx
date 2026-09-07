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
    label: "Operations Desk",
    sublabel: "Liam Patel (Logistics)",
    deskUrl: "/operations",
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

interface PersonaSwitcherProps {
  variant?: "dark" | "light";
  className?: string;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
  variant = "dark",
  className = "",
}) => {
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

  const isLight = variant === "light";

  return (
    <div className={`relative inline-block text-left z-50 ${className}`}>
      {/* Switcher Button */}
      <button
        id="persona-switcher-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition shadow-xs text-xs font-medium ${
          isLight
            ? "bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-300"
            : "bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700"
        }`}
        title="1-Click Role Switcher for Procurly B2B Demonstration"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className={isLight ? "text-slate-500 font-normal" : "text-slate-400 font-normal"}>
          Role:
        </span>
        <span className={`font-semibold flex items-center gap-1.5 ${isLight ? "text-slate-900" : "text-white"}`}>
          <ActiveIcon className="w-3.5 h-3.5 text-rose-600" />
          {activeConfig.label}
        </span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold ${
            isLight
              ? "bg-white text-slate-700 border border-slate-300"
              : "bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          Switch ▾
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
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
                    type="button"
                    onClick={() => handleSelectRole(r.id, r.deskUrl)}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-all ${
                      isCurrent
                        ? "bg-rose-50 border border-rose-200 text-slate-900"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{r.label}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
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

            <div className="mt-2 pt-2 border-t border-slate-100 px-3 flex justify-between items-center text-[11px] text-slate-500">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-slate-700 hover:text-slate-900 font-semibold hover:underline flex items-center gap-1"
              >
                <span>← Public Site</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="text-rose-600 hover:underline font-semibold"
              >
                Sign In Page →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
