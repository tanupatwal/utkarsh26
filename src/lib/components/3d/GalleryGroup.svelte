<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import {
        Group,
        Color,
        FogExp2,
        MeshBasicMaterial,
        MathUtils,
        BackSide,
        type PointLight,
    } from "three";
    import { onMount } from "svelte";
    import { scrollState } from "$lib/state/scrollState.svelte";
    import { GALLERY_CONTENT } from "$lib/data/gallery";
    import ThickPanel from "./ThickPanel.svelte";
    import { clamp } from "$lib/utils/easing";

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    const CYLINDER_RADIUS = 50;
    const CYLINDER_HEIGHT = 12;
    const CYLINDER_ARC = Math.PI * 0.8;
    const GALLERY_START_ROTATION = 0.2;

    // Scroll progress ranges (within our 1000dvh page)
    // Gallery section is at ~30-50% progress (200dvh out of 1000dvh)
    const GALLERY_ZONE_START = 0.3; // Where gallery section begins
    const TRANSITION_END = 0.34; // Camera arrives at viewing position
    const VIEW_START = 0.34; // Panel viewing begins
    const VIEW_END = 0.46; // Last panel reached
    const DISSOLVE_START = 0.47; // Dissolve begins
    const DISSOLVE_END = 0.49; // Dissolve complete
    const POST_DISSOLVE = 0.5; // Gallery hidden

    // Camera positions
    const CAM_START = { x: 0, y: 0, z: 0 };
    const CAM_END = { x: 0, y: -2, z: 60 };

    // ============================================================================
    // STATE
    // ============================================================================

    const totalItems = GALLERY_CONTENT.length;
    const angleStep = CYLINDER_ARC / totalItems;

    let groupRef: Group | undefined = $state();
    let pointLightRef: PointLight | undefined = $state();
    let ambientLightRef: PointLight | undefined = $state();
    let glowMaterialRef: MeshBasicMaterial | undefined = $state();

    let smoothedRot = GALLERY_START_ROTATION;
    let dissolveProgress1 = $state(0); // last panel
    let dissolveProgress2 = $state(0); // second-to-last panel
    let isVisible = $state(false);
    let currentPanelIndex = $state(0);

    // Ambient color system
    const dominantColors = GALLERY_CONTENT.map(
        (item) => new Color(item.dominantColor),
    );
    const currentAmbientColor = new Color(0.4, 0.4, 1.0);
    const currentFogColor = new Color("#050505");

    // ============================================================================
    // HELPERS
    // ============================================================================

    const { scene, camera, invalidate } = useThrelte();

    function smoothstep(t: number): number {
        return t * t * (3 - 2 * t);
    }

    function updateAmbientColors(rawIndex: number) {
        const colorIndex = Math.max(
            0,
            Math.min(Math.round(rawIndex), totalItems - 1),
        );
        const targetColor = dominantColors[colorIndex];
        if (!targetColor) return;

        const dampFactor = 1 - Math.exp(-2.5 * (1 / 60));
        currentAmbientColor.lerp(targetColor, dampFactor);

        if (pointLightRef) {
            pointLightRef.color.copy(currentAmbientColor);
        }
        if (ambientLightRef) {
            ambientLightRef.color.copy(currentAmbientColor);
        }

        // Tint fog with ambient color
        if (scene.fog && scene.fog instanceof FogExp2) {
            const base = new Color("#050505");
            const tinted = base.clone().lerp(currentAmbientColor, 0.12);
            currentFogColor.lerp(tinted, dampFactor);
            scene.fog.color.copy(currentFogColor);
        }

        if (glowMaterialRef) {
            glowMaterialRef.color.copy(currentAmbientColor);
        }
    }

    // ============================================================================
    // PER-FRAME UPDATE
    // ============================================================================

    useTask(() => {
        const r = scrollState.progress;

        // Visibility check
        const shouldBeVisible =
            r >= GALLERY_ZONE_START - 0.02 && r < POST_DISSOLVE;
        isVisible = shouldBeVisible;
        if (!isVisible || !groupRef) return;

        // Set fog
        if (scene.fog && scene.fog instanceof FogExp2) {
            if (r > POST_DISSOLVE - 0.01) {
                scene.fog.density = 0;
            } else if (r >= GALLERY_ZONE_START) {
                scene.fog.density = 0.012;
            }
        }

        // ── TRANSITION PHASE: Camera flies to viewing position ──
        if (r >= GALLERY_ZONE_START && r < TRANSITION_END) {
            const t =
                (r - GALLERY_ZONE_START) /
                (TRANSITION_END - GALLERY_ZONE_START);
            const eased = smoothstep(clamp(t, 0, 1));

            camera.current.position.set(
                MathUtils.lerp(CAM_START.x, CAM_END.x, eased),
                MathUtils.lerp(CAM_START.y, CAM_END.y, eased),
                MathUtils.lerp(CAM_START.z, CAM_END.z, eased),
            );

            const scale = MathUtils.lerp(0.8, 1, eased);
            groupRef.scale.setScalar(scale);

            const transitionRot = eased * GALLERY_START_ROTATION;
            groupRef.rotation.y = transitionRot;
            smoothedRot = transitionRot;

            dissolveProgress1 = 0;
            dissolveProgress2 = 0;

            if (pointLightRef) pointLightRef.intensity = 3;
            if (ambientLightRef) ambientLightRef.intensity = 1.5;

            currentPanelIndex = 0;
        }
        // ── VIEWING PHASE: Rotate through panels ──
        else if (r >= VIEW_START && r < VIEW_END) {
            camera.current.position.set(CAM_END.x, CAM_END.y, CAM_END.z);
            groupRef.scale.setScalar(1);

            const rotProgress = (r - VIEW_START) / (VIEW_END - VIEW_START);
            const rawIndex = Math.max(
                0,
                Math.min(rotProgress * totalItems - 0.5, totalItems - 1),
            );
            const snapIndex = Math.min(Math.floor(rawIndex), totalItems - 2);
            let frac = snapIndex >= 0 ? rawIndex - snapIndex : 0;

            if (rawIndex >= totalItems - 1) frac = 0;

            // Sticky cubic easing
            if (frac < 0.5) {
                frac = 4 * frac * frac * frac;
            } else {
                frac = 1 - Math.pow(-2 * frac + 2, 3) / 2;
            }

            const stickyIndex =
                rawIndex >= totalItems - 1 ? totalItems - 1 : snapIndex + frac;
            const stickyRot = GALLERY_START_ROTATION + stickyIndex * angleStep;

            smoothedRot = MathUtils.damp(smoothedRot, stickyRot, 5, 1 / 60);
            groupRef.rotation.y = smoothedRot;

            dissolveProgress1 = 0;
            dissolveProgress2 = 0;

            if (pointLightRef) pointLightRef.intensity = 3;
            if (ambientLightRef) ambientLightRef.intensity = 1.5;

            currentPanelIndex = Math.round(rawIndex);
            updateAmbientColors(rawIndex);
        }
        // ── PAUSE PHASE: Last panel dwells ──
        else if (r >= VIEW_END && r < DISSOLVE_START) {
            const lastPanelRot =
                GALLERY_START_ROTATION + (totalItems - 1) * angleStep;
            smoothedRot = MathUtils.damp(smoothedRot, lastPanelRot, 5, 1 / 60);
            groupRef.rotation.y = smoothedRot;

            dissolveProgress1 = 0;
            dissolveProgress2 = 0;

            if (pointLightRef) pointLightRef.intensity = 3;
            if (ambientLightRef) ambientLightRef.intensity = 1.5;

            currentPanelIndex = totalItems - 1;
            updateAmbientColors(totalItems - 1);
        }
        // ── DISSOLVE PHASE ──
        else if (r >= DISSOLVE_START && r < DISSOLVE_END) {
            const lastPanelRot =
                GALLERY_START_ROTATION + (totalItems - 1) * angleStep;
            smoothedRot = MathUtils.damp(smoothedRot, lastPanelRot, 5, 1 / 60);
            groupRef.rotation.y = smoothedRot;

            const dissolveT = clamp(
                (r - DISSOLVE_START) / (DISSOLVE_END - DISSOLVE_START),
                0,
                1,
            );
            const eased =
                dissolveT < 0.5
                    ? 2 * dissolveT * dissolveT
                    : 1 - Math.pow(-2 * dissolveT + 2, 2) / 2;

            dissolveProgress1 = eased;

            // Second-to-last: delayed, caps at ~40%
            const delay2 = 0.35;
            const raw2 = Math.max(0, (dissolveT - delay2) / (1 - delay2));
            dissolveProgress2 = Math.min(0.4, raw2 * 0.6);

            // Camera zoom toward panels
            const zoomT = dissolveT * dissolveT * dissolveT;
            const targetZ = MathUtils.lerp(CAM_END.z, 50, zoomT);
            camera.current.position.set(CAM_END.x, CAM_END.y, targetZ);

            // Fade lights
            const lightFade = dissolveT * dissolveT * dissolveT;
            if (pointLightRef)
                pointLightRef.intensity = MathUtils.lerp(3, 0, lightFade);
            if (ambientLightRef)
                ambientLightRef.intensity = MathUtils.lerp(1.5, 0, lightFade);

            currentPanelIndex = totalItems - 1;
            updateAmbientColors(totalItems - 1);
        }
        // ── POST-DISSOLVE ──
        else if (r >= DISSOLVE_END) {
            dissolveProgress1 = 1;
            dissolveProgress2 = 0.4;

            camera.current.position.set(CAM_END.x, CAM_END.y, 50);
            if (pointLightRef) pointLightRef.intensity = 0;
            if (ambientLightRef) ambientLightRef.intensity = 0;
        }

        camera.current.lookAt(0, 0, 0);
        invalidate();
    });
