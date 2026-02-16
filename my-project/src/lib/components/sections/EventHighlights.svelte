<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let container: HTMLElement;

	import { EVENTS } from '$lib/data/events';

	onMount(() => {
		ScrollTrigger.create({
			trigger: container,
			start: 'top center',
			end: 'bottom center',
			onEnter: () => (scrollState.activeZone = 'HIGHLIGHTS'),
			onEnterBack: () => (scrollState.activeZone = 'HIGHLIGHTS')
		});
	});
</script>

<div
	bind:this={container}
	class="highlights-section relative min-h-[100dvh] w-full bg-black px-4 py-24 md:px-24"
>
	<div class="border-neon-cyan mb-12 border-l-4 pl-6">
		<h2 class="font-heading text-6xl font-bold text-white">HIGHLIGHTS</h2>
		<p class="text-neon-cyan font-mono">COMPETE. CREATE. CONQUER.</p>
	</div>

	<!-- Bento Grid -->
	<div class="grid h-[60vh] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each EVENTS as event, i}
			<div
				class={`group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 ${event.span}`}
			>
				<div class={`absolute mb-4 h-2 w-2 rounded-full ${event.color}`}></div>

				<div class="flex h-full flex-col justify-end">
					<h3 class="font-mono text-xs text-white/50">{event.category}</h3>
					<h2
						class="font-heading text-3xl font-bold text-white transition-colors group-hover:text-cyan-400"
					>
						{event.title}
					</h2>
				</div>
			</div>
		{/each}
	</div>
</div>
