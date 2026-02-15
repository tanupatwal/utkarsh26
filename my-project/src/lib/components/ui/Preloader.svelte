<script lang="ts">
	import { scrollState } from '$lib/state/scrollState.svelte.js';
</script>

{#if !scrollState.isLoaded}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
		<h1 class="animate-pulse text-4xl font-bold">LOADING...</h1>
		<button
			class="pointer-events-auto mt-4 rounded border border-white px-4 py-2 transition-colors hover:bg-white hover:text-black"
			onclick={() => (scrollState.isLoaded = true)}
		>
			Enter Experience (Debug)
		</button>
	</div>
{/if}
