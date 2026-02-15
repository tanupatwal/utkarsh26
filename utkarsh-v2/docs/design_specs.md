# UI/UX Design Specs — Extracted from hasfilm

> **Purpose**: This document contains **every visual detail** extracted from the old `hasfilm/` codebase. Future chats should read this instead of hasfilm source files. Build using these specs + `architecture_rules.md` patterns.

---

## 1. Navbar

**Source**: `../hasfilm/src/components/overlays/Navbar.tsx` (23 lines)

- **Position**: Fixed, top-left, `z-index: 50`, `pointer-events: none` (logo is `pointer-events: auto`)
- **Logo**: `/assets/fest.png`, `h-32` (128px), `object-contain`
- **Layout**: Full width, flex between, `px-6`, no vertical padding
- **Background**: Transparent (no backdrop)

---

## 2. Hero Section

**Source**: `../hasfilm/src/components/overlays/HeroSection.tsx` (286 lines)

### Layout
- Full viewport (`100vw × 100vh`), centered content
- `transform-origin: center center`
- Content padding: `pb-20 px-6`

### Video Background
- **File**: `/assets/hero_video.mp4` (muted, loop, playsInline, autoplay)
- **Overlay**: `rgba(11, 15, 26, 0.35)` with `mix-blend-mode: multiply`

### Title "UTKARSH"
- **Font**: `'Orbitron', 'Inter', sans-serif, weight: 900`
- **Size**: `text-7xl md:text-9xl` (≈ `clamp(4rem, 8vw, 8rem)`)
- **Tracking**: `tracking-tighter`
- **Gradient**: `linear-gradient(180deg, #ffffff 0%, #F5C16C 30%, #FF8C42 55%, #00E5FF 100%)`
- **Text fill**: `-webkit-background-clip: text; -webkit-text-fill-color: transparent`
- **Shadow**: `drop-shadow(0 4px 6px rgba(0,0,0,0.8))`
- **Entrance**: `fade-in-up 0.8s ease-out, delay: 0.2s`

### Subtitle "2026"
- **Font**: `'Orbitron', weight: 800`
- **Size**: `text-3xl md:text-5xl`
- **Color**: `#9EEAFF`
- **Letter-spacing**: `0.35em`
- **Shadow**: `0 2px 4px rgba(0,0,0,0.8)`

### Tagline "Evolution Through Heritage"
- **Font**: `'Inter', weight: bold`
- **Size**: `text-xl md:text-3xl`
- **Tracking**: `0.2em`, uppercase
- **Color**: white
- **Shadow**: `0 4px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.3)`
- **Entrance**: `delay: 0.4s`

### Tagline "Virasat se VIKAS TAK"
- **Font**: `'Playfair Display', serif, italic`
- **Size**: `text-3xl md:text-6xl`
- **Gradient**: `linear-gradient(to right, #E5C56C, #FFFDE7, #D4AF37, #FFFDE7, #D4A030, #E5C56C)`
- **Animation**: `background-size: 200% auto; animation: shine 3s linear infinite` (shimmer effect)
- **Shadow**: `drop-shadow(0 5px 15px rgba(0,0,0,1)) drop-shadow(0 0 30px rgba(245,193,108,0.6))`

### Scroll Indicator
- Capsule shape: `w-6 h-10` (24×40px)
- Border: `2px solid rgba(255,255,255,0.3)`, `rounded-full`
- Inner dot: `w-1 h-2 bg-white rounded-full`
- Animation: `animate-bounce, delay: 1s`

### Scroll Behavior (translate to GSAP)
- **Matte overlapp**: `background: #05070d`, fades in during exit
- **Hold phase**: 0→35% — static, `scale: 1, opacity: 1`
- **Zoom phase**: 35%→80% — `scale: 1 → 2`, opacity stays 1
- **Fade phase**: 80%→100% — `scale: 2 → 2.2`, opacity `1 → 0`
- **Damping**: lerp factor `0.12`

> **GSAP equivalent**: `pin: true, scrub: 1` with keyframes at 0%, 35%, 80%, 100%.

---

## 3. About Section

**Source**: `../hasfilm/src/components/sections/about/AboutSection.tsx` (433 lines)

### Content Data

