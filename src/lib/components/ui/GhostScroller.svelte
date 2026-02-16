<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Lenis from "lenis";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { scrollState } from "$lib/state/scrollState.svelte";

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;

    onMount(() => {
        // Detect device tier first
        scrollState.detectDeviceTier();

        const isMobile = scrollState.deviceTier !== "high";

        // Init Lenis smooth scroll
        lenis = new Lenis({
            lerp: isMobile ? 0.15 : 0.1,
            touchMultiplier: isMobile ? 1.5 : 1.0,
            wheelMultiplier: 1.0,
            infinite: false,
        });

        // Sync Lenis with GSAP's ticker (single-loop architecture)
        gsap.ticker.add((time) => {
            lenis?.raf(time * 1000);
        });

        // Disable GSAP's native lag smoothing (Lenis handles it)
        gsap.ticker.lagSmoothing(0);

        // Update ScrollTrigger on Lenis scroll
        lenis.on(
            "scroll",
            (e: { progress: number; velocity: number; direction: number }) => {
                // Clamp progress to [0, 1] — prevents iOS rubber-band overshoot
                scrollState.progress = Math.max(0, Math.min(1, e.progress));
                scrollState.velocity = e.velocity;
                scrollState.direction =
                    e.direction > 0 ? 1 : e.direction < 0 ? -1 : 0;

                ScrollTrigger.update();
            },
        );
    });

    onDestroy(() => {
        if (lenis) {
            lenis.destroy();
            lenis = null;
        }
    });
</script>

<!-- Invisible scroll spacer — creates the real page height -->
<!-- GhostScroller is purely logic, no visual output -->
