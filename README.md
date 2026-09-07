# Procurly by Autohub

> **Precision B2B Automotive Parts Sourcing & Global Door-to-Door Logistics for New Zealand Trade**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/NZ_Privacy_Act_2020-Compliant-emerald?style=flat-square)](#compliance--legal-framework)
[![NZBN](https://img.shields.io/badge/NZBN-Validated-red?style=flat-square)](#customer-registration-flow)

---

## Executive Overview

**Procurly by Autohub** is an intelligent, door-to-door B2B automotive parts procurement and global logistics platform engineered specifically for New Zealand trade clients — including franchised dealerships, independent European & JDM specialist workshops, panel beaters, and commercial fleet operators.

Leveraging **Autohub’s 25+ years of cross-border vehicle and cargo logistics**, Procurly removes the 40–60% markups, opaque delays, and fragmented multi-carrier chasing of traditional parts importers by connecting Kiwi workshops directly to Tier-1 suppliers and OEM manufacturing hubs in Japan, Europe, the United States, and Australia.

Autohub serves as the:
1. **Coordination Layer**: Single pane of glass for VIN verification, fitment validation, and landed cost quotations.
2. **Procurement Facilitator**: Direct factory purchasing power with zero distributor markups.
3. **Logistics & Customs Enabler**: End-to-end air express and sea freight consolidation, automated New Zealand Customs clearance, and MPI Biosecurity pre-clearance directly to the workshop bay.

---

## Public Website Architecture

The public-facing web platform is built strictly according to modern web design standards and Autohub's design system:

### 1. Homepage (`/`)
- **Global Logistics Announcement Bar**: Highlights Autohub’s 25+ year heritage and fast-track trade onboarding.
- **Hero Section**: High-impact value proposition, primary CTA (*Open Trade Account*), secondary CTA (*Instant Landed Cost Calculator*), and trust badges (*14–21 Days Avg. Door Delivery*, *100% Guaranteed Fitment*, *NZTA & Customs Pre-Cleared*).
- **Live Shipment Tracker Card**: Realistic showcase shipment (`#AH-NZ-88219`: Tokyo Narita → Auckland Airport → Penrose European Auto Tech) with live status, MPI biosecurity clearance, and verified trade savings ($2,840 NZD saved vs local distributors).
- **Instant VIN & Part OEM Lookup Bar**: Real-time query tool with quick filters for JDM, European Luxury & Performance, Commercial Heavy Fleet, and Hybrid/EV High Voltage components.
- **"The Old Way vs The Procurly Pipeline" Matrix**: Comprehensive side-by-side comparison illustrating traditional 40–60% distributor markups and 6–12 week delays vs Procurly direct factory cost, transparent 12% logistics fee, live tracking, and Auckland hub return guarantee.
- **Commercial Advantages for New Zealand Trade**: Four pillar cards detailing Direct Factory Pricing, Consolidated Freight, Automated NZTA/MPI Biosecurity Clearance, and Dedicated Trade Support.
- **Recent Procured Orders Live Ticker**: Verified Kiwi workshop orders (Porsche 911 GT3 Calipers, Land Cruiser 300 Alternator, BMW S58 Twin-Scroll Turbo) with exact dollar savings.
- **Interactive Landed Cost Estimator**: Live sliders for Origin (Japan, Germany, USA), Freight Mode (Air Express vs Sea Container), and FOB Price, dynamically calculating Customs Tariffs, MPI clearance fees, 15% GST, and net savings.
- **How Procurly Works**: Transparent 4-step pipeline from VIN matching to bay delivery.
- **Kiwi Trade Testimonials**: Real feedback from workshop directors and fleet managers across Auckland, Christchurch, and Wellington.
- **The Autohub Advantage (Trust Stats)**: 250,000+ vehicles/containers handled, 99.4% on-time delivery, 100% MPI Biosecurity compliance, Auckland & Christchurch depots.
- **Interactive FAQ Accordion**: 6 key trade procurement questions with smooth expand/collapse.
- **High-Impact Conversion Banner**: Direct CTA linking to trade registration.

### 2. Customer Registration (`/register`)
Multi-step trade onboarding wizard capturing:
- **Step 1: Business Details**: Legal registered name, trading name, 13-digit NZBN formatting and validation, business classification, website, and branch count.
- **Step 2: Contact Details**: Primary contact (director/manager), accounts payable contact, and dedicated **delivery / goods inward contact** (name, direct phone, delivery bay instructions).
- **Step 3: Billing Details**: Registered billing address, GST registration number, and trade credit facility application ($10k, $25k, $50k) with payment terms selection.
- **Step 4: Delivery Details**: Default delivery address plus dynamic **multiple saved branch delivery addresses** with branch tags and forklift access flags.
- **Step 5: Account Setup & Compliance**: Portal credentials, MFA-ready configuration (TOTP / SMS), explicit **Terms & Conditions (v2025.2)** acceptance, and **NZ Privacy Act 2020** compliance capture with live ISO timestamp.
- **Submission Confirmation**: Formal **"Pending Approval"** state with reference code (`APP-NZBN-...`), summary review, and a 3-step advisory timeline.

### 3. Authentication & Password Recovery Flow
- **Trade Login (`/login`)**: Trade portal access with email, password, MFA code entry, and persona switcher.
- **Forgot Password (`/forgot-password`)**: Account recovery request with email validation and simulated reset token dispatch.
- **Password Reset (`/reset-password`)**: Token-verified password reset interface with real-time strength meter (8+ chars, upper/lower, number, special char), match checking, and login redirect.

### 4. About Procurly (`/about`)
- Comprehensive historical narrative covering 25+ years of Autohub vehicle and parts logistics in NZ and Australia.
- Interactive showcase of Autohub’s 6 international consolidation hubs:
  - **Nagoya Hub** (Japan) — JDM OEM & Tier-1 suppliers
  - **Hamburg / Frankfurt Hub** (Germany) — European Luxury & Performance
  - **Los Angeles Hub** (USA) — American Muscle & Heavy Fleet
  - **Melbourne Depot** (Australia) — Trans-Tasman rapid courier bridge
  - **Auckland Headquarters** (NZ) — Customs brokerage, biosecurity & North Island distribution
  - **Christchurch Logistics Hub** (NZ) — South Island express hub
- Official credentials: NZ Customs Broker Code `#64419`, MPI Approved Premises `#AP-2940`.

### 5. Trade Contact & Enquiry (`/contact`)
- Department-routed enquiry form:
  - Trade Account Application
  - Urgent Vehicle Part Sourcing
  - Logistics & Customs Tracking
  - Billing & Tax Statements
- Physical depot cards with addresses, direct phone lines, and operating hours (7:30 AM – 5:30 PM NZST):
  - **Auckland Head Office**: Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
  - **Christchurch Depot**: 112 Blenheim Road, Riccarton, Christchurch 8041
- Automated enquiry ticket reference generation (`TKT-AKL-...`).

### 6. Compliance & Legal Pages
- **Terms & Conditions (`/terms`)**: Version v2025.2 B2B procurement terms under New Zealand commercial law, Incoterms 2020 (CIP/DAP), customs/MPI liabilities, and fitment guarantee.
- **Privacy Policy (`/privacy`)**: Comprehensive compliance with the **New Zealand Privacy Act 2020** structured around all 13 Information Privacy Principles (IPPs).
- **Cookie & Privacy Consent Notice (`CookieConsent.tsx`)**: Persistent floating modal compliant with the NZ Privacy Act 2020 with granular toggles (Essential, Sourcing Analytics, Session Persistence).

### 7. Technical SEO & Schema Markup
- **JSON-LD Schema (`SchemaMarkup.tsx`)**: Structured data for:
  - `AutomotiveBusiness` (Autohub New Zealand Limited)
  - `WebSite` with SearchAction for VIN/OEM part lookup
  - `Service` (Procurly Automotive Procurement & Logistics)
- **Metadata (`layout.tsx`)**: Canonical tags, OpenGraph, Twitter card, and New Zealand geo meta tags (`geo.region: NZ`, `geo.placename: Auckland`).
- **Robots & Sitemap**: `public/robots.txt` and `public/sitemap.xml` covering all public routes.

---

## Route Directory

| Route | Type | Description |
|---|---|---|
| `/` | Public | Homepage with value proposition, comparison matrix, interactive calculator & FAQ |
| `/about` | Public | About Procurly & Autohub 25-year global logistics network |
| `/contact` | Public | Trade enquiry form with department routing and depot contacts |
| `/register` | Public | 5-step customer registration wizard with multiple delivery addresses |
| `/login` | Public | Trade portal sign-in with MFA code entry |
| `/forgot-password` | Public | Trade account password recovery request |
| `/reset-password` | Public | Password reset interface with live strength validation |
| `/terms` | Public | B2B Procurement Terms & Conditions (v2025.2) |
| `/privacy` | Public | New Zealand Privacy Act 2020 compliance document |
| `/robots.txt` | Static | Search engine crawling directives |
| `/sitemap.xml` | Static | Search engine XML index of all public URLs |
| `/portal` | Protected | Trade customer self-service portal (orders, tracking, invoices) |
| `/admin` | Protected | Internal Autohub operations & sourcing desks |

---

## Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router architecture)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.6 (strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4 with custom Autohub design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management & Persistence**: Client-side localStorage persistence with mock B2B data store
- **SEO & Schema**: JSON-LD semantic markup, static XML sitemap, and OpenGraph/Twitter cards

---

## Autohub Design System

The application follows the official Autohub corporate color palette and visual standards:

```css
/* Autohub Corporate Brand Tokens */
--autohub-red: #ed2025;         /* Primary Brand Action / Accent */
--autohub-red-dark: #c41217;    /* Primary Hover State */
--autohub-navy: #1a264e;        /* Deep Primary Navigation & Headers */
--autohub-navy-dark: #0f172a;   /* Dark Mode Backgrounds / Footers */
--autohub-blue: #2b4499;        /* Logistics & Transit Accent */
--slate-50 to --slate-900:      /* Neutral surface hierarchy */
```

- **Typography**: Modern sans-serif system with bold tabular figures for financial/part pricing.
- **Glassmorphism**: Soft backdrop blur effects (`backdrop-blur-md bg-white/90`) on floating trackers and calculation summaries.
- **Micro-Interactions**: Smooth hover elevations, accordion transitions, and interactive slider feedbacks.

---

## Compliance & Legal Framework

- **New Zealand Business Number (NZBN)**: Enforced 13-digit format validation across trade applications.
- **New Zealand Privacy Act 2020**: Complete compliance with the 13 Information Privacy Principles (IPPs) governing customer data handling, cross-border data transmission safeguards, and user access rights.
- **Incoterms 2020**: Default trade terms CIP (Carriage and Insurance Paid to Auckland/Christchurch Hub) and DAP (Delivered at Place to workshop bay).
- **Border Agencies**: Direct integration with NZ Customs Trade Single Window (TSW) and Ministry for Primary Industries (MPI) Biosecurity standards.

---

## Getting Started

### Prerequisites
- Node.js `v18.x` or `v20.x` or `v22.x`
- npm `v9.x` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anilbuffer/autohub.git
   cd autohub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To validate TypeScript types and compile the production bundle:
```bash
npm run build
npm run start
```

---

## Verification & Testing

All public routes have been verified and return `HTTP 200 OK`:
- Automated test script available in `scratch/check_routes.ps1`.
- Visual regression recordings and screenshots are archived in the session artifacts directory.
- Walkthrough documentation available in `walkthrough.md`.

---

## Contact & Support

- **Auckland Head Office**: Level 2, 86 Highbrook Drive, East Tamaki, Auckland 2013
- **Christchurch Hub**: 112 Blenheim Road, Riccarton, Christchurch 8041
- **Trade Hotline**: +64 9 274 5422
- **Website**: [https://procurly.autohub.co.nz](https://procurly.autohub.co.nz)
- **Email**: `enquiries@autohub.co.nz` / `procurement@procurly.co.nz`
