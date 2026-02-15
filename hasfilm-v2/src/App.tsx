
import { Canvas } from '@react-three/fiber';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/hero/HeroSection';
import AboutSection from '@/components/sections/about/AboutSection';
import GallerySection from '@/components/sections/gallery/GallerySection';
import HighlightsSection from '@/components/sections/highlights/HighlightsSection';
import ScheduleSection from '@/components/sections/schedule/ScheduleSection';
import TeamSection from '@/components/sections/team/TeamSection';
import { SceneSetup, GalleryCylinder } from '@/components/canvas/PlaceholderScene';

function App() {
  // Initialize Lenis + GSAP + Zustand bridge
  useLenis();

  return (
    <>
      {/* 1. Global UI */}
      <Navbar />

      {/* 2. Scrollable Content (Natural Flow) */}
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <HighlightsSection />
        <ScheduleSection />
        <TeamSection />
      </main>

      {/* 3. Fixed 3D Background */}
      <Canvas
        className="webgl-canvas"
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <SceneSetup />
        <GalleryCylinder />
      </Canvas>
    </>
  );
}

export default App;
