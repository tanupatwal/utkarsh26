# UTKARSH 2026 - Technical Specification Document
**Version:** 1.0  
**Date:** February 16, 2026  
**Project:** Interactive Cinematic Festival Website  
**Theme:** "Virasat se VIKAS" (From Heritage to Evolution)

***

## 1. Executive Summary

### 1.1 Project Vision
Create an Awwwards-caliber immersive web experience that transforms a college festival website into a **cinematic journey**. Users should feel like they're physically traveling through a 3D world controlled by their scroll, transitioning from ancient heritage (dust and stone) to futuristic technology (neon and circuitry).

### 1.2 Core Philosophy
- **Motion First:** If it doesn't move or react, it doesn't belong
- **Heavy & Physical:** Animations should feel weighty, like moving real objects
- **60 FPS Non-Negotiable:** Performance cannot be sacrificed for effects
- **Progressive Enhancement:** Site must work without WebGL (fallback to 2D)

### 1.3 Success Metrics
- Lighthouse Performance Score: >85
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Zero layout shifts (CLS = 0)
- Smooth 60fps scrolling on mid-range devices (2020+ laptops)

***

## 2. Technical Stack

### 2.1 Core Framework
```yaml
Runtime: Bun 1.1+
Framework: SvelteKit 2.x with Svelte 5
Rendering: SSR + CSR (Universal)
TypeScript: 5.9+ (Strict mode)
```

### 2.2 3D Engine
```yaml
WebGL Library: Three.js r170+
Svelte Integration: Threlte 8.x (@threlte/core + @threlte/extras)
Shader Language: GLSL ES 3.0
Fallback: CSS 3D transforms (non-WebGL devices)
```

### 2.3 Animation System
```yaml
Scroll Engine: Lenis 1.1+ (native smooth scroll)
Timeline: GSAP 3.12+ with ScrollTrigger plugin
Easing: Custom Penner equations + GSAP eases
Render Loop: GSAP Ticker (single-loop architecture)
```

### 2.4 Styling & UI
```yaml
CSS Framework: Tailwind CSS v4 (Oxide engine)
Typography: System fonts + Custom @font-face
Color Space: sRGB with manual P3 fallback
Responsive: Mobile-first (320px → 2560px)
```

### 2.5 Build & Deployment
```yaml
Bundler: Vite 7.x
Package Manager: Bun (lockfile: bun.lock)
Hosting: Vercel / Cloudflare Pages
CDN: Cloudflare (assets)
Analytics: Minimal (privacy-first)
```

***

## 3. Architecture Design

### 3.1 The "Single World" Pattern
**Core Concept:** One continuous 3D world where the camera travels along a predefined path (spline). The DOM is a "window" into this world.

```
┌─────────────────────────────────────────────────┐
│  Browser Window (Fixed Viewport)                │
│  ┌───────────────────────────────────────────┐  │
│  │  HTML Overlays (z-index layers)          │  │
│  │  • Hero Title                             │  │
│  │  • Section Text                           │  │
│  │  • Interactive Cards                      │  │
│  └───────────────────────────────────────────┘  │
│           ↓ (transparent holes)                  │
│  ┌───────────────────────────────────────────┐  │
│  │  WebGL Canvas (fixed, z-index: -1)       │  │
│  │  • Camera moves through 3D space         │  │
│  │  • Objects are positioned in world       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 3.2 Z-Index Layering Strategy
```css
z-index: 50  → Preloader (fullscreen loading overlay)
z-index: 40  → HUD (nav, progress bar, sound toggle)
z-index: 10  → Content (section text, buttons, cards)
z-index: 0   → Ghost Scroller (invisible scroll logic)
z-index: -1  → 3D Canvas (WebGL background)
```

### 3.3 Scroll Architecture
**Native Scroll + Smooth Interpolation**

```
User Scrolls
    ↓
Browser Native Scroll (body height: auto)
    ↓
