# UTKARSH 2026 - Master Task List & Status

> **Project Phase:** Phase 2 Complete (Visual Theater Live)
> **Next Phase:** Phase 3 (The Overlay Content)
> **Context:** See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)

This document tracks the **dynamic** progress of the project: The Task Checklist and The Immediate Implementation Plan.

---

## 1. Master Task List

### Phase 0: Design & Strategy
- [x] Define "Cinematic Flow" Architecture
- [x] Create `DESIGN.md` (Creative Manifesto & Interaction Model)

### Phase 1: The Engine (State & Pulse)
- [x] Install dependencies: `gsap`, `lenis`, `three`, `@types/three`, `@threlte/core`, `@threlte/extras`
- [x] **[UPGRADE]**: Create `scrollState.svelte.ts` with `velocity`, `isLoaded`, and Runes
- [x] **[UPGRADE]**: Implement `GhostScroller.svelte` using **GSAP Ticker** as the *only* master heartbeat (Single-Loop)
- [x] Configure `src/routes/+layout.svelte` for "Transparent Window" pattern (with `dvh` units)

### Phase 2: The Theater (Visuals)
- [x] Create `Canvas3D.svelte` with high-performance resize listener
- [x] **[UPGRADE]**: Implement "Look-Ahead" Camera Logic (CatmullRomCurve3 + projected target)
- [x] Implement "Warp" Shader (linking FOV to `scrollState.velocity`)
- [x] **[NEW]**: Create `Preloader.svelte` to manage asset loading state

### Phase 3: The Overlay (Content)
- [ ] **[UPGRADE]**: Build HTML structure using `dvh` (Dynamic Viewport Height) units
- [ ] Implement "Hero" Section (Pinned, Fade-out)
- [ ] Implement "Warp" Spacer (Transparent)
- [ ] Implement "About" Section (Slide-in, PCB Texture switch)
- [ ] Implement "Gallery" Section (Transparent, 3D Fragments)
- [ ] Implement "Highlights" & "Team" Section (Bento Cards, Name Scrub)

### Phase 4: Polish & Micro-Interactions
- [ ] Add Audio Manager for adaptive soundscapes
- [ ] Implement Custom Cursor (hover states)
- [ ] Polish Transitions: GSAP Scrub linking DOM opacity to Camera progress

---

## 2. Implementation Plan (Current Focus)

### Phase 3: The Overlay (Content)

#### [MODIFY] [src/routes/+page.svelte]
**Goal:** Create the scrollable height and section containers.
1.  **Hero:** `h-[100dvh]` flex-center. Title "UTKARSH".
2.  **Warp:** `h-[50dvh]`. Empty.
3.  **About:** `h-[100dvh]`. Content right-aligned.
4.  **Gallery:** `h-[200dvh]`. Text floating.
5.  **Team:** `h-[100dvh]`.

#### [NEW] [src/lib/components/sections/Hero.svelte]
-   Pinning logic using `ScrollTrigger`.
-   "Scramble" text effect.

#### [NEW] [src/lib/components/sections/About.svelte]
-   Slide-in animation.
-   Button with "Magnetic" effect.
