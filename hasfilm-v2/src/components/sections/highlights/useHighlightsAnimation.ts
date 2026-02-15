
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useHighlightsAnimation(containerRef: React.RefObject<HTMLDivElement | null>) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Pin the highlighted section
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=200%', // 2x height scroll duration
            pin: true,
            scrub: 1,
        });

        // Parallax Effect for images
        // Uses data-speed attribute to vary speed
        const images = container.querySelectorAll('.highlight-image');
        images.forEach((img) => {
            const speed = parseFloat(img.getAttribute('data-speed') || '1');
            const yOffset = -200 * speed; // Move up based on speed

            gsap.to(img, {
                y: yOffset,
                ease: 'none',
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 1,
                }
            });
        });

    }, { scope: containerRef });
}
