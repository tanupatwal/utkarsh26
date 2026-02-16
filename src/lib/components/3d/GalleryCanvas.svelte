<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { WebGLRenderer } from "three";
    import GalleryScene from "./GalleryScene.svelte";
    import { scrollState } from "$lib/state/scrollState.svelte";

    // Show gallery canvas during GALLERY zone + a bit after for the pullback fade
    let show = $derived(
        scrollState.activeZone === "GALLERY" ||
            scrollState.galleryCanvasOpacity > 0,
    );

    let canvasOpacity = $derived(scrollState.galleryCanvasOpacity);

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
    <div class="gallery-canvas-wrapper" style="opacity: {canvasOpacity};">
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
        transition: opacity 0.1s linear;
        will-change: opacity;
    }

    .gallery-canvas-wrapper :global(canvas) {
        width: 100% !important;
        height: 100% !important;
    }
</style>
