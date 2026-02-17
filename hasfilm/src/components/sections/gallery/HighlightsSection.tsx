import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HIGHLIGHTS_CONTENT } from '../../../data';
import { useHighlights } from '../../../hooks/useSupabaseData';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

type DepthLayer = 'foreground' | 'middle' | 'background';
type SizeClass = 'hero' | 'medium' | 'small' | 'tiny';

const LAYER_CONFIG = {
    foreground: { mouseRange: 15, blur: 0, baseBrightness: 0.92, speed: 1.0 },
    middle: { mouseRange: 12, blur: 0, baseBrightness: 0.8, speed: 0.7 },
    background: { mouseRange: 8, blur: 2, baseBrightness: 0.62, speed: 0.45 },
} as const;

const SIZE_CONFIG: Record<SizeClass, { minW: number; maxW: number; aspect: [number, number][] }> = {
    hero: { minW: 22, maxW: 30, aspect: [[16, 10], [4, 3], [3, 2]] },
    medium: { minW: 14, maxW: 20, aspect: [[16, 9], [4, 3], [3, 4]] },
    small: { minW: 8, maxW: 13, aspect: [[16, 9], [1, 1], [3, 4]] },
    tiny: { minW: 5, maxW: 8, aspect: [[1, 1], [4, 3], [16, 9]] },
};

const SIZE_WEIGHTS: { size: SizeClass; weight: number }[] = [
    { size: 'hero', weight: 0.08 },
    { size: 'medium', weight: 0.25 },
    { size: 'small', weight: 0.40 },
    { size: 'tiny', weight: 0.27 },
];

const LAYER_WEIGHTS: { layer: DepthLayer; weight: number }[] = [
    { layer: 'foreground', weight: 0.25 },
    { layer: 'middle', weight: 0.40 },
    { layer: 'background', weight: 0.35 },
];

const MAX_ACTIVE_IMAGES = 12;
const SPAWN_INTERVAL_MIN = 0.6;
const SPAWN_INTERVAL_MAX = 1.4;
const BASE_TRAVEL_SPEED = 22;
const FADE_IN_DURATION = 1.2;
const CENTER_SCALE_BOOST = 0.35;

const FLOW_ANGLE = -0.3;
const FLOW_DX = Math.cos(FLOW_ANGLE);
const FLOW_DY = Math.sin(FLOW_ANGLE);

// ════════════════════════════════════════════════
//  SPAWNED IMAGE STATE
// ════════════════════════════════════════════════

