<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import Scene from './Scene.svelte';

	// We use the default render loop for now,
	// unless we want to strictly sync with GSAP ticker manual render.
	// For Phase 2 start, default is safer to ensure visibility.
</script>

<div class="fixed inset-0 -z-10 h-full w-full bg-black">
	<Canvas>
		<Scene />
	</Canvas>

	<div
		class="pointer-events-none absolute top-5 left-5 rounded bg-black/50 p-2 font-mono text-xs text-white"
	>
		<div>Progress: {scrollState.progress.toFixed(4)}</div>
		<div>Velocity: {scrollState.velocity.toFixed(4)}</div>
		<div>FOV: {scrollState.velocity > 0.01 ? 'WARPING' : 'Stable'}</div>
	</div>
</div>

<style>
	/* Ensure no pointer events block the DOM */
	div {
		pointer-events: none;
	}
</style>
