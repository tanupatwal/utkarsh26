import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/stores/useScrollStore';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);
    const setScroll = useScrollStore((state) => state.setScroll);
    const setVelocity = useScrollStore((state) => state.setVelocity);
    const setDirection = useScrollStore((state) => state.setDirection);
    const setProgress = useScrollStore((state) => state.setProgress);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });
        lenisRef.current = lenis;

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Add Lenis to GSAP ticker
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable GSAP lag smoothing for better scroll sync
        gsap.ticker.lagSmoothing(0);

        // Update Zustand store on scroll
        lenis.on('scroll', ({ scroll, velocity, progress, direction }: any) => {
            setScroll(scroll);
            setVelocity(velocity);
            setProgress(progress);
            setDirection(direction === 1 ? 'down' : 'up');
        });

        return () => {
            lenis.destroy();
            gsap.ticker.remove((time) => {
                lenis.raf(time * 1000);
            });
        };
    }, [setScroll, setVelocity, setProgress, setDirection]);

    return lenisRef.current;
}
