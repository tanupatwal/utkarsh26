# Gallery to Event Highlights Transition Research

**Date**: 2026-02-09
**Project**: UTKARSH 2026 - hasfilm

---

## Current State Summary

### Gallery Exit Sequence (Already Implemented)
Location: `src/components/sections/gallery/GalleryOverlay.tsx:53-103`

```
Progress 0-96%: Full dwell with all HUD elements visible
Progress 96-100%: Multi-phase exit:
  - Phase 1 (ep 0-0.45): Text fades, slides left, and blurs
  - Phase 2 (ep 0.45-0.60): Hold - text gone, HUD remains visible
  - Phase 3a (ep 0.60-0.75): Gradient scrim fades out
  - Phase 3b (ep 0.70-0.85): Progress bar slides down and fades
  - Phase 3c (ep 0.75-0.95): Dots slide right and fade (last to leave)
```

### Timeline Configuration
Location: `src/config/timeline.ts`

```typescript
export const TIMELINE = {
    HERO_END: 0.14,
    VOID_END: 0.28,
    TUNNEL_START: 0.28,
    TUNNEL_END: 0.56,
    ABOUT_START: 0.56,
    ABOUT_STAY: 0.72,
    TRANSITION: 0.86,
    GALLERY_START: 0.86,
    END: 1.0
}
```

### Key Components
- **GalleryGroup** (`src/components/sections/gallery/GalleryGroup.tsx`): Cylindrical 3D gallery with 5 curved panels
- **GalleryOverlay** (`src/components/sections/gallery/GalleryOverlay.tsx`): HUD with text, progress bar, pagination dots
- **ThickPanel** (`src/components/sections/gallery/ThickPanel.tsx`): Individual curved panel with 3D thickness
- **GalleryEffects** (`src/components/sections/gallery/GalleryEffects.tsx`): Post-processing effects

### Gallery Structure
- 5 media items (stored in `src/data/gallery.ts`)
- Cylindrical arrangement: 50-unit radius, 12-unit height
- 333-degree arc display (Math.PI * 0.8)
- Camera locks at final position (0, -2, 60)
- Ambient color system shifts based on focused panel

---

## Transition Options

### Option 1: Camera Pull-Back Reveal
**Style**: Subtle & Elegant

The camera slowly pulls back from the cylindrical gallery to reveal a new space behind/beyond it.

```
96-100%: HUD fades out (current behavior)
100-107%: Camera smoothly pulls back and rotates, gallery panels blur/fade
107%+: Event Highlights section revealed in the background
```

**Technique**:
- Extend scroll range (add `EVENT_HIGHLIGHTS_START` to timeline)
- Interpolate camera position using `lerpVectors` with smoothstep easing
- Add post-processing blur effect during transition
- Fade out gallery opacity progressively

**Pros**: Maintains 3D immersion, feels like natural continuation
**Cons**: More complex camera choreography required

---

### Option 2: Portal/Vortex Transition
**Style**: Thematic Continuity

Since there's already a tunnel earlier, create a subtle "dissolve into particles" effect where the gallery breaks apart and reforms into the Event Highlights.

```
96-100%: HUD fades
100-105%: Gallery edges glow, panels begin to shimmer
105-110%: Gallery explodes into light particles that reform as Event Highlights title
```

**Technique**:
- Use existing `Sparkles` and `GalleryEffects` system
- Scale up particle count temporarily
- Custom shader material for dissolve effect
- Color transition from gallery ambient to event highlights brand color

**Pros**: Visually impressive, connects to earlier tunnel theme
**Cons**: Performance-intensive, more complex shader work

---

### Option 3: Flat Fade with Parallax
**Style**: Cleanest & Most Performant

Simple crossfade where the 3D gallery fades to black/blur while HTML content fades in.

```
96-100%: HUD fades, gallery starts blurring
100-108%: Three.js scene fades to black, HTML Event Highlights fades in with parallax scroll
108%+: Full HTML Event Highlights section
```

**Technique**:
- CSS opacity transition on canvas element
- React-based HTML section with scroll-linked animations (similar to `FlatAboutSection.tsx`)
- Parallax background elements for depth
- Simple scroll-triggered reveal animations

**Pros**: Performance-friendly, reuses existing patterns, easy to iterate on content
**Cons**: Breaks 3D immersion, less visually dynamic

