# SkillSync Design & Aesthetic Specification

This document details the visual design system, color palette, typography hierarchy, UI components, layout structures, motion physics, and micro-interaction patterns used across the **SkillSync** application.

---

## 1. Design Philosophy & Aesthetics

SkillSync follows a **Clean, Modern, Function-Driven Editorial Aesthetic** inspired by modern fintech, high-end educational platforms, and progressive productivity applications.

* **Frictionless & Utility-First**: Direct layout structures prioritizing data legibility, skill verification transparency, and match scoring.
* **Elevated Neutral Palette**: Soft warm off-white surfaces (`#F5F5F3`) combined with deep obsidian text (`#111111`) and crisp pure white card surfaces (`#FFFFFF`) to prevent stark contrast while maximizing readability.
* **Sophisticated Radii & Depth**: Generous rounded corners (`rounded-3xl` / `1.5rem`, `rounded-4xl` / `2.0rem`) paired with full pill-shaped action buttons (`rounded-full`), subtle structural borders (`border-[#E5E5E0]`), and soft ambient elevation shadows (`shadow-xl shadow-black/5`).
* **Hardware-Accelerated Motion**: Smooth, deliberate scroll-triggered reveal animations via `<FadeIn>` combined with continuous asynchronous floating physics (`float-slow`, `float-left`, `float-right`) and dynamic letter-flipping text animations (`RollingText`).
* **Trust & Fairness Transparency**: Visual cues highlighting algorithmic fairness, 0% demographic bias guarantees, and a distinct 3-tier evidence verification badge system.

---

## 2. Color Palette & Token System

### Core Brand Surfaces & Base Tokens

| Token Name | Hex / Tailwind Value | Usage & Context |
| :--- | :--- | :--- |
| `background` / `--background` | `#F5F5F3` | Primary application page background (soft warm off-white) |
| `foreground` / `--foreground` | `#111111` | Primary body text, headings, and high-emphasis UI elements |
| `surface-white` | `#FFFFFF` | Primary card containers, popovers, elevated white surfaces |
| `surface-dark` | `#0B0F17` / `#0A0D14` | Dark mode showcase cards (Skill Passport bento preview, dark hero cards) |
| `muted-text` | `#666666` / `#71717A` | Subtitles, metadata, timestamps, secondary labels |
| `border-subtle` | `#E5E5E0` / `#E4E4E7` | Card borders, table dividers, subtle section splits |
| `border-dark` | `#1E293B` / `#27272A` | Structural borders for dark cards and terminal-style views |

### Semantic Verification & Fairness Colors

| Category | Value / Classes | Visual Representation & Context |
| :--- | :--- | :--- |
| **Verified High Tier** | `emerald-600` / `#059669`<br>`bg-emerald-500/10 text-emerald-700 border-emerald-500/20` | Automated QR cryptographic / registry verification |
| **Verified Medium Tier** | `amber-600` / `#D97706`<br>`bg-amber-500/10 text-amber-700 border-amber-500/20` | Repository commit analysis, institutional heuristic match |
| **Flagged Low Tier** | `rose-600` / `#E11D48`<br>`bg-rose-500/10 text-rose-700 border-rose-500/20` | Unverified self-claim, metadata mismatch, pending review |
| **Fairness Guarantee** | `blue-600` / `indigo-600`<br>`bg-blue-500/10 text-blue-700 border-blue-500/20` | 0% demographic bias indicators (Gender, College, Photo, Name) |
| **Primary CTA Accent** | `#111111` / `#000000`<br>`hover:bg-neutral-800 text-white` | Primary call-to-action buttons, active navigation states |

---

## 3. Typography & Type Hierarchy

### Font Families

* **Primary Display & Headings**: `Stack Sans Headline` (`font-sans`)
* **Primary Body & UI Controls**: `Google Sans Flex Variable` / `Google Sans Flex`
* **Monospace Code / Data / Hashes**: `Geist Mono` (`--font-geist-mono`)

```css
--font-sans: "Stack Sans Headline", "Google Sans Flex Variable", "Google Sans Flex", Arial, Helvetica, sans-serif;
--font-mono: var(--font-geist-mono);
```

### Type Scale & Hierarchy

| Role | Font Weight | Line Height | Font Size / Tailwind Equivalent |
| :--- | :--- | :--- | :--- |
| **Display Title (Hero)** | 800 / 900 (Extra Bold) | 1.05 – 1.1 | `text-4xl` to `text-6xl` (`2.5rem` – `3.75rem`), `tracking-tight` |
| **Section Heading (H1/H2)** | 700 / 800 (Bold) | 1.15 – 1.2 | `text-2xl` to `text-4xl` (`1.75rem` – `2.5rem`), `tracking-tight` |
| **Card Title (H3/H4)** | 600 / 700 (Semi-Bold) | 1.25 – 1.3 | `text-lg` to `text-xl` (`1.125rem` – `1.25rem`) |
| **Button Text (Primary CTAs)** | 700 / 800 (Bold) | 1.0 | `text-[15px]` to `text-[17px]`, `tracking-tight` |
| **Body Text** | 400 / 500 (Regular) | 1.5 – 1.6 | `text-sm` (`0.875rem`) / `text-base` (`1.0rem`) |
| **Badges & Micro-Labels** | 700 / 800 (Extrabold) | 1.0 | `text-[10px]` to `text-xs` (`0.65rem` – `0.75rem`), `tracking-wider`, uppercase |

