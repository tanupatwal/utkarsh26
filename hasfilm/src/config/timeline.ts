/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * LAYOUT (Pin-Dwell-Release pattern):
 *   0.0  → 0.12  Hero (video + overlay text, fades out)
 *   0.12 → 0.30  About section (dwell)
 *   0.30 → 0.34  About → Gallery transition
 *   0.34 → 0.50  Gallery (3D panels)
 *   ─── Event Highlights / Schedule / Team ───
 *   0.50 → 0.52  Highlights backdrop fade-in
 *   0.52 → 0.60  Highlights dwell (floating gallery)
 *   0.60 → 0.62  Highlights gravity drain + fade-out
 *   0.62 → 0.63  Gap (black pause)
 *   0.63 → 0.64  Schedule fade-in
 *   0.64 → 0.72  Schedule dwell (browse events)
 *   0.72 → 0.73  Schedule fade-out
 *   0.73 → 0.74  Gap (black pause between schedule & team)
 *   0.74 → 0.76  Team fade-in
 *   0.76 → 1.0   Team dwell (scroll through members)
 */
export const TIMELINE = {
    /** Hero fades out by this point */
    HERO_END: 0.12,
    /** Start of about section */
    ABOUT_START: 0.12,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.30,
    /** Transition from about to gallery */
    TRANSITION: 0.34,
    /** Gallery section begins */
    GALLERY_START: 0.34,
    /** Highlights floating gallery begins */
    HIGHLIGHTS_START: 0.52,
    /** Highlights images begin dissolving */
    HIGHLIGHTS_DISSOLVE: 0.60,
    /** Schedule section fades in */
    SCHEDULE_START: 0.63,
    /** Schedule stays fully visible until */
    SCHEDULE_STAY: 0.72,
    /** Schedule fades out */
    SCHEDULE_END: 0.73,
    /** Team section begins fading in */
    TEAM_START: 0.74,
    /** Team section fully visible */
    TEAM_FULL: 0.76,
    /** End of scroll experience */
    END: 1.0
} as const;

export type TimelineKey = keyof typeof TIMELINE;
