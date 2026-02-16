import React, { useRef, useState } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE } from '../../../config/timeline';
import { SCROLL_CONFIG } from '../../../config/scroll';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

const STATS = [
    { label: 'Established', value: 2006, prefix: '', suffix: '', isYear: true },
    { label: 'Attendees Annually', value: 10000, prefix: '', suffix: '+', isYear: false },
    { label: 'Days of Innovation', value: 3, prefix: '', suffix: '', isYear: false },
    { label: 'Events & Workshops', value: 50, prefix: '', suffix: '+', isYear: false },
];

const PARAGRAPHS = [
    "Utkarsh, formerly known as INNOVIZ, is a three-day extravaganza celebrating arts, culture, and engineering. As a premier tech fest, it brings together bright minds, groundbreaking ideas, and cutting-edge advancements that shape the future.",
    "From hands-on workshops and competitive hackathons to insightful talks by industry experts and research paper presentations — Utkarsh is the ultimate platform for students, professionals, and tech enthusiasts to explore, learn, and showcase their talents.",
    "Since its inception in 2006, Utkarsh has established itself as a premier event in Delhi & NCR, attracting over 10,000 attendees annually."
];

// ════════════════════════════════════════════════
//  ANIMATED COUNTER HOOK
// ════════════════════════════════════════════════

