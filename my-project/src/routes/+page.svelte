<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import WarpSpacer from '$lib/components/sections/WarpSpacer.svelte';
	import About from '$lib/components/sections/About.svelte';
	// import GalleryReveal from '$lib/components/sections/GalleryReveal.svelte';
</script>

<div class="relative w-full">
	<!-- 1. HERO: Black BG, fades out -->
	<section class="h-[100dvh] w-full bg-black">
		<Hero />
	</section>

	<!-- 2. WARP: Transparent BG, reveals 3D Tunnel -->
	<section class="pointer-events-none h-[100dvh] w-full bg-transparent">
		<WarpSpacer />
	</section>

	<!-- 3. ABOUT: Black BG, slides in -->
	<section class="min-h-[100dvh] w-full bg-black">
		<About />
	</section>

	<!-- 4. GALLERY: Transparent BG -->
	<section class="min-h-[200dvh] w-full bg-transparent">
		<!-- Spacer for gallery -->
		<div class="flex h-full items-center justify-center">
			<h2 class="text-4xl text-white/50">GALLERY ZONE (Coming Phase 4)</h2>
		</div>
	</section>
</div>
