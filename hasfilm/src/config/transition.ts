import { TIMELINE } from './timeline';

/**
 * Cinematic handoff timing between hero and tunnel.
 */
export const TRANSITION_CONFIG = {
    /** Hero remains fully visible and static */
    HERO_HOLD_END: TIMELINE.TUNNEL_END * 0.3,
    /** Hero zooms while staying fully opaque */
    HERO_ZOOM_END: TIMELINE.TUNNEL_END * 0.55,
    /** Hero fade/blackout handoff end */
    HERO_HANDOFF_END: TIMELINE.TUNNEL_END * 0.7,
    /** Black matte releases to reveal tunnel */
    BLACKOUT_RELEASE_END: TIMELINE.TUNNEL_END * 0.9,
    /** Tunnel starts only after hero handoff begins */
    TUNNEL_REVEAL_START: TIMELINE.TUNNEL_END * 0.7,
    /** Hero maximum scale before handoff */
    HERO_ZOOM_SCALE: 1.85,
    /** Hero scale at the end of handoff fade */
    HERO_EXIT_SCALE: 2.05,
    /** Background maximum scale before handoff */
    BG_ZOOM_SCALE: 1.45,
    /** Background scale at the end of handoff fade */
    BG_EXIT_SCALE: 1.65
} as const;

export const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

export const rangeProgress = (value: number, start: number, end: number): number => {
    if (end <= start) return 1;
    return clamp01((value - start) / (end - start));
};

