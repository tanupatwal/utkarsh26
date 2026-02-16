<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	// Props
	export let url: string;
	export let index: number;
	export let total: number;
	export let radius: number;
	export let thickness: number = 2;
	export let gap: number = 0.05;
	export let dissolveProgress: number = 0; // 0 to 1

	// Constants matching Hasfilm config
	const CYLINDER_HEIGHT = 12;
	const CYLINDER_ARC = Math.PI * 0.4; // 72 degrees

	// Derived values for geometry
	const angleStep = CYLINDER_ARC / total;
	const panelAngle = angleStep - gap;
	const GALLERY_START_ROTATION = 0.2;
	const thetaStart = -GALLERY_START_ROTATION - index * angleStep - panelAngle / 2;

	// Texture Loading
	const texture = useTexture(url, {
		transform: (tex) => {
			tex.wrapS = THREE.ClampToEdgeWrapping;
			tex.wrapT = THREE.ClampToEdgeWrapping;
			tex.repeat.set(1, 1);
			return tex;
		}
	});

	// --- DISSOLVE SHADER ---
	const vertexShader = `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	const fragmentShader = `
		uniform sampler2D uTexture;
		uniform float uDissolve;
		uniform float uBaseOpacity;
		uniform float uIsReflection; // 0.0 or 1.0
		varying vec2 vUv;

		// Hash function
		float hash(vec2 p) {
			p = fract(p * vec2(443.8975, 397.2973));
			p += dot(p, p.yx + 19.19);
			return fract(p.x * p.y);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			f = f * f * (3.0 - 2.0 * f);
			float a = hash(i);
			float b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0));
			float d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
		}

		float fbm(vec2 p) {
			float val = 0.0;
			float amp = 0.5;
			for (int i = 0; i < 4; i++) {
				val += amp * noise(p);
				p *= 2.0;
				amp *= 0.5;
			}
			return val;
		}

		void main() {
			vec4 texColor = texture2D(uTexture, vUv);

			if (uDissolve <= 0.0) {
				gl_FragColor = vec4(texColor.rgb, uBaseOpacity);
				return;
			}

			// Dissolve mask: left side goes first
			float noiseVal = fbm(vUv * 8.0);
			float sweep = uDissolve * 1.6 - 0.1;
			float mask = vUv.x + noiseVal * 0.3;

			if (mask < sweep) {
				discard;
			}

			// Edge glow
			float edgeDist = mask - sweep;
			float edgeWidth = 0.06;
			float glowStrength = mix(0.8, 0.3, uIsReflection);

			if (edgeDist < edgeWidth) {
				float edgeT = 1.0 - (edgeDist / edgeWidth);
				edgeT = edgeT * edgeT;
				vec3 glowColor = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 1.0, 1.0), edgeT * 0.5);
				texColor.rgb = mix(texColor.rgb, glowColor, edgeT * glowStrength);
			}

			gl_FragColor = vec4(texColor.rgb, uBaseOpacity);
		}
	`;

	// Uniforms for shaders
	// We use accessors or reactive statements to update uniforms
	let uniformsFront = {
		uTexture: { value: null as any },
		uDissolve: { value: 0 },
		uBaseOpacity: { value: 1.0 },
		uIsReflection: { value: 0.0 }
	};

	let uniformsReflection = {
		uTexture: { value: null as any },
		uDissolve: { value: 0 },
		uBaseOpacity: { value: 0.3 },
		uIsReflection: { value: 1.0 }
	};

	// Reactive updates for texture and dissolve
	$: if ($texture) {
		uniformsFront.uTexture.value = $texture;
		uniformsReflection.uTexture.value = $texture;
	}
	$: {
		uniformsFront.uDissolve.value = dissolveProgress;
		uniformsReflection.uDissolve.value = dissolveProgress;
	}
</script>

<T.Group>
	<!-- Front Face -->
	<T.Mesh>
		<T.CylinderGeometry
			args={[radius, radius, CYLINDER_HEIGHT, 32, 1, true, thetaStart, angleStep]}
		/>
		{#if $texture}
			<T.ShaderMaterial
				{vertexShader}
				{fragmentShader}
				uniforms={uniformsFront}
				side={THREE.DoubleSide}
				transparent
			/>
		{:else}
			<T.MeshBasicMaterial color="gray" wireframe />
		{/if}
	</T.Mesh>

	<!-- Floor Reflection -->
	<T.Mesh position={[0, -CYLINDER_HEIGHT + 0.1, 0]} scale={[1, -1, 1]}>
		<T.CylinderGeometry
			args={[radius, radius, CYLINDER_HEIGHT, 32, 1, true, thetaStart, angleStep]}
		/>
		{#if $texture}
			<T.ShaderMaterial
				{vertexShader}
				{fragmentShader}
				uniforms={uniformsReflection}
				side={THREE.DoubleSide}
				transparent
				blending={THREE.AdditiveBlending}
			/>
		{/if}
	</T.Mesh>

	<!-- We can add Casing/Thickness meshes here if needed for full fidelity -->
	<!-- For now focusing on the image panels as they are the primary visual -->
</T.Group>
