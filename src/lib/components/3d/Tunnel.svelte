<script lang="ts">
    import { T, useTask, useThrelte } from "@threlte/core";
    import {
        Object3D,
        PlaneGeometry,
        MeshBasicMaterial,
        InstancedMesh,
        Mesh,
        Group,
        DynamicDrawUsage,
        AdditiveBlending,
        DoubleSide,
        TextureLoader,
        ClampToEdgeWrapping,
        LinearFilter,
        SRGBColorSpace,
        MathUtils,
        type Texture,
    } from "three";
    import { onMount, onDestroy } from "svelte";
    import { scrollState } from "$lib/state/scrollState.svelte";
    import { clamp } from "$lib/utils/easing";

    // ============================================================================
    // CONFIGURATION (ported from hasfilm TunnelGroup.tsx)
    // ============================================================================

    const TILE_COUNT = 24;
    const TILE_SPAWN_Z_MIN = -200;
    const TILE_SPAWN_Z_MAX = -80;
    const TILE_PASS_Z = 20;

    const RIBBON_COUNT = 100;
    const TUNNEL_RADIUS = 12;
    const TUNNEL_LENGTH = 100;

    // Progress ranges (mapped from 1000dvh total page)
    const HERO_END = 0.1;
    const TUNNEL_START = 0.12;
    const TUNNEL_END = 0.25;
    const ABOUT_END = 0.3;

    // Frame texture paths
    const FRAME_PATHS = Array.from({ length: 15 }, (_, i) => {
        const num = String(i + 1).padStart(2, "0");
        const ext = [4, 7].includes(i + 1) ? "jpg" : "webp";
        return `/assets/tunnel-trailer/frame-${num}.${ext}`;
    });

    // ============================================================================
    // TYPES & HELPERS
    // ============================================================================

    interface TileState {
        z: number;
        spawnZ: number;
        theta: number;
        spin: number;
        speedJitter: number;
        targetRadius: number;
        baseScale: number;
        brightness: number;
        textureIndex: number;
    }

    interface RibbonData {
        angle: number;
        radius: number;
        z: number;
        speed: number;
    }

    const randomIn = (min: number, max: number) =>
        min + Math.random() * (max - min);

    const rangeProgress = (value: number, start: number, end: number) =>
        clamp((value - start) / (end - start), 0, 1);

    function resetTileState(state: TileState, textureCount: number) {
        state.spawnZ = randomIn(TILE_SPAWN_Z_MIN, TILE_SPAWN_Z_MAX);
        state.z = state.spawnZ;
        state.theta = randomIn(0, Math.PI * 2);
        state.spin = randomIn(1.6, 4.4);
        state.speedJitter = randomIn(0.2, 1);
        state.targetRadius = randomIn(7.2, 11.2);
        state.baseScale = randomIn(2.2, 4.0);
        state.brightness = randomIn(0.55, 1);
        state.textureIndex = Math.floor(randomIn(0, Math.max(textureCount, 1)));
    }

    function makeTileState(textureCount: number): TileState {
        const state: TileState = {
            z: 0,
            spawnZ: 0,
            theta: 0,
            spin: 0,
            speedJitter: 0,
            targetRadius: 0,
            baseScale: 0,
            brightness: 0,
            textureIndex: 0,
        };
        resetTileState(state, textureCount);
        return state;
    }

    function createCurvedTileGeometry(
        width: number,
        height: number,
        curveRadius: number,
        segmentsX = 16,
    ) {
        const geometry = new PlaneGeometry(width, height, segmentsX, 1);
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const theta = x / curveRadius;
            positions.setXYZ(
                i,
                Math.sin(theta) * curveRadius,
                y,
                -(1 - Math.cos(theta)) * curveRadius,
            );
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
        return geometry;
    }

    // ============================================================================
    // STATE
    // ============================================================================

    let groupVisible = $state(false);
    let ribbonsMesh: InstancedMesh | undefined = $state();
    let ribbonMaterial: MeshBasicMaterial | undefined = $state();
    let tileGroup: Group | undefined = $state();

    const tileMeshArray: Mesh[] = [];
    const tileMaterialArray: MeshBasicMaterial[] = [];
    let textures: Texture[] = [];
    let tileStates: TileState[] = [];

    let lastProgress = 0;
    let velocity = 0;
    let vortexAngle = 0;

    const dummy = new Object3D();
    dummy.up.set(0, 0, 1);

    const tileGeometry = createCurvedTileGeometry(4.8, 2.7, 8.8, 16);

    const ribbonData: RibbonData[] = Array.from(
        { length: RIBBON_COUNT },
        (_, i) => ({
            angle: (i / RIBBON_COUNT) * Math.PI * 2 + Math.random() * 0.5,
            radius: TUNNEL_RADIUS + (Math.random() - 0.5) * 4,
            z: Math.random() * -TUNNEL_LENGTH,
            speed: 1 + Math.random(),
        }),
    );

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    onMount(() => {
        // Create tile meshes imperatively
        if (tileGroup) {
            for (let i = 0; i < TILE_COUNT; i++) {
                const mat = new MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    side: DoubleSide,
                    depthWrite: false,
                    toneMapped: false,
                });
                const mesh = new Mesh(tileGeometry, mat);
                mesh.frustumCulled = false;
                mesh.visible = false;
                tileMeshArray[i] = mesh;
                tileMaterialArray[i] = mat;
                tileGroup.add(mesh);
            }
        }

        if (ribbonsMesh) {
            ribbonsMesh.instanceMatrix.setUsage(DynamicDrawUsage);
        }

        // Load textures
        const loader = new TextureLoader();
        const loaded: Texture[] = [];

        FRAME_PATHS.forEach((path, i) => {
            loader.load(path, (tex: Texture) => {
                tex.wrapS = ClampToEdgeWrapping;
                tex.wrapT = ClampToEdgeWrapping;
                tex.minFilter = LinearFilter;
                tex.magFilter = LinearFilter;
                tex.colorSpace = SRGBColorSpace;
                tex.anisotropy = 2;
                loaded[i] = tex;

                if (loaded.filter(Boolean).length === FRAME_PATHS.length) {
                    textures = loaded;
                    tileStates = Array.from({ length: TILE_COUNT }, () =>
                        makeTileState(textures.length),
                    );

                    tileMeshArray.forEach((_, j) => {
                        const state = tileStates[j];
                        if (state) {
                            tileMaterialArray[j].map =
                                textures[state.textureIndex] ?? textures[0];
                            tileMaterialArray[j].needsUpdate = true;
                        }
                    });
                }
            });
        });
    });

    onDestroy(() => {
        tileMeshArray.forEach((mesh) => {
            (mesh.material as MeshBasicMaterial)?.dispose();
        });
        textures.forEach((tex) => tex?.dispose());
        tileGeometry.dispose();
    });

    // ============================================================================
    // PER-FRAME UPDATE
    // ============================================================================

    const { invalidate } = useThrelte();

    useTask((delta: number) => {
        const r = scrollState.progress;

        const rawVelocity = (r - lastProgress) / Math.max(delta, 1 / 144);
        lastProgress = r;
        velocity = MathUtils.damp(velocity, rawVelocity, 6, delta);
        const velocityBoost = clamp(Math.abs(velocity) * 1.35, 0, 1);

        const inVoid = r >= HERO_END && r < TUNNEL_START;
        const inTunnel = r >= TUNNEL_START && r <= TUNNEL_END;
        const tunnelProgress = rangeProgress(r, TUNNEL_START, TUNNEL_END);

        const overallProgress = rangeProgress(r, HERO_END, TUNNEL_START + 0.02);
        const tunnelVisibility = clamp(overallProgress, 0, 1);

        groupVisible = r >= HERO_END - 0.01 && r <= ABOUT_END + 0.02;

        const targetSpin = inTunnel ? 0.15 + velocityBoost * 0.2 : 0.07;
        vortexAngle += targetSpin * delta;

        // Speed calculations (3-phase curve)
        let ribbonSpeed = 0;
        let imageSpeed = 0;

        if (inVoid || inTunnel) {
            const combinedProgress = inVoid
                ? ((r - HERO_END) / (TUNNEL_START - HERO_END)) * 0.2
                : 0.2 + tunnelProgress * 0.8;

            if (combinedProgress < 0.2) {
                const pp = combinedProgress / 0.2;
                ribbonSpeed = MathUtils.lerp(25, 50, pp);
            } else if (combinedProgress < 0.6) {
                const pp = (combinedProgress - 0.2) / 0.4;
                ribbonSpeed = MathUtils.lerp(50, 180, pp * pp);
            } else {
                const pp = (combinedProgress - 0.6) / 0.4;
                ribbonSpeed = MathUtils.lerp(180, 650, Math.pow(pp, 2.5));
            }
            imageSpeed = ribbonSpeed * 0.5;

            const vi =
                velocityBoost * MathUtils.lerp(0.5, 1.5, combinedProgress);
            ribbonSpeed += vi * 100;
            imageSpeed += vi * 50;
        }

        const tileSwirl = vortexAngle * 0.95;

        // RIBBONS
        if (ribbonsMesh) {
            ribbonsMesh.visible =
                (inVoid || inTunnel) && tunnelVisibility > 0.01;

            for (let i = 0; i < RIBBON_COUNT; i++) {
                const data = ribbonData[i];
                data.z += ribbonSpeed * delta * (0.68 + data.speed * 0.2);
                if (data.z > 20) data.z = -TUNNEL_LENGTH;

                dummy.position.set(
                    Math.cos(data.angle) * data.radius,
                    Math.sin(data.angle) * data.radius,
                    data.z,
                );
                dummy.lookAt(0, 0, data.z);
                dummy.scale.set(1, 1 + velocityBoost * 0.65, 1);
                dummy.updateMatrix();
                ribbonsMesh.setMatrixAt(i, dummy.matrix);
            }

            ribbonsMesh.instanceMatrix.needsUpdate = true;

            if (ribbonMaterial) {
                ribbonMaterial.opacity = 0.8 * tunnelVisibility;
            }
        }

        // IMAGE TILES
        if (tileMeshArray.length === 0) return;

        const cpTiles = inVoid
            ? ((r - HERO_END) / (TUNNEL_START - HERO_END)) * 0.15
            : inTunnel
              ? 0.15 + tunnelProgress * 0.85
              : 0;

        const activeRatio =
            inVoid || inTunnel ? clamp(cpTiles + velocityBoost * 0.2, 0, 1) : 0;
        const activeCount = Math.floor(TILE_COUNT * activeRatio);

        for (let i = 0; i < TILE_COUNT; i++) {
            const mesh = tileMeshArray[i];
            const mat = tileMaterialArray[i];
            if (!mesh) continue;

            const isActive = (inVoid || inTunnel) && i < activeCount;
            mesh.visible = isActive;
            if (!isActive) continue;

            const ts = tileStates[i];
            if (!ts) continue;

            ts.z += imageSpeed * delta * (0.68 + ts.speedJitter * 0.65);

            if (ts.z > TILE_PASS_Z) {
                resetTileState(ts, textures.length);
                if (mat && textures.length > 0) {
                    mat.map = textures[ts.textureIndex] ?? textures[0];
                    mat.needsUpdate = true;
                }
            }

            const t = rangeProgress(ts.z, ts.spawnZ, TILE_PASS_Z);
            const radial = MathUtils.lerp(
                0.12,
                ts.targetRadius,
                Math.pow(t, 1.16),
            );
            const theta = ts.theta + t * ts.spin + tileSwirl;

            mesh.position.set(
                Math.cos(theta) * radial,
                Math.sin(theta) * radial,
                ts.z,
            );
            mesh.lookAt(0, 0, ts.z);

            const ls = MathUtils.lerp(0.08, ts.baseScale, Math.pow(t, 1.1));
            const stretch = 1 + velocityBoost * 0.65;
            mesh.scale.set(ls * stretch, ls * 0.58, 1);

            const nearFade = 1 - rangeProgress(t, 0.94, 1);
            mat.opacity = clamp(
                tunnelVisibility *
                    rangeProgress(t, 0.03, 0.28) *
                    nearFade *
                    (0.55 + ts.brightness * 0.55),
                0,
                1,
            );
        }

        invalidate();
    });
</script>

{#if groupVisible}
    <T.Group>
        <!-- RIBBONS — Neon light beams (instanced for perf) -->
        <T.InstancedMesh
            args={[new PlaneGeometry(0.2, 5), undefined, RIBBON_COUNT]}
            bind:ref={ribbonsMesh}
            frustumCulled={false}
        >
            <T.MeshBasicMaterial
                bind:ref={ribbonMaterial}
                color="#4deeea"
                transparent
                opacity={0.8}
                blending={AdditiveBlending}
                side={DoubleSide}
                depthWrite={false}
                toneMapped={false}
            />
        </T.InstancedMesh>

        <!-- IMAGE TILES — imperatively created, attached to this group -->
        <T.Group bind:ref={tileGroup} />
    </T.Group>
{/if}
