"use client";

import React from "react";
import { TaxInvoice, PartRequest } from "@/lib/types";
import { Printer, Download, CheckCircle2, ShieldCheck, X } from "lucide-react";

interface InvoiceViewerProps {
  invoice: TaxInvoice;
  request: PartRequest;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceViewer: React.FC<InvoiceViewerProps> = ({
  invoice,
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Modal Controls */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NZ IRD Compliant Tax Invoice & Official Procurement Record</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Document */}
        <div className="p-8 sm:p-10 overflow-y-auto print-only-area text-slate-800 bg-white">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-autohub-navy">
                  AUTOHUB
                </span>
                <span className="bg-autohub-red text-white text-xs font-bold px-2 py-0.5 rounded">
                  PROURLY
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Autohub New Zealand Limited
              </p>
              <p className="text-xs text-slate-500">
                Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
              </p>
              <p className="text-xs text-slate-500">
                Phone: +64 9 274 5422 • Email: procurement@autohub.co.nz
              </p>
              <p className="text-xs font-mono text-slate-700 mt-1">
                <strong>GST Number:</strong> 104-982-120
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-autohub-navy text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded">
                TAX INVOICE
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                {invoice.invoiceNumber}
              </h2>
              {invoice.receiptNumber && (
                <p className="text-xs font-semibold text-emerald-600">
                  Official Receipt: {invoice.receiptNumber}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                <strong>Date Issued:</strong> {new Date(invoice.dateIssued).toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <p className="text-xs text-slate-500">
                <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString("en-NZ", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border">
                {invoice.status === "PAID" ? (
                  <span className="text-emerald-700 bg-emerald-50 border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
                  </span>
                ) : (
                  <span className="text-amber-700 bg-amber-50 border-amber-300">
                    PAYMENT DUE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 text-xs">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Bill To:
              </h4>
              <p className="font-bold text-slate-900 text-sm">{invoice.customerName}</p>
              <p className="text-slate-600">{invoice.billingAddress}</p>
              <p className="text-slate-600 mt-1">
                <strong>NZBN:</strong> {invoice.customerNzbn}
              </p>
              <p className="text-slate-600">
                <strong>GST No:</strong> {invoice.customerGstNumber}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Vehicle & Procurement Details:
              </h4>
              <p className="font-semibold text-slate-900">
                {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
              </p>
              <p className="text-slate-600 font-mono">
                <strong>VIN:</strong> {request.vehicle.vin}
              </p>
              <p className="text-slate-600">
                <strong>Ref Number:</strong> {request.referenceNumber}
              </p>
              <p className="text-slate-600">
                <strong>Delivery Destination:</strong> {request.deliveryAddress.street}, {request.deliveryAddress.city}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Unit Price (NZD)</th>
                  <th className="py-3 px-4 text-right">Amount (NZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">
                      {request.part.partName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Condition: {request.part.conditionRequirement} • OEM Part: {request.part.oemPartNumber || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {request.part.quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    ${(request.quote?.basePartCostNzd ? (request.quote.basePartCostNzd + request.quote.marginAmountNzd) : 400).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium">
                    ${(request.quote?.basePartCostNzd ? (request.quote.basePartCostNzd + request.quote.marginAmountNzd) : 400).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">
                      Autohub Procurement & Sourcing Facilitation Fee
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Supplier verification, export clearance & consignment handling
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">1</td>
                  <td className="py-3 px-4 text-right font-mono">
                    ${(request.quote?.procurementFeeNzd || 60).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium">
                    ${(request.quote?.procurementFeeNzd || 60).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">
                      International Freight & Customs Facilitation
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Method: {request.quote?.selectedFreightMethod === "AIR_EXPRESS" ? "Air Express Priority (3-5 business days)" : "Ocean Sea Consolidated"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-medium">1</td>
                  <td className="py-3 px-4 text-right font-mono">
                    ${(request.quote?.selectedFreightMethod === "AIR_EXPRESS" ? 185 : 65).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium">
                    ${(request.quote?.selectedFreightMethod === "AIR_EXPRESS" ? 185 : 65).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm text-xs">
              <h5 className="font-bold text-slate-800 mb-1">Direct Bank Remittance Instructions:</h5>
              <p className="text-slate-600"><strong>Bank:</strong> ANZ Bank New Zealand Ltd</p>
              <p className="text-slate-600"><strong>Account Name:</strong> Autohub NZ Ltd — Procurly</p>
              <p className="text-slate-900 font-mono font-bold"><strong>Account No:</strong> 06-0801-0498210-00</p>
              <p className="text-autohub-red font-bold mt-1">
                <strong>Mandatory Reference:</strong> {invoice.paymentReference}
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. GST):</span>
                <span className="font-mono font-medium">${invoice.subtotalNzd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>NZ GST (15.0%):</span>
                <span className="font-mono font-medium">${invoice.gstAmountNzd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Due (NZD):</span>
                <span className="text-autohub-navy font-mono text-base">${invoice.totalNzd.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Autohub New Zealand Limited • Reg. NZBN 9429041234567 • This document constitutes an authorized tax invoice under the New Zealand Goods and Services Tax Act 1985.
          </div>
        </div>
      </div>
    </div>
  );
};
