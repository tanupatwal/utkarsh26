<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import * as THREE from 'three';
	import { scrollState } from '$lib/state/scrollState.svelte.js';
	import { GALLERY_CONTENT } from '$lib/data/gallery';
	import ThickPanel from './ThickPanel.svelte';

	// Config matching Hasfilm
	const CYLINDER_RADIUS = 50;
	const CYLINDER_ARC = Math.PI * 0.4; // 72 degrees viewing arc
	const CAM_POS_END = new THREE.Vector3(0, -2, 60);

	let group = $state<THREE.Group>();
	let camera = $state<THREE.PerspectiveCamera>();
	const { camera: defaultCamera } = useThrelte();

	// Physics state for smooth rotation
	let smoothedRot = 0.2;

	// Light Color State
	let lightColor = new THREE.Color('#ffffff');

	// Dissolve references (Using Svelte 5 state for reactivity)
	let dissolveProgress = $state(0);

	useTask((delta) => {
		if (!group || !camera) return;

		// Map scroll progress to gallery timeline
		// Gallery Active Zone: 0.4 to 0.6 (Total 1000vh)
		// We normalize this to 0-1 for the internal gallery logic
		const start = 0.4;
		const end = 0.6;

		let localProgress = (scrollState.progress - start) / (end - start);
		// Clamp
		localProgress = Math.max(0, Math.min(1, localProgress));

		// Rotation Logic (Sticky Scroll)
		const totalItems = GALLERY_CONTENT.length;
		const angleStep = CYLINDER_ARC / totalItems;

		// Calculate target rotation based on scroll
		// 0 -> 0.2 (start)
		// 1 -> End of list

		const rawIndex = localProgress * (totalItems - 1);

		// Sticky/Snap effect
		const index = Math.floor(rawIndex);
		let frac = rawIndex - index;

		// Ease the fraction for snap effect
		if (frac < 0.5) {
			frac = 4 * frac * frac * frac;
		} else {
			frac = 1 - Math.pow(-2 * frac + 2, 3) / 2;
		}

		const stickyIndex = index + frac;
		const targetRot = 0.2 + stickyIndex * angleStep;

		// Damping
		smoothedRot += (targetRot - smoothedRot) * delta * 5;
		if (group) group.rotation.y = smoothedRot;

		// Dissolve Logic (Exit)
		// Start dissolving when nearing the end (0.9 to 1.0 of local progress)
		if (localProgress > 0.9) {
			dissolveProgress = (localProgress - 0.9) / 0.1;
		} else {
			dissolveProgress = 0;
		}

		// Camera Position (Zoom out slightly/move to position)
		if (camera) {
			camera.position.copy(CAM_POS_END);
			camera.lookAt(0, 0, 0);
		}

		// Dynamic Light Color
		// stickyIndex tells us which item is center.
		// We clamp it to [0, total-1]
		const colorIndex = Math.max(0, Math.min(totalItems - 1, Math.round(stickyIndex)));
		const targetColor = new THREE.Color(GALLERY_CONTENT[colorIndex].color);

		// Smoothly lerp current light color
		lightColor.lerp(targetColor, 0.05);
	});
</script>

<T.PerspectiveCamera
	makeDefault
	bind:ref={camera}
	position={[0, -2, 60]}
	fov={50}
	near={0.1}
	far={1000}
/>

<T.Group bind:ref={group}>
	{#each GALLERY_CONTENT as item, i}
		<ThickPanel
			url={item.url}
			index={i}
			total={GALLERY_CONTENT.length}
			radius={CYLINDER_RADIUS}
			dissolveProgress={i === GALLERY_CONTENT.length - 1 ? dissolveProgress : 0}
		/>
	{/each}
</T.Group>

<!-- Lighting -->
<!-- Main Key Light matching current item color -->
<T.PointLight position={[0, 0, 0]} intensity={3} color={lightColor} distance={25} />
<!-- Fill Light (constant or complementary?) -->
<T.PointLight position={[0, 5, 0]} intensity={1.5} color={lightColor} distance={60} />
