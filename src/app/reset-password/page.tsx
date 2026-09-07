"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, KeyRound } from "lucide-react";
import { ProcurlyLogo } from "@/components/ProcurlyLogo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "marcus@apexmotors.co.nz";
  const tokenParam = searchParams.get("token") || "AH-TOK-942904";

  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // Password Strength Logic
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const strengthScore = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Link href="/">
              <ProcurlyLogo size="md" />
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Set New Password
          </h1>
          <p className="text-xs text-slate-500">
            Create a secure password for your trade portal account.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {submitted ? (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Password Successfully Updated
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Your B2B account password has been reset. You can now sign in using your new credentials.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  id="return-to-login-button"
                  href="/login"
                  className="w-full py-3 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
                >
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              {/* Token Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 block font-semibold">Account</span>
                  <span className="font-bold text-slate-800">{email}</span>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold text-[10px]">
                  ✓ Valid Token
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password strength meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Password Security Strength</span>
                  <span
                    className={`font-bold ${
                      strengthScore <= 2
                        ? "text-rose-500"
                        : strengthScore === 3
                        ? "text-amber-500"
                        : "text-emerald-600"
                    }`}
                  >
                    {strengthScore <= 1 ? "Weak" : strengthScore <= 3 ? "Moderate" : "Strong"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  <div
                    className={`rounded-full ${
                      strengthScore >= 1 ? "bg-rose-500" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`rounded-full ${
                      strengthScore >= 2 ? "bg-amber-400" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`rounded-full ${
                      strengthScore >= 3 ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`rounded-full ${
                      strengthScore === 4 ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                  <span className={hasMinLength ? "text-emerald-600" : "text-slate-400"}>
                    {hasMinLength ? "✓" : "•"} 8+ characters
                  </span>
                  <span className={hasUpperLower ? "text-emerald-600" : "text-slate-400"}>
                    {hasUpperLower ? "✓" : "•"} Upper & lower case
                  </span>
                  <span className={hasNumber ? "text-emerald-600" : "text-slate-400"}>
                    {hasNumber ? "✓" : "•"} At least 1 number
                  </span>
                  <span className={hasSpecial ? "text-emerald-600" : "text-slate-400"}>
                    {hasSpecial ? "✓" : "•"} Special character (!@#)
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none font-mono"
                  />
                </div>
                {confirmPassword && (
                  <span
                    className={`text-[10px] mt-1 block font-semibold ${
                      passwordsMatch ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {passwordsMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white font-bold transition shadow flex items-center justify-center gap-2 text-xs"
              >
                <span>Confirm & Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading password reset...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
