/**
 * Global Scroll State using Svelte 5 Runes.
 * Acts as the "Brain" for syncing DOM and WebGL.
 */

import { onMount } from 'svelte';
import Lenis from 'lenis';

class ScrollState {
    // Reactive primitives
    y = $state(0);
    limit = $state(0);
    progress = $state(0);
    velocity = $state(0);
    direction = $state(0); // -1: up, 1: down
    isScrolling = $state(false);

    // Singleton instance of Lenis
    lenis: Lenis | null = null;

    init(lenisInstance: Lenis) {
        this.lenis = lenisInstance;

        // Hook into Lenis scroll event
        this.lenis.on('scroll', (e: any) => {
            this.y = e.scroll;
            this.limit = e.limit;
            this.progress = e.progress;
            this.velocity = e.velocity;
            this.direction = e.direction;
            this.isScrolling = Math.abs(e.velocity) > 0.1;
        });
    }

    // Programmatic scroll
    scrollTo(target: number | string | HTMLElement, options = {}) {
        this.lenis?.scrollTo(target, options);
    }
}

// Export a singleton instance
export const scrollState = new ScrollState();
