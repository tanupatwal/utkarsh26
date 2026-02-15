# Utkarsh 2026 — AI Context File

> **Read this first.** This file gives any AI assistant the full context to continue work on this project from any point.
>
> **CRITICAL**: This project is a **visual replica** of the existing site at `../hasfilm/`. The architecture is entirely new but the **look, animations, and feel must match exactly**. Before building any section, you MUST read the corresponding old source file to extract all visual details.

## What Is This Project?

A from-scratch professional rebuild of the **Utkarsh 2026** college fest scrollytelling website. The previous version lived in `../hasfilm/` and suffered from fundamental architectural issues (see `docs/code_audit.md` and `docs/stacking_architecture.md`). This project (`utkarsh-v2/`) is the clean rewrite.

## Architecture — The Key Decision

**We dropped drei `ScrollControls` entirely.** Instead:

| Layer | Technology |
|-------|-----------|
| Smooth scroll | **Lenis** (real document scroll) |
| Scroll animations | **GSAP ScrollTrigger** (`pin`, `scrub`, `snap`) via **`@gsap/react`** `useGSAP` hook |
| 3D rendering | **React Three Fiber** + **drei** (Canvas only, NO `ScrollControls`) |
| State | **Zustand** — GSAP `onUpdate` writes scroll progress, R3F `useFrame` reads it |
| Styling | **CSS Modules** (`.module.css`) — no template literals, no CDN Tailwind |
| A11Y | Semantic HTML, ARIA, `prefers-reduced-motion`, skip links — from Phase 1 |

### Data Flow

```
Lenis (smooth scroll) → GSAP ScrollTrigger → onUpdate writes to Zustand
                                            → pin / scrub / snap HTML sections
Zustand progress → R3F useFrame → drives 3D camera / meshes
```

Sections are **normal `<section>` elements in document flow** — no `position: fixed`, no scroll compensation, no z-index juggling.

## Project Structure

```
src/
├── app/           — App.tsx, main.tsx entry point
├── features/      — Feature-based folders (hero/, tunnel/, about/, gallery/, highlights/, schedule/, team/)
│   └── <feature>/ — ComponentName.tsx, ComponentName.module.css, useAnimation.ts
├── shared/        — Cross-cutting: Navbar, Footer, ProgressBar, hooks, Zustand stores, global styles
├── canvas/        — CanvasLayer.tsx (single fixed <Canvas> behind all HTML)
└── data/          — Content data files (team.ts, schedule.ts, etc.)
```

## Development Approach

**Phase-by-phase, section-by-section.** The user reviews each phase before proceeding.

- After implementing a section, the user checks it visually at `http://localhost:3001`
- Match the exact visuals of the existing site in `../hasfilm/`
- Each section should work with smooth Lenis scroll and GSAP animations

## Current Progress

Check `docs/PROGRESS.md` for the live task tracker with checkbox status.

## Key Documents

| Document | Purpose |
|----------|---------|
| `docs/architecture_rules.md` | **READ FIRST** — Mandatory code patterns with ✅/❌ examples |
| `docs/design_specs.md` | **READ SECOND** — Every visual detail extracted from hasfilm (colors, fonts, animations, 3D configs) |
| `docs/implementation_plan.md` | Full phased rebuild plan (Phase 0–7) |
| `docs/stacking_architecture.md` | Why the old arch was bad, how the new one works |
| `docs/code_audit.md` | Original codebase audit with all findings |
| `docs/PROGRESS.md` | Live task tracker — what's done, what's next |

## Visual Parity: What to Port vs What to Rebuild

This is the most important section. **Every section must look identical to the old site** — same colors, same animations, same cosmetics, same feel. The difference is HOW it's built.

### Per-Section Reference Map

Before implementing any section, **read the old source file first** and extract:
- Colors, gradients, shadows, glows
- Animation timings, easings, stagger delays
- Layout (flex/grid structure, gaps, padding)
- Typography (font sizes, weights, letter-spacing)
- Special effects (particles, morphs, parallax)

