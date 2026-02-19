import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScheduleEvent } from '../../../data/schedule';
import { useEvents } from '../../../hooks/useSupabaseData';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

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
  height: clamp(180px, 15rem, 240px);
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
  font-family: var(--font-mono);
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
  font-family: var(--font-heading);
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
  font-family: var(--font-heading);
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
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(148,163,184,0.9);
  min-width: 100px;
}
.${CLS}-modal-row-value {
  font-family: var(--font-heading);
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

/* Navigation arrows */
.${CLS}-modal-nav {
  position: absolute; top: 50%; z-index: 220;
  transform: translateY(-50%);
  width: 44px; height: 44px;
  border: 1px solid ${ACCENT_MED};
  background: rgba(2,6,23,0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${ACCENT};
  font-size: 1.3rem; line-height: 1;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
  transition: background 0.2s, box-shadow 0.2s, transform 0.25s;
}
.${CLS}-modal-nav:hover {
  background: rgba(56,189,248,0.15);
  box-shadow: 0 0 20px rgba(56,189,248,0.3);
  transform: translateY(-50%) scale(1.1);
}
.${CLS}-modal-nav:active {
  transform: translateY(-50%) scale(0.95);
}
.${CLS}-modal-nav.prev { left: -60px; }
.${CLS}-modal-nav.next { right: -60px; }
@media (max-width: 900px) {
  .${CLS}-modal-nav.prev { left: 0.5rem; }
  .${CLS}-modal-nav.next { right: 0.5rem; }
}

/* Event counter */
.${CLS}-modal-counter {
  position: absolute; bottom: -2rem; left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem; letter-spacing: 0.2em;
  color: ${ACCENT_MED};
  white-space: nowrap;
}

/* ═══════════════════════════════════════════
   MOBILE ACCORDION VIEW (≤768px)
   ═══════════════════════════════════════════ */
@media (max-width: 768px) {
  /* Hide desktop grid on mobile */
  .${CLS}-grid { display: none !important; }

  /* Day tabs — smaller on mobile */
  .${CLS}-tab span:first-child {
    font-size: clamp(1rem, 5vw, 1.3rem) !important;
  }

  /* Mobile list container */
  .${CLS}-mob-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    animation: ${CLS}FadeIn 0.35s ease both;
  }

  /* Accordion item — collapsed row */
  .${CLS}-mob-item {
    position: relative;
    background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%),
                rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid ${ACCENT_DIM};
    clip-path: polygon(4% 0, 100% 0, 100% 88%, 96% 100%, 0 100%, 0 12%);
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .${CLS}-mob-item.expanded {
    border-color: ${ACCENT_MED};
    box-shadow: 0 0 20px rgba(56,189,248,0.12),
                inset 0 0 20px rgba(56,189,248,0.05);
  }

  /* Collapsed header row */
  .${CLS}-mob-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    position: relative;
  }

  /* Thumbnail */
  .${CLS}-mob-thumb {
    width: 52px;
    height: 52px;
    min-width: 52px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid ${ACCENT_DIM};
    filter: brightness(0.9) saturate(1.1);
  }

  /* Title + meta in header */
  .${CLS}-mob-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .${CLS}-mob-title {
    font-family: var(--font-heading);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
  .${CLS}-mob-subtitle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: rgba(148,163,184,0.8);
    font-family: var(--font-mono);
  }
  .${CLS}-mob-subtitle svg {
    width: 12px;
    height: 12px;
    opacity: 0.7;
    flex-shrink: 0;
  }
  .${CLS}-mob-subtitle .dot {
    width: 3px;
    height: 3px;
    background: ${ACCENT_MED};
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Category tag + chevron in header */
  .${CLS}-mob-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  /* Chevron */
  .${CLS}-mob-chevron {
    width: 16px;
    height: 16px;
    color: ${ACCENT};
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1);
  }
  .${CLS}-mob-item.expanded .${CLS}-mob-chevron {
    transform: rotate(180deg);
  }

  /* Category strip on left edge */
  .${CLS}-mob-cat-line {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
  }

  /* Expanded details panel */
  .${CLS}-mob-details {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.23,1,0.32,1),
                opacity 0.35s ease;
  }
  .${CLS}-mob-item.expanded .${CLS}-mob-details {
    max-height: 600px;
    opacity: 1;
  }

  /* Expanded image */
  .${CLS}-mob-exp-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    filter: brightness(0.9) saturate(1.15);
    border-top: 1px solid ${ACCENT_DIM};
    border-bottom: 1px solid ${ACCENT_DIM};
  }

  /* Expanded content */
  .${CLS}-mob-exp-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .${CLS}-mob-exp-desc {
    font-size: 0.75rem;
    font-weight: 300;
    color: rgba(203,213,225,0.85);
    line-height: 1.65;
    margin: 0;
    letter-spacing: 0.01em;
  }

  /* Expanded metadata rows */
  .${CLS}-mob-exp-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(56,189,248,0.06);
  }
  .${CLS}-mob-exp-row:last-child { border-bottom: none; }
  .${CLS}-mob-exp-row svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.9;
  }
  .${CLS}-mob-exp-label {
    font-family: var(--font-heading);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(148,163,184,0.9);
    min-width: 70px;
  }
  .${CLS}-mob-exp-value {
    font-family: var(--font-heading);
    font-size: 0.75rem;
    font-weight: 500;
    color: #e2e8f0;
    letter-spacing: 0.02em;
  }

  /* Register CTA */
  .${CLS}-mob-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    margin-top: 0.25rem;
    background: rgba(56,189,248,0.08);
    border: 1px solid ${ACCENT_MED};
    clip-path: polygon(3% 0, 100% 0, 97% 100%, 0 100%);
    color: ${ACCENT};
    font-family: var(--font-heading);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .${CLS}-mob-cta:hover {
    background: rgba(56,189,248,0.15);
    box-shadow: 0 0 15px rgba(56,189,248,0.25);
  }

  /* View More button */
  .${CLS}-mob-viewmore {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.85rem 1rem;
    margin-top: 0.5rem;
    background: linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(56,189,248,0.02) 100%);
    border: 1px dashed ${ACCENT_MED};
    clip-path: polygon(2% 0, 100% 0, 98% 100%, 0 100%);
    color: ${ACCENT};
    font-family: var(--font-heading);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .${CLS}-mob-viewmore:hover,
  .${CLS}-mob-viewmore:active {
    background: rgba(56,189,248,0.12);
    border-color: ${ACCENT};
    box-shadow: 0 0 20px rgba(56,189,248,0.15);
  }
  .${CLS}-mob-viewmore-count {
    font-size: 0.65rem;
    font-weight: 500;
    color: ${ACCENT_MED};
    letter-spacing: 0.1em;
  }

  /* Hide modal on mobile */
  .${CLS}-modal-backdrop { display: none !important; }
}
`;

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const ScheduleSection: React.FC = () => {

    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    // ── Supabase data hook (lazy-loads on viewport approach) ──
    const { events: allEvents, days: scheduleDays, ref: lazyRef } = useEvents();

    const [activeDay, setActiveDay] = useState(1);
    const [cardsRevealed, setCardsRevealed] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);


    // Helper: filter events by day (replaces hardcoded getEventsForDay)
    const getEventsForDay = useCallback(
        (dayId: number) => allEvents.filter(e => e.dayId === dayId),
        [allEvents],
    );

    // ── Mobile detection ──
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 768px)');
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, []);

    // Navigate events from modal with arrow keys / Escape
    const navigateEvent = useCallback((dir: -1 | 1) => {
        setSelectedEvent((prev): ScheduleEvent | null => {
            if (!prev) return null;
            const events = getEventsForDay(prev.dayId);
            const idx = events.findIndex(e => e.title === prev.title);
            if (idx < 0) return prev;
            const next = idx + dir;
            if (next < 0 || next >= events.length) return prev;
            return events[next] ?? prev;
        });
    }, [getEventsForDay]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedEvent(null);
            if (e.key === 'ArrowLeft') navigateEvent(-1);
            if (e.key === 'ArrowRight') navigateEvent(1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [navigateEvent]);

    const handleDayClick = useCallback((dayId: number) => {
        setActiveDay(dayId);
        setExpandedIndex(null);
    }, []);

    const dayEvents = useMemo(() => getEventsForDay(activeDay), [activeDay, getEventsForDay]);

    const handleAccordionToggle = useCallback((idx: number) => {
        setExpandedIndex(prev => prev === idx ? null : idx);
    }, []);

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

    // ── ScrollTrigger: symmetric fade (in/hold/out) + card reveal ──
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // No opacity scrub — section starts visible (like highlights/team).
        // Content reveal is handled by `cardsRevealed` state transitions.

        // Cards: reveal when section in view
        const st = ScrollTrigger.create({
            trigger: '#schedule-section',
            start: 'top 70%',
            end: 'bottom top',
            onEnter: () => setCardsRevealed(true),
            onEnterBack: () => setCardsRevealed(true),
        });

        return () => {
            st.kill();
        };
    }, []);

    return (
        <div
            ref={(el) => {
                (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                if (typeof lazyRef === 'function') lazyRef(el);
                else if (lazyRef && 'current' in lazyRef) (lazyRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            style={{
                position: 'relative',
                width: '100%', minHeight: '100vh',
                opacity: 1, zIndex: 25,
                fontFamily: "var(--font-heading)",
                color: '#fff',
            }}
        >
            <style>{STYLES}</style>

            {/* ── Sticky background layer — sticks at 100vh while content scrolls ── */}
            <div
                ref={bgRef}
                style={{
                    position: 'sticky', top: 0,
                    width: '100%', height: '100vh',
                    zIndex: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at 50% 30%, #020617 0%, #000 100%)',
                }}
            >
                {/* Scanlines + noise */}
                <div className={`${CLS}-scanlines`} />
                <div className={`${CLS}-noise`} />

                {/* Receding grid floor */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
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
                    {/* Glow orbs */}
                    <div style={{
                        position: 'absolute', top: '-5%', left: '15%',
                        width: '30rem', height: '30rem',
                        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '5%', right: '10%',
                        width: '25rem', height: '25rem',
                        background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }} />
                </div>
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

            {/* ── Main content (pulled up over the sticky bg) ── */}
            <main style={{
                position: 'relative', zIndex: 10,
                width: '100%', minHeight: '100dvh',
                marginTop: '-100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-start',
                paddingTop: '2rem', paddingBottom: '5rem',
            }}>
                {/* ── Day tabs ── */}
                <nav style={{
                    position: isMobile ? 'sticky' as const : 'relative' as const,
                    top: isMobile ? 0 : undefined,
                    zIndex: 50,
                    marginBottom: '1.5rem', marginTop: isMobile ? '4.5rem' : '3rem',
                    width: '100%', maxWidth: '900px', padding: '0 1rem',
                    background: isMobile ? '#0B0F1A' : 'transparent',
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        paddingTop: '3rem', paddingBottom: '1rem',
                        position: 'relative', zIndex: 20,
                    }}>
                        {scheduleDays.map((day: { id: number; label: string; date: string }, i: number) => {
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
                                        fontFamily: "var(--font-heading)",
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

                {/* ── Card Grid (desktop) + Mobile Accordion ── */}
                <div style={{
                    width: '100%', maxWidth: '1400px',
                    padding: '0 2rem 4rem',
                }}>
                    {/* Desktop 3D Card Grid */}
                    <div key={activeDay} className={`${CLS}-grid`}>
                        {dayEvents.map((event, i) => {
                            return (
                                <div
                                    key={`${event.title}-${i}`}
                                    className={`${CLS}-card ${cardsRevealed ? 'revealed' : ''}`}
                                    style={{ transitionDelay: `${Math.min(i, 15) * CARD_STAGGER_MS}ms` }}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {/* Card body — gradient + typography (no image) */}
                                    <div className={`${CLS}-body`}>
                                        <div className={`${CLS}-cat-strip`} style={{ background: ACCENT, ['--cat-color' as any]: ACCENT }} />
                                        {/* Event poster or gradient fallback */}
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className={`${CLS}-img`}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: `linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(2,6,23,0.95) 60%, rgba(56,189,248,0.04) 100%)`,
                                            }} />
                                        )}
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
                                            {event.society && (
                                                <span style={{ fontSize: '0.6rem', color: ACCENT, letterSpacing: '0.1em', marginTop: '0.3rem', display: 'block' }}>
                                                    {event.society}
                                                </span>
                                            )}
                                            <div style={{
                                                height: 2, width: '2rem', marginTop: '0.4rem',
                                                background: `linear-gradient(to right, ${ACCENT}, transparent)`,
                                            }} />
                                        </div>
                                    </div>

                                    {/* ── Glass info overlay ── */}
                                    <div className={`${CLS}-glass`}>
                                        <h3 style={{
                                            fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
                                            fontWeight: 700, color: '#fff',
                                            letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0,
                                        }}>
                                            {event.title}
                                        </h3>

                                        <div className={`${CLS}-divider`} />

                                        {/* Time row */}
                                        <div className={`${CLS}-meta`}>
                                            <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                            </svg>
                                            <span>{event.time}</span>
                                        </div>

                                        {/* Venue row */}
                                        <div className={`${CLS}-meta`}>
                                            <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                <circle cx="12" cy="9" r="2.5" />
                                            </svg>
                                            <span>{event.venue}</span>
                                        </div>

                                        {/* Society */}
                                        {event.society && (
                                            <div className={`${CLS}-meta`}>
                                                <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <span>{event.society}</span>
                                            </div>
                                        )}

                                        {/* Coordinator */}
                                        {event.coordinator && (
                                            <div className={`${CLS}-meta`}>
                                                <svg className={`${CLS}-meta-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <span>{event.coordinator}</span>
                                                {event.coordinatorContact && (
                                                    <>
                                                        <span style={{ width: 3, height: 3, background: ACCENT, borderRadius: '50%', display: 'inline-block' }} />
                                                        <span style={{ color: ACCENT }}>{event.coordinatorContact}</span>
                                                    </>
                                                )}
                                            </div>
                                        )}

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

                    {/* ── Mobile Accordion List ── */}
                    {isMobile && (
                        <div key={`mob-${activeDay}`} className={`${CLS}-mob-list`}>
                            {dayEvents.map((event, i) => {
                                const isExpanded = expandedIndex === i;
                                return (
                                    <div
                                        key={`${event.title}-${i}`}
                                        className={`${CLS}-mob-item ${isExpanded ? 'expanded' : ''}`}
                                        style={{
                                            opacity: cardsRevealed ? 1 : 0,
                                            transform: cardsRevealed ? 'translateY(0)' : 'translateY(12px)',
                                            transition: `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
                                        }}
                                    >
                                        {/* Accent strip on left */}
                                        <div className={`${CLS}-mob-cat-line`} style={{ background: ACCENT }} />

                                        {/* Collapsed header */}
                                        <div
                                            className={`${CLS}-mob-header`}
                                            onClick={() => handleAccordionToggle(i)}
                                        >
                                            {event.imageUrl && !isExpanded && (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className={`${CLS}-mob-thumb`}
                                                    loading="lazy"
                                                />
                                            )}
                                            <div className={`${CLS}-mob-info`}>
                                                <h4 className={`${CLS}-mob-title`}>{event.title}</h4>
                                                <div className={`${CLS}-mob-subtitle`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span>{event.time}</span>
                                                    <span className="dot" />
                                                    <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                        <circle cx="12" cy="9" r="2.5" />
                                                    </svg>
                                                    <span>{event.venue}</span>
                                                </div>
                                            </div>
                                            <div className={`${CLS}-mob-right`}>
                                                {event.society && (
                                                    <span className={`${CLS}-cat-tag`} style={{
                                                        background: `${ACCENT}20`, color: ACCENT,
                                                        border: `1px solid ${ACCENT}40`,
                                                        clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                                                    }}>
                                                        {event.society}
                                                    </span>
                                                )}
                                                <svg className={`${CLS}-mob-chevron`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        <div className={`${CLS}-mob-details`}>
                                            <div className={`${CLS}-mob-exp-content`}>
                                                {/* Poster image */}
                                                {event.imageUrl && (
                                                    <img
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        className={`${CLS}-mob-exp-img`}
                                                        loading="lazy"
                                                        style={{
                                                            width: '100%', borderRadius: '6px',
                                                            marginBottom: '0.75rem',
                                                            border: `1px solid ${ACCENT}30`,
                                                        }}
                                                    />
                                                )}
                                                {event.description && (
                                                    <p className={`${CLS}-mob-exp-desc`}>{event.description}</p>
                                                )}

                                                <div className={`${CLS}-divider`} />

                                                {/* Time */}
                                                <div className={`${CLS}-mob-exp-row`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span className={`${CLS}-mob-exp-label`}>Time</span>
                                                    <span className={`${CLS}-mob-exp-value`}>{event.time}</span>
                                                </div>

                                                {/* Venue */}
                                                <div className={`${CLS}-mob-exp-row`}>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                                        <circle cx="12" cy="9" r="2.5" />
                                                    </svg>
                                                    <span className={`${CLS}-mob-exp-label`}>Venue</span>
                                                    <span className={`${CLS}-mob-exp-value`}>{event.venue}</span>
                                                </div>

                                                {/* Society */}
                                                {event.society && (
                                                    <div className={`${CLS}-mob-exp-row`}>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                            <circle cx="9" cy="7" r="4" />
                                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                        </svg>
                                                        <span className={`${CLS}-mob-exp-label`}>Society</span>
                                                        <span className={`${CLS}-mob-exp-value`}>{event.society}</span>
                                                    </div>
                                                )}

                                                {/* Coordinator */}
                                                {event.coordinator && (
                                                    <div className={`${CLS}-mob-exp-row`}>
                                                        <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                            <circle cx="12" cy="7" r="4" />
                                                        </svg>
                                                        <span className={`${CLS}-mob-exp-label`}>Contact</span>
                                                        <span className={`${CLS}-mob-exp-value`}>
                                                            {event.coordinator}
                                                            {event.coordinatorContact && ` · ${event.coordinatorContact}`}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Register CTA */}
                                                {event.registrationLink && (
                                                    <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                        <div className={`${CLS}-mob-cta`}>
                                                            Register Now
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Event count */}
                            <div style={{
                                textAlign: 'center', padding: '1rem 0', fontSize: '0.65rem',
                                color: ACCENT_MED, letterSpacing: '0.15em', textTransform: 'uppercase',
                            }}>
                                {dayEvents.length} events
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ── EVENT DETAIL MODAL ── */}
            <div
                className={`${CLS}-modal-backdrop ${selectedEvent ? 'open' : ''}`}
                onClick={() => setSelectedEvent(null)}
                style={{ position: 'fixed' }}
            >
                <style>{STYLES}</style>
                {selectedEvent && (() => {
                    const ev = selectedEvent;
                    const eventsForDay = getEventsForDay(ev.dayId);
                    const currentIdx = eventsForDay.findIndex(e => e.title === ev.title);
                    const isFirst = currentIdx <= 0;
                    const isLast = currentIdx >= eventsForDay.length - 1;
                    return (
                        <div
                            className={`${CLS}-modal-content`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'relative' }}
                        >
                            {/* Close button */}
                            <button
                                className={`${CLS}-modal-close`}
                                onClick={() => setSelectedEvent(null)}
                                aria-label="Close"
                            >✕</button>

                            {/* Prev arrow */}
                            {!isFirst && (
                                <button
                                    className={`${CLS}-modal-nav prev`}
                                    onClick={(e) => { e.stopPropagation(); navigateEvent(-1); }}
                                    aria-label="Previous event"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            )}

                            {/* Next arrow */}
                            {!isLast && (
                                <button
                                    className={`${CLS}-modal-nav next`}
                                    onClick={(e) => { e.stopPropagation(); navigateEvent(1); }}
                                    aria-label="Next event"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
                                </button>
                            )}

                            {/* Event counter */}
                            <span className={`${CLS}-modal-counter`}>
                                {currentIdx + 1} / {eventsForDay.length}
                            </span>

                            {/* Left: Poster image or gradient fallback */}
                            <div className={`${CLS}-modal-img-wrap`} style={{
                                borderColor: ACCENT_MED,
                                boxShadow: `0 0 20px ${ACCENT}33, 0 0 60px ${ACCENT}14, inset 0 0 30px ${ACCENT}0d`,
                                background: ev.imageUrl ? 'transparent' : `linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(2,6,23,0.95) 50%, rgba(56,189,248,0.05) 100%)`,
                            }}>
                                {ev.imageUrl ? (
                                    <img
                                        src={ev.imageUrl}
                                        alt={ev.title}
                                        className={`${CLS}-modal-img`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span className={`${CLS}-modal-img-title`}>{ev.title}</span>
                                )}
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
                                        <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                        </svg>
                                        <span className={`${CLS}-modal-row-label`}>Time:</span>
                                        <span className={`${CLS}-modal-row-value`}>{ev.time}</span>
                                    </div>

                                    {/* Venue */}
                                    <div className={`${CLS}-modal-row`}>
                                        <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                        <span className={`${CLS}-modal-row-label`}>Venue:</span>
                                        <span className={`${CLS}-modal-row-value`}>{ev.venue}</span>
                                    </div>

                                    {/* Society */}
                                    {ev.society && (
                                        <div className={`${CLS}-modal-row`}>
                                            <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                            <span className={`${CLS}-modal-row-label`}>Society:</span>
                                            <span className={`${CLS}-modal-row-value`}>{ev.society}</span>
                                        </div>
                                    )}

                                    {/* Coordinator */}
                                    {ev.coordinator && (
                                        <div className={`${CLS}-modal-row`}>
                                            <svg className={`${CLS}-modal-row-icon`} viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.5">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            <span className={`${CLS}-modal-row-label`}>Contact:</span>
                                            <span className={`${CLS}-modal-row-value`}>
                                                {ev.coordinator}
                                                {ev.coordinatorContact && ` · ${ev.coordinatorContact}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Society badge at bottom */}
                                {ev.society && (
                                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700,
                                            padding: '0.25rem 0.8rem',
                                            letterSpacing: '0.14em', textTransform: 'uppercase' as const,
                                            background: `${ACCENT}20`, color: ACCENT,
                                            border: `1px solid ${ACCENT}40`,
                                            clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
                                        }}>
                                            {ev.society}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}
            </div>

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