```ts
const STATS = [
    { label: 'Established', value: 2006, isYear: true },
    { label: 'Attendees Annually', value: 10000, suffix: '+' },
    { label: 'Days of Innovation', value: 3 },
    { label: 'Events & Workshops', value: 50, suffix: '+' },
];

const PARAGRAPHS = [
    "Utkarsh, formerly known as INNOVIZ, is a three-day extravaganza celebrating arts, culture, and engineering...",
    "From hands-on workshops and competitive hackathons to insightful talks...",
    "Since its inception in 2006, Utkarsh has established itself as a premier event..."
];
```

### Layout
- Full viewport, centered content (`flex-direction: column, align-items: center`)
- Content padding: `3rem 2rem`

### Subtitle Pill
- **Text**: "The Most Awaited Fest of the Year"
- **Font**: `'Inter', weight: 500, size: clamp(0.65rem, 1.2vw, 0.85rem)`
- **Letter-spacing**: `0.35em`, uppercase
- **Color**: `#3b82f6` (blue-500)
- **Border**: `1px solid rgba(59,130,246,0.3)`, `border-radius: 999px`
- **Background**: `rgba(59,130,246,0.05)`, `backdrop-filter: blur(8px)`
- **Padding**: `0.4em 1.2em`

### Section Title
- **Text**: "About Utkarsh"
- **Font**: `'Orbitron', weight: 900, size: clamp(2rem, 5vw, 4rem)`
- **Letter-spacing**: `0.08em`, uppercase, `line-height: 1.1`
- **Gradient**: `linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #3b82f6 100%)`
- **Shadow**: `drop-shadow(0 2px 10px rgba(59,130,246,0.3))`

### Decorative Line
- `width: 80px, height: 2px`
- `background: linear-gradient(90deg, transparent, #3b82f6, transparent)`
- Centered, `margin: 1.2rem auto 0`

### Body Paragraphs
- **Font**: `'Inter', weight: 300, size: clamp(0.9rem, 1.4vw, 1.05rem)`
- **Line-height**: `1.8`
- **Color**: `rgba(255,255,255,0.72)`
- **Shadow**: `0 1px 4px rgba(0,0,0,0.3)`
- **Max-width**: `42rem`
- **Gap**: `1.2rem` between paragraphs

### Stat Cards
- **Grid**: `4 columns, gap: clamp(1rem, 3vw, 2.5rem), max-width: 48rem`
- **Card padding**: `1.2rem 0.5rem`
- **Card bg**: `rgba(255,255,255,0.03)`, border: `1px solid rgba(255,255,255,0.06)`
- **Card backdrop**: `blur(4px)`, `border-radius: 12px`
- **Hover**: border → `rgba(59,130,246,0.3)`, bg → `rgba(59,130,246,0.06)`
- **Value font**: `'Orbitron', weight: 800, size: clamp(1.4rem, 2.8vw, 2.2rem)`, color: white
- **Label font**: `'Inter', weight: 400, size: clamp(0.55rem, 0.9vw, 0.72rem)`, color: `rgba(255,255,255,0.45)`, spacing: `0.15em`
- **Animated counter**: Quadratic ease-in (`progress²`)

### Scroll CTA
- Text "Keep scrolling": `'Inter', 0.7rem, weight: 400, spacing: 0.2em, color: rgba(255,255,255,0.35)`
- Bouncing dot in capsule: `4×4px, border-radius: 50%, background: rgba(59,130,246,0.8), box-shadow: 0 0 6px rgba(59,130,246,0.5)`
- Animation: `translateY(0→18px), opacity 1→0.3→1, 2s ease-in-out infinite`

### Ambient Glow
- Animated radial gradients (two ellipses that drift via `Math.sin/cos`)
- Color A: `rgba(59,130,246,0.08)`, ellipse `600×400px`
- Color B: `rgba(99,102,241,0.06)`, ellipse `400×300px`

### Stagger Timing (convert to GSAP `.from()` stagger)
| Element | Start → End (as sub-progress 0→1) | Y offset | Easing |
|---------|-----------------------------------|----------|--------|
| Subtitle | 0→0.15 | 20px | `power3.out` |
| Title | 0.05→0.25 | 30px | `power3.out` |
| Paragraph 1 | 0.15→0.33 | 25px | `power3.out` |
| Paragraph 2 | 0.27→0.45 | 25px | `power3.out` |
| Paragraph 3 | 0.39→0.57 | 25px | `power3.out` |
| Stats bar | 0.45→0.85 | 20px | `power3.out` |
| CTA | 0.7→0.9 | — (opacity only) | `power3.out` |

