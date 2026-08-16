# SkillSync Frontend — Architecture & Component Structure

This document provides a comprehensive structural guide and detailed component catalog for the entire SkillSync frontend application. It outlines the role of every folder, component, route, hook, data layer, and utility across the codebase.

---

## 1. System & Architecture Overview

SkillSync is built on the **Next.js 16 App Router** with a modular, domain-driven frontend architecture:

* **Framework & Routing**: Next.js 16 App Router (`app/` directory) with nested layouts, server/client component boundaries, dynamic route segments (`[id]`, `[shareToken]`), and route groups (`(auth)`).
* **Styling & Design System**: Tailwind CSS v4 with custom design tokens, modern soft curvature (`rounded-3xl`, `rounded-4xl`, `rounded-full`), and an editorial light/dark color palette.
* **Motion & Animation Engine**: `framer-motion` for scroll-triggered viewport reveals (`FadeIn`, `FadeInStagger`), letter-flipping micro-interactions (`RollingText`), and hardware-accelerated CSS keyframe animations for floating hero cards (`float-slow`, `float-left`, `float-right`).
* **Authentication & Session**: NextAuth v5 session management combined with a custom `useAuth` hook, demo fast-login switchers, and a server-side route proxy (`proxy.js`) guarding `/dashboard` and `/admin/*` routes.
* **Data Fetching & State**: TanStack React Query (`@tanstack/react-query`) for cached client-side data querying, integrated with mock REST API route handlers (`app/api/*`).
* **Cryptographic & Client Verification**: Client-side canvas QR code decoding (`jsqr`) for instant certificate verification and `@react-pdf/renderer` for dynamic Skill Passport PDF generation.

---

## 2. Directory & Folder Hierarchy

```
skillsync/
├── app/                              # Next.js App Router Root
│   ├── (auth)/                       # Authentication Route Group
│   │   ├── signin/                   # Sign-in page with 1-click demo login
│   │   └── signup/                   # Registration page with student onboarding
│   ├── admin/                        # Admin Governance & Audit Suite
│   │   ├── fairness/                 # Algorithmic fairness audit logs & charts
│   │   ├── pipeline/                 # Evidence pipeline inspection & manual tier overrides
│   │   ├── taxonomy/                 # Skill taxonomy CRUD manager
│   │   ├── layout.js                 # Admin navigation layout wrapper
│   │   └── page.js                   # Admin landing & redirect hub
│   ├── api/                          # Mock REST API Route Handlers
│   │   ├── admin/                    # Admin endpoints (fairness, pipeline, taxonomy)
│   │   ├── auth/                     # NextAuth dynamic handler
│   │   ├── evidence/                 # Evidence list and submission endpoints
│   │   ├── opportunities/            # Job/internship feed & explainable match endpoints
│   │   └── passport/                 # Skill Passport token sharing & PDF export endpoints
│   ├── components/                   # Modular Component Architecture
│   │   ├── admin/                    # Admin navigation & control widgets
│   │   ├── auth/                     # Auth protection overlays & fallback views
│   │   ├── evidence/                 # Evidence cards & verification status widgets
│   │   ├── landing/                  # Landing page sections & showcases
│   │   ├── layout/                   # Global navigation bar, header nav, and footer
│   │   ├── modals/                   # App dialogs & demo account switchers
│   │   ├── opportunities/            # Job cards & Explainable Match centerpiece
│   │   ├── passport/                 # Interactive Passport cards, export triggers, and modal views
│   │   └── ui/                       # Reusable UI primitives (buttons, badges, animations)
│   ├── dashboard/                    # Student Workspace
│   │   ├── evidence/new/             # Add new evidence form with QR scanner
│   │   └── page.js                   # Unified student dashboard (Evidence, Passport, Feed, Governance)
│   ├── data/                         # Domain Data & Schema Dictionaries
│   │   ├── mockData.js               # Initial database mock records & schemas
│   │   └── skillsyncData.js          # Marketing copy, features, FAQs, and testimonials
│   ├── docs/                         # In-app interactive documentation page
│   ├── hooks/                        # Custom React Hooks (useAuth)
│   ├── opportunities/                # Opportunity Feed & Explainable Match Detail
│   │   ├── [id]/                     # Dynamic Match Explanation view with fairness breakdown
│   │   └── page.js                   # Opportunity listings feed with search & filtering
│   ├── passport/                     # Skill Passport View & Verification
│   │   ├── [shareToken]/             # Public cryptographic share verification route
│   │   └── page.js                   # Authenticated student passport view
│   ├── privacy/                      # Privacy policy legal document
│   ├── profile/                      # Student profile settings & account management
│   ├── support/                      # Help center & developer support contact page
│   ├── terms/                        # Terms of service legal document
│   ├── globals.css                   # Global Tailwind v4 styles, custom fonts, keyframes
│   ├── layout.js                     # Root HTML layout with providers context
│   ├── page.js                       # Public landing page (Hero, Bento, UseCases, Metrics, CTAs)
│   └── providers.jsx                 # NextAuth SessionProvider & React Query ClientProvider
├── docs/                             # Technical Project Documentation
│   ├── BUILD_LOG.md                  # Detailed Frontend Structure & Component Catalog (this file)
│   └── DESIGN_DOC.md                 # Design system, typography, color tokens, and motion specs
├── lib/                              # Core Utility Helpers
│   └── utils.js                      # Class merger utility (clsx + tailwind-merge)
├── public/                           # Static Public Assets
│   └── logo.svg                      # Official SkillSync vector logo asset
└── proxy.js                          # Edge-level route protection & redirect handler
```

