# Utkarsh 2026 — AI Context File

> **Read this first.** This file gives any AI assistant the full context to continue work on this project from any point.

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
| `docs/implementation_plan.md` | Full phased rebuild plan (Phase 0–7) |
| `docs/stacking_architecture.md` | Why the old arch was bad, how the new one works |
| `docs/code_audit.md` | Original codebase audit with all findings |
| `docs/PROGRESS.md` | Live task tracker — what's done, what's next |

## How to Resume Work

1. Read `docs/PROGRESS.md` to see where we left off
2. Read the relevant phase in `docs/implementation_plan.md`
3. If building a section, reference the corresponding component in `../hasfilm/src/` for visual parity
4. After implementing, user verifies at `http://localhost:3001`
5. Update `docs/PROGRESS.md` checkboxes

## Commands

```bash
npm run dev          # Start dev server (port 3001)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

## Reference: Old Project

The old codebase is at `../hasfilm/` — use it for:
- Visual reference (what should it look like?)
- Data files to port (`src/data/`)
- Assets (`public/assets/` — already copied)
- **Do NOT** copy architectural patterns — they are anti-patterns (see docs)
