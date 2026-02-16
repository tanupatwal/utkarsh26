/**
 * Custom easing functions for animations.
 * Used by GSAP and manual interpolation throughout the site.
 */

/** Smooth exponential ease-out — great for scroll-driven animations */
export function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Quart ease-out — slightly snappier than expo */
export function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
}

/** Smooth interpolation (lerp) with clamping */
export function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * Math.max(0, Math.min(1, factor));
}

/** Clamp value between min and max */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/** Map + clamp a value from one range to another */
export function mapRangeClamped(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    const mapped = mapRange(value, inMin, inMax, outMin, outMax);
    return clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax));
}
