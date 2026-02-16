<script lang="ts">
    import { Canvas } from "@threlte/core";
    import { WebGLRenderer } from "three";
    import Scene from "./Scene.svelte";
    import { scrollState } from "$lib/state/scrollState.svelte";

    // Only render canvas during zones that have 3D content
    const CANVAS_ZONES = ["HERO", "WARP", "ABOUT"];
    let isVisible = $derived(CANVAS_ZONES.includes(scrollState.activeZone));

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

{#if isVisible}
    <div class="canvas-container">
        <Canvas {createRenderer} toneMapping={4} colorSpace="srgb">
            <Scene />
        </Canvas>
    </div>
{/if}

<style>
    .canvas-container {
        position: fixed;
        inset: 0;
        z-index: var(--z-canvas, -1);
        pointer-events: none;
    }

    .canvas-container :global(canvas) {
        width: 100% !important;
        height: 100% !important;
    }
</style>
