import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, rangeProgress } from '../../../config';
import { CONTENT } from '../../../data';

const TILE_COUNT = 36;
const TRAIL_COUNT = 520;

const TILE_SPAWN_Z_MIN = -340;
const TILE_SPAWN_Z_MAX = -210;
const TILE_PASS_Z = 24;

const TRAIL_SPAWN_Z_MIN = -360;
const TRAIL_SPAWN_Z_MAX = -180;
const TRAIL_PASS_Z = 40;

const randomIn = (min: number, max: number): number => min + Math.random() * (max - min);

const getTextureOrFallback = (
    textures: THREE.Texture[],
    index: number
): THREE.Texture | null => textures[index] ?? textures[0] ?? null;

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

interface TrailState {
    z: number;
    spawnZ: number;
    theta: number;
    spin: number;
    speedJitter: number;
    targetRadius: number;
    length: number;
    width: number;
}

const createCurvedTileGeometry = (
    width: number,
    height: number,
    curveRadius: number,
    segmentsX = 24,
    segmentsY = 1
): THREE.BufferGeometry => {
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const theta = x / curveRadius;

        const curvedX = Math.sin(theta) * curveRadius;
        // Negative z keeps edges farther from the center ray, matching an inner pipe surface.
        const curvedZ = -(1 - Math.cos(theta)) * curveRadius;

        positions.setXYZ(i, curvedX, y, curvedZ);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
};

const resetTileState = (state: TileState, textureCount: number): void => {
    state.spawnZ = randomIn(TILE_SPAWN_Z_MIN, TILE_SPAWN_Z_MAX);
    state.z = state.spawnZ;
    state.theta = randomIn(0, Math.PI * 2);
    state.spin = randomIn(1.8, 4.8);
    state.speedJitter = randomIn(0.2, 1);
    state.targetRadius = randomIn(7.5, 11.5);
    state.baseScale = randomIn(2.2, 4.1);
    state.brightness = randomIn(0.55, 1);
    state.textureIndex = Math.floor(randomIn(0, Math.max(textureCount, 1)));
};

const makeTileState = (textureCount: number): TileState => {
    const state: TileState = {
        z: 0,
        spawnZ: 0,
        theta: 0,
        spin: 0,
        speedJitter: 0,
        targetRadius: 0,
        baseScale: 0,
        brightness: 0,
        textureIndex: 0
    };
    resetTileState(state, textureCount);
    return state;
};

const resetTrailState = (state: TrailState): void => {
    state.spawnZ = randomIn(TRAIL_SPAWN_Z_MIN, TRAIL_SPAWN_Z_MAX);
    state.z = state.spawnZ;
    state.theta = randomIn(0, Math.PI * 2);
    state.spin = randomIn(2.4, 7.2);
    state.speedJitter = randomIn(0.3, 1);
    state.targetRadius = randomIn(9.5, 16.5);
    state.length = randomIn(1.8, 6.8);
    state.width = randomIn(0.018, 0.07);
};

const makeTrailState = (): TrailState => {
    const state: TrailState = {
        z: 0,
        spawnZ: 0,
        theta: 0,
        spin: 0,
        speedJitter: 0,
        targetRadius: 0,
        length: 0,
        width: 0
    };
    resetTrailState(state);
    return state;
};

/**
 * HyperSpatial tunnel:
 * - images are curved tiles on an invisible inner cylinder
 * - tiles are radially arranged and tangentially oriented toward center path
 * - scroll velocity drives density, speed, and optical intensity
 */
