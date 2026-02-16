import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/canvas';
import { Navbar } from './components/overlays';
import HeroSection from './components/overlays/HeroSection';


/**
 * App - Root component that sets up the 3D canvas.
 * Includes mobile device-tier detection for GPU performance scaling.
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
        <div className="w-full relative bg-black" style={{ height: '100dvh' }}>

            {/* Hero - simple video + text, outside Canvas */}
            <HeroSection />

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 0], fov: 75 }}
                gl={{ antialias: !dpr[1] || dpr[1] <= 1 ? false : true, alpha: true }}
                dpr={dpr}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
            >
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
            </Canvas>

            {/* Navbar */}
            <Navbar />
        </div>
    );
};


export default App;

