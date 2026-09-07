"use client";

import React, { Suspense } from "react";
import { ProcurementDashboardContent } from "../page";

export default function PurchaseOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 border border-slate-200 shadow-sm">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin mx-auto mb-3" />
          <span>Loading Purchase Order Placement Gate...</span>
        </div>
      }
    >
      <ProcurementDashboardContent defaultTab="orders" />
    </Suspense>
  );
}
