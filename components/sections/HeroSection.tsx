'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import { ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroContainer}>
      <div className={styles.contentWrapper}>
        {/* The Central Element */}
        <div className={styles.visualCore}>
          <Image 
            src="/assets/evolution-bg.png" 
            alt="Evolution Core" 
            width={800}
            height={800}
            className={styles.rotatingElement} 
            priority
          />
          <div className={styles.glowOverlay}></div>
        </div>

        {/* Text Content */}
        <div className={styles.textContent}>
          <h1 className={styles.mainHeading}>UTKARSH 2026</h1>
          <h2 className={styles.subtitle}>Evolution Through Heritage</h2>
          <p className={styles.tagline}>
             <span className="text-[#FF8C1A]">VIRASAT SE</span> 
             <span className="mx-2 opacity-50">|</span> 
             <span className="text-[#00F5FF]">VIKAS TAK</span>
          </p>
          
          <div className={styles.ctaGroup}>
            <button className={`${styles.btn} ${styles.btnHeritage}`}>
              Explore Heritage
            </button>
            <button className={`${styles.btn} ${styles.btnTech}`}>
              Discover Innovation
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <ChevronDown size={24} />
      </div>
    </section>
  );
};