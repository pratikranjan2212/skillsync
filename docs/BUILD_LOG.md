# SkillSync — Application Build Log
Running log of every change made to the frontend, in chronological order (newest entry at the top).
Each entry explains *what* changed and *why*, plus a section-by-section explanation of any new or modified code.

---
## [2026-08-16 20:44] Interactive Calendar Date Picker for Date of Birth (DOB)

**Files changed:**
- `app/profile/page.js` (modified)

**What changed and why:**
1. **Interactive Calendar Date Picker** — Added a calendar button and input trigger to the Date of Birth (DOB) field in the Profile editor. Users can either type their date in readable text (`12 May 2003`) or click the calendar button ("Choose from calendar" / inline icon) to launch the graphical calendar date picker.
2. **Bi-directional Date Parsing & Formatting** — Created `parseDobToDateInput` and `formatDateFromInput` utility functions that parse dates into `YYYY-MM-DD` for the picker and automatically format picked dates into readable string notation (`DD Month YYYY`) stored in `formData.dob` and synced to the database.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:36] Upgraded Passport Card to Rich Luxury Emerald Theme

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)
- `app/components/passport/SkillEvidenceModal.jsx` (modified)

**What changed and why:**
1. **Luminous Luxury Emerald Card Background** — Replaced the flat dark muddy green gradient with a rich, multi-stop emerald/teal gradient (`from-[#0c382b] via-[#09291f] to-[#041711]`), enhanced ambient glow lights (`emerald-400/20` and `teal-400/15`), and glowing emerald watermark wave curves.
2. **Elevated Skill Badges & Project Boxes** — Styled skill buttons in rich obsidian-emerald (`bg-[#0d3f31]/90 hover:bg-[#125341] border border-emerald-400/30 text-emerald-100`) and project boxes in `bg-[#0a3528]/85 border border-emerald-400/25` for high-contrast readability and premium fintech aesthetic.
3. **Synchronized Evidence Citation Modal** — Updated `SkillEvidenceModal` to match the luminous emerald glassmorphism styling (`bg-[#092e23]/98 border border-emerald-400/35`).

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:33] Instant Direct Skill Passport Sync on Evidence Submission

**Files changed:**
- `app/api/evidence/route.js` (modified)
- `app/api/passport/route.js` (modified)
- `app/api/passport/[shareToken]/route.js` (modified)
- `app/dashboard/evidence/new/page.js` (modified)
- `app/passport/page.js` (modified)

**What changed and why:**
1. **Direct Profile & Passport Skill Aggregation (`/api/evidence`)** — When an evidence is uploaded, `POST /api/evidence` automatically merges the claimed skills into `user.skills` and updates the user's passport record, timestamp, and cryptographic Merkle root hash.
2. **Dynamic Passport Skill & Project Resolution (`/api/passport`)** — Unified `skills` and `projects` aggregation from all user evidence records and verified taxonomy mappings with `Cache-Control: no-store` headers.
3. **Instant Query Cache Invalidation (`AddEvidencePage`)** — Configured `useQueryClient` to invalidate `["skill-passport"]`, `["dash-passport"]`, `["dash-evidence"]`, `["evidence"]`, `["user-profile"]`, and `["opportunities-feed"]` immediately upon evidence submission without requiring manual page reloads.
4. **Live Refetch Configuration (`/passport`)** — Configured `staleTime: 0`, `refetchOnMount: "always"`, and `refetchOnWindowFocus: true` so the Skill Passport view updates seamlessly in real time.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:27] Pure Neutral Badge for Moderate Opportunity Match Scores

**Files changed:**
- `app/components/opportunities/OpportunityCard.jsx` (modified)

**What changed and why:**
1. **Clean Neutral Match Score Pill** — Changed the moderate match score badge to a sleek, pure neutral slate pill (`bg-neutral-100 text-neutral-800 border-neutral-200`). This ensures zero color collision with any work mode tags (Hybrid in indigo, On-site in amber, and Remote in teal), while high match scores ($\ge 75\%$) remain highlighted in SkillSync's brand emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`).

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:24] Distinct Blue Palette for Moderate Opportunity Match Badges

**Files changed:**
- `app/components/opportunities/OpportunityCard.jsx` (modified)

**What changed and why:**
1. **Differentiated Match Percentage Badge** — Updated the match rating pill color scheme in `OpportunityCard.jsx` so moderate match scores (such as 60%) use a crisp blue pill (`bg-blue-50 text-blue-800 border-blue-200`) instead of amber. This completely eliminates visual confusion with the amber **On-site** work mode badge. High match scores ($\ge 75\%$) remain in vibrant emerald (`bg-emerald-50 text-emerald-800 border-emerald-200`).

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:20] Removed Hover Zoom & Tooltip Metadata from Compact Passport Card

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Removed Hover Zoom** — Removed hover and tap scaling from the compact card container so it remains completely stationary until clicked.
2. **Removed Mouse Tooltip Metadata** — Removed the browser `title="Click to enlarge and inspect verified proof"` attribute and modal card title attribute so no hover popup bubbles appear.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:13] Added Exit Zoom-Out Animation with AnimatePresence

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Exit Zoom-Out Animation** — Wrapped the focused card modal in Framer Motion's `<AnimatePresence>` and configured smooth exit transitions (`scale: 1` $\to$ `scale: 0.9`, `opacity: 1` $\to$ `opacity: 0`). When the user clicks the card or the close button, the card smoothly scales down and fades out, mirroring the entrance animation.
2. **Backdrop Fade Out** — The modal backdrop blur smoothly fades out simultaneously with a `0.22s easeOut` transition.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:11] Exit Focused Mode When Clicking on Enlarged Card

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Click-to-Exit on Focused Card** — Clicking anywhere on the enlarged card surface now cleanly exits focus mode and returns to the compact view. Interactive sub-elements (skill evidence modal, GitHub links, copy student ID, copy Merkle root hash) continue to handle their specific actions without triggering card closure.
2. **Clean Header Badge** — Removed the miniature maximize icon from the card header for a completely clean, uncluttered badge aesthetic.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 20:02] Streamlined Passport Enlarged Controls, Zoom Animation & Red Close Button Hover

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Removed Enlarge Button** — Removed the redundant "Enlarge" button from the main passport toolbar; clicking the compact card directly triggers the focused view.
2. **Subtle Zoom Animation** — Added spring-based scaling on click and hover (`whileHover={{ scale: 1.015 }}`, `whileTap={{ scale: 0.985 }}` and `initial={{ scale: 0.92, opacity: 0 }}`) for a smooth zoom transition into the enlarged lightbox.
3. **Removed PDF Button from Enlarged View** — Streamlined the modal overlay by removing the modal PDF export button.
4. **Relocated & Styled Flip Button** — Moved the 3D flip button to the top right directly next to the close button.
5. **Icon-Only Buttons & Red Hover on Close** — Removed text labels from both Flip and Close buttons. Styled the Close button to illuminate in vibrant red (`hover:bg-rose-600 hover:border-rose-500`) on hover.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 19:59] Added GitHub Repositories Dropdown & Permission Authorization to Evidence Submission

