
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useAboutAnimation(containerRef: React.RefObject<HTMLDivElement | null>) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Pin the section
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: true,
            id: 'about-pin',
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top top', // Start animating immediately when pinned
                end: '+=80%',     // Finish before unpinning
                scrub: 1,
            },
        });

        // Staggered Reveals
        tl.from('.about-badge', { y: 20, opacity: 0, duration: 0.5 })
            .from('.about-title', { y: 30, opacity: 0, duration: 0.5 }, '-=0.3')
            .from('.about-p', { y: 20, opacity: 0, stagger: 0.2, duration: 0.5 }, '-=0.2')
            .from('.stat-bar', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2');

        // Exit Transition (Slide Left)
        gsap.to(container, {
            xPercent: -20,
            opacity: 0,
            scrollTrigger: {
                trigger: container,
                start: 'bottom bottom', // When pin ends
                end: 'bottom top',
                scrub: true,
            }
        });

    }, { scope: containerRef });
}
