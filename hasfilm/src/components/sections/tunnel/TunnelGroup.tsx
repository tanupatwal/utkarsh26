import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, rangeProgress } from '../../../config';
import { CONTENT } from '../../../data';

// ============================================================================
// CONFIGURATION
// ============================================================================

const TILE_COUNT = 24;
const TILE_SPAWN_Z_MIN = -200;
const TILE_SPAWN_Z_MAX = -80;
const TILE_PASS_Z = 20;

const RIBBON_COUNT = 100;
const TUNNEL_RADIUS = 12;
const TUNNEL_LENGTH = 100;

// Auto-scroll configuration
const AUTO_SCROLL_DURATION = 3.0; // Reduced from 4.5s for snappier travel
const AUTO_SCROLL_TRIGGER_OFFSET = TIMELINE.HERO_END + 0.02; // Trigger forward scroll
const AUTO_SCROLL_TARGET = TIMELINE.ABOUT_START + 0.02; // End of forward scroll

const REVERSE_TRIGGER_OFFSET = TIMELINE.ABOUT_START - 0.05; // Trigger reverse scroll
const REVERSE_TARGET = TIMELINE.HERO_END + 0.05; // End of reverse scroll


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

interface RibbonData {
    angle: number;
    radius: number;
    z: number;
    speed: number;
}

