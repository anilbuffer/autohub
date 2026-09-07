import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Procurly by Autohub | Door-to-Door Automotive Procurement & Logistics",
  description:
    "Autohub's modern AI-first B2B parts procurement and logistics platform for approved New Zealand automotive dealers, mechanical workshops, and commercial fleet operators. Door-to-door sourcing, freight, and customs clearance.",
  keywords: [
    "Autohub",
    "Procurly",
    "Automotive Parts Procurement",
    "New Zealand B2B Car Parts",
    "Car Parts Logistics NZ",
    "OEM Parts Sourcing Japan",
    "Air Express Freight Car Parts",
  ],
  authors: [{ name: "Autohub New Zealand Limited" }],
  openGraph: {
    title: "Procurly by Autohub — B2B Parts Procurement Portal",
    description: "Door-to-door automotive parts procurement, global sourcing, and freight tracking.",
    siteName: "Procurly by Autohub",
    locale: "en_NZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
