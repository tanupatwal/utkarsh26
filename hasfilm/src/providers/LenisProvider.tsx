/**
 * LenisProvider — Initializes Lenis smooth scroll and syncs with GSAP ScrollTrigger.
 *
 * Responsibilities:
 *   1. Creates and manages a Lenis instance for buttery-smooth scrolling
 *   2. Advances Lenis exclusively from GSAP's ticker (single rAF source)
 *   3. Updates the shared `scrollProgress` ref (0→1 normalized)
 *   4. Optionally slows scroll speed inside the gallery section
 *   5. Exports `getLenis()` so components (e.g. Team trap) can call
 *      `lenis.stop()`, `lenis.start()`, `lenis.scrollTo()`.
 */
import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollProgress } from '../hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);

// ── Singleton Lenis reference ──────────────────
// Accessible from any module via `getLenis()`.
let _lenis: Lenis | null = null;

/**
 * Returns the active Lenis instance, or null if not yet mounted.
 * Use for `lenis.stop()`, `lenis.start()`, `lenis.scrollTo()`.
 */
export function getLenis(): Lenis | null {
    return _lenis;
}

// ── Provider Component ─────────────────────────

interface LenisProviderProps {
    children: React.ReactNode;
}

const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;
        _lenis = lenis;

        // Sync GSAP ScrollTrigger on every Lenis scroll event
        lenis.on('scroll', ScrollTrigger.update);

        // Update shared scroll progress on every scroll event
        lenis.on('scroll', () => {
            const el = lenis.rootElement as HTMLElement;
            const maxScroll = el.scrollHeight - el.clientHeight;
            scrollProgress.current = maxScroll > 0 ? lenis.scroll / maxScroll : 0;
        });

        // Single rAF source: advance Lenis from GSAP's ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Lenis expects ms, GSAP ticker gives seconds
        });

        // Disable GSAP's built-in lag smoothing to prevent stutters
        gsap.ticker.lagSmoothing(0);

        // Gallery velocity dampening — slow scroll in gallery section
        ScrollTrigger.create({
            trigger: '.gallery-trigger',
            start: 'top top',
            end: 'bottom bottom',
            onEnter: () => {
                if (lenisRef.current) {
                    lenisRef.current.options.duration = 2.5;
                }
            },
            onLeave: () => {
                if (lenisRef.current) {
                    lenisRef.current.options.duration = 1.2;
                }
            },
            onEnterBack: () => {
                if (lenisRef.current) {
                    lenisRef.current.options.duration = 2.5;
                }
            },
            onLeaveBack: () => {
                if (lenisRef.current) {
                    lenisRef.current.options.duration = 1.2;
                }
            },
        });

        return () => {
            _lenis = null;
            lenis.destroy();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return <>{children}</>;
};

export default LenisProvider;
