<script lang="ts">
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	let container: HTMLElement;
	let titleElement: HTMLElement;

	// Simple Scramble Logic without extra plugin weight
	function scrambleText(element: HTMLElement, finalText: string, duration: number) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
		const steps = duration * 60;
		let step = 0;

		const interval = setInterval(() => {
			step++;
			const progress = step / steps;
			const scrambled = finalText
				.split('')
				.map((char, index) => {
					if (index < finalText.length * progress) return char;
					return chars[Math.floor(Math.random() * chars.length)];
				})
				.join('');

			element.innerText = scrambled;

			if (step >= steps) {
				clearInterval(interval);
				element.innerText = finalText;
			}
		}, 16);
	}

	onMount(() => {
		// 1. Trigger Scramble on Load
		setTimeout(() => {
			scrambleText(titleElement, 'UTKARSH 2026', 1.5);
		}, 500);

		// 2. Fade Out ScrollTrigger
		gsap.to(container, {
			opacity: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				end: 'bottom top',
				scrub: true,
				onEnter: () => (scrollState.activeZone = 'HERO'),
				onEnterBack: () => (scrollState.activeZone = 'HERO')
			}
		});
	});
</script>

<div
	bind:this={container}
	class="hero-section flex h-full w-full flex-col items-center justify-center bg-black text-center"
>
	<div class="relative z-10">
		<h2 class="mb-4 font-mono text-sm tracking-[0.5em] text-cyan-400 opacity-80">
			VIRASAT SE VIKAS
		</h2>
		<h1
			bind:this={titleElement}
			class="font-heading text-[12vw] leading-none font-bold tracking-tighter text-white mix-blend-difference"
		>
			X#9_@K-0
		</h1>
		<div class="mt-8 flex gap-4">
			<button class="bg-white px-8 py-3 font-bold text-black transition-colors hover:bg-cyan-400">
				REGISTER
			</button>
		</div>
	</div>
</div>
