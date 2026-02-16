import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TIMELINE } from '../../config/timeline';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroSection — Video background + text overlay with zoom-fade transition.
 * Lives OUTSIDE the Three.js Canvas.
 *
 * Animation stages (driven by GSAP ScrollTrigger):
 *   Stage 1 (0 → 35% of HERO_END): Static hold
 *   Stage 2 (35% → 80% of HERO_END): Zoom only (scale 1 → 2), stay opaque
 *   Stage 3 (80% → HERO_END): Zoom continues (scale 2 → 2.2) + fade out
 *
 * Uses GSAP scrub for buttery-smooth interpolation — no manual RAF or lerp.
 */
const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const matteRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Find drei ScrollControls' scroll container
    const findScrollContainer = useCallback((): HTMLElement | null => {
        const candidates = document.querySelectorAll('div[style]');
        for (const el of candidates) {
            const style = (el as HTMLElement).style;
            if (
                (style.overflow === 'auto' || style.overflowY === 'auto') &&
                el.scrollHeight > el.clientHeight
            ) {
                return el as HTMLElement;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        // Autoplay video
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }

        // Transition breakpoints as fractions of total scroll height
        const holdEndFrac = TIMELINE.HERO_END * 0.35;
        const zoomEndFrac = TIMELINE.HERO_END * 0.80;
        const fadeEndFrac = TIMELINE.HERO_END;

        let scrollContainer: HTMLElement | null = null;
        let ctx: gsap.Context | null = null;

        const setupScrollTrigger = (scroller: HTMLElement) => {
            // Total scrollable distance
            const scrollDistance = scroller.scrollHeight - scroller.clientHeight;
            if (scrollDistance <= 0) return;

            // Convert fractions to pixel positions
            const holdEndPx = holdEndFrac * scrollDistance;
            const zoomEndPx = zoomEndFrac * scrollDistance;
            const fadeEndPx = fadeEndFrac * scrollDistance;

            ctx = gsap.context(() => {
                // Stage 1→2: Zoom phase (holdEnd → zoomEnd)
                // Scale from 1 → 2, opacity stays at 1
                gsap.timeline({
                    scrollTrigger: {
                        scroller: scroller,
                        trigger: scroller.children[0] || scroller, // scroll fill div
                        start: `${holdEndPx}px top`,
                        end: `${zoomEndPx}px top`,
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                    },
                })
                .fromTo(
                    containerRef.current,
                    { scale: 1 },
                    { scale: 2, ease: 'none' }
                );

                // Stage 2→3: Zoom + fade phase (zoomEnd → fadeEnd)
                // Scale from 2 → 2.2, opacity 1 → 0, matte 0 → 1
                gsap.timeline({
                    scrollTrigger: {
                        scroller: scroller,
                        trigger: scroller.children[0] || scroller,
                        start: `${zoomEndPx}px top`,
                        end: `${fadeEndPx}px top`,
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            // Manage visibility
                            if (containerRef.current) {
                                containerRef.current.style.visibility =
                                    self.progress >= 0.99 ? 'hidden' : 'visible';
                            }
                        },
                    },
                })
                .fromTo(
                    containerRef.current,
                    { scale: 2, opacity: 1 },
                    { scale: 2.2, opacity: 0, ease: 'none' }
                )
                .fromTo(
                    matteRef.current,
                    { opacity: 0, visibility: 'visible' },
                    { opacity: 1, ease: 'none' },
                    0 // same start time
                );

                // After HERO_END: keep hidden
                ScrollTrigger.create({
                    scroller: scroller,
                    trigger: scroller.children[0] || scroller,
                    start: `${fadeEndPx}px top`,
                    end: 'bottom bottom',
                    onEnter: () => {
                        if (containerRef.current) {
                            containerRef.current.style.visibility = 'hidden';
                            containerRef.current.style.opacity = '0';
                        }
                        if (matteRef.current) {
                            matteRef.current.style.opacity = '0';
                            matteRef.current.style.visibility = 'hidden';
                        }
                    },
                    onLeaveBack: () => {
                        if (containerRef.current) {
                            containerRef.current.style.visibility = 'visible';
                        }
                    },
                });
            });
        };

        // Retry finding the scroll container (Canvas may not be ready immediately)
        const findTimer = setInterval(() => {
            scrollContainer = findScrollContainer();
            if (scrollContainer) {
                clearInterval(findTimer);
                setupScrollTrigger(scrollContainer);
            }
        }, 100);

        return () => {
            clearInterval(findTimer);
            if (ctx) ctx.revert();
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, [findScrollContainer]);

    return (
        <>
            {/* Black matte — sits between hero and tunnel to mask transition overlap */}
            <div
                ref={matteRef}
                className="fixed inset-0 z-15 pointer-events-none"
                style={{
                    backgroundColor: '#05070d',
                    opacity: 0,
                    visibility: 'hidden',
                    willChange: 'opacity',
                    zIndex: 15,
                }}
            />

            {/* Hero container — zoom + fade driven by GSAP ScrollTrigger */}
            <div
                ref={containerRef}
                className="fixed inset-0 w-full h-full z-20 pointer-events-none"
                style={{
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity',
                    backfaceVisibility: 'hidden',
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
                `}</style>
            </div>
        </>
    );
};

export default HeroSection;
