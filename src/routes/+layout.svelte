<script lang="ts">
	import "./layout.css";
	import GhostScroller from "$lib/components/ui/GhostScroller.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>UTKARSH 2026 — Virasat se VIKAS</title>
	<meta
		name="description"
		content="UTKARSH 2026 — The annual cultural & technical festival of Dr. Akhilesh Das Gupta Institute of Professional Studies. Evolution Through Heritage."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Scroll engine (invisible) -->
<GhostScroller />

<!-- 3D Canvas will be mounted here in Phase 2 -->
<!-- <Canvas3D /> -->

<!-- DOM Content -->
{@render children()}
