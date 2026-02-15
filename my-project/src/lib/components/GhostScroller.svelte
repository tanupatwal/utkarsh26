<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
	import Lenis from 'lenis';
	import { scrollState } from '$lib/state/scrollState.svelte.js';

	gsap.registerPlugin(ScrollTrigger);

	let lenis: Lenis;

	onMount(() => {
		// 1. Initialize Lenis
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // "Apple-style" ease
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2
		});

		// 2. Sync ScrollTrigger with Lenis
		lenis.on('scroll', ScrollTrigger.update);

		// 3. The Single-Loop Heartbeat (GSAP Ticker)
		// This drives EVERYTHING: Lenis, and implicitly Three.js (if synced)
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		// 4. Disable GSAP's lag smoothing to prevent stutter on heavy loads
		gsap.ticker.lagSmoothing(0);

		// 5. Update Global State
		lenis.on('scroll', ({ scroll, limit, velocity }) => {
			scrollState.progress = scroll / limit;
			scrollState.velocity = velocity;
		});
	});

	onDestroy(() => {
		if (lenis) lenis.destroy();
		gsap.ticker.remove(lenis?.raf);
	});
</script>

<!-- No DOM output, this is a logic-only component -->
