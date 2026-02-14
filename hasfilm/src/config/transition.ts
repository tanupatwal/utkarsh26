/**
 * Utility functions for scroll-based transitions.
 */

export const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

export const rangeProgress = (value: number, start: number, end: number): number => {
    if (end <= start) return 1;
    return clamp01((value - start) / (end - start));
};

