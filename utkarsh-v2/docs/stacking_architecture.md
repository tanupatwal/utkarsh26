# Section Stacking & Scroll Architecture — Current vs Ideal

> Deep analysis of how sections are composited in the viewport, how scroll drives their lifecycle, and the concrete anti-patterns that make the current approach fragile.

---

## Current Stack: The "Fixed Overlay" Pattern

Everything is `position: fixed` and manually fights against scroll. The `<Scroll html>` parent from drei continuously moves its children downward as the user scrolls, but every child section immediately undoes that movement.

```
┌─────────────────── BROWSER VIEWPORT ───────────────────┐
│                                                         │
│  z:50  ┌─ Navbar ──────────────────────────┐  fixed     │
│        │  Always visible on top            │            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:26  ┌─ TeamSection (portal→body) ───────┐  fixed     │
│        │  opacity via useFrame             │            │
│        │  transform: translate3d(targetY)  │            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:25  ┌─ ScheduleSection (portal→body) ───┐  fixed     │
│        │  opacity via useFrame             │            │
│        │  transform: translate3d(targetY)  │            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:20  ┌─ HighlightsSection ───────────────┐  fixed     │
│        │  Inside <Scroll html>, but acts   │            │
│        │  like fixed (undoes parent scroll)│            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:15  ┌─ AboutSection ────────────────────┐  fixed     │
│        │  Inside <Scroll html>, but acts   │            │
│        │  like fixed (undoes parent scroll)│            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:10  ┌─ CANVAS ──────────────────────────┐  absolute  │
│        │  ┌ ScrollControls (40 pages) ───┐ │            │
│        │  │  3D: TunnelGroup             │ │            │
│        │  │  3D: FlatAboutSection         │ │            │
│        │  │  3D: GalleryGroup            │ │            │
│        │  │                              │ │            │
│        │  │  <Scroll html>               │ │            │
│        │  │    AboutSection      (fixed) │ │            │
│        │  │    GalleryOverlay  (absolute)│ │            │
│        │  │    HighlightsSection  (fixed)│ │            │
│        │  │    ScheduleSection   (fixed) │ │            │
│        │  │    TeamSection       (fixed) │ │            │
│        │  └──────────────────────────────┘ │            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:0   ┌─ HeroSection ────────────────────┐  fixed     │
│        │  Always behind, zooms on scroll  │            │
│        │  Polls DOM for scroll container  │            │
│        └───────────────────────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### The Core Anti-Pattern: Scroll Compensation

Every HTML section inside `<Scroll html>` runs **the exact same boilerplate** in its `useFrame`:

```typescript
// This line appears in EVERY section — About, Highlights, Schedule, Team
useFrame((_state, delta) => {
    const r = scroll.offset;                           // 0.0 → 1.0
    const vh = window.innerHeight;
    const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;  // undo parent scroll
    innerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
    // ...then 50-150 lines of opacity/animation logic
});
```

**What's happening**: `<Scroll html>` from drei moves ALL its children by `-scroll.offset * totalHeight`. Each child then adds back `+scroll.offset * totalHeight` via inline `transform`, exactly cancelling the parent's displacement. The net effect: every section stays fixed in the viewport.

**This means `<Scroll html>` is doing nothing useful** — it displaces all children, then every child immediately undoes it.

---

## Per-Section Breakdown: How Each One Fights the Framework

### Hero Section ([HeroSection.tsx](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/components/overlays/HeroSection.tsx))

| Property | Value |
|----------|-------|
| Position | `position: fixed; z-index: 0/15/20` (3 layers) |
| Inside ScrollControls? | ❌ Outside Canvas entirely |
| Scroll access | **Polls DOM** via `setInterval(100ms)` |

**The hack:**
```typescript
// HeroSection.tsx — polls for drei's scroll container
const findScrollContainer = (): HTMLElement | null => {
    const candidates = document.querySelectorAll('div[style]');
    for (const el of candidates) {
        const style = (el as HTMLElement).style;
        if (style.overflow === 'auto' || style.overflowY === 'auto') ...
    }
};
setInterval(() => { scrollContainer = findScrollContainer(); }, 100);
```

> [!CAUTION]
> This DOM-polling approach will break if drei changes its internal element styles (which it has done between versions). It runs every 100ms even when the Hero is invisible.

---

### About Section ([AboutSection.tsx](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/components/sections/about/AboutSection.tsx))

| Property | Value |
|----------|-------|
| Position | `position: fixed; inset: 0; z-index: 15` |
| Inside ScrollControls? | ✅ Inside `<Scroll html>` |
| Lines in useFrame | ~100 lines |

**The compensation (line 64-67):**
```typescript
const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;
innerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
```

**Then 90 more lines of**:
- Fade in/out math (lines 70-86)
- Sub-progress calculation (lines 91-92)
- 5 staggered reveal calculations, each repeating `Math.min(1, Math.max(0, ...))` + `1 - Math.pow(1 - t, 3)` (lines 96-137)
- Exit slide (lines 151-156)
- Ambient glow per-frame update (lines 140-148)

---

### Highlights Section ([HighlightsSection.tsx](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/components/sections/gallery/HighlightsSection.tsx))

| Property | Value |
|----------|-------|
| Position | `position: fixed; top: 0; left: 0; z-index: 20` |
| Inside ScrollControls? | ✅ Inside `<Scroll html>` |
| Total lines | **873** |
| Lines in useFrame | ~300 lines |

**The compensation (line 363-365):**
```typescript
const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;
containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
```

**Then 280 more lines of** backdrop fade, title fade (scroll + time fallback), gallery fade, 35-image particle system update, gravity drain physics, per-layer delay calculations, motion blur — all inline in one `useFrame` callback.

---

### Schedule Section ([ScheduleSection.tsx](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/components/sections/schedule/ScheduleSection.tsx))

| Property | Value |
|----------|-------|
| Position | `position: fixed; top: 0; left: 0; z-index: 25` |
| Inside ScrollControls? | ✅ Inside `<Scroll html>`, but also `createPortal(→ body)` |
| Total lines | **997** |
| CSS template literal | **448 lines** of CSS-in-JS string |

**The compensation (line 511-531):**
```typescript
const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;
containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
containerRef.current.style.opacity = String(opacityRef.current.toFixed(3));
```

**Double rendering context**: The main section is inside `<Scroll html>`, but the modal uses `createPortal(→ document.body)` — which must re-inject the entire `STYLES` template literal a second time:
```typescript
{createPortal(
    <div className={`${CLS}-modal-backdrop ...`}>
        <style>{STYLES}</style>  {/* ← 448 lines injected AGAIN */}
```

---

### Team Section ([TeamSection.tsx](file:///Users/adityapaswan/soup/projects/utkarsh26/hasfilm/src/components/sections/team/TeamSection.tsx))

| Property | Value |
|----------|-------|
| Position | `position: fixed; inset: 0; z-index: 26` |
| Inside ScrollControls? | ✅ Inside `<Scroll html>` |
| Total lines | **883** |
| CSS template literal | **336 lines** |
| State machine | 6 states: INACTIVE → ENTERING → BROWSING → EXITING → REWINDING → RELEASED |

**The compensation (line 608-638):**
```typescript
const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;
containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
```

**Scroll hijacking** — pins `scrollTop` while trapping (line 716-722):
```typescript
if (isTrapping && scroll.el) {
    const scrollContainer = scroll.el as HTMLElement;
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    scrollContainer.scrollTop = pinOffset * scrollHeight;  // Force scroll position
}
```

And captures wheel events globally to prevent `ScrollControls` from receiving them:
```typescript
window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
```

---

## Summary of Problems

| Problem | Impact | Sections Affected |
|---------|--------|-------------------|
| **All fixed, all stacked** | 6+ fixed overlays composited simultaneously, even when invisible | All |
| **Identical scroll compensation** | Every section repeats `translate3d(0, vh*(PAGES-1)*r, 0)` — fragile, coupled to `PAGES: 40` | About, Highlights, Schedule, Team |
| **`<Scroll html>` paradox** | Children undo the scroll that their parent applies → `<Scroll html>` is effectively a no-op | All sections inside it |
| **z-index juggling** | Slots: 0, 10, 15, 20, 25, 26, 50 — any new section needs a new slot | All |
| **No document flow** | Browser can't calculate layout, accessibility tree, or section heights | All |
| **`PAGES: 40` magic number** | Change it and every section's `targetY` formula breaks | All |
| **DOM polling** | Hero polls DOM every 100ms to find scroll container | Hero |
| **Portal double-injection** | Schedule and Team portal to body + re-inject 400+ lines of CSS | Schedule, Team |
| **Wheel event hijack** | Team captures all wheel events globally in capture phase | Team |
| **`scrollTop` pinning** | Team forcibly sets `scrollTop` every frame while trapping | Team |

---

## Ideal Stack: Normal Document Flow + GSAP Pinning

Sections exist in **normal page flow** with real heights. GSAP `ScrollTrigger` with `pin: true` makes them sticky when needed. The 3D Canvas is a single fixed layer behind everything, only active during the 3D zones.

```
┌─────────────────── BROWSER VIEWPORT ───────────────────┐
│                                                         │
│  z:50  ┌─ Navbar ──────────────────────────┐  fixed     │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:10  ┌─ Canvas (3D scenes) ─────────────┐  fixed     │
│        │  Visible during Tunnel + Gallery  │            │
│        │  Reads progress from Zustand      │            │
│        └───────────────────────────────────┘            │
│                                                         │
│  z:1   ┌─ SCROLLABLE DOCUMENT ─────────────┐  flow     │
│        │                                    │           │
│        │  <section> Hero        (100vh)     │  pin:true │
│        │    video bg + title                │           │
│        │                                    │           │
│        │  <section> Tunnel Zone (300vh)     │  scrub    │
│        │    transparent, shows Canvas       │           │
│        │    GSAP scrub drives camera z      │           │
│        │                                    │           │
│        │  <section> About       (100vh)     │  pin:true │
│        │    stats + text reveals            │           │
│        │                                    │           │
│        │  <section> Gallery     (300vh)     │  scrub    │
│        │    transparent, shows Canvas       │           │
│        │    GSAP scrub rotates gallery      │           │
│        │    HUD overlay on top              │           │
│        │                                    │           │
│        │  <section> Highlights  (200vh)     │  scrub    │
│        │    floating images + drain         │           │
│        │                                    │           │
│        │  <section> Schedule    (100vh)     │  pin:true │
│        │    day tabs + cards + modal        │           │
│        │                                    │           │
│        │  <section> Team        (150vh)     │  pin+scrub│
│        │    names + photos (snapped scroll) │           │
│        │                                    │           │
│        └────────────────────────────────────┘           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### How Pinning Replaces All Manual Scroll Code

```typescript
// One call replaces 100+ lines of useFrame scroll math per section
ScrollTrigger.create({
    trigger: '.about-section',
    start: 'top top',
    end: '+=100%',      // pin for 1vh of scrolling
    pin: true,           // makes it sticky — no manual position:fixed needed
    scrub: 1,            // smooth 1:1 scroll-to-animation mapping
    onUpdate: (self) => {
        // self.progress → 0..1 within this section
        // Feed into animations or Zustand store
    }
});
```

---

## Side-by-Side: Per-Section Comparison

### About Section

````carousel
```typescript
// ═══ CURRENT: AboutSection.tsx — 433 lines ═══

// Inside <Scroll html>, position: fixed, z-index: 15
useFrame((_state, delta) => {
    const r = scroll.offset;
    const vh = window.innerHeight;
    // Undo parent scroll displacement (line 64-67)
    const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;
    innerRef.current.style.transform =
        `translate3d(0, ${targetY}px, 0)`;

    // Manual fade-in: ABOUT_START → ABOUT_START+0.03
    let targetOpacity = 0;
    if (r >= TIMELINE.ABOUT_START && r <= TIMELINE.TRANSITION + 0.02) {
        const fadeInEnd = TIMELINE.ABOUT_START + 0.03;
        if (r < fadeInEnd) {
            targetOpacity = (r - TIMELINE.ABOUT_START) /
                            (fadeInEnd - TIMELINE.ABOUT_START);
        } else if (r <= TIMELINE.ABOUT_STAY) {
            targetOpacity = 1;
        } else {
            const fadeOutT = (r - TIMELINE.ABOUT_STAY) /
                             (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
            targetOpacity = Math.max(0, 1 - fadeOutT * 1.5);
        }
    }
    opacityRef.current = THREE.MathUtils.damp(
        opacityRef.current, targetOpacity, 6, delta
    );

    // Then 60 more lines for staggered reveals...
    // Each one: Math.min(1, Math.max(0, (sub - start) / (end - start)))
    //           1 - Math.pow(1 - t, 3)
    //           ref.style.opacity = ...
    //           ref.style.transform = translateY(...)
});

// position: fixed; inset: 0; z-index: 15
// Manual willChange on every element
// Inline <style> tag for bounce animation
```
<!-- slide -->
```typescript
// ═══ IDEAL: AboutSection.tsx — ~80 lines ═══

// Normal <section> in document flow
// No position: fixed, no z-index, no scroll compensation

// useAboutAnimation.ts
useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                start: 'top top',
                end: '+=100%',
            }
        });

        tl.from('.subtitle', { y: 20, opacity: 0, duration: 0.3 })
          .from('.title', { y: 30, opacity: 0, duration: 0.4 })
          .from('.paragraph', {
              y: 25, opacity: 0,
              stagger: 0.15, duration: 0.3
          })
          .from('.stats', { y: 20, opacity: 0, duration: 0.3 });

        return () => ctx.revert();
    });
}, []);

// No manual easing math
// No manual willChange management
// No translate3d compensation
// No PAGES dependency
// No useFrame at all
```
````

---

### Schedule Section

````carousel
```typescript
// ═══ CURRENT: ScheduleSection.tsx — 997 lines ═══

// 448 lines of CSS template literal
const STYLES = `
.${CLS}-card { ... 80 properties ... }
.${CLS}-modal-backdrop { ... }
.${CLS}-modal-content { ... }
// ... 400 more lines
`;

// useFrame scroll compensation
useFrame((_state, delta) => {
    const r = scroll.offset;
    const vh = window.innerHeight;
    const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

    let revealT = 0;
    if (r >= SCHEDULE_FADE_START && r < SCHEDULE_FADE_FULL) { ... }
    else if (r >= SCHEDULE_FADE_FULL && r < ...) { ... }
    else if (r >= ...) { ... }

    containerRef.current.style.transform =
        `translate3d(0, ${targetY}px, 0)`;
    containerRef.current.style.opacity = ...;
});

// Modal portaled to body, re-injects all 448 lines of CSS
{createPortal(
    <div>
        <style>{STYLES}</style>
        ...modal content...
    </div>,
    document.body
)}
```
<!-- slide -->
```typescript
// ═══ IDEAL: ScheduleSection.tsx — ~200 lines ═══

// ScheduleSection.module.css — scoped, cacheable
import styles from './ScheduleSection.module.css'

// No position: fixed, no scroll compensation
useLayoutEffect(() => {
    ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: '+=100%',
    });
}, []);

// Component is just composition
return (
    <section ref={sectionRef} className={styles.root}>
        <DayTabs activeDay={activeDay} onChange={setActiveDay} />
        <EventGrid events={dayEvents} onSelect={setSelected} />
        {selected && (
            <EventModal
                event={selected}
                onClose={() => setSelected(null)}
                onNav={navigateEvent}
            />
        )}
    </section>
);

// No createPortal
// No CSS re-injection
// No PAGES dependency
// No useFrame
// Modal uses <dialog> element (native, accessible)
```
````

---

### Team Section

````carousel
```typescript
// ═══ CURRENT: TeamSection.tsx — 883 lines ═══

// 336 lines of CSS template literal
// 6-state scroll trap state machine
// Global wheel event capture + preventDefault
// scrollTop pinning every frame

useFrame((_state, delta) => {
    // Scroll compensation
    const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;
    containerRef.current.style.transform =
        `translate3d(0, ${targetY}px, 0)`;

    // Pin scrollTop while trapping
    if (isTrapping && scroll.el) {
        scrollContainer.scrollTop = pinOffset * scrollHeight;
    }

    // REWINDING: animate backward through all names
    if (trapStateRef.current === 'REWINDING') {
        rewindAccumRef.current += delta * 72;
        // ... force index backward ...
        if (newIdx <= 0) {
            scrollContainer.scrollTop = 0.955 * scrollHeight;
        }
    }
});

// Wheel capture
window.addEventListener('wheel', handleWheel, {
    passive: false, capture: true
});
```
<!-- slide -->
```typescript
// ═══ IDEAL: TeamSection.tsx — ~350 lines ═══

import styles from './TeamSection.module.css'

// GSAP scrollTrigger snap does the "trapping" natively
useLayoutEffect(() => {
    const nameCount = TEAM_MEMBERS.length;

    ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: `+=${nameCount * 80}`,  // 80px scroll per name
        snap: {
            snapTo: 1 / (nameCount - 1),
            duration: 0.3,
            ease: 'power2.inOut',
        },
        onUpdate: (self) => {
            const idx = Math.round(self.progress * (nameCount - 1));
            setActiveIndex(idx);
        },
    });
}, []);

// No wheel event capture
// No state machine
// No scrollTop pinning
// No PAGES dependency
// Snap provides the "dwell" feel naturally
```
````

---

### Hero Section

````carousel
```typescript
// ═══ CURRENT: HeroSection.tsx — 286 lines ═══

// Outside Canvas entirely
// Polls DOM every 100ms to find scroll container

const findScrollContainer = (): HTMLElement | null => {
    const candidates = document.querySelectorAll('div[style]');
    for (const el of candidates) {
        if (style.overflow === 'auto') return el;
    }
    return null;
};

setInterval(() => {
    scrollContainer = findScrollContainer();
}, 100);

// RAF loop reads scrollTop from found container
const tick = () => {
    if (scrollContainer) {
        const scrollRatio = scrollContainer.scrollTop /
            (scrollContainer.scrollHeight - scrollContainer.clientHeight);
        // ... apply zoom + fade
    }
    rafId = requestAnimationFrame(tick);
};
```
<!-- slide -->
```typescript
// ═══ IDEAL: HeroSection.tsx — ~60 lines ═══

// Normal <section> at the top of document flow

useLayoutEffect(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: true,
        }
    });

    tl.to(containerRef.current, {
        scale: 1.3,
        opacity: 0,
        ease: 'power2.in',
    });
}, []);

// No DOM polling
// No setInterval
// No raf loop
// No scroll container search
```
````

---

## Per-Section Change Summary

| Section | Current | Ideal | Key Difference |
|---------|---------|-------|----------------|
| **Hero** | `fixed; z:0`, polls DOM for scroll container via `setInterval(100ms)`, custom RAF loop | `<section>` in flow, GSAP `pin: true`, `scrub` drives zoom/fade | Eliminates DOM polling hack |
| **Tunnel** | 3D inside `ScrollControls`, `useFrame` reads `scroll.offset` | Fixed Canvas, `useFrame` reads Zustand progress (set by GSAP `onUpdate`) | Canvas decoupled from `<Scroll html>` |
| **About** | Fixed inside `<Scroll html>`, manual `translate3d` compensation, 433 lines | `<section>` in flow, GSAP `pin` + `.from()` stagger, ~80 lines | 5× smaller, no easing math |
| **Gallery 3D** | Inside `ScrollControls`, rotation tied to `scroll.offset` | Fixed Canvas, reads Zustand progress | Same animation, different input |
| **Gallery HUD** | `absolute` inside `<Scroll html>`, manages exit sub-phases | HTML overlaying Canvas during gallery zone, GSAP timeline for transitions | No `<Scroll html>` dependency |
| **Highlights** | Fixed, 873 lines, particle spawning + gravity in `useFrame` | Same particle logic but reads Zustand progress, no scroll compensation | Only the scroll plumbing changes |
| **Schedule** | Fixed, portaled, 997 lines with CSS template literal | `<section>` in flow, GSAP pin, CSS Module, ~350 lines | No portal, no CSS re-injection |
| **Team** | `createPortal`, `z:26`, 6-state scroll trap via wheel capture | `<section>` in flow, GSAP `pin` + `snap`, ~350 lines | No wheel hijacking, no state machine |

---

## The Key Insight

```
CURRENT:  ScrollControls creates a fake 40-page scroll container.
          Every section is position:fixed and manually undoes the scroll.
          → You're fighting the framework.

IDEAL:    Lenis creates real smooth scroll on the actual document.
          Sections are in normal flow with real heights.
          GSAP pins them when they need to be sticky.
          Canvas reads scroll progress from Zustand, not from drei.
          → You're working WITH the browser.
```

The 3D Canvas becomes **one fixed layer** that only activates during Tunnel + Gallery zones. Everything else is just HTML `<section>` elements in normal document flow — simpler, more performant, more accessible, and dramatically fewer lines of code.

---

## Technology Stack for Ideal Architecture

| Layer | Current | Ideal |
|-------|---------|-------|
| Scroll engine | drei `ScrollControls` + fake pages | **Lenis** smooth scroll on real document |
| Animation orchestration | Raw `useFrame` + manual math | **GSAP** `ScrollTrigger` with `pin` / `scrub` / `snap` |
| 3D scene scroll | `useScroll()` inside Canvas | **Zustand** store (GSAP `onUpdate` writes, `useFrame` reads) |
| Section visibility | Manual opacity in every section | GSAP `ScrollTrigger` callbacks |
| CSS | Template literal injection + CDN Tailwind | **CSS Modules** (build-time scoped) |
| State | None | **Zustand** (scroll progress, active section, reduced motion) |
| Scroll trapping | Global wheel capture + `scrollTop` pin | GSAP `snap` (native, accessible) |

```mermaid
graph TB
    subgraph "Ideal Data Flow"
        L["Lenis (smooth scroll)"] -->|scroll event| ST["GSAP ScrollTrigger"]
        ST -->|pin / scrub / snap| HTML["HTML Sections"]
        ST -->|onUpdate: progress| Z["Zustand Store"]
        Z -->|useStore()| C["Canvas useFrame"]
        C -->|reads progress| M["3D Meshes"]
    end
```

> [!TIP]
> The migration can be incremental. Start by adding Lenis + GSAP ScrollTrigger for **one section** (About is simplest) while keeping the rest on the current system. Once proven, migrate section by section.