Lenis (smooths the value with easing)
    ↓
GSAP ScrollTrigger (maps to animations)
    ↓
Three.js Camera (updates position on spline)
```

**Key Decision:** Use **real HTML height** (not virtual scroll). The page is actually tall (~850vh), ensuring:
- Native momentum scrolling on mobile
- Address bar hide/show works correctly
- Keyboard navigation (Page Down, Space) works
- Screen readers can navigate

### 3.4 State Management
**Single Source of Truth: `scrollState`**

```typescript
// src/lib/state/scrollState.svelte.ts
class ScrollState {
  // Scroll progress (0 = top, 1 = bottom)
  progress = $state(0);
  
  // Scroll velocity (for warp effects)
  velocity = $state(0);
  
  // Loading complete flag
  isLoaded = $state(false);
  
  // Current section identifier
  activeZone = $state<Zone>('HERO');
  
  // Camera look-at target (for animations)
  targetLookAt = $state(new Vector3());
  
  // Hovered entity (for interactive sections)
  hoveredItem = $state<string | null>(null);
}

type Zone = 
  | 'HERO' 
  | 'WARP' 
  | 'ABOUT' 
  | 'GALLERY' 
  | 'HIGHLIGHTS' 
  | 'SCHEDULE' 
  | 'TEAM' 
  | 'FOOTER';
```

**Update Pattern:**
- **DOM-Driven:** Each section sets `activeZone` via ScrollTrigger
- **Fallback:** `GhostScroller` sets it based on progress % if ScrollTrigger fails

***

## 4. Section Specifications

### 4.1 Section 1: HERO
**Height:** 100vh  
**Background:** Black (`#000000`)  
**3D Content:** Optional video plane  
**HTML Content:** Title, tagline, scroll indicator

#### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│         [Fade-in from black]            │
│                                         │
│            UTKARSH 2026                 │
│        [Gradient text effect]           │
│                                         │
│    "EVOLUTION THROUGH HERITAGE"         │
│     "VIRASAT SE VIKAS TAK"              │
│                                         │
│          [Scroll indicator]             │
│              ↓ SCROLL                   │
│                                         │
└─────────────────────────────────────────┘
```

#### Interactions
- **On Load:** Text scramble effect (characters randomize, then settle)
- **On Scroll:** Opacity fades from 1 → 0 (linear, 0-100vh)
- **Camera:** Static at `Z = 0`, facing `Z = -10`

#### Technical Implementation
```svelte
<!-- Hero.svelte -->
<script>
  import { onMount } from 'svelte';
  import { scrollState } from '$lib/state/scrollState.svelte';
  import gsap from 'gsap';
  
  let container: HTMLElement;
  let titleChars: string[] = 'UTKARSH 2026'.split('');
  
  onMount(() => {
    // Text scramble effect
    gsap.from(titleChars, {
      duration: 0.05,
      scrambleText: { chars: "!<>-_\\/[]{}—=+*^?#________" },
      stagger: 0.05
    });
    
    // Fade-out on scroll
    gsap.to(container, {
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      },
      opacity: 0
    });
    
    // Set zone
    ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      onEnter: () => (scrollState.activeZone = 'HERO')
    });
  });
</script>

