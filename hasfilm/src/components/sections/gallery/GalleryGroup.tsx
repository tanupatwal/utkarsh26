import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, SCENE_CONFIG, CAMERA_CONFIG } from '../../../config';
import { GALLERY_CONTENT } from '../../../data';
import ThickPanel from './ThickPanel';
import GalleryEffects from './GalleryEffects';

/**
 * GalleryGroup - Cylindrical gallery with rotating curved panels.
 * Visible during the final phase of scroll (GALLERY_START - END).
 */
const GalleryGroup: React.FC = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);
    const silhouetteRef = useRef<THREE.Group>(null);
    const backgroundRef = useRef<THREE.Group>(null); // Ref for Parallax Layer
    const { camera, scene } = useThree();

    // Performance: Only render heavy effects when in/near gallery section
    const [isActive, setIsActive] = React.useState(false);

    // Physics state for inertia/momentum
    const smoothedRot = useRef(0);

    // Add Atmospheric Haze (Fog)
    React.useEffect(() => {
        const oldFog = scene.fog;
        // FogExp2 gives a more organic, exponential falloff than linear Fog
        // Color #050505 matches the deep background
        // Reduced density to 0.012 to prevent "pale" / washed-out colors (visibility ~55% at r=50)
        scene.fog = new THREE.FogExp2('#050505', 0.012);
        return () => {
            scene.fog = oldFog;
        };
    }, [scene]);

    const CAM_POS_START = new THREE.Vector3(
        CAMERA_CONFIG.START.x,
        CAMERA_CONFIG.START.y,
        CAMERA_CONFIG.START.z
    );
    const CAM_POS_END = new THREE.Vector3(
        CAMERA_CONFIG.END.x,
        CAMERA_CONFIG.END.y,
        CAMERA_CONFIG.END.z
    );

    useFrame(() => {
        const r = scroll.offset;

        // Manage active state for performance (Unmount effects when far away)
        // Activation threshold: slightly before ABOUT_STAY to ensure smooth fade in
        const shouldBeActive = r > (TIMELINE.ABOUT_STAY - 0.1);

        if (isActive !== shouldBeActive) {
            setIsActive(shouldBeActive);
        }

        // Return early if not active component context (though hooks still run)
        if (!groupRef.current) return;

        // Hide during about section (Visual visibility)
        if (r < TIMELINE.ABOUT_STAY) {
            groupRef.current.visible = false;
            // No early return here if we want to update other refs, but here visible=false is enough usually.
            // But we need to make sure logic below doesn't run if hidden, or does it?
            // TRANSITION logic needs to run if r >= ABOUT_STAY
            if (r < TIMELINE.ABOUT_STAY) return;
        }

        // If we are here, we are visible
        groupRef.current.visible = true;

        // TRANSITION phase
        if (r >= TIMELINE.ABOUT_STAY && r < TIMELINE.GALLERY_START) {
            const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.GALLERY_START - TIMELINE.ABOUT_STAY);
            const smoothT = t * t * (3 - 2 * t);

            camera.position.lerpVectors(CAM_POS_START, CAM_POS_END, smoothT);

            const scale = THREE.MathUtils.lerp(0.8, 1, smoothT);
            groupRef.current.scale.setScalar(scale);
            groupRef.current.rotation.y = smoothT * 0.2;
        }
        // ACTIVE gallery phase
        else if (r >= TIMELINE.GALLERY_START) {
            camera.position.copy(CAM_POS_END);
            groupRef.current.scale.setScalar(1);

            const rotProgress = (r - TIMELINE.GALLERY_START) / (TIMELINE.END - TIMELINE.GALLERY_START);
            const targetRot = 0.2 + (rotProgress * Math.PI * 1.5);

            // "High-Friction Easing" / Inertia
            // damp(current, target, lambda, delta)
            // lambda: 1-2 = very heavy/viscous. 4-5 = heavy but responsive. 10+ = snappy.
            smoothedRot.current = THREE.MathUtils.damp(smoothedRot.current, targetRot, 4, 1 / 60);

            groupRef.current.rotation.y = smoothedRot.current;

            // PARALLAX: Rotate background at 25% speed of foreground
            if (backgroundRef.current) {
                backgroundRef.current.rotation.y = smoothedRot.current * 0.25;
            }
        }

        camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0, 0]}>
                {/* Always render content geometry, just control visibility via useFrame */}
                {GALLERY_CONTENT.map((item, i) => (
                    <ThickPanel
                        key={i}
                        url={item.url}
                        index={i}
                        total={GALLERY_CONTENT.length}
                        radius={SCENE_CONFIG.CYLINDER_RADIUS}
                        gap={0.008} // Gap between panels in radians
                        thickness={2} // Thickness of the panel
                    />
                ))}

                {/* Inner Glow - Always present when gallery is visible */}
                <pointLight position={[0, 0, 0]} intensity={3} color="#6666ff" distance={25} />

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
