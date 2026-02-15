
import { Canvas } from '@react-three/fiber';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/hero/HeroSection';
import AboutSection from '@/components/sections/about/AboutSection';
import GallerySection from '@/components/sections/gallery/GallerySection';
import HighlightsSection from '@/components/sections/highlights/HighlightsSection';
import ScheduleSection from '@/components/sections/schedule/ScheduleSection';
import TeamSection from '@/components/sections/team/TeamSection';
import Footer from '@/components/sections/Footer';
import { SceneSetup } from '@/components/canvas/SceneSetup';
import { GalleryCylinder } from '@/components/canvas/GalleryCylinder';

function App() {
  // Initialize Lenis + GSAP + Zustand bridge
  useLenis();

  return (
    <>
      {/* 1. Global UI */}
      <Navbar />

      {/* 2. Scrollable Content (Natural Flow) */}
      <main>
        <div id="hero"><HeroSection /></div>
        <div id="about"><AboutSection /></div>
        <div id="gallery"><GallerySection /></div> {/* 2. Transparent HTML Overlay for 3D */}
        <div id="highlights"><HighlightsSection /></div>
        <div id="schedule"><ScheduleSection /></div>
        <div id="team"><TeamSection /></div>
        <Footer />
      </main>

      {/* 3. Fixed 3D Background */}
      <Canvas
        className="webgl-canvas"
        camera={{ position: [0, 0, 12], fov: 35 }}
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