### Exit Animation
- Slide left: `translateX(−t² × 80px)` as section exits view

---

## 4. Tunnel 3D Scene

**Source**: `../hasfilm/src/components/sections/tunnel/TunnelGroup.tsx` (497 lines)

### 3D Configuration
```ts
TILE_COUNT = 24
TILE_SPAWN_Z_MIN = -200
TILE_SPAWN_Z_MAX = -80
TILE_PASS_Z = 20

RIBBON_COUNT = 100
TUNNEL_RADIUS = 12
TUNNEL_LENGTH = 100
```

### Tile Geometry
- **Type**: Curved plane (`createCurvedTileGeometry`)
- **Size**: `width: 4.8, height: 2.7, curve radius: 8.8, segments: 16`
- **Material**: `MeshBasicMaterial`, transparent, double-sided, no depth-write, `toneMapped: false`
- **Scale ranges**: `baseScale: 2.2–4.0`, aspect ratio via `localScale × 0.58` for height

### Ribbon Geometry
- **Type**: `InstancedMesh` with `PlaneGeometry(0.2, 5)`
- **Material**: Color `#4deeea`, `AdditiveBlending`, opacity `0.8`, double-sided
- **Count**: 100 ribbons distributed around cylinder

### Lighting
- Point light at `(0, 0, 10)`, intensity `1.5`, color `#4deeea`, distance `30`, decay `2`

### Speed Curve (3 phases)
| Phase | Combined Progress | Ribbon Speed | Image Speed |
|-------|------------------|-------------|-------------|
| Start (0–20%) | 0→0.2 | 25→50 px/s | 12.5→25 px/s |
| Cruise (20–60%) | 0.2→0.6 | 50→180 (quadratic) | 25→90 |
| Hyperdrive (60–100%) | 0.6→1.0 | 180→650 (power 2.5) | 90→325 |

### Visual Effects
- **FOV boost**: base + `velocityBoost × 10` (only during tunnel)
- **Vortex rotation**: `0.15 + velocityBoost × 0.2` rad/s
- **Stretch**: `1 + velocityBoost × 0.65` on both ribbons and tiles
- **Tile fade**: ramp in at `t: 0.03→0.28`, fade out at `t: 0.94→1.0`

### Auto-scroll
- Forward: 3.0s with `easeInOutCubic`
- Reverse: Same duration back to hero

---

## 5. Gallery 3D Scene

**Source**: `../hasfilm/src/components/sections/gallery/GalleryGroup.tsx` (332 lines) + `GalleryOverlay.tsx` (107 lines)

### 3D Configuration
- **Cylinder**: Panels arranged in arc, uses `SCENE_CONFIG.CYLINDER_RADIUS` and `CYLINDER_ARC`
- **Panel thickness**: 2 units
- **Panel gap**: 0.008
- **Camera**: Moves from `CAMERA_CONFIG.START` to `CAMERA_CONFIG.END`

### Lighting
- Dynamic ambient color system (changes per focused image)
- Point light: intensity `3`, distance `25`
- Ambient fill: intensity `1.5`, distance `60`
- Glow sphere: `radius × 0.75`, opacity `0.025`, `BackSide`
- Sparkles: count `200`, size `4`, speed `0.4`, opacity `0.5`, white

### Fog
- **Type**: `FogExp2`, color `#050505`, density `0.012`
- Zeroed out post-dissolve

### Sub-phases
| Sub-phase | Scroll Range | Behavior |
|-----------|-------------|----------|
| Transition | ABOUT_STAY → GALLERY_START | Camera lerp, scale 0.8→1, `smoothstep` easing |
| Viewing | GALLERY_START → 0.85 | Sticky scroll through panels, rotation |
| Pause | 0.85 → 0.855 | Last panel dwells, HUD fades |
| Dissolve | 0.855 → 0.875 | Panels dissolve L→R, camera zooms to z=50 |
| Post-dissolve | >0.876 | Group hidden |

### Sticky Scroll
- Custom cubic easing for panel snapping: `frac < 0.5 ? 4*frac³ : 1-(−2*frac+2)³/2`
- Parallax background: `rotation × 0.25`
- Smoothed rotation via `THREE.MathUtils.damp(current, target, 5, 1/60)`

