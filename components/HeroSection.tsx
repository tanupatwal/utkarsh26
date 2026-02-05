'use client';

import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './hero/AnimatedBackground';
import HeroContent from './hero/HeroContent';
// import { motion, useScroll, useTransform } from 'framer-motion'; // Removed unused imports

const HeroSection: React.FC = () => {
  const ref = React.useRef(null);
  /* 
   * Previous scroll logic removed to allow GSAP ScrollyTellingSequence 
   * to control the transition.
   */
  // const { scrollYProgress } = useScroll(...);
  // const opacity = useTransform(...);
  // const scale = useTransform(...);
  // const y = useTransform(...);

  return (
    <section ref={ref} className="relative w-full h-[100dvh] bg-navy-dark overflow-hidden">
      {/* 2. The Navigation Bar (Fixed z-50 to stay on top) */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Content Wrapper */}
      <div className="w-full h-full relative">
        {/* 1. The Animated Background Layer (Split Screen + Particles) */}
        <AnimatedBackground />

        {/* 3. The Main Hero Content (Typography & Buttons) */}
        <HeroContent />
      </div>
    </section>
  );
};

export default HeroSection;