---

## 3. Comprehensive Component Catalog

### 3.1. Landing Page Components (`app/components/landing/`)

* **`Hero.jsx`**
  * **Role**: Primary landing hero section.
  * **Features**:
    * Animated top pill badge (`AUTOMATED VERIFICATION • No Human Verifier • Zero Demographic Bias`).
    * High-impact editorial typography with dual call-to-action buttons (`Build Your Passport — Free` and `View Match Explanation`).
    * Three levitating preview cards with continuous CSS floating physics (`float-slow`, `float-left`, `float-right`):
      1. *Left Badge Card*: Glowing amber achievement medal with automated verification stamp.
      2. *Center Mobile Mockup*: Interactive smartphone view displaying verified evidence entries and public share link.
      3. *Right Fairness Guarantee Card*: Zero-bias checklist guaranteeing exclusion of Gender, College Tier, Name, and Photo.
    * Bottom hashtag rhythm pills (`#FirstGenHires`, `#SelfTaughtDevs`, `#ZeroGatekeeping`).
  * **Used in**: `app/page.js`.

* **`FeatureBento.jsx`**
  * **Role**: Visual feature grid highlighting SkillSync's core capabilities.
  * **Features**:
    * *Card 1 (Left 5-Col)*: 3-Tier Automated Verification system breakdown (`verified-high`, `verified-medium`, `flagged-low`) with live badge previews.
    * *Card 2 (Right 7-Col)*: Explainable Match Engine card showing evidence citations, score calculations, and missing skill badges.
    * *Card 3 (Full-Width Dark Bento)*: Dark obsidian Skill Passport showcase card (`#0B0F17`) featuring real-time verification indicators, cryptographic hash preview, JSON export, and PDF generation triggers.
  * **Used in**: `app/page.js`.

* **`UseCaseTabs.jsx`**
  * **Role**: Audience-focused tabbed showcase demonstrating use cases.
  * **Features**:
    * Segmented pill switcher for different personas (Students, Self-Taught Devs, Career Switchers, Recruiters).
    * Dynamic showcase visual card with custom copy, workflow diagrams, and action CTA button.
    * Synchronized simultaneous entrance animations for the CTA button and audience rhythm tags.
  * **Used in**: `app/page.js`.

* **`Metrics.jsx`**
  * **Role**: Key performance metrics and platform trust indicators.
  * **Features**:
    * 4-card statistics grid: `100% Automated Verification`, `0 Human Verifiers Needed`, `4 Demographic Factors Excluded`, `<1.2s Matching Speed`.
    * Staggered entrance animations with subtle hover lift micro-interactions.
  * **Used in**: `app/page.js`.

