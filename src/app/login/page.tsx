"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProcurlyLogo } from "@/components/ProcurlyLogo";
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Building2,
  Compass,
  Truck,
  Banknote,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  KeyRound,
} from "lucide-react";
import {
  setActiveRole,
  getLockoutStatus,
  recordFailedLogin,
  clearFailedLogins,
} from "@/lib/store";
import { UserRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();

  // Selected workspace role for demo quick-access
  const [selectedRole, setSelectedRole] = useState<UserRole>("CUSTOMER");
  const [email, setEmail] = useState("james@autocareauckland.co.nz");
  const [password, setPassword] = useState("ProcurlyTrade2026!#");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // MFA state
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [mfaTimer, setMfaTimer] = useState(45);
  const [mfaError, setMfaError] = useState("");

  // Lockout state
  const [lockout, setLockout] = useState<{ isLocked: boolean; remainingMinutes: number; failedAttempts: number }>({
    isLocked: false,
    remainingMinutes: 0,
    failedAttempts: 0,
  });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setLockout(getLockoutStatus());
  }, []);

  // Countdown timer for MFA
  useEffect(() => {
    if (!showMfaModal || mfaTimer <= 0) return;
    const interval = setInterval(() => {
      setMfaTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showMfaModal, mfaTimer]);

  const rolesConfig = [
    {
      role: "CUSTOMER" as UserRole,
      title: "Customer",
      subtitle: "Trade Desk",
      persona: "James Wilson",
      org: "AutoCare Auckland",
      email: "james@autocareauckland.co.nz",
      badge: "DEALERSHIP / REPAIRER",
      icon: Building2,
      path: "/portal",
    },
    {
      role: "LOGISTICS_COORDINATOR" as UserRole,
      title: "Operations",
      subtitle: "Logistics & MPI",
      persona: "Liam Patel",
      org: "Autohub Auckland Terminal",
      email: "liam.p@autohub.co.nz",
      badge: "AIR & SEA FREIGHT",
      icon: Truck,
      path: "/operations",
    },
    {
      role: "SOURCING_SPECIALIST" as UserRole,
      title: "Procurement",
      subtitle: "Sourcing Desk",
      persona: "Nathan Cole",
      org: "Autohub Nagoya Hub",
      email: "nathan.c@autohub.co.nz",
      badge: "GLOBAL OEM SOURCING",
      icon: Compass,
      path: "/procurement",
    },
    {
      role: "FINANCE_OFFICER" as UserRole,
      title: "Finance",
      subtitle: "Billing & Credit",
      persona: "Clara Jenkins",
      org: "Autohub Finance NZ",
      email: "clara.j@autohub.co.nz",
      badge: "CREDIT & SETTLEMENTS",
      icon: Banknote,
      path: "/finance",
    },
  ];

  const currentRoleConfig = rolesConfig.find((r) => r.role === selectedRole) || rolesConfig[0];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const cfg = rolesConfig.find((r) => r.role === role);
    if (cfg) {
      setEmail(cfg.email);
    }
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Check lockout first
    const status = getLockoutStatus();
    if (status.isLocked) {
      setLockout(status);
      setAuthError(`Account temporarily locked due to 5 failed attempts. Please wait ${status.remainingMinutes} minutes.`);
      return;
    }

    // Trigger MFA challenge step
    setShowMfaModal(true);
    setMfaTimer(45);
    setMfaError("");
  };

  const handleMfaChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...mfaCode];
    newCode[index] = value;
    setMfaCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = mfaCode.join("");

    // Test valid code (any 6 digit or standard demo 849201)
    if (entered.length < 6) {
      setMfaError("Please enter the complete 6-digit MFA verification code.");
      return;
    }

    // Success
    clearFailedLogins();
    setActiveRole(selectedRole);
    router.push(currentRoleConfig.path);
  };

  const handleSimulateFailedAttempt = () => {
    const updatedLockout = recordFailedLogin();
    setLockout(updatedLockout);
    if (updatedLockout.isLocked) {
      setAuthError(`Security lockout triggered: 5 failed attempts. Account locked for 15 minutes.`);
      setShowMfaModal(false);
    } else {
      setAuthError(`Invalid authentication credential. Failed attempt ${updatedLockout.failedAttempts} of 5.`);
    }
  };

  const handleAutoFillMfa = () => {
    setMfaCode(["8", "4", "9", "2", "0", "1"]);
    setMfaError("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#070e1e] font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* ================= LEFT COLUMN: BRANDING & ROLE SELECTOR ================= */}
      <div className="w-full lg:w-[56%] bg-[#070e1e] flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Select Workspace Role */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold tracking-wider uppercase text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SELECT WORKSPACE ROLE:</span>
            </div>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Auto-fills credentials & portal destinations
            </span>
          </div>

          {/* 4 Role Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {rolesConfig.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleSelectRole(item.role)}
                  className={`relative p-3 rounded-2xl text-left transition-all duration-200 border ${
                    isSelected
                      ? "bg-[#0b162c] border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.2)] ring-1 ring-cyan-400/50"
                      : "bg-[#0a1224]/80 border-slate-800/80 hover:border-slate-700 hover:bg-[#0d172e] text-slate-400"
                  }`}
                >
                  {/* Selected Indicator Dot */}
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  )}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center mb-2.5 transition ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-800/60 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle Hero Section */}
        <div className="relative z-10 my-10 sm:my-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Autohub Enterprise Logistics Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
            INTELLIGENT PARTS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              SOURCING & FREIGHT.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Automate vehicle parts procurement across Japan, Europe & USA. Generate instant landed NZD quotations with MPI biosecurity compliance and track door-to-door delivery with enterprise precision.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MPI & Customs Compliant</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Rapid Air & Sea Freight</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium">
              <Banknote className="w-4 h-4 text-amber-400" />
              <span>20th Month Trade Credit</span>
            </div>
          </div>
        </div>

        {/* Bottom Status & Trust Banner */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            {/* Round Avatar Badges */}
            <div className="flex -space-x-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-[9px] font-black text-white flex items-center justify-center ring-2 ring-[#070e1e]">
                NZ
              </span>
              <span className="w-6 h-6 rounded-full bg-rose-600 text-[9px] font-black text-white flex items-center justify-center ring-2 ring-[#070e1e]">
                AH
              </span>
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#070e1e]">
                50+
              </span>
            </div>
            <div>
              <span className="text-white font-bold block leading-tight">
                Trusted by 500+ NZ Dealerships & Repairers
              </span>
              <span className="text-[11px] text-slate-400">
                Backed by Autohub Global Logistics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems Normal • MPI API v2.4</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: SIGN IN CARD ================= */}
      <div className="w-full lg:w-[44%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-slate-900 relative">
        {/* Top Header: Logo + Badges */}
        <div className="flex items-center justify-between pb-8">
          <Link href="/" className="group">
            <ProcurlyLogo size="md" />
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>MFA Ready</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono text-[11px] font-medium">
              v2.4
            </span>
          </div>
        </div>

        {/* Main Content Area: Form */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto">
          {/* Welcome Text */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Sign In</span>
              <span className="text-2xl">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Select a workspace role above or enter credentials. Two-Factor Authentication (MFA) will verify next.
            </p>
          </div>

          {/* Account Lockout Banner */}
          {lockout.isLocked && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 animate-shake">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Security Notice: Account Temporarily Locked</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                5 consecutive unverified attempts detected. Access is restricted for <strong>{lockout.remainingMinutes} minutes</strong> to safeguard your trade account.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  Assistance: +64 9 274 5422
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearFailedLogins();
                    setLockout({ isLocked: false, remainingMinutes: 0, failedAttempts: 0 });
                    setAuthError("");
                  }}
                  className="text-[10px] font-bold text-rose-700 underline hover:text-rose-900"
                >
                  Reset Lockout (Dev Testing)
                </button>
              </div>
            </div>
          )}

          {/* Active Role Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                <currentRoleConfig.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Role:</span>
                  <span className="text-rose-600 font-bold">{currentRoleConfig.title}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {currentRoleConfig.subtitle} • {currentRoleConfig.persona}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {currentRoleConfig.badge}
            </span>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={lockout.isLocked}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Complexity: Strong
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockout.isLocked}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="font-semibold text-slate-700 hover:text-rose-600 transition"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Error Message */}
            {authError && !lockout.isLocked && (
              <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Primary Sign In Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={lockout.isLocked}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span>SIGN IN TO WORKSPACE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </form>

          {/* Lockout Simulator for Testing */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleSimulateFailedAttempt}
              className="text-[10px] text-slate-400 hover:text-slate-600 transition flex items-center justify-center gap-1 mx-auto"
            >
              <span>[Test Security Feature: Simulate Failed Attempt ({lockout.failedAttempts}/5)]</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white px-3 text-slate-400">
                NEW TO PROURLY?
              </span>
            </div>
          </div>

          {/* Create Account Secondary Button */}
          <Link
            id="login-register-account-button"
            href="/register"
            className="w-full py-3 px-4 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>+ Create an account (Register Trade Portal)</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center text-[11px] text-slate-400">
          Copyright © 2026 PROCURly by Autohub NZ LLC. All rights reserved.
        </div>
      </div>

      {/* ================= MFA VERIFICATION MODAL ================= */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 animate-scaleIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Two-Factor Authentication (MFA)
              </h3>
              <p className="text-xs text-slate-500">
                A 6-digit code has been dispatched to your registered authenticator device for <strong>{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyMfa} className="space-y-4">
              {/* 6 Digit Inputs */}
              <div className="flex justify-center gap-2 sm:gap-2.5">
                {mfaCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`mfa-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaChange(idx, e.target.value)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold rounded-xl border border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                ))}
              </div>

              {mfaError && (
                <div className="text-xs text-rose-600 font-semibold text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{mfaError}</span>
                </div>
              )}

              {/* Countdown & Resend */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Code expires in: <strong>0:{mfaTimer.toString().padStart(2, "0")}</strong></span>
                <button
                  type="button"
                  onClick={() => setMfaTimer(45)}
                  disabled={mfaTimer > 0}
                  className="text-rose-600 font-semibold hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Resend Code
                </button>
              </div>

              {/* Demo 1-Click Autofill */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Demo One-Click MFA:</span>
                <button
                  type="button"
                  onClick={handleAutoFillMfa}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-bold text-[10px] hover:bg-slate-800 transition"
                >
                  Autofill &apos;849201&apos;
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMfaModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  id="mfa-verify-submit-button"
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Proceed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
