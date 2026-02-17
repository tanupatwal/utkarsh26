/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * NOTE: Only Hero and About sections still use global scrollProgress.
 * Gallery, Highlights, Schedule, and Team all use local ScrollTriggers
 * (independent of total page height).
 */
export const TIMELINE = {
    // ── Hero ──
    /** Hero fades out by this point */
    HERO_END: 0.06,

    // ── About ──
    /** Start of about section */
    ABOUT_START: 0.06,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.10,
    /** Transition from about to gallery */
    TRANSITION: 0.14,

    /** End of scroll experience */
    END: 1.0,
} as const;

export type TimelineKey = keyof typeof TIMELINE;
