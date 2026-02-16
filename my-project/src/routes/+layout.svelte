<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	// Core Engine
	import GhostScroller from '$lib/components/GhostScroller.svelte';
	import Canvas3D from '$lib/components/3d/Canvas3D.svelte';
	import Preloader from '$lib/components/ui/Preloader.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>UTKARSH 2026 | Virasat se VIKAS</title>
</svelte:head>

<!-- 1. The Preloader (Blocks everything until ready) -->
<Preloader />

<!-- 2. The Theater (Fixed 3D Background) -->
<Canvas3D />

<!-- 3. The Engine (Logic Only) -->
<GhostScroller />

<!-- 4. The Overlay (Scrollable DOM Content) -->
<!-- Uses standard HTML flow, but we might style it to be 'over' the canvas -->
<main class="relative z-10 min-h-[100dvh] w-full text-white">
	{@render children()}
</main>
