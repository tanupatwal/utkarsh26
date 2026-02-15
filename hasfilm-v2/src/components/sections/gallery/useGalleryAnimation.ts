import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGalleryAnimation(containerRef: React.RefObject<HTMLDivElement | null>) {

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Pin the entire gallery section
        // This allows the 3D cylinder to spin while the user "scrolls" through the gallery
        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: '+=400%', // 4x viewport height for long scroll interaction
            pin: true,
            scrub: 1,
        });

        // Animate HUD elements
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: '+=100%', // Animate in/out during the first phase
                scrub: true,
            }
        });

        // Initial fade in
        tl.from('.gallery-title', { opacity: 0, y: 50, duration: 0.5 });

    }, { scope: containerRef });
}
