<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let container: HTMLElement;

	import { TEAM } from '$lib/data/team';

	onMount(() => {
		ScrollTrigger.create({
			trigger: container,
			start: 'top center',
			end: 'bottom center',
			onEnter: () => (scrollState.activeZone = 'TEAM'), // Should add 'TEAM' to types if not present
			onEnterBack: () => (scrollState.activeZone = 'TEAM')
		});
	});
</script>

<div
	bind:this={container}
	class="team-section relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black py-24"
>
	<h2 class="font-heading mb-16 text-[5vw] text-white opacity-20">THE CORE</h2>

	<div class="grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3">
		{#each TEAM as member}
			<div
				class="group relative border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
			>
				<!-- Image -->
				<div
					class="mb-6 aspect-square w-full overflow-hidden rounded-sm bg-gray-900 grayscale transition-all duration-500 group-hover:grayscale-0"
				>
					<img src={member.image} alt={member.name} class="h-full w-full object-cover" />
				</div>

				<h3
					class="font-heading text-2xl font-bold text-white transition-colors group-hover:text-cyan-400"
				>
					{member.name}
				</h3>
				<p class="mt-2 font-mono text-sm text-white/60">{member.role}</p>

				<!-- Socials -->
				<div
					class="mt-4 flex gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				>
					<!-- Github Icon (Simple SVG) -->
					<a href="#" class="text-white/50 hover:text-white">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
							/></svg
						>
					</a>
					<!-- Linkedin (Simple SVG) -->
					<a href="#" class="text-white/50 hover:text-white">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"
							><path
								d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
							/></svg
						>
					</a>
				</div>

				<!-- Corner accent -->
				<div
					class="absolute top-0 right-0 h-4 w-4 border-t border-r border-cyan-400 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
			</div>
		{/each}
	</div>
</div>
