<script lang="ts">
    import { T, useTask } from "@threlte/core";
    import {
        MeshBasicMaterial,
        MeshStandardMaterial,
        ShaderMaterial,
        TextureLoader,
        ClampToEdgeWrapping,
        LinearFilter,
        SRGBColorSpace,
        DoubleSide,
        AdditiveBlending,
        type Texture,
    } from "three";
    import { onMount, onDestroy } from "svelte";

    // ============================================================================
    // PROPS
    // ============================================================================

    interface Props {
        url: string;
        index: number;
        total: number;
        radius: number;
        arc: number;
        height: number;
        gap?: number;
        thickness?: number;
        dissolveProgress?: number;
    }

    let {
        url,
        index,
        total,
        radius,
        arc,
        height,
        gap = 0.008,
        thickness = 2,
        dissolveProgress = 0,
    }: Props = $props();

    // ============================================================================
    // DISSOLVE SHADER
    // ============================================================================

    const dissolveVertexShader = /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

    const dissolveFragmentShader = /* glsl */ `
		uniform sampler2D uTexture;
		uniform float uDissolve;
		uniform float uBaseOpacity;
		uniform float uIsReflection;
		varying vec2 vUv;

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

			float noiseVal = fbm(vUv * 8.0);
			float sweep = uDissolve * 1.6 - 0.1;
			float mask = vUv.x + noiseVal * 0.3;

			if (mask < sweep) {
				discard;
			}

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

    // ============================================================================
    // DERIVED GEOMETRY CALCULATIONS
    // ============================================================================

    const GALLERY_START_ROTATION = 0.2;
    const angleStep = $derived(arc / total);
    const panelAngle = $derived(angleStep - gap);
    const thetaStart = $derived(
        -GALLERY_START_ROTATION - index * angleStep - panelAngle / 2,
    );
    const useDissolve = $derived(index >= total - 2);

    // ============================================================================
    // MATERIALS & STATE
    // ============================================================================

    let texture: Texture | undefined = $state();

    const frontMaterial = new MeshBasicMaterial({
        side: DoubleSide,
        toneMapped: false,
    });

    const casingMaterial = new MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.7,
        metalness: 0.2,
    });

    const reflectionMaterial = new MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        side: DoubleSide,
        blending: AdditiveBlending,
    });

    let dissolveFrontMaterial: ShaderMaterial | undefined = $state();
    let dissolveReflectionMaterial: ShaderMaterial | undefined = $state();

    // ============================================================================
    // DERIVED: side cap positions
    // ============================================================================

    const leftCapPos = $derived.by(() => {
        const x = (radius - thickness / 2) * Math.sin(thetaStart);
        const z = (radius - thickness / 2) * Math.cos(thetaStart);
        return [x, 0, z] as [number, number, number];
    });

    const rightCapPos = $derived.by(() => {
        const x = (radius - thickness / 2) * Math.sin(thetaStart + panelAngle);
        const z = (radius - thickness / 2) * Math.cos(thetaStart + panelAngle);
        return [x, 0, z] as [number, number, number];
    });

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    onMount(() => {
        // Create dissolve materials if this panel needs them (last 2 panels)
        if (index >= total - 2) {
            dissolveFrontMaterial = new ShaderMaterial({
                vertexShader: dissolveVertexShader,
                fragmentShader: dissolveFragmentShader,
                uniforms: {
                    uTexture: { value: null },
                    uDissolve: { value: 0.0 },
                    uBaseOpacity: { value: 1.0 },
                    uIsReflection: { value: 0.0 },
                },
                side: DoubleSide,
                transparent: true,
            });

            dissolveReflectionMaterial = new ShaderMaterial({
                vertexShader: dissolveVertexShader,
                fragmentShader: dissolveFragmentShader,
                uniforms: {
                    uTexture: { value: null },
                    uDissolve: { value: 0.0 },
                    uBaseOpacity: { value: 0.3 },
                    uIsReflection: { value: 1.0 },
                },
                side: DoubleSide,
                transparent: true,
                blending: AdditiveBlending,
            });
        }

        // Load texture
        const loader = new TextureLoader();
        loader.load(url, (tex) => {
            tex.wrapS = ClampToEdgeWrapping;
            tex.wrapT = ClampToEdgeWrapping;
            tex.minFilter = LinearFilter;
            tex.magFilter = LinearFilter;
            tex.colorSpace = SRGBColorSpace;
            texture = tex;

            frontMaterial.map = tex;
            frontMaterial.needsUpdate = true;

            reflectionMaterial.map = tex;
            reflectionMaterial.needsUpdate = true;

            if (dissolveFrontMaterial) {
                dissolveFrontMaterial.uniforms.uTexture.value = tex;
            }
            if (dissolveReflectionMaterial) {
                dissolveReflectionMaterial.uniforms.uTexture.value = tex;
            }
        });
    });

    onDestroy(() => {
        texture?.dispose();
        frontMaterial.dispose();
        casingMaterial.dispose();
        reflectionMaterial.dispose();
        dissolveFrontMaterial?.dispose();
        dissolveReflectionMaterial?.dispose();
    });

    // Update dissolve uniforms each frame
    useTask(() => {
        if (!dissolveFrontMaterial || !dissolveReflectionMaterial) return;
        dissolveFrontMaterial.uniforms.uDissolve.value = dissolveProgress;
        dissolveReflectionMaterial.uniforms.uDissolve.value = dissolveProgress;
    });
</script>

<T.Group>
    <!-- FRONT FACE (Image) -->
    <T.Mesh>
        <T.CylinderGeometry
            args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
        />
        {#if useDissolve && dissolveFrontMaterial}
            <T is={dissolveFrontMaterial} />
        {:else}
            <T is={frontMaterial} />
        {/if}
    </T.Mesh>

    <!-- SATIN FINISH OVERLAY (skip on dissolving panels) -->
    {#if !useDissolve}
        <T.Mesh>
            <T.CylinderGeometry
                args={[
                    radius + 0.05,
                    radius + 0.05,
                    height,
                    32,
                    1,
                    true,
                    thetaStart,
                    panelAngle,
                ]}
            />
            <T.MeshPhysicalMaterial
                transparent
                opacity={0.1}
                roughness={0.6}
                metalness={0.1}
                clearcoat={0.5}
                clearcoatRoughness={0.4}
                side={DoubleSide}
            />
        </T.Mesh>
    {/if}

    <!-- BACK FACE (Casing) -->
    <T.Mesh>
        <T.CylinderGeometry
            args={[
                radius - thickness,
                radius - thickness,
                height,
                32,
                1,
                true,
                thetaStart,
                panelAngle,
            ]}
        />
        <T is={casingMaterial} />
    </T.Mesh>

    <!-- TOP CAP -->
    <T.Mesh position.y={height / 2} rotation.x={Math.PI / 2}>
        <T.RingGeometry
            args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
        />
        <T is={casingMaterial} />
    </T.Mesh>

    <!-- BOTTOM CAP -->
    <T.Mesh position.y={-height / 2} rotation.x={Math.PI / 2}>
        <T.RingGeometry
            args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
        />
        <T is={casingMaterial} />
    </T.Mesh>

    <!-- LEFT SIDE CAP -->
    <T.Mesh position={leftCapPos} rotation.y={thetaStart}>
        <T.BoxGeometry args={[0.1, height, thickness]} />
        <T is={casingMaterial} />
    </T.Mesh>

    <!-- RIGHT SIDE CAP -->
    <T.Mesh position={rightCapPos} rotation.y={thetaStart + panelAngle}>
        <T.BoxGeometry args={[0.1, height, thickness]} />
        <T is={casingMaterial} />
    </T.Mesh>

    <!-- REFLECTION (Floor) -->
    <T.Mesh position.y={-height - 0.1} scale.y={-1}>
        <T.CylinderGeometry
            args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
        />
        {#if useDissolve && dissolveReflectionMaterial}
            <T is={dissolveReflectionMaterial} />
        {:else}
            <T is={reflectionMaterial} />
        {/if}
    </T.Mesh>
</T.Group>
