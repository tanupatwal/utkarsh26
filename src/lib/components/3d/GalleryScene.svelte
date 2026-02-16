<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import { FogExp2 } from "three";
    import { onMount, onDestroy } from "svelte";
    import GalleryGroup from "./GalleryGroup.svelte";

    // Set up scene fog
    const { scene } = useThrelte();

    onMount(() => {
        scene.fog = new FogExp2("#050505", 0.012);
    });

    onDestroy(() => {
        scene.fog = null;
    });
</script>

<!-- Ambient light for soft fill -->
<T.AmbientLight intensity={0.3} />

<!-- Gallery content -->
<GalleryGroup />
