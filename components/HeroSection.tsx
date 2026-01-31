'use client';

import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './hero/AnimatedBackground';
import HeroContent from './hero/HeroContent';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-navy-dark overflow-hidden">
      {/* 1. The Animated Background Layer (Split Screen + Particles) */}
      <AnimatedBackground />

      {/* 2. The Navigation Bar (Glassmorphism) */}
      <Navbar />

      {/* 3. The Main Hero Content (Typography & Buttons) */}
      <HeroContent />
      
    </section>
  );
};

export default HeroSection;
