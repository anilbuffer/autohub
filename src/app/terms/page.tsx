import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function TermsPage() {
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-autohub-red bg-red-50 px-2.5 py-0.5 rounded border border-red-100">
                Official Trade Policy • Version v2025.2
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Effective: 1 January 2025
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Autohub Procurly B2B Procurement Terms & Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Autohub New Zealand Limited • NZBN 9429041234567 • Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">1.</span>
              <span>Nature of the Service (Coordination Layer Principle)</span>
            </h3>
            <p>
              Autohub New Zealand Limited (&quot;Autohub&quot;) operates the Procurly platform exclusively as a B2B Coordination Layer, Procurement Facilitator, and Freight Logistics Enabler for approved automotive dealers, repair workshops, and fleet operators. Procurly is NOT an open online retail consumer store or catalog stockist. Autohub does not hold general consumer inventory in New Zealand; rather, it coordinates direct on-demand procurement from verified tier-1 overseas manufacturers and authorized distributors in Japan, Europe, the United States, and Australia matching the customer&apos;s vehicle VIN.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">2.</span>
              <span>Trade Eligibility & NZBN Verification</span>
            </h3>
            <p>
              Access to Procurly procurement services and wholesale quotation desks is strictly restricted to registered New Zealand business entities holding an active 13-digit New Zealand Business Number (NZBN) and valid GST registration. Autohub reserves the right to reject or suspend account access where company registration cannot be verified via the New Zealand Companies Office.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">3.</span>
              <span>Total Landed Cost Quotations & Validity</span>
            </h3>
            <p>
              Every quotation issued via the Procurly platform is denominated in New Zealand Dollars (NZD) and represents a comprehensive total landed cost structure. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Foreign supplier purchase cost (FOB currency conversion at verified wholesale spot rates).</li>
              <li>International priority air freight or ocean container consolidation charges.</li>
              <li>Maritime and aviation cargo transit insurance cover.</li>
              <li>New Zealand Customs Service import declaration entries and tariff classifications.</li>
              <li>Ministry for Primary Industries (MPI) biosecurity risk inspection fees.</li>
              <li>Autohub transparent coordination margin (12%).</li>
              <li>New Zealand Goods and Services Tax (15% GST) with full IRD tax invoice issued.</li>
            </ul>
            <p className="text-xs text-slate-500">
              All quotations are binding and valid for seven (7) calendar days from issuance, after which currency exchange rates or supplier price revisions may require requoting.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">4.</span>
              <span>Strict Payment Gate & Order Release Protocol</span>
            </h3>
            <p>
              To maintain absolute cross-border procurement integrity and protect suppliers against unbacked overseas commitments, NO PURCHASE ORDER will be transmitted to international factories or suppliers until the trade customer completes payment clearance. Payment may be executed via:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Direct bank transfer (NZ Domestic Wire with sequential procurement reference).</li>
              <li>Approved Autohub Trade Credit Facility (settlement on the 20th of the month following invoice).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">5.</span>
              <span>Freight Logistics & Door-to-Door Delivery (Incoterms 2020)</span>
            </h3>
            <p>
              All shipments coordinated through Procurly are managed under Delivered at Place (DAP) or Carriage and Insurance Paid To (CIP) terms (Incoterms 2020). Autohub handles overseas warehouse packing, international export clearance, air/sea freight, port transitional logistics, and local express courier delivery to the customer&apos;s nominated workshop bay. Risk of loss passes to the customer upon physical signed delivery at the customer&apos;s nominated depot.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">6.</span>
              <span>Fitment Guarantee & Auckland Return Recourse</span>
            </h3>
            <p>
              Autohub guarantees 100% correct fitment for all orders where the customer provided a complete and accurate 17-character VIN or Japanese chassis code prior to quotation approval. In the rare event that an incorrect part is supplied due to catalog or manufacturer discrepancy, Autohub provides full return recourse through our Auckland hub, replacing the assembly or refunding the full landed price without cost to the customer.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="text-autohub-red font-mono">7.</span>
              <span>Governing Law & Dispute Resolution</span>
            </h3>
            <p>
              These Terms & Conditions are governed exclusively by the laws of New Zealand, including the Contract and Commercial Law Act 2017, the Customs and Excise Act 2018, and the Goods and Services Tax Act 1985. Any legal action or proceeding arising in connection with Procurly shall be brought exclusively before the courts of Auckland, New Zealand.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span>Need clarification regarding trade terms? Contact our Auckland legal desk: </span>
              <a href="mailto:legal@autohub.co.nz" className="text-autohub-navy font-bold hover:underline">
                legal@autohub.co.nz
              </a>
            </div>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-autohub-navy text-white font-bold rounded-xl text-xs hover:bg-autohub-navy-dark transition shadow self-start sm:self-auto"
            >
              Open Trade Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
