import { useMemo, useEffect, useState } from 'react';

/**
 * Quality tier for performance optimization
 */
export type QualityTier = 'low' | 'medium' | 'high';

/**
 * Quality settings for different device capabilities
 */
export interface QualitySettings {
    /** Quality tier based on device capabilities */
    tier: QualityTier;
    /** Whether user prefers reduced motion */
    reducedMotion: boolean;
    /** Whether device is mobile */
    isMobile: boolean;
    /** Pixel ratio to use (capped for performance) */
    dpr: [number, number];
    /** Whether to enable post-processing */
    enablePostProcessing: boolean;
    /** Whether to enable particle effects */
    enableParticles: boolean;
    /** Shadow map size */
    shadowMapSize: number;
}

/**
 * Detect if device is mobile
 */
const isMobileDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
           window.innerWidth < 768;
};

/**
 * Detect if user prefers reduced motion
 */
const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Estimate device performance tier
 */
const getPerformanceTier = (): QualityTier => {
    if (typeof window === 'undefined') return 'medium';

    // Check for reduced motion preference
    if (prefersReducedMotion()) return 'low';

    // Check for mobile
    if (isMobileDevice()) {
        // Modern mobile devices can handle medium quality
        const isHighEndMobile = /iPhone (1[2-9]|2[0-9])|iPad (9|10|Pro|Air)|Android (1[2-9]|2[0-9])/i.test(navigator.userAgent);
        return isHighEndMobile ? 'medium' : 'low';
    }

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    if (cores < 4) return 'low';
    if (cores < 8) return 'medium';
    return 'high';
};

/**
 * Hook to get quality settings based on device capabilities
 *
 * @example
 * ```tsx
 * const quality = useQualitySettings();
 *
 * <Canvas dpr={quality.dpr}>
 *   {quality.enablePostProcessing && <TransitionEffects />}
 *   {quality.enableParticles && <SpeedLines />}
 * </Canvas>
 * ```
 */
export const useQualitySettings = (): QualitySettings => {
    const [tier, setTier] = useState<QualityTier>('medium');
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect settings on mount and listen for changes
    useEffect(() => {
        const updateSettings = () => {
            setTier(getPerformanceTier());
            setReducedMotion(prefersReducedMotion());
            setIsMobile(isMobileDevice());
        };

        updateSettings();

        // Listen for preference changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', updateSettings);

        return () => {
            mediaQuery.removeEventListener('change', updateSettings);
        };
    }, []);

    // Calculate derived settings
    const settings = useMemo<QualitySettings>(() => {
        // Force low quality if reduced motion is preferred
        const effectiveTier = reducedMotion ? 'low' : tier;

        return {
            tier: effectiveTier,
            reducedMotion,
            isMobile,
            // Cap DPR based on quality tier
            dpr: effectiveTier === 'low' ? [1, 1] :
                  effectiveTier === 'medium' ? [1, 1.5] : [1, 2],
            // Post-processing only on high/medium tier, and no reduced motion
            enablePostProcessing: effectiveTier !== 'low' && !reducedMotion,
            // Particles based on tier
            enableParticles: effectiveTier !== 'low',
            // Shadow map size based on tier
            shadowMapSize: effectiveTier === 'low' ? 512 :
                           effectiveTier === 'medium' ? 1024 : 2048,
        };
    }, [tier, reducedMotion, isMobile]);

    return settings;
};

export default useQualitySettings;