interface SpawnedImage {
    id: number;
    imageIndex: number;
    sizeClass: SizeClass;
    layer: DepthLayer;
    widthVw: number;
    heightUnit: string;
    heightVal: number;
    startX: number;
    startY: number;
    vx: number;
    vy: number;
    spawnTime: number;
    opacity: number;
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
): SpawnedImage {
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

    const sizeEntry = pickWeighted(SIZE_WEIGHTS as any) as typeof SIZE_WEIGHTS[number];
    const layerEntry = pickWeighted(LAYER_WEIGHTS as any) as typeof LAYER_WEIGHTS[number];
    const sizeClass = sizeEntry.size;
    const layer = layerEntry.layer;

    const cfg = SIZE_CONFIG[sizeClass];
    const widthVw = cfg.minW + Math.random() * (cfg.maxW - cfg.minW);
    const aspectPair = cfg.aspect[Math.floor(Math.random() * cfg.aspect.length)]!;
    const aspectRatio = aspectPair[0] / aspectPair[1];

    const widthPx = (widthVw / 100) * vw;
    const heightPx = widthPx / aspectRatio;
    const heightVal = (heightPx / vh) * 100;

    const layerCfg = LAYER_CONFIG[layer];
    const speed = BASE_TRAVEL_SPEED * layerCfg.speed * (0.7 + Math.random() * 0.6);

    // Random edge selection (simplified — no density awareness)
    const edge = Math.floor(Math.random() * 4);
    const margin = Math.max(widthPx, heightPx) + 50;

    let startX: number, startY: number, vx: number, vy: number;

    switch (edge) {
        case 0: // left
            startX = -margin; startY = Math.random() * vh;
            vx = speed * (0.8 + Math.random() * 0.4);
            vy = speed * (Math.random() - 0.5) * 0.3;
            break;
        case 1: // right
            startX = vw + margin; startY = Math.random() * vh;
            vx = -speed * (0.8 + Math.random() * 0.4);
            vy = speed * (Math.random() - 0.5) * 0.3;
            break;
        case 2: // top
            startX = Math.random() * vw; startY = -margin;
            vx = speed * (Math.random() - 0.5) * 0.3;
            vy = speed * (0.8 + Math.random() * 0.4);
            break;
        default: // bottom
            startX = Math.random() * vw; startY = vh + margin;
            vx = speed * (Math.random() - 0.5) * 0.3;
            vy = -speed * (0.8 + Math.random() * 0.4);
            break;
    }

    vx += FLOW_DX * speed * 0.2;
    vy += FLOW_DY * speed * 0.2;

    const baseZ = layer === 'foreground' ? 10 : layer === 'middle' ? 5 : 2;
    const zIndex = baseZ + Math.floor(Math.random() * 3);

    return {
        id, imageIndex, sizeClass, layer,
        widthVw, heightUnit: 'vh', heightVal,
        startX, startY, vx, vy,
        spawnTime: time, opacity: 0, zIndex,
    };
}

