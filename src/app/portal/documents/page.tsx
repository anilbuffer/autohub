"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderOpen,
  FileText,
  Download,
  Receipt,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Building2,
  ChevronRight,
} from "lucide-react";
import { getStoredRequests, getStoredCustomers, subscribeToStore } from "@/lib/store";
import { PartRequest, TradeCustomer, TaxInvoice } from "@/lib/types";
import { InvoiceViewer } from "@/components/InvoiceViewer";

export default function DocumentsVaultPage() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [customer, setCustomer] = useState<TradeCustomer | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<{ invoice: TaxInvoice; request: PartRequest } | null>(null);
  const [search, setSearch] = useState("");
  const [docCategory, setDocCategory] = useState<"ALL" | "INVOICES" | "RECEIPTS" | "CUSTOMS">("ALL");

  useEffect(() => {
    setRequests(getStoredRequests());
    const custs = getStoredCustomers();
    if (custs.length > 0) setCustomer(custs[0]);

    const unsub = subscribeToStore(() => {
      setRequests(getStoredRequests());
      const updatedCusts = getStoredCustomers();
      if (updatedCusts.length > 0) setCustomer(updatedCusts[0]);
    });
    return unsub;
  }, []);

  const invoicedRequests = requests.filter((r) => r.invoice || r.quote);

  // Generate document entries list
  const documents = invoicedRequests.flatMap((req) => {
    const inv: TaxInvoice = req.invoice || {
      invoiceNumber: `INV-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}`,
      receiptNumber: req.status === "DELIVERED" || req.status === "PAYMENT_CONFIRMED" || req.status === "COMPLETED" ? `REC-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}` : undefined,
      dateIssued: req.submittedDate,
      dueDate: req.submittedDate,
      customerName: req.customerName,
      customerNzbn: req.customerNzbn,
      customerGstNumber: "104-982-120",
      billingAddress: "42 Great South Road, Penrose, Auckland 1061",
      paymentMethod: "TRADE_CREDIT",
      paymentReference: req.referenceNumber,
      subtotalNzd: (req.quote?.totalNzd || 485) / 1.15,
      gstRate: 0.15,
      gstAmountNzd: (req.quote?.totalNzd || 485) - (req.quote?.totalNzd || 485) / 1.15,
      totalNzd: req.quote?.totalNzd || 485,
      status: req.status === "AWAITING_PAYMENT" ? "PENDING" : "PAID",
    };

    const docs = [];

    // Tax Invoice document
    docs.push({
      id: `DOC-INV-${req.id}`,
      title: `Tax Invoice ${inv.invoiceNumber}`,
      type: "INVOICES" as const,
      referenceNumber: req.referenceNumber,
      vehicle: `${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`,
      partName: req.part.partName,
      date: inv.dateIssued,
      amountNzd: inv.totalNzd,
      status: inv.status,
      invoice: inv,
      request: req,
    });

    // Official Receipt document (if paid)
    if (inv.receiptNumber || inv.status === "PAID" || req.status === "PAYMENT_CONFIRMED" || req.status === "DELIVERED") {
      docs.push({
        id: `DOC-REC-${req.id}`,
        title: `Official Payment Receipt ${inv.receiptNumber || `REC-2026-${req.referenceNumber.replace(/[^0-9]/g, "")}`}`,
        type: "RECEIPTS" as const,
        referenceNumber: req.referenceNumber,
        vehicle: `${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`,
        partName: req.part.partName,
        date: req.updatedDate || inv.dateIssued,
        amountNzd: inv.totalNzd,
        status: "PAID",
        invoice: inv,
        request: req,
      });
    }

    // Customs & Biosecurity release cert (for shipped or delivered items)
    if (req.shipment || req.status === "IN_TRANSIT" || req.status === "DELIVERED") {
      docs.push({
        id: `DOC-CUST-${req.id}`,
        title: `MPI Biosecurity & Customs Clearance Release [Entry: NZ-${req.referenceNumber.replace(/[^0-9]/g, "")}]`,
        type: "CUSTOMS" as const,
        referenceNumber: req.referenceNumber,
        vehicle: `${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`,
        partName: req.part.partName,
        date: req.submittedDate,
        amountNzd: inv.totalNzd,
        status: "CLEARED",
        invoice: inv,
        request: req,
      });
    }

    return docs;
  });

  const filteredDocs = documents.filter((doc) => {
    if (docCategory !== "ALL" && doc.type !== docCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.referenceNumber.toLowerCase().includes(q) ||
        doc.vehicle.toLowerCase().includes(q) ||
        doc.partName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Documents & Compliance Vault
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant access to New Zealand IRD compliant Tax Invoices, official receipts, and MPI biosecurity clearance records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/portal/payments"
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Billing & Account</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by reference, vehicle, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-autohub-navy/20 focus:border-autohub-navy"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: "ALL", label: "All Documents" },
            { id: "INVOICES", label: "Tax Invoices" },
            { id: "RECEIPTS", label: "Receipts" },
            { id: "CUSTOMS", label: "Customs & MPI" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setDocCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                docCategory === cat.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      doc.type === "INVOICES"
                        ? "bg-blue-50 text-blue-600"
                        : doc.type === "RECEIPTS"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {doc.type === "INVOICES" ? (
                      <FileText className="w-4 h-4" />
                    ) : doc.type === "RECEIPTS" ? (
                      <Receipt className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {doc.type === "INVOICES"
                        ? "Tax Invoice"
                        : doc.type === "RECEIPTS"
                        ? "Official Receipt"
                        : "MPI Compliance"}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                  {doc.referenceNumber}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                <div className="font-medium text-slate-900 truncate">
                  {doc.vehicle}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {doc.partName}
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-mono">
                  <span>NZD Total:</span>
                  <span className="font-bold text-slate-900">${doc.amountNzd.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">
                {new Date(doc.date).toLocaleDateString("en-NZ", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>

              <button
                onClick={() => setSelectedInvoice({ invoice: doc.invoice, request: doc.request })}
                className="px-3 py-1.5 bg-autohub-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Download className="w-3 h-3" />
                <span>Download / View</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tax Invoice & Receipt Modal Viewer */}
      {selectedInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice.invoice}
          request={selectedInvoice.request}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
