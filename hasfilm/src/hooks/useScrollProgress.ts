/**
 * useScrollProgress — Shared, normalized scroll progress (0 → 1).
 *
 * Replaces drei's `useScroll().offset`. Updated by LenisProvider on every
 * scroll tick. Readable from both React components and R3F `useFrame` loops.
 *
 * Usage:
 *   import { scrollProgress } from '../hooks/useScrollProgress';
 *   // In useFrame:
 *   const r = scrollProgress.current;  // 0-1
 */

/** Mutable ref — updated by LenisProvider, read everywhere */
export const scrollProgress = { current: 0 };

/**
 * Convenience hook for React components that need to subscribe to
 * scroll progress reactively (re-render on change). Most 3D code
 * should read `scrollProgress.current` directly in `useFrame` instead.
 */
export function getScrollProgress(): number {
    return scrollProgress.current;
}
