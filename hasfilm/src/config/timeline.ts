/**
 * Timeline configuration for scroll-based animations.
 * Values represent normalized scroll progress (0-1).
 *
 * LAYOUT (Pin-Dwell-Release pattern):
 *   0.00  → 0.12  Hero (video + overlay text, fades out)
 *   0.12  → 0.30  About section (dwell)
 *   0.30  → 0.34  About → Gallery transition
 *   0.34  → 0.85  Gallery (3D cylinder panels + overlay HUD)
 *   0.85  → 0.876 Gallery dissolve (panels explode, screen goes dark)
 *   ─── Post-Gallery (pure DOM, no 3D) ───
 *   0.88  → 0.935 Highlights (dark backdrop + floating images + gravity drain)
 *   0.935 → 0.97  Schedule (fade-in, dwell, fade-out)
 *   0.975 → 1.0   Team (fade-in, scroll-trapped member browse)
 */
export const TIMELINE = {
    // ── Hero ──
    /** Hero fades out by this point */
    HERO_END: 0.12,

    // ── About ──
    /** Start of about section */
    ABOUT_START: 0.12,
    /** About section stays visible until this point */
    ABOUT_STAY: 0.30,
    /** Transition from about to gallery */
    TRANSITION: 0.34,

    // ── Gallery (3D) ──
    /** Gallery section begins (3D panels become active) */
    GALLERY_START: 0.34,
    /** Gallery sticky scroll ends (panels stop rotating) */
    GALLERY_VIEW_END: 0.85,
    /** Dissolve begins (after HUD fade pause) */
    GALLERY_DISSOLVE_START: 0.855,
    /** Dissolve complete → screen is dark */
    GALLERY_DISSOLVE_END: 0.875,
    /** All gallery 3D hidden (post-dissolve cleanup) */
    GALLERY_HIDE: 0.876,

    // ── Highlights (DOM) ──
    /** Dark backdrop starts fading in */
    HIGHLIGHTS_DARK_START: 0.88,
    /** Dark backdrop fully visible, content starts appearing */
    HIGHLIGHTS_DARK_FULL: 0.895,
    /** Title fade-in begins (scroll-based) */
    HIGHLIGHTS_TITLE_IN: 0.895,
    /** Title fully visible */
    HIGHLIGHTS_TITLE_VISIBLE: 0.900,
    /** Title hold ends */
    HIGHLIGHTS_TITLE_HOLD: 0.907,
    /** Title fully faded out */
    HIGHLIGHTS_TITLE_OUT: 0.913,
    /** Gallery images start appearing */
    HIGHLIGHTS_GALLERY_START: 0.905,
    /** Gallery images fully visible */
    HIGHLIGHTS_GALLERY_FULL: 0.912,
    /** Gravity drain starts — images fall */
    HIGHLIGHTS_GRAVITY_START: 0.92,
    /** Background starts fading out */
    HIGHLIGHTS_BG_FADE_OUT_START: 0.925,
    /** Gravity drain + bg fade complete */
    HIGHLIGHTS_END: 0.935,

    // ── Schedule (DOM) ──
    /** Schedule section starts fading in */
    SCHEDULE_FADE_START: 0.935,
    /** Schedule fully visible — dwell begins */
    SCHEDULE_FADE_FULL: 0.945,
    /** Schedule starts fading out */
    SCHEDULE_FADE_OUT_START: 0.965,
    /** Schedule fully hidden */
    SCHEDULE_FADE_OUT_FULL: 0.97,

    // ── Team (DOM) ──
    /** Team section starts fading in */
    TEAM_FADE_START: 0.975,
    /** Team fully visible — scroll trap activates */
    TEAM_FADE_FULL: 0.985,

    /** End of scroll experience */
    END: 1.0,
} as const;

export type TimelineKey = keyof typeof TIMELINE;
