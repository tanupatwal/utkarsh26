import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMELINE } from '../../config/timeline';
import { scrollProgress } from '../../hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroSection — Full-viewport video background with overlay text.
 * Lives OUTSIDE the Three.js Canvas as a fixed layer.
 *
 * Post-Lenis migration: Uses a simple rAF loop reading scrollProgress
 * instead of hacking into drei's scroll container.
 */
const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Autoplay video
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }

        // Simple rAF fade based on scrollProgress
        const tick = () => {
            if (!containerRef.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const r = scrollProgress.current;

            // Fade starts at 60% of HERO_END, complete at HERO_END
            const fadeStart = TIMELINE.HERO_END * 0.6;
            const fadeEnd = TIMELINE.HERO_END;

            if (r <= fadeStart) {
                containerRef.current.style.opacity = '1';
                containerRef.current.style.visibility = 'visible';
            } else if (r >= fadeEnd) {
                containerRef.current.style.opacity = '0';
                containerRef.current.style.visibility = 'hidden';
            } else {
                const t = (r - fadeStart) / (fadeEnd - fadeStart);
                const eased = t * t; // power2.in
                containerRef.current.style.opacity = (1 - eased).toString();
                containerRef.current.style.visibility = 'visible';
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full z-20 pointer-events-none"
            style={{
                willChange: 'opacity',
            }}
        >
            {/* Video Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    ref={videoRef}
                    src="/assets/hero_video.mp4"
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-center"
                />

                {/* Dark overlay for text readability */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: 'rgba(11, 15, 26, 0.35)',
                        mixBlendMode: 'multiply',
                    }}
                />
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center pb-20 px-6">
                {/* Main Title */}
                <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative px-8 py-3 rounded-2xl">
                        <h1
                            className="text-7xl md:text-9xl font-black tracking-tighter leading-none"
                            style={{
                                fontFamily: "'Orbitron', 'Inter', sans-serif",
                                fontWeight: 900,
                                background:
                                    'linear-gradient(180deg, #ffffff 0%, #F5C16C 30%, #FF8C42 55%, #00E5FF 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))',
                            }}
                        >
                            UTKARSH
                        </h1>

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

                {/* Taglines */}
                <div
                    className="flex flex-col items-center gap-3 mb-8 animate-fade-in-up"
                    style={{ marginTop: '25px', animationDelay: '0.4s' }}
                >
                    <p
                        className="text-xl md:text-3xl tracking-[0.2em] uppercase text-white font-bold"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            textShadow:
                                '0 4px 4px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.3)',
                        }}
                    >
                        Evolution Through Heritage
                    </p>

                    <p
                        className="text-3xl md:text-6xl font-serif italic tracking-wide mt-4"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            background:
                                'linear-gradient(to right, #E5C56C, #FFFDE7, #D4AF37, #FFFDE7, #D4A030, #E5C56C)',
                            backgroundSize: '200% auto',
                            animation: 'shine 3s linear infinite',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter:
                                'drop-shadow(0 5px 15px rgba(0,0,0,1)) drop-shadow(0 0 30px rgba(245, 193, 108, 0.6))',
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

            {/* Keyframe Animations */}
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
            `}
            </style>
        </div>
    );
};

export default HeroSection;
