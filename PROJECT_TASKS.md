# UTKARSH 2026 - Master Task List & Status

> **Project Phase:** Phase 1 Complete (The Engine is Live)
> **Next Phase:** Phase 2 (The Visual Theater)
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
- [ ] Create `Canvas3D.svelte` with high-performance resize listener
- [ ] **[UPGRADE]**: Implement "Look-Ahead" Camera Logic (CatmullRomCurve3 + projected target)
- [ ] Implement "Warp" Shader (linking FOV to `scrollState.velocity`)
- [ ] **[NEW]**: Create `Preloader.svelte` to manage asset loading state

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

### Phase 2: The Theater (Visuals)

#### [MODIFY] [src/lib/components/3d/Canvas3D.svelte]
**Upgrade A: Look-Ahead Camera**
1.  Sample curve at `scrollState.progress` -> Set Camera Position.
2.  Sample curve at `scrollState.progress + 0.02` -> Set Camera LookAt.
**Warp Effect**: Increase FOV when `scrollState.velocity` > threshold.

#### [MODIFY] [src/lib/components/ui/Preloader.svelte]
**Upgrade C: Adaptive Asset Preloading**
1.  Use `THREE.LoadingManager` to track texture/model loads.
2.  Block interaction untills `isLoaded = true`.
3.  Transition out with a curtain-reveal effect.
