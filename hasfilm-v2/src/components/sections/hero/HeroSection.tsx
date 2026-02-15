import React, { useRef } from 'react';
import styles from './HeroSection.module.css';
import { useHeroAnimation } from './useHeroAnimation';

const HeroSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize GSAP animations
    useHeroAnimation(containerRef);

    return (
        <section ref={containerRef} className={styles.hero}>
            {/* Video Background */}
            <div className={`${styles.videoContainer} hero-video`}>
                <video
                    className={styles.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/assets/hero-bg-4k-source.png"
                >
                    <source src="/assets/hero_video.mp4" type="video/mp4" />
                </video>
                <div className={styles.overlay} />
            </div>

            {/* Main Content */}
            <div className={`${styles.content} hero-content`}>
                <span className={styles.subtitle}>The Annual Cultural Festival</span>
                <h1 className={styles.title}>Utkarsh<br />2026</h1>
            </div>

            {/* Scroll Indicator */}
            <div className={`${styles.scrollIndicator} hero-scroll`}>
                <span className={styles.scrollText}>Scroll to Explore</span>
                <svg
                    className={styles.chevron}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M7 13l5 5 5-5" />
                    <path d="M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
