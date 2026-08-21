# SkillSync

<div align="center">
  <img src="public/logo.svg" alt="SkillSync Logo" width="84" height="84" />
  <h3>Automated Skill Passport & Explainable Bias-Free Match Engine</h3>
  <p>
    A next-generation talent verification and internship matching platform that validates coursework, projects, and credentials into a portable, cryptographically signed <strong>Skill Passport</strong> and matches students with opportunities with zero demographic bias.
  </p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react" alt="React 19" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma" alt="Prisma ORM" /></a>
    <a href="https://authjs.dev/"><img src="https://img.shields.io/badge/NextAuth.js-v5_Beta-purple?style=for-the-badge&logo=auth0" alt="NextAuth.js" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Tests-38%20Passing%20(100%25)-emerald?style=for-the-badge&logo=checkmarx" alt="Tests Passing" /></a>
  </p>
</div>

---

## Table of Contents

- [Core Innovations](#-core-innovations)
- [System Architecture & Core Engines](#-system-architecture--core-engines)
  - [1. Automated 3-Stage Verification Pipeline](#1-automated-3-stage-verification-pipeline)
  - [2. Interactive Skill Passport & 3D Folder Reveal](#2-interactive-skill-passport--3d-folder-reveal)
  - [3. Explainable & Bias-Free Match Engine](#3-explainable--bias-free-match-engine)
  - [4. Enterprise Security & Abuse Protection](#4-enterprise-security--abuse-protection)
- [Codebase Structure](#-codebase-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Environment Setup](#installation--environment-setup)
  - [Database Initialization & Seeding](#database-initialization--seeding)
  - [Running the Development Server](#running-the-development-server)
- [Automated Testing Suite](#-automated-testing-suite)
- [REST API Reference](#-rest-api-reference)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 💡 Core Innovations

* **Verifiable Proof over Resume Self-Claims**: Replaces static, unverified resume bullets with cryptographic, multi-stage verified evidence records (institutional QR validation, GitHub repository commit heuristics, and document OCR).
* **Portable Skill Passport**: Every student receives a 3D flippable, emerald-themed **Skill Passport** equipped with a SHA-256 Merkle root hash, one-click PDF certificate export, W3C-compliant JSON-LD schema, and configurable public share tokens.
* **0% Demographic Bias Guarantee**: Mathematical matching strictly evaluates skill alignment and verification tier weights while explicitly excluding `gender`, `college_tier`, `photo`, `name`, `age`, and `ethnicity` from ranking calculations.
* **Explainable Matching Centerpiece**: Demystifies match compatibility by showing candidates exactly which verified evidence records fulfilled job requirements and highlighting missing competencies with actionable suggestions.
* **1,526-Skill Canonical Taxonomy**: Rich taxonomy spanning Technical, Soft Skill, Business, Digital Competency, Research, and Language domains with intelligent alias normalization and false-positive prevention (e.g. `Java != JavaScript`).

---

## ⚙️ System Architecture & Core Engines

```text
+-----------------------------------------------------------------------------------------+
|                                  SKILLSYNC ARCHITECTURE                                 |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   STUDENT / CANDIDATE                                                                   |
|   ┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────┐   |
|   │ Coursework Transcripts │ ───> │ Multi-Factor Automated  │ ───> │ SHA-256 Merkle │   |
|   │ GitHub Repositories    │      │ Verification Pipeline   │      │ Root Generator │   |
|   │ Micro-Credentials      │      │ (QR + GitHub + OCR)     │      │                │   |
|   └────────────────────────┘      └─────────────────────────┘      └───────┬────────┘   |
|                                                                            │            |
|                                                                            ▼            |
|   CREDENTIAL VAULT                                                ┌─────────────────┐   |
|   ┌─────────────────────────────────────────────────────────────> │  SKILL PASSPORT │   |
|   │ 3D Flippable Emerald Card • Confidential Folder Reveal        │  PORTABLE VAULT │   |
|   │ PDF Certificate Stream • Public Share Token • JSON-LD         └────────┬────────┘   |
|   │                                                                        │            |
|   │                                                                        ▼            |
|   │ OPPORTUNITY MATCH ENGINE                                      ┌─────────────────┐   |
|   │ ┌───────────────────────────────────────────────────────────> │ EXPLAINABLE     │   |
|   │ │ Ingested Jobs: Adzuna, Jooble, Remotive, Arbeitnow, Jobicy  │ MATCH ENGINE    │   |
|   │ │ Formula: Σ(Skill Weight × Tier Weight) / Total Skill Weight │ (0% Demographics│   |
|   │ │ Citations: Verified Proof vs Missing Skill Roadmap          │  Bias Certified)│   |
|   │ └───────────────────────────────────────────────────────────  └─────────────────┘   |
|   │                                                                                     |
|   │ ADMIN CONSOLE                                                                       |
|   └─> Verification Pipeline Log • Skill Taxonomy CRUD • Demographic Parity Audits       |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

### 1. Automated 3-Stage Verification Pipeline
* **Stage 1 — QR Signature Verification**: Validates digital signatures, Credly/institution credential URLs, and tamper-proof verification payloads using `jsQR`.
* **Stage 2 — GitHub Repository Heuristics**: Analyzes commit history, user authorship, repository activity, and detected language distributions via Octokit.
* **Stage 3 — Document OCR Parsing**: Extracts certificate text, student names, and completion dates.
* **Cryptographic Tier Classification**:
  * 🟢 **Verified High ($1.0\times$)**: Institutional registry match or verified QR signature.
  * 🟡 **Verified Medium ($0.8\times$)**: Repository commit heuristics or matching coursework.
  * 🔴 **Flagged Low ($0.4\times$)**: Self-reported claims pending automated verification.

### 2. Interactive Skill Passport & 3D Folder Reveal
* **3D Confidential Folder**: Tactile folder envelope with hover lifting physics, quick actions, and card expansion into landscape mode.
* **Flippable Emerald Card**:
  * **Front Face**: Displays verified competencies, student ID, institutional degree/batch, GitHub statistics, and verified project citations.
  * **Back Face**: Exposes the cryptographic registry proof, issuing authority, and SHA-256 Merkle root hash.
* **Evidence Citations**: Hovering over any skill badge launches `SkillEvidenceModal` detailing the exact verified evidence records behind that skill.
* **Export Streams**: Generate verifiable PDF certificates on the fly using `@react-pdf/renderer` or download JSON-LD credentials.

### 3. Explainable & Bias-Free Match Engine
* **Deterministic Matching Formula**:
  $$\text{Match Score} = \frac{\sum (\text{Skill Weight} \times \text{Tier Weight})}{\text{Total Required Skills Weight}} \times 100$$
* **Strict Anti-False-Positive Rules**: Eliminates semantic collisions (e.g. `Java != JavaScript`, `C != C++`, `React != React Native`, `AWS != Azure`).
* **Demographic Exclusion Boundary**: The match engine explicitly ignores candidate gender, college name, student photo, ethnic names, and age, guaranteeing mathematically neutral ranking.

### 4. Enterprise Security & Abuse Protection
* **NIST-Compliant Password Policy**: Enforces character classes, length restrictions (8–128 chars), and 12-round bcrypt hashing.
* **Sliding-Window Rate Limiting**: Protects authentication, password recovery, AI recommendation quotas, and upload endpoints.
* **Bot & Exploit Defense**: Automatically detects exploit scanners (`sqlmap`, `nikto`), traps automated form bots using honeypots, and sanitizes input vectors against XSS and path traversal.

---

## 📁 Codebase Structure

```text
skillsync/
├── app/                                # Next.js 16 App Router Directory
│   ├── (auth)/                         # Auth Pages: Signin, Signup, Reset/Forgot Password, Verify Email
│   ├── admin/                          # Admin Console: Pipeline Queue, Taxonomy Manager, Fairness Audits
│   ├── api/                            # REST API Endpoints (Auth, Evidence, Passport, Match, Admin)
│   ├── components/                     # Modular React Components
│   │   ├── auth/                       # AuthRequiredView security gatekeeper
│   │   ├── evidence/                   # EvidenceCard with hash preview
│   │   ├── icons/                      # Custom vector SVG icons & wordmarks
│   │   ├── landing/                    # Hero, FeatureBento, UseCaseTabs, Metrics, SmartAssist, FAQ, CTA
│   │   ├── layout/                     # Sticky Navbar, HeaderNav, and Global Footer
│   │   ├── opportunities/              # OpportunityCard and MatchExplanationCard
│   │   ├── passport/                   # SkillPassportFolder, InteractivePassportCard, SkillEvidenceModal
│   │   ├── profile/                    # ImageCropperModal avatar photo editor
│   │   └── ui/                         # Badge, DatePickerFlyout, ClickSpark, FadeIn, RollingText
│   ├── dashboard/                      # Student Evidence Repository & Dashboard
│   ├── data/                           # Canonical 1,526-skill taxonomy & mock data
│   ├── docs/                           # In-App Architecture Manual & Documentation Portal
│   ├── hooks/                          # Custom React Hooks (useAuth)
│   ├── opportunities/                  # Opportunities Feed & Match Explanation Centerpiece
│   ├── passport/                       # Student & Public Verifiable Skill Passport Pages
│   ├── profile/                        # Student Profile Editor & Date of Birth Picker
│   └── globals.css                     # Design tokens, Tailwind v4 theme, keyframe animations
├── lib/                                # Core Business Logic & Infrastructure
│   ├── config/                         # Environment variable configuration & validation
│   ├── external/                       # Supabase and Octokit client factories
│   ├── ingestion/                      # Multi-source scrapers: Adzuna, Arbeitnow, Jobicy, Jooble, Remotive
│   ├── matching/                       # Scoring engine, taxonomy normalization, job parser, explainability
│   ├── opportunities/                  # Database opportunity query service
│   ├── security/                       # Rate limiters, bcrypt, bot protection, audit logger, validators
│   ├── verification/                   # QR verifier, GitHub checks, OCR parsing, Merkle root hashing
│   ├── auth.js                         # NextAuth v5 configuration & JWT callbacks
│   ├── prisma.js                       # Prisma Client singleton
│   └── utils.js                        # Tailwind class merge helper (cn)
├── prisma/
│   ├── schema.prisma                   # PostgreSQL database schema
│   └── seed.js                         # Database seeder for demo accounts & skill taxonomy
├── tests/                              # Automated Test Suite (38 Unit Tests)
│   ├── matching.test.mjs               # Match engine & fairness tests (12 cases)
│   └── security.test.mjs               # Auth, security, IDOR, & rate limiting tests (26 cases)
└── public/                             # Static Logos, SVGs, and Platform Assets
```

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
* **npm**: `v9.0.0` or higher
* **PostgreSQL Database**: Local PostgreSQL instance or a cloud database (e.g. [Supabase](https://supabase.com/)).

### Installation & Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pratikranjan2212/skillsync.git
   cd skillsync
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment configuration template:
   ```bash
   cp .env.example .env.local
   ```
   Fill in the required environment variables:
   ```env
   # Database (PostgreSQL / Supabase)
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require"

   # NextAuth.js Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-hex-32"
   AUTH_SECRET="generate-with-openssl-rand-hex-32"
   AUTH_TRUST_HOST="true"

   # GitHub OAuth (Optional for GitHub sign-in)
   AUTH_GITHUB_ID="your-github-client-id"
   AUTH_GITHUB_SECRET="your-github-client-secret"
   ```

### Database Initialization & Seeding

1. **Push the Prisma schema to your database**:
   ```bash
   npm run db:push
   ```

2. **Seed the database with canonical skill taxonomy and demo accounts**:
   ```bash
   npm run db:seed
   ```

> **Default Seed Accounts**:
> * **Student Account**: `alex.chen@skillsync.edu` / `student123`
> * **Admin Account**: `admin@skillsync.edu` / `admin123`

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing Suite

SkillSync includes an automated unit test suite covering match scoring precision, semantic relatedness, demographic fairness, password policies, sliding-window rate limiters, IDOR protection, and bot defenses.

Run all tests:
```bash
npm test
```

Expected output:
```text
Running SkillSync Authentication & Security Unit Tests
✓ PASS: Password Policy: Rejects passwords shorter than 8 characters
✓ PASS: Password Hashing: 12-round bcrypt hash and verify
✓ PASS: Rate Limiter: Enforces request limits and blocks when exceeded
✓ PASS: IDOR Prevention: Enforces resource ownership check before mutate/read
...
Results: 26 / 26 tests passed (100%)

Running SkillSync Job Match Score Engine Unit Tests
✓ PASS: Case 1 — Excellent match: User has core tech stack & supporting tools
✓ PASS: Case 5 — False-positive prevention: JavaScript != Java
✓ PASS: Case 10 — Determinism & Zero Demographic Bias
✓ PASS: Case 12 — Explainable Breakdown generation
...
Results: 12 / 12 tests passed (100%)
```

---

## 🌐 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Registers a new student account and initializes their Skill Passport. |
| `/api/auth/forgot-password` | `POST` | Public | Generates a 64-character time-limited password reset token. |
| `/api/auth/reset-password` | `POST` | Public | Validates reset token and sets new password. |
| `/api/auth/verify-email` | `GET` | Public | Confirms student email address verification. |
| `/api/profile` | `GET`, `PUT` | Authenticated | Retrieves or updates student profile bio, gender, DOB, and skills. |
| `/api/skills` | `GET` | Public | Fast autocomplete search across 1,526 curated student skills. |
| `/api/evidence` | `GET`, `POST` | Authenticated | Fetches evidence list or submits new proof through the verification pipeline. |
| `/api/github/repos` | `GET` | Authenticated | Retrieves student's linked GitHub repositories via Octokit. |
| `/api/passport` | `GET`, `PUT` | Authenticated | Retrieves private Skill Passport or toggles public sharing status. |
| `/api/passport/[shareToken]`| `GET` | Public | Fetches public verifiable passport credentials by share token. |
| `/api/passport/pdf` | `GET` | Authenticated | Streams cryptographically verifiable PDF Skill Passport certificate. |
| `/api/opportunities` | `GET` | Public / Auth | Lists opportunities with real-time bias-free match scores. |
| `/api/opportunities/[id]` | `GET` | Public / Auth | Returns single opportunity with explainable match evidence breakdown. |
| `/api/cron/ingest` | `GET` | Secret Header | Scrapes internships from Adzuna, Arbeitnow, Jobicy, Jooble, and Remotive. |
| `/api/admin/pipeline` | `GET`, `PATCH` | Admin | Views all submitted evidence or overrides verification tiers. |
| `/api/admin/taxonomy` | `GET`, `POST`, `DELETE` | Admin | Manages canonical skill taxonomy entries. |
| `/api/admin/fairness` | `GET`, `POST` | Admin | Views demographic parity metrics or triggers a fairness audit simulation. |

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000`. |
| `npm run build` | Generates Prisma client and compiles the production Next.js application. |
| `npm start` | Runs the compiled production server. |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues. |
| `npm test` | Runs the full 38-case test suite (Security + Job Matching Engine). |
| `npm run db:push` | Pushes the Prisma schema to the database without creating migrations. |
| `npm run db:seed` | Seeds the database with default student/admin accounts and taxonomy. |
| `npm run db:studio` | Opens Prisma Studio to browse and inspect database records in a browser GUI. |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for students and fair talent recruitment worldwide.</sub>
</div>
