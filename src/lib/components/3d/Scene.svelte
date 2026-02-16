<script lang="ts">
    import { T } from "@threlte/core";
    import CameraRig from "./CameraRig.svelte";
    import Tunnel from "./Tunnel.svelte";
</script>

<!-- Fog: dark blue-black, provides depth -->
<T.Fog attach="fog" args={["#050515", 15, 80]} />

<!-- Ambient fill -->
<T.AmbientLight intensity={0.5} />

<!-- Key spotlight: cool white from above-left -->
<T.SpotLight
    position={[-10, 20, 10]}
    angle={0.6}
    penumbra={0.5}
    intensity={1.5}
    color="#e0e0ff"
/>

<!-- Fill spotlight: blue-tinted from right -->
<T.SpotLight
    position={[10, 5, 20]}
    angle={0.4}
    penumbra={1}
    intensity={1}
    color="#a0a0ff"
/>

<!-- Tunnel glow point light near origin -->
<T.PointLight
    position={[0, 0, 10]}
    intensity={1.5}
    color="#4deeea"
    distance={30}
    decay={2}
/>

<!-- Camera -->
<CameraRig />

<!-- Tunnel (ribbons + image tiles) -->
<Tunnel />
