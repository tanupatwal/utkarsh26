---
name: creative-frontend-svelte
description: Architect and implement high-performance, immersive 3D web experiences using Svelte 5 Runes, Three.js, and GSAP. Focuses on Awwwards-tier quality, scroll-driven animation, and hybrid DOM/WebGL architecture.
version: 2.1.0
license: MIT
---

# Creative Frontend Skill — Immersive Svelte 5 Development
**Skill Location**: `{project_path}/.agent/skills/creative-frontend/`

This skill guides the creation of "Awwwards-caliber" websites where 3D rendering (Three.js) and DOM elements (Svelte) coexist seamlessly. It enforces a strict "Plan First, Code Second" workflow to ensure performance and visual coherence.

---

## When to Use This Skill (Trigger Patterns)
**MUST apply this skill when:**
- User mentions "Awwwards", "immersive", "creative coding", or "3D website".
- User requests scroll-driven animations (Lenis, GSAP ScrollTrigger).
- Building portfolios, digital experiences, or storytelling pages.
- Stack involves: **Svelte 5**, **Three.js**, **Tailwind CSS**, **GSAP**.
- User asks to "integrate 3D with HTML".

**Trigger phrases:**
- "Make it look like an Awwwards site"
- "Add a 3D background"
- "Smooth scroll with parallax"
- "Tunnel effect", "particle system", "webgl transition"
- "Refactor for Svelte 5 runes"

**DO NOT use for:**
- Generic admin dashboards (unless highly stylized).
- Static blogs with no motion requirements.
- Pure backend logic.

---

## Latest-in-Class Tooling (2026 Standard)
Use these specific tools and versions. They are the current "Meta" for creative development.