* **`SmartAssist.jsx`**
  * **Role**: Match Engine Architecture and technical workflow breakdown.
  * **Features**:
    * 4-pillar architectural flow: Evidence Ingestion $\rightarrow$ Cryptographic Verification $\rightarrow$ Fair Ranking Engine $\rightarrow$ Explainable Match Output.
    * Synchronized entrance animations and direct link button to the Opportunities Feed.
  * **Used in**: `app/page.js`.

* **`FAQSection.jsx`**
  * **Role**: Frequently asked questions accordion and support contact card.
  * **Features**:
    * Expandable accordion cards covering privacy, fairness algorithms, verification tiers, and employer exports.
    * Side contact card with instant support assistance link.
  * **Used in**: `app/page.js`.

* **`FinalCTA.jsx`**
  * **Role**: High-conversion bottom call-to-action banner.
  * **Features**:
    * Elevated dark container with radial gradient backdrop.
    * Dual pill action buttons linking directly to `/signup` and `/opportunities`.
  * **Used in**: `app/page.js`.

* **`SocialProof.jsx` / `TestimonialMasonry.jsx` / `TestimonialPhotoCarousel.jsx` / `VideoTestimonials.jsx` / `PhoneMarquee.jsx`**
  * **Role**: Modular social proof, verified user reviews, video case studies, and mobile marquee animations.
  * **Features**: Responsive masonry layout, horizontal photo strip, and embeddable video testimonials.

---

### 3.2. Layout Components (`app/components/layout/`)

* **`Navbar.jsx`**
  * **Role**: Global application navigation header.
  * **Features**:
    * Sticky top navigation bar with dynamic scroll-offset elevation and backdrop blur.
    * Official `/logo.svg` vector brand asset.
    * Active route detection (`usePathname`) for links: *Dashboard*, *Skill Passport*, *Opportunities*, *Docs*.
    * Session-aware auth actions: Shows user avatar + Sign Out when authenticated, or *Sign In* / *Get Started* CTAs when logged out.
  * **Used in**: `app/page.js`, `(auth)/*`, `dashboard/*`, `passport/*`, `opportunities/*`, `profile/*`, `support/*`, `privacy/*`, `terms/*`.

* **`Footer.jsx`**
  * **Role**: Global footer.
  * **Features**:
    * SkillSync brand summary, official `/logo.svg`, categorized navigation links (Product, Platform, Legal, Socials), and copyright notice.
  * **Used in**: `app/page.js`, legal pages, and public views.

* **`HeaderNav.jsx`**
  * **Role**: Re-export bridge and secondary navigation wrapper ensuring compatibility across legacy route imports.

---

### 3.3. UI Primitives & Animation Components (`app/components/ui/`)

* **`FadeIn.jsx`**
  * **Role**: Core animation wrapper powering the unified scroll reveal system.
  * **Components**:
    * `<FadeIn>`: Wraps elements in a Framer Motion `motion.div` with customizable `delay`, `distance`, `duration`, and viewport triggers.
    * `<FadeInStagger>`: Parent container managing progressive sequential delay across child items.
    * `<FadeInItem>`: Child item inside a staggered container.
  * **Used across**: All landing page sections and dashboard panels.

* **`RollingText.jsx`**
  * **Role**: Letter-flipping hover animation for buttons and headers.
  * **Features**: Splices text into individual letters and flips them vertically on container hover with customizable durations and stagger timing.
  * **Used in**: `Hero.jsx`, `SmartAssist.jsx`, `FinalCTA.jsx`, `AnimatedButton.jsx`.

* **`AnimatedButton.jsx`**
  * **Role**: Ergonomic pill CTA button primitive.
  * **Features**: Integrates `RollingText`, subtle scaling micro-interactions, and custom icon slotting.

* **`Badge.jsx`**
  * **Role**: Semantic verification tier and status badge.
  * **Features**: Renders standardized styling for `verified-high` (emerald), `verified-medium` (amber), `flagged-low` (rose), and general tag pills with corresponding Lucide icons.
  * **Used in**: `EvidenceCard.jsx`, `MatchExplanationCard.jsx`, `FeatureBento.jsx`, `dashboard/page.js`.

* **`ClickSpark.jsx`**
  * **Role**: Interactive canvas particle effect rendering multi-colored sparks on click events.

---

