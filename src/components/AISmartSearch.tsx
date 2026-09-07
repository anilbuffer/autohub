"use client";

import React, { useState } from "react";
import { semanticSearchOrders, SemanticSearchResult } from "@/lib/aiService";
import { Search, Sparkles, ArrowRight, Car, Package, DollarSign, X } from "lucide-react";
import Link from "next/link";

interface AISmartSearchProps {
  onSelectRequest?: (requestId: string) => void;
  placeholder?: string;
}

export const AISmartSearch: React.FC<AISmartSearchProps> = ({
  onSelectRequest,
  placeholder = "AI Semantic Search: Try 'Hiace control arm', 'Wildtrak turbo', 'KB8B-51-031K', or VIN...",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      const matched = semanticSearchOrders(q);
      setResults(matched);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          <Sparkles className="w-4 h-4 text-autohub-red animate-pulse" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-autohub-navy/20 focus:border-autohub-navy transition shadow-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Semantic Results Dropdown */}
      {isOpen && results.length > 0 && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 z-40 p-3 max-h-[420px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 text-autohub-navy">
                <Sparkles className="w-3.5 h-3.5 text-autohub-red" />
                AI Smart Search & Historical Order Benchmarks ({results.length} matched)
              </span>
              <span className="text-[11px] text-slate-400">Press ESC or click outside to close</span>
            </div>

            <div className="mt-2 space-y-2">
              {results.map(({ matchedRequest, matchScore, recommendationReason }) => (
                <div
                  key={matchedRequest.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-autohub-navy/10 flex items-center justify-center text-autohub-navy flex-shrink-0 mt-0.5">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-autohub-navy">
                            {matchedRequest.referenceNumber}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {matchedRequest.vehicle.year} {matchedRequest.vehicle.make} {matchedRequest.vehicle.model}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                            {matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                          <Package className="w-3 h-3 text-slate-400" />
                          {matchedRequest.part.partName}
                          {matchedRequest.part.oemPartNumber && (
                            <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                              OEM: {matchedRequest.part.oemPartNumber}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 p-1.5 rounded flex items-center gap-1.5">
                          <DollarSign className="w-3 h-3 text-emerald-600" />
                          <span>{recommendationReason}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        {matchedRequest.quote ? `$${matchedRequest.quote.totalNzd.toFixed(2)} NZD` : "Pending Quote"}
                      </span>
                      <Link
                        href={`/portal/requests/${matchedRequest.id}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-autohub-red hover:text-autohub-red-dark group-hover:translate-x-0.5 transition"
                      >
                        <span>View Order</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