<div bind:this={container} class="hero-section">
  <h1 class="title">
    {#each titleChars as char}
      <span>{char}</span>
    {/each}
  </h1>
  <p class="tagline">Evolution Through Heritage</p>
  <div class="scroll-indicator">↓ SCROLL</div>
</div>
```

***

### 4.2 Section 2: WARP (Tunnel Transition)
**Height:** 100vh  
**Background:** Transparent  
**3D Content:** Video-textured tube geometry  
**HTML Content:** None (pure 3D)

#### Visual Design
The tunnel is a **tube geometry** that wraps around the camera path. As the user scrolls, the camera travels *through* the tube (like Star Wars hyperspace).

#### Tunnel Geometry
```typescript
// Tube wrapped around camera path
const tubeGeometry = new THREE.TubeGeometry(
  cameraPath,      // CatmullRomCurve3
  100,             // Segments
  2,               // Radius
  8,               // Radial segments
  false            // Not closed
);
```

#### Video Texture
```typescript
// Load video
const video = document.createElement('video');
video.src = '/assets/tunnel-trailer/tunnel.mp4';
video.loop = true;
video.muted = true; // Autoplay requirement
video.play();

// Create texture
const texture = new THREE.VideoTexture(video);
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(1, 4); // Stretch vertically

// Apply to inside of tube
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide // Render inside faces
});
```

#### Warp Effect (FOV Modulation)
```typescript
// In render loop
const baselineFOV = 75;
const velocityMultiplier = 2;
const maxWarp = 40;

const warpAmount = Math.min(
  Math.abs(scrollState.velocity) * velocityMultiplier, 
  maxWarp
);

const targetFOV = baselineFOV + warpAmount;

