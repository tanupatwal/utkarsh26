/**
 * Centralized animation configuration
 * All easing functions, timing constants, and animation utilities in one place
 */

/**
 * Easing functions for smooth animations
 * Based on Robert Penner's easing equations
 */
export const Easing = {
    /**
     * Linear - no easing, no acceleration
     */
    linear: (t: number): number => t,

    /**
     * Quadratic ease-in - accelerating from zero velocity
     */
    easeInQuad: (t: number): number => t * t,

    /**
     * Quadratic ease-out - decelerating to zero velocity
     */
    easeOutQuad: (t: number): number => t * (2 - t),

    /**
     * Quadratic ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutQuad: (t: number): number =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    /**
     * Cubic ease-in - accelerating from zero velocity
     */
    easeInCubic: (t: number): number => t * t * t,

    /**
     * Cubic ease-out - decelerating to zero velocity
     */
    easeOutCubic: (t: number): number => --t * t * t + 1,

    /**
     * Cubic ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutCubic: (t: number): number =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    /**
     * Quartic ease-in - accelerating from zero velocity
     */
    easeInQuart: (t: number): number => t * t * t * t,

    /**
     * Quartic ease-out - decelerating to zero velocity
     */
    easeOutQuart: (t: number): number => 1 - --t * t * t * t,

    /**
     * Quartic ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutQuart: (t: number): number =>
        t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

    /**
     * Quintic ease-in - accelerating from zero velocity
     */
    easeInQuint: (t: number): number => t * t * t * t * t,

    /**
     * Quintic ease-out - decelerating to zero velocity
     */
    easeOutQuint: (t: number): number => 1 + --t * t * t * t * t,

    /**
     * Quintic ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutQuint: (t: number): number =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

    /**
     * Exponential ease-in - accelerating from zero velocity
     */
    easeInExpo: (t: number): number => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),

    /**
     * Exponential ease-out - decelerating to zero velocity
     */
    easeOutExpo: (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

    /**
     * Exponential ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutExpo: (t: number): number =>
        t === 0 ? 0 : t === 1 ? 1 : t < 0.5
            ? Math.pow(2, 20 * t - 10) / 2
            : (2 - Math.pow(2, -20 * t + 10)) / 2,

    /**
     * Circular ease-in - accelerating from zero velocity
     */
    easeInCirc: (t: number): number => {
        const scaled = t / 1;
        return -1 * (Math.sqrt(1 - scaled * t) - 1);
    },

    /**
     * Circular ease-out - decelerating to zero velocity
     */
    easeOutCirc: (t: number): number => {
        const t1 = t - 1;
        return Math.sqrt(1 - t1 * t1);
    },

    /**
     * Circular ease-in-out - acceleration halfway, then deceleration
     */
    easeInOutCirc: (t: number): number =>
        t < 0.5
            ? -0.5 * (Math.sqrt(1 - 4 * t * t) - 1)
            : 0.5 * (Math.sqrt(1 - -2 * t + 2) + 1),

    /**
     * Smoothstep (Hermite interpolation) - smooth acceleration and deceleration
     * Equivalent to Three.js' MathUtils.smoothstep
     */
    smoothstep: (t: number): number => t * t * (3 - 2 * t),

    /**
     * Smootherstep - even smoother than smoothstep
     */
    smootherstep: (t: number): number => t * t * t * (t * (t * 6 - 15) + 10),
} as const;

/**
 * Animation timing constants (in seconds)
 */
export const ANIMATION_TIMING = {
    /** Fast transition (UI elements) */
    FAST: 0.2,
    /** Standard transition */
    NORMAL: 0.4,
    /** Slow, cinematic transition */
    SLOW: 0.8,
    /** Very slow, dramatic transition */
    CINEMATIC: 1.2,
} as const;

/**
 * Transition presets combining easing and duration
 */
