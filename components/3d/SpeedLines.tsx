'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Native scroll hook (matches CylinderExperience)
const useNativeScrollOffset = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const newOffset = maxScroll > 0 ? scrollY / maxScroll : 0;
            setOffset(newOffset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return offset;
};

interface SpeedLinesProps {
    count?: number;
    maxRadius?: number;
}

const SpeedLines: React.FC<SpeedLinesProps> = ({ count = 500, maxRadius = 10 }) => {
    const meshRef = useRef<THREE.Points>(null);
    const scrollOffset = useNativeScrollOffset();
    const scrollRef = useRef(scrollOffset);
    scrollRef.current = scrollOffset;

    // Generate random positions for particles
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Cylindrical distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * maxRadius;

            pos[i3] = Math.cos(angle) * radius;     // X
            pos[i3 + 1] = Math.sin(angle) * radius; // Y
            pos[i3 + 2] = -Math.random() * 100;     // Z - spread along depth

            vel[i] = 0.5 + Math.random() * 0.5;     // Speed variation
        }

        return [pos, vel];
    }, [count, maxRadius]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const scrollProgress = scrollRef.current;
        const positions = meshRef.current.geometry.attributes.position.array as Float32Array;

        // Only animate during tunnel phase (first 40% of scroll)
        const tunnelPhase = Math.min(scrollProgress / 0.4, 1);
        const intensity = tunnelPhase < 1 ? Math.sin(tunnelPhase * Math.PI) : 0;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Move particles toward camera (positive Z)
            positions[i3 + 2] += velocities[i] * intensity * 2 * 60 * delta;

            // Reset particles that pass the camera
            if (positions[i3 + 2] > 10) {
                positions[i3 + 2] = -100;
            }
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;

        // Fade out as we exit tunnel
        const material = meshRef.current.material as THREE.PointsMaterial;
        material.opacity = intensity * 0.6;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#ffffff"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

export default SpeedLines;
