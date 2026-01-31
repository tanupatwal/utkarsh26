'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroContent() {
  return (
    <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-start items-center text-center pt-[15vh]">
      {/* Moved title down 15vh (~10-12% of hero height) */}
      
      {/* Main Title with Glossy Effect + Highlight Band + Outline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-6 relative"
      >
        {/* Highlighter Band Wrapper */}
        <div 
          className="relative px-8 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(to right, rgba(245,193,108,0.12), rgba(0,229,255,0.12))',
            backdropFilter: 'blur(3px)',
          }}
        >
          {/* UTKARSH Title - Glossy Gradient with Outline */}
          <h1 
            className="text-7xl md:text-9xl font-black font-orbitron tracking-tighter leading-none relative"
            style={{
              fontWeight: 900,
              // Vertical glossy gradient (white shine at top)
              background: 'linear-gradient(180deg, #ffffff 0%, #F5C16C 30%, #FF8C42 55%, #00E5FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              // Strong outline for separation from busy background
              WebkitTextStroke: '1px rgba(0, 0, 0, 0.6)',
              // Soft glow + shadow for depth
              textShadow: '0 0 25px rgba(255, 180, 80, 0.35), 0 2px 10px rgba(0, 0, 0, 0.4)',
            }}
          >
            UTKARSH
          </h1>
          
          {/* Year 2026 - Badge feel with cyan glow */}
          <h2 
            className="text-3xl md:text-5xl font-bold font-orbitron mt-2"
            style={{
              fontWeight: 800,
              color: '#9EEAFF',
              letterSpacing: '0.35em',
              textShadow: '0 0 15px rgba(0, 229, 255, 0.6), 0 2px 8px rgba(0, 0, 0, 0.5)',
              WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.4)',
            }}
          >
            2026
          </h2>
        </div>
      </motion.div>

      {/* Subtitle - Enhanced with better text shadow to prevent vanishing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg md:text-xl font-outfit max-w-2xl mx-auto mb-8 leading-relaxed hero-subtitle"
        style={{
          color: 'rgba(255, 255, 255, 0.92)',
          marginTop: '20px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
        }}
      >
        <p className="mb-2">
          Where <span className="hero-trad" style={{ color: '#F5C16C', fontWeight: 600 }}>Tradition</span> Meets <span className="hero-tech" style={{ color: '#00E5FF', fontWeight: 600 }}>Technology</span>.
        </p>
        <p>
          Celebrating 20 Years of <span className="hero-trad" style={{ color: '#F5C16C', fontWeight: 600 }}>Innovation</span> & <span className="hero-tech" style={{ color: '#00E5FF', fontWeight: 600 }}>Culture</span>.
        </p>
      </motion.div>

      {/* CTA Buttons - 30px below subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col md:flex-row gap-6 items-center"
        style={{ marginTop: '30px' }}
      >
        {/* Primary Button - Explore Heritage */}
        <Link href="#heritage">
          <button 
            className="group relative px-10 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 overflow-hidden min-h-[48px]"
            style={{
              background: 'linear-gradient(90deg, #F5C16C, #FF9F43)',
              color: '#0B0F1A',
              boxShadow: '0 8px 24px rgba(245, 193, 108, 0.3)',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 193, 108, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 193, 108, 0.3)';
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Heritage <Sparkles className="w-5 h-5" />
            </span>
          </button>
        </Link>

        {/* Secondary Button - Discover Innovation */}
        <Link href="#innovation">
          <button 
            className="group relative px-10 py-4 rounded-xl font-medium text-lg tracking-wide transition-all duration-300 overflow-hidden min-h-[48px]"
            style={{
              background: 'rgba(0, 229, 255, 0.04)',
              border: '1px solid rgba(0, 229, 255, 0.12)',
              color: '#EAF6FF',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(0, 229, 255, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = '#00E5FF';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(0, 229, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.12)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 229, 255, 0.08)';
              e.currentTarget.style.background = 'rgba(0, 229, 255, 0.04)';
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Discover Innovation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </Link>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-scroll-down" />
        </div>
      </motion.div>
    </div>
  );
}