**Files changed:**
- `app/api/github/repos/route.js` (new)
- `app/dashboard/evidence/new/page.js` (modified)
- `lib/auth.js` (modified)

**What changed and why:**
1. **GitHub Repository API & Permission Verification (`/api/github/repos`)** — Checks linked GitHub OAuth accounts in the database, queries repository endpoints with active token/public fallback, and verifies repo permissions.
2. **Repository Select Dropdown** — In the **External Link** field of the Evidence Upload form (`/dashboard/evidence/new`), user can now choose from a dropdown list of their connected GitHub repositories. Selecting a repo auto-populates the URL, title, description, and adds matching programming language skills.
3. **Permission Grant Option** — If GitHub is not linked or repository permissions are not granted, renders a dedicated *"Allow Permissions"* / *"Load Your GitHub Repositories in Dropdown"* banner that redirects to GitHub OAuth with repository scope.
4. **OAuth Scope Update** — Configured `read:user user:email repo` scopes in NextAuth GitHub provider.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 26 routes.

---
## [2026-08-16 19:54] Compact Skill Passport, Text-Only Skills, Focus Lightbox Modal & Dedicated Flip Button

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Removed Skill Icons** — Replaced icon-heavy skill tiles with clean, text-only emerald badges (`Python`, `SQL`, `React.js`) with glowing indicator dots and hover evidence popovers.
2. **Compact Card Dimensions** — Reduced default card footprint to a compact, well-proportioned layout (`max-w-2xl` container, tighter padding, smaller avatar, refined font sizes).
3. **Click-to-Enlarge Focus Lightbox** — Clicking the compact card now opens a high-definition focused modal view with backdrop blur and keyboard (Escape) dismissal.
4. **Dedicated Flip Button in Focused View** — Added an explicit *"Flip to Cryptographic Proof / Show Front Side"* action button directly above the focused card to trigger smooth 3D flipping between the front passport and cryptographic registry proof.

**Open items / follow-ups:**
Production build verified with exit code 0 across all routes.

---
## [2026-08-16 19:51] Refined Official Skill Passport Badge & Removed Flip Hint

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)

**What changed and why:**
1. **Refined Badge Styling** — Replaced the dark badge pill on the light page background with a crisp, high-contrast light emerald pill (`bg-emerald-50 text-emerald-800 border-emerald-200`) so it no longer appears faded or murky.
2. **Removed Card Flip Hint** — Removed the secondary *"Click card to flip • Click again to return"* hint text next to the badge.

**Open items / follow-ups:**
Production build verified with exit code 0 across all routes.

---
## [2026-08-16 19:46] Updated Skill Passport to a Dark Green Theme

**Files changed:**
- `app/components/passport/InteractivePassportCard.jsx` (modified)
- `app/components/passport/SkillEvidenceModal.jsx` (modified)

**What changed and why:**
Redesigned the Skill Passport interactive card and evidence citation popover modal with a luxurious, high-contrast dark green theme (`#061811` to `#04120c` gradient with glowing emerald accents and neon border highlights).

**Code explanation (section by section):**
`app/components/passport/InteractivePassportCard.jsx`
- **Front & Back Card Surfaces** — Applied deep dark green gradient backgrounds (`bg-linear-to-br from-[#061811] via-[#092218] to-[#04120c]`), emerald border highlights (`border-emerald-500/25`), and soft multi-layered dark shadows.
- **Glowing Ambient Elements** — Added emerald-500/15 ambient blur spheres and glowing watermark wave vector paths.
- **High-Contrast Typography** — Crisp white headings, emerald label captions (`text-emerald-400`), and dark green badge pills (`bg-emerald-500/15 text-emerald-300`).
- **Interactive Tiles & Back Side** — Styled Skill tiles, Project links, and Cryptographic Merkle Root Proof boxes in dark emerald tones.

`app/components/passport/SkillEvidenceModal.jsx`
- **Evidence Popover** — Styled citation modal with backdrop blur, dark emerald container (`bg-[#071d15]/98`), glowing verified badges, and dark code blocks.

**Open items / follow-ups:**
Production build verified with exit code 0 across all routes.

---
## [2026-08-16 18:11] Removed Parameter Exclusion Card and Cleared Dummy Data in Audit Console

**Files changed:**
- `app/dashboard/page.js` (modified)
- `app/api/admin/pipeline/route.js` (modified)
- `app/api/admin/taxonomy/route.js` (modified)
- `app/api/admin/fairness/route.js` (modified)

**What changed and why:**
1. **Removed Exclusion Card** — Completely removed the dark "Explicit Model Parameter Exclusion List" card from the Audit & Pipeline Console on the Dashboard.
2. **Removed Dummy Data & Added Clean Empty States**:
   - Cleared hardcoded dummy score distribution charts, dummy evidence pipeline records, and dummy taxonomy items from API routes and dashboard state.
   - Replaced with clean, responsive empty states for the Candidate Score Distribution Chart, Evidence Pipeline Audit Log, and Skill Taxonomy Catalog when no user records or audit logs exist.

**Open items / follow-ups:**
Production build verified with exit code 0 across all 28 routes.

---
## [2026-08-16 18:08] Removed Skill Passport Section from Dashboard Page

**Files changed:**
- `app/dashboard/page.js` (modified)