const TunnelGroup: React.FC = () => {
    const scroll = useScroll();
    const { camera } = useThree();
    const textures = useTexture(CONTENT.map((item) => item.url)) as THREE.Texture[];

    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Group>(null);
    const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
    const coreLightRef = useRef<THREE.PointLight>(null);
    const trailsRef = useRef<THREE.InstancedMesh>(null);
    const tileMeshesRef = useRef<THREE.Mesh[]>([]);

    const tileStatesRef = useRef<TileState[]>([]);
    const trailStatesRef = useRef<TrailState[]>([]);
    const lastOffsetRef = useRef(0);
    const velocityRef = useRef(0);
    const baseFovRef = useRef(
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 75
    );

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const tileGeometry = useMemo(
        () => createCurvedTileGeometry(4.8, 2.7, 8.8, 28, 1),
        []
    );

    const trailGeometry = useMemo(() => new THREE.BoxGeometry(0.03, 0.03, 1), []);
    const trailMaterial = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color: '#9fd7ff',
                transparent: true,
                opacity: 0.2,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                toneMapped: false
            }),
        []
    );

    useEffect(() => {
        textures.forEach((texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 8;
            texture.needsUpdate = true;
        });

        tileStatesRef.current = Array.from({ length: TILE_COUNT }, () => makeTileState(textures.length));
        trailStatesRef.current = Array.from({ length: TRAIL_COUNT }, () => makeTrailState());

        tileMeshesRef.current.forEach((mesh, i) => {
            const state = tileStatesRef.current[i];
            if (!state) return;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.map = getTextureOrFallback(textures, state.textureIndex);
            mat.needsUpdate = true;
        });
    }, [textures]);

    useFrame((_, delta) => {
        const r = scroll.offset;
        const rawVelocity = (r - lastOffsetRef.current) / Math.max(delta, 1 / 144);
        lastOffsetRef.current = r;

        velocityRef.current = THREE.MathUtils.damp(velocityRef.current, rawVelocity, 6, delta);
        const velocityBoost = THREE.MathUtils.clamp(Math.abs(velocityRef.current) * 1.45, 0, 1);

        const inVoid = r >= TIMELINE.HERO_END && r < TIMELINE.TUNNEL_START;
        const inTunnel = r >= TIMELINE.TUNNEL_START && r <= TIMELINE.TUNNEL_END;
        const showCoreAndTrails = r >= TIMELINE.HERO_END && r <= TIMELINE.TUNNEL_END + 0.02;

        const tunnelProgress = rangeProgress(r, TIMELINE.TUNNEL_START, TIMELINE.TUNNEL_END);
        const tunnelFadeOut = 1 - rangeProgress(r, TIMELINE.TUNNEL_END - 0.05, TIMELINE.TUNNEL_END + 0.02);
        const tunnelVisibility = THREE.MathUtils.clamp(tunnelFadeOut, 0, 1);

        if (groupRef.current) {
            groupRef.current.visible = r >= TIMELINE.HERO_END - 0.01 && r <= TIMELINE.ABOUT_START + 0.08;
        }

        if (camera instanceof THREE.PerspectiveCamera) {
            const targetFov = inTunnel
                ? baseFovRef.current + velocityBoost * 14 + tunnelProgress * 4
                : baseFovRef.current;
            camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 5, delta);
            camera.updateProjectionMatrix();
        }

        if (coreRef.current) {
            const corePhase = rangeProgress(r, TIMELINE.HERO_END, TIMELINE.TUNNEL_END);
            coreRef.current.visible = showCoreAndTrails;
            coreRef.current.position.set(0, 0, THREE.MathUtils.lerp(-300, -215, corePhase));
            const coreScale = THREE.MathUtils.lerp(0.7, 1.5, corePhase) * (1 + velocityBoost * 0.2);
            coreRef.current.scale.setScalar(coreScale);
        }

        if (coreMatRef.current) {
            coreMatRef.current.opacity = inVoid
                ? 0.95
                : inTunnel
                    ? THREE.MathUtils.lerp(0.7, 1, velocityBoost) * tunnelVisibility
                    : 0;
        }

        if (haloMatRef.current) {
            haloMatRef.current.opacity = inVoid
                ? 0.36
                : inTunnel
                    ? (0.26 + velocityBoost * 0.46) * tunnelVisibility
                    : 0;
        }

        if (coreLightRef.current) {
            coreLightRef.current.intensity = inVoid
                ? 5
                : inTunnel
                    ? (4 + velocityBoost * 6) * tunnelVisibility
                    : 0;
        }

        const trailMesh = trailsRef.current;
        if (trailMesh) {
            trailMesh.visible = showCoreAndTrails;
            if (showCoreAndTrails) {
                const trailPhase = rangeProgress(r, TIMELINE.HERO_END, TIMELINE.TUNNEL_END);
                const trailIntensity = inVoid
                    ? 0.35 + velocityBoost * 0.45
                    : (0.5 + trailPhase * 0.5 + velocityBoost * 0.6) * tunnelVisibility;
                trailMaterial.opacity = THREE.MathUtils.clamp(0.18 + trailIntensity * 0.55, 0, 0.95);

                const trailAccel = inTunnel
                    ? THREE.MathUtils.lerp(0.18, 1.12, Math.pow(tunnelProgress, 1.25))
                    : 0;
                const trailSpeed = inVoid
                    ? 70 + velocityBoost * 55
                    : (42 + trailAccel * 170) + velocityBoost * 145;
                const swirl = trailPhase * 9;

                for (let i = 0; i < TRAIL_COUNT; i++) {
                    const state = trailStatesRef.current[i];
                    if (!state) continue;
                    state.z += trailSpeed * delta * (0.72 + state.speedJitter * 0.55);

                    if (state.z > TRAIL_PASS_Z) {
                        resetTrailState(state);
                    }

                    const t = rangeProgress(state.z, state.spawnZ, TRAIL_PASS_Z);
                    const radial = THREE.MathUtils.lerp(0.08, state.targetRadius, Math.pow(t, 1.18));
                    const theta = state.theta + t * state.spin + swirl;

                    const x = Math.cos(theta) * radial;
                    const y = Math.sin(theta) * radial;

                    const width = state.width * (0.7 + trailIntensity * 1.5);
                    const length = state.length * (1 + trailIntensity * 4);

                    dummy.position.set(x, y, state.z);
                    dummy.rotation.set(0, 0, theta + Math.PI / 2);
                    dummy.scale.set(width, width, length);
                    dummy.updateMatrix();
                    trailMesh.setMatrixAt(i, dummy.matrix);
                }

                trailMesh.instanceMatrix.needsUpdate = true;
            }
        }

        const imageVisibility = inTunnel
            ? rangeProgress(tunnelProgress, 0.58, 0.58) * tunnelVisibility
            : 0;
        const activeRatio = inTunnel
            ? THREE.MathUtils.clamp(0.15 + tunnelProgress * 0.8 + velocityBoost * 0.35, 0, 1)
            : 0;
        const activeCount = Math.floor(TILE_COUNT * activeRatio);

        // Staged acceleration profile:
        // 1) gentle start so users can read images
        // 2) medium ramp
        // 3) full-speed rush
        let accelProfile = 0;
        if (inTunnel) {
            if (tunnelProgress < 0.35) {
                accelProfile = THREE.MathUtils.lerp(0.14, 0.44, rangeProgress(tunnelProgress, 0.20, 0.35));
            } else if (tunnelProgress < 0.78) {
                accelProfile = THREE.MathUtils.lerp(0.44, 0.9, rangeProgress(tunnelProgress, 0.35, 0.78));
            } else {
                accelProfile = THREE.MathUtils.lerp(0.9, 1.16, rangeProgress(tunnelProgress, 0.78, 1));
            }
        }

        const velocityInfluence = inTunnel
            ? velocityBoost * THREE.MathUtils.lerp(0.28, 1, rangeProgress(tunnelProgress, 0.18, 0.82))
            : 0;

        const tileSpeed = inTunnel
            ? THREE.MathUtils.lerp(36, 205, accelProfile) + velocityInfluence * 120
            : 0;

        const globalSwirl = inTunnel ? tunnelProgress * 8.4 : 0;

        for (let i = 0; i < TILE_COUNT; i++) {
            const mesh = tileMeshesRef.current[i];
            if (!mesh) continue;

            const isActive = inTunnel && i < activeCount;
            mesh.visible = isActive;
            if (!isActive) continue;

            const state = tileStatesRef.current[i];
            if (!state) continue;
            state.z += tileSpeed * delta * (0.68 + state.speedJitter * 0.65);

            if (state.z > TILE_PASS_Z) {
                resetTileState(state, textures.length);
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.map = getTextureOrFallback(textures, state.textureIndex);
                mat.needsUpdate = true;
            }

            const t = rangeProgress(state.z, state.spawnZ, TILE_PASS_Z);
            const radial = THREE.MathUtils.lerp(0.12, state.targetRadius, Math.pow(t, 1.16));
            const theta = state.theta + t * state.spin + globalSwirl;

            const x = Math.cos(theta) * radial;
            const y = Math.sin(theta) * radial;

            mesh.position.set(x, y, state.z);
            mesh.lookAt(0, 0, state.z);

            const localScale = THREE.MathUtils.lerp(0.08, state.baseScale, Math.pow(t, 1.1));
            const stretch = 1 + velocityBoost * 0.65;
            mesh.scale.set(localScale * stretch, localScale * 0.58, 1);

            const nearFade = 1 - rangeProgress(t, 0.94, 1);
            const opacity =
                imageVisibility *
                rangeProgress(t, 0.03, 0.28) *
                nearFade *
                (0.55 + state.brightness * 0.55);

            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
        }
    });

    return (
        <group ref={groupRef}>
            <group ref={coreRef}>
                <mesh>
                    <sphereGeometry args={[1.25, 24, 24]} />
                    <meshBasicMaterial
                        ref={coreMatRef}
                        color="#b8e6ff"
                        transparent
                        opacity={0}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
                <mesh>
                    <sphereGeometry args={[3.8, 24, 24]} />
                    <meshBasicMaterial
                        ref={haloMatRef}
                        color="#6ec7ff"
                        transparent
                        opacity={0}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
                <pointLight
                    ref={coreLightRef}
                    color="#8fcfff"
                    intensity={0}
                    distance={80}
                    decay={2}
                />
            </group>

            <instancedMesh
                ref={trailsRef}
                args={[trailGeometry, trailMaterial, TRAIL_COUNT]}
                frustumCulled={false}
            />

            {Array.from({ length: TILE_COUNT }).map((_, i) => (
                <mesh
                    key={i}
                    ref={(mesh) => {
                        if (mesh) tileMeshesRef.current[i] = mesh;
                    }}
                    geometry={tileGeometry}
                    frustumCulled={false}
                >
                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default TunnelGroup;
