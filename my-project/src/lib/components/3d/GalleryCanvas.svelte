<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import GalleryScene from './gallery/GalleryScene.svelte';
</script>

<div class="fixed inset-0 z-0 h-full w-full">
	<Canvas>
		<T.AmbientLight intensity={0.5} />
		<GalleryScene />
	</Canvas>
</div>
