<div align="center">

# 🎬 Utkarsh 2026 — The Festival

**Three days. Ten thousand people. One stage that never sleeps.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r182-000000?style=flat-square&logo=threedotjs)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com)

</div>

---

## What is this?

This is the official website for **Utkarsh 2026** — the annual cultural fest that has been the highlight of the calendar since 2006. Every year it brings together 10,000+ attendees, 100+ events, and more energy than anyone is quite prepared for.

The site is built to feel like the festival itself — immersive, kinetic, a little overwhelming in the best way. You scroll, and the world moves with you: a 3D WebGL gallery that responds to your scroll like film frames running through a projector, a full-screen cinematic hero, and sections that slide in and out with intention. It doesn't feel like a website. That's the point.

---

## The Experience

Here's what someone actually sees when they visit:

- **A video hero** — full viewport, dark, atmospheric. Fades as you start scrolling.
- **The About section** — fades in over the hero with stats: 3 days, 10K+ people, 100+ events. Animates the numbers up as they come into view.
- **A 3D gallery** — scroll through ~5 viewports and watch image panels move through 3D space, driven frame-by-frame by your scroll position. Built in WebGL via React Three Fiber and Three.js. The camera doesn't move — the panels do.
- **Event Highlights** — a full-bleed horizontal scroll of past moments.
- **Schedule** — multi-day event listing, pulled live from Supabase.
- **The Team** — grid of the people who made it happen, also pulled from Supabase.
- **Footer** — and breathe.

On mobile, the heavy 3D scenes are swapped for optimised flat equivalents so the experience holds up regardless of the device.

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19 + TypeScript 5.8 |
| **Build** | Vite 6 |
| **3D** | Three.js r182, React Three Fiber, Drei |
| **Animation** | GSAP 3 with ScrollTrigger |
| **Smooth scroll** | Lenis 1.3 (synced with GSAP) |
| **Styling** | TailwindCSS v4 + Vanilla CSS |
| **Fonts** | Clash Display, DM Sans, Fraunces, Manrope |
| **Backend** | Supabase (PostgreSQL) |
| **Data fetching** | TanStack Query v5 |

---

## Running it locally

**Prerequisites:** Node.js ≥ 18

```bash
git clone <repo-url>
cd hasfilm
npm install
```

Set up your `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> The app ships with hardcoded fallback data for all sections — schedule, team, highlights. So if you don't have Supabase credentials, it'll still run fine. The live data just won't load.

Then:

```bash
npm run dev       # starts at localhost:3000
npm run build     # production build
npm run preview   # preview the build
```

---

## How it's put together

The core architectural idea is a **fixed Canvas layer behind real DOM content**:

```
LenisProvider (smooth scroll context)
├── HeroSection          — position: fixed, fades out as you scroll
├── Canvas               — position: fixed, z-index: 1, no pointer events
│   └── GalleryGroup     — 3D panels, driven by a scroll progress 0→1
└── <main>               — real scroll height, z-index: 2
    ├── #about-section
    ├── #gallery-section  → ScrollTrigger drives galleryProgress here
    ├── #highlights-section
    ├── #schedule-section
    ├── #team-section
    └── FooterSection
```

The gallery section is 500vh tall (400vh on mobile). As you scroll through it, a `ScrollTrigger` scrubs a `galleryProgress` signal from 0 to 1. The 3D panels read that signal on every animation frame and update their positions. The Canvas itself never moves — it's always fixed to the screen.

### Data only loads when you need it

Every Supabase fetch is gated behind an `IntersectionObserver`. The Schedule, Team, and Highlights sections don't hit the DB until their section is within 300px of the viewport. This keeps the initial load fast and the network tab clean.

### Mobile gets its own components

Rather than making the same components responsively shrink, we swap them entirely on mobile. `TeamSection` → `MobileTeamSection`, `HighlightsSection` → `MobileHighlightsSection`. The GPU DPR is also capped per device class (1.0 on small mobile, 1.5 on tablet, 2.0 on desktop) to keep frame rates stable.

---

## Project Structure

```
src/
├── components/
│   ├── canvas/          Three.js scene setup
│   ├── overlays/        Navbar, HeroSection, mobile menus
│   └── sections/
│       ├── about/       About + stats
│       ├── gallery/     3D gallery (GalleryGroup, panels, overlays)
│       ├── highlights/  Event highlights
│       ├── schedule/    Multi-day schedule
│       ├── team/        Team grid (desktop + mobile)
│       └── footer/
├── config/              Animation, scroll, scene, timeline constants
├── data/                Hardcoded fallbacks for schedule, team, highlights
├── hooks/               useIsMobile, useSupabaseData, galleryProgress
├── lib/                 Supabase client
├── providers/           LenisProvider
├── styles/              tailwind.css, spacing.css, typography.css
└── types/
```


---

*Built for Utkarsh by the fest team. All rights reserved.*