const INITIAL_IMAGE_COUNT = 10;
function createInitialImages(): SpawnedImage[] {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const images: SpawnedImage[] = [];

    for (let i = 0; i < INITIAL_IMAGE_COUNT; i++) {
        const usedIndices = new Set(images.map(img => img.imageIndex));
        const img = createSpawnedImage(i, 0, vw, vh, usedIndices);
        const edgeBias = 0.05 + Math.random() * 0.10;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: img.startX = vw * edgeBias; img.startY = Math.random() * vh; break;
            case 1: img.startX = vw * (1 - edgeBias); img.startY = Math.random() * vh; break;
            case 2: img.startX = Math.random() * vw; img.startY = vh * edgeBias; break;
            default: img.startX = Math.random() * vw; img.startY = vh * (1 - edgeBias); break;
        }
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
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    // ── Supabase data hook (lazy-loads on viewport approach) ──
    const { highlights, ref: lazyRef } = useHighlights();

    // Mouse position (normalized -1 to 1, lerped)
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmoothed = useRef({ x: 0, y: 0 });

    // Hovered image id
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const hoveredRef = useRef<number | null>(null);

    // Elapsed time
    const timeRef = useRef(0);

    // ScrollTrigger "isActive" gate for the spawn/drift rAF
    const isActiveRef = useRef(false);

    // Track whether section has already played (one-shot from gallery side)
    const hasEnteredRef = useRef(false);

    // Spawning state
    const nextIdRef = useRef(INITIAL_IMAGE_COUNT);
    const spawnTimerRef = useRef(0);
    const nextSpawnDelayRef = useRef(0.3);
    const [initialImages] = useState(() => createInitialImages());
    const activeImagesRef = useRef<SpawnedImage[]>(initialImages);
    const [renderImages, setRenderImages] = useState<SpawnedImage[]>(initialImages);
    const renderUpdateTimerRef = useRef(0);

    // fast DOM lookup
    const domMapRef = useRef<Map<number, HTMLDivElement>>(new Map());

    // ── Mouse tracking ──
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

    // ── ScrollTrigger: container + title + gallery opacity ──
    // Only shows when entering from gallery side (scrolling down), NOT from schedule side
    useEffect(() => {
        const el = containerRef.current;
        const titleEl = titleRef.current;
        const galEl = galleryRef.current;
        if (!el) return;

        const triggers: ScrollTrigger[] = [];

        // Container fade — symmetric, works in both directions
        const containerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#highlights-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                onEnter: () => { hasEnteredRef.current = true; },
                onEnterBack: () => { hasEnteredRef.current = true; },
                onLeave: () => { hasEnteredRef.current = false; },
                onLeaveBack: () => { hasEnteredRef.current = false; },
            },
        });
        containerTl
            .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 })
            .to(el, { opacity: 1, duration: 0.5 })
            .to(el, { opacity: 0, duration: 0.15 });
        if (containerTl.scrollTrigger) triggers.push(containerTl.scrollTrigger);

        // Title: auto-timed fade (not scroll scrubbed)
        // Plays once when section enters, auto-fades out after a hold
        let titleTl: gsap.core.Timeline | null = null;
        if (titleEl) {
            titleTl = gsap.timeline({ paused: true });
            titleTl
                .fromTo(titleEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
                .to(titleEl, { duration: 2 }) // hold for 2s
                .to(titleEl, { opacity: 0, y: -8, duration: 1, ease: 'power2.in' });
        }

        // Trigger to fire the title timeline on entry
        const titleST = ScrollTrigger.create({
            trigger: '#highlights-section',
            start: 'top 60%',
            onEnter: () => { titleTl?.restart(); },
            // Don't replay on enterBack
        });
        triggers.push(titleST);

        // Gallery: fade in after title, hold (scrubbed)
        if (galEl) {
            const galTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#highlights-section',
                    start: 'top 50%',
                    end: 'bottom 30%',
                    scrub: 0.5,
                },
            });
            galTl
                .fromTo(galEl, { opacity: 0 }, { opacity: 1, duration: 0.4 })
                .to(galEl, { opacity: 1, duration: 0.6 });
            if (galTl.scrollTrigger) triggers.push(galTl.scrollTrigger);
        }

        // isActive toggle — fires in both directions
        const st = ScrollTrigger.create({
            trigger: '#highlights-section',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => { isActiveRef.current = true; },
            onEnterBack: () => { isActiveRef.current = true; },
            onLeave: () => { isActiveRef.current = false; },
            onLeaveBack: () => { isActiveRef.current = false; },
        });
        triggers.push(st);

        return () => {
            containerTl.kill();
            titleTl?.kill();
            triggers.forEach(t => t.kill());
        };
    }, []);

    // ── Spawn + Drift rAF (gated by isActive) ──
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);

    const animationTick = useCallback((time: number) => {
        rafRef.current = requestAnimationFrame(animationTick);

        if (!isActiveRef.current) return;
        if (!containerRef.current) return;

        if (lastTimeRef.current === 0) lastTimeRef.current = time;
        const deltaMs = Math.min(time - lastTimeRef.current, 50);
        const delta = deltaMs / 1000;
        lastTimeRef.current = time;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        timeRef.current += delta;
        const t = timeRef.current;

        // Lerp mouse
        const MOUSE_DAMP = 3;
        mouseSmoothed.current.x += (mouseTarget.current.x - mouseSmoothed.current.x) * Math.min(1, MOUSE_DAMP * delta);
        mouseSmoothed.current.y += (mouseTarget.current.y - mouseSmoothed.current.y) * Math.min(1, MOUSE_DAMP * delta);

        // Spawn new images
        spawnTimerRef.current += delta;
        if (spawnTimerRef.current >= nextSpawnDelayRef.current && activeImagesRef.current.length < MAX_ACTIVE_IMAGES) {
            spawnTimerRef.current = 0;
            nextSpawnDelayRef.current = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
            const usedIndices = new Set(activeImagesRef.current.map(img => img.imageIndex));
            const newImg = createSpawnedImage(nextIdRef.current++, t, vw, vh, usedIndices);
            activeImagesRef.current.push(newImg);
        }

        // Update & cull images
        const surviving: SpawnedImage[] = [];

        for (const img of activeImagesRef.current) {
            const age = t - img.spawnTime;
            const baseX = img.startX + img.vx * age;
            const baseY = img.startY + img.vy * age;

            const imgWidthPx = (img.widthVw / 100) * vw;
            const imgHeightPx = (img.heightVal / 100) * vh;
            const margin = Math.max(imgWidthPx, imgHeightPx) + 100;
            const isOffScreen = baseX < -margin || baseX > vw + margin || baseY < -margin || baseY > vh + margin;

            if (age > 2 && isOffScreen) {
                domMapRef.current.delete(img.id);
                continue;
            }

            img.opacity = Math.min(1, age / FADE_IN_DURATION);
            surviving.push(img);

            const el = domMapRef.current.get(img.id);
            if (el) {
                const layerCfg = LAYER_CONFIG[img.layer];
                const mouseOffX = mouseSmoothed.current.x * layerCfg.mouseRange;
                const mouseOffY = mouseSmoothed.current.y * layerCfg.mouseRange * 0.7;

                const finalX = baseX + mouseOffX;
                const finalY = baseY + mouseOffY;

                const centerX = vw / 2;
                const centerY = vh / 2;
                const dx = (finalX - centerX) / centerX;
                const dy = (finalY - centerY) / centerY;
                const distFromCenter = Math.min(1, Math.sqrt(dx * dx + dy * dy));
                const scale = 1 + CENTER_SCALE_BOOST * (1 - distFromCenter * distFromCenter);

                el.style.transform = `translate(-50%, -50%) translate(${finalX.toFixed(1)}px, ${finalY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
                el.style.opacity = img.opacity.toString();
            }
        }

        activeImagesRef.current = surviving;

        // Sync React state periodically
        renderUpdateTimerRef.current += delta;
        if (renderUpdateTimerRef.current > 0.5) {
            renderUpdateTimerRef.current = 0;
            setRenderImages(prev => {
                if (prev.length !== activeImagesRef.current.length || prev[prev.length - 1]?.id !== activeImagesRef.current[activeImagesRef.current.length - 1]?.id) {
                    return [...activeImagesRef.current];
                }
                return prev;
            });
        }
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animationTick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [animationTick]);

    // Find hovered image data for overlay
    const hoveredImage = hoveredId !== null
        ? activeImagesRef.current.find(img => img.id === hoveredId)
        : null;
    const hoveredContent = hoveredImage ? highlights[hoveredImage.imageIndex] : null;

    return (
        <div
            ref={(el) => {
                (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                if (typeof lazyRef === 'function') lazyRef(el);
                else if (lazyRef && 'current' in lazyRef) (lazyRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            style={{
                position: 'sticky',
                top: 0,
                width: '100%',
                height: '100vh',
                opacity: 0,
                zIndex: 20,
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020208 100%)',
                isolation: 'isolate',
            }}
        >
            {/* ── Section Title ── */}
            <div
                ref={titleRef}
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
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

            {/* ── Floating Gallery ── */}
            <div
                ref={galleryRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    opacity: 0,
                }}
            >
                {renderImages.map((img) => {
                    const content = highlights[img.imageIndex]!;
                    const isHovered = hoveredId === img.id;
                    const anyHovered = hoveredId !== null;
                    const layerCfg = LAYER_CONFIG[img.layer];

                    const hoverScale = img.sizeClass === 'tiny' ? 2.5
                        : img.sizeClass === 'small' ? 2.0
                            : img.sizeClass === 'medium' ? 1.5
                                : 1.2;
                    const hoverDuration = '1s';
                    const zIndex = isHovered ? 50 : img.zIndex;

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
                                left: 0, top: 0,
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

            {/* ── Hover text overlay ── */}
            {hoveredContent && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
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

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translate(-50%, -45%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
        </div>
    );
};

export default HighlightsSection;
