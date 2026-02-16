<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import TunnelScene from './tunnel/TunnelScene.svelte';
</script>

<div class="fixed inset-0 -z-10 h-full w-full bg-black">
	<Canvas>
		<TunnelScene />
	</Canvas>

	<div
		class="pointer-events-none absolute top-5 left-5 rounded bg-black/50 p-2 font-mono text-xs text-white"
	>
		<div>Zone: {scrollState.activeZone}</div>
		<div>Progress: {scrollState.progress.toFixed(4)}</div>
		<div>Velocity: {scrollState.velocity.toFixed(4)}</div>
	</div>
</div>
