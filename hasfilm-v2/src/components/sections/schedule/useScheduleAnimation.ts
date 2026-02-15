
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScheduleAnimation(containerRef: React.RefObject<HTMLDivElement | null>) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Animate header
        gsap.from('.schedule-header', {
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
        });

        // Stagger animate cards when they appear
        ScrollTrigger.batch('.schedule-card', {
            onEnter: (elements) => {
                gsap.from(elements, {
                    y: 60,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power2.out',
                    overwrite: true
                });
            },
            once: true
        });

    }, { scope: containerRef });
}
