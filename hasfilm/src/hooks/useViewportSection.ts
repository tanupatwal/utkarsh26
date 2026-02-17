/**
 * useViewportSection — "Frustum culling" for DOM sections.
 *
 * Replaces R3F's `useScroll` + `useFrame` for pure-DOM sections that live
 * outside the Canvas.  Combines react-intersection-observer for mount/unmount
 * with a manual `requestAnimationFrame` loop that only ticks while the
 * section is in the viewport.
 *
 * Usage:
 *   const { sectionRef, isInView, useAnimationFrame } = useViewportSection({
 *     rootMargin: '150px',   // preload 150px before visible
 *   });
 *
 *   // Like useFrame — only fires when section is visible
 *   useAnimationFrame((delta) => {
 *     // animate DOM elements based on delta (seconds)
 *   });
 *
 *   return <section ref={sectionRef}>…</section>
 */
import { useRef, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export interface ViewportSectionOptions {
    /** IntersectionObserver rootMargin — preload distance, e.g. '150px' */
    rootMargin?: string;
    /** IntersectionObserver threshold (0–1) */
    threshold?: number;
}

type FrameCallback = (delta: number) => void;

export function useViewportSection(options: ViewportSectionOptions = {}) {
    const { rootMargin = '150px', threshold = 0 } = options;

    // IntersectionObserver from react-intersection-observer
    const { ref: inViewRef, inView } = useInView({
        rootMargin,
        threshold,
        triggerOnce: false,
    });

    // ── rAF loop that only ticks when `inView` is true ──
    const callbacksRef = useRef<FrameCallback[]>([]);
    const lastTimeRef = useRef(0);
    const rafIdRef = useRef<number>(0);

    // Stable registration function (like R3F's useFrame)
    const useAnimationFrame = useCallback((cb: FrameCallback) => {
        // Register on mount, unregister on unmount
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            callbacksRef.current.push(cb);
            return () => {
                callbacksRef.current = callbacksRef.current.filter(fn => fn !== cb);
            };
            // cb should be a stable ref (useCallback) — intentional dep
        }, [cb]);
    }, []);

    // Start / stop the rAF loop based on visibility
    useEffect(() => {
        if (!inView) {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = 0;
            }
            lastTimeRef.current = 0;
            return;
        }

        const tick = (time: number) => {
            // First tick after becoming visible — skip delta spike
            if (lastTimeRef.current === 0) {
                lastTimeRef.current = time;
                rafIdRef.current = requestAnimationFrame(tick);
                return;
            }
            const deltaMs = Math.min(time - lastTimeRef.current, 50); // cap at 50ms
            const deltaSec = deltaMs / 1000;
            lastTimeRef.current = time;

            for (const cb of callbacksRef.current) {
                cb(deltaSec);
            }

            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = 0;
            }
        };
    }, [inView]);

    return {
        /** Attach to the section's root DOM element */
        sectionRef: inViewRef,
        /** Whether the section is currently in the viewport */
        isInView: inView,
        /** Register a frame callback (like R3F useFrame, but only when visible) */
        useAnimationFrame,
    };
}
