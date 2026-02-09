// src/components/sections/gallery/GalleryOverlay.tsx
import React, { useState, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GALLERY_CONTENT } from '../../../data/gallery';
import { TIMELINE } from '../../../config/timeline';
import { SCROLL_CONFIG } from '../../../config/scroll';

const GalleryOverlay: React.FC = () => {
    const scroll = useScroll();
    const [activeIndex, setActiveIndex] = useState(0);
    const innerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);
    const textRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement>(null);
    const scrimRef = useRef<HTMLDivElement>(null);

    // Smoothed exit progress (0 = fully visible, 1 = fully collapsed)
    const exitProgress = useRef(0);

    useFrame((_state, delta) => {
        if (!innerRef.current) return;

        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        // 1. Visibility Logic: Fade in when gallery's first media is in view
        const isVisible = r >= TIMELINE.GALLERY_START && r <= TIMELINE.END;
        const targetOpacity = isVisible ? 1 : 0;
        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 3, delta);

        // Apply scroll compensation directly (no extra damp — scroll.offset is already damped by ScrollControls)
        innerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
        innerRef.current.style.opacity = opacityRef.current.toString();

        // 2. Active Index Calculation
        if (r >= TIMELINE.GALLERY_START) {
            const totalItems = GALLERY_CONTENT.length;
            const progress = (r - TIMELINE.GALLERY_START) / (TIMELINE.END - TIMELINE.GALLERY_START);
            
            // Half-step padding: maps scroll evenly across all panels
            // so panel 0 and panel N-1 each get equal dwell time
            const rawIndex = Math.max(0, Math.min(progress * totalItems - 0.5, totalItems - 1));
            const index = Math.round(rawIndex);
            
            if (index !== activeIndex) {
                setActiveIndex(index);
            }

            // === EXIT SEQUENCE at end of gallery ===
            // The last panel lands at ~96% progress. Everything dwells there.
            // Only when the user scrolls PAST 0.96 does anything start leaving.
            // Sequence:
            //   progress 0–0.96  → full dwell, nothing fades
            //   progress 0.96–1  → exitT ramps 0→1
            //     ep 0.00–0.45   → text slowly fades + slides left + blurs
            //     ep 0.45–0.60   → pause (text gone, HUD still visible)
            //     ep 0.60–0.75   → scrim fades
            //     ep 0.70–0.85   → progress bar slides down + fades
            //     ep 0.75–0.95   → dots slide right + fade (last to leave)
            const exitStart = 0.96;
            const exitT = progress > exitStart ? (progress - exitStart) / (1 - exitStart) : 0;
            const targetExit = Math.min(1, Math.max(0, exitT));
            // Slower damp (3) so it feels like a deliberate, drawn-out removal
            exitProgress.current = THREE.MathUtils.damp(exitProgress.current, targetExit, 3, delta);

            const ep = exitProgress.current;

            // Phase 1 (ep 0 → 0.45): Text fades slowly + slides left + blurs
            if (textRef.current) {
                const textT = Math.min(1, ep / 0.45);
                const eased = textT * textT; // quadratic ease-in
                textRef.current.style.opacity = (1 - eased).toString();
                textRef.current.style.transform = `translate3d(${-eased * 40}px, -50%, 0)`;
                textRef.current.style.filter = `blur(${eased * 6}px)`;
            }

            // Phase 2 (ep 0.45 → 0.60): HOLD — text gone, HUD stays

            // Phase 3a (ep 0.60 → 0.75): Scrim fades out
            if (scrimRef.current) {
                const scrimT = Math.max(0, Math.min(1, (ep - 0.60) / 0.15));
                scrimRef.current.style.opacity = (1 - scrimT).toString();
            }

            // Phase 3b (ep 0.70 → 0.85): Progress bar fades + slides down
            if (progressRef.current) {
                const barT = Math.max(0, Math.min(1, (ep - 0.70) / 0.15));
                const barEased = barT * barT;
                progressRef.current.style.opacity = (1 - barEased).toString();
                progressRef.current.style.transform = `translate3d(-50%, ${barEased * 24}px, 0)`;
            }

            // Phase 3c (ep 0.75 → 0.95): Dots fade + slide right (last to leave)
            if (dotsRef.current) {
                const dotsT = Math.max(0, Math.min(1, (ep - 0.75) / 0.20));
                const dotsEased = dotsT * dotsT;
                dotsRef.current.style.opacity = (1 - dotsEased).toString();
                dotsRef.current.style.transform = `translate3d(${dotsEased * 16}px, -50%, 0)`;
            }
        } else {
            // Reset exit state + inline styles when outside gallery
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
    });

    const activeItem = GALLERY_CONTENT[activeIndex];
    if (!activeItem) return null;

    return (
        <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
            <div
                ref={innerRef}
                className="absolute inset-0 w-full h-full"
                style={{
                    opacity: 0,
                    willChange: 'transform, opacity',
                }}
            >
                {/* OPTION 1: Left-side gradient scrim for text readability */}
                {/* <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0) 60%)',
                    }}
                /> */}

                {/* OPTION 2 (saved): Text shadow + stroke on title for readability
                    Title style: textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6), 2px 2px 8px rgba(0,0,0,0.8), -2px -2px 8px rgba(0,0,0,0.8)'
                    Desc style:  textShadow: '0 0 12px rgba(0,0,0,0.8), 1px 1px 4px rgba(0,0,0,0.7)'
                */}

                {/* OPTION 3 (saved): Frosted glass panel behind entire text block
                    <div className="absolute -inset-8 rounded-2xl backdrop-blur-xl bg-black/40"
                        style={{ maskImage: 'linear-gradient(to right, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)' }}
                    />
                */}

                {/* OPTION 4 (saved): Outlined / stroke text with -webkit-text-stroke
                    WebkitTextStroke: '1.5px rgba(0,0,0,0.7)', paintOrder: 'stroke fill', textShadow: '0 2px 20px rgba(0,0,0,0.7)'
                */}

                {/* OPTION 5 (active): Combo — left gradient scrim + text shadow */}
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
        </div>
    );
};

export default GalleryOverlay;