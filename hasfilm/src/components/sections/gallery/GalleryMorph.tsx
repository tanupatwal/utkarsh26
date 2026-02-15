// src/components/sections/gallery/GalleryMorph.tsx
// Morphs the last gallery image into a fullscreen cover with parallax zoom,
// bridging the gallery section into the highlights section.

import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GALLERY_CONTENT } from '../../../data/gallery';
import { TIMELINE } from '../../../config/timeline';
import { SCROLL_CONFIG } from '../../../config/scroll';

const GalleryMorph: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Last gallery image
    const lastImage = GALLERY_CONTENT[GALLERY_CONTENT.length - 1]!;

    useFrame(() => {
        if (!containerRef.current || !imageRef.current || !overlayRef.current) return;

        const r = scroll.offset;

        // PERF: Skip ALL computation when scroll is far from our range
        if (r < TIMELINE.GALLERY_END - 0.04 || r > TIMELINE.MORPH_END + 0.04) {
            if (containerRef.current.style.visibility !== 'hidden') {
                containerRef.current.style.opacity = '0';
                containerRef.current.style.visibility = 'hidden';
            }
            return;
        }

        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        // Scroll compensation
        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
        containerRef.current.style.visibility = 'visible';

        // === MORPH PHASE (GALLERY_END → MORPH_END) ===
        // Phase 1: Image expands from center to fullscreen (GALLERY_END → MORPH_START+half)
        // Phase 2: Parallax zoom — image scales past 100% (MORPH_START+half → MORPH_END)

        const morphProgress = (r - TIMELINE.GALLERY_END) / (TIMELINE.MORPH_END - TIMELINE.GALLERY_END);
        const mp = Math.max(0, Math.min(1, morphProgress));

        // Visibility: only show during morph phase
        if (mp <= 0 || r > TIMELINE.HIGHLIGHTS_START + 0.02) {
            containerRef.current.style.opacity = '0';
            containerRef.current.style.pointerEvents = 'none';
            return;
        }

        containerRef.current.style.opacity = '1';

        // --- Image morph ---
        // Start: small centered rectangle (simulating the gallery panel)
        // End: fullscreen with slight overshoot for parallax feel
        const expandPhase = Math.min(1, mp / 0.5); // 0→1 over first half
        const expandEased = expandPhase < 1
            ? expandPhase * expandPhase * (3 - 2 * expandPhase) // smoothstep
            : 1;

        // Scale: starts at 0.35 (roughly panel size), expands to 1.0, then parallax zoom to 1.15
        const baseScale = THREE.MathUtils.lerp(0.35, 1.0, expandEased);
        const parallaxPhase = Math.max(0, (mp - 0.5) / 0.5); // 0→1 over second half
        const parallaxZoom = 1 + parallaxPhase * 0.18; // subtle 18% overshoot
        const finalScale = baseScale * parallaxZoom;

        // Border radius: starts rounded, goes to 0
        const borderRadius = THREE.MathUtils.lerp(24, 0, expandEased);

        // Slight upward drift for parallax feel
        const yOffset = THREE.MathUtils.lerp(0, -30, parallaxPhase);

        imageRef.current.style.transform = `scale(${finalScale}) translateY(${yOffset}px)`;
        imageRef.current.style.borderRadius = `${borderRadius}px`;

        // Dark overlay that fades in during parallax zoom phase to ease into highlights
        const overlayOpacity = Math.max(0, parallaxPhase * 0.7);
        overlayRef.current.style.opacity = overlayOpacity.toString();
    });

    return (
        <div className="fixed inset-0 w-full h-full z-[9] pointer-events-none">
            <div
                ref={containerRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0, willChange: 'transform, opacity' }}
            >
                {/* Fullscreen image container */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div
                        ref={imageRef}
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${lastImage.url})`,
                            willChange: 'transform, border-radius',
                            transformOrigin: 'center center',
                        }}
                    />
                </div>

                {/* Dark overlay for transition into highlights */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: 0 }}
                />
            </div>
        </div>
    );
};

export default GalleryMorph;