### 3.4. Evidence Components (`app/components/evidence/`)

* **`EvidenceCard.jsx`**
  * **Role**: Detailed visual card rendering a student's verified evidence submission.
  * **Features**:
    * Displays Evidence Title, Source Type tag (GitHub, Coursera, Hackathon, University), and Verification Tier Badge.
    * Verification explanation box detailing the automated validation mechanism (e.g. *Cryptographic QR code validated against issuer public key*).
    * Skill tag chips mapped to the taxonomy.
    * SHA-256 cryptographic file hash display and direct source URL link.
  * **Used in**: `app/dashboard/page.js`, `app/passport/page.js`.

---

### 3.5. Opportunities & Match Components (`app/components/opportunities/`)

* **`OpportunityCard.jsx`**
  * **Role**: Internship / job listing preview card in the opportunity feed.
  * **Features**:
    * Displays role title, company name, location, and stipend/salary.
    * Circular match score percentage badge with color-coded confidence levels.
    * Required skill chips with matching vs missing visual indicators.
    * One-click link to the Explainable Match Detail view (`/opportunities/[id]`).
  * **Used in**: `app/opportunities/page.js`, `app/dashboard/page.js`.

* **`MatchExplanationCard.jsx`**
  * **Role**: Core explainability centerpiece detailing why a candidate matched a role.
  * **Features**:
    * Overall match percentage badge with breakdown radar.
    * Supporting Evidence Citations list with verification tier badges.
    * Missing Skills list with recommended learning actions.
    * **Fairness Guarantee Callout**: Prominent banner confirming 0% demographic bias:
      `excludedFromRanking: ["gender", "college tier", "name", "photo"]`.
  * **Used in**: `app/opportunities/[id]/page.js`, `app/components/landing/FeatureBento.jsx`.

---

### 3.6. Passport Components (`app/components/passport/`)

* **`InteractivePassportCard.jsx`**
  * **Role**: Interactive Skill Passport card component.
  * **Features**: Visualizes grouped skill categories, verified badge counts, cryptographic verification status, and one-click export actions.
  * **Used in**: `app/passport/page.js`, `app/dashboard/page.js`.

* **`ShareExportButtons.jsx`**
  * **Role**: Action toolbar for sharing and exporting the Skill Passport.
  * **Features**:
    * Public / Private share link toggle with copyable shareable URL (`/passport/[shareToken]`).
    * One-click JSON data download trigger.
    * Server-streamed PDF Certificate export button (`/api/passport/pdf`).
  * **Used in**: `app/passport/page.js`, `app/components/landing/FeatureBento.jsx`.

* **`SkillEvidenceModal.jsx`**
  * **Role**: Modal drawer displaying all underlying evidence records associated with a specific claimed skill.
  * **Used in**: `app/passport/page.js`.

---

### 3.7. Admin & Auth Components (`app/components/admin/`, `app/components/auth/`, `app/components/modals/`)

* **`AdminNav.jsx`**
  * **Role**: Tabbed navigation bar for the Admin Suite.
  * **Tabs**: *Evidence Pipeline* (`/admin/pipeline`), *Skill Taxonomy* (`/admin/taxonomy`), *Fairness Audit* (`/admin/fairness`).
  * **Used in**: `app/admin/layout.js`, `app/admin/*`.

* **`AuthRequiredView.jsx`**
  * **Role**: Graceful unauthenticated fallback view displaying a lock icon, explanation, and direct sign-in button when unauthorized users access protected views.

* **`DemoModal.jsx` & `AppModal.jsx`**
  * **Role**: Dialog overlay allowing instant 1-click login switching between Demo Student (`student@skillsync.edu`) and Demo Admin (`admin@skillsync.edu`).

---

## 4. Pages & Route Structure

