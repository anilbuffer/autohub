"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("autohub_nz_privacy_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("autohub_nz_privacy_consent", "accepted_" + new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-autohub-red flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-xs text-slate-300 leading-relaxed">
          <p className="font-bold text-white mb-0.5">
            New Zealand Privacy Act 2020 Compliance
          </p>
          <p>
            Procurly by Autohub uses essential session cookies to manage authenticated trade accounts, encrypted quote approvals, and logistics tracking.
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <button
              id="accept-privacy-cookie-button"
              onClick={handleAccept}
              className="px-3 py-1.5 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-lg text-xs font-bold transition shadow"
            >
              Acknowledge & Continue
            </button>
            <Link
              href="/privacy"
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
