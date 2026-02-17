import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { SCENE_CONFIG, CAMERA_CONFIG } from '../../../config';
import { GALLERY_CONTENT } from '../../../data';
import { galleryProgress } from '../../../hooks/galleryProgress';
import ThickPanel from './ThickPanel';
import GalleryEffects from './GalleryEffects';
import { useGalleryColors, tintFogColor } from '../../../hooks/useGalleryColors';

/**
 * GalleryGroup - Cylindrical gallery with rotating curved panels.
 * Visible during the final phase of scroll (GALLERY_START - END).
 * The last panel disintegrates from left → right when scrolled past.
 */
const GalleryGroup: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const backgroundRef = useRef<THREE.Group>(null); // Ref for Parallax Layer
    const { camera, scene } = useThree();

    // Performance: Only render heavy effects when in/near gallery section
    const [isActive, setIsActive] = React.useState(false);

    // Physics state for inertia/momentum (initialized to 0.2 to match transition end)
    const smoothedRot = useRef(0.2);

    // Dissolve progress refs (0 = visible, 1 = fully dissolved)
    const dissolveProgressRef = useRef(0);       // last panel
    const dissolveProgressRef2 = useRef(0);      // second-to-last panel (delayed)

    // === AMBIENT COLOR SYSTEM ===
    const galleryColors = useGalleryColors();
    const pointLightRef = useRef<THREE.PointLight>(null);
    const ambientLightRef = useRef<THREE.PointLight>(null);
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
    const currentAmbientColor = useRef(new THREE.Color(0.4, 0.4, 1.0));
    const currentFogColor = useRef(new THREE.Color('#050505'));

    // Add Atmospheric Haze (Fog)
    React.useEffect(() => {
        const oldFog = scene.fog;
        scene.fog = new THREE.FogExp2('#050505', 0.012);
        return () => {
            scene.fog = oldFog;
        };
    }, [scene]);

    const CAM_POS_END = new THREE.Vector3(
        CAMERA_CONFIG.END.x,
        CAMERA_CONFIG.END.y,
        CAMERA_CONFIG.END.z
    );

    // === Helper: Update ambient color system ===
    function updateAmbientColors(rawIndex: number, totalItems: number) {
        const colorIndex = Math.max(0, Math.min(Math.round(rawIndex), totalItems - 1));
        const targetColor = galleryColors[colorIndex];
        if (!targetColor) return;

        const dampFactor = 1 - Math.exp(-2.5 * (1 / 60));
        currentAmbientColor.current.lerp(targetColor, dampFactor);

        if (pointLightRef.current) {
            pointLightRef.current.color.copy(currentAmbientColor.current);
        }
        if (ambientLightRef.current) {
            ambientLightRef.current.color.copy(currentAmbientColor.current);
        }
        if (scene.fog && scene.fog instanceof THREE.FogExp2) {
            const targetFog = tintFogColor(currentAmbientColor.current, 0.12);
            currentFogColor.current.lerp(targetFog, dampFactor);
            scene.fog.color.copy(currentFogColor.current);
        }
        if (glowMaterialRef.current) {
            glowMaterialRef.current.color.copy(currentAmbientColor.current);
        }
    }

    useFrame(() => {
        const p = galleryProgress.current; // 0→1 local to gallery section

        // Gallery is active when ScrollTrigger progress is between 0 and 1
        const shouldBeActive = p > 0.001 && p < 0.999;

        if (isActive !== shouldBeActive) {
            setIsActive(shouldBeActive);
        }

        if (!groupRef.current) return;

        // Zero out fog once past the gallery to prevent haze over Highlights
        if (scene.fog && scene.fog instanceof THREE.FogExp2) {
            if (p > 0.97) {
                scene.fog.density = 0;
            } else if (p > 0.001) {
                scene.fog.density = 0.012;
            }
        }

        // Hide when fully outside gallery
        if (p <= 0.001 || p >= 0.999) {
            groupRef.current.visible = false;
            return;
        }

        groupRef.current.visible = true;

        // ── SUB-PHASE BOUNDARIES (local 0→1) ──
        const VIEW_END = 0.85;  // panel rotation ends
        const PAUSE_END = 0.90;  // last panel dwells
        const DISSOLVE_END = 0.97;  // dissolve animation
        // > 0.97 = post-dissolve (hidden)

        const totalItems = GALLERY_CONTENT.length;
        const angleStep = SCENE_CONFIG.CYLINDER_ARC / totalItems;

        // Camera: always at end position during gallery (transition-in handled separately)
        camera.position.copy(CAM_POS_END);
        groupRef.current.scale.setScalar(1);

        if (p < VIEW_END) {
            // ── VIEWING: Sticky scroll through panels ──
            const rotProgress = p / VIEW_END; // 0→1 within viewing phase

            const rawIndex = Math.max(0, Math.min(rotProgress * totalItems - 0.5, totalItems - 1));
            const index = Math.min(Math.floor(rawIndex), totalItems - 2);
            let frac = index >= 0 ? rawIndex - index : 0;

            if (rawIndex >= totalItems - 1) { frac = 0; }

            // Sticky easing
            if (frac < 0.5) {
                frac = 4 * frac * frac * frac;
            } else {
                frac = 1 - Math.pow(-2 * frac + 2, 3) / 2;
            }

            const stickyIndex = rawIndex >= totalItems - 1 ? totalItems - 1 : index + frac;
            const stickyRot = 0.2 + (stickyIndex * angleStep);

            smoothedRot.current = THREE.MathUtils.damp(smoothedRot.current, stickyRot, 5, 1 / 60);
            groupRef.current.rotation.y = smoothedRot.current;

            // PARALLAX
            if (backgroundRef.current) {
                backgroundRef.current.rotation.y = smoothedRot.current * 0.25;
            }

            dissolveProgressRef.current = 0;
            dissolveProgressRef2.current = 0;

            if (pointLightRef.current) pointLightRef.current.intensity = 3;
            if (ambientLightRef.current) ambientLightRef.current.intensity = 1.5;
            updateAmbientColors(rawIndex, totalItems);

        } else if (p < PAUSE_END) {
            // ── PAUSE: Last panel dwells, HUD fades ──
            const lastPanelRot = 0.2 + ((totalItems - 1) * angleStep);
            smoothedRot.current = THREE.MathUtils.damp(smoothedRot.current, lastPanelRot, 5, 1 / 60);
            groupRef.current.rotation.y = smoothedRot.current;

            dissolveProgressRef.current = 0;
            dissolveProgressRef2.current = 0;
            if (pointLightRef.current) pointLightRef.current.intensity = 3;
            if (ambientLightRef.current) ambientLightRef.current.intensity = 1.5;
            updateAmbientColors(totalItems - 1, totalItems);

        } else if (p < DISSOLVE_END) {
            // ── DISSOLVE: Panels dissolve, group fades out ──
            const lastPanelRot = 0.2 + ((totalItems - 1) * angleStep);
            smoothedRot.current = THREE.MathUtils.damp(smoothedRot.current, lastPanelRot, 5, 1 / 60);
            groupRef.current.rotation.y = smoothedRot.current;

            // Dissolve progress: 0 → 1
            const dissolveT = (p - PAUSE_END) / (DISSOLVE_END - PAUSE_END);
            const clampedT = Math.max(0, Math.min(1, dissolveT));
            const eased = clampedT < 0.5
                ? 2 * clampedT * clampedT
                : 1 - Math.pow(-2 * clampedT + 2, 2) / 2;
            dissolveProgressRef.current = eased;

            // Second-to-last panel: delayed, caps at ~40%
            const delay2 = 0.35;
            const raw2 = Math.max(0, (clampedT - delay2) / (1 - delay2));
            dissolveProgressRef2.current = Math.min(0.4, raw2 * 0.6);

            // Camera zoom: inward toward panels during dissolve
            const ZOOM_TARGET_Z = 50;
            const zoomT = clampedT * clampedT * clampedT;
            const targetZ = THREE.MathUtils.lerp(CAM_POS_END.z, ZOOM_TARGET_Z, zoomT);
            camera.position.set(CAM_POS_END.x, CAM_POS_END.y, targetZ);

            // Light fade
            const lightFade = clampedT * clampedT * clampedT;
            if (pointLightRef.current) {
                pointLightRef.current.intensity = THREE.MathUtils.lerp(3, 0, lightFade);
            }
            if (ambientLightRef.current) {
                ambientLightRef.current.intensity = THREE.MathUtils.lerp(1.5, 0, lightFade);
            }

            updateAmbientColors(totalItems - 1, totalItems);

        } else {
            // ── POST-DISSOLVE: Gallery fully dissolved ──
            const lastPanelRot = 0.2 + ((totalItems - 1) * angleStep);
            smoothedRot.current = THREE.MathUtils.damp(smoothedRot.current, lastPanelRot, 5, 1 / 60);
            groupRef.current.rotation.y = smoothedRot.current;

            dissolveProgressRef.current = 1;
            dissolveProgressRef2.current = 0.4;
            camera.position.set(CAM_POS_END.x, CAM_POS_END.y, 50);

            if (pointLightRef.current) pointLightRef.current.intensity = 0;
            if (ambientLightRef.current) ambientLightRef.current.intensity = 0;

            updateAmbientColors(totalItems - 1, totalItems);
        }

        camera.lookAt(0, 0, 0);
    });

    const lastIndex = GALLERY_CONTENT.length - 1;
    const secondLastIndex = GALLERY_CONTENT.length - 2;

    return (
        <>
            <group ref={groupRef} position={[0, 0, 0]}>
                {GALLERY_CONTENT.map((item, i) => {
                    // Determine which dissolve ref to pass
                    let panelDissolveRef: React.RefObject<number> | undefined;
                    if (i === lastIndex) panelDissolveRef = dissolveProgressRef;
                    else if (i === secondLastIndex) panelDissolveRef = dissolveProgressRef2;

                    return (
                        <ThickPanel
                            key={i}
                            url={item.url}
                            index={i}
                            total={GALLERY_CONTENT.length}
                            radius={SCENE_CONFIG.CYLINDER_RADIUS}
                            gap={0.008}
                            thickness={2}
                            dissolveProgressRef={panelDissolveRef}
                        />
                    );
                })}

                {/* Inner Glow - Dynamic ambient color from focused image */}
                <pointLight ref={pointLightRef} position={[0, 0, 0]} intensity={3} color="#6666ff" distance={25} />

                {/* Secondary Ambient Fill Light - wider, softer spread */}
                <pointLight ref={ambientLightRef} position={[0, 5, 0]} intensity={1.5} color="#6666ff" distance={60} />

                {/* Ambient Glow Sphere - subtle volumetric color wash */}
                <mesh>
                    <sphereGeometry args={[SCENE_CONFIG.CYLINDER_RADIUS * 0.75, 32, 32]} />
                    <meshBasicMaterial
                        ref={glowMaterialRef}
                        color="#6666ff"
                        transparent
                        opacity={0.025}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* HEAVY EFFECTS - Only mount when near gallery to save Hero performance */}
                {isActive && (
                    <>
                        {/* PARALLAX LAYER: Floating Dust / Sparkles */}
                        <group ref={backgroundRef}>
                            <Sparkles
                                count={200}
                                scale={[SCENE_CONFIG.CYLINDER_RADIUS * 1.5, SCENE_CONFIG.CYLINDER_HEIGHT, SCENE_CONFIG.CYLINDER_RADIUS * 1.5]}
                                size={4}
                                speed={0.4}
                                opacity={0.5}
                                color="#ffffff"
                            />
                        </group>

                        <GalleryEffects />

                        {/* Reflection Occluder - Blocks the view of the back-side reflections */}
                        <mesh position={[0, -SCENE_CONFIG.CYLINDER_HEIGHT - 0.2, 0]}>
                            <cylinderGeometry args={[SCENE_CONFIG.CYLINDER_RADIUS - 0.1, SCENE_CONFIG.CYLINDER_RADIUS - 0.1, SCENE_CONFIG.CYLINDER_HEIGHT, 64, 1, true]} />
                            <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
                        </mesh>
                    </>
                )}
            </group>
        </>
    );
};

export default GalleryGroup;
