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
	<!-- 1. HERO (0.0 - 0.1) -->
	<section class="h-[100dvh] w-full bg-black">
		<Hero />
	</section>

	<!-- 2. WARP (0.1 - 0.3) -->
	<section class="pointer-events-none h-[200dvh] w-full bg-transparent">
		<WarpSpacer />
	</section>

	<!-- 3. ABOUT (0.3 - 0.4) -->
	<section class="min-h-[100dvh] w-full bg-black">
		<About />
	</section>

	<!-- 4. GALLERY (0.4 - 0.6) -->
	<section class="pointer-events-none min-h-[200dvh] w-full bg-transparent">
		<GalleryReveal />
	</section>

	<!-- 5. HIGHLIGHTS (0.6 - 0.7) -->
	<section class="min-h-[100dvh] w-full bg-black">
		<EventHighlights />
	</section>

	<!-- 6. SCHEDULE (0.7 - 0.8) -->
	<section class="min-h-[100dvh] w-full bg-black">
		<Schedule />
	</section>

	<!-- 7. TEAM (0.8 - 0.9) -->
	<section class="min-h-[100dvh] w-full bg-black">
		<Team />
	</section>

	<!-- 8. FOOTER -->
	<Footer />
</div>