// Smooth easing function for spline-like transition (ease-in-out)
const easeInOutCubic = (t: number): number => {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Simple curved tile geometry
const createCurvedTileGeometry = (
    width: number,
    height: number,
    curveRadius: number,
    segmentsX = 16
): THREE.BufferGeometry => {
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, 1);
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const theta = x / curveRadius;

        const curvedX = Math.sin(theta) * curveRadius;
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
    state.spin = randomIn(1.6, 4.4);
    state.speedJitter = randomIn(0.2, 1);
    state.targetRadius = randomIn(7.2, 11.2);
    state.baseScale = randomIn(2.2, 4.0);
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

const TunnelGroup: React.FC = () => {
    const scroll = useScroll();
    const { camera } = useThree();
    const textures = useTexture(CONTENT.map((item) => item.url)) as THREE.Texture[];

    const groupRef = useRef<THREE.Group>(null);
    const ribbonsMeshRef = useRef<THREE.InstancedMesh>(null);
    const ribbonMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
    const tileMeshesRef = useRef<THREE.Mesh[]>([]);

    const tileStatesRef = useRef<TileState[]>([]);

    const lastOffsetRef = useRef(0);
    const velocityRef = useRef(0);
    const baseFovRef = useRef(
        camera instanceof THREE.PerspectiveCamera ? camera.fov : 75
    );

    const vortexAngleRef = useRef(0);
    // Track peak tunnel progress — prevents visual regression on backward scroll
    const peakProgressRef = useRef(0);

    // Auto-scroll state
    const autoScrollActiveRef = useRef(false);
    const reverseAutoScrollActiveRef = useRef(false);
    const autoScrollStartTimeRef = useRef(0);
    const autoScrollStartOffsetRef = useRef(0);
    const hasTriggeredForwardRef = useRef(false);
    const hasTriggeredReverseRef = useRef(false);

    useEffect(() => {
        // Reset triggers on mount
        hasTriggeredForwardRef.current = false;
        hasTriggeredReverseRef.current = false;
    }, []);

    const dummy = useMemo(() => {
        const obj = new THREE.Object3D();
        obj.up.set(0, 0, 1);
        return obj;
    }, []);

    // Geometries
    const tileGeometry = useMemo(
        () => createCurvedTileGeometry(4.8, 2.7, 8.8, 16),
        []
    );

    // Initialize ribbons data (like hyper-spatial-tunnel)
    const ribbonData = useMemo((): RibbonData[] => {
        const data: RibbonData[] = [];
        for (let i = 0; i < RIBBON_COUNT; i++) {
            const angle = (i / RIBBON_COUNT) * Math.PI * 2 + (Math.random() * 0.5);
            const radius = TUNNEL_RADIUS + (Math.random() - 0.5) * 4;
            const z = Math.random() * -TUNNEL_LENGTH;
            const speed = 1 + Math.random();
            data.push({ angle, radius, z, speed });
        }
        return data;
    }, []);

    useEffect(() => {
        // Texture settings
        textures.forEach((texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 2;
            texture.needsUpdate = true;
        });

        tileStatesRef.current = Array.from({ length: TILE_COUNT }, () => makeTileState(textures.length));

        ribbonsMeshRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        tileMeshesRef.current.forEach((mesh, i) => {
            const state = tileStatesRef.current[i];
            if (!state) return;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.map = getTextureOrFallback(textures, state.textureIndex);
            mat.needsUpdate = true;
        });
    }, [textures]);

    useFrame((_state, delta) => {
        const r = scroll.offset;

        // ============================================================================
        // AUTO-SCROLL LOGIC (Bidirectional)
        // ============================================================================

        // 1. FORWARD TRIGGER
        // Trigger auto-scroll when user reaches the end of hero section
        if (r >= AUTO_SCROLL_TRIGGER_OFFSET && r < AUTO_SCROLL_TARGET && !hasTriggeredForwardRef.current && !reverseAutoScrollActiveRef.current) {
            hasTriggeredForwardRef.current = true;
            autoScrollActiveRef.current = true;
            autoScrollStartTimeRef.current = performance.now();
            autoScrollStartOffsetRef.current = r;
            // Disable reverse trigger temporarily to avoid fighting
            hasTriggeredReverseRef.current = true;
        }

        // 2. REVERSE TRIGGER
        // Trigger reverse auto-scroll when user comes back from about section
        if (r <= REVERSE_TRIGGER_OFFSET && r > REVERSE_TARGET && !hasTriggeredReverseRef.current && !autoScrollActiveRef.current) {
            hasTriggeredReverseRef.current = true;
            reverseAutoScrollActiveRef.current = true;
            autoScrollStartTimeRef.current = performance.now();
            autoScrollStartOffsetRef.current = r;
            // Disable forward trigger temporarily
            hasTriggeredForwardRef.current = true;
        }

        // Reset triggers when strictly out of tunnel zone
        if (r < TIMELINE.HERO_END) {
            // Before hero end -> reset forward trigger so we can enter tunnel again
            hasTriggeredForwardRef.current = false;
            // Ensure reverse is done
            reverseAutoScrollActiveRef.current = false;
        }
        if (r > TIMELINE.ABOUT_START) {
            // Past about start -> reset reverse trigger so we can go back
            hasTriggeredReverseRef.current = false;
            // Ensure forward is done
            autoScrollActiveRef.current = false;
        }

        // Apply auto-scroll if active
        if ((autoScrollActiveRef.current || reverseAutoScrollActiveRef.current) && scroll.el) {
            const elapsed = (performance.now() - autoScrollStartTimeRef.current) / 1000;
            const progress = Math.min(elapsed / AUTO_SCROLL_DURATION, 1);
            const easedProgress = easeInOutCubic(progress);

            let targetOffset = 0;
            if (autoScrollActiveRef.current) {
                // Forward: Start -> End
                targetOffset = autoScrollStartOffsetRef.current +
                    (AUTO_SCROLL_TARGET - autoScrollStartOffsetRef.current) * easedProgress;
            } else {
                // Reverse: Start -> End (where Start is high, End is low)
                targetOffset = autoScrollStartOffsetRef.current +
                    (REVERSE_TARGET - autoScrollStartOffsetRef.current) * easedProgress;
            }

            // Smoothly scroll to target
            const scrollContainer = scroll.el as HTMLElement;
            const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
            scrollContainer.scrollTop = targetOffset * scrollHeight;

            // End auto-scroll when complete
            if (progress >= 1) {
                autoScrollActiveRef.current = false;
                reverseAutoScrollActiveRef.current = false;
            }
        }

        const rawVelocity = (r - lastOffsetRef.current) / Math.max(delta, 1 / 144);
        lastOffsetRef.current = r;

        velocityRef.current = THREE.MathUtils.damp(velocityRef.current, rawVelocity, 6, delta);
        const velocityBoost = THREE.MathUtils.clamp(Math.abs(velocityRef.current) * 1.35, 0, 1);

        const inVoid = r >= TIMELINE.HERO_END && r < TIMELINE.TUNNEL_START;
        // Detect backward scrolling (manual or auto)
        const isScrollingBack = velocityRef.current < -0.01 || reverseAutoScrollActiveRef.current;
        const inTunnel = (r >= TIMELINE.TUNNEL_START && r <= TIMELINE.TUNNEL_END) || (isScrollingBack && r >= TIMELINE.HERO_END && r <= TIMELINE.ABOUT_START);
        const rawTunnelProgress = rangeProgress(r, TIMELINE.TUNNEL_START, TIMELINE.TUNNEL_END);
        const tunnelProgress = isScrollingBack ? Math.max(rawTunnelProgress, 0.8) : rawTunnelProgress;

        // Overall visibility — keep at full during backward scroll
        const rawOverallProgress = rangeProgress(r, TIMELINE.HERO_END, TIMELINE.TUNNEL_START + 0.1);
        const tunnelVisibility = isScrollingBack ? 1.0 : THREE.MathUtils.clamp(rawOverallProgress, 0, 1);

        // Track peak progress for ratchet effect — only goes up, never down
        // Reset when scroll is before hero (user fully returned to top)
        if (r < TIMELINE.HERO_END - 0.02) {
            peakProgressRef.current = 0;
        }

        // Group visibility
        if (groupRef.current) {
            groupRef.current.visible = r >= TIMELINE.HERO_END - 0.01 && r <= TIMELINE.ABOUT_START + 0.08;
        }

        // Camera position — tunnel expects camera near origin (z=5, looking down the tunnel).
        // GalleryGroup moves camera to z=60-80; we need to bring it back when in tunnel zone.
        if (inVoid || inTunnel) {
            const TUNNEL_CAM_POS = { x: 0, y: 0, z: 5 };
            camera.position.x = THREE.MathUtils.damp(camera.position.x, TUNNEL_CAM_POS.x, 4, delta);
            camera.position.y = THREE.MathUtils.damp(camera.position.y, TUNNEL_CAM_POS.y, 4, delta);
            camera.position.z = THREE.MathUtils.damp(camera.position.z, TUNNEL_CAM_POS.z, 4, delta);
            camera.lookAt(0, 0, -10);
        }

        // FOV effect
        if (camera instanceof THREE.PerspectiveCamera) {
            const targetFov = inTunnel
                ? baseFovRef.current + velocityBoost * 10
                : baseFovRef.current;
            camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 5, delta);
            camera.updateProjectionMatrix();
        }

        // Vortex rotation
        const targetSpin = inTunnel ? 0.15 + velocityBoost * 0.2 : 0.07;
        vortexAngleRef.current += targetSpin * delta;

        // ============================================================================
        // SPEED CALCULATIONS - New curve for better visual flow
        // ============================================================================
        // Phase 1 (0-20%): Start with visible movement - ribbons at base speed, tiles at 50%
        // Phase 2 (20-60%): Rapid but gradual increase
        // Phase 3 (60-100%): Way way faster speed increase

        let ribbonSpeed = 0;
        let imageSpeed = 0;

        if (inVoid || inTunnel) {
            // Combined progress for smooth speed curve across void + tunnel
            const rawCombinedProgress = inVoid
                ? (r - TIMELINE.HERO_END) / (TIMELINE.TUNNEL_START - TIMELINE.HERO_END) * 0.2
                : 0.2 + tunnelProgress * 0.8;

            // Update peak and use it during backward scroll
            peakProgressRef.current = Math.max(peakProgressRef.current, rawCombinedProgress);
            const combinedProgress = isScrollingBack
                ? Math.max(rawCombinedProgress, peakProgressRef.current * 0.85)
                : rawCombinedProgress;

            if (combinedProgress < 0.2) {
                // Phase 1 (0-20%): Base visible speed
                // Ribbons: 25 -> 50, Images: 12 -> 25 (50% of ribbon speed)
                const phaseProgress = combinedProgress / 0.2;
                ribbonSpeed = THREE.MathUtils.lerp(25, 50, phaseProgress);
                imageSpeed = ribbonSpeed * 0.5;
            } else if (combinedProgress < 0.6) {
                // Phase 2 (20-60%): Rapid but gradual increase
                // Ribbons: 50 -> 180, Images: 25 -> 90
                const phaseProgress = (combinedProgress - 0.2) / 0.4;
                // Use quadratic curve for acceleration feel
                const easedProgress = phaseProgress * phaseProgress;
                ribbonSpeed = THREE.MathUtils.lerp(50, 180, easedProgress);
                imageSpeed = ribbonSpeed * 0.5;
            } else {
                // Phase 3 (60-100%): Way way faster speed increase
                // Ribbons: 180 -> 600+, Images: 90 -> 300+
                const phaseProgress = (combinedProgress - 0.6) / 0.4;
                // Exponential curve for intense speed feeling
                const easedProgress = Math.pow(phaseProgress, 2.5);
                ribbonSpeed = THREE.MathUtils.lerp(180, 650, easedProgress);
                imageSpeed = ribbonSpeed * 0.5;
            }

            // Add velocity influence from manual scrolling
            const velocityInfluence = velocityBoost * THREE.MathUtils.lerp(0.5, 1.5, combinedProgress);
            ribbonSpeed += velocityInfluence * 100;
            imageSpeed += velocityInfluence * 50;
        }

        const tileSwirl = vortexAngleRef.current * 0.95;

        // ============================================================================
        // RIBBONS (Neon effect from hyper-spatial-tunnel)
        // ============================================================================

        if (ribbonsMeshRef.current) {
            ribbonsMeshRef.current.visible = (inVoid || inTunnel) && tunnelVisibility > 0.01;

            ribbonData.forEach((data, i) => {
                // Move Z towards camera with ribbon speed
                data.z += ribbonSpeed * delta * (0.68 + data.speed * 0.2);

                // Loop back if passed camera
                if (data.z > 20) {
                    data.z = -TUNNEL_LENGTH;
                }

                // Calculate position on the cylinder
                const x = Math.cos(data.angle) * data.radius;
                const y = Math.sin(data.angle) * data.radius;

                dummy.position.set(x, y, data.z);

                // Orient the plane to face center
                dummy.lookAt(0, 0, data.z);

                // Stretch effect based on velocity (same as tiles)
                const stretch = 1 + velocityBoost * 0.65;
                dummy.scale.set(1, stretch, 1);

                dummy.updateMatrix();
                ribbonsMeshRef.current!.setMatrixAt(i, dummy.matrix);
            });

            ribbonsMeshRef.current.instanceMatrix.needsUpdate = true;

            // Update ribbon opacity for fade-in effect
            if (ribbonMaterialRef.current) {
                ribbonMaterialRef.current.opacity = 0.8 * tunnelVisibility;
            }
        }

        // ============================================================================
        // IMAGE TILES
        // ============================================================================
        // Combined progress for image visibility (starts in void, not just tunnel)
        // Use peak progress during backward scroll so tile count doesn't drop
        const rawTileProgress = inVoid
            ? (r - TIMELINE.HERO_END) / (TIMELINE.TUNNEL_START - TIMELINE.HERO_END) * 0.15
            : inTunnel
                ? 0.15 + tunnelProgress * 0.85
                : 0;
        const combinedProgress = isScrollingBack
            ? Math.max(rawTileProgress, peakProgressRef.current * 0.85)
            : rawTileProgress;

        const activeRatio = (inVoid || inTunnel)
            ? THREE.MathUtils.clamp(combinedProgress + velocityBoost * 0.2, 0, 1)
            : 0;
        const activeCount = Math.floor(TILE_COUNT * activeRatio);

        for (let i = 0; i < TILE_COUNT; i++) {
            const mesh = tileMeshesRef.current[i];
            if (!mesh) continue;

            const isActive = (inVoid || inTunnel) && i < activeCount;
            mesh.visible = isActive;
            if (!isActive) continue;

            const tileState = tileStatesRef.current[i];
            if (!tileState) continue;
            tileState.z += imageSpeed * delta * (0.68 + tileState.speedJitter * 0.65);

            if (tileState.z > TILE_PASS_Z) {
                resetTileState(tileState, textures.length);
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.map = getTextureOrFallback(textures, tileState.textureIndex);
                mat.needsUpdate = true;
            }

            const t = rangeProgress(tileState.z, tileState.spawnZ, TILE_PASS_Z);
            const radial = THREE.MathUtils.lerp(0.12, tileState.targetRadius, Math.pow(t, 1.16));
            const theta = tileState.theta + t * tileState.spin + tileSwirl;

            mesh.position.set(Math.cos(theta) * radial, Math.sin(theta) * radial, tileState.z);
            mesh.lookAt(0, 0, tileState.z);

            const localScale = THREE.MathUtils.lerp(0.08, tileState.baseScale, Math.pow(t, 1.1));
            const stretch = 1 + velocityBoost * 0.65;
            mesh.scale.set(localScale * stretch, localScale * 0.58, 1);

            const nearFade = 1 - rangeProgress(t, 0.94, 1);
            const opacity =
                tunnelVisibility *
                rangeProgress(t, 0.03, 0.28) *
                nearFade *
                (0.55 + tileState.brightness * 0.55);

            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
        }
    });

    return (
        <>
            {/* Additional lights for tunnel effect */}
            <pointLight position={[0, 0, 10]} intensity={1.5} color="#4deeea" distance={30} decay={2} />

            <group ref={groupRef}>
                {/* RIBBONS - Neon light beams from hyper-spatial-tunnel */}
                <instancedMesh ref={ribbonsMeshRef} args={[undefined, undefined, RIBBON_COUNT]}>
                    <planeGeometry args={[0.2, 5]} />
                    <meshBasicMaterial
                        ref={ribbonMaterialRef}
                        color="#4deeea"
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </instancedMesh>

                {/* IMAGE TILES - Trailer frames */}
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
        </>
    );
};

export default TunnelGroup;
