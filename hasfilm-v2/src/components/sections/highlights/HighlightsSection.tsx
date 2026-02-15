import React, { useRef, useMemo } from 'react';
import styles from './HighlightsSection.module.css';
import { useHighlightsAnimation } from './useHighlightsAnimation';
import { HIGHLIGHTS_CONTENT } from '@/data/highlights';

const HighlightsSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useHighlightsAnimation(containerRef);

    // Generate deterministic random positions based on index
    const images = useMemo(() => {
        return HIGHLIGHTS_CONTENT.map((item, i) => {
            // Pseudo-random generation
            const seed = i * 123.45;
            const x = Math.sin(seed) * 40 + 50; // 10% to 90% width
            const y = Math.cos(seed) * 40 + 50; // 10% to 90% height
            const speed = 0.5 + (Math.abs(Math.sin(seed * 2)) * 1.5); // 0.5 to 2.0 speed
            const depth = 0.2 + (Math.abs(Math.cos(seed * 3)) * 0.8); // 0.2 to 1.0 mouse depth
            const scale = 0.8 + (Math.abs(Math.sin(seed * 4)) * 0.4); // 0.8 to 1.2 scale

            return {
                ...item,
                x,
                y,
                speed,
                depth,
                scale,
                rotation: (Math.random() - 0.5) * 20
            };
        });
    }, []);

    return (
        <section ref={containerRef} className={styles.highlightsSection}>
            <div className={styles.titleWrapper}>
                <h2 className={styles.title}>Highlights</h2>
            </div>

            <div className={styles.gridContainer}>
                {images.map((img, i) => (
                    <div
                        key={i}
                        className={`${styles.imageWrapper} highlight-image`}
                        data-speed={img.speed}
                        data-depth={img.depth}
                        style={{
                            left: `${img.x}%`,
                            top: `${img.y}%`,
                            width: `${25 * img.scale}vw`,
                            height: `${35 * img.scale}vw`,
                            transform: `translate(-50%, -50%) rotate(${img.rotation}deg)`,
                            zIndex: Math.floor(img.speed * 10),
                        }}
                    >
                        <img
                            src={img.url}
                            alt={img.title}
                            className={styles.image}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HighlightsSection;