**What changed and why:**
Removed the embedded "Skill Passport" tab button and interactive card view from the Unified Dashboard page (`/dashboard`), leaving the dashboard dedicated to **Evidence Records** and the **Audit & Pipeline Console**. The full Skill Passport is accessed directly via its dedicated route (`/passport`).

**Code explanation (section by section):**
`app/dashboard/page.js`
- **Dashboard Header Description** — Updated subtitle copy to reflect Evidence Records and Audit Pipeline focus.
- **Tab Navigation** — Removed the `passport` tab item from the switcher.
- **Tab Panels** — Removed the `{activeTab === "passport" && ...}` container and cleaned up unused passport component imports.

**Open items / follow-ups:**
Production build verified with exit code 0.

---
## [2026-08-16 17:47] Removed Authentication Badge Pills from Sign In Page

**Files changed:**
- `app/(auth)/signin/page.js` (modified)

**What changed and why:**
Removed the pill badge section (`Student Authentication` / `Admin Console Authentication`) from the top of the sign in card for a cleaner, streamlined header presentation.

**Code explanation (section by section):**
`app/(auth)/signin/page.js`
- **Clean Sign In Header** — Removed the conditional badge pill above the headline, keeping the title ("Welcome Back" / "Administrator Sign In") and description cleanly aligned under the role selector tabs.

**Open items / follow-ups:**
Production build verified with exit code 0.

---
## [2026-08-16 17:47] Removed Demo Info, Enforced Passport-Gated Opportunities, and Added Admin Sign-In Switcher

**Files changed:**
- `app/(auth)/signin/page.js` (modified)
- `proxy.js` (modified)
- `app/components/auth/AuthRequiredView.jsx` (modified)
- `app/api/opportunities/route.js` (modified)
- `app/opportunities/page.js` (modified)
- `app/components/layout/Navbar.jsx` (modified)
- `app/components/landing/Hero.jsx` (modified)
- `app/components/landing/FeatureBento.jsx` (modified)

**What changed and why:**
1. **Admin & Student Sign-In Option**: Added a dual role switcher (`Student Portal` vs. `Administrator`) on `/signin`. Admins can sign in with administrator credentials (`admin@skillsync.edu`) to be routed to `/admin`, while students are routed to `/dashboard`. Support URL query param `/signin?role=admin`.
2. **Removed Demo Buttons & Info**: Cleaned up all one-click demo boxes and demo placeholders across the sign-in page and protected authentication views.
3. **Passport-Gated Opportunities**: Kept the Opportunities feature intact while removing demo opportunities for new users. Users without verified evidence or a built Skill Passport now receive a dedicated "Build Your Skill Passport First" guide with a direct action button to `/dashboard/evidence/new`.
4. **Admin Route Authorization in Middleware**: Updated `proxy.js` so authenticated administrators can seamlessly access `/admin/*` routes while redirecting unauthenticated users to `/signin?role=admin`.

**Open items / follow-ups:**
Clean Next.js 16 production build verified (exit code 0 across 27 routes).

---
## [2026-08-16 16:15] Implemented Complete Backend Architecture & Services (SOAIDEATHON-S30)

**Files changed:**
- `lib/config/env.js` (created) — Centralized environment and API configuration (single source of truth).
- `lib/external/clients.js` (created) — Configured SDK singletons for Supabase and Octokit.
- `prisma/schema.prisma` (created) — PostgreSQL schema modeling Users, Accounts, Sessions, VerificationTokens, Evidence, Skills, Passports, Opportunities, and FairnessAudits.
- `lib/prisma.js` (created) — Prisma client global singleton.
- `prisma/seed.js` (created) — Database seed script populating demo student/admin users, skill taxonomy, verified evidence, opportunities, and fairness audits.
- `lib/auth.js` (created) — Auth.js (NextAuth v5) configuration with Credentials (bcryptjs) + GitHub OAuth providers, Prisma adapter, and JWT sessions.
- `app/api/auth/register/route.js` (created) — User registration route handler with bcrypt password hashing and automatic passport initialization.
- `app/api/auth/[...nextauth]/route.js` (modified) — Auth.js dynamic GET/POST route handler.
- `lib/verification/cryptoHash.js` (created) — SHA-256 evidence record and passport credential hashing module.
- `lib/verification/qrVerifier.js` (created) — QR and institutional digital signature verification engine.
- `lib/verification/githubCheck.js` (created) — Octokit GitHub repository and commit cross-check module.
- `lib/verification/ocrParser.js` (created) — OCR document and transcript parsing with OCR.Space API integration and regex fallbacks.
- `lib/verification/pipeline.js` (created) — Multi-stage automated evidence verification pipeline orchestrator.
- `lib/ingestion/normalize.js` (created) — Opportunity normalization and skill taxonomy extraction pipeline.
- `lib/ingestion/remotive.js` (created) — Remotive public API job ingestion client.
- `lib/ingestion/arbeitnow.js` (created) — Arbeitnow public API job ingestion client.
- `lib/ingestion/jobicy.js` (created) — Jobicy public API job ingestion client.
- `lib/ingestion/adzuna.js` (created) — Adzuna job ingestion client with env config integration.
- `lib/ingestion/jooble.js` (created) — Jooble job ingestion client with env config integration.
- `app/api/cron/ingest/route.js` (created) — Automated multi-source opportunity ingestion cron route.
- `lib/matching/getMatchingFeatures.js` (created) — Hard boundary matching module strictly enforcing demographic omission (gender, college tier, name, photo).
- `lib/matching/scoring.js` (created) — Deterministic match scoring engine with verification tier weighting.
- `lib/matching/explainability.js` (created) — Explainable match breakdown generator with evidence citations and fairness guarantees.
- `app/api/evidence/route.js` (modified) — Evidence submission and query route connected to automated verification pipeline.
- `app/api/opportunities/route.js` & `app/api/opportunities/[id]/route.js` (modified) — Opportunity feed with fair personalized scoring and detailed explainability breakdowns.
- `app/api/passport/route.js`, `[shareToken]/route.js`, `pdf/route.js` (modified) — Skill Passport retrieval, public token sharing, and verifiable PDF export.
- `app/api/admin/pipeline/route.js`, `taxonomy/route.js`, `fairness/route.js` (modified) — Admin governance suite for manual tier overrides, taxonomy CRUD, and fairness audit logs.
- `app/(auth)/signin/page.js` & `app/(auth)/signup/page.js` (modified) — Integrated GitHub OAuth sign-in/up buttons and hooked registration form to `/api/auth/register`.
- `.env.example` & `.env.local` (created) — Configured environment variable templates and development placeholder defaults.
- `package.json` (modified) — Added `@prisma/client`, `@auth/prisma-adapter`, `bcryptjs`, `@supabase/supabase-js`, `@octokit/rest`, and `prisma`.

