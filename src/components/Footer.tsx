"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Anchor, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { ProcurlyLogo } from "./ProcurlyLogo";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname === "/login" || pathname?.startsWith("/portal")) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-0 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <ProcurlyLogo size="md" theme="dark" />
            <p className="text-slate-400 leading-relaxed text-xs">
              Autohub acts as the Coordination Layer, Procurement Facilitator, and Logistics Enabler for New Zealand&apos;s automotive trade.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Door-to-Door Guaranteed Logistics</span>
            </div>
          </div>

          {/* Col 2: Business Model Notice */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Procurement Model
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Procurly is not an open parts catalogue. We source OEM genuine, reconditioned, and aftermarket parts on-demand across global supplier networks with landed cost transparency.
            </p>
            <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
              <li>• Direct Japan OEM & European Hubs</li>
              <li>• Air Express & Sea Consolidated Freight</li>
              <li>• Full New Zealand Customs & MPI Handling</li>
            </ul>
          </div>

          {/* Col 3: Quick Portals */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Trade Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="text-autohub-red hover:underline font-bold">
                  Open Trade Account (NZBN)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Trade Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-white transition">
                  Forgot Password / Reset
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition">
                  Customer Trade Portal
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Procurement Terms & Conditions (v2025.2)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy (NZ Privacy Act 2020)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: New Zealand Offices */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Autohub NZ Operations
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-autohub-red flex-shrink-0 mt-0.5" />
                <span>Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-autohub-red flex-shrink-0 mt-0.5" />
                <span>Christchurch Logistics Depot: 112 Blenheim Road, Riccarton</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+64 9 274 5422</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>procurement@autohub.co.nz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Autohub New Zealand Limited. All rights reserved. NZBN: 9429041234567.
          </div>
          <div className="flex items-center gap-4">
            <span>Compliant with NZ Privacy Act 2020</span>
            <span>•</span>
            <span>Goods & Services Tax Act 1985 (15% GST)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
