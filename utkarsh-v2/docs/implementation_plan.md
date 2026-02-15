# Utkarsh 2026 — Professional Rebuild Plan

## Goal

Rebuild the Utkarsh 2026 scrollytelling website from scratch with a proper architecture:
- **Lenis** smooth scroll + **GSAP ScrollTrigger** for section pinning/scrubbing
- **Zustand** for global state (scroll progress, active section, reduced motion)
- **React Three Fiber** Canvas as a single fixed background layer
- **CSS Modules** (no template literals, no CDN Tailwind)
- **Feature-based folder structure** with colocated components/hooks/styles/data
- **WCAG AA accessibility** baked in from Phase 1

> [!IMPORTANT]
> The new project will be created in a **separate directory** (`/Users/adityapaswan/soup/projects/utkarsh26/utkarsh-v2/`) alongside the existing `hasfilm/`. Assets from `hasfilm/public/assets/` will be symlinked or copied.

---

## User Review Required

1. **New directory vs in-place rewrite** — Plan creates a fresh Vite project in `utkarsh-v2/`. The old `hasfilm/` is untouched. Is this acceptable?
2. **Phase-by-phase delivery** — Each phase produces a working, testable increment. We won't move on until each phase is verified. Sound good?
3. **Dropping drei ScrollControls entirely** — The new architecture uses Lenis + GSAP instead. The 3D Canvas reads scroll progress from Zustand, not from drei's `useScroll`. This is a fundamental change.

---

## Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 19 + TypeScript (strict) | Same as current |
| Build | Vite 6.2 | Same as current |
| Smooth scroll | **Lenis** | Buttery-smooth, real document scroll |
| Scroll animations | **GSAP** + **ScrollTrigger** + **`@gsap/react`** (`useGSAP`) | Pin, scrub, snap. Auto-cleanup in React |
| 3D | **@react-three/fiber** + **@react-three/drei** (without `ScrollControls`) | Same renderer, different scroll input |
| State | **Zustand** | Lightweight, no providers, R3F-friendly |
| Styling | **CSS Modules** (`.module.css`) | Scoped, cacheable, zero runtime |
| Fonts | Google Fonts — Orbitron, Inter | Loaded via `<link>` in index.html |
| A11Y | Semantic HTML, ARIA, `prefers-reduced-motion`, skip links | From Phase 1 |

---

## Folder Structure

```
utkarsh-v2/
├── public/
│   └── assets/         ← copied from hasfilm
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── App.module.css
│   │   └── main.tsx
│   ├── features/
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSection.module.css
│   │   │   └── useHeroAnimation.ts
│   │   ├── tunnel/
│   │   │   ├── TunnelScene.tsx        (R3F component)
│   │   │   ├── TunnelScene.module.css
│   │   │   └── useTunnelAnimation.ts
│   │   ├── about/
│   │   │   ├── AboutSection.tsx
│   │   │   ├── AboutSection.module.css
│   │   │   ├── StatCard.tsx
│   │   │   └── useAboutAnimation.ts
│   │   ├── gallery/
│   │   │   ├── GallerySection.tsx      (trigger zone)
│   │   │   ├── GalleryScene.tsx        (R3F component)
│   │   │   ├── GalleryHUD.tsx
│   │   │   ├── GalleryHUD.module.css
│   │   │   └── useGalleryAnimation.ts
│   │   ├── highlights/
│   │   │   ├── HighlightsSection.tsx
│   │   │   ├── HighlightsSection.module.css
│   │   │   └── useHighlightsAnimation.ts
│   │   ├── schedule/
│   │   │   ├── ScheduleSection.tsx
│   │   │   ├── ScheduleSection.module.css
│   │   │   ├── DayTabs.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventModal.tsx
│   │   │   └── useScheduleAnimation.ts
│   │   └── team/
│   │       ├── TeamSection.tsx
│   │       ├── TeamSection.module.css
│   │       ├── MemberCard.tsx
│   │       └── useTeamAnimation.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Navbar.module.css
│   │   │   ├── Footer.tsx
│   │   │   ├── SkipLink.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── ReducedMotionToggle.tsx
│   │   ├── hooks/
│   │   │   ├── useReducedMotion.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── stores/
│   │   │   └── scrollStore.ts          (Zustand)
│   │   └── styles/
│   │       ├── global.css              (CSS custom properties, resets)
│   │       └── tokens.css              (design tokens: colors, spacing, fonts)
│   ├── canvas/
│   │   ├── CanvasLayer.tsx             (single fixed <Canvas>)
│   │   └── CanvasLayer.module.css
│   └── data/
│       ├── team.ts
│       ├── schedule.ts
│       ├── highlights.ts
│       ├── gallery.ts
│       └── content.ts
└── index.html
```

