<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	onMount(() => {
		ScrollTrigger.create({
			trigger: '.warp-spacer',
			start: 'top center',
			end: 'bottom center',
			onEnter: () => (scrollState.activeZone = 'WARP'),
			onEnterBack: () => (scrollState.activeZone = 'WARP')
		});
	});
</script>

<div class="warp-spacer flex h-full w-full items-center justify-center">
	<!-- Empty Transparent Spacer for the "Tunnel" transition -->
	<!-- Debug indicator if needed -->
	<!-- <span class="text-xs text-white/10">WARP ZONE</span> -->
</div>
