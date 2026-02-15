# Utkarsh V2 — Progress Tracker

> Check off items as they are completed. `[/]` = in progress, `[x]` = done.

---

## Phase 0 — Scaffold & Tooling
> Empty working app with all deps, config, and folder structure

- [x] Create Vite project (`react-ts` template)
- [x] Verify dev server starts on port 3001
- [x] Save planning docs into `docs/` directory
- [x] Install project deps (GSAP, Lenis, Zustand, R3F, Three, etc.)
- [x] Configure Vite (port 3001, `@` alias, React plugin)
- [x] Configure TypeScript (strict, JSX, path aliases)
- [x] Create folder structure (features/, shared/, canvas/, data/)
- [x] Setup `global.css` (reset, CSS custom properties, font imports)
- [x] Setup `tokens.css` (design tokens: colors, spacing, fonts)
- [x] Setup Zustand `scrollStore.ts`
- [x] Setup `CanvasLayer.tsx` (empty fixed Canvas)
- [x] Setup Lenis + GSAP ScrollTrigger integration in `App.tsx`
- [x] Verify: `npm run build` passes with zero errors
- [x] Copy ALL media assets from `../hasfilm/public/assets/` → `public/assets/`

---

## Phase 1 — Design System & Layout Shell
> Global styles, Navbar, section placeholders, progress bar

- [ ] Implement design tokens (colors: `#05070d`, `#F5C16C`, `#FF8C42`, `#00E5FF`, `#9EEAFF`)
- [ ] Build `Navbar.tsx` with CSS Module
- [ ] Build `ProgressBar.tsx` (scroll progress via Zustand)
- [ ] Create placeholder `<section>` for each feature
- [ ] Implement `useReducedMotion.ts` hook
- [ ] Build `SkipLink.tsx` (a11y)
- [ ] Connect: Lenis scroll → Zustand → ProgressBar
- [ ] Verify: all sections scrollable, progress bar works, skip link works

---

## Phase 2 — Hero Section
> Full hero with video bg, title, zoom-on-scroll

- [ ] Build `HeroSection.tsx` (semantic HTML)
- [ ] Build `HeroSection.module.css`
- [ ] Build `useHeroAnimation.ts` (GSAP pin + scrub zoom/fade)
- [ ] Implement `prefers-reduced-motion` fallback
- [ ] Verify: hero matches old site visuals, scroll zoom works

---

## Phase 3 — Tunnel 3D Scene
> Tunnel fly-through synced to scroll via Zustand

- [ ] Port tunnel geometry to `TunnelScene.tsx`
- [ ] GSAP ScrollTrigger scrub → Zustand progress
- [ ] Canvas visibility toggled for tunnel zone
- [ ] Verify: smooth fly-through, 60fps, canvas hidden outside zone

---

## Phase 4 — About Section
> Staggered reveals, pinned during scroll

- [ ] Build `AboutSection.tsx` + CSS Module
- [ ] Build `StatCard.tsx` reusable component
- [ ] Build `useAboutAnimation.ts` (GSAP pin + stagger)
- [ ] Port content from old `data/content.ts`
- [ ] Verify: pins, reveals forward+backward, reduced motion fallback

---

## Phase 5 — Gallery & Highlights
> 3D carousel + floating highlights with particle drain

- [ ] Port gallery 3D to `GalleryScene.tsx`
- [ ] Build `GallerySection.tsx` + `GalleryHUD.tsx`
- [ ] GSAP scrub → Zustand → gallery rotation
- [ ] Build `HighlightsSection.tsx` (image float + drain)
- [ ] Verify: carousel rotates, HUD works, highlights drain

---

## Phase 6 — Schedule & Team
> Event cards + snap-scroll team members

- [ ] Build `ScheduleSection.tsx` + sub-components
- [ ] Use native `<dialog>` for modal
- [ ] Build `TeamSection.tsx` with GSAP `snap`
- [ ] Port schedule + team data
- [ ] Verify: tabs, cards, modal (keyboard), team snap (no scroll hijack)

---

## Phase 7 — Polish, A11Y & Deploy
> Final polish, performance, accessibility audit

- [ ] Add Footer
- [ ] Lighthouse audit (target >90)
- [ ] Optimize hero video (compress, poster, WebM)
- [ ] Meta tags, OG, favicon
- [ ] Loading screen / Suspense boundaries
- [ ] Mobile testing
- [ ] Production build + deploy
