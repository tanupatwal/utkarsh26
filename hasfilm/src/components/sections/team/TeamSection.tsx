import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { TEAM_MEMBERS, TEAM_BG_IMAGES } from '../../../data/team';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

/** Scroll range where the team section fades in */
const TEAM_FADE_START = 0.98;
const TEAM_FADE_FULL = 0.99;

/** How much of the remaining scroll (0.99→1.0) drives the name focus */
const FOCUS_SCROLL_START = 0.99;
const FOCUS_SCROLL_END = 1.0;

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
  width: 22vw;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.${CLS}-drift-col img {
  width: 100%;
  height: auto;
  object-fit: cover;
  opacity: 0.12;
  filter: brightness(0.5) saturate(0.4) blur(1px);
  border-radius: 4px;
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

/* ─── Left: Names column ─── */
.${CLS}-left {
  flex: 0 0 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: clamp(3rem, 8vw, 8rem);
  position: relative;
}

.${CLS}-label {
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
  opacity: 0.7;
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

/* ─── Name item ─── */
.${CLS}-name {
  cursor: pointer;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.15;
  white-space: nowrap;
  transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: left center;
  padding: 0.15em 0;
  user-select: none;
}
.${CLS}-name.inactive {
  font-size: clamp(1.2rem, 2.2vw, 2rem);
  color: #444;
  transform: scale(1);
}
.${CLS}-name.active {
  font-size: clamp(1.8rem, 3.5vw, 3.2rem);
  color: #fff;
  transform: scale(1.05);
  text-shadow: 0 0 30px rgba(255,255,255,0.15);
}

/* Scroll indicator line on left edge */
.${CLS}-scroll-track {
  position: absolute;
  left: clamp(1.5rem, 4vw, 4rem);
  top: 15%;
  bottom: 15%;
  width: 2px;
  background: rgba(255,255,255,0.06);
  z-index: 5;
}
.${CLS}-scroll-thumb {
  position: absolute;
  left: 0; top: 0;
  width: 2px;
  height: 20px;
  background: #fff;
  border-radius: 1px;
  transition: top 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 0 8px rgba(255,255,255,0.3);
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

.${CLS}-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(0.85) contrast(1.1);
  transition: opacity 0.25s ease;
}

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
  transition: opacity 0.25s ease;
}
.${CLS}-role::before {
  content: '▸';
  font-size: 0.7em;
  color: rgba(255,255,255,0.4);
}

/* ─── Bottom bar (accent) ─── */
.${CLS}-bottom {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 20;
}
.${CLS}-logo {
  font-weight: 800;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: -0.02em;
}
.${CLS}-visit-btn {
  padding: 0.5rem 1.2rem;
  background: rgba(76, 140, 90, 0.85);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}
.${CLS}-visit-btn:hover {
  background: rgba(76, 140, 90, 1);
}

/* Visible names window — show ~7 names centered around active */
.${CLS}-names-window {
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}
`;

// ════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════

/** How many names are visible above/below the active one */
const VISIBLE_RADIUS = 3;

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const TeamSection: React.FC = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const totalMembers = TEAM_MEMBERS.length;

  // Effective active index (hover overrides scroll)
  const effectiveIndex = hoverIndex !== null ? hoverIndex : activeIndex;

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

  // Precompute drift columns (duplicate images for seamless loop)
  const driftColumns = useMemo(() => {
    const half = Math.ceil(TEAM_BG_IMAGES.length / 2);
    const col1 = TEAM_BG_IMAGES.slice(0, half);
    const col2 = TEAM_BG_IMAGES.slice(half);
    return [
      { images: [...col1, ...col1], left: '2%', duration: 45, direction: 'up' as const },
      { images: [...col2, ...col2], right: '3%', duration: 55, direction: 'down' as const },
    ];
  }, []);

  // ── Scroll-driven logic ──
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

    // Scroll-driven focus: map scroll within the focus range to member index
    if (hoverIndex === null && r >= FOCUS_SCROLL_START) {
      const focusT = Math.min(1, (r - FOCUS_SCROLL_START) / (FOCUS_SCROLL_END - FOCUS_SCROLL_START));
      const newIdx = Math.min(totalMembers - 1, Math.floor(focusT * totalMembers));
      if (newIdx !== activeIndex) setActiveIndex(newIdx);
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

  // Compute scroll track thumb position
  const thumbTop = `${(effectiveIndex / (totalMembers - 1)) * 100}%`;

  // Determine which names to show (window of ~7 around active)
  const windowStart = Math.max(0, effectiveIndex - VISIBLE_RADIUS);
  const windowEnd = Math.min(totalMembers - 1, effectiveIndex + VISIBLE_RADIUS);
  const visibleMembers = TEAM_MEMBERS.slice(windowStart, windowEnd + 1);

  const currentMember = TEAM_MEMBERS[effectiveIndex];

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

      {/* ── Drifting background photos ── */}
      <div className={`${CLS}-drift-wrap`}>
        {driftColumns.map((col, ci) => (
          <div
            key={ci}
            className={`${CLS}-drift-col`}
            style={{
              ...(col.left ? { left: col.left } : {}),
              ...(col.right ? { right: col.right } : {}),
              ...(col.left ? {} : { left: 'auto' }),
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
        {/* Left: Names */}
        <div className={`${CLS}-left`}>
          {/* "Our Team" label */}
          <div className={`${CLS}-label`}>
            <em>Our</em> <strong>Team</strong>
          </div>

          {/* Scroll track */}
          <div className={`${CLS}-scroll-track`}>
            <div
              className={`${CLS}-scroll-thumb`}
              style={{ top: thumbTop }}
            />
          </div>

          {/* Names window */}
          <div className={`${CLS}-names-window`}>
            {/* Show fade-out indicator above if there are hidden names */}
            {windowStart > 0 && (
              <div style={{
                fontSize: '0.7rem',
                color: '#333',
                letterSpacing: '0.2em',
                marginBottom: '0.3rem',
                opacity: 0.5,
              }}>
                ↑ {windowStart} more
              </div>
            )}

            {visibleMembers.map((member, vi) => {
              const realIdx = windowStart + vi;
              const isActive = realIdx === effectiveIndex;
              return (
                <div
                  key={realIdx}
                  className={`${CLS}-name ${isActive ? 'active' : 'inactive'}`}
                  onMouseEnter={() => handleNameEnter(realIdx)}
                  onMouseLeave={handleNameLeave}
                >
                  {member.name}
                </div>
              );
            })}

            {/* Show fade-out indicator below if there are hidden names */}
            {windowEnd < totalMembers - 1 && (
              <div style={{
                fontSize: '0.7rem',
                color: '#333',
                letterSpacing: '0.2em',
                marginTop: '0.3rem',
                opacity: 0.5,
              }}>
                ↓ {totalMembers - 1 - windowEnd} more
              </div>
            )}
          </div>
        </div>

        {/* Right: Image */}
        <div className={`${CLS}-right`}>
          <div ref={imgFrameRef} className={`${CLS}-img-frame`}>
            {/* Stack all images, only active one is visible */}
            {TEAM_MEMBERS.map((member, i) => (
              <img
                key={i}
                className={`${CLS}-img`}
                src={member.image}
                alt={member.name}
                loading="lazy"
                style={{ opacity: i === effectiveIndex ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Role label */}
          <div className={`${CLS}-role`} key={effectiveIndex}>
            {currentMember?.role}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`${CLS}-bottom`}>
        <span className={`${CLS}-logo`}>w.</span>
        <button className={`${CLS}-visit-btn`}>Visit Resource</button>
      </div>
    </div>
  );
};

export default TeamSection;