</script>

{#if isVisible}
    <T.Group bind:ref={groupRef}>
        <!-- Gallery Panels -->
        {#each GALLERY_CONTENT as item, i}
            <ThickPanel
                url={item.url}
                index={i}
                total={totalItems}
                radius={CYLINDER_RADIUS}
                arc={CYLINDER_ARC}
                height={CYLINDER_HEIGHT}
                dissolveProgress={i === totalItems - 1
                    ? dissolveProgress1
                    : i === totalItems - 2
                      ? dissolveProgress2
                      : 0}
            />
        {/each}

        <!-- Inner Glow — Dynamic ambient color from focused image -->
        <T.PointLight
            bind:ref={pointLightRef}
            position={[0, 0, 0]}
            intensity={3}
            color="#6666ff"
            distance={25}
        />

        <!-- Secondary Ambient Fill Light -->
        <T.PointLight
            bind:ref={ambientLightRef}
            position={[0, 5, 0]}
            intensity={1.5}
            color="#6666ff"
            distance={60}
        />

        <!-- Ambient Glow Sphere -->
        <T.Mesh>
            <T.SphereGeometry args={[CYLINDER_RADIUS * 0.75, 32, 32]} />
            <T.MeshBasicMaterial
                bind:ref={glowMaterialRef}
                color="#6666ff"
                transparent
                opacity={0.025}
                side={BackSide}
            />
        </T.Mesh>

        <!-- Reflection Occluder -->
        <T.Mesh position.y={-CYLINDER_HEIGHT - 0.2}>
            <T.CylinderGeometry
                args={[
                    CYLINDER_RADIUS - 0.1,
                    CYLINDER_RADIUS - 0.1,
                    CYLINDER_HEIGHT,
                    64,
                    1,
                    true,
                ]}
            />
            <T.MeshBasicMaterial color="#000000" side={2} />
        </T.Mesh>
    </T.Group>
{/if}
