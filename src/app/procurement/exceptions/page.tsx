"use client";

import React, { Suspense } from "react";
import { ProcurementDashboardContent } from "../page";

export default function SourcingExceptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mx-auto mb-3" />
          <span>Loading Sourcing Exceptions...</span>
        </div>
      }
    >
      <ProcurementDashboardContent defaultTab="exceptions" />
    </Suspense>
  );
}
