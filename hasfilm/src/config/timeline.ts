/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * LAYOUT (Dissolve-Overlap pattern — no gaps):
 *   0.00 → 0.10  Hero (dwell)
 *   0.08 → 0.30  About section (dissolve overlap with hero at 0.08-0.10)
 *   0.28 → 0.50  Gallery (dissolve overlap with about at 0.28-0.30)
 *   0.48 → 0.52  Gallery morph → Highlights transition
 *   0.52 → 0.64  Highlights (floating gallery)
 *   0.62 → 0.80  Schedule (dissolve overlap with highlights at 0.62-0.64)
 *   0.78 → 1.00  Team (dissolve overlap with schedule at 0.78-0.80)
 */
export const TIMELINE = {
    /** Hero fades out by this point */
    HERO_END: 0.10,
    /** About section fades in (overlaps hero fade-out) */
    ABOUT_START: 0.08,
    /** About section stays fully visible until */
    ABOUT_STAY: 0.28,
    /** About fully faded out by here */
    TRANSITION: 0.30,
    /** Gallery section begins (overlaps about fade-out) */
    GALLERY_START: 0.28,
    /** Gallery panels end */
    GALLERY_END: 0.50,
    /** Gallery morph completes */
    MORPH_END: 0.52,
    /** Highlights floating gallery begins */
    HIGHLIGHTS_START: 0.52,
    /** Highlights images begin dissolving */
    HIGHLIGHTS_DISSOLVE: 0.62,
    /** Schedule section fades in (overlaps highlights dissolve) */
    SCHEDULE_START: 0.62,
    /** Schedule stays fully visible until */
    SCHEDULE_STAY: 0.78,
    /** Schedule fades out */
    SCHEDULE_END: 0.80,
    /** Team section begins fading in (overlaps schedule fade-out) */
    TEAM_START: 0.78,
    /** Team section fully visible */
    TEAM_FULL: 0.83,
    /** End of scroll experience */
    END: 1.0
} as const;

export type TimelineKey = keyof typeof TIMELINE;