| Route | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | Public | Public landing page featuring Hero, Feature Bento, Use Cases, Metrics, Architecture, FAQs, and Final CTA. |
| `/signin` | `app/(auth)/signin/page.js` | Public | Sign-in page with email/password form and 1-click Demo Student / Admin buttons. |
| `/signup` | `app/(auth)/signup/page.js` | Public | Registration page with student onboarding steps and account creation. |
| `/dashboard` | `app/dashboard/page.js` | Student / Admin | Unified workspace containing Evidence Records, Skill Passport, Opportunity Feed, and Governance Audit tabs. |
| `/dashboard/evidence/new` | `app/dashboard/evidence/new/page.js` | Student | Add Evidence submission form with integrated client-side `jsqr` canvas scanner for automated QR verification. |
| `/passport` | `app/passport/page.js` | Student | Authenticated Skill Passport view with category skill trees, verification levels, and export controls. |
| `/passport/[shareToken]` | `app/passport/[shareToken]/page.js` | Public | Public cryptographic passport verification page validating share tokens server-side. |
| `/opportunities` | `app/opportunities/page.js` | Student / Public | Opportunity feed displaying ingested internships sorted by candidate match scores. |
| `/opportunities/[id]` | `app/opportunities/[id]/page.js` | Student / Public | Explainable Match Detail view showing evidence citations, missing skills, and fairness exclusion guarantees. |
| `/admin` | `app/admin/page.js` | Admin Only | Admin dashboard home, auto-redirecting to `/admin/pipeline`. |
| `/admin/pipeline` | `app/admin/pipeline/page.js` | Admin Only | Evidence pipeline audit table with manual tier override capabilities. |
| `/admin/taxonomy` | `app/admin/taxonomy/page.js` | Admin Only | Skill taxonomy manager for creating, editing, and categorizing skills. |
| `/admin/fairness` | `app/admin/fairness/page.js` | Admin Only | Algorithmic fairness audit logs and `recharts` score distribution visualizer. |
| `/profile` | `app/profile/page.js` | Student | User profile configuration and account settings. |
| `/support` | `app/support/page.js` | Public | Help center and technical support contact form. |
| `/docs` | `app/docs/page.js` | Public | In-app technical documentation and API guide. |
| `/privacy` | `app/privacy/page.js` | Public | Privacy policy and demographic data exclusion guarantees. |
| `/terms` | `app/terms/page.js` | Public | Terms of service and platform governance guidelines. |

---

## 5. Data Architecture & Mock API Layer

### 5.1. Data Stores (`app/data/`)
* **`mockData.js`**: Contains initial mock records adhering to the core database schema:
  * `INITIAL_EVIDENCE`: Verification records with SHA-256 hashes, evidence types, verification tiers, and issuer metadata.
  * `INITIAL_SKILL_TAXONOMY`: Categorized skill definitions (Frontend, Backend, AI/ML, DevOps, Core CS).
  * `INITIAL_PASSPORT`: Structured passport record linking verified skills to evidence IDs.
  * `INITIAL_OPPORTUNITIES`: Ingested job postings with skill requirements, match scores, and citations.
  * `INITIAL_FAIRNESS_AUDIT_LOGS`: Historical algorithmic fairness audit records.
* **`skillsyncData.js`**: Marketing data store containing landing page copy, bento cards, use case tabs, metrics, FAQ questions, and user testimonials.

### 5.2. REST Route Handlers (`app/api/`)
* **`app/api/auth/[...nextauth]/route.js`**: NextAuth authentication handler managing session cookies (`skillsync_session`, `skillsync_role`).
* **`app/api/evidence/route.js`**: GET list of evidence and POST new evidence (with automated QR tiering).
* **`app/api/opportunities/route.js` & `[id]/route.js`**: Returns opportunity feeds and the full JSON Explainable Match object.
* **`app/api/passport/route.js` & `[shareToken]/route.js` & `pdf/route.js`**: Manages passport share tokens and streams PDF certificate documents.
* **`app/api/admin/*`**: Endpoints for pipeline manual overrides, taxonomy CRUD, and fairness audit retrieval.

---

## 6. Utilities, Security & Route Protection

* **`proxy.js`**: Edge-level middleware protecting `/admin/*` and `/dashboard/*` routes based on `skillsync_role` and `skillsync_session` cookies.
* **`lib/utils.js`**: Exports standard `cn(...)` utility combining `clsx` and `tailwind-merge` for conditional styling.
* **`app/hooks/useAuth.js`**: Custom React hook wrapping NextAuth session state, exposing `user`, `role`, `isAuthenticated`, `isAdmin`, `login`, and `logout`.
