import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SchemaMarkup } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  metadataBase: new URL("https://procurly.autohub.co.nz"),
  title: {
    default: "Procurly by Autohub | Door-to-Door Automotive Procurement & Logistics",
    template: "%s | Procurly by Autohub",
  },
  description:
    "Precision B2B automotive parts sourcing & global logistics for New Zealand workshops, dealerships, and fleet managers. Direct factory and OEM sourcing across Japan, Europe, and North America—delivered to your bay with complete import compliance.",
  keywords: [
    "Autohub",
    "Procurly",
    "Automotive Parts Procurement",
    "New Zealand B2B Car Parts",
    "Car Parts Logistics NZ",
    "OEM Parts Sourcing Japan",
    "Air Express Freight Car Parts",
    "MPI Biosecurity Clearance NZ",
    "NZTA Automotive Import",
    "Workshop Trade Sourcing",
  ],
  authors: [{ name: "Autohub New Zealand Limited", url: "https://procurly.autohub.co.nz" }],
  creator: "Autohub New Zealand Limited",
  publisher: "Autohub New Zealand Limited",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Procurly by Autohub — B2B Parts Procurement Portal",
    description:
      "Door-to-door automotive parts procurement, global sourcing, and freight tracking for approved NZ automotive trade clients.",
    url: "https://procurly.autohub.co.nz",
    siteName: "Procurly by Autohub",
    locale: "en_NZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Procurly by Autohub | Precision B2B Parts Sourcing & Global Logistics",
    description:
      "Direct factory & OEM parts sourcing across Japan, Europe, and USA with complete NZ Customs and MPI biosecurity clearance.",
  },
  other: {
    "geo.region": "NZ-AUK",
    "geo.placename": "Auckland, New Zealand",
    "geo.position": "-36.9458;174.8872",
    "ICBM": "-36.9458, 174.8872",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <SchemaMarkup />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
