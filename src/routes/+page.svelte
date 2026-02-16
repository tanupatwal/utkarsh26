<script lang="ts">
    import { onMount } from "svelte";
    import { scrollState, type Zone } from "$lib/state/scrollState.svelte";

    import Hero from "$lib/components/sections/Hero.svelte";
    import WarpSpacer from "$lib/components/sections/WarpSpacer.svelte";
    import About from "$lib/components/sections/About.svelte";
    import GalleryReveal from "$lib/components/sections/GalleryReveal.svelte";
    import EventHighlights from "$lib/components/sections/EventHighlights.svelte";
    import Schedule from "$lib/components/sections/Schedule.svelte";
    import Team from "$lib/components/sections/Team.svelte";
    import Footer from "$lib/components/sections/Footer.svelte";

    // Debug: log scroll progress in development
    let debugProgress = $derived(
        Math.round(scrollState.progress * 1000) / 1000,
    );
    let debugZone = $derived(scrollState.activeZone);
    let debugTier = $derived(scrollState.deviceTier);

    let pageWrapper: HTMLElement;

    onMount(async () => {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        // Find all sections with data-zone attributes and create triggers
        const sections =
            pageWrapper.querySelectorAll<HTMLElement>("[data-zone]");

        sections.forEach((section) => {
            const zone = section.dataset.zone as Zone;

            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    scrollState.activeZone = zone;
                },
                onEnterBack: () => {
                    scrollState.activeZone = zone;
                },
            });
        });
    });
</script>

<!-- Debug HUD (dev only, remove in production) -->
<div class="debug-hud">
    <span>P: {debugProgress}</span>
    <span>Z: {debugZone}</span>
    <span>T: {debugTier}</span>
</div>

<!-- Section Composition -->
<main class="page-wrapper" bind:this={pageWrapper}>
    <!--
		Section Heights (total ~1000dvh):
		Hero:       100dvh
		WarpSpacer: 100dvh
		About:      100dvh
		Gallery:    200dvh
		Highlights: 150dvh
		Schedule:   200dvh
		Team:       100dvh
		Footer:      50dvh
	-->
    <Hero />
    <WarpSpacer />
    <About />
    <GalleryReveal />
    <EventHighlights />
    <Schedule />
    <Team />
    <Footer />
</main>

<style>
    .page-wrapper {
        position: relative;
        z-index: var(--z-content);
    }

    .debug-hud {
        position: fixed;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 9999;
        display: flex;
        gap: 1rem;
        font-family: var(--font-mono);
        font-size: 0.65rem;
        color: var(--color-accent);
        background: rgba(0, 0, 0, 0.8);
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        border: 1px solid var(--color-border);
        pointer-events: none;
    }
</style>
