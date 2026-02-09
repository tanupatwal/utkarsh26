import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { SCENE_CONFIG } from '../../../config';

interface ThickPanelProps {
    url: string;
    index: number;
    total: number;
    radius: number;
    gap?: number; // Gap between panels in radians
    thickness?: number; // Thickness of the panel
}

/**
 * ThickPanel - A solid, curved panel with thickness and gaps.
 * Simulates an LED screen wall.
 */
const ThickPanel: React.FC<ThickPanelProps> = ({
    url,
    index,
    total,
    radius,
    gap = 0.05,
    thickness = 2
}) => {
    const texture = useTexture(url);

    // Fix texture orientation
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    // Geometry Constants
    const height = SCENE_CONFIG.CYLINDER_HEIGHT;
    const angleStep = SCENE_CONFIG.CYLINDER_ARC / total;
    // Calculate the actual arc length of the panel (subtracting gap)
    const panelAngle = angleStep - gap;

    // Calculate starting angle (centered)
    // We adjust the offset so the gap is evenly distributed
    const angleOffset = Math.PI + (SCENE_CONFIG.CYLINDER_ARC / 2);
    // Center the panel within its slot: index * angleStep + gap/2
    const thetaStart = angleOffset - (index * angleStep) - panelAngle - (gap / 2);

    // Casing Material (Dark Grey / Metal)
    const casingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7,
        metalness: 0.2
    }), []);

    // Helper to create side geometries
    // The tricky part is positioning the side planes correctly on the curved surface
    // Instead of complex trig for planes, let's use thin boxes at the edges


    return (
        <group>
            {/* FRONT FACE (Image) - Outer Surface */}
            <mesh>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
                />
                <meshBasicMaterial
                    map={texture}
                    side={THREE.DoubleSide}
                    toneMapped={false} // CRITICAL: Preserves true colors against fog/post-processing
                />
                {/* Removed scale=[-1,1,1] to ensure normal orientation */}
            </mesh>

            {/* SATIN FINISH OVERLAY - Creates "Curvature Softness" and "Peripheral Fade" */}
            <mesh>
                <cylinderGeometry
                    args={[radius + 0.05, radius + 0.05, height, 32, 1, true, thetaStart, panelAngle]}
                />
                <meshPhysicalMaterial
                    transparent
                    opacity={0.1}
                    roughness={0.6} // Satin finish
                    metalness={0.1}
                    clearcoat={0.5}
                    clearcoatRoughness={0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* BACK FACE (Casing) - Inner Surface */}
            <mesh>
                <cylinderGeometry
                    args={[radius - thickness, radius - thickness, height, 32, 1, true, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* 
                WAIT. If we view from INSIDE, the "Front Face" is the inner radius surface.
                The "Back Face" is the outer radius surface (behind the screen).
                So:
                Inner Cylinder (Radius R): The Screen
                Outer Cylinder (Radius R + Thickness): The Casing Back
                Sides: Connecting R and R+Thickness
            */}

            {/* TOP CAP */}
            <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                    args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* BOTTOM CAP */}
            <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                    args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* LEFT SIDE CAP (Start of Arc) */}
            <mesh
                position={[
                    (radius - thickness / 2) * Math.sin(thetaStart),
                    0,
                    (radius - thickness / 2) * Math.cos(thetaStart)
                ]}
                rotation={[0, thetaStart, 0]}
            >
                <boxGeometry args={[0.1, height, thickness]} />
                <primitive object={casingMaterial} attach="material" />
            </mesh>

            {/* RIGHT SIDE CAP (End of Arc) */}
            <mesh
                position={[
                    (radius - thickness / 2) * Math.sin(thetaStart + panelAngle),
                    0,
                    (radius - thickness / 2) * Math.cos(thetaStart + panelAngle)
                ]}
                rotation={[0, thetaStart + panelAngle, 0]}
            >
                <boxGeometry args={[0.1, height, thickness]} />
                <primitive object={casingMaterial} attach="material" />
            </mesh>



            {/* REFLECTION (Floor) - Restored Manual Reflection for Guaranteed Visibility */}
            {/* Moved down by 0.2 to create a visible gap from the panel */}
            <mesh position={[0, -height - 0.1, 0]} scale={[1, -1, 1]}>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
                />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={0.3} // Increased slightly for better visibility
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
                <mesh scale={[-1, 1, 1]} />
            </mesh>
        </group>
    );
};

export default ThickPanel;