---

## Phases

### Phase 0 — Scaffold & Tooling
> **Goal**: Empty working app with all dependencies, config, and folder structure

**Steps:**
1. `npm create vite@latest utkarsh-v2 -- --template react-ts`
2. Install deps: `gsap @gsap/react lenis zustand @react-three/fiber @react-three/drei three @react-three/postprocessing`
3. Configure Vite: port 3001, `@` alias, env loading
4. Configure TypeScript: match current strict settings
5. Create folder structure (empty files for each feature)
6. Setup `global.css` with CSS custom properties (reset, colors, fonts)
7. Setup `tokens.css` with design tokens
8. Setup Zustand `scrollStore.ts` (scroll progress, active section, reduced motion)
9. Setup `CanvasLayer.tsx` — empty fixed Canvas
10. Setup Lenis + GSAP ScrollTrigger integration in `App.tsx`
11. Create `SkipLink.tsx` and basic `Navbar.tsx`

**Verification:** `npm run dev` starts on port 3001, no errors, empty page with Lenis smooth scroll working

---

### Phase 1 — Design System & Layout Shell
> **Goal**: Global styles, Navbar, section placeholders, progress bar, all scrollable

**Steps:**
1. Implement design tokens (colors from existing site: `#05070d`, `#F5C16C`, `#FF8C42`, `#00E5FF`, `#9EEAFF`)
2. Build `Navbar.tsx` with CSS Module (matching existing design)
3. Build `ProgressBar.tsx` — horizontal bar at top showing scroll progress via Zustand
4. Create placeholder `<section>` for each feature (Hero, Tunnel, About, Gallery, Highlights, Schedule, Team)
5. Each placeholder: has correct `min-height`, ID for skip-link, proper semantic HTML
6. Implement `useReducedMotion.ts` hook
7. Connect Lenis scroll → Zustand store → ProgressBar

**Verification:**
- All 7 sections visible in document flow, scrollable
- Progress bar updates as you scroll
- Skip link (Tab → Enter) jumps to content
- `prefers-reduced-motion` toggle works

---

### Phase 2 — Hero Section
> **Goal**: Full hero section with video background, title, zoom-on-scroll

**Steps:**
1. Copy hero video and assets
2. Build `HeroSection.tsx` with semantic HTML (`<section>`, `<h1>`, `<h2>`)
3. Build `HeroSection.module.css` with CSS-based styling
4. Build `useHeroAnimation.ts` — GSAP ScrollTrigger `pin: true`, scrub for zoom + fade
5. Implement `prefers-reduced-motion` fallback (static hero, no zoom)
6. Wire up `CanvasLayer` — show empty canvas behind Hero (prep for tunnel)

**Verification:**
- Hero fills viewport with video bg, title, subtitle
- Scrolling zooms in and fades out the hero
- Reduced motion: no zoom, clean fade
- Keyboard accessible (tab to CTA if any)

---

### Phase 3 — Tunnel 3D Scene
> **Goal**: Tunnel fly-through synced to scroll, reading progress from Zustand

**Steps:**
1. Port `TunnelGroup.tsx` 3D geometry to `TunnelScene.tsx`
2. Tunnel reads progress from `useScrollStore()` instead of `useScroll()`
3. Add GSAP ScrollTrigger for the Tunnel `<section>` zone — scrub writes progress to Zustand
4. Canvas becomes visible during Tunnel zone, hidden before/after
5. Camera Z-position driven by Zustand progress

