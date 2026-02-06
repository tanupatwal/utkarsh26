/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 */
export const TIMELINE = {
    /** End of tunnel phase */
    TUNNEL_END: 0.2,
    /** Start of about section */
    ABOUT_START: 0.2,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.45,
    /** Transition from about to gallery */
    TRANSITION: 0.6,
    /** Gallery section begins */
    GALLERY_START: 0.6,
    /** End of scroll experience */
    END: 1.0
} as const;

export type TimelineKey = keyof typeof TIMELINE;
