"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProcurlyLogo } from "./ProcurlyLogo";
import {
  ShieldCheck,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isPortal =
    pathname === "/login" ||
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/procurement") ||
    pathname?.startsWith("/operations") ||
    pathname?.startsWith("/finance") ||
    pathname?.startsWith("/admin");

  if (isPortal) {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
    { label: "Sourcing Desk", href: "/procurement" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-[#070e1e] text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left: 100% NZ Trade & Guarantees */}
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="text-rose-500 font-bold">100% NZ Trade</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200">Verified Fitment Guarantees &amp; Landed NZD Quotes</span>
          </div>

          {/* Right: Hotline & Status */}
          <div className="flex items-center gap-3 text-slate-300 text-[11px]">
            <a href="tel:08002886482" className="hover:text-white transition hidden md:inline">
              <span>Toll Free: </span>
              <span className="font-semibold text-white font-mono">0800 288 6482</span>
            </a>
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Direct Freight Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <ProcurlyLogo
                size="md"
                variant="titlecase"
                subtitle="BY AUTOHUB NEW ZEALAND LIMITED"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${isActive
                      ? "bg-slate-100 text-[#1e3a8a] font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Sign In & Trade Portal Access */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition shadow-sm"
            >
              Sign In
            </Link>

            <Link
              id="nav-trade-portal-access-button"
              href="/portal"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold shadow-lg shadow-red-500/25 transition-all duration-150"
            >
              <span>Trade Portal Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-slate-800 bg-slate-100 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-xl shadow-lg shadow-red-500/25"
            >
              Trade Portal Access →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
