/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * REBALANCED LAYOUT (PAGES = 12):
 *   0.00  → 0.06  Hero (6%)  — was 12%
 *   0.06  → 0.14  About (8%) — was 18%
 *   0.14  → 0.22  About → Gallery transition (8%) — was 4%
 *   0.22  → 0.62  Gallery 3D (40%) — was 51%
 *   ─── Post-Gallery (pure DOM, no 3D) ───
 *   0.62  → 0.76  Highlights (14%) — was 5.5%
 *   0.76  → 0.88  Schedule (12%) — was 3.5%
 *   0.88  → 1.00  Team (12%) — was 2.5%
 */
export const TIMELINE = {
    // ── Hero ──
    /** Hero fades out by this point */
    HERO_END: 0.06,

    // ── About ──
    /** Start of about section */
    ABOUT_START: 0.06,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.14,
    /** Transition from about to gallery */
    TRANSITION: 0.22,

    // ── Gallery (3D) ──
    /** Gallery section begins (3D panels become active) */
    GALLERY_START: 0.22,
    /** Gallery sticky scroll ends (panels stop rotating) */
    GALLERY_VIEW_END: 0.56,
    /** Dissolve begins (after HUD fade pause) */
    GALLERY_DISSOLVE_START: 0.57,
    /** Dissolve complete → screen is dark */
    GALLERY_DISSOLVE_END: 0.61,
    /** All gallery 3D hidden (post-dissolve cleanup) */
    GALLERY_HIDE: 0.62,

    // ── Highlights (DOM) ──
    /** Dark backdrop starts fading in */
    HIGHLIGHTS_DARK_START: 0.62,
    /** Dark backdrop fully visible, content starts appearing */
    HIGHLIGHTS_DARK_FULL: 0.65,
    /** Title fade-in begins (scroll-based) */
    HIGHLIGHTS_TITLE_IN: 0.65,
    /** Title fully visible */
    HIGHLIGHTS_TITLE_VISIBLE: 0.66,
    /** Title hold ends */
    HIGHLIGHTS_TITLE_HOLD: 0.68,
    /** Title fully faded out */
    HIGHLIGHTS_TITLE_OUT: 0.69,
    /** Gallery images start appearing */
    HIGHLIGHTS_GALLERY_START: 0.67,
    /** Gallery images fully visible */
    HIGHLIGHTS_GALLERY_FULL: 0.69,
    /** Gravity drain starts — images fall */
    HIGHLIGHTS_GRAVITY_START: 0.72,
    /** Background starts fading out */
    HIGHLIGHTS_BG_FADE_OUT_START: 0.73,
    /** Gravity drain + bg fade complete */
    HIGHLIGHTS_END: 0.76,

    // ── Schedule (DOM) ──
    /** Schedule section starts fading in */
    SCHEDULE_FADE_START: 0.76,
    /** Schedule fully visible — dwell begins */
    SCHEDULE_FADE_FULL: 0.79,
    /** Schedule starts fading out */
    SCHEDULE_FADE_OUT_START: 0.85,
    /** Schedule fully hidden */
    SCHEDULE_FADE_OUT_FULL: 0.88,

    // ── Team (DOM) ──
    /** Team section starts fading in */
    TEAM_FADE_START: 0.88,
    /** Team fully visible — scroll trap activates */
    TEAM_FADE_FULL: 0.92,

    /** End of scroll experience */
    END: 1.0,
} as const;

export type TimelineKey = keyof typeof TIMELINE;