**What changed and why:**
Built the complete server-side backend architecture for SkillSync according to the SOAIDEATHON-S30 problem statement and Plain JavaScript constraint. The backend provides automated multi-stage evidence verification, multi-source job ingestion (free & keyed APIs), explainable and demographic-free candidate matching, portable cryptographic Skill Passport verification, and comprehensive administrative governance. All external keys and clients are centralized with resilient fallbacks for missing environment variables during local development.

**Code explanation (section by section):**
1. **Centralized Configuration (`lib/config/env.js`)**: Single source of truth with `required()` and `optional()` helpers, ensuring only one file touches `process.env` directly.
2. **SDK Clients (`lib/external/clients.js`)**: Exports configured Supabase and Octokit singletons.
3. **Database Schema & Prisma (`prisma/schema.prisma`, `lib/prisma.js`, `prisma/seed.js`)**: Complete PostgreSQL schema with Prisma 6.4.1 Client singleton and seed data.
4. **Auth & Identity (`lib/auth.js`, `app/api/auth/register/route.js`)**: NextAuth v5 configuration with Credentials (`bcryptjs` hashing) and GitHub OAuth, backed by `@auth/prisma-adapter`.
5. **Multi-Stage Verification Pipeline (`lib/verification/*`)**: SHA-256 hashing (`cryptoHash.js`), QR/institutional signature verification (`qrVerifier.js`), GitHub commit cross-check (`githubCheck.js`), OCR transcript parsing (`ocrParser.js`), and orchestrator (`pipeline.js`).
6. **Opportunity Ingestion Engine (`lib/ingestion/*`, `app/api/cron/ingest/route.js`)**: Normalization pipeline and multi-source fetchers for Remotive, Arbeitnow, Jobicy, Adzuna, and Jooble.
7. **Explainable & Fair Matching Engine (`lib/matching/*`)**: `getMatchingFeatures.js` hard boundary strictly scrubbing demographic parameters (`gender`, `college tier`, `name`, `photo`), `scoring.js` deterministic weighted calculation (High=1.0, Medium=0.8, Low=0.4), and `explainability.js` generating evidence citations and fairness certifications.
8. **Skill Passport & Sharing (`app/api/passport/*`)**: Verified skill aggregation, public token verification, and streamed PDF export.
9. **Admin Governance & Audit (`app/api/admin/*`)**: Evidence pipeline inspection with manual tier overrides, skill taxonomy CRUD, and demographic parity audit metrics.

**Open items / follow-ups:**
- Production build compiled successfully (`npm run build`) with exit code 0 across all 30+ static and dynamic routes.
- Ready for user to add production API keys in `.env.local` / deployment environment whenever available.

---
## [2026-08-16 15:57] Themed Card Hover Borders to Respective Icon Colors

**Files changed:**
- `app/components/landing/SmartAssist.jsx` (modified)
- `app/data/skillsyncData.js` (modified)

**What changed and why:**
Configured each feature card's hover border to dynamically match its corresponding icon color:
- **3-Tier Verification Engine**: `hover:border-emerald-500`
- **Portable Skill Passport**: `hover:border-amber-500`
- **Public Job Ingestion**: `hover:border-blue-500`
- **Algorithmic Fairness Guarantee**: `hover:border-neutral-900`

**Code explanation (section by section):**
`app/components/landing/SmartAssist.jsx` & `app/data/skillsyncData.js`
- **Themed Hover Border Transitions** — Added `hoverBorder` property to each item in `SMART_ASSIST_CARDS` and dynamically applied `${card.hoverBorder}` to the card wrapper class.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:56] Removed Card Drop Shadows & Added Simple Hover Border

**Files changed:**
- `app/components/landing/SmartAssist.jsx` (modified)
- `app/data/skillsyncData.js` (modified)

**What changed and why:**
Removed the bottom drop shadows and colored glowing borders from the 4 feature cards in "Our Match Engine Architecture". Replaced them with a crisp, minimal border transition (`border border-neutral-200/90 hover:border-neutral-900`) while preserving the squircle (`rounded-2xl`) icon containers and their radiant icon drop shadows.

**Code explanation (section by section):**
`app/components/landing/SmartAssist.jsx` & `app/data/skillsyncData.js`
- **Clean Card Surfaces** — Removed card-level drop shadows from `SMART_ASSIST_CARDS` and configured clean `border border-neutral-200/90 hover:border-neutral-900` styling with subtle `-translate-y-1` lift.
- **Preserved Radiant Squircle Icons** — Retained the `rounded-2xl` shape and radiant color drop shadows (`shadow-[0_10px_25px_...]`) for each of the 4 feature icons.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:53] Added Radiant Icon Drop Shadows & Bottom Ambient Card Glows

**Files changed:**
- `app/components/landing/SmartAssist.jsx` (modified)
- `app/data/skillsyncData.js` (modified)

**What changed and why:**
Applied radiant, glowing drop shadows to both the squircle icons and the bottom edges of each feature card matching the design specification:
- **Emerald card**: Green radiant icon glow (`shadow-[0_10px_25px_rgba(16,185,129,0.55)]`) and bottom emerald ambient card glow (`shadow-[0_20px_45px_-8px_rgba(0,0,0,0.08),0_12px_28px_-4px_rgba(16,185,129,0.32)] border-b-[3px] border-b-emerald-500/30`).
- **Amber card**: Orange radiant icon glow (`shadow-[0_10px_25px_rgba(245,158,11,0.55)]`) and bottom amber ambient card glow (`shadow-[0_20px_45px_-8px_rgba(0,0,0,0.08),0_12px_28px_-4px_rgba(245,158,11,0.32)] border-b-[3px] border-b-amber-500/30`).
- **Blue card**: Blue radiant icon glow (`shadow-[0_10px_25px_rgba(59,130,246,0.55)]`) and bottom blue ambient card glow (`shadow-[0_20px_45px_-8px_rgba(0,0,0,0.08),0_12px_28px_-4px_rgba(59,130,246,0.32)] border-b-[3px] border-b-blue-500/30`).
- **Black card**: Dark radiant icon glow (`shadow-[0_10px_25px_rgba(0,0,0,0.55)]`) and bottom dark ambient card glow (`shadow-[0_20px_45px_-8px_rgba(0,0,0,0.12),0_12px_28px_-4px_rgba(0,0,0,0.3)] border-b-[3px] border-b-neutral-900/30`).
- All 4 icon containers strictly preserve their squircle (`rounded-2xl`, non-circular) shape.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:49] Applied Elevated Drop Shadows to Match Engine Feature Cards with Preserved Squircle Icons