| Category | Tool | Why it's the 2026 Standard | Documentation |
| :--- | :--- | :--- | :--- |
| **Core** | **Svelte 5** | Runes (`$state`) eliminate the need for complex store logic in 3D loops. | [svelte.dev/docs/svelte/runes](https://svelte.dev/docs/svelte/runes) |
| **3D Engine** | **Three.js** | The raw WebGL standard. Use it directly for maximum control over the render loop. | [threejs.org/docs](https://threejs.org/docs) |
| **3D Wrapper** | **Threlte 9** | The *only* valid Svelte wrapper. Use for declarative scenes, but drop to raw Three.js for complex shaders. | [threlte.xyz/docs](https://threlte.xyz/docs) |
| **Scrolling** | **Lenis** | The industry standard for smooth scrolling. Lighter and smoother than Locomotive in 2026. | [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) |
| **Animation** | **GSAP** | Still the king of timelines and `ScrollTrigger`. Nothing beats its reliability for sequencing. | [gsap.com/docs/v3](https://gsap.com/docs/v3) |
| **Styling** | **Tailwind v4** | Uses the new Oxide engine for instant builds. CSS variables are now first-class citizens. | [tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Shaders** | **Lygia** | A granular shader library (like npm for GLSL) to avoid writing noise functions from scratch. | [lygia.xyz](https://lygia.xyz) |
| **Debug** | **Leva** | A GUI panel for tweaking 3D variables in real-time. Essential for "finding the magic numbers." | [github.com/pmndrs/leva](https://github.com/pmndrs/leva) |

---

## The "Consultative" Workflow (Non-Negotiable)
**You must NOT generate implementation code immediately.** Follow this strict sequence:

### Phase 1: The Interrogation (Vibe Check)
Before planning, ask 3-5 targeted questions to lock in the creative direction.
*   **Mood:** "Is this Cyberpunk, Luxury Minimal, Brutalist, or Organic?"
*   **Motion:** "Do you want smooth, weighty scrolling (Lenis) or snappy section-based scroll?"
*   **Performance:** "Is this mobile-heavy? (affects post-processing choices)"
*   **Reference:** "Do you have a specific site (e.g., Apple, unseen.co) in mind?"

### Phase 2: Research & Validation
Once the user answers:
1.  **Search Online**: Find 2-3 live examples or technical articles matching the requested vibe.
2.  **Tech Check**: Verify if the requested effect is feasible in a browser (e.g., "Real-time raytracing is too heavy, let's use Matcaps").
3.  **Doc Review**: Check the linked docs above if using a specific feature (e.g., "Svelte 5 snippet" vs "slot").

### Phase 3: The "Battle Plan" (Design Doc)
Generate a comprehensive **Design Document** for user approval. It must include:
*   **Architecture Diagram**: How `scrollState.svelte.ts` talks to `Scene.svelte`.
*   **Z-Index Strategy**: Layering Canvas (0), UI (10), Overlays (50).
*   **Component Tree**: Breakdown of atoms/molecules.
*   **Asset List**: Textures, models, and font files needed.

### Phase 4: Phased Implementation
Only after the Plan is APPROVED, begin coding in phases:
*   **Phase 1: The Engine** (Setup Lenis, GSAP Ticker, Three.js Scene).
*   **Phase 2: The Blockout** (Grey-box geometry and basic DOM layout).
*   **Phase 3: The Polish** (Shaders, typography, micro-interactions).

---

## Core Principles

### 1. Svelte 5 Native (Runes or Death)
**Legacy Stores (`writable`) are BANNED for internal state.**
*   Use `$state` for local reactivity.
*   Use `.svelte.ts` files for global state (e.g., `scrollState.svelte.ts`).
*   Use `$derived` for animation math.
*   Use `$effect` for DOM side-effects (GSAP/Three integration).

### 2. The "Hybrid DOM" Strategy
HTML and WebGL must act as one.
*   **Canvas**: Fixed position, `z-index: 0`.
*   **HTML**: Transparent backgrounds, `pointer-events-none` for overlays, `pointer-events-auto` for buttons.
*   **Sync**: Use GSAP Ticker to sync WebGL renders with HTML scroll. Never use independent `requestAnimationFrame`.

### 3. Motion First, Layout Second
Static CSS layouts fail in 3D sites.
*   Design for the *transition*, not just the *state*.
*   Use `will-change: transform` sparingly.
*   Avoid layout thrashing (reading `offsetHeight` inside loops).

---

## Tech Stack & Templates

### 1. Global State: `scrollState.svelte.ts`
The single source of truth for the entire app.
```typescript
class ScrollState {
    y = $state(0);
    progress = $state(0);
    velocity = $state(0);
    direction = $state(0); // -1 up, 1 down

    constructor() {
        // Initialize Lenis or ScrollTrigger listeners here
    }
}
export const scrollState = new ScrollState();
```

### 2. The Render Loop: `GhostScroller.svelte`
Syncs Lenis with GSAP and Three.js.
```svelte
<script>
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import Lenis from 'lenis';

    onMount(() => {
        const lenis = new Lenis();
        
        // The Master Heartbeat
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
            // Trigger Three.js render here if manual
        });
        
        // Lag smoothing for heavy 3D loads
        gsap.ticker.lagSmoothing(0);
    });
</script>
```

### 3. Tailwind Configuration (Awwwards Style)
Focus on fluid typography and custom easing.
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Clash Display"', 'sans-serif'], // Example
        body: ['"Satoshi"', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)', // "Apple" feel
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      colors: {
        'void': '#050505', // Better than pure black
        'neon-acid': '#ccff00',
      }
    }
  }
}
```

---

## Implementation Guidelines

### Visual Style: "The Awwwards Look"
*   **Typography**: Huge, viewport-based sizes (`text-[12vw]`). Mix serif headers with monospace metadata.
*   **Micro-interactions**: Magnetic buttons, text that splits/staggers on scroll.
*   **Loaders**: Essential. Use a preloader to hide texture pop-in.
*   **Grain/Noise**: Use an SVG noise overlay (opacity 0.05) to reduce color banding in 3D gradients.

### Accessibility in a 3D World
*   **Reduced Motion**: Respect `prefers-reduced-motion`. If true, disable Three.js fly-throughs and just show static featured images.
*   **Contrast**: Ensure text over 3D backgrounds has a subtle text-shadow or backdrop-blur.
*   **Focus Management**: Since the camera moves, ensure Tab order remains logical.

### Common Pitfalls to Avoid
1.  **The "Double Loop"**: Running Lenis `raf` and Three.js `render` separately. -> **FIX**: Use `gsap.ticker`.
2.  **Scroll Jacking**: Never hijack the scroll bar unless absolutely necessary. Use Lenis for *smoothing*, not *locking*.
3.  **Memory Leaks**: In `onDestroy`, always `geometry.dispose()`, `material.dispose()`, and remove GSAP listeners.

---

## Example Prompting Workflow

**User:** "I want a landing page where a 3D drone follows the user as they scroll."

**Your Response (Phase 1):**
"That sounds epic. Before we build the drone rig:
1.  **Context**: Is this a dark, futuristic military vibe or a clean, commercial delivery vibe?
2.  **Camera**: Should the drone stay fixed in the center while the world moves (Star Wars trench run style), or should the drone physically fly down a page?
3.  **Interaction**: Do you want the drone to look at the mouse cursor?
Once you confirm, I'll research the best camera rig logic."

**Your Response (Phase 3 - after user replies):**
"**Battle Plan: The Drone Follower**
**Architecture**:
- `DroneScene.svelte`: Handles GLTF loading and mixer animation.
- `CameraRig.svelte`: Uses `scrollState.progress` to interpolate position along a CatmullRomCurve3.
- `Overlay.svelte`: HTML content with transparent sections.
**Tech**:
- GSAP `Scrub` for the timeline.
- `lookAt()` logic with a slight delay (lerp) for realism.
**Next Step**: Shall I start by setting up the `scrollState` and the basic Three.js scene?"