---

### Option 4: The "Unfolding" Transition
**Style**: Most Creative

The curved gallery panels physically flatten out to create a flat event highlights grid.

```
96-100%: HUD fades
100-110%: Panels animate from curved cylinder → flat grid layout
110%+: Gallery transforms into Event Highlights masonry grid
```

**Technique**:
- Modify `ThickPanel` curvature dynamically using GSAP or custom animation
- Or use Three.js `morphTarget` for smooth geometry transition
- Camera adjusts to maintain framing during unfold
- HTML content overlay appears on each "flattened" panel

**Pros**: Extremely creative, seamless 3D-to-2D transition, memorable
**Cons**: Most complex to implement, geometry animation challenges

---

### Option 5: Descending Elevator
**Style**: Vertical Movement

After the gallery exits, the camera descends (like an elevator) into an "Event Hall" below.

```
96-100%: HUD fades, camera position locked
100-110%: Camera smoothly descends (y-axis), gallery fades into ceiling reflection
110%+: Event Highlights revealed in the lower space
```

**Technique**:
- Camera y-position interpolation with easing
- Gallery opacity fades as it moves overhead
- Fog density increases to hide the transition
- Reflection/refraction effects for ceiling passing
- New 3D space revealed below or HTML section fades in

**Pros**: Feels grand and ceremonial, good sense of scale
**Cons**: Requires additional 3D assets or careful fade timing

---

### Option 6: The Spotlight Focus
**Style**: Dramatic

Gallery dims to black, except one spotlight remains, which expands to reveal Event Highlights.

```
96-100%: HUD fades, ambient lights dim
100-108%: Vignette effect tightens to center, then expands with new content
108%+: Event Highlights fills the screen from center out
```

**Technique**:
- Custom post-processing vignette shader
- Combined with CSS radial gradient overlay
- Light intensity animation on point lights
- Center-out reveal animation for new content

**Pros**: Theatrical and dramatic, focuses attention
**Cons**: Shader complexity, may feel abrupt if not tuned well

---

## Comparison Table

| Option | Complexity | Performance | Visual Impact | 3D Continuity |
|--------|-----------|-------------|---------------|---------------|
| 1. Camera Pull-Back | Medium | Good | Medium | Yes |
| 2. Portal/Vortex | High | Medium | High | Yes |
| 3. Flat Fade | Low | Excellent | Low-Medium | No |
| 4. Unfolding | Very High | Medium | Very High | Yes |
| 5. Descending | Medium | Good | High | Yes |
| 6. Spotlight | Medium | Good | Medium | Partial |

---

## Recommended Approach

### Primary Recommendation: Option 3 (Flat Fade with Parallax)

**Rationale**:
- Most aligned with existing code patterns (similar to About section)
- Performance-friendly - no heavy 3D during transition
- Easy to iterate on Event Highlights content
- Maintains scroll-driven animation consistency
- "Simply subtle" as requested

**Implementation Plan**:

1. **Extend Timeline** (`src/config/timeline.ts`):
   ```typescript
   GALLERY_START: 0.86,
   EVENT_HIGHLIGHTS_START: 1.0,
   EVENT_HIGHLIGHTS_END: 1.12,
   END: 1.15
   ```

2. **Modify `GalleryGroup.tsx`**:
   - Add fade-out at the end (opacity 1→0 during 0.96-1.0)
   - Or increase fog density to hide gallery

3. **Modify `GalleryOverlay.tsx`**:
   - Already handles HUD exit, ensure timing aligns

4. **Create `EventHighlightsSection.tsx`**:
   - Flat HTML component (like `FlatAboutSection.tsx`)
   - Placeholder cards/grid layout
   - Scroll-triggered reveal animations
   - Parallax background elements

5. **Update Scroll Config** (`src/config/scroll.ts`):
   - Extend `PAGES` from 8 to ~9.5

---

## Alternative Recommendations

### For More Visual Impact: Option 1 (Camera Pull-Back)
If you want to maintain 3D immersion while keeping it relatively simple.

### For Maximum Creativity: Option 4 (Unfolding)
If you want something truly memorable and have time for complex implementation.

---

## Next Steps

1. Choose transition approach
2. Define Event Highlights content structure
3. Implement timeline extension
4. Build transition animations
5. Create Event Highlights placeholder content
6. Test and refine timing
