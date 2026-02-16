<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { DefaultLoadingManager } from 'three';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import gsap from 'gsap';

	let progress = $state(0);
	let visible = $state(true);
	let tweenVal = { p: 0 }; // Local object for GSAP to tween

	onMount(() => {
		// 1. Hook into Three.js DefaultLoadingManager
		DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
			const target = itemsLoaded / itemsTotal;
			gsap.to(tweenVal, {
				p: target,
				duration: 0.5,
				ease: 'power2.out',
				onUpdate: () => {
					progress = tweenVal.p;
				},
				onComplete: () => {
					if (progress >= 1) completeLoading();
				}
			});
		};

		// Failsafe: If nothing to load, complete after 1s
		const failsafe = setTimeout(() => {
			// If no items have started loading (Three.js manager hasn't fired)
			if (progress === 0) {
				completeLoading();
			}
		}, 1500);

		return () => clearTimeout(failsafe);
	});

	function completeLoading() {
		if (scrollState.isLoaded) return;

		// minimum load time for branding visibility
		setTimeout(() => {
			// Animate out
			gsap.to('.preloader', {
				yPercent: -100,
				duration: 1.0,
				ease: 'expo.inOut',
				onComplete: () => {
					scrollState.isLoaded = true;
					visible = false;
				}
			});
		}, 1000);
	}
</script>

{#if visible}
	<div
		class="preloader fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
	>
		<h1 class="text-[12vw] leading-none font-bold tracking-tighter">UTKARSH</h1>
		<div class="mt-4 flex items-center gap-4">
			<div class="h-[1px] w-24 bg-white/20">
				<div
					class="h-full bg-white transition-all duration-100 ease-linear"
					style="width: {progress * 100}%"
				></div>
			</div>
			<span class="font-mono text-xs">{(progress * 100).toFixed(0)}%</span>
		</div>
	</div>
{/if}
