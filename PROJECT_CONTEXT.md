# UTKARSH 2026 - Project Context

> **Last Updated:** 2026-02-16
> **Doc Type:** Static Context (Vision & Architecture)
> **Task Tracking:** See [PROJECT_TASKS.md](./PROJECT_TASKS.md)

This document contains the **invariant** truths of the project: The Vision, The Architecture, and The Tech Stack.

---

## 1. The Vision ("The Why")
**Goal:** Build an "Interactive Cinematic Engine," not just a website.
**Theme:** "Virasat se VIKAS" (From Heritage to Evolution).
**Experience:** A linear journey through time where the user feels physically connected to a 3D world via scroll.
**Key Design Logic:** See [DESIGN.md](./DESIGN.md) for the full Manifesto.

---

## 2. The Architecture ("The How")
We are using a **State-Driven, Hybrid Scroller** to ensure 60fps performance without "Scroll Jank."

### Tech Stack
*   **Runtime:** Bun
*   **Framework:** Svelte 5 (Runes for surgical updates)
*   **Motion:** Lenis + GSAP (Single-Loop Heartbeat)
*   **3D Engine:** Three.js + Threlte (Raw WebGL for performance)
*   **Styling:** Tailwind CSS (v4 features + Typography plugin)

### Core Components
*   **The Brain:** `src/lib/state/scrollState.svelte.ts` (Global State)
*   **The Heart:** `src/lib/components/GhostScroller.svelte` (GSAP Ticker + Lenis)
*   **The Theater:** `src/lib/components/3d/Canvas3D.svelte` (Fixed WebGL Background)
*   **The Overlay:** `src/routes/+layout.svelte` (HTML Content Layer)

---

## 3. Helpful Commands & Links

*   **Start Dev Server:** `bun run dev`
*   **Format Code:** `bun run format` (using Prettier + Tailwind plugin)
*   **Design Doc:** [Rule Book](./DESIGN.md)