**Files changed:**
- `app/components/landing/SmartAssist.jsx` (modified)
- `app/data/skillsyncData.js` (modified)

**What changed and why:**
Updated the 4 feature cards in the "Our Match Engine Architecture" section to match the new design: clean white floating card surfaces with soft, modern drop shadows (`shadow-[0_14px_34px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)]` and `hover:shadow-[0_22px_45px_rgba(0,0,0,0.11),0_4px_12px_rgba(0,0,0,0.05)]`) while strictly preserving the squircle (`rounded-2xl` rounded rectangle) icon container shape without making it circular.

**Code explanation (section by section):**
`app/components/landing/SmartAssist.jsx`
- **Elevated Card Drop Shadows** — Styled cards as crisp `bg-white` with refined multi-layer drop shadows and smooth `-translate-y-1.5` lift on hover.
- **Preserved Squircle Icons** — Maintained `rounded-2xl` for icon backgrounds (`w-12 h-12 rounded-2xl ${card.iconBg}`) with subtle `group-hover:scale-105` micro-interaction.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:43] Refined Horizontal Page Transitions (Slower & Smoother Pacing)

**Files changed:**
- `app/template.js` (modified)

**What changed and why:**
Refined the horizontal slide page transition to be slower, smoother, and more relaxed by increasing the transition duration from 0.36s to 0.52s, adjusting the offset to 28px, and preserving the luxury deceleration curve (`[0.16, 1, 0.3, 1]`).

**Code explanation (section by section):**
`app/template.js`
- **Pacing & Offset Optimization** — Increased duration to `0.52s` with `x: 28px` (forward) and `x: -28px` (backward) for a weighted, silky glide into view.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:40] Added Directional Horizontal Slide Page Transitions (Left / Right)

**Files changed:**
- `app/template.js` (modified)

**What changed and why:**
Replaced vertical slide transitions with subtle, directional horizontal slide and cross-fade animations (`x: 22px` $\leftrightarrow$ `x: 0px`). Forward navigation slides smoothly from the right, while backward navigation slides smoothly from the left, using a deceleration curve (`[0.16, 1, 0.3, 1]`) over 0.36s.

**Code explanation (section by section):**
`app/template.js`
- **Directional Navigation Detection** — Tracks route hierarchy changes between previous and current paths to automatically compute forward (`direction: 1`, entering from `x: 22px`) vs backward (`direction: -1`, entering from `x: -22px`) slide directions.
- **Subtle Deceleration Curve** — Applies `duration: 0.36s` with `ease: [0.16, 1, 0.3, 1]` and `overflow-x-clip` to guarantee a fluid slide without horizontal scrollbars.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 15:36] Removed Top Progress Bar from Route Transitions

**Files changed:**
- `app/template.js` (modified)

**What changed and why:**
Removed the top green navigation progress bar while maintaining the clean, smooth page cross-fade and slide transitions across all routes.

**Code explanation (section by section):**
`app/template.js`
- **Clean Page Transition** — Removed the top progress bar element and kept the smooth `opacity: 0, y: 12` $\rightarrow$ `opacity: 1, y: 0` route wrapper.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 14:39] Added Smooth Global Page Transitions & Routing Navigation Animations

**Files changed:**
- `app/template.js` (created)

**What changed and why:**
Implemented a unified, fluid page transition system across the entire application using Next.js App Router's `app/template.js`. Every route navigation (e.g., landing $\leftrightarrow$ dashboard, sign in $\leftrightarrow$ sign up, opportunities, passport, admin suites, etc.) now smoothly cross-fades and glides upward into view with a luxury cubic-bezier deceleration curve, accompanied by a subtle top-mounted emerald route indicator line.

**Code explanation (section by section):**
`app/template.js`
- **Universal Route Wrapper** — Wraps all page components dynamically keyed on `pathname`, executing a smooth entrance transition (`opacity: 0, y: 12px` $\rightarrow$ `opacity: 1, y: 0px` over 0.38s with ease `[0.22, 1, 0.36, 1]`).
- **Emerald Route Progress Bar** — Displays a sleek top-mounted progress line (`h-[2.5px]` emerald gradient) that pulses across the top on every page change.
- **Accessibility** — Includes `prefers-reduced-motion` detection to provide immediate non-animated rendering for users who prefer reduced motion.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 14:26] Enlarged Magnifying Glass Size & Fixed Automatic Animation Loop

**Files changed:**
- `app/components/ui/MagnifyingEvidence.jsx` (modified)

**What changed and why:**
Significantly enlarged the black magnifying glass lens and handle (from `w-13`/`w-16` to `w-20`/`sm:w-26`/`md:w-30` with a 52px+ lens diameter) and fixed the automatic movement loop by replacing state-driven transition callbacks with a high-performance, uninterrupted `requestAnimationFrame` continuous physics loop that automatically glides across the word without getting stuck.

**Code explanation (section by section):**
`app/components/ui/MagnifyingEvidence.jsx`
- **Continuous RAF Animation Engine** — Eliminated React state re-render dependencies by driving the position, scale, opacity, and letter transforms directly via hardware-accelerated ref updates. The loop automatically moves across `e` $\rightarrow$ `v` $\rightarrow$ `i` $\rightarrow$ `d` $\rightarrow$ `e` $\rightarrow$ `n` $\rightarrow$ `c` $\rightarrow$ `e`, pauses, exits, rests, and repeats infinitely.
- **Substantially Enlarged Glass Design** — Scaled the SVG viewBox to `100x100` with a generous 26px radius lens (`r=26`, diameter 52), thick 5px solid black rim, enhanced specular highlight arc, and a long 45-degree ergonomic grip handle.
- **Enhanced Magnification Power** — Increased magnification scaling to up to $1.45\times$ with a wider 36px optical proximity radius.