### Gallery HUD Overlay
- Position: Absolute, full viewport, `padding: 4rem`
- Top-left: Index counter `"01 — 08"`, font-size `1rem`, opacity `0.7`, `letter-spacing: 0.1em`, `tabular-nums`
- Bottom-left: Title `3.5rem, weight: 300, letter-spacing: -0.02em`
- Description: `1.1rem, opacity: 0.6, line-height: 1.5`
- Timeline dots: Active dot `2.5rem wide`, inactive `0.5rem`, height `2px`, white, `transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Fade animation: `translateY(10px→0), opacity 0→1, 0.5s ease-out`

---

## 6. Highlights Section (Floating Images)

**Source**: `../hasfilm/src/components/sections/gallery/HighlightsSection.tsx` (873 lines)

### Particle System Configuration
```ts
MAX_ACTIVE_IMAGES = 35
INITIAL_IMAGE_COUNT = 18
SPAWN_INTERVAL_MIN = 0.4s
SPAWN_INTERVAL_MAX = 1.0s
BASE_TRAVEL_SPEED = 22 px/s
FADE_IN_DURATION = 1.2s
CENTER_SCALE_BOOST = 0.35
FLOW_ANGLE = -0.3 rad (slight diagonal drift)
```

### Layer System
| Layer | Mouse Range | Blur | Brightness | Speed Mult |
|-------|------------|------|-----------|-----------|
| Foreground | 15px | 0 | 0.92 | 1.0 |
| Middle | 12px | 0 | 0.80 | 0.7 |
| Background | 8px | 2px | 0.62 | 0.45 |

### Layer Distribution
- Foreground: 25%, Middle: 40%, Background: 35%

### Size Configuration
| Size Class | Weight | Width (vw) | Aspect Ratios |
|-----------|--------|-----------|---------------|
| Hero | 0.08 | 22–30 | 16:10, 4:3, 3:2 |
| Medium | 0.25 | 14–20 | 16:9, 4:3, 3:4 |
| Small | 0.40 | 8–13 | 16:9, 1:1, 3:4 |
| Tiny | 0.27 | 5–8 | 1:1, 4:3, 16:9 |

### Gravity Drain Effect
- **Phases**: Dark backdrop (0.88→0.895) → Title + Gallery (0.895→0.92) → Gravity (0.92→0.935)
- **Per-layer delay**: Foreground=0.0, Middle=0.12, Background=0.25 (foreground falls first)
- **Gravity formula**: `d = ½ g t²`, where `g = viewport height × 2.5`
- **Stretch**: `scaleY *= 1 + min(0.4, fallStrength × 0.3)`, `scaleX *= max(0.7, 1 − stretch × 0.5)`
- **Opacity fade**: `max(0, 1 − (y − 0.6vh) / 0.6vh)`
- **Motion blur**: `min(6, fallStrength × 5)px`
- **Drift toward center**: `(centerX − x) × fallStrength × 0.05`

### Title "Event Highlights"
- Scroll-based phases within 0.895→0.92:
  - Title in: 0.895→0.900
  - Title hold: 0.900→0.907
  - Title out: 0.907→0.913
  - Gallery in: 0.905→0.912

### Spawning
- Density-aware edge selection (sparse edges get higher spawn weight)
- Images enter from all 4 edges with directional velocity
- Global drift bias applied: `vx += FLOW_DX × speed × 0.2`
- Z-index by layer: foreground=10-12, middle=5-7, background=2-4

---

## 7. Schedule Section

**Source**: `../hasfilm/src/components/sections/schedule/ScheduleSection.tsx` (997 lines)

### Accent Colors
```css
--accent: #38bdf8;          /* sky-400 */
--accent-dim: rgba(56,189,248,0.15);
--accent-med: rgba(56,189,248,0.3);
--accent-glow: rgba(56,189,248,0.5);
```

### CRT Overlays
- **Scanlines**: `repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,0.06) 2px 4px)`, `mix-blend-mode: overlay`
- **Noise**: SVG fractalNoise `baseFrequency: 0.9`, 4 octaves, `opacity: 0.03`, `128×128px` repeat

### Card Design
- **Size**: `height: clamp(260px, 22rem, 340px)`, full width
- **Transform**: `rotateX(18deg) scale(0.95)` → hover: `rotateX(0deg) translateZ(20px) scale(1.02)`
- **Transition**: `0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Clip-path (chamfered)**: `polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%)`
- **Glass bg**: `linear-gradient(135deg, rgba(255,255,255,0.04), transparent), rgba(2,6,23,0.85)`
- **Backdrop**: `blur(8px)`
- **Box-shadow**: `0 0 0 1px accent-dim, inset 0 0 20px rgba(56,189,248,0.05), 0 10px 40px rgba(0,0,0,0.6)`
- **Hover shadow**: `0 0 0 1px accent-glow, inset 0 1px 0 accent-med, inset 0 0 30px rgba(56,189,248,0.15), 0 0 40px rgba(56,189,248,0.25), 0 20px 60px rgba(0,0,0,0.5)`

