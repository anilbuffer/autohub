"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
            System Alert
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            An Unexpected Portal Error Occurred
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our trade portal encountered an issue processing your request. Please try again or contact the Auckland operations desk.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-autohub-navy text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