**Verification:**
- Scrolling through Tunnel zone moves camera through the tunnel
- Tunnel is smooth with Lenis
- Before/after Tunnel, Canvas is not visible
- Performance: stable 60fps

---

### Phase 4 — About Section
> **Goal**: About section with staggered reveals, pinned during scroll

**Steps:**
1. Build `AboutSection.tsx` with semantic HTML + CSS Module
2. Build `StatCard.tsx` reusable component
3. Build `useAboutAnimation.ts` — GSAP `pin: true`, staggered `from()` reveals
4. Port content from existing data files

**Verification:**
- About section pins on arrival
- Stats + text stagger-reveal on scroll
- Works forward AND backward (GSAP handles reverse)
- Reduced motion: instant reveals, no stagger

---

### Phase 5 — Gallery & Highlights
> **Goal**: 3D gallery carousel + floating highlights with particle drain

**Steps:**
1. Port `GalleryGroup.tsx` 3D geometry to `GalleryScene.tsx`
2. Build `GallerySection.tsx` (transparent trigger zone) + `GalleryHUD.tsx`
3. GSAP scrub drives gallery rotation via Zustand
4. Build `HighlightsSection.tsx` with image float + drain animation
5. Port highlight image URLs from existing data

**Verification:**
- Gallery carousel rotates on scroll
- HUD overlay shows title + index
- Highlights section shows floating images
- Transition between Gallery → Highlights is smooth

---

### Phase 6 — Schedule & Team
> **Goal**: Schedule section with event cards + Team section with snap-scroll members

**Steps:**
1. Build `ScheduleSection.tsx` with day tabs, card grid, modal
2. Build `DayTabs.tsx`, `EventCard.tsx`, `EventModal.tsx` as separate components
3. Use `<dialog>` for modal (native, accessible, no portal needed)
4. Build `TeamSection.tsx` with GSAP `snap` (replaces scroll trap)
5. Build `MemberCard.tsx` with hover states
6. Port all schedule and team data

**Verification:**
- Schedule pins on arrival, tabs switch days, cards clickable
- Modal opens/closes, keyboard navigable (Esc to close, focus trap)
- Team section snaps between members on scroll
- No scroll hijacking — GSAP snap handles it naturally
- Screen reader announces section changes via `aria-live`

---

### Phase 7 — Polish, A11Y & Deploy
> **Goal**: Final polish, performance, accessibility audit, production build

**Steps:**
1. Add footer section
2. Add page-level keyboard shortcuts (Escape returns to top)
3. Run Lighthouse audit — target >90 for Performance, Accessibility, SEO
4. Optimize hero video (compress, add `poster`, add WebM format)
5. Add `<meta>` tags, Open Graph, favicon
6. Add loading screen / Suspense boundaries for 3D assets
7. Test on mobile (touch scrolling with Lenis)
8. Production build + deploy

**Verification:**
- Lighthouse scores >90 across all categories
- All sections navigable via keyboard
- `prefers-reduced-motion` respected globally
- Production build succeeds with no warnings
- Mobile: smooth scroll, no layout breaks

---

## Verification Plan

### Automated
- `npm run build` — TypeScript compilation, no errors
- Lighthouse CI (run in browser DevTools after each phase)

### Manual (per phase)
After each phase:
1. **Visual check**: Open `http://localhost:3001`, scroll through new section
2. **Forward + Backward scroll**: Verify transitions work both ways
3. **Keyboard**: Tab through interactive elements, check focus visible
4. **Reduced motion**: Enable in System Preferences → Accessibility → Display, verify no animations
5. **Mobile**: Resize to 375px width, check layout
6. **Console**: Zero errors, zero warnings

### User Testing
- After Phase 2 (Hero): first visual checkpoint — does it match the existing look?
- After Phase 6 (all sections): full scroll-through comparison with old site
- After Phase 7: production deployment readiness review
