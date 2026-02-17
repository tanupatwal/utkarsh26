import React, { Suspense, useEffect, useLayoutEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/overlays';
import { Preload } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import HeroSection from './components/overlays/HeroSection';
import LenisProvider from './providers/LenisProvider';
import { galleryProgress } from './hooks/galleryProgress';
import { useIsMobile } from './hooks/useIsMobile';
import './styles/spacing.css';
import './styles/typography.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Precompile — Warms GPU shaders on mount to eliminate first-frame hitches.
 * Calls gl.compile(scene, camera) once so shaders are compiled before
 * the gallery comes into view.
 */
function Precompile() {
    const { gl, scene, camera } = useThree();
    useLayoutEffect(() => {
        gl.compile(scene, camera);
    }, [gl, scene, camera]);
    return null;
}

// DOM sections (outside Canvas — real scroll)
import { AboutSection } from './components/sections/about';
import GalleryOverlay from './components/sections/gallery/GalleryOverlay';
import HighlightsSection from './components/sections/gallery/HighlightsSection';
import ScheduleSection from './components/sections/schedule/ScheduleSection';
import TeamSection from './components/sections/team/TeamSection';
import MobileTeamSection from './components/sections/team/MobileTeamSection';
import MobileHighlightsSection from './components/sections/team/MobileHighlightsSection';
import FooterSection from './components/sections/footer/FooterSection';

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
    const isMobile = useIsMobile();

    // Device tier detection — cap DPR on low-end mobile for ~4x GPU perf boost
    const dpr = useMemo<[number, number]>(() => {
        const isMobileUA = /iPhone|iPad|Android/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth < 768;
        if (isMobileUA && isSmallScreen) return [1, 1]; // No retina on low-end mobile
        if (isMobileUA) return [1, 1.5];                 // Capped retina on tablets
        return [1, 2];                                 // Full retina on desktop
    }, []);

    // Drive gallery progress from ScrollTrigger (local 0→1, independent of other section heights)
    useEffect(() => {
        const st = ScrollTrigger.create({
            trigger: '#gallery-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                galleryProgress.current = self.progress;
            },
        });
        return () => st.kill();
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
                    <Precompile />
                    <Preload all />
                </Suspense>
            </Canvas>

            {/* Main scrollable content — real page height, real scroll */}
            <main style={{ position: 'relative', zIndex: 2 }}>
                {/* Spacer for Hero (takes up first viewport) */}
                <div id="hero-section" style={{ height: '100vh' }} />

                {/* About section (fixed overlay) + scroll spacer */}
                <div id="about-section">
                    <AboutSection />
                    <div style={{ height: isMobile ? '150vh' : '100vh' }} />
                </div>

                {/* Gallery section — drives 3D gallery + HUD via ScrollTrigger */}
                <section id="gallery-section" style={{ height: isMobile ? '300vh' : '500vh', position: 'relative' }}>
                    <GalleryOverlay />
                </section>

                {/* Post-gallery sections — each <section> provides:
                 *   1. Real scroll height for ScrollTrigger
                 *   2. Stable trigger ID (#highlights-section, etc.)
                 *   Components render position:sticky content inside */}
                <section id="highlights-section" style={{ height: isMobile ? 'auto' : '175vh', position: 'relative' }}>
                    {isMobile ? <MobileHighlightsSection /> : <HighlightsSection />}
                </section>

                <section id="schedule-section" style={{ position: 'relative' }}>
                    <ScheduleSection />
                </section>

                <section id="team-section" style={{ height: isMobile ? 'auto' : '400vh', position: 'relative' }}>
                    {isMobile ? <MobileTeamSection /> : <TeamSection />}
                </section>

                <FooterSection />
            </main>

            {/* Navbar - highest z-index */}
            <Navbar />
        </LenisProvider>
    );
};

export default App;
