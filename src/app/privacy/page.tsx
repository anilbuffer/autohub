import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileCheck, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-autohub-navy hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                New Zealand Privacy Act 2020 Compliant
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Updated: January 2025
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Privacy Policy & Personal Information Notice
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Autohub New Zealand Limited • Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013 • NZBN: 9429041234567
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">1.</span>
              <span>Commitment to the NZ Privacy Act 2020</span>
            </h3>
            <p>
              Autohub New Zealand Limited (&quot;Autohub&quot;, &quot;we&quot;, &quot;us&quot;) operates the Procurly platform in strict accordance with the New Zealand Privacy Act 2020 and its thirteen (13) Information Privacy Principles (IPPs). This Privacy Policy explains how we collect, use, store, disclose, and protect information collected from our trade customers, workshop personnel, and website visitors.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">2.</span>
              <span>Information We Collect & Lawful Purpose (IPPs 1, 2 & 3)</span>
            </h3>
            <p>
              We collect information strictly necessary to facilitate cross-border automotive parts procurement, customs clearance, and courier logistics:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>
                <strong>Business Entity Details:</strong> Registered company legal name, trading dealership name, New Zealand Business Number (NZBN), GST number, billing address, and website.
              </li>
              <li>
                <strong>Operational Contacts:</strong> Names, job titles, business email addresses, and direct telephone numbers for primary authorisers, accounts payable officers, and workshop goods inward personnel.
              </li>
              <li>
                <strong>Technical Vehicle & Delivery Data:</strong> 17-character Vehicle Identification Numbers (VIN), Japanese chassis codes, engine numbers, parts photos, workshop delivery addresses, and proof-of-delivery signatures.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">3.</span>
              <span>Data Storage, Security & Encryption (IPP 5)</span>
            </h3>
            <p>
              All customer records, quotations, and transaction data are protected using industry-standard TLS 1.3 encryption in transit and AES-256 encryption at rest. Access within Autohub is governed by strict role-based access controls (RBAC), multi-factor authentication (MFA), and audit logging.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">4.</span>
              <span>Cross-Border Disclosures (IPPs 11 & 12)</span>
            </h3>
            <p>
              To procure genuine parts on your behalf, we transmit necessary technical specifications (VIN, part OEM numbers, and required delivery timeframes) to verified international suppliers in Japan, Germany, and the United States. Under Principle 12 of the Privacy Act 2020, Autohub ensures that international overseas counterparties are bound by confidentiality obligations or comparable privacy protections. We never sell or commercially monetize customer contact information to third-party marketing brokers.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">5.</span>
              <span>Government Border Agencies & Regulatory Compliance</span>
            </h3>
            <p>
              As a licensed New Zealand Customs Broker and operator of MPI Biosecurity Transitional Facilities, Autohub is legally obligated under the Customs and Excise Act 2018 and the Biosecurity Act 1993 to declare consignee names, NZBN details, and import tariff classifications to the New Zealand Customs Service and the Ministry for Primary Industries.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">6.</span>
              <span>Access, Correction & Privacy Officer (IPPs 6 & 7)</span>
            </h3>
            <p>
              Under the Privacy Act 2020, you have the right to request access to any personal information we hold regarding your business personnel and to request corrections if any information is inaccurate. For privacy inquiries or to exercise your rights, please contact our designated Privacy Officer:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 mt-2">
              <p className="font-bold text-slate-900">Privacy Officer — Autohub New Zealand Limited</p>
              <p>Email: <a href="mailto:privacy@autohub.co.nz" className="text-autohub-navy font-semibold hover:underline">privacy@autohub.co.nz</a></p>
              <p>Postal: Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013</p>
              <p>Phone: +64 9 274 5422</p>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Compliant with the Office of the Privacy Commissioner (New Zealand)</span>
            <Link href="/terms" className="text-autohub-navy font-semibold hover:underline">
              View Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
