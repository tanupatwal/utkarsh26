<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let container: HTMLElement;

	const days = [
		{
			day: 'DAY 1',
			date: 'MARCH 14',
			events: ['Opening Ceremony', 'Hackathon Starts', 'EDM Night']
		},
		{ day: 'DAY 2', date: 'MARCH 15', events: ['Robo Wars', 'Esports Finals', 'Battle of Bands'] },
		{ day: 'DAY 3', date: 'MARCH 16', events: ['Hackathon Ends', 'Fashion Show', 'Star Night'] }
	];

	onMount(() => {
		ScrollTrigger.create({
			trigger: container,
			start: 'top center',
			end: 'bottom center',
			onEnter: () => (scrollState.activeZone = 'SCHEDULE'),
			onEnterBack: () => (scrollState.activeZone = 'SCHEDULE')
		});
	});
</script>

<div
	bind:this={container}
	class="schedule-section relative flex min-h-[100dvh] w-full flex-col justify-center bg-black px-4 py-24 md:px-24"
>
	<h2 class="font-heading mb-16 text-center text-[8vw] font-bold text-white/10">TIMELINE</h2>

	<div class="mx-auto flex w-full max-w-4xl flex-col gap-12">
		{#each days as day, i}
			<div class="flex flex-col gap-8 border-t border-white/20 pt-8 md:flex-row">
				<div class="md:w-1/3">
					<h3 class="text-4xl font-bold text-white">{day.day}</h3>
					<p class="font-mono text-cyan-400">{day.date}</p>
				</div>
				<div class="flex flex-col gap-4 md:w-2/3">
					{#each day.events as event}
						<div class="group flex cursor-pointer items-center gap-4">
							<div
								class="h-[1px] w-8 bg-cyan-400 bg-white/30 transition-all duration-300 group-hover:w-16"
							></div>
							<span class="text-xl text-white/80 transition-colors group-hover:text-white"
								>{event}</span
							>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
