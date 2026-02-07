import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { SCROLL_CONFIG, TIMELINE, TRANSITION_CONFIG, rangeProgress } from '../../config';

/**
 * HeroOverlay - UTKARSH 2026 hero content with scroll-based visibility.
 * Displays the main event branding during the tunnel phase.
 */
const HeroOverlay: React.FC = () => {
    const scroll = useScroll();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const matteRef = React.useRef<HTMLDivElement>(null);

    useFrame(() => {
        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const compensateY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        if (!containerRef.current || !matteRef.current) return;

        let scale = 1;
        let opacity = 1;

        // Stage 1: static hero
        if (r < TRANSITION_CONFIG.HERO_HOLD_END) {
            scale = 1;
            opacity = 1;
        }
        // Stage 2: zoom only (no fade)
        else if (r < TRANSITION_CONFIG.HERO_ZOOM_END) {
            const t = rangeProgress(r, TRANSITION_CONFIG.HERO_HOLD_END, TRANSITION_CONFIG.HERO_ZOOM_END);
            scale = 1 + t * (TRANSITION_CONFIG.HERO_ZOOM_SCALE - 1);
            opacity = 1;
        }
        // Stage 3: handoff (quick fade while zooming)
        else if (r < TRANSITION_CONFIG.HERO_HANDOFF_END) {
            const t = rangeProgress(r, TRANSITION_CONFIG.HERO_ZOOM_END, TRANSITION_CONFIG.HERO_HANDOFF_END);
            scale = TRANSITION_CONFIG.HERO_ZOOM_SCALE + t * (TRANSITION_CONFIG.HERO_EXIT_SCALE - TRANSITION_CONFIG.HERO_ZOOM_SCALE);
            opacity = 1 - t;
        } else {
            opacity = 0;
            scale = TRANSITION_CONFIG.HERO_EXIT_SCALE;
        }

        // Black matte masks tunnel during handoff to avoid visible overlap
        let matteOpacity = 0;
        if (r >= TRANSITION_CONFIG.HERO_ZOOM_END && r < TRANSITION_CONFIG.HERO_HANDOFF_END) {
            matteOpacity = rangeProgress(r, TRANSITION_CONFIG.HERO_ZOOM_END, TRANSITION_CONFIG.HERO_HANDOFF_END);
        } else if (r >= TRANSITION_CONFIG.HERO_HANDOFF_END && r < TRANSITION_CONFIG.BLACKOUT_RELEASE_END) {
            matteOpacity = 1 - rangeProgress(r, TRANSITION_CONFIG.HERO_HANDOFF_END, TRANSITION_CONFIG.BLACKOUT_RELEASE_END);
        } else {
            matteOpacity = 0;
        }

        if (r >= TIMELINE.TUNNEL_END) {
            matteOpacity = 0;
        }

        containerRef.current.style.transform = `translate3d(0, ${compensateY}px, 0) scale(${scale})`;
        containerRef.current.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
        containerRef.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
        matteRef.current.style.opacity = matteOpacity.toString();
    });

    // We don't return null anymore to keep the ref mounted for animation
    // if (!isVisible && opacity <= 0) return null; 

    return (
        <div className="fixed inset-0 w-full h-full z-20 pointer-events-none">
            <div
                ref={matteRef}
                className="absolute inset-0 z-30 pointer-events-none"
                style={{
                    backgroundColor: '#05070d',
                    opacity: 0,
                    transition: 'opacity 0.05s linear'
                }}
            />
            <div
                ref={containerRef}
                className="absolute inset-0 z-20 w-full h-full pointer-events-none"
                style={{
                    transformOrigin: 'center center',
                    transition: 'opacity 0.05s linear, transform 0.05s linear'
                }}
            >
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-start items-center text-center pt-[15vh]">

                {/* Main Title with Glossy Effect + Highlight Band */}
                <div
                    className="mb-6 relative animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
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
                            className="text-7xl md:text-9xl font-black tracking-tighter leading-none relative"
                            style={{
                                fontFamily: "'Orbitron', 'Inter', sans-serif",
                                fontWeight: 900,
                                background: 'linear-gradient(180deg, #ffffff 0%, #F5C16C 30%, #FF8C42 55%, #00E5FF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                WebkitTextStroke: '1px rgba(0, 0, 0, 0.6)',
                                textShadow: '0 0 25px rgba(255, 180, 80, 0.35), 0 2px 10px rgba(0, 0, 0, 0.4)',
                            }}
                        >
                            UTKARSH
                        </h1>

                        {/* Year 2026 - Badge feel with cyan glow */}
                        <h2
                            className="text-3xl md:text-5xl font-bold mt-2"
                            style={{
                                fontFamily: "'Orbitron', 'Inter', sans-serif",
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
                </div>

                {/* Subtitle */}
                <div
                    className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
                    style={{
                        color: 'rgba(255, 255, 255, 0.92)',
                        marginTop: '20px',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                        animationDelay: '0.4s'
                    }}
                >
                    <p className="mb-2">
                        Where <span style={{ color: '#F5C16C', fontWeight: 600 }}>Tradition</span> Meets <span style={{ color: '#00E5FF', fontWeight: 600 }}>Technology</span>.
                    </p>
                    <p>
                        Celebrating 20 Years of <span style={{ color: '#F5C16C', fontWeight: 600 }}>Innovation</span> &amp; <span style={{ color: '#00E5FF', fontWeight: 600 }}>Culture</span>.
                    </p>
                </div>

                {/* CTA Buttons - pointer-events-auto to make them clickable */}
                <div
                    className="flex flex-col md:flex-row gap-6 items-center pointer-events-auto animate-fade-in-up"
                    style={{ marginTop: '30px', animationDelay: '0.6s' }}
                >
                    {/* Primary Button - Explore Heritage */}
                    <a href="#heritage">
                        <button
                            className="group relative px-10 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 overflow-hidden min-h-[48px] hover:-translate-y-1"
                            style={{
                                background: 'linear-gradient(90deg, #F5C16C, #FF9F43)',
                                color: '#0B0F1A',
                                boxShadow: '0 8px 24px rgba(245, 193, 108, 0.3)',
                                border: 'none',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Heritage
                                {/* Sparkles SVG Icon */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272L12 3z" />
                                </svg>
                            </span>
                        </button>
                    </a>

                    {/* Secondary Button - Discover Innovation */}
                    <a href="#innovation">
                        <button
                            className="group relative px-10 py-4 rounded-xl font-medium text-lg tracking-wide transition-all duration-300 overflow-hidden min-h-[48px] hover:-translate-y-1 hover:border-cyan-400"
                            style={{
                                background: 'rgba(0, 229, 255, 0.04)',
                                border: '1px solid rgba(0, 229, 255, 0.12)',
                                color: '#EAF6FF',
                                backdropFilter: 'blur(8px)',
                                boxShadow: '0 4px 16px rgba(0, 229, 255, 0.08)',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Discover Innovation
                                {/* Arrow Right SVG Icon */}
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
                    style={{ animationDelay: '1s' }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>
                </div>

                {/* Animation keyframes */}
                <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
            </div>
        </div>
    );
};

export default HeroOverlay;
