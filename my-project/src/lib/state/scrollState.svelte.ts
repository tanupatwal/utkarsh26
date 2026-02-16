import { Vector3 } from 'three';

/**
 * Global Scroll State (Svelte 5 Runes)
 * Single source of truth for the entire application.
 */
class ScrollState {
    // Current scroll progress (0 to 1)
    progress = $state(0);

    // Current scroll velocity (useful for warp effects)
    velocity = $state(0);

    // Master loading state (true = assets loaded, remove preloader)
    isLoaded = $state(false);

    // Camera look-at target (for the "Look-Ahead" effect)
    targetLookAt = $state(new Vector3(0, 0, 0));

    // Active Section / Zone Tracker
    activeZone = $state<'HERO' | 'WARP' | 'ABOUT' | 'GALLERY' | 'HIGHLIGHTS' | 'SCHEDULE' | 'TEAM'>('HERO');

    // TEAM Hover State
    hoveredTeamMember = $state<string | null>(null);

    constructor() {
        // Initialize with default values
    }
}

// Export a singleton instance
export const scrollState = new ScrollState();
