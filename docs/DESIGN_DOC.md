# SkillSync Design & Aesthetic Specification

This document details the visual design system, color palette, typography hierarchy, UI components, layout structures, and micro-interaction patterns used in the **SkillSync** application.

---

## 1. Design Philosophy & Aesthetics

SkillSync follows a **Clean, Modern, Function-Driven Editorial Aesthetic** inspired by modern fintech, high-end educational tools, and productivity applications.

* **Frictionless & Utility-First**: Direct layout structures prioritizing data legibility, skill verification transparency, and match scoring.
* **Elevated Neutral Palette**: Soft warm off-white surfaces (`#F5F5F3`) combined with deep obsidian text (`#111111`) to prevent stark, harsh contrast while maintaining readability.
* **Sophisticated Radii & Depth**: Generous rounded corners (`1.5rem` to `2rem`) paired with subtle structural borders and micro-shadows.
* **No Unnecessary Clutter**: Clean spaces without decorative mesh overlays or high-contrast glow effects.

---

## 2. Color Palette & Token System

### Core Brand Colors

| Token Name | Hex Code / Value | Usage & Context |
| :--- | :--- | :--- |
| `background` / `--background` | `#F5F5F3` | Primary application background (soft off-white) |
| `foreground` / `--foreground` | `#111111` | Primary body text & prominent UI elements |
| `surface-white` | `#FFFFFF` | Card containers, modal popovers, elevated surfaces |
| `muted-text` | `#666666` | Subtitles, metadata, timestamps, secondary labels |
| `border-subtle` | `#E5E5E0` | Card borders, dividers, subtle section splits |

### Semantic & Functional Colors

| Category | Hex Code / Tailwind Class | Application |
| :--- | :--- | :--- |
| **Accent Primary** | `#000000` / `#111111` | Primary call-to-action buttons, active navigation states |
| **Success / Verified** | `#16A34A` (`green-600`) | Verified skill badges, high match confidence indicators |
| **Warning / Pending** | `#CA8A04` (`yellow-600`) | Pending verification, partial skill match warnings |
| **Info / Highlight** | `#2563EB` (`blue-600`) | Interactive links, focus rings, tag pills |

---

## 3. Typography & Type Hierarchy

### Font Families

* **Primary Display & Headings**: `Stack Sans Headline`
* **Primary Body & UI Controls**: `Google Sans Flex Variable` / `Google Sans Flex`
* **Monospace Code / Data**: Geist Mono (`--font-geist-mono`)

```css
--font-sans: "Stack Sans Headline", "Google Sans Flex Variable", "Google Sans Flex", Arial, Helvetica, sans-serif;
--font-mono: var(--font-geist-mono);
```

### Type Scale & Hierarchy

| Role | Font Weight | Line Height | CSS / Tailwind Equivalent |
| :--- | :--- | :--- | :--- |
| **Display Title (Hero)** | 700 (Bold) | 1.1 | `text-4xl` to `text-6xl`, tracking-tight |
| **Section Heading (H1/H2)** | 700 (Bold) | 1.2 | `text-2xl` to `text-3xl` |
| **Card Title (H3/H4)** | 500 (Medium) | 1.3 | `text-lg` to `text-xl` |
| **Body Text** | 400 (Regular) | 1.5 | `text-base` / `text-sm` |
| **Badges & Labels** | 500 (Medium) | 1.0 | `text-xs` / `text-sm`, uppercase / tracking-wide |

---

## 4. Spacing, Geometry & Radii

SkillSync utilizes modern extra-large border radii to establish a soft, tactile interface design.

```css
@theme inline {
  --radius-3xl: 1.5rem; /* 24px - Standard Cards & Containers */
  --radius-4xl: 2.0rem; /* 32px - Hero Containers & Modals */
}
```

### Geometry Tokens

* **Outer Card Corners**: `rounded-3xl` (`1.5rem` / `24px`)
* **Hero / Large Panels**: `rounded-4xl` (`2.0rem` / `32px`)
* **Pill Badges & Buttons**: `rounded-full`
* **Input Fields & Dropdowns**: `rounded-xl` (`0.75rem` / `12px`)

---

## 5. Layout & Key Design Utilities

### 1. Radial Curve Masking
Used on hero backgrounds and prominent visual headers to softly blend images and interactive overlays into the background.

```css
.hero-curve-mask {
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
  mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
}
```

### 2. Micro-Animations & Floating Transitions
Enables subtle movement for badges, floating cards, and feature highlights.

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### 3. Clean Scrollable Containers
Scrollbars are hidden on carousels and tag lists to keep layouts minimal and responsive.

```css
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

---

## 6. Design System Guidelines & Best Practices

1. **Accessibility & Contrast**: Ensure all body text against `--background` (`#F5F5F3`) maintains high contrast ratios using `#111111` or `#333333`.
2. **Fluid Responsiveness**: Layouts adapt dynamically from mobile viewports to desktop split-screens using flexbox and grid containers without layout shifts.
3. **Card Content Density**: Keep cards uncluttered. Avoid nesting more than two layers of sub-cards inside a primary container.
