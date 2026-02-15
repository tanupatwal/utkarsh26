import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatBarProps {
    stats: { label: string; value: number; suffix?: string }[];
}

export function useStatAnimation(containerRef: React.RefObject<HTMLDivElement | null>, stats: any) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const statItems = container.querySelectorAll('.stat-item');

        // Animate stats when they scroll into view
        ScrollTrigger.create({
            trigger: container,
            start: 'top 80%',
            onEnter: () => {
                statItems.forEach((item, index) => {
                    const valueElement = item.querySelector('.stat-value');
                    if (!valueElement) return;

                    const targetValue = stats[index].value;

                    gsap.fromTo(valueElement,
                        { innerText: 0 },
                        {
                            innerText: targetValue,
                            duration: 2,
                            ease: 'power2.out',
                            snap: { innerText: 1 },
                            stagger: 0.2, // Stagger relative to other items if desired, though here we loop
                        }
                    );
                });
            }
        });

    }, { scope: containerRef, dependencies: [stats] });
}
