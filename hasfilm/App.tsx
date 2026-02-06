import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen relative bg-black">
      <div className="absolute top-8 left-8 z-50 pointer-events-none mix-blend-difference">
         <h1 className="text-white text-xl font-bold tracking-widest uppercase border-b border-white pb-2">
           Vortex // Archives
         </h1>
      </div>

      <div className="absolute bottom-8 right-8 z-50 pointer-events-none">
        <span className="text-white text-xs opacity-50 uppercase tracking-widest">
           Scroll to Explore
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Handle high DPI screens
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      
      {/* Loading Overlay */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none transition-opacity duration-1000 opacity-0 animate-fade-out"
           style={{ animation: 'fadeOut 1s forwards 2s' }}>
          <div className="text-white text-sm tracking-widest uppercase">Initializing Simulation...</div>
      </div>
      
      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; display: none; }
        }
      `}</style>
    </div>
  );
};

export default App;