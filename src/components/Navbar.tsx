"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PersonaSwitcher } from "./PersonaSwitcher";
import {
  Car,
  Package,
  PlusCircle,
  Menu,
  X,
  Shield,
  Layers,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isPortal = pathname.startsWith("/portal");
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Global Logistics Network Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-autohub-red animate-pulse" />
            <span className="text-white font-bold">AUTOHUB GLOBAL LOGISTICS NETWORK</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline">25+ YEARS SERVING NZ & AUSTRALIA</span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-amber-400 font-semibold hidden md:inline">FAST-TRACK ONBOARDING OPEN</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <a href="tel:+6492745422" className="hover:text-white transition flex items-center gap-1">
              <span>Trade Hotline:</span>
              <span className="font-bold text-white font-mono">+64 9 274 5422</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link href="/contact" className="hover:text-white transition hidden sm:inline">
              Auckland & Christchurch Depots
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-autohub-navy">
                  AUTO<span className="text-autohub-red">HUB</span>
                </span>
                <span className="ml-2 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-autohub-red to-autohub-navy text-white px-2 py-0.5 rounded shadow-sm">
                  PROURLY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-600">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg transition ${
                  pathname === "/"
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                Overview
              </Link>
              <Link
                href="/#how-it-works"
                className="px-3 py-2 rounded-lg transition hover:text-autohub-navy hover:bg-slate-50"
              >
                How It Works
              </Link>
              <Link
                href="/#landed-calculator"
                className="px-3 py-2 rounded-lg transition hover:text-autohub-navy hover:bg-slate-50"
              >
                Landed Calculator
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-lg transition ${
                  pathname === "/about"
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                About Procurly
              </Link>
              <Link
                href="/terms"
                className={`px-3 py-2 rounded-lg transition ${
                  pathname === "/terms"
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                Compliance & NZTA
              </Link>
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-lg transition ${
                  pathname === "/contact"
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Actions: Persona Switcher, Login, Register CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Persona Quick Switcher (for instant testing) */}
            <div className="hidden xl:block">
              <PersonaSwitcher />
            </div>

            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-autohub-navy hover:bg-slate-100 rounded-xl transition"
            >
              Sign In
            </Link>

            <Link
              id="nav-register-trade-button"
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-md hover:shadow-red-500/25 transition-all duration-150"
            >
              <span>Open Trade Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Overview
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            How It Works
          </Link>
          <Link
            href="/#landed-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Landed Cost Calculator
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            About Procurly
          </Link>
          <Link
            href="/terms"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Compliance & NZTA
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Contact & Support
          </Link>
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-autohub-navy bg-slate-100 rounded-xl"
            >
              Sign In to Account
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center text-sm font-bold text-white bg-autohub-red hover:bg-autohub-red-dark rounded-xl shadow"
            >
              Open Trade Account (NZBN)
            </Link>
            <div className="pt-2">
              <PersonaSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