// Smooth interpolation
camera.fov += (targetFOV - camera.fov) * 0.1;
camera.updateProjectionMatrix();
```

#### Conditional Rendering
**Critical:** The tunnel canvas must only render during HERO, WARP, and ABOUT sections.

```svelte
<!-- +layout.svelte -->
{#if ['HERO', 'WARP', 'ABOUT'].includes(scrollState.activeZone)}
  <div class="fixed inset-0 z-[-1]" 
       in:fade={{ duration: 300 }} 
       out:fade={{ duration: 200 }}>
    <Canvas>
      <Scene /> <!-- Contains Tunnel -->
    </Canvas>
  </div>
{/if}
```

***

### 4.3 Section 3: ABOUT
**Height:** 100vh  
**Background:** Black  
**3D Content:** Tunnel fades out  
**HTML Content:** Stats + descriptive text

#### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐ │
│    │2006 │  │10K+ │  │  3  │  │ 50+ │ │
│    └─────┘  └─────┘  └─────┘  └─────┘ │
│   Established Attendees  Days   Events │
│                                         │
│    [Paragraph 1: Heritage context]     │
│    [Paragraph 2: Evolution vision]     │
│    [Paragraph 3: Festival highlights]  │
│                                         │
└─────────────────────────────────────────┘
```

#### Stats Animation
```typescript
// Counter animation (0 → target number)
gsap.to(statValue, {
  scrollTrigger: {
    trigger: container,
    start: 'top center',
    toggleActions: 'play none none reverse'
  },
  innerText: targetNumber,
  duration: 2,
  ease: 'power2.out',
  snap: { innerText: 1 }, // Integer steps
  onUpdate: function() {
    statElement.innerText = Math.round(this.targets()[0].innerText);
  }
});
```

#### Tunnel Fade-Out
As the user reaches the bottom of the About section, the tunnel's opacity transitions from 1 → 0:

```typescript
// In Scene.svelte (Tunnel material)
const opacity = gsap.utils.mapRange(
  0.3,  // Start fade at 30% scroll
  0.4,  // Complete fade at 40% scroll
  1,    // From opacity 1
  0,    // To opacity 0
  scrollState.progress
);

tunnelMaterial.opacity = opacity;
tunnelMaterial.transparent = true;
```

***

### 4.4 Section 4: GALLERY
**Height:** 200vh (tall for scroll-based navigation)  
**Background:** Transparent  
**3D Content:** Cylindrical curved panels (5 images)  
**HTML Content:** Sticky title HUD

#### Visual Design (3D)
```
        Camera View
    ┌─────────────────┐
    │                 │
 ┌──┤   [Image 3]     ├──┐
 │  │                 │  │
[I2] │   [Centered]    │ [I4]
 │  │                 │  │
 └──┤   [Image 1]     ├──┘
    │                 │
    └─────────────────┘
       [Image 5 behind]
```

Images are arranged in a **cylinder** around the camera. As the user scrolls through this 200vh section:
- **0-40vh:** Image 1 is centered
- **40-80vh:** Cylinder rotates, Image 2 centers
- **80-120vh:** Image 3 centers
- etc.

#### Geometry
```typescript
// Per-image curved panel
const curve = new THREE.EllipseCurve(
  0, 0,           // Center
  cylinderRadius, // X radius
  cylinderRadius, // Y radius
  0, Math.PI * 0.3, // Start/end angle (60° arc)
  false           // Not clockwise
);

const points = curve.getPoints(50);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

// Make it 3D (extrude into panel)
const panelGeometry = new THREE.PlaneGeometry(width, height, 50, 1);
// Bend the plane using vertex shader
```

#### Vertex Shader (Curved Panel)
```glsl
// Bend the plane into an arc
uniform float radius;
uniform float angle;

void main() {
  vec3 pos = position;
  
  // Calculate arc position
  float theta = (pos.x / radius) * angle;
  pos.x = radius * sin(theta);
  pos.z = radius * (1.0 - cos(theta));
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

#### Dissolve Shader (Exit Animation)
As the user scrolls past the gallery (>200vh), panels dissolve using a custom fragment shader:

```glsl
// Fragment shader
uniform sampler2D imageTexture;
uniform float dissolveAmount; // 0 to 1
uniform sampler2D noiseTexture;

void main() {
  vec4 color = texture2D(imageTexture, vUv);
  float noise = texture2D(noiseTexture, vUv).r;
  
  // Dissolve: If noise < dissolveAmount, discard pixel
  if (noise < dissolveAmount) {
    discard;
  }
  
  // Edge glow
  float edgeGlow = smoothstep(dissolveAmount - 0.1, dissolveAmount, noise);
  color.rgb += vec3(0.0, 0.8, 1.0) * edgeGlow * 2.0; // Cyan glow
  
  gl_FragColor = color;
}
```

#### HTML Overlay (Sticky HUD)
```svelte
<div class="gallery-section h-[200vh] relative">
  <div class="sticky top-0 h-screen flex flex-col justify-between p-8">
    <div class="border-l-2 border-white/20 pl-4">
      <h3 class="font-mono text-sm text-cyan-400">ARCHIVES</h3>
      <h2 class="text-4xl font-bold text-white">GLIMPSES</h2>
    </div>
    
    <div class="text-right">
      <p class="font-mono text-xs text-white/50">
        {currentImageIndex + 1} / 5
      </p>
    </div>
  </div>
</div>
```

#### Data Structure
```typescript
// src/lib/data/gallery.ts
export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  dominantColor: string; // Hex color for ambient lighting
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'gallery-1',
    src: '/assets/gallery/1.jpg',
    title: 'Opening Ceremony',
    description: 'The dawn of innovation',
    dominantColor: '#FF6B35'
  },
  // ... 4 more images
];
```

***

### 4.5 Section 5: EVENT HIGHLIGHTS
**Height:** 150vh  
**Background:** Black  
**3D Content:** None (HTML only)  
**HTML Content:** Floating Bento gallery with mouse parallax

#### Visual Design
```
┌─────────────────────────────────────────┐
│          EVENT HIGHLIGHTS               │
│                                         │
│  [Img]     [Img]        [Img]          │
│      [Img]       [Img]       [Img]     │
│  [Img]     [Img]        [Img]          │
│      [Img]       [Img]       [Img]     │
│                                         │
└─────────────────────────────────────────┘
   [Images float in 3 depth layers]
   [Mouse parallax: foreground moves faster]
