import React, { useRef, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { HIGHLIGHTS_CONTENT } from '../../../data';

// ── Card configs ──
const CARD_CONFIGS = [
    { w: 260, h: 180, depth: 0.8, speed: 0.4 },
    { w: 200, h: 150, depth: 0.4, speed: 0.6 },
    { w: 180, h: 260, depth: 1.0, speed: 0.3 },
    { w: 240, h: 170, depth: 0.6, speed: 0.5 },
    { w: 220, h: 160, depth: 0.3, speed: 0.7 },
    { w: 190, h: 230, depth: 0.9, speed: 0.35 },
    { w: 210, h: 150, depth: 0.5, speed: 0.55 },
];

function seededRandom(seed: number) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

interface CardState {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

/**
 * HighlightsSection — Full sequence:
 * 1. Dark backdrop fades in during dissolve (hides 3D)
 * 2. Section title appears and auto-fades
 * 3. Floating bento cards drift in
 */
const HighlightsSection: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);

    const bgOpacityRef = useRef(0);
    const titleOpacityRef = useRef(0);
    const cardsOpacityRef = useRef(0);

    // Mouse tracking
    const mouseTarget = useRef({ x: 0, y: 0 });
    const mouseSmoothed = useRef({ x: 0, y: 0 });

    // Per-card physics
    const cardStates = useRef<CardState[]>(
        CARD_CONFIGS.map((cfg, i) => {
            const x = (seededRandom(i * 3 + 0) - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 1200) * 0.7;
            const y = (seededRandom(i * 3 + 1) - 0.5) * (typeof window !== 'undefined' ? window.innerHeight : 800) * 0.6;
            const angle = seededRandom(i * 3 + 2) * Math.PI * 2;
            const baseSpeed = 20 + cfg.speed * 40;
            return {
                x, y,
                vx: Math.cos(angle) * baseSpeed,
                vy: Math.sin(angle) * baseSpeed,
            };
        })
    );

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    // ── Phase boundaries ──
    // Dark backdrop:   0.94 → 0.97 (fades in during dissolve, completely dark by 0.97)
    // Section title:   0.97 → 0.99 (appears at 0.97, auto-fades by ~0.99)
    // Bento cards:     0.99 → 1.0  (fade in)
    const DARK_START = 0.94;
    const DARK_FULL = 0.97;
    const TITLE_START = 0.97;
    const TITLE_END = 0.99;
    const CARDS_START = 0.99;

    useFrame((_state, delta) => {
        if (!containerRef.current) return;

        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
        const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;

        // ── 1. Dark backdrop opacity ──
        let bgTarget = 0;
        if (r >= DARK_START && r < DARK_FULL) {
            bgTarget = (r - DARK_START) / (DARK_FULL - DARK_START);
        } else if (r >= DARK_FULL) {
            bgTarget = 1;
        }
        bgOpacityRef.current = THREE.MathUtils.damp(bgOpacityRef.current, bgTarget, 4, delta);
        containerRef.current.style.opacity = bgOpacityRef.current.toString();

        if (bgOpacityRef.current < 0.01) return;

        // ── 2. Section title ──
        if (titleRef.current) {
            let titleTarget = 0;
            if (r >= TITLE_START && r < TITLE_END) {
                // Fade in during first half, fade out during second half
                const titleT = (r - TITLE_START) / (TITLE_END - TITLE_START);
                if (titleT < 0.4) {
                    titleTarget = titleT / 0.4; // fade in
                } else {
                    titleTarget = 1 - ((titleT - 0.4) / 0.6); // fade out
                }
            }
            titleOpacityRef.current = THREE.MathUtils.damp(titleOpacityRef.current, titleTarget, 5, delta);
            titleRef.current.style.opacity = titleOpacityRef.current.toString();
        }

        // ── 3. Bento cards ──
        if (cardsContainerRef.current) {
            let cardsTarget = 0;
            if (r >= CARDS_START) {
                cardsTarget = Math.min(1, (r - CARDS_START) / (1.0 - CARDS_START));
            }
            cardsOpacityRef.current = THREE.MathUtils.damp(cardsOpacityRef.current, cardsTarget, 3, delta);
            cardsContainerRef.current.style.opacity = cardsOpacityRef.current.toString();
        }

        // Skip card physics if cards not visible
        if (cardsOpacityRef.current < 0.01) return;

        // Smooth mouse
        mouseSmoothed.current.x = THREE.MathUtils.damp(mouseSmoothed.current.x, mouseTarget.current.x, 1.2, delta);
        mouseSmoothed.current.y = THREE.MathUtils.damp(mouseSmoothed.current.y, mouseTarget.current.y, 1.2, delta);

        // Update card physics
        const cards = cardsContainerRef.current?.querySelectorAll<HTMLElement>('[data-highlight-card]');
        if (!cards) return;

        const halfW = viewportWidth / 2;
        const halfH = viewportHeight / 2;

        cards.forEach((cardEl, i) => {
            const state = cardStates.current[i];
            const cfg = CARD_CONFIGS[i % CARD_CONFIGS.length];
            if (!state || !cfg) return;

            // Mouse steers velocity direction
            const mouseInfluence = 8 * cfg.depth;
            state.vx += mouseSmoothed.current.x * mouseInfluence * delta;
            state.vy += mouseSmoothed.current.y * mouseInfluence * delta;

            // Clamp speed
            const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
            const maxSpeed = 20 + cfg.speed * 50;
            if (speed > maxSpeed) {
                state.vx = (state.vx / speed) * maxSpeed;
                state.vy = (state.vy / speed) * maxSpeed;
            }

            // Integrate
            state.x += state.vx * delta;
            state.y += state.vy * delta;

            // Wrap around
            const marginX = cfg.w / 2 + 50;
            const marginY = cfg.h / 2 + 50;
            if (state.x > halfW + marginX) state.x = -halfW - marginX + 20;
            if (state.x < -halfW - marginX) state.x = halfW + marginX - 20;
            if (state.y > halfH + marginY) state.y = -halfH - marginY + 20;
            if (state.y < -halfH - marginY) state.y = halfH + marginY - 20;

            // Bob
            const bobPhase = Date.now() * 0.001 * (0.3 + cfg.depth * 0.2) + i * 1.5;
            const bobY = Math.sin(bobPhase) * 2 * cfg.depth;

            cardEl.style.transform = `translate(-50%, -50%) translate(${state.x}px, ${state.y + bobY}px)`;
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
                pointerEvents: 'none',
                zIndex: 20,
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020208 100%)',
            }}
        >
            {/* Section Title — fades in then auto-fades out */}
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
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: '0.08em',
                    marginTop: '1rem',
                }}>
                    A glimpse into the memories we created together
                </p>
            </div>

            {/* Bento Cards Container */}
            <div ref={cardsContainerRef} style={{ opacity: 0, width: '100%', height: '100%' }}>
                {HIGHLIGHTS_CONTENT.map((item, i) => {
                    const cfg = CARD_CONFIGS[i % CARD_CONFIGS.length]!;

                    return (
                        <div
                            key={i}
                            data-highlight-card
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                width: cfg.w,
                                height: cfg.h,
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                                willChange: 'transform',
                            }}
                        >
                            <img
                                src={item.url}
                                alt={item.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HighlightsSection;
