<script lang="ts">
	import Hero from '$lib/components/sections/Hero.svelte';
	import WarpSpacer from '$lib/components/sections/WarpSpacer.svelte';
	import About from '$lib/components/sections/About.svelte';
	import GalleryReveal from '$lib/components/sections/GalleryReveal.svelte';
	import EventHighlights from '$lib/components/sections/EventHighlights.svelte';
	import Schedule from '$lib/components/sections/Schedule.svelte';
	import Team from '$lib/components/sections/Team.svelte';
	import Footer from '$lib/components/sections/Footer.svelte';
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
		<GalleryReveal />
	</section>

	<!-- 5. EVENTS: Black BG -->
	<section class="min-h-[100dvh] w-full bg-black">
		<EventHighlights />
	</section>

	<!-- 6. SCHEDULE: Black BG -->
	<section class="min-h-[100dvh] w-full bg-black">
		<Schedule />
	</section>

	<!-- 7. TEAM: Black BG -->
	<section class="min-h-[100dvh] w-full bg-black">
		<Team />
	</section>

	<!-- 8. FOOTER -->
	<Footer />
</div>
