import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, rangeProgress } from '../../../config';

/**
 * FlatAboutSection - Dark 3D backdrop panel for the About section.
 * Content is now rendered by the HTML-based AboutSection overlay.
 * This just provides a subtle dark panel behind the content during
 * the About phase of scroll (ABOUT_START → TRANSITION).
 */
const FlatAboutSection: React.FC = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        const r = scroll.offset;

        // Visibility window
        if (r < TIMELINE.ABOUT_START || r > TIMELINE.TRANSITION + 0.1) {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        // Calculate opacity
        let opacity = 1;
        const aboutFadeInEnd = TIMELINE.ABOUT_START + 0.03;
        if (r < aboutFadeInEnd) {
            opacity = rangeProgress(r, TIMELINE.ABOUT_START, aboutFadeInEnd);
        }

        // Slide and fade out during transition to gallery
        let xPos = 0;
        if (r > TIMELINE.ABOUT_STAY) {
            const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
            xPos = -30 * t * t;
            opacity = Math.max(0, 1 - t * 1.5);
        }

        groupRef.current.position.x = xPos;

        // Update opacity for all children
        groupRef.current.children.forEach((child) => {
            if ((child as THREE.Mesh).material) {
                const mat = (child as THREE.Mesh).material as THREE.Material;
                mat.opacity = opacity * (mat.userData.baseOpacity || 1);
                mat.transparent = true;
            }
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, -5]}>
            {/* Dark backdrop panel */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[20, 12]} />
                <meshBasicMaterial
                    color="#050505"
                    transparent
                    opacity={0.95}
                    userData={{ baseOpacity: 0.95 }}
                />
            </mesh>
        </group>
    );
};

export default FlatAboutSection;

