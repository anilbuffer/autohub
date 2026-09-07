import React from "react";
import Link from "next/link";
import { Compass, Home, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-autohub-navy/10 text-autohub-navy flex items-center justify-center mx-auto border border-autohub-navy/20">
          <ShieldAlert className="w-8 h-8 text-autohub-red" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-autohub-red">
            404 • Resource Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Procurement Destination Not Found
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The parts request reference, portal workspace, or documentation route you requested does not exist or has been archived.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="/"
            className="px-4 py-2.5 bg-autohub-navy hover:bg-autohub-navy-dark text-white rounded-xl text-xs font-bold transition shadow flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </Link>
          <Link
            href="/portal"
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-autohub-red" />
            <span>Customer Portal</span>
          </Link>
          <Link
            href="/procurement"
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Sourcing Desk</span>
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <span>Contact Support</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-400">
          Autohub New Zealand Limited • Auckland Operations Desk: +64 9 274 5422
        </div>
      </div>
    </div>
  );
}
