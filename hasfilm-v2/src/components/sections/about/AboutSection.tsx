import React, { useRef } from 'react';
import styles from './AboutSection.module.css';
import { useAboutAnimation } from './useAboutAnimation';
import StatBar from './StatBar';

const STATS = [
    { label: 'Established', value: 2006 },
    { label: 'Attendees', value: 15000 },
    { label: 'Days', value: 3 },
    { label: 'Events', value: 40 },
];

const PARAGRAPHS = [
    "Utkarsh is not just a festival; it's a legacy. For over two decades, we have been the heartbeat of Northern India's collegiate cultural scene, bringing together the brightest minds and the most creative souls.",
    "From electrifying performances to intellectual battles, every moment is crafted to inspire. We bridge the gap between tradition and innovation, creating a platform where heritage meets the future.",
    "Join us as we write the next chapter. Experience the energy, the passion, and the spirit of Utkarsh 2026."
];

const AboutSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useAboutAnimation(containerRef);

    return (
        <section ref={containerRef} className={styles.about}>
            <div className={styles.glow} />

            <div className={styles.contentWrapper}>
                <div className={`${styles.badge} about-badge`}>The Most Awaited Fest</div>

                <h2 className={`${styles.title} about-title`}>
                    Defining Excellence<br />Since 2006
                </h2>

                <div className={styles.description}>
                    {PARAGRAPHS.map((text, i) => (
                        <p key={i} className={`${styles.paragraph} about-p`}>
                            {text}
                        </p>
                    ))}
                </div>

                <div className="stat-bar">
                    <StatBar stats={STATS} />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
