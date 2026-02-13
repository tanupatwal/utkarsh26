import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { TEAM_MEMBERS, TEAM_BG_IMAGES } from '../../../data/team';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

/** Scroll range where the team section fades in — starts AFTER schedule fades out (0.975) */
const TEAM_FADE_START = 0.975;
const TEAM_FADE_FULL = 0.985;

/** Member cycling scroll range — 1.5% of 40 pages with damped kinetics */
const FOCUS_SCROLL_START = 0.985;
const FOCUS_SCROLL_END = 1.0;

/** Low damping = very smooth, gradual glide between names */
const INDEX_DAMP = 1.5;

const CLS = 'tm';

// ════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════

const STYLES = `
/* ─── Root container ─── */
.${CLS}-root {
  position: fixed; inset: 0;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  color: #fff;
  z-index: 26;
}

/* ─── Film grain overlay ─── */
.${CLS}-grain {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 100;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px 128px;
}

/* ─── Geometric background lines ─── */
.${CLS}-geo {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 1;
  opacity: 0.07;
  transition: transform 0.3s ease-out;
}
.${CLS}-geo svg { width: 100%; height: 100%; }

/* ─── Drifting background images ─── */
.${CLS}-drift-wrap {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 2;
  overflow: hidden;
}
.${CLS}-drift-col {
  position: absolute;
  width: 20vw;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.${CLS}-drift-col img {
  width: 100%;
  height: auto;
  object-fit: cover;
  opacity: 0.16;
  filter: brightness(0.55) saturate(0.45) blur(0.5px);
  border-radius: 4px;
  transition: opacity 0.6s ease;
}

@keyframes ${CLS}DriftUp {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes ${CLS}DriftDown {
  0%   { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

/* ─── Main layout ─── */
.${CLS}-layout {
  position: relative; z-index: 10;
  display: flex;
  width: 100%; height: 100%;
  align-items: center;
}

/* ─── Left: Names column — CENTERED ─── */
.${CLS}-left {
  flex: 0 0 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* "Our Team" label */
.${CLS}-label {
  font-size: clamp(0.85rem, 1.1vw, 1.05rem);
  margin-bottom: 2rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.5;
  text-align: center;
}
.${CLS}-label em {
  font-style: italic;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-weight: 400;
  margin-right: 0.3em;
}
.${CLS}-label strong {
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
}

/* ─── Names window container ─── */
.${CLS}-names-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 1rem 0;
}

/* Top/bottom fade masks */
.${CLS}-names-window::before,
.${CLS}-names-window::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 3rem;
  pointer-events: none;
  z-index: 5;
}
.${CLS}-names-window::before {
  top: 0;
  background: linear-gradient(to bottom, #000 0%, transparent 100%);
}
.${CLS}-names-window::after {
  bottom: 0;
  background: linear-gradient(to top, #000 0%, transparent 100%);
}

/* ─── Name item ─── */
.${CLS}-name {
  cursor: pointer;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.15;
  white-space: nowrap;
  text-align: center;
  transition:
    color 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    font-size 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    text-shadow 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.5s ease;
  transform-origin: center center;
  padding: 0.25em 0;
  user-select: none;
  will-change: transform, color, font-size;
}
.${CLS}-name.inactive {
  font-size: clamp(1.1rem, 2vw, 1.8rem);
  color: #444;
  transform: scale(1) translateY(0);
}
.${CLS}-name.active {
  font-size: clamp(1.8rem, 3.5vw, 3.2rem);
  color: #fff;
  transform: scale(1.08) translateY(0);
  text-shadow:
    0 0 40px rgba(255,255,255,0.25),
    0 0 80px rgba(255,255,255,0.1);
}
/* Distance-based dimming for names further from active */
.${CLS}-name.dist-1 { color: #555; opacity: 0.85; }
.${CLS}-name.dist-2 { color: #3a3a3a; opacity: 0.6; }
.${CLS}-name.dist-3 { color: #2a2a2a; opacity: 0.35; }
.${CLS}-name.dist-4 { color: #1a1a1a; opacity: 0.18; }

/* ─── Page counter ─── */
.${CLS}-counter {
  margin-top: 2rem;
  font-size: clamp(0.7rem, 0.85vw, 0.85rem);
  font-weight: 300;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.3);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.${CLS}-counter .current {
  color: rgba(255,255,255,0.8);
  font-weight: 600;
}

/* ─── Right: Image display ─── */
.${CLS}-right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.${CLS}-img-frame {
  position: relative;
  width: clamp(240px, 22vw, 340px);
  height: clamp(300px, 28vw, 420px);
  overflow: hidden;
  background: #111;
}

/* ─── Image transition: clip-path wipe + scale reveal ─── */
.${CLS}-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(0.85) contrast(1.1);
  opacity: 0;
  transform: scale(1.12);
  clip-path: inset(100% 0 0 0);
  transition:
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.6s ease;
  will-change: opacity, transform, clip-path;
}
.${CLS}-img.img-active {
  opacity: 1;
  transform: scale(1);
  clip-path: inset(0 0 0 0);
  z-index: 2;
}
.${CLS}-img.img-prev {
  opacity: 0.4;
  transform: scale(1.04);
  clip-path: inset(0 0 0 0);
  filter: grayscale(1) contrast(0.8) blur(2px);
  z-index: 1;
}

/* ─── Role label with slide-fade ─── */
.${CLS}-role {
  margin-top: 1rem;
  font-size: clamp(0.75rem, 0.9vw, 0.9rem);
  font-weight: 400;
  letter-spacing: 0.18em;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5em;
  animation: ${CLS}RoleFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.${CLS}-role::before {
  content: '▸';
  font-size: 0.7em;
  color: rgba(255,255,255,0.4);
}

@keyframes ${CLS}RoleFade {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

`;

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════

