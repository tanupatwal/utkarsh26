import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
    t: number;
    factor: number;
    speed: number;
    xFactor: number;
    yFactor: number;
    zFactor: number;
    mx: number;
    my: number;
}

/**
 * SpeedLines - Animated particles that create a warp speed effect.
 * Adds atmosphere and motion to the 3D scene.
 */
const SpeedLines: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = 1000;

    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo<Particle[]>(() => {
        const temp: Particle[] = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                t: Math.random() * 100,
                factor: 20 + Math.random() * 100,
                speed: 0.01 + Math.random() / 200,
                xFactor: -50 + Math.random() * 100,
                yFactor: -50 + Math.random() * 100,
                zFactor: -50 + Math.random() * 100,
                mx: 0,
                my: 0
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            const { factor, speed, xFactor, yFactor, zFactor } = particle;

            // Update time
            particle.t += speed / 2;
            const t = particle.t;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Mouse interaction
            particle.mx += (state.mouse.x * 10 - particle.mx) * 0.01;
            particle.my += (state.mouse.y * 10 - particle.my) * 0.01;

            // Position based on spherical distribution
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Stretch particles for speed line effect
            dummy.scale.set(s, s, s * 20);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial
                color="#a0a0ff"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    );
};

export default SpeedLines;
