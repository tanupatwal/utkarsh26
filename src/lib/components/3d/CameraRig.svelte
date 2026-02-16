<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import { PerspectiveCamera } from "three";
    import { scrollState } from "$lib/state/scrollState.svelte";
    import { clamp, lerp } from "$lib/utils/easing";

    // Camera path: maps scroll progress → camera Z position
    // Canvas is active during HERO(0→0.1), WARP(0.1→0.2), ABOUT(0.2→0.3)
    // Total = 300dvh out of 1000dvh → progress 0→0.3
    const CAMERA_START_Z = 0;
    const CAMERA_END_Z = -150;
    const CAMERA_ACTIVE_START = 0; // progress start
    const CAMERA_ACTIVE_END = 0.3; // progress end

    // FOV settings
    const BASE_FOV = 75;
    const MAX_FOV_BOOST = 15;
    const FOV_VELOCITY_SCALE = 3;

    let camera: PerspectiveCamera;
    let currentFov = BASE_FOV;
    let currentZ = CAMERA_START_Z;

    const { invalidate } = useThrelte();

    // Per-frame camera update
    useTask((delta) => {
        if (!camera) return;

        // Map scroll progress to camera Z
        const p = scrollState.progress;
        const cameraProgress = clamp(
            (p - CAMERA_ACTIVE_START) /
                (CAMERA_ACTIVE_END - CAMERA_ACTIVE_START),
            0,
            1,
        );

        const targetZ =
            CAMERA_START_Z + (CAMERA_END_Z - CAMERA_START_Z) * cameraProgress;

        // Smooth lerp to avoid jitter (damping factor ~8)
        const dampFactor = 1 - Math.exp(-8 * delta);
        currentZ = lerp(currentZ, targetZ, dampFactor);

        camera.position.z = currentZ;
        camera.position.y = 0;
        camera.position.x = 0;

        // Look ahead along the path
        camera.lookAt(0, 0, currentZ - 10);

        // FOV warp based on velocity
        const velocity = Math.abs(scrollState.velocity);
        const fovBoost = clamp(velocity * FOV_VELOCITY_SCALE, 0, MAX_FOV_BOOST);
        const targetFov = BASE_FOV + fovBoost;
        currentFov = lerp(currentFov, targetFov, dampFactor);

        camera.fov = currentFov;
        camera.updateProjectionMatrix();

        invalidate();
    });
</script>

<T.PerspectiveCamera
    makeDefault
    fov={BASE_FOV}
    near={0.1}
    far={500}
    position.z={0}
    position.y={0}
    position.x={0}
    bind:ref={camera}
/>
