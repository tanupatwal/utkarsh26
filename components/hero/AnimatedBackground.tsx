'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function AnimatedBackground() {
  const { scrollY } = useScroll();
  const [isMounted, setIsMounted] = useState(false);

  // Parallax effect: background moves 12% slower than content
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -120]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-navy-dark">
      {/* 
        -----------------------------------------------------------------
        RESPONSIVE 4K BACKGROUND IMAGE WITH PARALLAX - ULTRA SHARP
        -----------------------------------------------------------------
      */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {/* Using Next.js Image optimization with responsive loading */}
        <div className="relative w-full h-[120vh]">
          <Image
            src="/assets/hero-bg-4k-source.png"
            alt="Utkarsh Hero Background - Fusion of Heritage and Tech"
            fill
            priority
            quality={90} // Increased quality for ultra-sharp rendering
            sizes="100vw"
            className="object-cover object-center"
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              imageRendering: 'crisp-edges', // Ensures sharp rendering
            }}
          />
        </div>
        
        {/* Dark overlay for text readability - reduced for sharper background */}
        <div className="absolute inset-0 bg-navy-dark/35 mix-blend-multiply" />
      </motion.div>

      {/* 
        -----------------------------------------------------------------
        SPLIT REVEAL ANIMATIONS - Left Mandala & Right Circuit
        -----------------------------------------------------------------
      */}
      {isMounted && (
        <>
          {/* Left Heritage Mandala - Slide in from left */}
          <motion.div
            initial={{ x: '-5%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: 'easeOut',
              delay: 0.2 
            }}
            className="absolute inset-y-0 left-0 w-1/2 pointer-events-none z-5"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(255, 153, 51, 0.06) 0%, transparent 60%)'
            }}
          />

          {/* Right Tech Circuit - Slide in from right */}
          <motion.div
            initial={{ x: '5%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: 'easeOut',
              delay: 0.2 
            }}
            className="absolute inset-y-0 right-0 w-1/2 pointer-events-none z-5"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(0, 240, 255, 0.06) 0%, transparent 60%)'
            }}
          />
        </>
      )}

      {/* 
        -----------------------------------------------------------------
        FLOATING EMBERS - CENTER TRANSITION ONLY
        -----------------------------------------------------------------
      */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Center-focused ember particles (4 total, very subtle) */}
        {[...Array(4)].map((_, i) => {
          const offsetX = (Math.random() - 0.5) * 15; // Random spread ±7.5% from center
          const startY = 40 + Math.random() * 20; // Start between 40-60% height
          
          return (
            <motion.div
              key={`center-ember-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-[#FF7A3D] to-[#F5C16C]"
              style={{
                width: Math.random() * 3 + 2, // 2-5px
                height: Math.random() * 3 + 2,
                top: `${startY}%`,
                left: `${50 + offsetX}%`, // Cluster around 50% (center)
                opacity: 0.25,
                filter: 'blur(1.5px)',
                boxShadow: '0 0 10px 2px rgba(255, 122, 61, 0.25)'
              }}
              animate={{
                y: [0, -80, -120],
                opacity: [0.25, 0.35, 0],
                scale: [1, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 4 + 6, // 6-10 seconds (very slow)
                repeat: Infinity,
                ease: "easeOut",
                delay: Math.random() * 4
              }}
            />
          );
        })}
      </div>

      {/* Central Seamless Blend/Divider - Subtle glow line */}
      <div 
        className="absolute top-0 bottom-0 left-[47%] w-[6%] z-15 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,200,100,0.03), rgba(100,200,255,0.03), transparent)',
          filter: 'blur(25px)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
