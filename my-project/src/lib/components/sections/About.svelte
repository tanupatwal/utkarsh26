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
			onEnter: () => (scrollState.activeZone = 'ABOUT'),
			onEnterBack: () => (scrollState.activeZone = 'ABOUT')
		});

		// Slide In Animation
		gsap.from('.about-content', {
			x: 100,
			opacity: 0,
			duration: 1,
			scrollTrigger: {
				trigger: container,
				start: 'top 80%',
				end: 'center center',
				scrub: 1
			}
		});
	});
</script>

<div
	bind:this={container}
	class="about-section flex h-full w-full items-center justify-end px-8 md:px-24"
>
	<div class="about-content max-w-2xl text-right">
		<h2 class="font-heading text-neon-cyan mb-4 text-[6vw] leading-none font-bold opacity-90">
			THE EVOLUTION
		</h2>
		<p class="font-body text-xl leading-relaxed text-white/80">
			From the roots of our heritage to the digital sky of the future. Utkarsh 2026 is not just an
			event; it is a timeline of progress.
		</p>
		<div class="mt-8">
			<button
				class="border-neon-cyan text-neon-cyan hover:bg-neon-cyan border px-6 py-2 transition-colors hover:text-black"
			>
				EXPLORE EVENTS
			</button>
		</div>
	</div>
</div>
