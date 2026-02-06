import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { SCENE_CONFIG } from '../../../config';

interface CurvedPanelProps {
    url: string;
    index: number;
    total: number;
    radius: number;
}

/**
 * CurvedPanel - A single curved panel in the cylindrical gallery.
 * Creates a segment of a cylinder with an image texture and floor reflection.
 */
const CurvedPanel: React.FC<CurvedPanelProps> = ({ url, index, total, radius }) => {
    const texture = useTexture(url);

    // Fix texture orientation for outside viewing
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    // Calculate angle for semi-cylinder arc
    const angleStep = SCENE_CONFIG.CYLINDER_ARC / total;
    const angleOffset = Math.PI + (SCENE_CONFIG.CYLINDER_ARC / 2);
    const thetaStart = angleOffset - (index * angleStep) - angleStep;

    // Depth of field effect - center panels are brighter
    const centerIndex = (total - 1) / 2;
    const distanceFromCenter = Math.abs(index - centerIndex) / centerIndex;
    const opacity = THREE.MathUtils.lerp(1, 0.3, distanceFromCenter * distanceFromCenter);

    const height = SCENE_CONFIG.CYLINDER_HEIGHT;

    return (
        <group>
            {/* Main Image Segment */}
            <mesh>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, angleStep]}
                />
                <meshBasicMaterial
                    map={texture}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={opacity}
                />
                <mesh scale={[-1, 1, 1]} />
            </mesh>

            {/* Floor Reflection Segment */}
            <mesh position={[0, -height + 0.1, 0]} scale={[1, -1, 1]}>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, angleStep]}
                />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={opacity * 0.2}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
                <mesh scale={[-1, 1, 1]} />
            </mesh>
        </group>
    );
};

export default CurvedPanel;
