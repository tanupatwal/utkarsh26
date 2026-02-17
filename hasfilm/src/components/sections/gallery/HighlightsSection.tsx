import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG, TIMELINE } from '../../../config';
import { HIGHLIGHTS_CONTENT } from '../../../data';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

type DepthLayer = 'foreground' | 'middle' | 'background';
type SizeClass = 'hero' | 'medium' | 'small' | 'tiny';

// Layer visual config
const LAYER_CONFIG = {
    foreground: { mouseRange: 15, blur: 0, baseBrightness: 0.92, speed: 1.0 },
    middle: { mouseRange: 12, blur: 0, baseBrightness: 0.8, speed: 0.7 },
    background: { mouseRange: 8, blur: 2, baseBrightness: 0.62, speed: 0.45 },
} as const;

// Size config — dimensions in vw/vh
const SIZE_CONFIG: Record<SizeClass, { minW: number; maxW: number; aspect: [number, number][] }> = {
    hero: { minW: 22, maxW: 30, aspect: [[16, 10], [4, 3], [3, 2]] },
    medium: { minW: 14, maxW: 20, aspect: [[16, 9], [4, 3], [3, 4]] },
    small: { minW: 8, maxW: 13, aspect: [[16, 9], [1, 1], [3, 4]] },
    tiny: { minW: 5, maxW: 8, aspect: [[1, 1], [4, 3], [16, 9]] },
};

// Size distribution weights
const SIZE_WEIGHTS: { size: SizeClass; weight: number }[] = [
    { size: 'hero', weight: 0.08 },
    { size: 'medium', weight: 0.25 },
    { size: 'small', weight: 0.40 },
    { size: 'tiny', weight: 0.27 },
];

// Layer distribution weights
const LAYER_WEIGHTS: { layer: DepthLayer; weight: number }[] = [
    { layer: 'foreground', weight: 0.25 },
    { layer: 'middle', weight: 0.40 },
    { layer: 'background', weight: 0.35 },
];

// Spawning config
const MAX_ACTIVE_IMAGES = 35;          // max on screen at once
const SPAWN_INTERVAL_MIN = 0.4;        // seconds between spawns (fastest)
const SPAWN_INTERVAL_MAX = 1.0;        // seconds between spawns (slowest)
const BASE_TRAVEL_SPEED = 22;          // px/s base speed — gentle drift
const FADE_IN_DURATION = 1.2;          // seconds to fade in
const CENTER_SCALE_BOOST = 0.35;       // max extra scale at center (1.0 + this)


// Movement direction — slight diagonal drift
const FLOW_ANGLE = -0.3; // radians, roughly upper-left to lower-right
const FLOW_DX = Math.cos(FLOW_ANGLE);
const FLOW_DY = Math.sin(FLOW_ANGLE);

// ════════════════════════════════════════════════
//  SPAWNED IMAGE STATE
// ════════════════════════════════════════════════

interface SpawnedImage {
    id: number;
    imageIndex: number;  // index into HIGHLIGHTS_CONTENT
    sizeClass: SizeClass;
    layer: DepthLayer;
    widthVw: number;
    heightUnit: string;  // 'vw' or 'vh'
    heightVal: number;
    // Spawn position (px)
    startX: number;
    startY: number;
    // Velocity (px/s)
    vx: number;
    vy: number;
    // Timing
    spawnTime: number;
    opacity: number;
    // Z sorting
    zIndex: number;
}

function pickWeighted<T>(items: { weight: number }[] & T[]): T {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of items) {
        r -= item.weight;
        if (r <= 0) return item;
    }
    return items[items.length - 1]!;
}

