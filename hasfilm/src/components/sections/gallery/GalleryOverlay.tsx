// src/components/sections/gallery/GalleryOverlay.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { GALLERY_CONTENT } from '../../../data/gallery';
import { galleryProgress } from '../../../hooks/galleryProgress';
import { useIsMobile } from '../../../hooks/useIsMobile';

/**
 * GalleryOverlay — HUD overlay for the 3D gallery section.
 *
 * Post-Lenis migration: This component lives in <main> as a regular DOM element.
 * It uses a rAF loop (instead of useFrame) to animate in sync with scrollProgress.
 * Since it's positioned sticky inside the gallery-trigger div, no portal is needed.
 */
const GalleryOverlay: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const innerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);
    const textRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);
    const exitProgress = useRef(0);
    const activeIndexRef = useRef(0);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);
    const isMobile = useIsMobile();
    const isMobileRef = useRef(false);
    isMobileRef.current = isMobile;

    const tick = useCallback((time: number) => {
        if (!innerRef.current) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }

        // Calculate delta
        if (lastTimeRef.current === 0) lastTimeRef.current = time;
        const deltaMs = Math.min(time - lastTimeRef.current, 50);
        const delta = deltaMs / 1000;
        lastTimeRef.current = time;

        const p = galleryProgress.current; // 0→1 local to gallery section

        // 1. Visibility Logic — visible during panel viewing, hidden during dissolve
        // On mobile: higher threshold so gallery waits for About to fully disappear
        const enterThreshold = isMobileRef.current ? 0.08 : 0.02;
        const VIEW_END = 0.85;
        const isVisible = p > enterThreshold && p < 0.88;
        const targetOpacity = isVisible ? 1 : 0;
        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 3, delta);
        innerRef.current.style.opacity = opacityRef.current.toString();

        // 2. Active Index Calculation
        if (p > enterThreshold) {
            const totalItems = GALLERY_CONTENT.length;
            const progress = Math.min(1, p / VIEW_END); // 0→1 within viewing phase

            const rawIndex = Math.max(0, Math.min(progress * totalItems - 0.5, totalItems - 1));
            const index = Math.round(rawIndex);

            if (index !== activeIndexRef.current) {
                activeIndexRef.current = index;
                setActiveIndex(index);
            }

            // === EXIT SEQUENCE ===
            const exitStart = 0.80;
            const exitT = p > exitStart ? (p - exitStart) / (0.88 - exitStart) : 0;
            const targetExit = Math.min(1, Math.max(0, exitT));
            exitProgress.current = THREE.MathUtils.damp(exitProgress.current, targetExit, 3, delta);

            const ep = exitProgress.current;

            // Phase 1: Text fades + slides left + blurs
            if (textRef.current) {
                const textT = Math.min(1, ep / 0.45);
                const eased = textT * textT;
                textRef.current.style.opacity = (1 - eased).toString();
                textRef.current.style.transform = `translate3d(${-eased * 40}px, -50%, 0)`;
                textRef.current.style.filter = `blur(${eased * 6}px)`;
            }

            // Phase 3a: Scrim fades out
            if (scrimRef.current) {
                const scrimT = Math.max(0, Math.min(1, (ep - 0.60) / 0.15));
                scrimRef.current.style.opacity = (1 - scrimT).toString();
            }

            // Phase 3b: Progress bar fades + slides down
            if (progressRef.current) {
                const barT = Math.max(0, Math.min(1, (ep - 0.70) / 0.15));
                const barEased = barT * barT;
                progressRef.current.style.opacity = (1 - barEased).toString();
                progressRef.current.style.transform = `translate3d(-50%, ${barEased * 24}px, 0)`;
            }

            // Phase 3c: Dots fade + slide right
            if (dotsRef.current) {
                const dotsT = Math.max(0, Math.min(1, (ep - 0.75) / 0.20));
                const dotsEased = dotsT * dotsT;
                dotsRef.current.style.opacity = (1 - dotsEased).toString();
                dotsRef.current.style.transform = `translate3d(${dotsEased * 16}px, -50%, 0)`;
            }
        } else {
            // Reset exit state
            exitProgress.current = 0;
            if (textRef.current) {
                textRef.current.style.opacity = '';
                textRef.current.style.transform = '';
                textRef.current.style.filter = '';
            }
            if (scrimRef.current) scrimRef.current.style.opacity = '';
            if (progressRef.current) {
                progressRef.current.style.opacity = '';
                progressRef.current.style.transform = '';
            }
            if (dotsRef.current) {
                dotsRef.current.style.opacity = '';
                dotsRef.current.style.transform = '';
            }
        }

        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [tick]);

    const activeItem = GALLERY_CONTENT[activeIndex];
    if (!activeItem) return null;

    return (
        <div
            ref={innerRef}
            style={{
                position: 'sticky',
                top: 0,
                width: '100%',
                height: '100vh',
                opacity: 0,
                willChange: 'opacity',
                pointerEvents: 'none',
                zIndex: 30,
            }}
        >
            {/* Left gradient scrim + text shadow */}
            <div
                ref={scrimRef}
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0) 55%)',
                }}
            />

            {/* 1. Progress Bar (Bottom HUD) */}
            <div ref={progressRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-[2px] bg-white/10">
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_#3b82f6]"
                    style={{ width: `${((activeIndex + 1) / GALLERY_CONTENT.length) * 100}%` }}
                />
                <div className="flex justify-between mt-2 text-[10px] font-mono text-white/40 tracking-widest uppercase">
                    <span>01</span>
                    <span>0{GALLERY_CONTENT.length}</span>
                </div>
            </div>

            {/* 2. Text Content (Left Side) */}
            <div ref={textRef} className="absolute top-1/2 left-8 md:left-20 -translate-y-1/2 max-w-lg" style={{ willChange: 'transform, opacity' }}>
                <div key={`title-${activeIndex}`} className="gallery-text-enter overflow-hidden relative">
                    <h2
                        className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none"
                        style={{
                            textShadow: '0 0 15px rgba(0,0,0,0.8), 0 2px 30px rgba(0,0,0,0.5)',
                        }}
                    >
                        {activeItem.title}
                    </h2>
                </div>

                {/* Description Box */}
                <div key={`desc-${activeIndex}`} className="gallery-text-enter relative mt-6 p-6 border-l-2 border-blue-500/50">
                    <p
                        className="text-lg text-white/80 leading-relaxed font-light"
                        style={{
                            textShadow: '0 0 10px rgba(0,0,0,0.6)',
                        }}
                    >
                        {activeItem.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <span className="h-[1px] w-8 bg-blue-500"></span>
                        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
                            ID {String(activeIndex + 1).padStart(2, '0')} / {String(GALLERY_CONTENT.length).padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Vertical Pagination Dots (Right Side) */}
            <div ref={dotsRef} className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 flex flex-col items-center gap-4">
                {GALLERY_CONTENT.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1 transition-all duration-500 ${i === activeIndex ? 'h-8 bg-blue-500' : 'h-2 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default GalleryOverlay;