---

## 4. Spacing, Geometry & Radii

SkillSync features soft, tactile curvature across all interactive and layout surfaces.

```css
@theme inline {
  --radius-3xl: 1.5rem; /* 24px - Standard Cards & Containers */
  --radius-4xl: 2.0rem; /* 32px - Hero Containers & Modals */
}
```

### Geometry Tokens

* **Call-to-Action Buttons**: `rounded-full` (Pill-shaped for ergonomic, modern touch targets)
* **Standard Cards & Bento Containers**: `rounded-3xl` (`1.5rem` / `24px`)
* **Hero Wrappers & Modals**: `rounded-4xl` (`2.0rem` / `32px`)
* **Pills & Tag Badges**: `rounded-full`
* **Input Fields & Dropdowns**: `rounded-2xl` (`1.0rem` / `16px`)
* **Inner Icon Pods**: `rounded-2xl` / `rounded-full` with subtle borders

### Button Padding & Proportions

All primary and secondary CTA buttons employ generous touch padding and optimized font sizing:

* **Hero CTAs**: `px-8 py-5.5 text-[17px] rounded-full`
* **Feature Bento CTAs**: `px-6 py-5 text-sm font-extrabold rounded-full`
* **Use Case & SmartAssist CTAs**: `px-6 py-4.5 text-[15px] font-extrabold rounded-full`
* **Final CTA Banner Buttons**: `px-8 py-5.5 text-base font-extrabold rounded-full`

---

## 5. Motion, Physics & Micro-Interactions

### 1. Unified Scroll Reveal System (`<FadeIn>`)
The landing page and dashboard views utilize smooth, cubic-bezier scroll reveals powered by `framer-motion`:
* **Easing Curve**: `[0.16, 1, 0.3, 1]` (luxurious, responsive deceleration)
* **Viewport Trigger**: `once: true, amount: 0.15, margin: "0px 0px -80px 0px"` ensuring components animate naturally as they enter view.
* **Progressive Entrance**: Staggered child orchestration (`<FadeInStagger>` and `<FadeInItem>`) with fast, snappy offsets (0.02s – 0.14s delays, 12px – 18px slide distances).

### 2. Continuous Asynchronous Floating Physics
Hero preview cards levitate smoothly and asynchronously via hardware-accelerated CSS keyframes with 60fps transform optimizations:

```css
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes float-left {
  0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
  50% { transform: translateY(-14px) rotate(0.5deg); }
}

@keyframes float-right {
  0%, 100% { transform: translateY(0px) rotate(0.5deg); }
  50% { transform: translateY(-12px) rotate(-0.5deg); }
}

.animate-float-slow { animation: float-slow 7s ease-in-out infinite; will-change: transform; }
.animate-float-left { animation: float-left 5.5s ease-in-out infinite; will-change: transform; }
.animate-float-right { animation: float-right 6.2s ease-in-out infinite 0.7s; will-change: transform; }
```

### 3. Dynamic Interactive Micro-Interactions
* **RollingText Button Animation**: Letters flip upwards sequentially on button hover with 0.4s roll duration and 0.015s letter stagger.
* **Surface Lift & Elevation**: Cards subtly translate upwards (`hover:-translate-y-1`) with soft diffused drop shadows (`hover:shadow-xl hover:shadow-black/5`).
* **ClickSpark Particle Effects**: Interactive canvas-rendered radial particle sparks on user clicks.
* **Radial Curve Masking**: `hero-curve-mask` softly dissolves hero backdrop textures into the background.

---

## 6. Key Interface Component Patterns

### 1. Verification Tier Badges (`Badge.jsx`)
Standardized 3-tier verification pills:
* **Verified High**: Emerald badge, `CheckCircle2` icon, indicates cryptographic proof or verified registry match.
* **Verified Medium**: Amber badge, `AlertTriangle` icon, indicates commit heuristics or institutional data match.
* **Flagged Low**: Rose badge, `ShieldAlert` icon, indicates self-declaration requiring verification.

### 2. Explainable Match Centerpiece (`MatchExplanationCard.jsx`)
* **Match Breakdown**: Match score percentage badge with radar breakdown.
* **Evidence Citations**: Direct list of verified evidence items contributing to the score.
* **Fairness Guarantee Banner**: Prominent callout highlighting zero-bias parameter exclusion:
  `excludedFromRanking: ["gender", "college tier", "name", "photo"]`.

### 3. Skill Passport Card (`InteractivePassportCard.jsx` & Bento Dark Card)
* **Dark Obsidian Aesthetic**: High-contrast dark card container (`#0B0F17`) with emerald glowing accents.
* **Cryptographic Verification**: Dynamic verification status badge, SHA-256 hash preview, and category breakdown.
* **Export Triggers**: One-click actions for JSON export, PDF certificate streaming, and secure public share token toggling.

---

## 7. Accessibility & Responsive Standards

1. **High Text Contrast**: Obsidian text (`#111111`) on warm off-white (`#F5F5F3`) and white (`#FFFFFF`) cards guarantees WCAG AAA compliance.
2. **Accessible Touch Targets**: All buttons adhere to minimum `44px` height and touch-friendly padding.
3. **Fluid Multi-Device Layouts**: Mobile-first responsive grids with graceful collapse from 3-column desktop layouts to single-column phone viewports.
