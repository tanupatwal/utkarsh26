import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, SCENE_CONFIG, TRANSITION_CONFIG, rangeProgress } from '../../../config';
import { CONTENT } from '../../../data';

const TUNNEL_DIST = 80;

/**
 * TunnelGroup - Creates a spiral tunnel of images that the user flies through.
 * Visible during the first phase of scroll (0 - TUNNEL_END).
 */
const TunnelGroup: React.FC = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        const r = scroll.offset;

        // Tunnel should not be visible during hero hold/zoom stage
        if (r < TRANSITION_CONFIG.TUNNEL_REVEAL_START) {
            groupRef.current.visible = false;
            return;
        }

        // Hide when past the about section
        if (r > TIMELINE.ABOUT_START + 0.1) {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        // Move tunnel forward only after reveal starts
        const progress = rangeProgress(r, TRANSITION_CONFIG.TUNNEL_REVEAL_START, TIMELINE.TUNNEL_END);
        groupRef.current.position.z = progress * TUNNEL_DIST;
        groupRef.current.rotation.z = progress * Math.PI * 2;

        // Fade in under blackout release
        const revealScale = rangeProgress(
            r,
            TRANSITION_CONFIG.TUNNEL_REVEAL_START,
            TRANSITION_CONFIG.BLACKOUT_RELEASE_END
        );

        let scalar = Math.max(0.001, revealScale);

        // Fade out at end of tunnel phase
        if (r > TIMELINE.TUNNEL_END - 0.05) {
            const fadeOut = 1 - (r - (TIMELINE.TUNNEL_END - 0.05)) / 0.05;
            scalar *= Math.max(0, fadeOut);
        }

        groupRef.current.scale.setScalar(scalar);
    });

    return (
        <group ref={groupRef}>
            {CONTENT.map((item, i) => {
                const angle = (i / CONTENT.length) * Math.PI * 2;
                const z = -10 + i * -15;
                return (
                    <Image
                        key={i}
                        url={item.url}
                        transparent
                        side={THREE.DoubleSide}
                        position={[
                            Math.cos(angle) * SCENE_CONFIG.TUNNEL_RADIUS,
                            Math.sin(angle) * SCENE_CONFIG.TUNNEL_RADIUS,
                            z
                        ]}
                        rotation={[0, 0, angle - Math.PI / 2]}
                        scale={[4, 5]}
                        opacity={0.6}
                    />
                );
            })}
        </group>
    );
};

export default TunnelGroup;
