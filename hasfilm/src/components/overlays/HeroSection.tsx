import React, { useEffect, useRef } from 'react';
import { TIMELINE } from '../../config/timeline';

/**
 * HeroSection — Video background + text overlay with zoom-fade transition.
 * Lives OUTSIDE the Three.js Canvas. As the user scrolls:
 *   Stage 1 (0 → 35% of HERO_END): Static hold
 *   Stage 2 (35% → 80% of HERO_END): Zoom only (scale 1 → 2), stay opaque
 *   Stage 3 (80% → HERO_END): Zoom continues (scale 2 → 2.2) + fade out
 * Uses direct DOM refs for smooth 60fps — no React re-renders.
 */
const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const matteRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const wasHiddenRef = useRef(false);       // track hidden state for video pause/resume
    const titleRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Autoplay video immediately
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
        }

        // Transition breakpoints (as fractions of total scroll 0→1)
        const holdEnd = TIMELINE.HERO_END * 0.35;   // end of static hold
        const zoomEnd = TIMELINE.HERO_END * 0.80;   // end of zoom-only phase
        const fadeEnd = TIMELINE.HERO_END;           // fully gone

        const MAX_ZOOM_SCALE = 2.0;
        const EXIT_SCALE = 2.2;

        // Find the drei ScrollControls scroll container
        const findScrollContainer = (): HTMLElement | null => {
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
        };

        let scrollContainer: HTMLElement | null = null;
        let dampedR = 0; // smoothed scroll progress
        let rafId = 0;

        // RAF loop — polls scroll position and applies damping, synced to render cycle
        const tick = () => {
            if (!scrollContainer || !containerRef.current || !matteRef.current) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const scrollTop = scrollContainer.scrollTop;
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            if (scrollHeight <= 0) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const rawR = scrollTop / scrollHeight; // 0 → 1

            // ── PERF: Skip ALL computation when hero is fully hidden ──
            // Hero is invisible when rawR > fadeEnd. Only keep polling to
            // detect when user scrolls back. No damping, no transform math.
            const isHidden = rawR > fadeEnd + 0.01;

            if (isHidden) {
                // First frame hidden → hide elements (don't pause video or
                // toggle willChange — both cause expensive restart stutter)
                if (!wasHiddenRef.current) {
                    wasHiddenRef.current = true;
                    containerRef.current.style.transform = 'none';
                    containerRef.current.style.opacity = '0';
                    containerRef.current.style.visibility = 'hidden';
                    matteRef.current.style.opacity = '0';
                    matteRef.current.style.visibility = 'hidden';
                }
                // Keep dampedR synced so there's no lerp delay on return
                dampedR = rawR;
                rafId = requestAnimationFrame(tick);
                return;
            }

            // ── Returning to hero ──
            if (wasHiddenRef.current) {
                wasHiddenRef.current = false;
                // Snap dampedR to rawR for instant sync (no slow lerp catch-up)
                dampedR = rawR;
                // Replay entrance animations on title & tagline
                if (titleRef.current) {
                    titleRef.current.classList.remove('animate-fade-in-up');
                    void titleRef.current.offsetWidth; // force reflow
                    titleRef.current.classList.add('animate-fade-in-up');
                }
                if (taglineRef.current) {
                    taglineRef.current.classList.remove('animate-fade-in-up');
                    void taglineRef.current.offsetWidth;
                    taglineRef.current.classList.add('animate-fade-in-up');
                }
            }

            // Lerp toward raw position (matches drei's damping feel)
            dampedR += (rawR - dampedR) * 0.12;

            // Snap if very close to avoid endless micro-updates
            if (Math.abs(dampedR - rawR) < 0.0001) dampedR = rawR;

            const r = dampedR;

            let scale = 1;
            let opacity = 1;
            let matteOpacity = 0;

            if (r < holdEnd) {
                scale = 1;
                opacity = 1;
            } else if (r < zoomEnd) {
                const t = (r - holdEnd) / (zoomEnd - holdEnd);
                scale = 1 + t * (MAX_ZOOM_SCALE - 1);
                opacity = 1;
            } else if (r < fadeEnd) {
                const t = (r - zoomEnd) / (fadeEnd - zoomEnd);
                scale = MAX_ZOOM_SCALE + t * (EXIT_SCALE - MAX_ZOOM_SCALE);
                opacity = 1 - t;
                matteOpacity = t;
            } else {
                scale = EXIT_SCALE;
                opacity = 0;
                matteOpacity = 0;
            }

            opacity = Math.max(0, Math.min(1, opacity));

            containerRef.current.style.transform = `scale(${scale})`;
            containerRef.current.style.opacity = opacity.toString();
            containerRef.current.style.visibility = opacity <= 0 ? 'hidden' : 'visible';

            matteRef.current.style.opacity = matteOpacity.toString();
            matteRef.current.style.visibility = matteOpacity <= 0 ? 'hidden' : 'visible';

            rafId = requestAnimationFrame(tick);
        };

        // Retry finding the container (Canvas may not be ready immediately)
        const findTimer = setInterval(() => {
            scrollContainer = findScrollContainer();
            if (scrollContainer) {
                clearInterval(findTimer);
                // Start the RAF loop
                rafId = requestAnimationFrame(tick);
            }
        }, 100);


        return () => {
            clearInterval(findTimer);
            cancelAnimationFrame(rafId);
        };
    }, []);

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

            {/* Hero container — zoom + fade driven by scroll */}
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
                    <div ref={titleRef} className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                        ref={taglineRef}
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