### Corner Brackets
- `14×14px`, 1px border (top-left/bottom-right), `accent-med` color
- `opacity: 0 → 1` on hover

### Image Treatment
- `opacity: 0.85`, `brightness(0.88) saturate(1.1)`, `scale(1.01)`
- Hover: `opacity: 1`, `brightness(1.05) saturate(1.2)`, `scale(1.08)`

### Category Strip
- `height: 3px`, top edge, category color + glow on hover

### Glass Info Overlay (hover)
- `clip-path: polygon(4% 0, 100% 0, 100% 92%, 96% 100%, 0 100%, 0 8%)`
- `bg: rgba(2,6,23,0.92)`, `backdrop-filter: blur(16px)`
- `transform: translateY(12px) → translateY(0)`, `0.25s ease`

### Grid
- `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`, `gap: 1.5rem`
- `transform-style: preserve-3d`, `perspective: 1000px`
- Entry animation: `translateY(10px) → 0, opacity 0 → 1, 0.35s ease`

### Modal
- **Backdrop**: `rgba(0,2,10,0.82)`, `blur(12px)`, `transition: 0.35s cubic-bezier(0.23,1,0.32,1)`
- **Content**: flex, `max-width: 900px, width: 90vw, max-height: 80vh`
- **Entry**: `scale(0.92) translateY(20px) → scale(1) translateY(0)`
- **Image wrap**: flex `42%`, `min-height: 380px`, `border: 2px solid accent-med`, `clip-path: polygon(6% 0, 100% 0, 100% 94%, 94% 100%, 0 100%, 0 6%)`
- **Image shadow**: `0 0 20px rgba(56,189,248,0.2), 0 0 60px rgba(56,189,248,0.08), inset 0 0 30px rgba(56,189,248,0.05)`
- **Details panel**: `bg: linear-gradient(135deg, rgba(255,255,255,0.04), transparent), rgba(2,6,23,0.92)`
- **Title font**: `'Space Grotesk' / 'Orbitron', clamp(1.4rem, 2.5vw, 1.8rem), weight: 800`
- **Close button**: `36×36px`, chamfered clip-path, `accent` color
- **Nav arrows**: `44×44px`, chamfered, `hover: scale(1.1)`
- **Event counter**: bottom center, `0.7rem`, `letter-spacing: 0.2em`

### Day Tabs
- 3 columns (33.33%), `transition: 0.4s cubic-bezier(0.23,1,0.32,1)`
- SVG bracket animation between tabs

### Metadata
- `font-size: 0.68rem`, `color: rgba(148,163,184,0.9)`, `font-family: 'Inter', 'SF Mono', monospace`
- Icons: `14×14px, opacity: 0.7`
- Category tag: `0.55rem, weight: 700, spacing: 0.12em`, uppercase

---

## 8. Team Section

**Source**: `../hasfilm/src/components/sections/team/TeamSection.tsx` (883 lines)

### Fonts
- Primary: `'Space Grotesk', 'Inter', sans-serif`
- Label italic: `'Georgia', 'Times New Roman', serif`

### Film Grain Overlay
- Same SVG noise as Schedule: `baseFrequency: 0.85`, 4 octaves, `opacity: 0.04`

### Drift Background Images
- 5+ columns at `width: 20vw`, vertical scroll animation (alternating up/down)
- Image styling: `opacity: 0.16`, `brightness(0.55) saturate(0.45) blur(0.5px)`, `border-radius: 4px`
- Infinite linear animation (`translateY(0) → translateY(-50%)` and reverse)

### Geometric Lines
- SVG background, `opacity: 0.07`, subtle mouse parallax

### Layout
- **Left (50%)**: Names column, centered vertically
- **Right (50%)**: Image display

### "Our Team" Label
- `clamp(0.85rem, 1.1vw, 1.05rem)`, `letter-spacing: 0.15em`, `opacity: 0.5`
- Italicized "Our" + bold "Team"

