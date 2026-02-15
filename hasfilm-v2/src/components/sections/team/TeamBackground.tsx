import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TEAM_BG_IMAGES } from '@/data/team';
import styles from './TeamSection.module.css';

const TeamBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const images = container.querySelectorAll('.bg-image');

        // Animate each background image with different speeds/directions
        images.forEach((img: Element, i: number) => {
            gsap.to(img, {
                y: (i % 2 === 0 ? '-20%' : '20%'),
                scrollTrigger: {
                    trigger: container.parentElement, // Trigger by the parent TeamSection
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
                ease: 'none'
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={styles.bgContainer}>
            <div className={styles.overlay} />
            {TEAM_BG_IMAGES.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt=""
                    className={`${styles.bgImage} bg-image`}
                    style={{
                        top: `${Math.random() * 80}%`,
                        left: `${Math.random() * 80}%`,
                        width: `${30 + Math.random() * 20}%`, // Random width 30-50%
                        opacity: 0.15,
                        transform: `rotate(${Math.random() * 30 - 15}deg)`
                    }}
                    loading="lazy"
                />
            ))}
        </div>
    );
};

export default TeamBackground;
