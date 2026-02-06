import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/canvas';
import { LoadingOverlay } from './components/overlays';

/**
 * App - Root component that sets up the 3D canvas.
 */
const App: React.FC = () => {
    return (
        <div className="w-full h-screen relative bg-black">
            {/* Header branding */}
            <div className="absolute top-8 left-8 z-50 pointer-events-none mix-blend-difference">
                <h1 className="text-white text-xl font-bold tracking-widest uppercase border-b border-white pb-2">
                    Vortex // Archives
                </h1>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-8 right-8 z-50 pointer-events-none">
                <span className="text-white text-xs opacity-50 uppercase tracking-widest">
                    Scroll to Explore
                </span>
            </div>

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 0], fov: 75 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
            </Canvas>

            {/* Loading overlay */}
            <LoadingOverlay />
        </div>
    );
};

export default App;