| Section | Old Source File to Read | What to PORT (visuals) | What to REBUILD (architecture) |
|---------|------------------------|----------------------|-------------------------------|
| **Hero** | `../hasfilm/src/components/overlays/HeroSection.tsx` | Video bg, gradient title (`linear-gradient #fff→#F5C16C→#FF8C42→#00E5FF`), zoom-on-scroll effect, matte fade overlay, subtitle styling, animation delays | Replace DOM polling + RAF loop with GSAP `pin` + `scrub` |
| **Tunnel** | `../hasfilm/src/components/sections/tunnel/TunnelGroup.tsx` | 3D geometry (cylinders, tile textures, lighting), camera path, speed ramping | Replace `useScroll()` with Zustand progress from GSAP |
| **About** | `../hasfilm/src/components/sections/about/AboutSection.tsx` | Staggered reveal timing (per-element delays), stat card design, ambient glow orbs, title gradient, `easeOutCubic` easing `1-Math.pow(1-t,3)`, exit slide-up | Replace `useFrame` + manual easing with GSAP `.from()` stagger |
| **Gallery** | `../hasfilm/src/components/sections/gallery/GalleryGroup.tsx` + `GalleryOverlay.tsx` + `GalleryMorph.tsx` | 3D curved panels, image textures, rotation arc, HUD overlay (index counter, title, timeline dots), morph transitions | Replace `useScroll()` with Zustand progress |
| **Highlights** | `../hasfilm/src/components/sections/gallery/HighlightsSection.tsx` | Floating image spawn system (35 images), gravity drain physics, per-layer delay, motion blur, backdrop fade, title typography | Keep particle logic, replace scroll compensation with GSAP |
| **Schedule** | `../hasfilm/src/components/sections/schedule/ScheduleSection.tsx` | HUD card design (chamfered edges, neon glows, scanline overlay, glassmorphism), day tabs, expanded view layout, modal design, ALL 448 lines of CSS cosmetics | Migrate CSS to `.module.css`, replace `createPortal` with inline `<dialog>`, remove `useFrame` |
| **Team** | `../hasfilm/src/components/sections/team/TeamSection.tsx` | Node graph layout, circular photos, SVG connections, hover bloom cards, parallax, staggered reveal, ALL 336 lines of CSS cosmetics | Migrate CSS to `.module.css`, replace scroll trap with GSAP `snap` |

### Data Files to Port (copy content, update imports)

| Data | Old Path | New Path |
|------|----------|----------|
| About content | `../hasfilm/src/data/content.ts` | `src/data/content.ts` |
| Gallery images | `../hasfilm/src/data/gallery.ts` | `src/data/gallery.ts` |
| Highlights | `../hasfilm/src/data/highlights.ts` | `src/data/highlights.ts` |
| Schedule events | `../hasfilm/src/data/schedule.ts` | `src/data/schedule.ts` |
| Team members | `../hasfilm/src/data/team.ts` | `src/data/team.ts` |

### What NEVER to Port

- ❌ `position: fixed` + `translate3d` scroll compensation
- ❌ `useFrame` for scroll math / opacity management
- ❌ `createPortal` to `document.body`
- ❌ CSS template literals (`const STYLES = \`...\``)
- ❌ `setInterval` DOM polling
- ❌ `window.addEventListener('wheel', ...)` capture
- ❌ `scrollContainer.scrollTop = ...` pinning
- ❌ `SCROLL_CONFIG.PAGES` / `TIMELINE.*` magic numbers

## How to Resume Work

1. Read `docs/architecture_rules.md` — **mandatory**, contains the exact code patterns you must follow
2. Read `docs/design_specs.md` — **mandatory**, contains every visual detail (colors, fonts, animations) already extracted from hasfilm
3. Read `docs/PROGRESS.md` to see where we left off
4. Read the relevant phase in `docs/implementation_plan.md`
5. Find the section you're building in `design_specs.md` — it has all colors, gradients, font sizes, animation timings, and 3D configs you need. **No need to read hasfilm source files.**
6. Build the section using the correct pattern (A, B, or C from the rules doc) with visuals from the design spec
7. User verifies at `http://localhost:3001` by comparing with old site at `http://localhost:3000`
8. Update `docs/PROGRESS.md` checkboxes

## Commands

```bash
npm run dev          # Start dev server (port 3001)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

## Reference: Old Project

The old codebase is at `../hasfilm/` — use it for:
- **Visual reference**: read old component files to extract exact colors, animations, layouts
- **Data files**: copy content from `src/data/` (team, schedule, highlights, gallery, content)
- **Assets**: `public/assets/` (already copied to this project)
- **Do NOT** copy architectural patterns — they are anti-patterns (see `docs/stacking_architecture.md`)