export const TRANSITION = {
    /** Quick, snappy transition for UI feedback */
    snappy: {
        easing: Easing.easeOutQuad,
        duration: ANIMATION_TIMING.FAST,
    },
    /** Smooth, natural transition for general use */
    smooth: {
        easing: Easing.easeInOutCubic,
        duration: ANIMATION_TIMING.NORMAL,
    },
    /** Cinematic, dramatic transition for major scene changes */
    cinematic: {
        easing: Easing.easeInOutExpo,
        duration: ANIMATION_TIMING.CINEMATIC,
    },
    /** Gentle fade for overlays */
    fade: {
        easing: Easing.easeOutQuad,
        duration: ANIMATION_TIMING.NORMAL,
    },
    /** Bouncy, playful transition */
    bouncy: {
        easing: Easing.easeOutCubic,
        duration: ANIMATION_TIMING.NORMAL,
    },
} as const;

/**
 * Scale animation presets
 */
export const SCALE_ANIMATION = {
    /** Subtle scale change (hover effects) */
    subtle: {
        from: 1,
        to: 1.05,
    },
    /** Moderate scale (selection emphasis) */
    moderate: {
        from: 1,
        to: 1.15,
    },
    /** Dramatic scale (hero dive effect) */
    dramatic: {
        from: 1,
        to: 4,
    },
} as const;

/**
 * Opacity animation presets
 */
export const OPACITY_ANIMATION = {
    /** Fade to transparent */
    fadeOut: {
        from: 1,
        to: 0,
    },
    /** Fade from transparent */
    fadeIn: {
        from: 0,
        to: 1,
    },
    /** Subtle dim (hover states) */
    dim: {
        from: 1,
        to: 0.7,
    },
} as const;

/**
 * Utility: Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(value, min), max);

/**
 * Utility: Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number =>
    start + (end - start) * t;

/**
 * Utility: Map a value from one range to another
 */
export const mapRange = (
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number => {
    const t = (value - inMin) / (inMax - inMin);
    return outMin + t * (outMax - outMin);
};

/**
 * Utility: Apply easing to a value
 */
export const applyEasing = (
    value: number,
    easing: (t: number) => number
): number => easing(clamp(value, 0, 1));

/**
 * Utility: Animate a value with easing over progress
 */
export const animateValue = (
    start: number,
    end: number,
    progress: number,
    easing: (t: number) => number = Easing.easeInOutCubic
): number => lerp(start, end, applyEasing(progress, easing));

/**
 * Utility: Calculate scroll-based animation state
 */
export interface ScrollAnimationState {
    /** Whether element should be visible */
    visible: boolean;
    /** Calculated opacity (0-1) */
    opacity: number;
    /** Calculated scale */
    scale: number;
    /** Normalized progress within active range (0-1) */
    progress: number;
}

/**
 * Calculate animation state based on scroll position
 */
export const getScrollAnimationState = (
    scroll: number,
    start: number,
    end: number,
    options: {
        fadeEdge?: number; // Fade in/out duration at edges
        scaleRange?: { min: number; max: number };
    } = {}
): ScrollAnimationState => {
    const { fadeEdge = 0.05, scaleRange = { min: 1, max: 1 } } = options;

    // Before range
    if (scroll < start) {
        return { visible: false, opacity: 0, scale: scaleRange.min, progress: 0 };
    }
    // After range
    if (scroll > end) {
        return { visible: false, opacity: 0, scale: scaleRange.min, progress: 1 };
    }

    // Calculate progress within range
    const progress = (scroll - start) / (end - start);

    // Calculate opacity with fade edges
    let opacity = 1;
    if (progress < fadeEdge) {
        opacity = progress / fadeEdge;
    } else if (progress > 1 - fadeEdge) {
        opacity = (1 - progress) / fadeEdge;
    }

    // Calculate scale
    const scale = lerp(scaleRange.min, scaleRange.max, progress);

    return { visible: true, opacity, scale, progress };
};

/**
 * Type for easing function
 */
export type EasingFunction = (t: number) => number;

/**
 * Type for transition preset
 */
export interface TransitionPreset {
    easing: EasingFunction;
    duration: number;
}