**Open items / follow-ups:**
Production build verified with exit code 0.

## [2026-08-16 14:24] Implemented Black Magnifying Glass Animation & Dynamic Text Magnification on "evidence"

**Files changed:**
- `app/components/ui/MagnifyingEvidence.jsx` (created)
- `app/components/landing/Hero.jsx` (modified)
- `app/components/Hero.jsx` (modified)

**What changed and why:**
Added a sleek black magnifying glass animation over the word "evidence" in the hero transition heading ("Verifiable evidence replaces manual resumes..."). The magnifying glass enters smoothly at the starting letter 'e', glides horizontally across the letters to the ending 'e', optically enlarges and lifts each letter dynamically as the lens passes directly over it, pauses on the final letter, and then gracefully lifts and fades out before repeating in a smooth loop. Also supports manual mouse tracking when hovered.

**Code explanation (section by section):**
`app/components/ui/MagnifyingEvidence.jsx`
- **Dynamic Optical Magnification** — Measures exact letter centers via DOM coordinates and dynamically calculates the letter's proximity to the lens center (`Math.abs(lensX - charCenter)`), scaling letters up to 1.38x with bold weight and subtle emerald-tinted drop-shadow.
- **Sleek Black Magnifying Glass SVG** — Custom SVG lens with realistic glass reflection gradient (`#lensReflect`), specular glare arc, deep matte black outer rim (`#blackRimGrad`), and a textured 45-degree ergonomic black handle.
- **Phased Animation Engine** — Smooth 5-phase loop: Enter (smooth scale/fade in) $\rightarrow$ Sweep (smooth easeInOut travel across 'e'-to-'e') $\rightarrow$ Focus (brief pause on final letter) $\rightarrow$ Exit (smooth upward float and fade out) $\rightarrow$ Rest (clean delay before next loop).

`app/components/landing/Hero.jsx` & `app/components/Hero.jsx`
- **Integrated MagnifyingEvidence** — Wrapped the target word "evidence" inside `<MagnifyingEvidence text="evidence" />` within the heading.

**Open items / follow-ups:**
Production build verified cleanly with exit code 0.


# SkillSync Full-Stack System Architecture & Module Catalog

This document provides a comprehensive structural guide, design system specification, and detailed component catalog for both the **Frontend** and **Backend** architecture of the SkillSync platform.

---

## 1. System & Architecture Overview

SkillSync is built on **Next.js 16 App Router** with a clean, domain-driven full-stack architecture strictly following **Plain JavaScript** (no TypeScript):

* **Framework & Routing**: Next.js 16 App Router (`app/` directory) with nested layouts, server/client component boundaries, dynamic route segments (`[id]`, `[shareToken]`), and route groups (`(auth)`).
* **Database & Persistence**: Prisma ORM (v6.4.1) with PostgreSQL schema modeling Users, Accounts, Sessions, VerificationTokens, Evidence, Skills, Passports, Opportunities, and FairnessAudits, accompanied by resilient offline memory fallbacks.
* **Authentication & Identity**: Auth.js (`next-auth` v5 beta) with `Credentials` (`bcryptjs` password hashing) + `GitHub` OAuth providers, backed by `@auth/prisma-adapter` and JWT sessions.
* **Centralized Configuration**: `lib/config/env.js` as the strict single source of truth for all environment variables with `required()` and `optional()` helpers.
* **SDK Clients**: `lib/external/clients.js` exporting configured singletons for Supabase Storage (`@supabase/supabase-js`) and GitHub Octokit (`@octokit/rest`).
* **Automated Evidence Verification**: Multi-stage automated verification pipeline (`lib/verification/pipeline.js`) validating SHA-256 hashes, QR / institutional digital signatures (Coursera, Credly, Accredible, University registries), GitHub commit heuristics, and OCR transcript parsing (`ocrParser.js`) into 3 standardized tiers: `verified-high`, `verified-medium`, and `flagged-low`.
* **Multi-Source Opportunity Ingestion**: Continuous job aggregation engine (`lib/ingestion/`) fetching and normalizing opportunities from Remotive, Arbeitnow, Jobicy, Adzuna, and Jooble into the unified SkillSync taxonomy.
* **Explainable & Fair Matching Engine**: Hard boundary (`lib/matching/getMatchingFeatures.js`) strictly scrubbing demographic parameters (`gender`, `college tier`, `name`, `photo`) and scoring candidate compatibility based on verification-weighted skill vectors with full evidence citations.
* **Cryptographic Skill Passport**: Public token sharing (`/passport/[shareToken]`), SHA-256 Merkle root credential hashing, and server-streamed PDF certificate exports (`/api/passport/pdf`).
* **Styling & Motion**: Tailwind CSS v4 with luxury off-white/obsidian surfaces, radiant ambient emerald glows, cubic-bezier scroll reveals (`<FadeIn>`), and physics-driven micro-interactions.

---

## 2. Full-Stack Directory & Folder Hierarchy

