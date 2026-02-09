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
    const containerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    useFrame((_state, delta) => {
        if (!containerRef.current) return;

        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const compensateY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        // 1. Visibility Logic: Fade in/out based on timeline
        const isVisible = r >= (TIMELINE.ABOUT_STAY - 0.05) && r <= TIMELINE.END;
        const targetOpacity = isVisible ? 1 : 0;
        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 4, delta);

        // Apply scroll compensation + opacity directly to DOM (avoids 60fps re-renders)
        containerRef.current.style.transform = `translate3d(0, ${compensateY}px, 0)`;
        containerRef.current.style.opacity = opacityRef.current.toString();
        containerRef.current.style.pointerEvents = opacityRef.current > 0.1 ? 'auto' : 'none';

        // 2. Active Index Calculation
        if (r >= TIMELINE.GALLERY_START) {
            const totalItems = GALLERY_CONTENT.length;
            const progress = (r - TIMELINE.GALLERY_START) / (TIMELINE.END - TIMELINE.GALLERY_START);
            
            const rawIndex = progress * (totalItems - 1);
            const snappedIndex = Math.round(rawIndex);
            const index = Math.max(0, Math.min(snappedIndex, totalItems - 1));
            
            if (index !== activeIndex) {
                setActiveIndex(index);
            }
        }
    });

    const activeItem = GALLERY_CONTENT[activeIndex];
    if (!activeItem) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full z-10 pointer-events-none"
            style={{
                opacity: 0,
                willChange: 'transform, opacity',
            }}
        >
            {/* 1. Progress Bar (Bottom HUD) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-80 h-[2px] bg-white/10">
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
            <div className="absolute top-1/2 left-8 md:left-20 -translate-y-1/2 max-w-lg">
                <div className="overflow-hidden">
                    <h2 
                        className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none transition-transform duration-500 ease-out"
                    >
                        {activeItem.title}
                    </h2>
                </div>
                
                {/* Description Box */}
                <div className="mt-6 p-6 backdrop-blur-md bg-black/30 border-l-2 border-blue-500/50">
                    <p className="text-lg text-white/80 leading-relaxed font-light">
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
            <div className="absolute top-1/2 right-8 md:right-12 -translate-y-1/2 flex flex-col items-center gap-4">
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