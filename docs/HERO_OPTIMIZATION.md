# Hero Background & Animation Optimization Guide

## Image Optimization Implementation

### Automated WebP Conversion

Next.js automatically converts images to WebP/AVIF format with the following configuration:

**Configuration** (`next.config.ts`):

- **Formats**: WebP + AVIF for maximum compatibility and compression
- **Quality**: 75% default (configurable per image via `quality` prop)
- **Responsive Sizes**:
  - Mobile: 640px, 750px, 828px
  - Tablet: 1080px, 1200px
  - Desktop: 1920px, 2048px
  - 4K: 3840px

### Manual WebP Conversion (Optional)

If you want to pre-convert images manually for further optimization:

#### Using Sharp (Node.js)

```bash
npm install sharp-cli -g
sharp --input public/assets/hero-bg-4k-source.png --output public/assets/hero-bg-1080p.webp --resize 1920,1080 --quality 75
sharp --input public/assets/hero-bg-4k-source.png --output public/assets/hero-bg-2k.webp --resize 2560,1440 --quality 75
sharp --input public/assets/hero-bg-4k-source.png --output public/assets/hero-bg-4k.webp --resize 3840,2160 --quality 80
```

#### Using Squoosh CLI

```bash
npm install @squoosh/cli -g
squoosh-cli --webp '{\"quality\":75}' --resize '{\"width\":1920}' -d public/assets public/assets/hero-bg-4k-source.png
```

#### Online Tools

- **Squoosh.app**: https://squoosh.app (drag & drop, quality 70-80)
- **TinyPNG**: https://tinypng.com (automatic optimization)

## Current Implementation

### ✅ Image Optimization

- **Format**: PNG source → Next.js auto-converts to WebP/AVIF
- **Quality**: 80% for optimal balance
- **Responsive**: Automatic srcset generation via `sizes="100vw"`
- **Loading**: Priority loading with `priority` flag
- **Natural Resolution**: `object-cover` prevents upscaling beyond source

### ✅ Animations Implemented

#### 1. Split Reveal (400-600ms)

- Left mandala: Slides in from -5% to 0%
- Right circuit: Slides in from +5% to 0%
- Timing: 500ms ease-out with 200ms delay
- **Non-congesting**: Runs once on page load

#### 2. Title Glow Pulse (3.5s)

- Slow pulsing glow effect on "UTKARSH" title
- Animates from subtle (12px shadow) to enhanced (24px + cyan accent)
- **Non-congesting**: Slow 3.5s cycle, smooth ease-in-out

#### 3. Micro-Particles (Subtle)

- **Count**: 6 particles total (3 heritage gold + 3 tech cyan)
- **Opacity**: Max 0.4 (reduced from 0.6-0.8)
- **Duration**: 6-9 seconds per cycle (very slow)
- **Size**: 2-7px (small and unobtrusive)
- **Non-congesting**: Low frequency, low opacity, minimal movement

#### 4. Scroll Parallax (10-15%)

- Background moves 12% slower than content
- Uses Framer Motion `useScroll` + `useTransform`
- GPU-accelerated via `transform: translateY()`
- **Non-congesting**: Subtle depth effect without motion sickness

### ✅ Visual Decluttering

#### Spacing Improvements

- Title bottom margin: `mb-6` → `mb-12` (2x breathing room)
- Subtitle margin: `mb-10` → `mb-12` (consistent spacing)
- Decorative line positioned with proper spacing

#### Shadow Reduction

- Heritage button: `0 0 20px` → `0 0 12px` (40% reduction)
- Tech button: `0 0 20px` → `0 0 10px` (50% reduction)
- Custom Tailwind utilities: `shadow-heritage-subtle`, `shadow-tech-subtle`

#### Background Pattern Balance

- Reduced mandala/circuit overlay opacity
- Increased central blend area from 10% to 6% width
- Softer blur (30px) for seamless transition

## Performance Metrics

### Expected Results

- **Image Size**:
  - Original PNG: ~1.1MB
  - Next.js WebP @ 1080p: ~200-300KB (73% reduction)
  - Next.js WebP @ 4K: ~600-800KB
- **Load Time**: <1s on 4G connection
- **FPS**: Consistent 60fps during all animations
- **Lighthouse**: Performance score >90

### Testing Commands

```bash
# Build production bundle to test optimization
npm run build

# Start production server
npm start
```

## Browser DevTools Verification

### Network Tab

1. Open DevTools → Network → Img filter
2. Refresh page
3. Check that images are served as WebP/AVIF
4. Verify appropriate size is loaded for viewport width

### Performance Tab

1. Record 5-second interaction
2. Check FPS stays at 60
3. Verify no layout shifts (CLS = 0)
4. CPU usage should be <30%

### Responsive Testing

Test on different viewport widths:

- Mobile: 375px (should load ~750w image)
- Tablet: 768px (should load ~1200w image)
- Desktop: 1920px (should load ~1920w image)
- 4K: 3840px (should load ~3840w image)

## Summary

All optimization checklist items have been implemented:

✅ **Image Optimization**

- 4K source generated and integrated
- Next.js auto-conversion to WebP/AVIF @ quality 75-80
- Responsive srcset with 8 size breakpoints
- `background-size: cover; background-position: center;`

✅ **Animations (Non-congesting)**

- Split reveal: 500ms subtle slide-in
- Title glow: 3.5s slow pulse
- Micro-particles: 6 total, low opacity, 6-9s duration
- Scroll parallax: 12% slower background

✅ **Visual Decluttering**

- Increased title spacing (2x breathing room)
- Reduced button shadows (40-50%)
- Optimized pattern balance
- Single unified particle layer