function createSpawnedImage(
    id: number, time: number, vw: number, vh: number,
    usedIndices?: Set<number>,
    activeImages?: SpawnedImage[],
): SpawnedImage {
    // Pick random image not already on screen
    let imageIndex: number;
    if (usedIndices && usedIndices.size < HIGHLIGHTS_CONTENT.length) {
        const available: number[] = [];
        for (let i = 0; i < HIGHLIGHTS_CONTENT.length; i++) {
            if (!usedIndices.has(i)) available.push(i);
        }
        imageIndex = available[Math.floor(Math.random() * available.length)]!;
    } else {
        imageIndex = Math.floor(Math.random() * HIGHLIGHTS_CONTENT.length);
    }

    // Pick size & layer with weighted distribution
    const sizeEntry = pickWeighted(SIZE_WEIGHTS as any) as typeof SIZE_WEIGHTS[number];
    const layerEntry = pickWeighted(LAYER_WEIGHTS as any) as typeof LAYER_WEIGHTS[number];
    const sizeClass = sizeEntry.size;
    const layer = layerEntry.layer;

    // Calculate dimensions
    const cfg = SIZE_CONFIG[sizeClass];
    const widthVw = cfg.minW + Math.random() * (cfg.maxW - cfg.minW);
    const aspectPair = cfg.aspect[Math.floor(Math.random() * cfg.aspect.length)]!;
    const aspectRatio = aspectPair[0] / aspectPair[1];

    // Height relative to width
    const widthPx = (widthVw / 100) * vw;
    const heightPx = widthPx / aspectRatio;
    const heightVal = (heightPx / vh) * 100;

    // Speed varies by layer
    const layerCfg = LAYER_CONFIG[layer];
    const speed = BASE_TRAVEL_SPEED * layerCfg.speed * (0.7 + Math.random() * 0.6);

    // ── Density-aware edge selection ──
    // Count images near each edge to find sparse areas
    // 0=left, 1=right, 2=top, 3=bottom
    const edgeCounts = [0, 0, 0, 0]; // how many images are near each edge
    if (activeImages && activeImages.length > 0) {
        const edgeZone = 0.3; // 30% from each edge counts as "near that edge"
        for (const img of activeImages) {
            const age = time - img.spawnTime;
            const ix = img.startX + img.vx * age;
            const iy = img.startY + img.vy * age;
            const nx = ix / (vw || 1); // normalize 0..1
            const ny = iy / (vh || 1);
            if (nx < edgeZone) edgeCounts[0] = (edgeCounts[0] ?? 0) + 1;
            if (nx > 1 - edgeZone) edgeCounts[1] = (edgeCounts[1] ?? 0) + 1;
            if (ny < edgeZone) edgeCounts[2] = (edgeCounts[2] ?? 0) + 1;
            if (ny > 1 - edgeZone) edgeCounts[3] = (edgeCounts[3] ?? 0) + 1;
        }
    }
    // Weight: fewer images near an edge = higher weight (inverse density)
    const baseWeight = 1;
    const edgeWeights = edgeCounts.map(c => baseWeight + Math.max(0, 5 - c)); // sparse edges get up to 5 extra weight
    const totalWeight = edgeWeights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let edge = 0;
    for (let i = 0; i < edgeWeights.length; i++) {
        roll -= edgeWeights[i]!;
        if (roll <= 0) { edge = i; break; }
    }

    let startX: number, startY: number, vx: number, vy: number;
    const margin = Math.max(widthPx, heightPx) + 50;

    switch (edge) {
        case 0: // Enter from left
            startX = -margin;
            startY = Math.random() * vh;
            vx = speed * (0.8 + Math.random() * 0.4);
            vy = speed * (Math.random() - 0.5) * 0.3;
            break;
        case 1: // Enter from right
            startX = vw + margin;
            startY = Math.random() * vh;
            vx = -speed * (0.8 + Math.random() * 0.4);
            vy = speed * (Math.random() - 0.5) * 0.3;
            break;
        case 2: // Enter from top
            startX = Math.random() * vw;
            startY = -margin;
            vx = speed * (Math.random() - 0.5) * 0.3;
            vy = speed * (0.8 + Math.random() * 0.4);
            break;
        default: // Enter from bottom
            startX = Math.random() * vw;
            startY = vh + margin;
            vx = speed * (Math.random() - 0.5) * 0.3;
            vy = -speed * (0.8 + Math.random() * 0.4);
            break;
    }

    // Add global drift bias
    vx += FLOW_DX * speed * 0.2;
    vy += FLOW_DY * speed * 0.2;

    // Z-index by layer
    const baseZ = layer === 'foreground' ? 10 : layer === 'middle' ? 5 : 2;
    const zIndex = baseZ + Math.floor(Math.random() * 3);

    return {
        id,
        imageIndex,
        sizeClass,
        layer,
        widthVw,
        heightUnit: 'vh',
        heightVal,
        startX,
        startY,
        vx,
        vy,
        spawnTime: time,
        opacity: 0,
        zIndex,
    };
}

