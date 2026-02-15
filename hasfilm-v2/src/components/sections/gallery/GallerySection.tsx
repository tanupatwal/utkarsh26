import React, { useRef } from 'react';
import styles from './GallerySection.module.css';
import { useGalleryAnimation } from './useGalleryAnimation';

const GallerySection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGalleryAnimation(containerRef);

    return (
        <section ref={containerRef} className={styles.gallerySection}>
            <div className={styles.galleryHud}>
                <header className={styles.header}>
                    <h2 className={`${styles.title} gallery-title`}>Gallery</h2>
                </header>

                <footer className={styles.footer}>
                    <span>Utkarsh 2026</span>
                    <span className={styles.progress}>Scroll to Rotate</span>
                </footer>
            </div>
        </section>
    );
};

export default GallerySection;