function useCountUp(target: number, progress: number, isYear: boolean): string {
    if (progress <= 0) return isYear ? '0000' : '0';
    const eased = Math.min(1, progress * progress); // quadratic ease-in
    const current = Math.round(eased * target);
    if (isYear) return current.toString();
    if (target >= 10000) return current.toLocaleString();
    return current.toString();
}

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const AboutSection: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    // Refs for staggered elements
    const subtitleRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const paragraphRefs = useRef<(HTMLDivElement | null)[]>([]);
    const statsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    // Store animated stat values
    const [statProgress, setStatProgress] = useState(0);

    useFrame((_state, delta) => {
        if (!innerRef.current) return;

        const r = scroll.offset;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = viewportHeight * (SCROLL_CONFIG.PAGES - 1) * r;

        // Scroll compensation
        innerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;

        // ── Visibility: fade in during ABOUT_START..ABOUT_START+0.03, stay, fade out during ABOUT_STAY..TRANSITION
        let targetOpacity = 0;

        if (r >= TIMELINE.ABOUT_START && r <= TIMELINE.TRANSITION + 0.02) {
            const fadeInEnd = TIMELINE.ABOUT_START + 0.03;

            if (r < fadeInEnd) {
                targetOpacity = (r - TIMELINE.ABOUT_START) / (fadeInEnd - TIMELINE.ABOUT_START);
            } else if (r <= TIMELINE.ABOUT_STAY) {
                targetOpacity = 1;
            } else {
                const fadeOutT = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
                targetOpacity = Math.max(0, 1 - fadeOutT * 1.5);
            }
        }

        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 6, delta);
        innerRef.current.style.opacity = opacityRef.current.toString();

        if (opacityRef.current < 0.01) return;

        // ── Sub-progress within the About section (0→1 across the dwell range)
        const aboutRange = TIMELINE.ABOUT_STAY - TIMELINE.ABOUT_START;
        const subProgress = Math.max(0, Math.min(1, (r - TIMELINE.ABOUT_START) / aboutRange));

        // ── Staggered reveals ──
        // Subtitle: 0 → 0.15
        if (subtitleRef.current) {
            const t = Math.min(1, Math.max(0, subProgress / 0.15));
            const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
            subtitleRef.current.style.opacity = eased.toString();
            subtitleRef.current.style.transform = `translateY(${(1 - eased) * 20}px)`;
        }

        // Title: 0.05 → 0.25
        if (titleRef.current) {
            const t = Math.min(1, Math.max(0, (subProgress - 0.05) / 0.20));
            const eased = 1 - Math.pow(1 - t, 3);
            titleRef.current.style.opacity = eased.toString();
            titleRef.current.style.transform = `translateY(${(1 - eased) * 30}px)`;
        }

        // Paragraphs: staggered from 0.15→0.65
        paragraphRefs.current.forEach((ref, i) => {
            if (!ref) return;
            const start = 0.15 + i * 0.12;
            const end = start + 0.18;
            const t = Math.min(1, Math.max(0, (subProgress - start) / (end - start)));
            const eased = 1 - Math.pow(1 - t, 3);
            ref.style.opacity = eased.toString();
            ref.style.transform = `translateY(${(1 - eased) * 25}px)`;
        });

        // Stats: 0.45 → 0.85
        const statsT = Math.min(1, Math.max(0, (subProgress - 0.45) / 0.40));
        setStatProgress(statsT);

        if (statsRef.current) {
            const eased = 1 - Math.pow(1 - Math.min(1, statsT / 0.3), 3);
            statsRef.current.style.opacity = eased.toString();
            statsRef.current.style.transform = `translateY(${(1 - eased) * 20}px)`;
        }

        // CTA chevron: 0.7 → 0.9
        if (ctaRef.current) {
            const t = Math.min(1, Math.max(0, (subProgress - 0.7) / 0.2));
            const eased = 1 - Math.pow(1 - t, 3);
            ctaRef.current.style.opacity = eased.toString();
        }

        // Ambient glow animation
        if (glowRef.current) {
            const time = Date.now() * 0.001;
            const x = 50 + Math.sin(time * 0.3) * 20;
            const y = 50 + Math.cos(time * 0.4) * 15;
            glowRef.current.style.background = `
                radial-gradient(ellipse 600px 400px at ${x}% ${y}%, rgba(59,130,246,0.08) 0%, transparent 70%),
                radial-gradient(ellipse 400px 300px at ${100 - x}% ${100 - y}%, rgba(99,102,241,0.06) 0%, transparent 70%)
            `;
        }

        // ── Exit slide (same as the old FlatAboutSection) ──
        if (r > TIMELINE.ABOUT_STAY && containerRef.current) {
            const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
            containerRef.current.style.transform = `translateX(${-t * t * 80}px)`;
        } else if (containerRef.current) {
            containerRef.current.style.transform = '';
        }
    });

    return (
        <div className="fixed inset-0 w-full h-full z-15 pointer-events-none">
            <div
                ref={innerRef}
                className="absolute inset-0 w-full h-full"
                style={{
                    opacity: 0,
                    willChange: 'transform, opacity',
                }}
            >
                {/* Ambient glow layer */}
                <div
                    ref={glowRef}
                    className="absolute inset-0 pointer-events-none"
                    style={{ willChange: 'background' }}
                />

                {/* Content container — solid background replaces the deleted FlatAboutSection 3D plane */}
                <div
                    ref={containerRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '3rem 2rem',
                        willChange: 'transform',
                        background: 'linear-gradient(180deg, #050505 0%, #0a0a0f 50%, #050505 100%)',
                    }}
                >
                    {/* ── Top section: Subtitle + Title ── */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        {/* Subtitle */}
                        <div
                            ref={subtitleRef}
                            style={{
                                opacity: 0,
                                willChange: 'transform, opacity',
                                marginBottom: '1rem',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 'clamp(0.65rem, 1.2vw, 0.85rem)',
                                    fontWeight: 500,
                                    letterSpacing: '0.35em',
                                    textTransform: 'uppercase',
                                    color: '#3b82f6',
                                    display: 'inline-block',
                                    padding: '0.4em 1.2em',
                                    border: '1px solid rgba(59,130,246,0.3)',
                                    borderRadius: '999px',
                                    background: 'rgba(59,130,246,0.05)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                The Most Awaited Fest of the Year
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            ref={titleRef}
                            style={{
                                fontFamily: "'Orbitron', 'Inter', sans-serif",
                                fontSize: 'clamp(2rem, 5vw, 4rem)',
                                fontWeight: 900,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                lineHeight: 1.1,
                                margin: 0,
                                opacity: 0,
                                willChange: 'transform, opacity',
                                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #3b82f6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 2px 10px rgba(59,130,246,0.3))',
                            }}
                        >
                            About Utkarsh
                        </h2>

                        {/* Decorative line under title */}
                        <div style={{
                            width: '80px',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                            margin: '1.2rem auto 0',
                            borderRadius: '2px',
                        }} />
                    </div>

                    {/* ── Body paragraphs ── */}
                    <div style={{
                        maxWidth: '42rem',
                        textAlign: 'center',
                        marginBottom: '3rem',
                    }}>
                        {PARAGRAPHS.map((text, i) => (
                            <div
                                key={i}
                                ref={(el) => { paragraphRefs.current[i] = el; }}
                                style={{
                                    opacity: 0,
                                    willChange: 'transform, opacity',
                                    marginBottom: i < PARAGRAPHS.length - 1 ? '1.2rem' : 0,
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                                        fontWeight: 300,
                                        lineHeight: 1.8,
                                        color: 'rgba(255,255,255,0.72)',
                                        margin: 0,
                                        textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Stats bar ── */}
                    <div
                        ref={statsRef}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 'clamp(1rem, 3vw, 2.5rem)',
                            maxWidth: '48rem',
                            width: '100%',
                            opacity: 0,
                            willChange: 'transform, opacity',
                            marginBottom: '2.5rem',
                        }}
                    >
                        {STATS.map((stat, i) => {
                            const displayed = useCountUp(stat.value, statProgress, stat.isYear);
                            return (
                                <div
                                    key={i}
                                    style={{
                                        textAlign: 'center',
                                        padding: '1.2rem 0.5rem',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        backdropFilter: 'blur(4px)',
                                        transition: 'border-color 0.3s, background 0.3s',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                                        e.currentTarget.style.background = 'rgba(59,130,246,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: "'Orbitron', 'Inter', monospace",
                                            fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
                                            fontWeight: 800,
                                            color: '#ffffff',
                                            lineHeight: 1,
                                            marginBottom: '0.5rem',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        {stat.prefix}{displayed}{stat.suffix}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: 'clamp(0.55rem, 0.9vw, 0.72rem)',
                                            fontWeight: 400,
                                            color: 'rgba(255,255,255,0.45)',
                                            letterSpacing: '0.15em',
                                            textTransform: 'uppercase',
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Scroll CTA ── */}
                    <div
                        ref={ctaRef}
                        style={{
                            opacity: 0,
                            textAlign: 'center',
                            willChange: 'opacity',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.7rem',
                                    fontWeight: 400,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.35)',
                                }}
                            >
                                Keep scrolling
                            </span>
                            {/* Bouncing chevron */}
                            <div
                                style={{
                                    width: '24px',
                                    height: '40px',
                                    border: '1.5px solid rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingTop: '6px',
                                }}
                            >
                                <div
                                    className="about-scroll-dot"
                                    style={{
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: 'rgba(59,130,246,0.8)',
                                        boxShadow: '0 0 6px rgba(59,130,246,0.5)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animation keyframes */}
                <style>{`
                    .about-scroll-dot {
                        animation: aboutScrollPulse 2s ease-in-out infinite;
                    }

                    @keyframes aboutScrollPulse {
                        0%, 100% {
                            transform: translateY(0);
                            opacity: 1;
                        }
                        50% {
                            transform: translateY(18px);
                            opacity: 0.3;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AboutSection;
