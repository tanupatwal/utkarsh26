/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 */
export const TIMELINE = {
    /** Hero handoff is complete by this point */
    HERO_END: 0.14,
    /** End of the empty deep-dive void phase */
    VOID_END: 0.28,
    /** Start of vortex tunnel reveal */
    TUNNEL_START: 0.28,
    /** End of tunnel trailer phase */
    TUNNEL_END: 0.56,
    /** Start of about section */
    ABOUT_START: 0.56,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.72,
    /** Transition from about to gallery */
    TRANSITION: 0.86,
    /** Gallery section begins */
    GALLERY_START: 0.86,
    /** Highlights floating gallery begins */
    HIGHLIGHTS_START: 0.93,
    /** Highlights images begin dissolving into schedule */
    HIGHLIGHTS_DISSOLVE: 0.97,
    /** Schedule section fully visible */
    SCHEDULE_START: 0.99,
    /** End of scroll experience */
    END: 1.0
} as const;

export type TimelineKey = keyof typeof TIMELINE;
