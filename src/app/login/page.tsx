"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, ArrowRight, Building2, Compass, Truck, Banknote, Shield } from "lucide-react";
import { setActiveRole } from "@/lib/store";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("marcus@apexmotors.co.nz");
  const [password, setPassword] = useState("••••••••••••");
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMfa) {
      setShowMfa(true);
      return;
    }
    setActiveRole("CUSTOMER");
    router.push("/portal");
  };

  const handleQuickRole = (role: UserRole, targetPath: string) => {
    setActiveRole(role);
    router.push(targetPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-2xl font-black text-autohub-navy">
            AUTO<span className="text-autohub-red">HUB</span>
            <span className="text-xs bg-autohub-red text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider ml-1">
              PROURLY
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Sign in to Your B2B Account
          </h2>
          <p className="text-xs text-slate-500">
            Approved Automotive Dealers & Trade Logistics Coordination
          </p>
        </div>

        {/* 1-Click Persona Simulator Box */}
        <div className="bg-gradient-to-br from-slate-900 to-autohub-navy text-white rounded-3xl p-5 shadow-xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-autohub-red flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-autohub-red" />
              Demo Persona Quick-Access
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-slate-200">
              1-Click
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Instantly preview and test the complete workflow as any stakeholder:
          </p>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => handleQuickRole("CUSTOMER", "/portal")}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-bold block">Trade Customer</span>
                  <span className="text-[10px] text-slate-300">Apex Motors (Requests, Quotes, Tracking)</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleQuickRole("SOURCING_SPECIALIST", "/admin/sourcing")}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-bold block">Sourcing Desk</span>
                  <span className="text-[10px] text-slate-300">Nathan Cole (AI Quotes & Supplier Sourcing)</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleQuickRole("LOGISTICS_COORDINATOR", "/admin/logistics")}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-bold block">Logistics Desk</span>
                  <span className="text-[10px] text-slate-300">Liam Patel (Freight, Milestones, Customs)</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => handleQuickRole("FINANCE_OFFICER", "/admin/finance")}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold block">Finance Desk</span>
                  <span className="text-[10px] text-slate-300">Clara Jenkins (Bank Transfer Gate & Tax Invoices)</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Account Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] text-autohub-red hover:underline font-semibold">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none font-mono"
                />
              </div>
            </div>

            {showMfa && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-autohub-navy">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Two-Factor Authentication (MFA)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Enter the 6-digit verification code from your authenticator app or test code <strong>123456</strong>:
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-center tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-autohub-navy"
                />
              </div>
            )}

            <button
              id="submit-login-button"
              type="submit"
              className="w-full py-3 rounded-xl bg-autohub-navy hover:bg-autohub-navy-dark text-white font-bold transition shadow flex items-center justify-center gap-2"
            >
              <span>{showMfa ? "Verify & Enter Portal" : "Sign In to Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            <span>Don&apos;t have an approved account yet? </span>
            <Link href="/register" className="text-autohub-red font-bold hover:underline">
              Register with NZBN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
