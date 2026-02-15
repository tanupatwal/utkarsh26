// src/components/sections/gallery/GalleryTransitionOverlay.tsx
import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE } from '../../../config/timeline';
import { SCROLL_CONFIG } from '../../../config/scroll';

/**
 * GalleryTransitionOverlay - Handles the crossfade transition from Gallery to Event Highlights.
 * Fades to black between scroll progress 1.0 and 1.02.
 */
const GalleryTransitionOverlay: React.FC = () => {
    const scroll = useScroll();
    const innerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    useFrame((_state, delta) => {
        if (!innerRef.current) return;

        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        // Fade to black from END (1.0) to EVENT_HIGHLIGHTS_VISIBLE (1.02)
        // Then fade back to transparent for Event Highlights to show
        const fadeInStart = TIMELINE.END;
        const fadeInEnd = TIMELINE.EVENT_HIGHLIGHTS_VISIBLE;
        const fadeOutStart = TIMELINE.EVENT_HIGHLIGHTS_VISIBLE;
        const fadeOutEnd = TIMELINE.EVENT_HIGHLIGHTS_VISIBLE + 0.02;

        let targetOpacity = 0;

        if (r < fadeInStart) {
            targetOpacity = 0;
        } else if (r >= fadeInStart && r < fadeInEnd) {
            // Fade to black
            targetOpacity = (r - fadeInStart) / (fadeInEnd - fadeInStart);
        } else if (r >= fadeOutStart && r < fadeOutEnd) {
            // Fade from black
            targetOpacity = 1 - (r - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        } else {
            targetOpacity = 0;
        }

        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 4, delta);

        innerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
        innerRef.current.style.opacity = opacityRef.current.toString();
    });

    return (
        <div className="fixed inset-0 w-full h-full z-20 pointer-events-none">
            <div
                ref={innerRef}
                className="absolute inset-0 w-full h-full bg-black"
                style={{
                    opacity: 0,
                    willChange: 'transform, opacity',
                }}
            />
        </div>
    );
};

export default GalleryTransitionOverlay;
