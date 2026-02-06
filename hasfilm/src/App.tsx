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

            {/* Header branding - UTKARSH themed */}
            <div className="absolute top-8 left-8 z-50 pointer-events-none">
                <h1
                    className="text-xl font-bold tracking-widest uppercase pb-2"
                    style={{
                        fontFamily: "'Orbitron', sans-serif",
                        background: 'linear-gradient(90deg, #F5C16C, #00E5FF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(245, 193, 108, 0.3)',
                    }}
                >
                    UTKARSH 2026
                </h1>
            </div>

            {/* Scroll hint - only shown when hero fades */}

            {/* 3D Canvas - transparent to show background initially */}
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

            {/* Loading overlay */}
            <LoadingOverlay />
        </div>
    );
};

export default App;
