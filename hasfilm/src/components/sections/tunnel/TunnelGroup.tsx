import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, SCENE_CONFIG, TRANSITION_CONFIG, rangeProgress } from '../../../config';
import { CONTENT } from '../../../data';

const TUNNEL_DIST = 190;
const TUNNEL_ENTRY_OFFSET = -42;

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
        const easedProgress = progress * progress * (3 - 2 * progress);
        groupRef.current.position.z = TUNNEL_ENTRY_OFFSET + easedProgress * TUNNEL_DIST;
        groupRef.current.rotation.z = easedProgress * Math.PI * 10;
        groupRef.current.rotation.x = 0;

        // Fade in after deep-void phase
        const revealScale = rangeProgress(
            r,
            TRANSITION_CONFIG.TUNNEL_REVEAL_START,
            TRANSITION_CONFIG.TUNNEL_REVEAL_FULL
        );

        let scalar = Math.max(0.001, revealScale);

        // Fade out at end of tunnel phase
        if (r > TIMELINE.TUNNEL_END - 0.03) {
            const fadeOut = 1 - (r - (TIMELINE.TUNNEL_END - 0.03)) / 0.03;
            scalar *= Math.max(0, fadeOut);
        }

        groupRef.current.scale.setScalar(scalar);
    });

    return (
        <group ref={groupRef}>
            {CONTENT.map((item, i) => {
                const angle = i * 0.72;
                const radiusPulse = 0.78 + Math.sin(i * 0.9) * 0.28;
                const radius = SCENE_CONFIG.TUNNEL_RADIUS * radiusPulse;
                const z = -22 - i * 11.5;
                return (
                    <Image
                        key={i}
                        url={item.url}
                        transparent
                        side={THREE.DoubleSide}
                        position={[
                            Math.cos(angle) * radius,
                            Math.sin(angle) * radius,
                            z
                        ]}
                        rotation={[Math.sin(i * 0.35) * 0.12, Math.cos(i * 0.27) * 0.08, angle - Math.PI / 2]}
                        scale={[6, 3.4]}
                        opacity={0.92}
                    />
                );
            })}
        </group>
    );
};

export default TunnelGroup;
