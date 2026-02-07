import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, rangeProgress } from '../../../config';

const INTER_FONT_URL = "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff";

/**
 * FlatAboutSection - Displays the "About Us" content as a flat panel.
 * Visible during the middle phase of scroll (ABOUT_START - TRANSITION).
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
            if ((child as any).fillOpacity !== undefined) {
                (child as any).fillOpacity = opacity;
            }
            if ((child as THREE.Mesh).material) {
                const mat = (child as THREE.Mesh).material as THREE.Material;
                mat.opacity = opacity * (mat.userData.baseOpacity || 1);
                mat.transparent = true;
            }
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, -5]}>
            {/* Background panel */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[14, 9]} />
                <meshBasicMaterial
                    color="#050505"
                    transparent
                    opacity={0.95}
                    userData={{ baseOpacity: 0.95 }}
                />
            </mesh>

            {/* Title */}
            <Text
                position={[0, 2, 0]}
                fontSize={1.2}
                font={INTER_FONT_URL}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
            >
                ABOUT US
            </Text>

            {/* Description */}
            <Text
                position={[0, 0, 0]}
                fontSize={0.35}
                font={INTER_FONT_URL}
                color="#cccccc"
                anchorX="center"
                anchorY="middle"
                maxWidth={8}
                lineHeight={1.6}
            >
                We are the architects of the digital void.
                Exploring the boundaries between memory, space, and time.
                Our mission is to curate the unexplainable and
                visualize the impossible.
            </Text>

            {/* Divider line */}
            <mesh position={[0, -1.5, 0]}>
                <planeGeometry args={[2, 0.02]} />
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.5}
                    userData={{ baseOpacity: 0.5 }}
                />
            </mesh>

            {/* CTA text */}
            <Text
                position={[0, -2.5, 0]}
                fontSize={0.15}
                color="#4444ff"
                anchorX="center"
                letterSpacing={0.2}
            >
                SCROLL TO VIEW ARCHIVE
            </Text>
        </group>
    );
};

export default FlatAboutSection;
