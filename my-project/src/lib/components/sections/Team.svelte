<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let container: HTMLElement;

	const teamMembers = [
		{ name: 'ADITYA', role: 'TECH LEAD' },
		{ name: 'TANU', role: 'DESIGN LEAD' },
		{ name: 'RISHABH', role: 'EVENT HEAD' },
		{ name: 'SHREYA', role: 'PR MANAGER' }
	];

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

	<div class="grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
		{#each teamMembers as member}
			<div
				class="group relative border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
			>
				<h3
					class="font-heading text-4xl font-bold text-white transition-colors group-hover:text-cyan-400"
				>
					{member.name}
				</h3>
				<p class="mt-2 font-mono text-sm text-white/60">{member.role}</p>

				<!-- Corner accent -->
				<div
					class="absolute top-0 right-0 h-4 w-4 border-t border-r border-cyan-400 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
			</div>
		{/each}
	</div>
</div>