```

#### Parallax Implementation
```typescript
// Mouse parallax effect
document.addEventListener('mousemove', (e) => {
  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
  
  // Layer 1 (foreground): Moves 30px max
  foregroundImages.forEach(img => {
    gsap.to(img, {
      x: xPercent * 30,
      y: yPercent * 30,
      duration: 0.5,
      ease: 'power2.out'
    });
  });
  
  // Layer 2 (middleground): Moves 15px
  middleImages.forEach(img => {
    gsap.to(img, {
      x: xPercent * 15,
      y: yPercent * 15,
      duration: 0.5
    });
  });
  
  // Layer 3 (background): Moves 5px
  backgroundImages.forEach(img => {
    gsap.to(img, {
      x: xPercent * 5,
      y: yPercent * 5,
      duration: 0.5
    });
  });
});
```

#### Hover Expansion
```svelte
<div class="highlight-image"
     on:mouseenter={() => hoveredId = image.id}
     on:mouseleave={() => hoveredId = null}>
  <img src={image.src} alt={image.title} 
       class:scale-110={hoveredId === image.id}
       class:z-10={hoveredId === image.id} />
  
  {#if hoveredId === image.id}
    <div class="info-overlay" transition:fade>
      <h3>{image.title}</h3>
      <p>{image.category}</p>
    </div>
  {/if}
</div>
```

***

### 4.6 Section 6: SCHEDULE
**Height:** 200vh  
**Background:** Black  
**3D Content:** None  
**HTML Content:** 3-day tab interface + event cards

#### Visual Design
```
┌─────────────────────────────────────────┐
│          FESTIVAL SCHEDULE              │
│                                         │
│   [ DAY 1 ]  [ DAY 2 ]  [ DAY 3 ]      │
│   ────────   ────────   ────────        │
│                                         │
│  ┌──────────────────────────────┐      │
│  │ 10:00 AM - Opening Ceremony  │      │
│  │ [Tech] [Main Auditorium]     │      │
│  └──────────────────────────────┘      │
│  ┌──────────────────────────────┐      │
│  │ 11:30 AM - Hackathon Starts  │      │
│  │ [Tech] [Lab Building]        │      │
│  └──────────────────────────────┘      │
│  ... (60 events total)                 │
└─────────────────────────────────────────┘
```

#### Tab Switching Animation
```typescript
// SVG bracket animation (bracket moves under active tab)
gsap.to(bracketPath, {
  attr: { d: getPathForTab(activeDay) },
  duration: 0.4,
  ease: 'power3.out'
});

// Cards fade/slide
gsap.to(currentDayCards, {
  opacity: 0,
  y: -20,
  stagger: 0.05,
  duration: 0.2,
  onComplete: () => {
    gsap.from(newDayCards, {
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.3
    });
  }
});
```

#### Event Card Modal
```svelte
<!-- Clicking a card opens modal with full details -->
{#if selectedEvent}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <img src={selectedEvent.image} alt="" />
      <h2>{selectedEvent.title}</h2>
      <p class="time">{selectedEvent.time}</p>
      <p class="location">{selectedEvent.location}</p>
      <p class="description">{selectedEvent.description}</p>
      <button on:click={closeModal}>Close</button>
    </div>
  </div>
{/if}
```

#### Data Structure
```typescript
// src/lib/data/schedule.ts
export interface Event {
  id: string;
  title: string;
  time: string;
  day: 1 | 2 | 3;
  category: 'tech' | 'cultural' | 'sports' | 'ceremony' | 'music';
  location: string;
  description: string;
  image: string;
}

export const schedule: Event[] = [
  {
    id: 'evt-001',
    title: 'Opening Ceremony',
    time: '10:00 AM',
    day: 1,
    category: 'ceremony',
    location: 'Main Auditorium',
    description: 'Welcome address and lighting of lamp',
    image: '/assets/schedule/opening.jpg'
  },
  // ... 59 more events
];
```

***

### 4.7 Section 7: TEAM
**Height:** 100vh  
**Background:** Black  
**3D Content:** Optional (3D network nodes on hover)  
**HTML Content:** Grid of 24 team members

#### Visual Design
```
┌─────────────────────────────────────────┐
│            THE CORE TEAM                │
│                                         │
│  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │   │
│  │ ADITYA │  │  TANU  │  │RISHABH │   │
│  │Tech Lead│  │Design │  │Event H.│   │
│  └────────┘  └────────┘  └────────┘   │
│  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ [IMG]  │  │ [IMG]  │  │ [IMG]  │   │
│  │ SHREYA │  │ RAHUL  │  │ PRIYA  │   │
│  │PR Mgr  │  │Dev     │  │Content │   │
│  └────────┘  └────────┘  └────────┘   │
│  ... (24 members total)                │
└─────────────────────────────────────────┘
```

#### Hover Interaction
```svelte
<div class="team-member"
     on:mouseenter={() => scrollState.hoveredItem = member.id}
     on:mouseleave={() => scrollState.hoveredItem = null}>
  
  <img src={member.photo} alt={member.name}
       class="clip-path-hexagon" />
  
  <h3 class:text-cyan-400={scrollState.hoveredItem === member.id}>
    {member.name}
  </h3>
  <p>{member.role}</p>
</div>
```

#### Optional: 3D Network Nodes
If GPU budget allows, hovering a team member triggers a 3D particle network:

```typescript
// Particle system that connects hovered member to others
const createNetwork = (memberId: string) => {
  const memberPosition = getMemberPosition(memberId);
  const otherMembers = teamMembers.filter(m => m.id !== memberId);
  
  otherMembers.forEach(other => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        memberPosition,
        other.position
      ]),
      new THREE.LineBasicMaterial({ 
        color: 0x00ccff, 
        transparent: true,
        opacity: 0 
      })
    );
    
    // Animate line appearing
    gsap.to(line.material, {
      opacity: 0.5,
      duration: 0.3
    });
  });
};
```

***

### 4.8 Section 8: FOOTER
**Height:** 50vh  
**Background:** Black  
**3D Content:** None  
**HTML Content:** Links, social media, credits

#### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│           UTKARSH 2026                  │
│     NIT Silchar • Feb 20-22             │
│                                         │
│  [Instagram] [Twitter] [YouTube]        │
│                                         │
│  About  |  Contact  |  Team  |  Past    │
│                                         │
│  © 2026 UTKARSH. Built with ❤️ in Svelte│
│                                         │
└─────────────────────────────────────────┘
```

