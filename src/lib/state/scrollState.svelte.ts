import { Vector3 } from 'three';

/**
 * Zone identifiers for each section of the scroll journey.
 * Used to conditionally mount/unmount canvases and trigger section-specific logic.
 */
export type Zone =
    | 'HERO'
    | 'WARP'
    | 'ABOUT'
    | 'GALLERY'
    | 'HIGHLIGHTS'
    | 'SCHEDULE'
    | 'TEAM'
    | 'FOOTER';

/**
 * Device quality tiers for progressive enhancement.
 * HIGH   = Desktop (full 3D, video textures, parallax)
 * MEDIUM = Tablet / high-end phone (tunnel + simplified effects)
 * LOW    = Older phones (HTML-only, no WebGL)
 */
export type DeviceTier = 'high' | 'medium' | 'low';

/**
 * Single source of truth for all scroll-driven state.
 * Every component reads from this singleton — no prop drilling.
 *
 * Updated by GhostScroller (Lenis → GSAP ticker → here).
 * Read by: sections, 3D scenes, HUD, navbar, etc.
 */
class ScrollState {
    /** Normalized scroll progress: 0 = top, 1 = bottom */
    progress = $state(0);

    /** Scroll velocity (pixels/frame). Used for FOV warp, speed lines, etc. */
    velocity = $state(0);

    /** True once all critical assets are loaded and preloader is dismissed */
    isLoaded = $state(false);

    /** Current section the user is in */
    activeZone = $state<Zone>('HERO');

    /** Camera look-at target (for animated transitions between sections) */
    targetLookAt = $state(new Vector3());

    /** Currently hovered interactive item (team member, gallery image, etc.) */
    hoveredItem = $state<string | null>(null);

    /** Device performance tier — set once on mount, never changes */
    deviceTier = $state<DeviceTier>('high');

    /** Scroll direction: 1 = down, -1 = up, 0 = idle */
    direction = $state<-1 | 0 | 1>(0);

    /**
     * Detect device tier based on hardware signals.
     * Called once from GhostScroller on mount.
     */
    detectDeviceTier(): void {
        if (typeof window === 'undefined') return;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const screenWidth = window.innerWidth;

        if (!isMobile) {
            this.deviceTier = 'high';
            return;
        }

        // High-end mobile = medium tier
        const isHighEnd = /iPhone1[5-9]|iPhone2|Pixel [89]|Galaxy S2[4-9]/i.test(
            navigator.userAgent
        );

        if (isHighEnd || screenWidth >= 768) {
            this.deviceTier = 'medium';
        } else {
            this.deviceTier = 'low';
        }
    }
}

/** Global singleton — import this everywhere */
export const scrollState = new ScrollState();
