import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/canvas';
import { Navbar } from './components/overlays';
import HeroSection from './components/overlays/HeroSection';


/**
 * App - Root component that sets up the 3D canvas.
 */
const App: React.FC = () => {
    return (
        <div className="w-full h-screen relative bg-black">

            {/* Hero - simple video + text, outside Canvas */}
            <HeroSection />

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 0], fov: 75 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
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
