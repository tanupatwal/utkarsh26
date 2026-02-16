<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { CatmullRomCurve3, Vector3, PerspectiveCamera } from 'three';
	import { scrollState } from '$lib/state/scrollState.svelte.js';

	// 1. Define the Cinematic Path (Tunnel Spine)
	// A spiral path that moves forward (-z) and twists slightly
	const points = [
		new Vector3(0, 0, 0), // Start (Hero)
		new Vector3(0, 0, -10),
		new Vector3(2, 2, -20), // Curve 1
		new Vector3(-2, 0, -30), // Curve 2
		new Vector3(0, -2, -40), // Curve 3
		new Vector3(0, 0, -50) // End (Team)
	];

	const curve = new CatmullRomCurve3(points);
	// smooth the curve
	curve.tension = 0.5;

	let camera: PerspectiveCamera;
	const { camera: defaultCamera } = useThrelte();

	// Temporary vectors to avoid garbage collection in the loop
	const pos = new Vector3();
	const lookAt = new Vector3();

	// 2. The Render Loop (The Heartbeat)
	useTask((delta) => {
		if (!camera) return;

		// A. Sync Camera Position to Scroll Progress
		// We Map 0-1 progress to the entire curve length
		// '0.999' prevents going out of bounds at the very end
		const t = Math.min(scrollState.progress, 0.999);

		// Get position at current 't'
		curve.getPointAt(t, pos);
		camera.position.copy(pos);

		// B. Upgrade A: "Look-Ahead" Logic
		// Look slightly ahead on the curve to create anticipation
		const lookAheadT = Math.min(t + 0.05, 1.0);
		curve.getPointAt(lookAheadT, lookAt);
		camera.lookAt(lookAt);

		// C. Upgrade C: "Warp" Effect (FOV)
		// Base FOV = 75. Max FOV = 100.
		// Velocity is usually small (0.01 - 0.1) but can spike to 10+
		// We clamp it or scale it reasonably.
		const targetFOV = 75 + Math.min(Math.abs(scrollState.velocity) * 2, 40);
		// Smoothly interpolate current FOV to target FOV for weight
		camera.fov += (targetFOV - camera.fov) * 0.1;
		camera.updateProjectionMatrix();

		// Debug: Update global state target for other components if needed
		scrollState.targetLookAt = lookAt;
	});
</script>

<!-- 3. The Camera -->
<T.PerspectiveCamera
	makeDefault
	bind:ref={camera}
	position={[0, 0, 0]}
	fov={75}
	near={0.1}
	far={1000}
>
	<!-- Child: AudioListener could go here -->
</T.PerspectiveCamera>

<!-- 4. Visual Debug Helper (The Tunnel Wireframe) -->
<!-- Just so we can SEE the movement before the real tunnel is built -->
<T.Mesh>
	<T.TubeGeometry args={[curve, 100, 2, 8, false]} />
	<T.MeshBasicMaterial color="white" wireframe opacity={0.1} transparent />
</T.Mesh>
