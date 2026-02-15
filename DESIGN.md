# UTKARSH 2026: Creative Design Manifesto

> **"Virasat se VIKAS" (From Heritage to Evolution)**

This document serves as the **Single Source of Creative Truth** for the Utkarsh 2026 digital experience. It defines the soul of the application, ensuring that every pixel, transition, and shader contributes to the "Cinematic Engine" vision.

---

## 1. The Core Philosophy
We are not building a website. We are building an **Interactive Time Capsule**.
- **The Vibe:** A pilgrimage through time. Starts in the dust of history (Ancient India) and accelerates into the neon circuitry of the future (2047).
- **The Feel:** Heavy, momentous, and "Physical." Scrolling should feel like moving a heavy camera rig, not just sliding text.
- **The Rule:** "Motion First." If it doesn't move or react, it doesn't belong.

---

## 2. Visual Identity & Alchemy

### Color Palette (The "Dual-Tone" World)
The site is split into two distinct emotional zones. Transitions must be fluid, not abrupt.

| Zone | Primary Color | Accent | Emotion |
| :--- | :--- | :--- | :--- |
| **Zone A: Virasat (Heritage)** | `Void Black` (#050505) | `Ancient Gold` (#D4AF37) | Solemn, Regale, Timeless |
| **Zone B: Vikas (Evolution)** | `Deep Navy` (#020617) | `Neon Cyan` (#00F0FF) | Electric, Fast, Infinite |

### Typography
- **Headings (The Shout):** *Clash Display* (or similar). Bold, High-contrast, Variable weight.
  - Usage: `text-[12vw]`, `tracking-tighter`, `uppercase`.
- **Body (The Whisper):** *Satoshi* or *Inter*. Clean, legible, Swiss-grid style.
  - Usage: `text-sm`, `tracking-wide`, `opacity-80`.

---

## 3. Motion Grammar (The Physics)

### The Scroll (The Engine)
- **Technology:** Lenis
- **Setting:** `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (The "Apple" Ease).
- **Feeling:** Smooth, frictionless, but with "stopping power."

### The Transitions (The Scrub)
- All section transitions are **Scrub-Linked**. They do not play on their own; they play *with* the user.
- **Zero Latency:** The 3D camera must move *instantly* when the finger moves.
- **The "Warp" Rule:** When `velocity > threshold`, the FOV widens, and the tunnel stretches.

### Micro-Interactions (The Delight)
- **Buttons:** "Magnetic" pull. The button moves slightly towards the cursor before the click.
- **Text:** "Scramble" effect on hover or reveal (e.g., `H -> He -> Her -> Hero`).
- **Cursor:**
  - **Default:** Small Dot (Gold/Cyan depending on zone).
  - **Hover:** Large Ring (Blend Mode: Difference).
  - **Click:** Scaledown to dot.

---

## 4. Architectural Layout (The "Hybrid" Stack)

To ensure performance, we strictly enforce this Z-Index strategy:

| Layer | Z-Index | Content | Interaction |
| :--- | :--- | :--- | :--- |
| **Loader** | `z-50` | Fullscreen Preloader | Block |
| **HUD** | `z-40` | Nav, Sound Toggle, Progress Bar | Pointer-Events Auto |
| **Content** | `z-10` | Text, Buttons, Cards | Pointer-Events Mixed |
| **Ghost** | `z-0` | `GhostScroller` Logic | None |
| **Theater** | `z-[-1]` | `Canvas3D` (Three.js) | None |

---

## 5. Accessibility (The Foundation)
A cinematic site must not leave anyone behind.

- **Reduced Motion:** If `prefers-reduced-motion: true`:
  - Disable 3D Tunnel Flythrough.
  - Show static, high-quality renders of the environments instead.
  - Disable "Scramble" text effects.
- **Screen Readers:**
  - The DOM is the source of truth for content. Three.js is decorative.
  - Ensure correct `h1` -> `h6` hierarchy in the "Overlay" layer.
- **Contrast:**
  - All text over 3D backgrounds must have `text-shadow` or a subtle `backdrop-blur` gradient behind it.

---

## 6. Implementation Checklist (The "Definite of Done")

- [ ] Does the "Gold" fade seamlessly into "Neon"?
- [ ] Does the camera "lean" into turns? (Look-Ahead Logic)
- [ ] Does the site work on mobile with toolbars toggled? (`dvh` units)
- [ ] Is the frame rate locked at 60fps on an average laptop? (Single-Loop test)
- [ ] Does the cursor react to interactive elements?

> **Signed:** The Utkarsh 2026 Creative Team
