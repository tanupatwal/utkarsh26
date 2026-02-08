import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { SCROLL_CONFIG, TRANSITION_CONFIG, rangeProgress } from '../../config';

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
        } else if (r >= TRANSITION_CONFIG.HERO_HANDOFF_END && r < TRANSITION_CONFIG.VOID_END) {
            matteOpacity = 1;
        } else if (r >= TRANSITION_CONFIG.BLACKOUT_RELEASE_START && r < TRANSITION_CONFIG.BLACKOUT_RELEASE_END) {
            matteOpacity = 1 - rangeProgress(
                r,
                TRANSITION_CONFIG.BLACKOUT_RELEASE_START,
                TRANSITION_CONFIG.BLACKOUT_RELEASE_END
            );
        } else {
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
                    willChange: 'opacity'
                }}
            />
            <div
                ref={containerRef}
                className="absolute inset-0 z-20 w-full h-full pointer-events-none"
                style={{
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-center text-center pb-20">

                {/* Main Title with Glossy Effect + Highlight Band */}
                <div
                    className="mb-6 relative animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    {/* Highlighter Band Wrapper */}
                    <div
                        className="relative px-8 py-3 rounded-2xl"
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
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))',
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
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            }}
                        >
                            2026
                        </h2>
                    </div>


                </div>

                {/* Subtitle */}
                <div
                    className="flex flex-col items-center gap-3 mb-8 animate-fade-in-up"
                    style={{
                        marginTop: '25px',
                        animationDelay: '0.4s'
                    }}
                >
                    {/* Primary Tagline - Clean & Modern */}
                    <p className="text-xl md:text-3xl tracking-[0.2em] uppercase text-white font-bold"
                       style={{ 
                           fontFamily: "'Inter', sans-serif",
                           textShadow: '0 4px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.3)' 
                       }}
                    >
                        Evolution Through Heritage
                    </p>

                    {/* Secondary Tagline - Elegant Golden Serif */}
                    <p 
                        className="text-3xl md:text-6xl font-serif italic tracking-wide mt-4"
                        style={{ 
                            fontFamily: "'Playfair Display', serif",
                            background: 'linear-gradient(to right, #E5C56C, #FFFDE7, #D4AF37, #FFFDE7, #D4A030, #E5C56C)',
                            backgroundSize: '200% auto',
                            animation: 'shine 3s linear infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 5px 15px rgba(0,0,0,1)) drop-shadow(0 0 30px rgba(245, 193, 108, 0.6))',
                            backgroundClip: 'text'
                        }}
                    >
                        Virasat se VIKAS TAK
                    </p>
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

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
            </div>
        </div>
    );
};

export default HeroOverlay;
