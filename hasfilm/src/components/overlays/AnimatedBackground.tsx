import React, { useEffect, useState, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SCROLL_CONFIG, TRANSITION_CONFIG, rangeProgress } from '../../config';

/**
 * AnimatedBackground - Hero background with parallax image and effects.
 * Scrolls away/fades out as user moves past the hero section.
 */
const AnimatedBackground: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useFrame(() => {
    if (!containerRef.current) return;

    const r = scroll.offset;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    const compensateY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

    let scale = 1;
    let opacity = 1;

    // Stage 1: static hero background
    if (r < TRANSITION_CONFIG.HERO_HOLD_END) {
      scale = 1;
      opacity = 1;
    }
    // Stage 2: zoom only, no fade
    else if (r < TRANSITION_CONFIG.HERO_ZOOM_END) {
      const t = rangeProgress(r, TRANSITION_CONFIG.HERO_HOLD_END, TRANSITION_CONFIG.HERO_ZOOM_END);
      scale = 1 + t * (TRANSITION_CONFIG.BG_ZOOM_SCALE - 1);
      opacity = 1;
    }
    // Stage 3: handoff fade
    else if (r < TRANSITION_CONFIG.HERO_HANDOFF_END) {
      const t = rangeProgress(r, TRANSITION_CONFIG.HERO_ZOOM_END, TRANSITION_CONFIG.HERO_HANDOFF_END);
      scale = TRANSITION_CONFIG.BG_ZOOM_SCALE + t * (TRANSITION_CONFIG.BG_EXIT_SCALE - TRANSITION_CONFIG.BG_ZOOM_SCALE);
      opacity = 1 - t;
    } else {
      scale = TRANSITION_CONFIG.BG_EXIT_SCALE;
      opacity = 0;
    }

    containerRef.current.style.opacity = opacity.toString();
    containerRef.current.style.transform = `translate3d(0, ${compensateY}px, 0) scale(${scale})`;
    containerRef.current.style.display = opacity <= 0.01 ? 'none' : 'block';
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: '#0B0F1A',
        transformOrigin: 'center center',
      }}
    >
      {/* 
        Background Image with Cover
      */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg-4k-source.png"
          alt="Utkarsh Hero Background - Fusion of Heritage and Tech"
          className="w-full h-full object-cover object-center"
          style={{
            imageRendering: 'auto',
          }}
        />

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(11, 15, 26, 0.35)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>

      {/* 
        Split Reveal Effects - Left Mandala & Right Circuit Glow
      */}
      {isMounted && (
        <>
          {/* Left Heritage Mandala Glow */}
          <div
            className="absolute inset-y-0 left-0 w-1/2 pointer-events-none animate-slide-in-left"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(255, 153, 51, 0.06) 0%, transparent 60%)',
              zIndex: 5
            }}
          />

          {/* Right Tech Circuit Glow */}
          <div
            className="absolute inset-y-0 right-0 w-1/2 pointer-events-none animate-slide-in-right"
            style={{
              background: 'radial-gradient(circle at 70% 50%, rgba(0, 240, 255, 0.06) 0%, transparent 60%)',
              zIndex: 5
            }}
          />
        </>
      )}

      {/* 
        Floating Embers - Center Transition
      */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Ember particles with CSS animations */}
        {[...Array(4)].map((_, i) => {
          const offsetX = (Math.random() - 0.5) * 15;
          const startY = 40 + Math.random() * 20;
          const size = Math.random() * 3 + 2;
          const duration = Math.random() * 4 + 6;
          const delay = Math.random() * 4;

          return (
            <div
              key={`ember-${i}`}
              className="absolute rounded-full animate-float-up"
              style={{
                width: size,
                height: size,
                top: `${startY}%`,
                left: `${50 + offsetX}%`,
                opacity: 0.25,
                filter: 'blur(1.5px)',
                background: 'linear-gradient(135deg, #FF7A3D, #F5C16C)',
                boxShadow: '0 0 10px 2px rgba(255, 122, 61, 0.25)',
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* Central Seamless Blend Divider */}
      <div
        className="absolute top-0 bottom-0 left-[47%] w-[6%] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,200,100,0.03), rgba(100,200,255,0.03), transparent)',
          filter: 'blur(25px)',
          mixBlendMode: 'screen',
          zIndex: 15
        }}
      />

      {/* Animation keyframes */}
      <style>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-5%);
            opacity: 0;
          }
          to {
            transform: translateX(0%);
            opacity: 1;
          }
        }
        
        @keyframes slide-in-right {
          from {
            transform: translateX(5%);
            opacity: 0;
          }
          to {
            transform: translateX(0%);
            opacity: 1;
          }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 0.25;
          }
          50% {
            opacity: 0.35;
            transform: translateY(-80px) scale(1.2);
          }
          100% {
            transform: translateY(-120px) scale(0.8);
            opacity: 0;
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-float-up {
          animation: float-up infinite ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