// Pre-populate images near the edges — as if they just entered
const INITIAL_IMAGE_COUNT = 18;
function createInitialImages(): SpawnedImage[] {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const images: SpawnedImage[] = [];

    for (let i = 0; i < INITIAL_IMAGE_COUNT; i++) {
        const usedIndices = new Set(images.map(img => img.imageIndex));
        const img = createSpawnedImage(i, 0, vw, vh, usedIndices);
        // Place near edges (10-30% inward from whichever edge they spawned from)
        const edgeBias = 0.05 + Math.random() * 0.10; // 5-15% inward
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Near left edge
                img.startX = vw * edgeBias;
                img.startY = Math.random() * vh;
                break;
            case 1: // Near right edge
                img.startX = vw * (1 - edgeBias);
                img.startY = Math.random() * vh;
                break;
            case 2: // Near top edge
                img.startX = Math.random() * vw;
                img.startY = vh * edgeBias;
                break;
            default: // Near bottom edge
                img.startX = Math.random() * vw;
                img.startY = vh * (1 - edgeBias);
                break;
        }
        // Already faded in
        img.spawnTime = -(FADE_IN_DURATION + 1);
        img.opacity = 1;
        images.push(img);
    }
    return images;
}

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const HighlightsSection: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    const bgOpacityRef = useRef(0);
    const titleOpacityRef = useRef(0);
    const galleryOpacityRef = useRef(0);

    // Auto-sink timer: starts counting once dark backdrop is fully visible
    const autoSinkTimerRef = useRef(0);
    const autoSinkActiveRef = useRef(false);

    // Mouse position (normalized -1 to 1, lerped)
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmoothed = useRef({ x: 0, y: 0 });

    // Hovered image id
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const hoveredRef = useRef<number | null>(null);

    // Elapsed time
    const timeRef = useRef(0);

    // Spawning state — pre-populated with images already on screen
    const nextIdRef = useRef(INITIAL_IMAGE_COUNT);
    const spawnTimerRef = useRef(0);
    const nextSpawnDelayRef = useRef(0.3);
    const [initialImages] = useState(() => createInitialImages());
    const activeImagesRef = useRef<SpawnedImage[]>(initialImages);
    const [renderImages, setRenderImages] = useState<SpawnedImage[]>(initialImages);
    const renderUpdateTimerRef = useRef(0);

    // Track if gallery is visible
    const isVisibleRef = useRef(false);

    // Mouse tracking
    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    const handleMouseEnter = useCallback((id: number) => {
        setHoveredId(id);
        hoveredRef.current = id;
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredId(null);
        hoveredRef.current = null;
    }, []);

    // Phase boundaries (spread for Pin-Dwell-Release pattern)
    const DARK_START = TIMELINE.HIGHLIGHTS_DARK_START;
    const DARK_FULL = TIMELINE.HIGHLIGHTS_DARK_FULL;

    // Gravity drain phase — images fall downward
    const GRAVITY_START = TIMELINE.HIGHLIGHTS_GRAVITY_START;
    const GRAVITY_END = TIMELINE.HIGHLIGHTS_END;

    // Per-layer gravity delay (foreground falls first — closest/heaviest)
    const LAYER_GRAVITY_DELAY: Record<DepthLayer, number> = {
        foreground: 0.0,
        middle: 0.12,
        background: 0.25,
    };

    // Gravity progress ref
    const gravityProgressRef = useRef(0);

    // Per-image gravity offset (accumulated downward pull)
    const gravityPosRef = useRef<Map<number, { dy: number; vy: number }>>(new Map());

    // Auto-sink timing (seconds after backdrop is full) — used as FALLBACK
    // but scroll position is PRIMARY driver now
    const TITLE_FADE_IN_END = 0.8;    // title fully visible at 0.8s
    const TITLE_HOLD_END = 2.2;       // title stays visible until 2.2s
    const TITLE_FADE_OUT_END = 3.0;   // title fully gone by 3.0s
    const GALLERY_FADE_START = 2.0;   // gallery starts appearing at 2.0s
    const GALLERY_FADE_END = 3.2;     // gallery fully visible by 3.2s

    // Scroll-based sub-phases within highlights visible range
    const SCROLL_TITLE_IN_START = TIMELINE.HIGHLIGHTS_TITLE_IN;
    const SCROLL_TITLE_IN_END = TIMELINE.HIGHLIGHTS_TITLE_VISIBLE;
    const SCROLL_TITLE_HOLD_END = TIMELINE.HIGHLIGHTS_TITLE_HOLD;
    const SCROLL_TITLE_OUT_END = TIMELINE.HIGHLIGHTS_TITLE_OUT;
    const SCROLL_GALLERY_START = TIMELINE.HIGHLIGHTS_GALLERY_START;
    const SCROLL_GALLERY_FULL = TIMELINE.HIGHLIGHTS_GALLERY_FULL;

    // fast DOM lookup
    const domMapRef = useRef<Map<number, HTMLDivElement>>(new Map());

    useFrame((_state, delta) => {
        if (!containerRef.current) return;

        const r = scroll.offset;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;

        // ── Dark backdrop ── (fades in during start→full, fades out during BG_FADE_OUT range)
        const BG_FADE_OUT_START = TIMELINE.HIGHLIGHTS_BG_FADE_OUT_START;
        const BG_FADE_OUT_END = TIMELINE.HIGHLIGHTS_END;

        let bgTarget = 0;
        if (r >= DARK_START && r < DARK_FULL) {
            bgTarget = (r - DARK_START) / (DARK_FULL - DARK_START);
        } else if (r >= DARK_FULL && r < BG_FADE_OUT_START) {
            bgTarget = 1;
        } else if (r >= BG_FADE_OUT_START && r < BG_FADE_OUT_END) {
            bgTarget = 1 - (r - BG_FADE_OUT_START) / (BG_FADE_OUT_END - BG_FADE_OUT_START);
        } else if (r >= BG_FADE_OUT_END) {
            bgTarget = 0;
        }
        bgOpacityRef.current = THREE.MathUtils.damp(bgOpacityRef.current, bgTarget, 4, delta);
        containerRef.current.style.opacity = bgOpacityRef.current.toString();

        if (bgOpacityRef.current < 0.01) {
            isVisibleRef.current = false;
            autoSinkTimerRef.current = 0;
            autoSinkActiveRef.current = false;
            return;
        }

        // ── Auto-sink timer: still counts for time-based fallback ──
        if (r >= DARK_FULL) {
            if (!autoSinkActiveRef.current) {
                autoSinkActiveRef.current = true;
                autoSinkTimerRef.current = 0;
            }
            autoSinkTimerRef.current += delta;
        }
        const ast = autoSinkTimerRef.current;

        // ── Title — SCROLL-BASED with time-based fallback ──
        if (titleRef.current) {
            // Scroll-based title opacity
            let scrollTitleTarget = 0;
            if (r >= SCROLL_TITLE_IN_START && r < SCROLL_TITLE_IN_END) {
                scrollTitleTarget = (r - SCROLL_TITLE_IN_START) / (SCROLL_TITLE_IN_END - SCROLL_TITLE_IN_START);
            } else if (r >= SCROLL_TITLE_IN_END && r < SCROLL_TITLE_HOLD_END) {
                scrollTitleTarget = 1;
            } else if (r >= SCROLL_TITLE_HOLD_END && r < SCROLL_TITLE_OUT_END) {
                scrollTitleTarget = 1 - (r - SCROLL_TITLE_HOLD_END) / (SCROLL_TITLE_OUT_END - SCROLL_TITLE_HOLD_END);
            }
            // Past SCROLL_TITLE_OUT_END: scrollTitleTarget stays 0

            // Time-based fallback
            let timeTitleTarget = 0;
            if (ast < TITLE_FADE_IN_END) {
                timeTitleTarget = ast / TITLE_FADE_IN_END;
            } else if (ast < TITLE_HOLD_END) {
                timeTitleTarget = 1;
            } else if (ast < TITLE_FADE_OUT_END) {
                timeTitleTarget = 1 - (ast - TITLE_HOLD_END) / (TITLE_FADE_OUT_END - TITLE_HOLD_END);
            }

            // When scroll says "fade out" (past hold), scroll position wins.
            // Time-based only helps during the initial reveal.
            const pastScrollHold = r >= SCROLL_TITLE_HOLD_END;
            const titleTarget = pastScrollHold
                ? scrollTitleTarget  // scroll is authoritative for fade-out
                : Math.max(scrollTitleTarget, timeTitleTarget);

            titleOpacityRef.current = THREE.MathUtils.damp(titleOpacityRef.current, titleTarget, 5, delta);
            titleRef.current.style.opacity = titleOpacityRef.current.toString();
        }

        // ── Gallery visibility — SCROLL-BASED with time-based fallback ──
        if (galleryRef.current) {
            // Scroll-based gallery opacity (with fade-out before Schedule)
            const GAL_FADE_OUT_START = TIMELINE.HIGHLIGHTS_BG_FADE_OUT_START;
            const GAL_FADE_OUT_END = TIMELINE.HIGHLIGHTS_END;

            let scrollGalTarget = 0;
            if (r >= SCROLL_GALLERY_START && r < SCROLL_GALLERY_FULL) {
                scrollGalTarget = (r - SCROLL_GALLERY_START) / (SCROLL_GALLERY_FULL - SCROLL_GALLERY_START);
            } else if (r >= SCROLL_GALLERY_FULL && r < GAL_FADE_OUT_START) {
                scrollGalTarget = 1;
            } else if (r >= GAL_FADE_OUT_START && r < GAL_FADE_OUT_END) {
                scrollGalTarget = 1 - (r - GAL_FADE_OUT_START) / (GAL_FADE_OUT_END - GAL_FADE_OUT_START);
            }
            // Past GAL_FADE_OUT_END: scrollGalTarget stays 0

            // Time-based fallback
            let timeGalTarget = 0;
            if (ast >= GALLERY_FADE_START) {
                timeGalTarget = Math.min(1, (ast - GALLERY_FADE_START) / (GALLERY_FADE_END - GALLERY_FADE_START));
            }

            // When scroll says "fade out", scroll wins
            const pastGalHold = r >= GAL_FADE_OUT_START;
            const galTarget = pastGalHold
                ? scrollGalTarget
                : Math.max(scrollGalTarget, timeGalTarget);

            galleryOpacityRef.current = THREE.MathUtils.damp(galleryOpacityRef.current, galTarget, 3, delta);
            galleryRef.current.style.opacity = galleryOpacityRef.current.toString();
        }

        if (galleryOpacityRef.current < 0.01 && titleOpacityRef.current < 0.01) {
            isVisibleRef.current = false;
            return;
        }

        isVisibleRef.current = true;

        // ── Accumulate time ──
        timeRef.current += delta;
        const t = timeRef.current;

        // ── Lerp mouse ──
        mouseSmoothed.current.x = THREE.MathUtils.damp(
            mouseSmoothed.current.x, mouseTarget.current.x, 0.6, delta
        );
        mouseSmoothed.current.y = THREE.MathUtils.damp(
            mouseSmoothed.current.y, mouseTarget.current.y, 0.6, delta
        );

        // ── Gravity drain phase calculation ──
        const isDraining = r >= GRAVITY_START;
        let globalGravityT = 0;
        if (r >= GRAVITY_START && r <= GRAVITY_END) {
            globalGravityT = (r - GRAVITY_START) / (GRAVITY_END - GRAVITY_START);
        } else if (r > GRAVITY_END) {
            globalGravityT = 1;
        }
        gravityProgressRef.current = globalGravityT;

        // ── Spawn new images (stop during gravity drain) ──
        if (!isDraining) {
            spawnTimerRef.current += delta;
            if (spawnTimerRef.current >= nextSpawnDelayRef.current && activeImagesRef.current.length < MAX_ACTIVE_IMAGES) {
                spawnTimerRef.current = 0;
                nextSpawnDelayRef.current = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

                const usedIndices = new Set(activeImagesRef.current.map(img => img.imageIndex));
                const newImg = createSpawnedImage(nextIdRef.current++, t, vw, vh, usedIndices, activeImagesRef.current);
                activeImagesRef.current.push(newImg);
            }
        }

        // ── Update active images & cull dead ones ──
        const surviving: SpawnedImage[] = [];

        for (const img of activeImagesRef.current) {
            const age = t - img.spawnTime;

            // Normal position
            const baseX = img.startX + img.vx * age;
            const baseY = img.startY + img.vy * age;

            // Check if image has left the viewport entirely
            const imgWidthPx = (img.widthVw / 100) * vw;
            const imgHeightPx = (img.heightVal / 100) * vh;
            const margin = Math.max(imgWidthPx, imgHeightPx) + 100;

            const isOffScreen = baseX < -margin || baseX > vw + margin || baseY < -margin || baseY > vh + margin;

            // Don't cull during gravity drain
            if (!isDraining && age > 2 && isOffScreen) {
                domMapRef.current.delete(img.id);
                gravityPosRef.current.delete(img.id);
                continue;
            }

            // Fade in (normal phase)
            img.opacity = Math.min(1, age / FADE_IN_DURATION);

            surviving.push(img);

            // ── Update DOM elements directly for performance ──
            const el = domMapRef.current.get(img.id);
            if (el) {
                const layerCfg = LAYER_CONFIG[img.layer];

                // Mouse parallax (reduce during gravity)
                const parallaxMult = isDraining ? Math.max(0, 1 - globalGravityT * 2) : 1;
                const mouseOffX = mouseSmoothed.current.x * layerCfg.mouseRange * parallaxMult;
                const mouseOffY = mouseSmoothed.current.y * layerCfg.mouseRange * 0.7 * parallaxMult;

                let finalX = baseX + mouseOffX;
                let finalY = baseY + mouseOffY;

                // ── Distance-from-center scale (normal) ──
                const centerX = vw / 2;
                const centerY = vh / 2;
                const dx = (finalX - centerX) / centerX;
                const dy = (finalY - centerY) / centerY;
                const distFromCenter = Math.min(1, Math.sqrt(dx * dx + dy * dy));
                let scaleX = 1 + CENTER_SCALE_BOOST * (1 - distFromCenter * distFromCenter);
                let scaleY = scaleX;

                // ── Gravity drain: images fall downward ──
                if (isDraining) {
                    const layerDelay = LAYER_GRAVITY_DELAY[img.layer];
                    const imgGravityRaw = (globalGravityT - layerDelay) / (1 - layerDelay);
                    const imgGravityT = Math.max(0, Math.min(1, imgGravityRaw));

                    // Quadratic acceleration (like real gravity: d = ½ g t²)
                    const fallStrength = imgGravityT * imgGravityT;

                    // Get or init gravity state
                    if (!gravityPosRef.current.has(img.id)) {
                        gravityPosRef.current.set(img.id, { dy: 0, vy: 0 });
                    }
                    const gpos = gravityPosRef.current.get(img.id)!;

                    // Gravity acceleration (pixels)
                    const gravity = vh * 2.5; // 2.5x viewport height acceleration
                    gpos.vy += gravity * fallStrength * delta;
                    gpos.dy += gpos.vy * delta;

                    finalY += gpos.dy;

                    // Slight horizontal drift toward center as images fall
                    const toCenterX = (centerX - finalX) * fallStrength * 0.05;
                    finalX += toCenterX;

                    // Vertical stretch (motion blur illusion)
                    const stretchAmount = Math.min(0.4, fallStrength * 0.3);
                    scaleY *= (1 + stretchAmount);
                    scaleX *= Math.max(0.7, 1 - stretchAmount * 0.5);

                    // Opacity: fade as image drops below viewport
                    const fallRatio = Math.max(0, (finalY - vh * 0.6) / (vh * 0.6));
                    const gravityOpacity = img.opacity * Math.max(0, 1 - fallRatio);

                    // Slight blur as speed increases
                    const motionBlur = Math.min(6, fallStrength * 5);

                    el.style.transform = `translate(-50%, -50%) translate(${finalX.toFixed(1)}px, ${finalY.toFixed(1)}px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
                    el.style.opacity = gravityOpacity.toFixed(3);
                    el.style.filter = motionBlur > 0.5 ? `blur(${motionBlur.toFixed(1)}px)` : '';
                    (el.style as any).webkitMaskImage = '';
                    (el.style as any).maskImage = '';
                } else {
                    // Normal rendering — gradually decay gravity offsets for smooth return
                    const gpos = gravityPosRef.current.get(img.id);
                    if (gpos) {
                        // Exponential decay
                        gpos.dy *= 0.90;
                        gpos.vy *= 0.85;
                        finalY += gpos.dy;

                        // Vertical stretch decays too
                        const residualStretch = Math.min(0.3, Math.abs(gpos.dy) / vh);
                        scaleY *= (1 + residualStretch * 0.2);
                        scaleX *= Math.max(0.85, 1 - residualStretch * 0.1);

                        // Motion blur decays
                        const residualBlur = Math.min(3, Math.abs(gpos.vy) / 200);
                        el.style.filter = residualBlur > 0.3 ? `blur(${residualBlur.toFixed(1)}px)` : '';

                        // Clean up once offset is negligible
                        if (Math.abs(gpos.dy) < 0.5 && Math.abs(gpos.vy) < 0.5) {
                            gravityPosRef.current.delete(img.id);
                            el.style.filter = '';
                        }
                    } else {
                        el.style.filter = '';
                    }

                    el.style.transform = `translate(-50%, -50%) translate(${finalX.toFixed(1)}px, ${finalY.toFixed(1)}px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
                    el.style.opacity = img.opacity.toString();
                    (el.style as any).webkitMaskImage = '';
                    (el.style as any).maskImage = '';
                }
            }
        }

        activeImagesRef.current = surviving;

        // ── Sync React state periodically (for adding/removing DOM nodes) ──
        renderUpdateTimerRef.current += delta;
        if (renderUpdateTimerRef.current > 0.5) { // sync every 500ms instead of 100ms
            renderUpdateTimerRef.current = 0;
            // setRenderImages([...activeImagesRef.current]); // This causes re-renders even if no change
            setRenderImages(prev => {
                if (prev.length !== activeImagesRef.current.length || prev[prev.length - 1]?.id !== activeImagesRef.current[activeImagesRef.current.length - 1]?.id) {
                    return [...activeImagesRef.current];
                }
                return prev;
            });
        }
    });

    // Find hovered image data for overlay
    const hoveredImage = hoveredId !== null
        ? activeImagesRef.current.find(img => img.id === hoveredId)
        : null;
    const hoveredContent = hoveredImage ? HIGHLIGHTS_CONTENT[hoveredImage.imageIndex] : null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100dvh',
                opacity: 0,
                zIndex: 20,
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020208 100%)',
                isolation: 'isolate',
            }}
        >
            {/* ── Static Centered Typography (Section Title Reveal) ── */}
            <div
                ref={titleRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    opacity: 0,
                    zIndex: 5,
                    pointerEvents: 'none',
                }}
            >
                <h2 style={{
                    fontFamily: "'Inter', 'Outfit', sans-serif",
                    fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                    fontWeight: 200,
                    color: '#ffffff',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.3,
                }}>
                    Moments That Made Us
                </h2>
                <p style={{
                    fontFamily: "'Inter', 'Outfit', sans-serif",
                    fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.08em',
                    marginTop: '1rem',
                }}>
                    A glimpse into the memories we created together
                </p>
            </div>

            {/* ── Infinite Floating Gallery ── */}
            <div
                ref={galleryRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                }}
            >
                {renderImages.map((img) => {
                    const content = HIGHLIGHTS_CONTENT[img.imageIndex]!;
                    const isHovered = hoveredId === img.id;
                    const anyHovered = hoveredId !== null;
                    const layerCfg = LAYER_CONFIG[img.layer];

                    // Hover scale — smaller images scale more
                    const hoverScale = img.sizeClass === 'tiny' ? 2.5
                        : img.sizeClass === 'small' ? 2.0
                            : img.sizeClass === 'medium' ? 1.5
                                : 1.2;
                    const hoverDuration = '1s';

                    // Z-index
                    const zIndex = isHovered ? 50 : img.zIndex;

                    // Filters
                    const filters: string[] = [];
                    if (img.layer === 'background' && !isHovered) {
                        filters.push(`blur(${layerCfg.blur}px)`);
                    }
                    if (isHovered) {
                        filters.push('brightness(1.15)');
                    } else if (anyHovered) {
                        filters.push('brightness(0.45)');
                        filters.push('blur(1.5px)');
                    } else {
                        filters.push(`brightness(${layerCfg.baseBrightness})`);
                    }

                    const currentW = isHovered ? `${img.widthVw * hoverScale}vw` : `${img.widthVw}vw`;
                    const currentH = isHovered ? `${img.heightVal * hoverScale}${img.heightUnit}` : `${img.heightVal}${img.heightUnit}`;

                    return (
                        <div
                            key={img.id}
                            ref={(el) => {
                                if (el) domMapRef.current.set(img.id, el);
                                else domMapRef.current.delete(img.id);
                            }}
                            data-spawn-img
                            data-spawn-id={img.id}
                            onMouseEnter={() => handleMouseEnter(img.id)}
                            onMouseLeave={() => handleMouseLeave()}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: currentW,
                                height: currentH,
                                zIndex,
                                cursor: 'pointer',
                                willChange: 'transform, opacity',
                                pointerEvents: 'auto',
                                opacity: 0,
                                transition: [
                                    `width ${hoverDuration} cubic-bezier(0.23, 1, 0.32, 1)`,
                                    `height ${hoverDuration} cubic-bezier(0.23, 1, 0.32, 1)`,
                                    'box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                    'filter 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                    'z-index 0s',
                                ].join(', '),
                                boxShadow: isHovered
                                    ? '0 20px 80px rgba(120,120,255,0.3), 0 0 120px rgba(100,100,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.1)'
                                    : '0 4px 30px rgba(0,0,0,0.5)',
                                filter: filters.join(' '),
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={content.url}
                                alt={content.title}
                                draggable={false}
                                loading="lazy"
                                decoding="async"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ── Centered Screen Text — appears on hover ── */}
            {hoveredContent && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100,
                        textAlign: 'center',
                        pointerEvents: 'none',
                        maxWidth: '70vw',
                        mixBlendMode: 'difference',
                        animation: 'fadeSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                    }}
                >
                    <h3 style={{
                        fontFamily: "'Inter', 'Outfit', sans-serif",
                        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                        fontWeight: 400,
                        color: '#ffffff',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: 1.2,
                    }}>
                        {hoveredContent.title}
                    </h3>
                    <p style={{
                        fontFamily: "'Inter', 'Outfit', sans-serif",
                        fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)',
                        fontWeight: 500,
                        color: '#ffffff',
                        letterSpacing: '0.06em',
                        marginTop: '0.8rem',
                        lineHeight: 1.5,
                    }}>
                        {hoveredContent.description}
                    </p>
                </div>
            )}

            {/* Inline keyframes for the centered text animation */}
            <style>{`
                @keyframes fadeSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -45%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
            `}</style>
        </div>
    );
};

export default HighlightsSection;
