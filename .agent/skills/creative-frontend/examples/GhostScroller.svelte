<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import gsap from 'gsap';
    import Lenis from 'lenis';
    import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
    import { scrollState } from './scrollState.svelte';

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis;

    onMount(() => {
        // 1. Initialize Lenis
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smoothing
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        // 2. Connect to Global State
        scrollState.init(lenis);

        // 3. The "Double Loop" Fix
        // Sync Lenis to GSAP's Ticker. 
        // This ensures WebGL and DOM update in the same frame.
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // 4. Disable Lag Smoothing for consistent 3D sync
        gsap.ticker.lagSmoothing(0);
    });

    onDestroy(() => {
        lenis?.destroy();
        gsap.ticker.remove(lenis?.raf);
    });
</script>

<!-- 
    This component is "Ghost" because it renders nothing.
    It just manages the scroll physics engine.
-->
<slot />
