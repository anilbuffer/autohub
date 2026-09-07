"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, KeyRound } from "lucide-react";
import { ProcurlyLogo } from "@/components/ProcurlyLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("marcus@apexmotors.co.nz");
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const token = `AH-TOK-${Math.floor(100000 + Math.random() * 900000)}`;
    setDemoToken(token);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-autohub-navy transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Link href="/">
              <ProcurlyLogo size="md" />
            </Link>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Reset Trade Account Password
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Enter your approved B2B company email address to receive an encrypted password reset link.
          </p>
        </div>

        {/* Main Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Password Reset Instructions Dispatched
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  We have transmitted a secure reset token to <strong>{email}</strong>. This link expires in 30 minutes in accordance with our security protocols.
                </p>
              </div>

              {/* Demo Simulator Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-autohub-navy text-xs flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-autohub-red" />
                    <span>Demo Security Token</span>
                  </span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 text-autohub-navy font-bold">
                    {demoToken}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Click the button below to simulate opening the secure link from your email and setting a new password.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}&token=${demoToken}`}
                    className="w-full py-2.5 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Proceed to Reset Password Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Did not receive an email? Try another address
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Registered Trade Account Email *
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
                    placeholder="name@dealership.co.nz"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-autohub-navy focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must match the primary contact or portal login email registered with your NZBN.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white font-bold transition shadow flex items-center justify-center gap-2 text-xs"
              >
                <span>Send Reset Instructions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Need assistance? Contact Auckland Trade Desk: </span>
            <a href="tel:+6492745422" className="text-autohub-navy font-bold hover:underline">
              +64 9 274 5422
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
