import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-autohub-navy hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-autohub-red bg-red-50 px-2 py-0.5 rounded">
              Version v2025.1
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Autohub Procurly B2B Procurement Terms & Conditions
            </h1>
            <p className="text-slate-500 mt-1">
              Effective from 1 January 2025 • Autohub New Zealand Limited (NZBN 9429041234567)
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Nature of the Service</h3>
            <p>
              Autohub New Zealand Limited (&quot;Autohub&quot;) operates Procurly as a commercial coordination layer, procurement facilitator, and freight enabler. Procurly is NOT an open online retail catalogue and does not warrant holding general public inventory in New Zealand.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Request & Sourcing Workflow</h3>
            <p>
              When an approved trade customer submits a part request (specifying vehicle Make, Model, Year, VIN, and part parameters), Autohub queries its network of overseas suppliers (including Japan OEM, European specialists, Australian suppliers, and North American distributors) to obtain quotations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3. Landed Cost & Quotation Validity</h3>
            <p>
              Quotations issued via Procurly specify the total landed cost in New Zealand Dollars (NZD), including base supplier cost, Autohub coordination margin, international freight (Air Express or Sea Consolidated), and applicable New Zealand Goods and Services Tax (GST 15%). Quotes are valid for 7 calendar days from issuance.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">4. Payment Gate & Order Release</h3>
            <p>
              To maintain strict international procurement guarantees, NO PURCHASE ORDER will be transmitted to overseas suppliers until the trade customer completes payment clearance via direct bank transfer or executes the order against an approved Autohub Trade Credit facility.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">5. Freight, Customs & Delivery</h3>
            <p>
              Autohub manages export documentation, air/sea bills of lading, New Zealand Customs Service declarations, and Ministry for Primary Industries (MPI) biosecurity inspections. Local door-to-door delivery is undertaken by licensed courier partners. Risk of loss passes upon physical sign-off at the customer&apos;s specified delivery depot.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
