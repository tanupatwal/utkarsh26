<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { WebGLRenderer } from "three";
    import GalleryScene from "./GalleryScene.svelte";
    import { scrollState } from "$lib/state/scrollState.svelte";

    // Only render Gallery canvas during GALLERY zone
    let show = $derived(scrollState.activeZone === "GALLERY");

    function createRenderer(canvas: HTMLCanvasElement) {
        return new WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
        });
    }
</script>

{#if show}
    <div class="gallery-canvas-wrapper">
        <Canvas {createRenderer} toneMapping={4} colorSpace="srgb">
            <GalleryScene />
        </Canvas>
    </div>
{/if}

<style>
    .gallery-canvas-wrapper {
        position: fixed;
        inset: 0;
        z-index: var(--z-canvas, -1);
        pointer-events: none;
    }

    .gallery-canvas-wrapper :global(canvas) {
        width: 100% !important;
        height: 100% !important;
    }
</style>
