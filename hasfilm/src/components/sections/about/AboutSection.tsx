// src/components/sections/about/AboutSection.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TIMELINE } from '../../../config/timeline';

// ════════════════════════════════════════════════
//  CONTENT
// ════════════════════════════════════════════════

const STATS = [
    { label: 'Established', value: '2006' },
    { label: 'Attendees Annually', value: '10,000+' },
    { label: 'Days of Innovation', value: '3' },
    { label: 'Events & Workshops', value: '50+' },
];

const PARAGRAPHS = [
    "Utkarsh, formerly known as INNOVIZ, is a three-day extravaganza celebrating arts, culture, and engineering. As a premier tech fest, it brings together bright minds, groundbreaking ideas, and cutting-edge advancements that shape the future.",
    "From hands-on workshops and competitive hackathons to insightful talks by industry experts and research paper presentations — Utkarsh is the ultimate platform for students, professionals, and tech enthusiasts to explore, learn, and showcase their talents.",
    "Since its inception in 2006, Utkarsh has established itself as a premier event in Delhi & NCR, attracting over 10,000 attendees annually."
];

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const AboutSection: React.FC = () => {
    const scroll = useScroll();
    const contentRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    // Portal root — renders outside <Scroll html> to avoid jitter
    const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = document.createElement('div');
        el.id = 'about-overlay-portal';
        el.style.cssText = 'position:fixed;inset:0;width:100%;height:100vh;pointer-events:none;z-index:15;';
        document.body.appendChild(el);
        setPortalRoot(el);
        return () => { document.body.removeChild(el); };
    }, []);

    useFrame((_state, delta) => {
        if (!contentRef.current) return;

        const r = scroll.offset;

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
    });

    if (!portalRoot) return null;

    return createPortal(
        <div
            ref={contentRef}
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem 2rem',
                opacity: 0,
                willChange: 'opacity',
                background: 'linear-gradient(180deg, #050505 0%, #0a0a0f 50%, #050505 100%)',
            }}
        >
            {/* Subtitle */}
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
                    marginBottom: '1rem',
                }}
            >
                The Most Awaited Fest of the Year
            </span>

            {/* Title */}
            <h2
                style={{
                    fontFamily: "'Orbitron', 'Inter', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    margin: 0,
                    background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 10px rgba(59,130,246,0.3))',
                }}
            >
                About Utkarsh
            </h2>

            {/* Decorative line */}
            <div style={{
                width: '80px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                margin: '1.2rem auto 2.5rem',
                borderRadius: '2px',
            }} />

            {/* Paragraphs */}
            <div style={{ maxWidth: '42rem', textAlign: 'center', marginBottom: '3rem' }}>
                {PARAGRAPHS.map((text, i) => (
                    <p
                        key={i}
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                            fontWeight: 300,
                            lineHeight: 1.8,
                            color: 'rgba(255,255,255,0.72)',
                            margin: 0,
                            marginBottom: i < PARAGRAPHS.length - 1 ? '1.2rem' : 0,
                        }}
                    >
                        {text}
                    </p>
                ))}
            </div>

            {/* Stats */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 'clamp(1rem, 3vw, 2.5rem)',
                    maxWidth: '48rem',
                    width: '100%',
                }}
            >
                {STATS.map((stat, i) => (
                    <div
                        key={i}
                        style={{
                            textAlign: 'center',
                            padding: '1.2rem 0.5rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
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
                            }}
                        >
                            {stat.value}
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
                ))}
            </div>
        </div>,
        portalRoot
    );
};

export default AboutSection;
