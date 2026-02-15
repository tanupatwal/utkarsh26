# Architecture Rules — MANDATORY

> **Every section MUST follow these patterns.** No exceptions. Do NOT copy architecture from `../hasfilm/` — only extract visual details (colors, sizes, animations) and rebuild using these patterns.

---

## Rule 1: Section Structure

Every section is a normal `<section>` in document flow. No `position: fixed`. No z-index.

```tsx
// ✅ CORRECT — every section follows this skeleton
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './MySection.module.css'

gsap.registerPlugin(ScrollTrigger)

export function MySection() {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        // All scroll animation logic goes here
        // GSAP context auto-cleans on unmount
    }, { scope: sectionRef })

    return (
        <section ref={sectionRef} id="my-section" className={styles.root}>
            {/* Content */}
        </section>
    )
}
```

```tsx
// ❌ WRONG — NEVER do this
import { useFrame, useScroll } from '@react-three/fiber'

export function MySection() {
    const scroll = useScroll()
    useFrame(() => {
        const r = scroll.offset
        const targetY = vh * (PAGES - 1) * r  // ← NEVER
        ref.style.transform = `translate3d(0, ${targetY}px, 0)`  // ← NEVER
        ref.style.position = 'fixed'  // ← NEVER
    })
}
```

---

## Rule 2: Scroll Animations — GSAP Only

Three patterns cover every section:

### Pattern A: Pin + Reveal (About, Schedule)
Section sticks during scroll, content animates in.

```tsx
useGSAP(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,           // Section sticks
            scrub: 1,            // Scroll-driven
            start: 'top top',
            end: '+=100%',       // Pin for 1 viewport of scrolling
        }
    })

    // Staggered reveals — replaces all manual easing math
    tl.from('.subtitle', { y: 20, opacity: 0, duration: 0.3 })
      .from('.title', { y: 30, opacity: 0, duration: 0.4 })
      .from('.stats', { y: 20, opacity: 0, stagger: 0.15 })
}, { scope: sectionRef })
```

### Pattern B: Pin + Scrub to Zustand (Tunnel, Gallery)
Section is a transparent trigger zone. GSAP writes progress to Zustand, 3D Canvas reads it.

```tsx
useGSAP(() => {
    ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: '+=300%',           // Long scrub zone
        onUpdate: (self) => {
            // Write to Zustand — Canvas reads this
            useScrollStore.getState().setTunnelProgress(self.progress)
        },
        onEnter: () => useScrollStore.getState().setCanvasVisible(true),
        onLeave: () => useScrollStore.getState().setCanvasVisible(false),
        onEnterBack: () => useScrollStore.getState().setCanvasVisible(true),
        onLeaveBack: () => useScrollStore.getState().setCanvasVisible(false),
    })
}, { scope: sectionRef })
```

### Pattern C: Pin + Snap (Team)
Section snaps between discrete items on scroll.

```tsx
useGSAP(() => {
    ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: `+=${itemCount * 80}`,
        snap: {
            snapTo: 1 / (itemCount - 1),  // Snap to each item
            duration: 0.3,
            ease: 'power2.inOut',
        },
        onUpdate: (self) => {
            const idx = Math.round(self.progress * (itemCount - 1))
            setActiveIndex(idx)
        },
    })
}, { scope: sectionRef })
```

---

## Rule 3: Styling — CSS Modules Only

All styles go in `.module.css` files. Extract visual values from old source.

```css
/* ✅ CORRECT — MySection.module.css */
.root {
    min-height: 100vh;
    background: var(--color-bg);
    padding: var(--section-padding) var(--gutter);
}

.title {
    font-family: var(--font-display);
    font-size: var(--fs-2xl);
    background: linear-gradient(135deg, #fff 0%, #F5C16C 50%, #FF8C42 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card {
    /* Port exact visual properties from old source */
    border: 1px solid rgba(245, 193, 108, 0.15);
    backdrop-filter: blur(12px);
    border-radius: var(--radius-lg);
}
```

```tsx
// ❌ WRONG — NEVER do this
const STYLES = `
    .schedule-card { border: 1px solid rgba(245, 193, 108, 0.15); }
    .schedule-modal { backdrop-filter: blur(12px); }
    /* ... 400 more lines ... */
