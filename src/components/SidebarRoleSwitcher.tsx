"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types";
import { setActiveRole } from "@/lib/store";
import {
  Building2,
  Compass,
  Truck,
  Banknote,
  Shield,
  Check,
} from "lucide-react";

interface RoleConfig {
  id: UserRole;
  label: string;
  deskName: string;
  deskUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "CUSTOMER",
    label: "Trade Customer",
    deskName: "Customer Portal",
    deskUrl: "/portal",
    icon: Building2,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "SOURCING_SPECIALIST",
    label: "Sourcing Specialist",
    deskName: "Procurement Desk",
    deskUrl: "/procurement",
    icon: Compass,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "LOGISTICS_COORDINATOR",
    label: "Logistics Coordinator",
    deskName: "Operations Desk",
    deskUrl: "/operations",
    icon: Truck,
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "FINANCE_OFFICER",
    label: "Finance Officer",
    deskName: "Finance & Treasury",
    deskUrl: "/finance",
    icon: Banknote,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "SYSTEM_ADMIN",
    label: "System Administrator",
    deskName: "Admin & Control",
    deskUrl: "/admin",
    icon: Shield,
    iconColor: "text-[#ed2025]",
    bgColor: "bg-red-500/10",
  },
];

interface SidebarRoleSwitcherProps {
  currentRole: UserRole;
  onClose: () => void;
}

export const SidebarRoleSwitcher: React.FC<SidebarRoleSwitcherProps> = ({
  currentRole,
  onClose,
}) => {
  const router = useRouter();

  const handleSelectRole = (role: UserRole, url: string) => {
    setActiveRole(role);
    onClose();
    router.push(url);
  };

  return (
    <div className="py-1 space-y-1">
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>Switch Active Role</span>
        <span className="text-[9px] text-slate-500 font-normal">5 Portals</span>
      </div>

      <div className="space-y-0.5">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const isActive = r.id === currentRole;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleSelectRole(r.id, r.deskUrl)}
              className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-all ${
                isActive
                  ? "bg-slate-800 text-white font-bold border border-slate-700 shadow-xs"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? "bg-[#ed2025] text-white" : `${r.bgColor} ${r.iconColor}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-semibold leading-tight truncate">
                    {r.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate">
                    {r.deskName}
                  </div>
                </div>
              </div>

              {isActive ? (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#ed2025] text-white tracking-wider ml-1 flex-shrink-0">
                  Active
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 hover:text-slate-300 font-mono">
                  →
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
