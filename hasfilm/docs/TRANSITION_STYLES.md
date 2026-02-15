# Transition Styles Exploration

This document outlines the 4 transition styles being explored for the Hero to Gallery journey in the UTKARSH 2026 experience.

## Overview

The transition from Hero to Spiral Gallery is a critical moment in the user journey. We're exploring multiple Awwwards-level approaches to create an immersive "diving into" sensation.

---

## 1. Wormhole Vortex ✅ (CURRENT)

**Status:** Implemented on branch `transition/wormhole-vortex`
**Branch:** `transition/wormhole-vortex`

### Concept
The hero overlay transforms into a swirling vortex/portal that pulls the viewer through into the tunnel section. As the user scrolls, concentric rings expand from the title, particles spiral inward, and the camera zooms to create a sense of diving through a portal.

### Visual Elements
- **Expanding concentric rings** - 5 rings with varying rotation speeds (SVG-based in overlay, THREE.js rings in 3D)
- **Spiral particle effects** - 200 instanced particles spiraling toward viewer
- **Title break-apart** - Text shatters with blur, glow intensification, and skew distortion
- **Camera zoom** - Simulated FOV change through scale transformation
- **Color shift**: Gold → Cyan → Purple during transition

### Technical Implementation

**Files:**
- `src/components/transitions/WormholeVortex.tsx` - Main 3D vortex component
- `src/components/overlays/HeroOverlay.tsx` - Title animation integration
- `src/components/overlays/AnimatedBackground.tsx` - Swirl overlay effect
- `src/components/sections/tunnel/TunnelGroup.tsx` - Vortex entry matching
- `src/config/timeline.ts` - VORTEX_* timeline constants

**Libraries:**
- GSAP for timeline management
- THREE.js instanced meshes for particles
- CSS transforms for overlay effects

**Scroll Timeline:**
```
0.00 - 0.02: Hero static
0.02 - 0.05: Vortex forms (rings expand, rotation accelerates)
0.05 - 0.08: Maximum intensity (camera zoom, particles accelerate)
0.08 - 0.12: Suck-through effect (elements pull toward camera)
0.12 - 0.15: Vortex fades, tunnel emerges
0.15 - 0.20: Tunnel takes over completely
```

### Performance
- Instanced rendering for 200 particles
- GPU-accelerated CSS transforms
- Frame-based updates via `useFrame()`

---

## 2. Ethereal Cascade (Planned)

**Status:** Not started
**Branch:** `transition/ethereal-cascade` (to be created)

### Concept
Hero content dissolves into falling particles that cascade downward like a waterfall, revealing the gallery below. The particles flow with gravity-based physics, creating a dreamy, ethereal transition.

### Visual Elements
- **Particle explosion** - Hero elements break into thousands of particles
- **Gravity-based physics** - Particles fall with realistic acceleration
- **Trail effects** - Particles leave fading trails as they fall
- **Color gradients** - Particles shift through brand colors as they fall
- **Smooth camera descent** - Camera follows particles downward

### Technical Approach
- THREE.js particle system with velocity simulation
- Custom shader for trail effects
- Perlin noise for natural particle movement

---

## 3. Dimensional Shatter (Planned)

**Status:** Not started
**Branch:** `transition/dimensional-shatter` (to be created)

### Concept
The hero screen "shatters" like glass, with fragments flying outward in 3D space to reveal the gallery. Each fragment is a reflective piece of the original hero content.

### Visual Elements
- **Voronoi fracture pattern** - Natural-looking glass shards
- **Reflective shard materials** - Environment mapping on each piece
- **Physics-based movement** - Shards spin and fly outward
- **Dramatic lighting changes** - Light catches shards as they fly
- **Slow-motion reveal** - Time-slowed effect for impact

### Technical Approach
- THREE.js Voronoi fracture algorithm
- Custom shaders for reflection/refraction
- Physics engine (cannon.js or ammo.js) for shard movement

---

## 4. Quantum Tunnel (Planned)

**Status:** Not started
**Branch:** `transition/quantum-tunnel` (to be created)

### Concept
Hero elements quantum-tunnel through space, appearing and disappearing while reforming into the gallery. Based on quantum uncertainty principles with glitch effects.

### Visual Elements
- **Glitch effects** - Random displacement and color splitting
- **Chromatic aberration** - RGB channel separation
- **Teleportation animations** - Elements disappear and reappear
- **Uncertainty visualizations** - Probability cloud effects
- **Quantum noise** - Static and interference patterns

### Technical Approach
- Post-processing shaders for glitch
- Custom fragment shaders for chromatic aberration
- Randomized visibility toggles synced with scroll

---

## Selection Criteria

When evaluating each transition style, consider:

1. **Visual Impact** - Does it feel Awwwards-level?
2. **Performance** - Can it maintain 60 FPS?
3. **Accessibility** - Is it motion-safe?
4. **Brand Alignment** - Does it fit UTKARSH's aesthetic?
5. **Technical Complexity** - Is it maintainable?

---

## Implementation Notes

### Switching Between Styles

Each transition style is implemented on its own git branch:

```bash
# View wormhole vortex (current)
git checkout transition/wormhole-vortex

# After implementing ethereal cascade
git checkout transition/ethereal-cascade

# And so on...
```

### Shared Components

These components are shared across all transition styles:
- `src/config/timeline.ts` - Timeline configuration
- `src/components/overlays/HeroOverlay.tsx` - Hero content
- `src/components/overlays/AnimatedBackground.tsx` - Background
- `src/components/sections/tunnel/TunnelGroup.tsx` - Tunnel

Each transition style modifies how these components interact.

---

## Next Steps

1. Review `transition/wormhole-vortex` branch
2. Provide feedback and iterations
3. Decide: proceed with wormhole vortex or try next style
4. Repeat for remaining styles
5. Final selection and polish