```
skillsync/
├── app/                                    # Next.js App Router Root
│   ├── (auth)/                             # Authentication Route Group
│   │   ├── signin/page.js                  # Sign-in page (Credentials + GitHub OAuth + 1-Click Demo)
│   │   └── signup/page.js                  # Registration page with student onboarding & password criteria
│   ├── admin/                              # Admin Governance & Audit Suite
│   │   ├── fairness/page.js                # Algorithmic fairness audit logs & parity charts
│   │   ├── pipeline/page.js                # Evidence pipeline audit table & manual tier overrides
│   │   ├── taxonomy/page.js                # Skill taxonomy manager (CRUD)
│   │   ├── layout.js                       # Admin navigation layout wrapper
│   │   └── page.js                         # Admin hub & redirect controller
│   ├── api/                                # REST API Route Handlers
│   │   ├── admin/
│   │   │   ├── fairness/route.js           # Fairness audit query & statistical parity endpoint
│   │   │   ├── pipeline/route.js           # Pipeline audit & admin tier override PATCH
│   │   │   └── taxonomy/route.js           # Taxonomy CRUD endpoints (GET, POST, DELETE)
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js      # NextAuth dynamic handler (GET & POST)
│   │   │   └── register/route.js           # User registration with bcrypt hashing & passport creation
│   │   ├── cron/
│   │   │   └── ingest/route.js             # Automated multi-source job ingestion cron endpoint
│   │   ├── evidence/route.js               # Evidence retrieval & automated verification pipeline submission
│   │   ├── opportunities/
│   │   │   ├── [id]/route.js               # Dynamic explainable match detail & evidence citations
│   │   │   └── route.js                    # Ingested opportunity feed with personalized match ranking
│   │   └── passport/
│   │       ├── [shareToken]/route.js       # Public cryptographic share verification endpoint
│   │       ├── pdf/route.js                # Verifiable PDF certificate stream exporter
│   │       └── route.js                    # Student passport fetch & public/private visibility toggle
│   ├── components/                         # Modular Frontend Component Architecture
│   │   ├── admin/AdminNav.jsx              # Admin sub-navigation tabs
│   │   ├── auth/AuthRequiredView.jsx       # Fallback lock view for unauthorized routes
│   │   ├── evidence/EvidenceCard.jsx       # Interactive evidence submission cards
│   │   ├── landing/                        # Landing page hero, bento, use cases, metrics, FAQs, CTAs
│   │   ├── layout/Navbar.jsx, Footer.jsx   # Global layout headers and brand footers
│   │   ├── modals/DemoModal.jsx            # 1-click Demo account switcher
│   │   ├── opportunities/                  # Opportunity feed cards & Explainable Match centerpiece
│   │   ├── passport/                       # Luminous luxury emerald passport cards & evidence modals
│   │   └── ui/                             # Buttons, badges, particle effects, scroll reveals
│   ├── dashboard/                          # Student Workspace Hub
│   │   ├── evidence/new/page.js            # Evidence upload form with jsqr canvas scanner
│   │   └── page.js                         # Unified student dashboard (Evidence, Passport, Feed, Audit)
│   ├── data/                               # Initial data dictionaries & mock fallbacks
│   │   ├── mockData.js                     # Seed schemas for evidence, taxonomy, passports, jobs
│   │   └── skillsyncData.js                # Editorial copy, bento cards, testimonials, FAQ data
│   ├── hooks/useAuth.js                    # Session hook wrapping NextAuth & cookie state
│   ├── opportunities/page.js, [id]/page.js # Opportunity feed & Match Detail views
│   ├── passport/page.js, [shareToken]/page # Authenticated & public Skill Passport views
│   ├── profile/page.js                     # Student profile editor with calendar DOB picker
│   ├── globals.css                         # Tailwind v4 styles, keyframe animations, typography
│   ├── layout.js & template.js             # Root layout & directional horizontal page transitions
│   └── providers.js                        # SessionProvider, QueryClientProvider, ClickSpark
├── lib/                                    # Core Backend & Utility Modules
│   ├── config/env.js                       # Centralized env config (only file touching process.env)
│   ├── external/clients.js                 # Configured Supabase & Octokit singletons
│   ├── auth.js                             # Auth.js / NextAuth config (Credentials + GitHub)
│   ├── prisma.js                           # PrismaClient global singleton
│   ├── utils.js                            # Class merger utility (clsx + tailwind-merge)
│   ├── verification/                       # Multi-Stage Automated Verification Pipeline
│   │   ├── cryptoHash.js                   # SHA-256 record & passport credential hashing
│   │   ├── qrVerifier.js                   # QR & institutional registry signature validator
│   │   ├── githubCheck.js                  # Octokit repo & commit activity cross-checker
│   │   ├── ocrParser.js                    # OCR.Space & regex academic credential parser
│   │   └── pipeline.js                     # Master verification orchestrator
│   ├── ingestion/                          # Opportunity Ingestion Engine
│   │   ├── normalize.js                    # Normalization & taxonomy skill extractor
│   │   ├── remotive.js, arbeitnow.js, jobicy.js # Keyless job fetchers
│   │   └── adzuna.js, jooble.js            # Keyed aggregator clients
│   └── matching/                           # Explainable & Fair Matching Engine
│       ├── getMatchingFeatures.js          # Hard boundary strictly scrubbing demographic data
│       ├── scoring.js                      # Verification-weighted deterministic scoring
│       └── explainability.js               # Evidence citation & fairness guarantee generator
├── prisma/
│   ├── schema.prisma                       # PostgreSQL schema definitions
│   └── seed.js                             # Database seed script for demo accounts & taxonomy
├── docs/
│   ├── BUILD_LOG.md                        # Full-stack build log & architecture catalog (this file)
│   └── DESIGN_DOC.md                       # Design system, typography tokens, motion physics
├── .env.example & .env.local               # Environment variable templates & local defaults
└── proxy.js                                # Edge-level route protection & redirect middleware
```

---

## 3. Comprehensive Component Catalog

### 3.1. Landing Page Components (`app/components/landing/`)

* **`Hero.jsx`**: Primary landing hero section featuring animated pill badge, editorial typography, `<MagnifyingEvidence>` micro-interaction, asynchronous floating preview cards (`float-slow`, `float-left`, `float-right`), and direct CTA links.
* **`FeatureBento.jsx`**: Visual feature grid highlighting 3-Tier Verification previews, Explainable Match breakdowns, and the luminous dark obsidian Skill Passport preview card.
* **`UseCaseTabs.jsx`**: Segmented persona switcher demonstrating tailored platform workflows for Students, Self-Taught Devs, Career Switchers, and Recruiters.
* **`Metrics.jsx`**: Platform performance indicators (`100% Automated Verification`, `0 Human Verifiers`, `4 Demographic Factors Excluded`, `<1.2s Matching Speed`).
* **`SmartAssist.jsx`**: Match Engine Architecture card grid with squircle radiant glowing icons and themed hover borders.
* **`FAQSection.jsx` & `FinalCTA.jsx`**: Expandable FAQ accordion, developer support card, and high-conversion bottom call-to-action banner.

### 3.2. Evidence & Verification Components (`app/components/evidence/`)

