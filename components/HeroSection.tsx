'use client';

import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './hero/AnimatedBackground';
import HeroContent from './hero/HeroContent';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroSection: React.FC = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

  return (
    <section ref={ref} className="relative w-full h-[100dvh] bg-navy-dark overflow-hidden">
      {/* 2. The Navigation Bar (Fixed z-50 to stay on top) */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Hero Content Wrapper with Scroll Effects */}
      <motion.div style={{ opacity, scale, y }} className="w-full h-full relative">
          {/* 1. The Animated Background Layer (Split Screen + Particles) */}
          <AnimatedBackground />

          {/* 3. The Main Hero Content (Typography & Buttons) */}
          <HeroContent />
      </motion.div>
    </section>
  );
};

export default HeroSection;
