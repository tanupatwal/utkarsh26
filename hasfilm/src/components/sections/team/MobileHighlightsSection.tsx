import React, { useState, useCallback } from 'react';
import { useHighlights } from '../../../hooks/useSupabaseData';
import './MobileHighlightsSection.css';

/**
 * MobileHighlightsSection — Event highlights gallery for mobile (< 768px).
 *
 * Layout:
 *   1. Header with title + tagline
 *   2. Hero card (cycles through highlights via arrow button)
 *   3. Masonry 2-col grid with offset
 *   4. Archive CTA card
 *
 * No GSAP/ScrollTrigger — pure CSS transitions + React state.
 */
const MobileHighlightsSection: React.FC = () => {
    // ── Supabase data hook (lazy-loads on viewport approach) ──
    const { highlights: HIGHLIGHTS_CONTENT } = useHighlights();

    const [activeCard, setActiveCard] = useState<number | null>(null);
    const [heroIndex, setHeroIndex] = useState(0);
    const [heroTransitioning, setHeroTransitioning] = useState(false);

    const handleCardTap = useCallback((idx: number) => {
        setActiveCard((prev) => (prev === idx ? null : idx));
    }, []);

    const handleHeroNext = useCallback(() => {
        if (heroTransitioning) return;
        setHeroTransitioning(true);
        // After fade-out completes, switch image and fade back in
        setTimeout(() => {
            setHeroIndex((prev) => (prev + 1) % HIGHLIGHTS_CONTENT.length);
            setHeroTransitioning(false);
        }, 350);
    }, [heroTransitioning]);

    // Current hero highlight
    const hero = HIGHLIGHTS_CONTENT[heroIndex];
    // Grid items (always from indices 1-5, independent of hero)
    const gridItems = HIGHLIGHTS_CONTENT.slice(1, 6);

    return (
        <div className="mob-highlights">
            {/* Background effects */}
            <div className="mob-highlights__bg-grid" />
            <div className="mob-highlights__bg-glow-1" />
            <div className="mob-highlights__bg-glow-2" />

            {/* Header */}
            <header className="mob-highlights__header">
                <h1 className="mob-highlights__title">
                    Moments That
                    <span className="mob-highlights__title-fade">Made Us</span>
                </h1>
                <p className="mob-highlights__tagline">"Virasat se Vikas tak"</p>
                <div className="mob-highlights__divider" />
            </header>

            {/* Content */}
            <div className="mob-highlights__content">
                {/* Hero card — cycles through highlights */}
                {hero && (
                    <div className="mob-highlights__hero">
                        <div className="mob-highlights__hero-img-wrap">
                            <img
                                className={`mob-highlights__hero-img ${heroTransitioning ? 'mob-highlights__hero-img--out' : ''}`}
                                src={hero.url}
                                alt={hero.title}
                                loading="lazy"
                                draggable={false}
                            />
                        </div>
                        <div className="mob-highlights__hero-gradient" />
                        <div className={`mob-highlights__hero-info ${heroTransitioning ? 'mob-highlights__hero-info--out' : ''}`}>
                            <div>
                                <span className="mob-highlights__hero-counter">
                                    {String(heroIndex + 1).padStart(2, '0')} / {String(HIGHLIGHTS_CONTENT.length).padStart(2, '0')}
                                </span>
                                <h3 className="mob-highlights__hero-title">{hero.title}</h3>
                                <p className="mob-highlights__hero-desc">{hero.description}</p>
                            </div>
                            <button
                                className="mob-highlights__hero-arrow"
                                aria-label="Next highlight"
                                onClick={handleHeroNext}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Masonry grid */}
                <div className="mob-highlights__masonry">
                    {/* Left column */}
                    <div className="mob-highlights__col">
                        {/* Tall image card */}
                        {gridItems[0] && (
                            <div
                                className={`mob-highlights__card mob-highlights__card--tall ${activeCard === 0 ? 'mob-highlights__card--active' : ''}`}
                                onClick={() => handleCardTap(0)}
                            >
                                <div className="mob-highlights__card-accent" />
                                <img
                                    className="mob-highlights__card-img"
                                    src={gridItems[0].url}
                                    alt={gridItems[0].title}
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="mob-highlights__card-overlay" />
                                <div className="mob-highlights__card-label">
                                    <h4>{gridItems[0].title}</h4>
                                </div>
                            </div>
                        )}

                        {/* Additional image card */}
                        {gridItems[3] && (
                            <div
                                className={`mob-highlights__card mob-highlights__card--short mob-highlights__card--bordered ${activeCard === 3 ? 'mob-highlights__card--active' : ''}`}
                                onClick={() => handleCardTap(3)}
                            >
                                <img
                                    className="mob-highlights__card-img"
                                    src={gridItems[3].url}
                                    alt={gridItems[3].title}
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="mob-highlights__card-overlay" />
                                <div className="mob-highlights__card-label">
                                    <h4>{gridItems[3].title}</h4>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column (offset) */}
                    <div className="mob-highlights__col mob-highlights__col--offset">
                        {/* Short image card */}
                        {gridItems[1] && (
                            <div
                                className={`mob-highlights__card mob-highlights__card--short mob-highlights__card--bordered ${activeCard === 1 ? 'mob-highlights__card--active' : ''}`}
                                onClick={() => handleCardTap(1)}
                            >
                                <img
                                    className="mob-highlights__card-img"
                                    src={gridItems[1].url}
                                    alt={gridItems[1].title}
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="mob-highlights__card-label mob-highlights__card-label--cyan">
                                    <h4>{gridItems[1].title}</h4>
                                </div>
                            </div>
                        )}

                        {/* Tall image card with corner triangle + quote */}
                        {gridItems[2] && (
                            <div
                                className={`mob-highlights__card mob-highlights__card--tall ${activeCard === 2 ? 'mob-highlights__card--active' : ''}`}
                                onClick={() => handleCardTap(2)}
                            >
                                <div className="mob-highlights__card-corner" />
                                <img
                                    className="mob-highlights__card-img"
                                    src={gridItems[2].url}
                                    alt={gridItems[2].title}
                                    loading="lazy"
                                    draggable={false}
                                />
                                <div className="mob-highlights__card-overlay" style={{
                                    background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%)',
                                }} />
                                <div className="mob-highlights__card-quote">
                                    <p>"{gridItems[2].description?.slice(0, 40)}…"</p>
                                </div>
                                <div className="mob-highlights__card-label">
                                    <h4>{gridItems[2].title}</h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Archive CTA */}
                <div className="mob-highlights__archive">
                    <div className="mob-highlights__archive-bg" />
                    <div className="mob-highlights__archive-pattern" />
                    <div className="mob-highlights__archive-inner">
                        <span className="mob-highlights__archive-tag">[ ARCHIVE ACCESS ]</span>
                        <h3 className="mob-highlights__archive-year">2006 – 2025</h3>
                        <p className="mob-highlights__archive-desc">
                            Explore the complete timeline of innovation and culture.
                        </p>
                        <button
                            type="button"
                            className="mob-highlights__archive-btn"
                            onClick={() => {
                                const gallery = document.getElementById('gallery-section');
                                if (gallery) {
                                    gallery.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            View Full Timeline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHighlightsSection;
