import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Navbar } from './components/overlays';
import HeroSection from './components/overlays/HeroSection';
import LenisProvider from './providers/LenisProvider';

// DOM sections (outside Canvas — real scroll)
import { AboutSection } from './components/sections/about';
import GalleryOverlay from './components/sections/gallery/GalleryOverlay';
import HighlightsSection from './components/sections/gallery/HighlightsSection';
import ScheduleSection from './components/sections/schedule/ScheduleSection';
import TeamSection from './components/sections/team/TeamSection';

// 3D scene (inside Canvas)
import SceneSetup from './components/canvas/SceneSetup';
import { GalleryGroup } from './components/sections/gallery';

/**
 * App - Root component.
 *
 * Architecture:
 *   - LenisProvider wraps everything for smooth scroll
 *   - Canvas is position:fixed behind content (only renders 3D gallery)
 *   - <main> has real scroll height — all DOM sections live here
 *   - HeroSection is fixed overlay (fades on scroll via GSAP)
 *   - Navbar floats above everything
 */
const App: React.FC = () => {
    // Device tier detection — cap DPR on low-end mobile for ~4x GPU perf boost
    const dpr = useMemo<[number, number]>(() => {
        const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth < 768;
        if (isMobile && isSmallScreen) return [1, 1]; // No retina on low-end mobile
        if (isMobile) return [1, 1.5];                 // Capped retina on tablets
        return [1, 2];                                 // Full retina on desktop
    }, []);

    return (
        <LenisProvider>
            {/* Hero - fixed video + text, fades on scroll */}
            <HeroSection />

            {/* 3D Canvas - fixed layer behind content, only renders gallery */}
            <Canvas
                camera={{ position: [0, 0, 0], fov: 75 }}
                gl={{ antialias: !dpr[1] || dpr[1] <= 1 ? false : true, alpha: true }}
                dpr={dpr}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                <Suspense fallback={null}>
                    <SceneSetup />
                    <GalleryGroup />
                </Suspense>
            </Canvas>

            {/* Main scrollable content — real page height, real scroll */}
            <main style={{ position: 'relative', zIndex: 2 }}>
                {/* Spacer for Hero (takes up first viewport) */}
                <div style={{ height: '100vh' }} />

                {/* About section (fixed overlay) + scroll spacer */}
                <AboutSection />
                <div style={{ height: '200vh' }} />

                {/* Gallery trigger zone — tall div that drives 3D gallery rotation */}
                <div className="gallery-trigger" style={{ height: '500vh', position: 'relative' }}>
                    <GalleryOverlay />
                </div>

                {/* Post-gallery sections — each <section> provides:
                 *   1. Real scroll height for ScrollTrigger
                 *   2. Stable trigger ID (#highlights-section, etc.)
                 *   Components render position:sticky content inside */}
                <section id="highlights-section" style={{ height: '175vh', position: 'relative' }}>
                    <HighlightsSection />
                </section>

                <section id="schedule-section" style={{ position: 'relative' }}>
                    <ScheduleSection />
                </section>

                <section id="team-section" style={{ height: '150vh', position: 'relative' }}>
                    <TeamSection />
                </section>
            </main>

            {/* Navbar - highest z-index */}
            <Navbar />
        </LenisProvider>
    );
};

export default App;