* **`EvidenceCard.jsx`**: Detailed visual card rendering title, source tag (GitHub, Coursera, Hackathon, University), SHA-256 cryptographic hash, claimed skills, and verification tier badge with automated validation explanation.
* **`app/dashboard/evidence/new/page.js`**: Submission interface equipped with integrated client-side `jsqr` canvas scanner for automated instant QR decoding.

### 3.3. Opportunity & Match Components (`app/components/opportunities/`)

* **`OpportunityCard.jsx`**: Ingested job preview card with clean neutral match percentage badge ($\ge 75\%$ in emerald, moderate in pure neutral slate), work mode pills (Remote, Hybrid, On-site), and required skill chips.
* **`MatchExplanationCard.jsx`**: Full explainability centerpiece detailing why a candidate matched a role, displaying verified evidence citations, missing skills recommendations, and the **0% Demographic Bias Guarantee** banner.

### 3.4. Skill Passport Components (`app/components/passport/`)

* **`InteractivePassportCard.jsx`**: Rich luxury emerald credit-card style passport container with ambient glow lighting, verified badge counts, cryptographic Merkle root hash, and modal focus mode with `<AnimatePresence>` zoom-out transitions.
* **`SkillEvidenceModal.jsx`**: Luminous emerald glassmorphic drawer displaying underlying evidence records, SHA-256 hashes, and verification tier badges for any inspected skill.
* **`ShareExportButtons.jsx`**: Action toolbar with public/private share link toggle, copyable shareable URL (`/passport/[shareToken]`), JSON export, and server-streamed PDF Certificate generation.

### 3.5. Admin Governance Components (`app/components/admin/`)

* **`AdminNav.jsx`**: Tabbed navigation header across *Evidence Pipeline* (`/admin/pipeline`), *Skill Taxonomy* (`/admin/taxonomy`), and *Fairness Audit* (`/admin/fairness`).
* **`app/admin/pipeline/page.js`**: Pipeline inspection table with live manual tier override selector and reason logger.
* **`app/admin/taxonomy/page.js`**: Skill taxonomy CRUD manager for adding, categorizing, and removing platform skills.
* **`app/admin/fairness/page.js`**: Algorithmic fairness audit logs and Recharts statistical parity distribution graphs.

---

## 4. Pages & Route Structure

| Route | File Path | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | Public | Landing page (Hero, Bento, UseCases, Metrics, SmartAssist, FAQs, CTA). |
| `/signin` | `app/(auth)/signin/page.js` | Public | Sign-in page with Credentials, GitHub OAuth, and 1-Click Demo Logins. |
| `/signup` | `app/(auth)/signup/page.js` | Public | Registration page with live password validation criteria. |
| `/dashboard` | `app/dashboard/page.js` | Student / Admin | Unified workspace (Evidence, Passport, Feed, Governance tabs). |
| `/dashboard/evidence/new` | `app/dashboard/evidence/new/page.js` | Student | Evidence submission form with live QR scanner. |
| `/passport` | `app/passport/page.js` | Student | Authenticated Skill Passport view with category skill trees and export actions. |
| `/passport/[shareToken]` | `app/passport/[shareToken]/page.js` | Public | Public cryptographic passport verification route. |
| `/opportunities` | `app/opportunities/page.js` | Student / Public | Opportunity feed ranked by candidate match score. |
| `/opportunities/[id]` | `app/opportunities/[id]/page.js` | Student / Public | Explainable Match Detail view with evidence citations. |
| `/admin` | `app/admin/page.js` | Admin Only | Admin dashboard redirecting to `/admin/pipeline`. |
| `/admin/pipeline` | `app/admin/pipeline/page.js` | Admin Only | Evidence pipeline audit table with manual tier overrides. |
| `/admin/taxonomy` | `app/admin/taxonomy/page.js` | Admin Only | Skill taxonomy manager for creating, editing, and deleting skills. |
| `/admin/fairness` | `app/admin/fairness/page.js` | Admin Only | Fairness audit logs and statistical score distributions. |
| `/profile` | `app/profile/page.js` | Student | Profile settings with interactive calendar DOB picker. |
| `/support` | `app/support/page.js` | Public | Help center and technical developer contact form. |
| `/docs` | `app/docs/page.js` | Public | In-app technical documentation and API specifications. |
| `/privacy` | `app/privacy/page.js` | Public | Privacy policy and demographic data exclusion guarantees. |
| `/terms` | `app/terms/page.js` | Public | Terms of service and platform governance guidelines. |

---

## 5. Backend REST API Endpoints

| Endpoint | Method | Purpose & Contract |
| :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Auth.js handler managing session tokens and GitHub OAuth callbacks. |
| `/api/auth/register` | `POST` | Hashes passwords with `bcryptjs` and initializes student Skill Passports. |
| `/api/evidence` | `GET`, `POST` | Queries student evidence or runs multi-stage automated verification pipeline. |
| `/api/opportunities` | `GET` | Returns ingested opportunities ranked by demographic-free match score. |
| `/api/opportunities/[id]`| `GET` | Returns full explainable match breakdown with evidence citations. |
| `/api/passport` | `GET`, `POST` | Fetches student passport or toggles public/private visibility. |
| `/api/passport/[shareToken]` | `GET` | Resolves public verified passport for employers and third parties. |
| `/api/passport/pdf` | `GET` | Streams verifiable PDF passport certificate document. |
| `/api/admin/pipeline` | `GET`, `PATCH` | Lists pipeline submissions and applies manual admin tier overrides. |
| `/api/admin/taxonomy` | `GET`, `POST`, `DELETE` | Skill taxonomy CRUD management. |
| `/api/admin/fairness` | `GET` | Returns demographic parity metrics and historical audit logs. |
| `/api/cron/ingest` | `GET` | Trigger background ingestion across Remotive, Arbeitnow, Jobicy, Adzuna, and Jooble. |

---

## 6. Utilities, Security & Middleware

* **`proxy.js`**: Edge-level route protection guarding `/admin/*` and `/dashboard/*` routes based on `next-auth.session-token` and `skillsync_session` cookies.
* **`lib/config/env.js`**: Centralized environment variable validator and single source of truth.
* **`lib/matching/getMatchingFeatures.js`**: Hard boundary strictly enforcing 0% demographic bias.
* **`lib/utils.js`**: Standard `cn(...)` utility combining `clsx` and `tailwind-merge`.