`
return <><style>{STYLES}</style>...</>
```

---

## Rule 4: 3D Canvas — Single Fixed Layer

One `<Canvas>` behind everything. 3D components read progress from Zustand.

```tsx
// CanvasLayer.tsx — already created
// 3D scenes are children of this single Canvas
<Canvas>
    {canvasVisible && activeScene === 'tunnel' && <TunnelScene />}
    {canvasVisible && activeScene === 'gallery' && <GalleryScene />}
</Canvas>

// Inside a 3D scene component:
function TunnelScene() {
    const progress = useScrollStore((s) => s.tunnelProgress)

    useFrame(() => {
        // Use progress to drive camera/mesh animations
        camera.position.z = -progress * 100
    })

    return <mesh>...</mesh>
}
```

```tsx
// ❌ WRONG — NEVER do this
<Canvas>
    <ScrollControls pages={40}>  {/* ← NEVER */}
        <Scroll>
            <TunnelGroup />
        </Scroll>
        <Scroll html>  {/* ← NEVER */}
            <AboutSection />
        </Scroll>
    </ScrollControls>
</Canvas>
```

---

## Rule 5: State — Zustand Store

```tsx
// scrollStore.ts — extend as needed per phase
interface ScrollState {
    progress: number          // Global 0–1
    activeSection: string
    reducedMotion: boolean

    // Per-scene progress (added in relevant phases)
    tunnelProgress: number    // Phase 3
    galleryProgress: number   // Phase 5

    // Canvas visibility
    canvasVisible: boolean    // Phase 3

    // Actions
    setProgress: (p: number) => void
    setActiveSection: (s: string) => void
    setReducedMotion: (r: boolean) => void
    setTunnelProgress: (p: number) => void
    setGalleryProgress: (p: number) => void
    setCanvasVisible: (v: boolean) => void
}
```

---

## Rule 6: Accessibility — From Day One

```tsx
// Every section:
<section
    ref={sectionRef}
    id="about"                           // For skip links
    aria-labelledby="about-heading"      // Section announced by heading
>
    <h2 id="about-heading">About Utkarsh</h2>
    ...
</section>

// Reduced motion — check before animating:
const reducedMotion = useScrollStore((s) => s.reducedMotion)
useGSAP(() => {
    if (reducedMotion) {
        // Show content instantly, no animation
        gsap.set('.reveal-items', { opacity: 1, y: 0 })
        return
    }
    // Normal animation timeline
    ...
})
```

---

## Rule 7: How to Extract Visuals from Old Source

When building a section, follow this exact workflow:

1. **Open old source file** (e.g., `../hasfilm/src/components/sections/schedule/ScheduleSection.tsx`)
2. **Find the CSS** — look for `const STYLES = \`...\`` or inline `style={{ }}` blocks
3. **Extract every visual property**: colors, gradients, shadows, border-radius, blur, font-size, padding, gap, etc.
4. **Find the animation values** — look in `useFrame` for: easing formulas, duration calculations, stagger offsets, opacity ramps
5. **Convert easing math to GSAP equivalents**:
   - `1 - Math.pow(1 - t, 3)` → `ease: 'power3.out'`
   - `Math.pow(t, 2)` → `ease: 'power2.in'`
   - `t * t * (3 - 2 * t)` → `ease: 'power1.inOut'`
6. **Write CSS Module** with extracted visual properties
7. **Write GSAP timeline** with converted animation values
8. **Never copy useFrame/scroll/position logic** — only the visual output values

---

## Quick Reference: Easing Conversion

| Old Code (manual math) | GSAP Equivalent |
|------------------------|-----------------|
| `1 - Math.pow(1 - t, 3)` | `'power3.out'` |
| `Math.pow(t, 3)` | `'power3.in'` |
| `t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2` | `'power3.inOut'` |
| `1 - Math.pow(1 - t, 2)` | `'power2.out'` |
| `THREE.MathUtils.damp(current, target, lambda, delta)` | `scrub: 1` (GSAP lerps internally) |
| `Math.min(1, Math.max(0, (x - start) / (end - start)))` | ScrollTrigger `start`/`end` handles this |