### Name Items
- **Active name**: `clamp(1.8rem, 3.5vw, 3.2rem)`, color `#fff`, `scale(1.08)`, `text-shadow: 0 0 40px rgba(255,255,255,0.25), 0 0 80px rgba(255,255,255,0.1)`
- **Inactive name**: `clamp(1.1rem, 2vw, 1.8rem)`, color `#444`
- **Distance dimming**: dist-1=`#555/0.85`, dist-2=`#3a3a3a/0.6`, dist-3=`#2a2a2a/0.35`, dist-4=`#1a1a1a/0.18`
- **Transition**: `0.7s cubic-bezier(0.16, 1, 0.3, 1)` for all properties
- **Visible radius**: 4 names above/below active
- **Fade masks**: top/bottom `3rem` gradient (`#000 → transparent`)

### Page Counter
- `clamp(0.7rem, 0.85vw, 0.85rem)`, weight: 300, spacing: `0.25em`
- Color: `rgba(255,255,255,0.3)`, current: `rgba(255,255,255,0.8), weight: 600`
- `tabular-nums`

### Image Frame
- `width: clamp(240px, 22vw, 340px), height: clamp(300px, 28vw, 420px)`
- **Active image**: `grayscale(0.85) contrast(1.1)`, `scale(1.12) → scale(1)`, `clip-path: inset(100% 0 0 0) → inset(0)`
- **Previous image**: `opacity: 0.4`, `scale(1.04)`, `grayscale(1) contrast(0.8) blur(2px)`
- **Image transitions**: `0.55s–0.9s cubic-bezier(0.16, 1, 0.3, 1)`

### Role Label
- `clamp(0.75rem, 0.9vw, 0.9rem)`, weight: 400, spacing: `0.18em`, `rgba(255,255,255,0.6)`
- Prefix: `▸` character
- Entry: `translateY(8px→0), opacity 0→1, 0.6s cubic-bezier(0.16, 1, 0.3, 1)`

### Arrow Buttons
- `42×42px`, `border: 1px solid rgba(255,255,255,0.15)`, `color: rgba(255,255,255,0.5)`
- Hover: white border, `scale(1.12)`, `bg: rgba(255,255,255,0.06)`
- Active: `scale(0.95)`
- `backdrop-filter: blur(4px)`

---

## 9. Data Files to Port

All content lives in `../hasfilm/src/data/`. Copy these to `src/data/`:

| File | Key Exports | Usage |
|------|------------|-------|
| `content.ts` | `CONTENT` (tunnel texture URLs) | Tunnel tile textures |
| `gallery.ts` | `GALLERY_CONTENT` (title, desc, url per item) | Gallery panels + HUD |
| `highlights.ts` | `HIGHLIGHTS_CONTENT` (image URLs array) | Floating images system |
| `schedule.ts` | `SCHEDULE_DAYS`, `getEventsForDay()`, `CATEGORY_COLORS`, `ScheduleEvent` type | Schedule cards + modal |
| `team.ts` | `TEAM_MEMBERS`, `TEAM_BG_IMAGES` | Team names + photos |

---

## 10. Global Font Stack

Import via Google Fonts (already in `index.html`):
- **Display**: `'Orbitron'` — titles, headings, stat values
- **Body**: `'Inter'` — paragraphs, labels, UI text
- **Accent**: `'Playfair Display'` — hero tagline only (add this to Google Fonts import!)
- **Code/Schedule**: `'Space Grotesk'` — schedule titles, team names (add this to Google Fonts import!)

> **Note**: The existing `index.html` only imports Orbitron + Inter. Need to add Playfair Display and Space Grotesk.

---

## 11. Key Animations (Reusable)

| Name | CSS | Used In |
|------|-----|---------|
| fade-in-up | `opacity 0→1, translateY(20px→0), 0.8s ease-out` | Hero entrance |
| shine | `background-position: 0→200%, 3s linear infinite` | Hero tagline shimmer |
| scroll-pulse | `translateY(0→18px), opacity 1→0.3→1, 2s ease-in-out infinite` | About CTA dot, Hero dot |
| grid-fade-in | `opacity 0→1, translateY(10px→0), 0.35s ease` | Schedule cards |
| role-fade | `opacity 0→1, translateY(8px→0), 0.6s cubic-bezier(0.16,1,0.3,1)` | Team role label |
| drift-up/down | `translateY(0↔-50%), linear infinite` | Team background images |