/** How many names are visible above/below the active one */
const VISIBLE_RADIUS = 4;

/** Get distance-based CSS class for inactive names */
function distClass(dist: number): string {
  if (dist <= 1) return `dist-1`;
  if (dist === 2) return `dist-2`;
  if (dist === 3) return `dist-3`;
  return `dist-4`;
}

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const TeamSection: React.FC = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Smooth (damped) floating-point index for kinetic feel
  const smoothIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevActiveIndex, setPrevActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prevEffectiveRef = useRef(0);

  const totalMembers = TEAM_MEMBERS.length;

  // Effective active index (hover overrides scroll)
  const effectiveIndex = hoverIndex !== null ? hoverIndex : activeIndex;

  // Track previous effective index for exit animation
  useEffect(() => {
    if (effectiveIndex !== prevEffectiveRef.current) {
      setPrevActiveIndex(prevEffectiveRef.current);
      prevEffectiveRef.current = effectiveIndex;
    }
  }, [effectiveIndex]);

  // Track mouse for parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Parallax applied via refs for perf
  const geoRef = useRef<HTMLDivElement>(null);
  const imgFrameRef = useRef<HTMLDivElement>(null);

  const handleNameEnter = useCallback((idx: number) => {
    setHoverIndex(idx);
  }, []);

  const handleNameLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  // Precompute drift columns — 3 columns, faster speeds
  const driftColumns = useMemo(() => {
    const third = Math.ceil(TEAM_BG_IMAGES.length / 3);
    const col1 = TEAM_BG_IMAGES.slice(0, third);
    const col2 = TEAM_BG_IMAGES.slice(third, third * 2);
    const col3 = TEAM_BG_IMAGES.slice(third * 2);
    return [
      { images: [...col1, ...col1], left: '1%', duration: 18, direction: 'up' as const },
      { images: [...col2, ...col2], left: '38%', duration: 14, direction: 'down' as const },
      { images: [...col3, ...col3], right: '2%', duration: 22, direction: 'up' as const },
    ];
  }, []);

  // ── Scroll-driven logic with damped kinetics ──
  useFrame((_state, delta) => {
    if (!containerRef.current) return;
    const r = scroll.offset;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

    // Opacity fade-in
    let revealT = 0;
    if (r >= TEAM_FADE_START && r < TEAM_FADE_FULL) {
      revealT = (r - TEAM_FADE_START) / (TEAM_FADE_FULL - TEAM_FADE_START);
    } else if (r >= TEAM_FADE_FULL) {
      revealT = 1;
    }

    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, revealT, 4, delta);
    containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;
    containerRef.current.style.opacity = String(opacityRef.current.toFixed(3));
    containerRef.current.style.pointerEvents = opacityRef.current > 0.1 ? 'auto' : 'none';

    // Visibility state
    if (opacityRef.current > 0.3 && !isVisible) setIsVisible(true);
    if (opacityRef.current < 0.1 && isVisible) setIsVisible(false);

    // Scroll-driven focus with DAMPED index (kinetic feel)
    if (hoverIndex === null && r >= FOCUS_SCROLL_START) {
      const focusT = Math.min(1, (r - FOCUS_SCROLL_START) / (FOCUS_SCROLL_END - FOCUS_SCROLL_START));
      const rawTargetIndex = focusT * (totalMembers - 1);

      // Damp the smooth index toward the raw target — this is the kinetics magic
      smoothIndexRef.current = THREE.MathUtils.damp(
        smoothIndexRef.current,
        rawTargetIndex,
        INDEX_DAMP,
        delta
      );

      const newIdx = Math.round(
        Math.min(totalMembers - 1, Math.max(0, smoothIndexRef.current))
      );
      if (newIdx !== activeIndex) setActiveIndex(newIdx);
    } else if (hoverIndex === null) {
      // Scrolled back out — reset to first member so re-entry starts clean
      smoothIndexRef.current = THREE.MathUtils.damp(smoothIndexRef.current, 0, INDEX_DAMP, delta);
      if (activeIndex !== 0 && smoothIndexRef.current < 0.5) setActiveIndex(0);
    }

    // Apply parallax
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (geoRef.current) {
      geoRef.current.style.transform = `translate(${mx * 8}px, ${my * 8}px)`;
    }
    if (imgFrameRef.current) {
      imgFrameRef.current.style.transform = `translate(${mx * 6}px, ${my * 6}px)`;
    }
  });

  // Determine which names to show (window of ~7 around active)
  const windowStart = Math.max(0, effectiveIndex - VISIBLE_RADIUS);
  const windowEnd = Math.min(totalMembers - 1, effectiveIndex + VISIBLE_RADIUS);
  const visibleMembers = TEAM_MEMBERS.slice(windowStart, windowEnd + 1);

  const currentMember = TEAM_MEMBERS[effectiveIndex];

  // Format counter: "03 / 24"
  const counterCurrent = String(effectiveIndex + 1).padStart(2, '0');
  const counterTotal = String(totalMembers).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      className={`${CLS}-root`}
      style={{ opacity: 0 }}
    >
      <style>{STYLES}</style>

      {/* ── Film grain ── */}
      <div className={`${CLS}-grain`} />

      {/* ── Geometric background ── */}
      <div ref={geoRef} className={`${CLS}-geo`}>
        <svg viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large circle strokes */}
          <circle cx="600" cy="400" r="280" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <circle cx="600" cy="400" r="350" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <circle cx="200" cy="600" r="200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <circle cx="1000" cy="200" r="180" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          {/* Grid lines */}
          <line x1="0" y1="400" x2="1200" y2="400" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="600" y1="0" x2="600" y2="800" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <line x1="300" y1="0" x2="300" y2="800" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1="900" y1="0" x2="900" y2="800" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Drifting background photos — 3 faster columns ── */}
      <div className={`${CLS}-drift-wrap`}>
        {driftColumns.map((col, ci) => (
          <div
            key={ci}
            className={`${CLS}-drift-col`}
            style={{
              ...(col.left ? { left: col.left } : {}),
              ...('right' in col && col.right ? { right: col.right } : {}),
              ...(!col.left && !('right' in col && col.right) ? {} : col.left ? {} : { left: 'auto' }),
              animationName: col.direction === 'up' ? `${CLS}DriftUp` : `${CLS}DriftDown`,
              animationDuration: `${col.duration}s`,
            }}
          >
            {col.images.map((src, i) => (
              <img key={`${ci}-${i}`} src={src} alt="" loading="lazy" />
            ))}
          </div>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className={`${CLS}-layout`}>
        {/* Left: Names — CENTERED in left half */}
        <div className={`${CLS}-left`}>
          {/* "Our Team" label */}
          <div className={`${CLS}-label`}>
            <em>Our</em> <strong>Team</strong>
          </div>

          {/* Names window with fade masks */}
          <div className={`${CLS}-names-window`}>
            {visibleMembers.map((member, vi) => {
              const realIdx = windowStart + vi;
              const isActive = realIdx === effectiveIndex;
              const distance = Math.abs(realIdx - effectiveIndex);
              return (
                <div
                  key={realIdx}
                  className={`${CLS}-name ${isActive ? 'active' : `inactive ${distClass(distance)}`}`}
                  onMouseEnter={() => handleNameEnter(realIdx)}
                  onMouseLeave={handleNameLeave}
                >
                  {member.name}
                </div>
              );
            })}
          </div>

          {/* Page counter */}
          <div className={`${CLS}-counter`}>
            <span className="current">{counterCurrent}</span>
            {' / '}
            {counterTotal}
          </div>
        </div>

        {/* Right: Image */}
        <div className={`${CLS}-right`}>
          <div ref={imgFrameRef} className={`${CLS}-img-frame`}>
            {/* Stack all images — active gets wipe-in, previous gets blur-out */}
            {TEAM_MEMBERS.map((member, i) => {
              const isActive = i === effectiveIndex;
              const isPrev = i === prevActiveIndex && i !== effectiveIndex;
              return (
                <img
                  key={i}
                  className={`${CLS}-img${isActive ? ' img-active' : ''}${isPrev ? ' img-prev' : ''}`}
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                />
              );
            })}
          </div>

          {/* Role label */}
          <div className={`${CLS}-role`} key={effectiveIndex}>
            {currentMember?.role}
          </div>
        </div>
      </div>


    </div>
  );
};

export default TeamSection;
