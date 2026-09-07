import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-autohub-navy hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              NZ Privacy Act 2020 Compliant
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">
              Privacy Policy & Personal Information Notice
            </h1>
            <p className="text-slate-500 mt-1">
              Autohub New Zealand Limited • Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">1. Purpose and Scope</h3>
            <p>
              This policy outlines how Autohub New Zealand Limited collects, holds, uses, and discloses business and contact information in compliance with the New Zealand Privacy Act 2020 and the Information Privacy Principles (IPPs).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">2. Information We Collect</h3>
            <p>
              When trade customers register or utilize the Procurly portal, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Company details: NZBN, legal entity name, trading name, billing address, and GST registration.</li>
              <li>Authorized personnel details: Full name, business email address, phone numbers, and job titles.</li>
              <li>Procurement & logistics details: Vehicle chassis/VIN numbers, registration plates, delivery workshop addresses, and proof-of-delivery signatures.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">3. Lawful Purpose for Collection</h3>
            <p>
              Information is collected strictly to verify trade credentials, source vehicle parts from overseas suppliers, clear New Zealand Customs declarations, organize freight logistics, and issue GST-compliant tax invoices.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">4. Data Storage & Security</h3>
            <p>
              All customer, quotation, and vehicle data is stored securely using enterprise encryption in transit and at rest. Access is restricted according to strict role-based access control (RBAC).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
