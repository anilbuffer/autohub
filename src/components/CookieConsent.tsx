"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("autohub_nz_privacy_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "autohub_nz_privacy_consent",
      JSON.stringify({
        status: "accepted_all",
        timestamp: new Date().toISOString(),
        act: "NZ Privacy Act 2020",
        analytics: true,
      })
    );
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem(
      "autohub_nz_privacy_consent",
      JSON.stringify({
        status: "customized",
        timestamp: new Date().toISOString(),
        act: "NZ Privacy Act 2020",
        analytics: analyticsConsent,
      })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-lg z-50 bg-slate-900/95 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-autohub-red flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-xs">
              New Zealand Privacy Act 2020 Notice
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              IPP Compliant
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Autohub Procurly stores essential encrypted session data for trade verification, landed cost quoting, and MPI/Customs tracking. Under the NZ Privacy Act 2020, we protect your business and delivery records.
          </p>

          {showDetails && (
            <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">1. Essential Authentication & Freight Cookies</span>
                  <span className="text-slate-400 text-[10px]">Mandatory for portal security, MFA session, and quotation gates.</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Required</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div>
                  <span className="font-bold text-white block">2. Sourcing Performance & Analytics</span>
                  <span className="text-slate-400 text-[10px]">Optimises overseas catalogue latency and pricing accuracy.</span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="rounded text-autohub-red focus:ring-0 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
            <button
              id="accept-privacy-cookie-button"
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 bg-autohub-red hover:bg-autohub-red-dark text-white rounded-xl text-xs font-bold transition shadow"
            >
              Accept All & Continue
            </button>
            {showDetails ? (
              <button
                onClick={handleSaveCustom}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 transition"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white underline"
              >
                Customise
              </button>
            )}
            <Link
              href="/privacy"
              className="text-xs text-slate-400 hover:text-white underline ml-auto"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
