// src/components/sections/about/AboutSection.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { TIMELINE } from '../../../config/timeline';
import { scrollProgress } from '../../../hooks/useScrollProgress';
import './AboutSection.css';

// ════════════════════════════════════════════════
//  CARD DATA
// ════════════════════════════════════════════════

const CARDS: {
    key: string;
    variant: string;
    title: string;
    text: string;
    icon: React.ReactNode;
}[] = [
        {
            key: 'vision',
            variant: 'about-card--vision',
            title: 'THE VISION',
            text: 'Unites pioneering arts and tech of technology to uniting arts and tech.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2a8 8 0 0 0-8 8c0 3.5 2.5 6.5 6 7.5V20h4v-2.5c3.5-1 6-4 6-7.5a8 8 0 0 0-8-8z" />
                    <path d="M10 20h4v2h-4z" />
                    <path d="M8 12h2l1-2 2 4 1-2h2" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            key: 'legacy',
            variant: 'about-card--legacy',
            title: 'THE LEGACY',
            text: 'Since 2006, Utkarsh has been the premier convergence of tech — unites over 10,000+ attendees annually.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="6" width="7" height="6" rx="1" />
                    <rect x="14" y="6" width="7" height="6" rx="1" />
                    <rect x="8" y="12" width="8" height="6" rx="1" />
                    <circle cx="6.5" cy="9" r="1" fill="currentColor" />
                    <circle cx="17.5" cy="9" r="1" fill="currentColor" />
                </svg>
            ),
        },
        {
            key: 'impact',
            variant: 'about-card--impact',
            title: 'THE IMPACT',
            text: 'Inspiring visionaries and empowerment for the extraordinary fusion of talent and passion.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v4m0 10v4M3 12h4m10 0h4" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            ),
        },
    ];

// ════════════════════════════════════════════════
//  STATS DATA
// ════════════════════════════════════════════════

const STATS = [
    { target: 3, suffix: '', label: 'Days Event', color: '#00FFFF' },
    { target: 10, suffix: 'K+', label: 'Attendees', color: '#FF00FF' },
    { target: 100, suffix: '+', label: 'Events', color: '#00FFFF' },
];

// ════════════════════════════════════════════════
//  ANIMATED STAT COMPONENT
// ════════════════════════════════════════════════

const AnimatedStat: React.FC<{
    target: number;
    suffix: string;
    label: string;
    color: string;
    isVisible: boolean;
}> = ({ target, suffix, label, color, isVisible }) => {
    const [value, setValue] = useState(0);
    const hasAnimatedRef = useRef(false);
    const startTimeRef = useRef(0);
    const rafIdRef = useRef(0);

    useEffect(() => {
        if (isVisible && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            startTimeRef.current = performance.now();
            const duration = 1800; // ms

            const animate = (now: number) => {
                const elapsed = now - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                setValue(Math.round(eased * target));

                if (progress < 1) {
                    rafIdRef.current = requestAnimationFrame(animate);
                }
            };

            rafIdRef.current = requestAnimationFrame(animate);
        }

        if (!isVisible) {
            hasAnimatedRef.current = false;
            setValue(0);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        }

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [isVisible, target]);

    return (
        <div className="about-stat">
            <span className="about-stat-number" style={{ color }}>
                {value}{suffix}
            </span>
            <span className="about-stat-label">{label}</span>
            <div className="about-stat-bar" style={{ background: color }} />
        </div>
    );
};

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const AboutSection: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);
    const [sectionVisible, setSectionVisible] = useState(false);

    const tick = useCallback((time: number) => {
        if (!contentRef.current) {
            rafRef.current = requestAnimationFrame(tick);
            return;
        }

        // Calculate delta
        if (lastTimeRef.current === 0) lastTimeRef.current = time;
        const deltaMs = Math.min(time - lastTimeRef.current, 50);
        const delta = deltaMs / 1000;
        lastTimeRef.current = time;

        const r = scrollProgress.current;

        // Simple fade: in during ABOUT_START→+0.03, hold, out during ABOUT_STAY→TRANSITION
        let targetOpacity = 0;

        if (r >= TIMELINE.ABOUT_START && r <= TIMELINE.TRANSITION) {
            const fadeInEnd = TIMELINE.ABOUT_START + 0.03;

            if (r < fadeInEnd) {
                targetOpacity = (r - TIMELINE.ABOUT_START) / (fadeInEnd - TIMELINE.ABOUT_START);
            } else if (r <= TIMELINE.ABOUT_STAY) {
                targetOpacity = 1;
            } else {
                const fadeOutT = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
                targetOpacity = Math.max(0, 1 - fadeOutT);
            }
        }

        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 6, delta);
        contentRef.current.style.opacity = opacityRef.current.toString();
        contentRef.current.style.visibility = opacityRef.current < 0.01 ? 'hidden' : 'visible';

        // Trigger stat animation when section is sufficiently visible
        const nowVisible = opacityRef.current > 0.5;
        setSectionVisible((prev) => (prev !== nowVisible ? nowVisible : prev));

        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [tick]);

    return (
        <div ref={contentRef} className="about-root">
            {/* Decorative corner accents */}


            {/* Decorative neon lines */}
            <div className="about-neon-line about-neon-line--top" />
            <div className="about-neon-line about-neon-line--bottom" />

            {/* UTKARSH watermark */}
            <span className="about-watermark" aria-hidden="true">UTKARSH</span>

            <div className="about-inner">
                {/* Title */}
                <div style={{ textAlign: 'center' }}>
                    <h2 className="about-title">
                        The Most Awaited Fest of The Year!
                    </h2>
                    <div className="about-title-separator" />
                </div>

                {/* Cards + Hexagons row */}
                <div className="about-cards-row">
                    {CARDS.map((card, i) => (
                        <React.Fragment key={card.key}>
                            {/* Card */}
                            <article className={`about-card ${card.variant}`}>
                                {/* Glow behind card */}
                                <div className="about-card-glow" />
                                {/* Gradient border wrapper with clip-path */}
                                <div className="about-card-border">
                                    {/* Inner content */}
                                    <div className="about-card-content">
                                        <div className="about-card-icon">{card.icon}</div>
                                        <h3 className="about-card-title">{card.title}</h3>
                                        <p className="about-card-text">{card.text}</p>
                                    </div>
                                </div>
                            </article>

                            {/* Insert hexagonal images after the 2nd card */}
                            {i === 1 && (
                                <div className="about-hex-group">
                                    <div className="about-hex-wrapper about-hex-wrapper--left">
                                        <div className="about-hex-border" />
                                        <div className="about-hex">
                                            <img src="/assets/about-section/hex1.webp" alt="Utkarsh workshop" loading="lazy" />
                                        </div>
                                    </div>
                                    <div className="about-hex-wrapper about-hex-wrapper--right">
                                        <div className="about-hex-border" />
                                        <div className="about-hex">
                                            <img src="/assets/about-section/hex2.webp" alt="Utkarsh stage performance" loading="lazy" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Animated Stats Row */}
                <div className="about-stats-row">
                    {STATS.map((stat) => (
                        <AnimatedStat
                            key={stat.label}
                            target={stat.target}
                            suffix={stat.suffix}
                            label={stat.label}
                            color={stat.color}
                            isVisible={sectionVisible}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