***

## 5. File Structure

```
utkarsh-2026/
├── public/
│   ├── assets/
│   │   ├── gallery/          # 5 images
│   │   ├── highlights/       # 12 images
│   │   ├── schedule/         # 26 images
│   │   ├── team/             # 24 photos
│   │   ├── tunnel-trailer/   # Video frames
│   │   └── hero_video.mp4    # Hero video
│   └── robots.txt
│
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── 3d/
│   │   │   │   ├── Canvas3D.svelte
│   │   │   │   ├── Scene.svelte         # Tunnel
│   │   │   │   ├── Gallery3D.svelte     # Gallery canvas
│   │   │   │   ├── TunnelMesh.svelte
│   │   │   │   └── GalleryPanel.svelte
│   │   │   │
│   │   │   ├── sections/
│   │   │   │   ├── Hero.svelte
│   │   │   │   ├── WarpSpacer.svelte
│   │   │   │   ├── About.svelte
│   │   │   │   ├── GalleryReveal.svelte
│   │   │   │   ├── EventHighlights.svelte
│   │   │   │   ├── Schedule.svelte
│   │   │   │   ├── Team.svelte
│   │   │   │   └── Footer.svelte
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Preloader.svelte
│   │   │       ├── Navbar.svelte
│   │   │       └── ProgressBar.svelte
│   │   │
│   │   ├── shaders/
│   │   │   ├── curvedPanel.vert.glsl
│   │   │   ├── dissolve.frag.glsl
│   │   │   └── warp.frag.glsl
│   │   │
│   │   ├── data/
│   │   │   ├── gallery.ts
│   │   │   ├── highlights.ts
│   │   │   ├── schedule.ts
│   │   │   └── team.ts
│   │   │
│   │   ├── state/
│   │   │   └── scrollState.svelte.ts
│   │   │
│   │   └── utils/
│   │       ├── easing.ts
│   │       └── colorExtraction.ts
│   │
│   └── routes/
│       ├── +layout.svelte      # Canvas mounting logic
│       ├── +page.svelte        # Section composition
│       └── layout.css          # Global styles
│
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

***

## 6. Performance Requirements

### 6.1 Asset Budget
```yaml
Total Page Weight: < 10 MB
Hero Video: < 3 MB (H.264, 720p)
Tunnel Video: < 2 MB (looping texture)
Gallery Images: < 300 KB each (WebP)
Highlights Images: < 150 KB each (WebP)
Schedule Images: < 200 KB each (WebP)
Team Photos: < 100 KB each (WebP)
Fonts: < 200 KB total
JavaScript: < 500 KB (compressed)
```

### 6.2 Render Budget
```yaml
Target Frame Rate: 60 FPS (16.67ms per frame)
Max JS Execution: < 10ms per frame
GPU Budget: < 2GB VRAM
Draw Calls: < 100 per frame
Triangles: < 500,000 per frame
Texture Memory: < 500 MB
```

### 6.3 Loading Strategy
```yaml
Critical Path:
  1. HTML + CSS (inline)
  2. scrollState + GhostScroller
  3. Preloader UI
  
