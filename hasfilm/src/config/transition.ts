import { TIMELINE } from './timeline';

/**
 * Cinematic handoff timing between hero and tunnel.
 */
export const TRANSITION_CONFIG = {
    /** Hero remains fully visible and static */
    HERO_HOLD_END: TIMELINE.HERO_END * 0.35,
    /** Hero zooms while staying fully opaque */
    HERO_ZOOM_END: TIMELINE.HERO_END * 0.8,
    /** Hero fade/blackout handoff end (hero fully gone) */
    HERO_HANDOFF_END: TIMELINE.HERO_END,
    /** End of pure deep-void stage (no tunnel images) */
    VOID_END: TIMELINE.VOID_END,
    /** Tunnel starts after void stage */
    TUNNEL_REVEAL_START: TIMELINE.TUNNEL_START,
    /** Tunnel reaches full visibility after reveal */
    TUNNEL_REVEAL_FULL: TIMELINE.TUNNEL_START + (TIMELINE.TUNNEL_END - TIMELINE.TUNNEL_START) * 0.2,
    /** Black matte starts releasing as tunnel appears */
    BLACKOUT_RELEASE_START: TIMELINE.TUNNEL_START,
    /** Black matte fully released */
    BLACKOUT_RELEASE_END: TIMELINE.TUNNEL_START + (TIMELINE.TUNNEL_END - TIMELINE.TUNNEL_START) * 0.25,
    /** Hero maximum scale before handoff */
    HERO_ZOOM_SCALE: 1.95,
    /** Hero scale at the end of handoff fade */
    HERO_EXIT_SCALE: 2.2,
    /** Background maximum scale before handoff */
    BG_ZOOM_SCALE: 1.55,
    /** Background scale at the end of handoff fade */
    BG_EXIT_SCALE: 1.78
} as const;

export const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

export const rangeProgress = (value: number, start: number, end: number): number => {
    if (end <= start) return 1;
    return clamp01((value - start) / (end - start));
};
