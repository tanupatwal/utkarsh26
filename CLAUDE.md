# Project Context — Utkarsh 2026

## What Is This?
Annual festival website for **Dr. Akhilesh Das Gupta Institute of Professional Studies (ADGIPS)**.
Theme: **"Virasat se VIKAS"** (Heritage to Evolution).

## The Situation
- **`hasfilm/`** (at `../hasfilm/`) is the existing, already-built website — the **visual reference**. It looks exactly how the final product should look.
- **But `hasfilm/` is architecturally wrong** — React-based, had scroll transition issues, section bleeding, and performance problems.
- **`utkarsh26/`** (this project) is the **clean rebuild from scratch** following `spec.md`.
- **Goal:** Visually identical to `hasfilm/`, architecturally superior per `spec.md`.
- **Approach:** Follow the spec independently (don't port code from `hasfilm/`), but reference `hasfilm/` for visual accuracy and content.

## Tech Stack
Svelte 5 + SvelteKit 2 + Threlte 8 + GSAP + Lenis + Tailwind CSS v4 + Bun + Vite 7

## Architecture
- "Single World" pattern — camera travels a spline, DOM overlays on top, WebGL canvas behind.
- Two separate canvases (Tunnel vs Gallery) to avoid GPU crashes on mid-range hardware.
- Real HTML height (~850vh), not virtual scroll.

## Sections (Scroll Journey)
1. Hero (100vh) — title scramble, fade on scroll
2. Warp/Tunnel (100vh) — camera through tube geometry with video texture
3. About (100vh) — stats counters, tunnel fades out
4. Gallery (200vh) — 5 curved 3D panels in cylinder, dissolve shader exit
5. Event Highlights (150vh) — bento grid, 3-layer mouse parallax
6. Schedule (200vh) — 3-day tabs, 60 events, modals
7. Team (100vh) — 24 members grid, hover effects
8. Footer (50vh) — links, socials, credits

## Progress
- ✅ Phase 0–2 complete (foundation, core 3D, HTML skeleton)
- 🔨 Phase 3–4 in progress (tunnel upgrade, gallery)
- 📝 Phase 5 pending (wire real content)
- 🎨 Phase 6–7 future (polish, QA, launch)

## Performance Targets
- 60 FPS non-negotiable
- Lighthouse >85
- Total page weight <10MB