Above-the-Fold:
  4. Hero assets (text, scramble effect)
  5. Tunnel geometry + video (low-res preview)
  
Progressive:
  6. Gallery images (lazy load)
  7. Highlights images (lazy load)
  8. Schedule data (on-demand)
  9. Team photos (on-demand)
```

***

## 7. Implementation Phases

### Phase 0: Foundation (Week 1)
- ✅ Initialize SvelteKit project
- ✅ Configure Threlte + GSAP
- ✅ Create `scrollState` singleton
- ✅ Build `GhostScroller` (Lenis + GSAP sync)
- ✅ Implement Preloader

### Phase 1: Core 3D (Week 2)
- ✅ Create camera spline path
- ✅ Implement look-ahead camera
- ✅ Build wireframe tunnel (proof of concept)
- ✅ Add FOV warp effect
- ✅ Implement conditional canvas mounting

### Phase 2: HTML Skeleton (Week 2-3)
- ✅ Build all 8 section components (placeholder content)
- ✅ Implement ScrollTrigger zone detection
- ✅ Add z-index layering
- ✅ Test scroll flow (Hero → Footer)

### Phase 3: Tunnel (Week 3)
- 🔨 Upgrade tunnel to TubeGeometry
- 🔨 Add video texture
- 🔨 Implement texture scrolling (parallax inside tube)
- 🔨 Optimize for 60fps

### Phase 4: Gallery (Week 4)
- 🔨 Create Gallery3D.svelte (separate canvas)
- 🔨 Build curved panel geometry
- 🔨 Implement cylindrical layout (5 images)
- 🔨 Add dissolve shader
- 🔨 Implement scroll-driven rotation

### Phase 5: HTML Content (Week 5)
- 📝 Wire About section (stats animation)
- 📝 Wire Event Highlights (12 images + parallax)
- 📝 Wire Schedule (60 events + tabs)
- 📝 Wire Team (24 members + hover)
- 📝 Wire Footer (links)

### Phase 6: Polish (Week 6)
- 🎨 Add micro-interactions (button hovers, card flips)
- 🎨 Implement color extraction for Gallery
- 🎨 Add custom cursor (optional)
- 🎨 Add audio manager (optional)
- 🎨 Optimize for mobile

### Phase 7: QA & Launch (Week 7)
- 🧪 Cross-browser testing (Chrome, Safari, Firefox, Edge)
- 🧪 Performance profiling (Lighthouse)
- 🧪 Accessibility audit (WCAG AA)
- 🧪 Mobile testing (iOS Safari, Chrome Android)
- 🚀 Deploy to production

***

## 8. Critical Technical Decisions

### 8.1 Why Svelte over React?
**Decision:** Use Svelte 5 with Runes.

**Rationale:**
- React Three Fiber adds ~50ms overhead to render loop (Virtual DOM reconciliation)
- Svelte compiles to vanilla JavaScript (no runtime overhead)
- Runes (`$state`) are surgical updates (only affected nodes re-render)
- GSAP integration is simpler (no `useRef` wrestling)

### 8.2 Why Lenis over Native Scroll?
**Decision:** Use Lenis for smooth scrolling.

**Rationale:**
- Native scroll is **too fast** and **jerky** on desktop
- Lenis adds Apple-style momentum with configurable easing
- Still uses native scroll height (accessibility benefits)
- Only ~3KB gzipped

### 8.3 Why Separate Canvases?
**Decision:** Use 2 canvases (Tunnel vs Gallery).

**Rationale:**
- Running both simultaneously crashes mid-range GPUs (tested on 2020 laptops)
- Mount/unmount overhead is acceptable (~300ms, masked by fade)
- Cleaner code separation (Tunnel logic ≠ Gallery logic)

### 8.4 Why ScrollTrigger over Scroll Event?
**Decision:** Use GSAP ScrollTrigger for zone detection.

**Rationale:**
- ScrollTrigger uses IntersectionObserver (GPU-accelerated)
- Scroll events fire inconsistently (30-120 times/second)
- Declarative API is easier to maintain

***

## 9. Fallback Strategy (Non-WebGL)

For devices without WebGL support (<5% of users), provide a degraded experience:

```svelte
<!-- In +layout.svelte -->
<script>
  import { onMount } from 'svelte';
  let hasWebGL = false;
  
  onMount(() => {
    const canvas = document.createElement('canvas');
    hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  });
