import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { HIGHLIGHTS_CONTENT } from '../../../data';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

type DepthLayer = 'foreground' | 'middle' | 'background';
type SizeClass = 'hero' | 'medium' | 'small';

interface FloatingImage {
    url: string;
    title: string;
    description: string;
    size: SizeClass;
    layer: DepthLayer;
    zDepth: number;
    startX: number; // initial position (% of viewport, relative to center)
    startY: number;
    aspect: 'landscape' | 'portrait' | 'square';
}

// Seeded random for deterministic layout
function seeded(seed: number) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

// ── Layer Config — visual treatment only, speed is uniform ──
const LAYER_CONFIG = {
    foreground: { mouseRange: 15, blur: 0, baseBrightness: 0.92 },
    middle: { mouseRange: 12, blur: 0, baseBrightness: 0.8 },
    background: { mouseRange: 8, blur: 2, baseBrightness: 0.62 },
} as const;

// ── Global flow — one direction, all images ──
const GLOBAL_FLOW_ANGLE = seeded(42) * Math.PI * 2;
const GLOBAL_FLOW_SPEED = 6; // px/s — gentle
const GLOBAL_FLOW_DX = Math.cos(GLOBAL_FLOW_ANGLE);
const GLOBAL_FLOW_DY = Math.sin(GLOBAL_FLOW_ANGLE);

// Build the 12-image layout with deliberate size hierarchy & depth layers
function buildLayout(): FloatingImage[] {
    const sizes: SizeClass[] = [
        'hero', 'small', 'medium', 'small',
        'hero', 'small', 'medium', 'small',
        'medium', 'hero', 'small', 'medium',
    ];

    const layers: DepthLayer[] = [
        'foreground', 'background', 'middle', 'background',
        'foreground', 'background', 'middle', 'background',
        'middle', 'foreground', 'background', 'middle',
    ];

    const aspects: ('landscape' | 'portrait' | 'square')[] = [
        'landscape', 'portrait', 'landscape', 'square',
        'landscape', 'landscape', 'portrait', 'landscape',
        'square', 'portrait', 'landscape', 'landscape',
    ];

    return HIGHLIGHTS_CONTENT.map((item, i) => {
        const s = seeded(i * 7 + 3);
        const s2 = seeded(i * 13 + 7);

        const sizeClass = sizes[i % sizes.length]!;
        const layer = layers[i % layers.length]!;

        // Fixed z-depth per layer (no cycling)
        const zDepth = layer === 'foreground' ? -20 : layer === 'middle' ? -60 : -120;

        // Grid-based placement: fill viewport evenly
        // 4 columns x 3 rows with jitter
        const cols = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rows = Math.ceil(HIGHLIGHTS_CONTENT.length / cols);

        // Position in viewport percentage (5-95% range to avoid edges)
        const cellW = 90 / cols;  // ~22.5% per column
        const cellH = 90 / rows;  // ~30% per row
        const jitterX = (s - 0.5) * cellW * 0.5;  // small random offset within cell
        const jitterY = (s2 - 0.5) * cellH * 0.5;

        const startX = 5 + col * cellW + cellW / 2 + jitterX;  // 0-100% of viewport
        const startY = 5 + row * cellH + cellH / 2 + jitterY;

        return {
            url: item.url,
            title: item.title,
            description: item.description,
            size: sizeClass,
            layer,
            zDepth,
            startX,
            startY,
            aspect: aspects[i % aspects.length]!,
        };
    });
}

const FLOATING_IMAGES = buildLayout();

