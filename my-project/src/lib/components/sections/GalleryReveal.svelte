<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let container: HTMLElement;

	onMount(() => {
		ScrollTrigger.create({
			trigger: container,
			start: 'top center',
			end: 'bottom center',
			onEnter: () => (scrollState.activeZone = 'GALLERY'),
			onEnterBack: () => (scrollState.activeZone = 'GALLERY')
		});
	});
</script>

<div bind:this={container} class="gallery-section pointer-events-none relative h-[200dvh] w-full">
	<!-- Sticky HUD -->
	<div class="sticky top-0 flex h-[100dvh] w-full flex-col justify-between p-8 md:p-12">
		<div class="border-l-2 border-white/20 pl-4">
			<h3 class="font-mono text-sm tracking-widest text-cyan-400">ARCHIVES</h3>
			<h2 class="text-4xl font-bold text-white">GLIMPSES</h2>
		</div>

		<div class="self-end text-right">
			<p class="font-mono text-xs text-white/50">SCROLL TO EXPLORE</p>
			<div class="mt-2 h-[1px] w-24 bg-white/20"></div>
		</div>
	</div>
</div>
