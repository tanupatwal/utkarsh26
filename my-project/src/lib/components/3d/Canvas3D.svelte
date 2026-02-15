<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { onMount } from 'svelte';
	import { scrollState } from '$lib/state/scrollState.svelte.js';

	// We will implement the actual scene later
	// For now, this is the container
</script>

<div class="fixed inset-0 -z-10 h-full w-full bg-black">
	<Canvas>
		<!-- Scene will go here -->
	</Canvas>
	<div class="absolute top-5 left-5 rounded bg-black/50 p-2 text-white">
		Debug: Progress {scrollState.progress.toFixed(3)} | Velocity {scrollState.velocity.toFixed(3)}
	</div>
</div>

<style>
	/* Ensure no pointer events block the DOM */
	div {
		pointer-events: none;
	}
</style>