// Size dimensions — reduced heroes, balanced layout like reference
function getDimensions(img: FloatingImage): { width: number; height: number } {
    if (img.size === 'hero') {
        if (img.aspect === 'portrait') return { width: 20, height: 32 };
        if (img.aspect === 'square') return { width: 24, height: 24 };
        return { width: 28, height: 22 };
    }
    if (img.size === 'medium') {
        if (img.aspect === 'portrait') return { width: 14, height: 22 };
        if (img.aspect === 'square') return { width: 16, height: 16 };
        return { width: 20, height: 14 };
    }
    // small — accent images
    if (img.aspect === 'portrait') return { width: 8, height: 12 };
    if (img.aspect === 'square') return { width: 8, height: 8 };
    return { width: 11, height: 8 };
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

    // Mouse position (normalized -1 to 1, lerped)
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmoothed = useRef({ x: 0, y: 0 });

    // Hovered image index
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const hoveredRef = useRef<number | null>(null);

    // Elapsed time for noise
    const timeRef = useRef(0);

    // Mouse tracking
    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    const handleMouseEnter = useCallback((i: number) => {
        setHoveredIdx(i);
        hoveredRef.current = i;
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredIdx(null);
        hoveredRef.current = null;
    }, []);

    // Phase boundaries
    const DARK_START = 0.96;
    const DARK_FULL = 0.97;
    const TITLE_START = 0.97;
    const TITLE_END = 0.99;
    const CARDS_START = 0.99;

    useFrame((_state, delta) => {
        if (!containerRef.current) return;

        const r = scroll.offset;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;

        // ── Dark backdrop ──
        let bgTarget = 0;
        if (r >= DARK_START && r < DARK_FULL) {
            bgTarget = (r - DARK_START) / (DARK_FULL - DARK_START);
        } else if (r >= DARK_FULL) {
            bgTarget = 1;
        }
        bgOpacityRef.current = THREE.MathUtils.damp(bgOpacityRef.current, bgTarget, 4, delta);
        containerRef.current.style.opacity = bgOpacityRef.current.toString();

        if (bgOpacityRef.current < 0.01) return;

        // ── Title ──
        if (titleRef.current) {
            let titleTarget = 0;
            if (r >= TITLE_START && r < TITLE_END) {
                const t = (r - TITLE_START) / (TITLE_END - TITLE_START);
                titleTarget = t < 0.4 ? t / 0.4 : 1 - ((t - 0.4) / 0.6);
            }
            titleOpacityRef.current = THREE.MathUtils.damp(titleOpacityRef.current, titleTarget, 5, delta);
            titleRef.current.style.opacity = titleOpacityRef.current.toString();
        }

        // ── Gallery ──
        if (galleryRef.current) {
            let galTarget = 0;
            if (r >= CARDS_START) {
                galTarget = Math.min(1, (r - CARDS_START) / (1.0 - CARDS_START));
            }
            galleryOpacityRef.current = THREE.MathUtils.damp(galleryOpacityRef.current, galTarget, 3, delta);
            galleryRef.current.style.opacity = galleryOpacityRef.current.toString();
        }

        if (galleryOpacityRef.current < 0.01) return;

        // ── Lerp-based mouse smoothing — heavy, "expensive" feel ──
        mouseSmoothed.current.x = THREE.MathUtils.damp(
            mouseSmoothed.current.x, mouseTarget.current.x, 0.6, delta
        );
        mouseSmoothed.current.y = THREE.MathUtils.damp(
            mouseSmoothed.current.y, mouseTarget.current.y, 0.6, delta
        );

        // Accumulate time for sine-wave noise
        timeRef.current += delta;
        const t = timeRef.current;


        // ── Update per-image transforms ──
        const imgEls = galleryRef.current?.querySelectorAll<HTMLElement>('[data-float-img]');
        if (!imgEls) return;

        imgEls.forEach((el, i) => {
            const img = FLOATING_IMAGES[i];
            if (!img) return;

            const layerCfg = LAYER_CONFIG[img.layer];

            // ── Pure smooth linear drift ──
            const driftX = GLOBAL_FLOW_DX * GLOBAL_FLOW_SPEED * t;
            const driftY = GLOBAL_FLOW_DY * GLOBAL_FLOW_SPEED * t;

            // Starting position in pixels (percentage of viewport)
            const baseX = (img.startX / 100) * vw + driftX;
            const baseY = (img.startY / 100) * vh + driftY;

            // Seamless wrap: use double-modulo for negative safety
            const finalBaseX = ((baseX % vw) + vw) % vw;
            const finalBaseY = ((baseY % vh) + vh) % vh;

            // Mouse parallax
            const mouseOffX = mouseSmoothed.current.x * layerCfg.mouseRange;
            const mouseOffY = mouseSmoothed.current.y * layerCfg.mouseRange * 0.7;

            const finalX = finalBaseX + mouseOffX;
            const finalY = finalBaseY + mouseOffY;

            // Pure translate — centered on grid point, smooth drift
            el.style.transform =
                `translate(-50%, -50%) translate3d(${finalX}px, ${finalY}px, ${img.zDepth}px)`;
        });
    });

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                opacity: 0,
                zIndex: 20,
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020208 100%)',
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

            {/* ── Floating Gallery with CSS Perspective ── */}
            <div
                ref={galleryRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    perspective: '800px',
                    perspectiveOrigin: '50% 50%',
                }}
            >

                {/* ── Floating Images ── */}
                {FLOATING_IMAGES.map((img, i) => {
                    const dims = getDimensions(img);
                    const isHovered = hoveredIdx === i;
                    const anyHovered = hoveredIdx !== null;
                    const layerCfg = LAYER_CONFIG[img.layer];

                    // Calm hover scale
                    const hoverScale = img.size === 'small' ? 2.0 : img.size === 'medium' ? 1.5 : 1.2;
                    const hoverDuration = '1s';

                    // Z-index by layer, hovered on top
                    let zIndex: number;
                    if (isHovered) {
                        zIndex = 50;
                    } else if (img.layer === 'foreground') {
                        zIndex = 10;
                    } else if (img.layer === 'middle') {
                        zIndex = 5;
                    } else {
                        zIndex = 2;
                    }

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

                    const currentW = isHovered ? `${dims.width * hoverScale}vw` : `${dims.width}vw`;
                    const currentH = isHovered
                        ? (img.aspect === 'square' ? `${dims.height * hoverScale}vw` : `${dims.height * hoverScale}vh`)
                        : (img.aspect === 'square' ? `${dims.height}vw` : `${dims.height}vh`);

                    return (
                        <div
                            key={i}
                            data-float-img
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => handleMouseLeave()}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: currentW,
                                height: currentH,
                                zIndex,
                                cursor: 'pointer',
                                willChange: 'transform, width, height',
                                pointerEvents: 'auto',
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
                                src={img.url}
                                alt={img.title}
                                draggable={false}
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
            {hoveredIdx !== null && FLOATING_IMAGES[hoveredIdx] && (
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
                        animation: 'fadeSlideIn 0.45s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                    }}
                >
                    <h3 style={{
                        fontFamily: "'Inter', 'Outfit', sans-serif",
                        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                        fontWeight: 200,
                        color: '#ffffff',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        margin: 0,
                        lineHeight: 1.2,
                        textShadow: '0 4px 40px rgba(0,0,0,0.7)',
                    }}>
                        {FLOATING_IMAGES[hoveredIdx]!.title}
                    </h3>
                    <p style={{
                        fontFamily: "'Inter', 'Outfit', sans-serif",
                        fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.55)',
                        letterSpacing: '0.06em',
                        marginTop: '0.8rem',
                        lineHeight: 1.5,
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    }}>
                        {FLOATING_IMAGES[hoveredIdx]!.description}
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
