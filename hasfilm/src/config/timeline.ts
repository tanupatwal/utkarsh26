/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * LAYOUT (Pin-Dwell-Release pattern):
 *   0.0  → 0.14  Hero
 *   0.14 → 0.28  Void / deep-dive
 *   0.28 → 0.56  Tunnel trailer
 *   0.56 → 0.72  About section (dwell)
 *   0.72 → 0.80  About → Gallery transition
 *   0.80 → 0.86  Gallery (3D panels)
 *   ─── Event Highlights / Schedule / Team ───
 *   0.86 → 0.88  Highlights backdrop fade-in
 *   0.88 → 0.91  Highlights dwell (floating gallery)
 *   0.91 → 0.925 Highlights gravity drain + fade-out
 *   0.925→ 0.935 Gap (black pause)
 *   0.935→ 0.945 Schedule fade-in
 *   0.945→ 0.965 Schedule dwell (browse events)
 *   0.965→ 0.975 Schedule fade-out
 *   0.975→ 0.98  Gap (black pause)
 *   0.98 → 0.99  Team fade-in
 *   0.99 → 1.0   Team dwell (scroll through members)
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
    TRANSITION: 0.76,
    /** Gallery section begins */
    GALLERY_START: 0.76,
    /** Highlights floating gallery begins */
    HIGHLIGHTS_START: 0.88,
    /** Highlights images begin dissolving */
    HIGHLIGHTS_DISSOLVE: 0.92,
    /** Schedule section fades in */
    SCHEDULE_START: 0.935,
    /** Schedule stays fully visible until */
    SCHEDULE_STAY: 0.965,
    /** Schedule fades out */
    SCHEDULE_END: 0.975,
    /** Team section begins fading in */
    TEAM_START: 0.98,
    /** Team section fully visible */
    TEAM_FULL: 0.99,
    /** End of scroll experience */
    END: 1.0
} as const;

export type TimelineKey = keyof typeof TIMELINE;
