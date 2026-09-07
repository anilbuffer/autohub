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
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600">
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
                href="/about"
                className={`px-3 py-2 rounded-lg transition ${
                  pathname === "/about"
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                About Autohub
              </Link>
              <Link
                href="/portal"
                className={`px-3 py-2 rounded-lg transition ${
                  isPortal
                    ? "text-autohub-navy bg-blue-50 font-bold text-autohub-navy"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                Customer Portal
              </Link>
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg transition ${
                  isAdmin
                    ? "text-autohub-navy bg-slate-100 font-bold"
                    : "hover:text-autohub-navy hover:bg-slate-50"
                }`}
              >
                Staff Desks
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

          {/* Right Actions: Switcher + CTAs */}
          <div className="flex items-center gap-3">
            {/* Persona Quick Switcher */}
            <PersonaSwitcher />

            {/* Action CTA */}
            <Link
              id="nav-new-request-button"
              href="/portal/new-request"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-autohub-red hover:bg-autohub-red-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-150"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request a Part</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Overview
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            About Autohub
          </Link>
          <Link
            href="/portal"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-autohub-navy bg-blue-50"
          >
            Customer Trade Portal
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Autohub Staff Desks
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Contact & Support
          </Link>
          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-autohub-red"
          >
            Trade Account Registration
          </Link>
          <div className="pt-2 border-t border-slate-200">
            <Link
              href="/portal/new-request"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-autohub-red text-white text-xs font-bold shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Part Request</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
