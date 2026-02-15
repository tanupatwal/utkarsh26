
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation(containerRef: React.RefObject<HTMLDivElement | null>) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Pin the hero section
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=100%', // Pin for 1 viewport height
            pin: true,
            scrub: true,
            id: 'hero-pin',
        });

        // Timeline for scroll-driven animations
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: '+=100%',
                scrub: true,
            },
        });

        // 1. Initial Load Animation (controlled by separate timeline or here if desired, usually separate)
        // For now, let's focus on SCROLL exit behavior

        tl.to('.hero-content', {
            y: -100,
            opacity: 0,
            duration: 0.5,
            ease: 'power1.in',
        })
            .to('.hero-video', {
                scale: 1.1,
                filter: 'brightness(0.3) blur(5px)',
                duration: 1,
                ease: 'none',
            }, 0);

    }, { scope: containerRef });
}
