import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/sections/AboutSection';

export default function Home() {
  return (
    <main className="bg-navy-dark min-h-screen">
      <HeroSection />
      <AboutSection />
    </main>
  );
}