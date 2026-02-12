import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { SCHEDULE_DAYS, getEventsForDay, CATEGORY_COLORS } from '../../../data/schedule';
import type { ScheduleEvent } from '../../../data/schedule';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

const SCHEDULE_FADE_START = 0.98;
const SCHEDULE_FADE_FULL = 0.995;
const CARD_STAGGER_MS = 50;

const ACCENT = '#38bdf8'; // sky-400
const ACCENT_DIM = 'rgba(56,189,248,0.15)';
const ACCENT_MED = 'rgba(56,189,248,0.3)';
const ACCENT_GLOW = 'rgba(56,189,248,0.5)';

const CLS = 'sch';

// ════════════════════════════════════════════════
//  ALL CSS — hover/glow/transitions fully in CSS
// ════════════════════════════════════════════════

const STYLES = `
/* ─── Scanline overlay (CRT effect) ─── */
.${CLS}-scanlines {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 100;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.06) 2px,
    rgba(0,0,0,0.06) 4px
  );
  mix-blend-mode: overlay;
}

/* ─── Noise texture overlay ─── */
.${CLS}-noise {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 99;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

/* ─── Card: chamfered octagonal shape ─── */
.${CLS}-card {
  position: relative;
  height: clamp(260px, 22rem, 340px);
  width: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transform: translateZ(0) rotateX(18deg) scale(0.95);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.4s ease;
  will-change: transform, opacity;
  z-index: 1;
}
.${CLS}-card.revealed { opacity: 1; }
.${CLS}-card:hover {
  transform: rotateX(0deg) translateZ(20px) scale(1.02) !important;
  z-index: 50;
}

/* Card body — chamfered clip + glassmorphism */
.${CLS}-body {
  position: absolute; inset: 0;
  clip-path: polygon(8% 0, 100% 0, 100% 88%, 92% 100%, 0 100%, 0 12%);
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%),
              rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  box-shadow: 0 0 0 1px ${ACCENT_DIM},
              inset 0 0 20px rgba(56,189,248,0.05),
              0 10px 40px rgba(0,0,0,0.6);
  transition: box-shadow 0.3s ease;
  will-change: box-shadow;
}
.${CLS}-card:hover .${CLS}-body {
  box-shadow: 0 0 0 1px ${ACCENT_GLOW},
              inset 0 1px 0 ${ACCENT_MED},
              inset 0 0 30px rgba(56,189,248,0.15),
              0 0 40px rgba(56,189,248,0.25),
              0 20px 60px rgba(0,0,0,0.5);
}

/* Corner bracket accents (outside card body) */
.${CLS}-card::before, .${CLS}-card::after {
  content: '';
  position: absolute;
  width: 14px; height: 14px;
  border-color: ${ACCENT_MED};
  border-style: solid;
  border-width: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 70;
}
.${CLS}-card::before {
  top: -4px; left: -4px;
  border-top-width: 1px;
  border-left-width: 1px;
}
.${CLS}-card::after {
  bottom: -4px; right: -4px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}
.${CLS}-card:hover::before,
.${CLS}-card:hover::after {
  opacity: 1;
}

/* Event thumbnail — vibrant, clean */
.${CLS}-img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.85;
  filter: brightness(0.88) saturate(1.1);
  transform: scale(1.01);
  transition: opacity 0.4s ease, filter 0.4s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
  will-change: opacity, filter, transform;
}
.${CLS}-card:hover .${CLS}-img {
  opacity: 1;
  filter: brightness(1.05) saturate(1.2);
  transform: scale(1.08);
}

/* Subtle bottom gradient — text readability only */
.${CLS}-grad {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.25) 35%, transparent 60%);
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.${CLS}-card:hover .${CLS}-grad {
  opacity: 0.6;
}

/* Category-colored top accent strip */
.${CLS}-cat-strip {
  position: absolute; top: 0; left: 0; right: 0;
  height: 3px;
  z-index: 10;
  opacity: 0.85;
  transition: opacity 0.3s ease, box-shadow 0.3s ease;
}
.${CLS}-card:hover .${CLS}-cat-strip {
  opacity: 1;
  box-shadow: 0 0 12px var(--cat-color), 0 0 24px var(--cat-color);
}

/* Card title — hides on hover */
.${CLS}-title {
  position: absolute; bottom: 1.2rem; left: 1.2rem; right: 1.2rem;
  opacity: 1;
  transition: opacity 0.25s ease;
}
.${CLS}-card:hover .${CLS}-title { opacity: 0; }

/* Glass info overlay — appears on hover */
.${CLS}-glass {
  position: absolute;
  bottom: -1.2rem; left: -0.5rem; right: -0.5rem;
  background: rgba(2, 6, 23, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(4% 0, 100% 0, 100% 92%, 96% 100%, 0 100%, 0 8%);
  padding: 1rem 1.2rem;
  display: flex; flex-direction: column; gap: 0.5rem;
  box-shadow: 0 0 0 1px ${ACCENT_DIM},
              inset 0 1px 0 rgba(56,189,248,0.1),
              0 20px 50px rgba(0,0,0,0.7);
  opacity: 0;
  transform: translateY(12px) translateZ(35px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
  z-index: 60;
  will-change: opacity, transform;
}
.${CLS}-card:hover .${CLS}-glass {
  opacity: 1;
  transform: translateY(0) translateZ(40px);
  pointer-events: auto;
}

/* Day tab */
.${CLS}-tab {
  display: flex; flex-direction: column; align-items: center;
  cursor: pointer; position: relative; width: 33.33%;
  transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
}

/* Grid crossfade */
.${CLS}-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  width: 100%;
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: ${CLS}FadeIn 0.35s ease both;
}
@keyframes ${CLS}FadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Bracket SVG transitions */
.${CLS}-bracket path,
.${CLS}-bracket circle {
  transition: d 0.5s cubic-bezier(0.23,1,0.32,1),
              cx 0.5s cubic-bezier(0.23,1,0.32,1);
}


/* Metadata row */
.${CLS}-meta {
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.68rem; color: rgba(148,163,184,0.9);
  font-family: 'Inter', 'SF Mono', monospace;
}
.${CLS}-meta-icon {
  width: 14px; height: 14px; opacity: 0.7;
  flex-shrink: 0;
}
.${CLS}-divider {
  height: 1px; width: 100%;
  background: linear-gradient(to right, transparent, ${ACCENT_DIM}, transparent);
}
.${CLS}-cat-tag {
  font-size: 0.55rem; font-weight: 700;
  padding: 0.15rem 0.5rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  flex-shrink: 0;
}

/* ═══ MODAL OVERLAY ═══ */
.${CLS}-modal-backdrop {
  position: fixed; inset: 0;
  z-index: 200;
  background: rgba(0, 2, 10, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: opacity 0.35s cubic-bezier(0.23,1,0.32,1);
  pointer-events: none;
  cursor: pointer;
}
.${CLS}-modal-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

.${CLS}-modal-content {
  display: flex; align-items: stretch; gap: 0;
  max-width: 900px; width: 90vw;
  max-height: 80vh;
  transform: scale(0.92) translateY(20px);
  transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
  cursor: default;
}
.${CLS}-modal-backdrop.open .${CLS}-modal-content {
  transform: scale(1) translateY(0);
}

/* Left: Image */
.${CLS}-modal-img-wrap {
  position: relative;
  flex: 0 0 42%;
  min-height: 380px;
  border: 2px solid ${ACCENT_MED};
  box-shadow: 0 0 20px rgba(56,189,248,0.2),
              0 0 60px rgba(56,189,248,0.08),
              inset 0 0 30px rgba(56,189,248,0.05);
  overflow: hidden;
  clip-path: polygon(6% 0, 100% 0, 100% 94%, 94% 100%, 0 100%, 0 6%);
}
.${CLS}-modal-img-wrap::before {
  content: '';
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.15) 35%, transparent 60%);
  pointer-events: none;
}
.${CLS}-modal-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.${CLS}-modal-img-title {
  position: absolute; bottom: 1.2rem; left: 1.2rem; right: 1.2rem;
  z-index: 3;
  font-family: 'Space Grotesk', 'Orbitron', sans-serif;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #e2e8f0;
  text-shadow: 0 0 15px rgba(56,189,248,0.4);
}

/* Corner brackets on image */
.${CLS}-modal-img-wrap::after {
  content: '';
  position: absolute; top: 8px; left: 8px;
  width: 20px; height: 20px;
  border-top: 1px solid ${ACCENT};
  border-left: 1px solid ${ACCENT};
  z-index: 3;
}

/* Right: Details panel */
.${CLS}-modal-details {
  flex: 1;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%),
              rgba(2, 6, 23, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  clip-path: polygon(0 0, 100% 0, 100% 92%, 96% 100%, 0 100%);
  padding: 2.5rem 2rem;
  display: flex; flex-direction: column; gap: 1.2rem;
  overflow-y: auto;
  box-shadow: 0 0 0 1px ${ACCENT_DIM},
              inset 0 1px 0 rgba(56,189,248,0.08);
  border-left: 1px solid rgba(56,189,248,0.08);
}
.${CLS}-modal-details h2 {
  font-family: 'Space Grotesk', 'Orbitron', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  color: #fff;
  text-shadow: 0 0 10px rgba(56,189,248,0.2);
}
.${CLS}-modal-desc {
  font-size: 0.88rem;
  font-weight: 300;
  color: rgba(203,213,225,0.85);
  line-height: 1.7;
  margin: 0;
  letter-spacing: 0.01em;
}

/* Detail rows */
.${CLS}-modal-row {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(56,189,248,0.08);
}
.${CLS}-modal-row:last-child { border-bottom: none; }
.${CLS}-modal-row-icon {
  width: 20px; height: 20px;
  flex-shrink: 0;
  opacity: 0.9;
}
.${CLS}-modal-row-label {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(148,163,184,0.9);
  min-width: 100px;
}
.${CLS}-modal-row-value {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 0.92rem;
  font-weight: 500;
  color: #e2e8f0;
  letter-spacing: 0.02em;
}

/* Close button */
.${CLS}-modal-close {
  position: absolute; top: 1.2rem; right: 1.2rem;
  width: 36px; height: 36px;
  border: 1px solid ${ACCENT_MED};
  background: rgba(2,6,23,0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${ACCENT};
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
  transition: background 0.2s, box-shadow 0.2s;
  z-index: 210;
}
.${CLS}-modal-close:hover {
  background: rgba(56,189,248,0.15);
  box-shadow: 0 0 15px rgba(56,189,248,0.3);
}
`;

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const ScheduleSection: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    const [activeDay, setActiveDay] = useState(1);
    const [cardsRevealed, setCardsRevealed] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const revealTimerRef = useRef(0);

    // Close modal on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedEvent(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleDayClick = useCallback((dayId: number) => {
        setActiveDay(dayId);
    }, []);

    const dayEvents = useMemo(() => getEventsForDay(activeDay), [activeDay]);

    // SVG bracket geometry
    const bracket = useMemo(() => {
        const centers = [150, 450, 750];
        const idx = activeDay - 1;
        const center = centers[idx] || 150;
        const w = 140;
        const sx = center - w / 2 - 20;
        const fx = sx + w;
        const dx = fx + 40;
        return { pathD: `M ${sx} 0 L ${fx} 0 L ${dx} 40 L 1000 40`, fx, dx };
    }, [activeDay]);


    // ── Scroll entrance ──
    useFrame((_state, delta) => {
        if (!containerRef.current) return;
        const r = scroll.offset;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

        let revealT = 0;
        if (r >= SCHEDULE_FADE_START && r < SCHEDULE_FADE_FULL) {
            revealT = (r - SCHEDULE_FADE_START) / (SCHEDULE_FADE_FULL - SCHEDULE_FADE_START);
        } else if (r >= SCHEDULE_FADE_FULL) {
            revealT = 1;
        }

        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, revealT, 4, delta);
        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
        containerRef.current.style.opacity = String(opacityRef.current.toFixed(3));

        if (opacityRef.current > 0.5 && !cardsRevealed) {
            revealTimerRef.current += delta;
            if (revealTimerRef.current > 0.3) setCardsRevealed(true);
        }
        if (opacityRef.current < 0.1 && cardsRevealed) {
            setCardsRevealed(false);
            revealTimerRef.current = 0;
        }
        containerRef.current.style.pointerEvents = opacityRef.current > 0.1 ? 'auto' : 'none';
    });

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                opacity: 0, zIndex: 25, overflow: 'hidden auto',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                background: 'radial-gradient(ellipse at 50% 30%, #020617 0%, #000 100%)',
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                color: '#fff',
            }}
        >
            <style>{STYLES}</style>

            {/* ── Scanlines + noise ── */}
            <div className={`${CLS}-scanlines`} />
            <div className={`${CLS}-noise`} />

            {/* ── Background: perspective grid floor ── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {/* Receding grid floor */}
                <div style={{
                    position: 'absolute',
                    left: '-50%', right: '-50%', bottom: '-20%',
                    height: '80%',
                    backgroundImage: `
            linear-gradient(to right, ${ACCENT_DIM} 1px, transparent 1px),
            linear-gradient(to bottom, ${ACCENT_DIM} 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                    opacity: 0.35,
                    transform: 'perspective(400px) rotateX(65deg)',
                    transformOrigin: 'bottom center',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
                }} />
                {/* Top-left glow orb */}
                <div style={{
                    position: 'absolute', top: '-5%', left: '15%',
                    width: '30rem', height: '30rem',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
                {/* Bottom-right glow orb */}
                <div style={{
                    position: 'absolute', bottom: '5%', right: '10%',
                    width: '25rem', height: '25rem',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
            </div>

            {/* ── Corner brackets (viewport) ── */}
            {[
                { top: '2rem', left: '2rem', bL: true, bT: true },
                { top: '2rem', right: '2rem', bR: true, bT: true },
                { bottom: '2rem', left: '2rem', bL: true, bB: true },
                { bottom: '2rem', right: '2rem', bR: true, bB: true },
            ].map((pos, i) => (
                <div key={i} style={{
                    position: 'fixed', width: 18, height: 18, opacity: 0.35,
                    ...(pos.top ? { top: pos.top } : {}),
                    ...(pos.bottom ? { bottom: pos.bottom } : {}),
                    ...(pos.left ? { left: pos.left } : {}),
                    ...(pos.right ? { right: pos.right } : {}),
                    borderLeft: pos.bL ? `1px solid ${ACCENT_MED}` : 'none',
                    borderRight: pos.bR ? `1px solid ${ACCENT_MED}` : 'none',
                    borderTop: pos.bT ? `1px solid ${ACCENT_MED}` : 'none',
                    borderBottom: pos.bB ? `1px solid ${ACCENT_MED}` : 'none',
                }} />
            ))}

            {/* ── Main content ── */}
            <main style={{
                position: 'relative', zIndex: 10,
                width: '100%', minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-start',
                paddingTop: '2rem', paddingBottom: '5rem',
                perspective: '1200px',
            }}>
                {/* ── Day tabs ── */}
                <nav style={{
                    position: 'relative', zIndex: 50,
                    marginBottom: '1.5rem', marginTop: '3rem',
                    width: '100%', maxWidth: '900px', padding: '0 1rem',
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        paddingTop: '3rem', paddingBottom: '1rem',
                        position: 'relative', zIndex: 20,
                    }}>
                        {SCHEDULE_DAYS.map((day, i) => {
                            const isActive = activeDay === day.id;
                            return (
                                <div
                                    key={day.id}
                                    className={`${CLS}-tab`}
                                    onClick={() => handleDayClick(day.id)}
                                    style={{
                                        opacity: cardsRevealed ? 1 : 0,
                                        transform: cardsRevealed ? 'translateY(0)' : 'translateY(-15px)',
                                        transitionDelay: `${i * 80}ms`,
                                    }}
                                >
                                    <span style={{
                                        fontFamily: "'Space Grotesk', 'Orbitron', sans-serif",
                                        fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                                        fontWeight: 700,
                                        letterSpacing: '0.15em',
                                        color: isActive ? ACCENT : '#334155',
                                        textShadow: isActive ? `0 0 25px ${ACCENT_GLOW}` : 'none',
                                        transition: 'color 0.3s, text-shadow 0.3s, transform 0.3s',
                                        transform: isActive ? 'translateY(0)' : 'translateY(-3px)',
                                    }}>
                                        {day.label}
                                    </span>
                                    <span style={{
                                        marginTop: '0.25rem',
                                        fontSize: '0.65rem', fontWeight: 500,
                                        letterSpacing: '0.2em',
                                        color: isActive ? 'rgba(186,230,253,0.9)' : '#1e293b',
                                        transition: 'color 0.3s',
                                    }}>
                                        {day.date.toUpperCase()}
                                    </span>
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '6rem', height: '6rem',
                                            background: 'rgba(56,189,248,0.08)',
                                            filter: 'blur(25px)', borderRadius: '50%', zIndex: -1,
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* SVG bracket line */}
                    <div className={`${CLS}-bracket`} style={{
                        position: 'relative', width: '100%', height: '50px',
                        pointerEvents: 'none', overflow: 'visible', zIndex: 10,
                        opacity: cardsRevealed ? 1 : 0,
                        transition: 'opacity 0.5s ease 0.2s',
                    }}>
                        <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 900 100">
                            <defs>
                                <linearGradient id="bGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0} />
                                    <stop offset="10%" stopColor={ACCENT} stopOpacity={0.6} />
                                    <stop offset="30%" stopColor={ACCENT} stopOpacity={1} />
                                    <stop offset="55%" stopColor={ACCENT} stopOpacity={0.7} />
                                    <stop offset="100%" stopColor="#1e293b" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <path d={bracket.pathD} fill="none" stroke="url(#bGrad)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                            <circle cx={bracket.fx} cy={0} r={2.5} fill={ACCENT} />
                            <circle cx={bracket.dx} cy={40} r={2} fill={ACCENT} />
                        </svg>
                    </div>
                </nav>

                {/* ── Card Grid ── */}
                <div style={{
                    width: '100%', maxWidth: '1400px',
                    padding: '0 2rem 4rem',
                }}>
                    <div key={activeDay} className={`${CLS}-grid`}>
                        {dayEvents.map((event, i) => {
                            const catColor = event.category ? CATEGORY_COLORS[event.category] || ACCENT : ACCENT;
                            const catLabel = event.category?.toUpperCase() || 'EVENT';
                            return (
                                <div
                                    key={event.title}
                                    className={`${CLS}-card ${cardsRevealed ? 'revealed' : ''}`}
                                    style={{ transitionDelay: `${i * CARD_STAGGER_MS}ms` }}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {/* Card body */}
                                    <div className={`${CLS}-body`}>
                                        <div className={`${CLS}-cat-strip`} style={{ background: catColor, ['--cat-color' as any]: catColor }} />
                                        <img className={`${CLS}-img`} src={event.image} alt={event.title} loading="lazy" />
                                        <div className={`${CLS}-grad`} />
                                        {/* Title bar at bottom */}
                                        <div className={`${CLS}-title`}>
                                            <h3 style={{
                                                fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)',
                                                fontWeight: 700, letterSpacing: '0.12em',
                                                color: '#e2e8f0', textTransform: 'uppercase', margin: 0,
                                                textShadow: `0 0 10px rgba(56,189,248,0.3)`,
                                            }}>
                                                {event.title}
                                            </h3>
                                            <div style={{
                                                height: 2, width: '2rem', marginTop: '0.4rem',
                                                background: `linear-gradient(to right, ${ACCENT}, transparent)`,
                                            }} />
                                        </div>
                                    </div>

                                    {/* ── Glass info overlay ── */}
                                    <div className={`${CLS}-glass`}>
                                        {/* Title + category */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <h3 style={{
                                                fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
                                                fontWeight: 700, color: '#fff',
                                                letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0,
                                            }}>
                                                {event.title}
                                            </h3>
                                            <span className={`${CLS}-cat-tag`} style={{
                                                background: `${catColor}20`, color: catColor,
                                                border: `1px solid ${catColor}40`,
                                                clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                                            }}>
                                                {catLabel}
                                            </span>
                                        </div>

                                        <div className={`${CLS}-divider`} />

                                        {/* Time row */}
                                        <div className={`${CLS}-meta`}>
                                            <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                            </svg>
                                            <span>{event.time}{event.endTime ? ` – ${event.endTime}` : ''}</span>
                                            {event.prizePool && (
                                                <>
                                                    <span style={{ width: 3, height: 3, background: ACCENT, borderRadius: '50%', display: 'inline-block' }} />
                                                    <span style={{ color: ACCENT, fontWeight: 700, letterSpacing: '0.05em' }}>₹ {event.prizePool}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Venue row */}
                                        <div className={`${CLS}-meta`}>
                                            <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                            <span>{event.venue}</span>
                                            {event.teamSize && (
                                                <>
                                                    <span style={{ width: 3, height: 3, background: ACCENT, borderRadius: '50%', display: 'inline-block' }} />
                                                    <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                    <span>{event.teamSize}</span>
                                                </>
                                            )}
                                        </div>

                                        {/* Description */}
                                        {event.description && (
                                            <>
                                                <div className={`${CLS}-divider`} />
                                                <p style={{
                                                    fontSize: '0.65rem', fontWeight: 300,
                                                    color: 'rgba(148,163,184,0.8)',
                                                    lineHeight: 1.55, margin: 0,
                                                    letterSpacing: '0.01em',
                                                }}>
                                                    {event.description}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* ── EVENT DETAIL MODAL (portal to body) ── */}
            {createPortal(
                <div
                    className={`${CLS}-modal-backdrop ${selectedEvent ? 'open' : ''}`}
                    onClick={() => setSelectedEvent(null)}
                >
                    <style>{STYLES}</style>
                    {selectedEvent && (() => {
                        const ev = selectedEvent;
                        const catColor = ev.category ? CATEGORY_COLORS[ev.category] || ACCENT : ACCENT;
                        return (
                            <div
                                className={`${CLS}-modal-content`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    className={`${CLS}-modal-close`}
                                    onClick={() => setSelectedEvent(null)}
                                    aria-label="Close"
                                >✕</button>

                                {/* Left: Image */}
                                <div className={`${CLS}-modal-img-wrap`} style={{
                                    borderColor: catColor,
                                    boxShadow: `0 0 20px ${catColor}33, 0 0 60px ${catColor}14, inset 0 0 30px ${catColor}0d`,
                                }}>
                                    <img className={`${CLS}-modal-img`} src={ev.image} alt={ev.title} />
                                    <span className={`${CLS}-modal-img-title`}>{ev.title}</span>
                                </div>

                                {/* Right: Details */}
                                <div className={`${CLS}-modal-details`}>
                                    <h2>{ev.title}</h2>
                                    {ev.description && (
                                        <p className={`${CLS}-modal-desc`}>{ev.description}</p>
                                    )}

                                    <div style={{ marginTop: '0.5rem' }}>
                                        {/* Time */}
                                        <div className={`${CLS}-modal-row`}>
                                            <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="1.5">
                                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                            </svg>
                                            <span className={`${CLS}-modal-row-label`}>Time:</span>
                                            <span className={`${CLS}-modal-row-value`}>
                                                {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}
                                            </span>
                                        </div>

                                        {/* Venue */}
                                        <div className={`${CLS}-modal-row`}>
                                            <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="1.5">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                            <span className={`${CLS}-modal-row-label`}>Venue:</span>
                                            <span className={`${CLS}-modal-row-value`}>{ev.venue}</span>
                                        </div>

                                        {/* Prize Pool */}
                                        {ev.prizePool && (
                                            <div className={`${CLS}-modal-row`}>
                                                <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="1.5">
                                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                                    <path d="M4 22h16" />
                                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                                </svg>
                                                <span className={`${CLS}-modal-row-label`}>Prize Pool:</span>
                                                <span className={`${CLS}-modal-row-value`} style={{ color: catColor, fontWeight: 700 }}>
                                                    {ev.prizePool}
                                                </span>
                                            </div>
                                        )}

                                        {/* Team Size */}
                                        {ev.teamSize && (
                                            <div className={`${CLS}-modal-row`}>
                                                <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="1.5">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span className={`${CLS}-modal-row-label`}>Team Size:</span>
                                                <span className={`${CLS}-modal-row-value`}>{ev.teamSize}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Category badge */}
                                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700,
                                            padding: '0.25rem 0.8rem',
                                            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                                            background: `${catColor}20`, color: catColor,
                                            border: `1px solid ${catColor}40`,
                                            clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                                        }}>
                                            {ev.category?.toUpperCase() || 'EVENT'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>,
                document.body
            )}

            {/* ── Bottom indicator ── */}
            <div style={{
                position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                opacity: cardsRevealed ? 0.3 : 0, transition: 'opacity 0.5s ease 0.4s',
            }}>
                <span style={{
                    fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                    color: ACCENT_MED,
                }}>
                    Scroll for Depth
                </span>
                <div style={{
                    width: 1, height: '2rem',
                    background: `linear-gradient(to bottom, ${ACCENT}, transparent)`,
                }} />
            </div>
        </div>
    );
};

export default ScheduleSection;
