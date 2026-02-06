'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import CylinderExperience from './3d/CylinderExperience';
import HeroSection from './HeroSection';

const ScrollyTellingSequence: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Hero fade-out on scroll (CSS-based, synced with 3D tunnel)
    useEffect(() => {
        const handleScroll = () => {
            if (!heroRef.current || !containerRef.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const totalScrollHeight = containerRef.current.scrollHeight - windowHeight;

            // Hero fades in first 15% of scroll
            const heroProgress = Math.min(scrollY / (totalScrollHeight * 0.15), 1);
            const opacity = 1 - heroProgress;
            const scale = 1 + heroProgress * 4; // Zoom effect

            heroRef.current.style.opacity = String(opacity);
            heroRef.current.style.transform = `scale(${scale})`;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-black"
            style={{ height: '800vh' }} // 8 pages of scroll for full experience
        >
            {/* Fixed Hero Section - fades out as you scroll */}
            <div
                ref={heroRef}
                className="fixed inset-0 w-full h-screen z-20 origin-center will-change-transform"
                style={{
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'none' // Allow scroll through
                }}
            >
                <HeroSection />
            </div>

            {/* 3D Canvas - Full screen fixed, native scroll controls the experience */}
            <div className="fixed inset-0 w-full h-screen z-10">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: 'high-performance'
                    }}
                    dpr={[1, 2]}
                >
                    <Suspense fallback={null}>
                        <CylinderExperience />
                    </Suspense>
                </Canvas>
            </div>

            {/* Vignette Overlay for depth focus */}
            <div
                className="fixed inset-0 pointer-events-none z-30"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)'
                }}
            />

            {/* Scroll Hint */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                <div className="text-white/50 text-xs tracking-widest uppercase animate-bounce">
                    Scroll to Explore
                </div>
            </div>
        </div>
    );
};

export default ScrollyTellingSequence;
