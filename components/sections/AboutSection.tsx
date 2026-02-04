'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Utility Components for Animations ---

function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  // A simplified version of a marquee or parallax text if needed.
  // For now, we will just use standard motion elements.
  return <span>{children}</span>;
}

const RevealTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.h2>
  );
};

const RevealText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// --- Main Component ---

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Progress for Parallax Background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring physics for the parallax
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax transforms
  const yBackground = useTransform(springScroll, [0, 1], ["0%", "30%"]);
  const yHeritage = useTransform(springScroll, [0, 1], ["-10%", "20%"]);
  const yTech = useTransform(springScroll, [0, 1], ["10%", "-20%"]);
  const rotateMandala = useTransform(springScroll, [0, 1], [0, 90]);
  const scaleCircuit = useTransform(springScroll, [0, 1], [0.8, 1.2]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen py-24 md:py-40 bg-navy-dark overflow-hidden flex items-center justify-center"
      id="about"
    >
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {/* Heritage Gradient Blob */}
        <motion.div 
            style={{ y: yHeritage }}
            className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] bg-heritage-saffron/10 rounded-full blur-[120px]" 
        />
        {/* Tech Gradient Blob */}
        <motion.div 
            style={{ y: yTech }}
            className="absolute top-1/3 -right-1/4 w-[60vw] h-[60vw] bg-tech-purple/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- Decorative Elements (Parallax) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Spinning Mandala (Left) */}
        <motion.div 
          style={{ rotate: rotateMandala, y: yHeritage, opacity: 0.15 }}
          className="absolute top-10 -left-64 md:-left-32 w-[600px] h-[600px] border-[1px] border-heritage-gold rounded-full border-dashed"
        >
             <div className="absolute inset-4 border border-heritage-orange rounded-full opacity-50" />
             <div className="absolute inset-12 border border-heritage-red rounded-full opacity-30" />
        </motion.div>

        {/* Tech Circuit Grid (Right) */}
        <motion.div 
           style={{ scale: scaleCircuit, y: yTech, opacity: 0.15 }}
           className="absolute bottom-10 -right-64 md:-right-32 w-[600px] h-[600px]"
        >
            <div className="w-full h-full border border-tech-cyan/30 bg-[linear-gradient(45deg,transparent_25%,rgba(0,240,255,0.05)_50%,transparent_75%)] bg-[length:50px_50px]" />
        </motion.div>
      </div>


      {/* --- Main Content Container --- */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
        
        {/* Left Side: Visual/Text Title Block */}
        <div className="w-full md:w-1/2 text-center md:text-left">
            <RevealTitle className="font-outfit text-sm md:text-base tracking-[0.3em] text-heritage-gold uppercase mb-4">
                The Legacy Continues
            </RevealTitle>
            
            <RevealTitle className="font-cinzel text-5xl md:text-7xl lg:text-8xl leading-tight text-white mb-8">
                ABOUT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-saffron via-white to-tech-cyan">
                  UTKARSH
                </span>
            </RevealTitle>

            <motion.div
              style={{ scaleX: useTransform(scrollYProgress, [0.1, 0.4], [0, 1]) }}
              className="h-1 w-32 md:w-64 bg-gradient-to-r from-heritage-orange to-tech-blue origin-left mb-10 mx-auto md:mx-0"
            />
            
            {/* Stats / Highlight */}
            <div className="flex justify-center md:justify-start gap-12 text-center">
                <RevealText delay={0.2}>
                    <div className="font-orbitron text-4xl font-bold text-white mb-2">18+</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Years</div>
                </RevealText>
                <RevealText delay={0.3}>
                    <div className="font-orbitron text-4xl font-bold text-white mb-2">20k+</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Footfall</div>
                </RevealText>
                <RevealText delay={0.4}>
                    <div className="font-orbitron text-4xl font-bold text-white mb-2">50+</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Events</div>
                </RevealText>
            </div>
        </div>

        {/* Right Side: Narrative Content */}
        <div className="w-full md:w-1/2">
            <div className="relative p-8 md:p-12 backdrop-blur-sm bg-navy-card/30 border border-white/10 rounded-2xl">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-heritage-gold rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-tech-cyan rounded-br-xl" />

                <RevealText delay={0.1}>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-300 font-outfit mb-6">
                        <span className="text-heritage-gold font-bold">Utkarsh</span>, formerly known as <span className="text-white font-medium">INNOVIZ</span>, is a three-day extravaganza celebrating arts, culture, and engineering.
                    </p>
                </RevealText>

                <RevealText delay={0.2}>
                    <p className="text-base md:text-lg leading-relaxed text-gray-400 font-outfit mb-6">
                        As a premier tech fest, it brings together bright minds, groundbreaking ideas, and cutting-edge advancements that shape the future. From hands-on workshops and competitive hackathons to insightful talks by industry experts.
                    </p>
                </RevealText>

                <RevealText delay={0.3}>
                     <p className="text-base md:text-lg leading-relaxed text-gray-400 font-outfit">
                        Since its inception in <span className="text-tech-cyan font-bold">2006</span>, UTKARSH has established itself as a premier event in Delhi & NCR. Join us in pushing boundaries, redefining the present, and pioneering a smarter tomorrow.
                    </p>
                </RevealText>

                 {/* Interactive Element (Optional CTA or Decor) */}
                 <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between"
                 >
                    <span className="text-sm font-medium text-white/60">February 2026</span>
                    <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-heritage-red animate-pulse" />
                        <div className="h-2 w-2 rounded-full bg-tech-blue animate-pulse delay-75" />
                        <div className="h-2 w-2 rounded-full bg-heritage-gold animate-pulse delay-150" />
                    </div>
                </motion.div>
            </div>
        </div>

      </div>

      {/* Smooth transition gradient at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-navy-dark to-transparent z-10" />
    </section>
  );
}