</script>

{#if hasWebGL}
  <!-- Full 3D experience -->
  <Canvas3D />
{:else}
  <!-- CSS-only fallback -->
  <div class="gradient-background">
    <!-- Static background with CSS gradients -->
  </div>
{/if}
```

***

## 10. Success Criteria

### 10.1 Technical
- [ ] 60 FPS on 2020+ laptops (verified via DevTools FPS meter)
- [ ] Lighthouse Performance score >85
- [ ] No console errors or warnings
- [ ] Works on iOS Safari, Chrome Android, Desktop Chrome/Firefox/Safari/Edge

### 10.2 User Experience
- [ ] Scroll feels "heavy" and "physical" (not floaty)
- [ ] No jitter during section transitions
- [ ] Gallery navigation is intuitive
- [ ] All text is readable (WCAG AA contrast)

### 10.3 Business
- [ ] Site goes viral on Twitter/Reddit (>1000 shares)
- [ ] Featured on Awwwards (Site of the Day candidate)
- [ ] Festival registrations increase 30% YoY

***

## 11. Maintenance & Extensibility

### 11.1 Adding a New Section
1. Create component in `src/lib/components/sections/NewSection.svelte`
2. Add ScrollTrigger zone setter
3. Add section to `+page.svelte` in correct order
4. Update `scrollState` type union if new zone
5. Test scroll flow

### 11.2 Modifying Camera Path
```typescript
// In Scene.svelte
const pathPoints = [
  new Vector3(0, 0, 0),      // Start (Hero)
  new Vector3(0, 0, -50),    // Tunnel
  new Vector3(0, 0, -100),   // Gallery
  new Vector3(0, 0, -150),   // Team
  new Vector3(0, 0, -200),   // Footer
];

const curve = new CatmullRomCurve3(pathPoints);
```

***

**END OF SPECIFICATION**

***

**Document Prepared By:** AI Technical Architect  
**Approved By:** [Project Lead Name]  
**Last Updated:** February 16, 2026