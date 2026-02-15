import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/stores/useScrollStore';

export function useGalleryCylinder() {
    const groupRef = useRef<THREE.Group>(null);
    const progress = useScrollStore((state) => state.progress);
    const targetRotation = useRef(0);

    // Calculate total rotation based on scroll progress
    // Map 0-1 progress to ~360 degrees rotation for the gallery segment
    // Adjust multiplier to control speed
    useFrame((state, delta) => {
        if (!state || !groupRef.current) return;

        // Determine if we are in the gallery zone
        // Assuming gallery is active from approx 0.25 to 0.55 progress range
        // We can fine-tune this with the store's activeSection later
        // For now, simple mapping

        // Smooth rotation
        const ROTATION_FACTOR = Math.PI * 2; // Full rotation
        const target = -progress * ROTATION_FACTOR * 4; // 4 full spins over the page height

        // Lerp current rotation to target
        targetRotation.current = THREE.MathUtils.damp(
            targetRotation.current,
            target,
            4, // damping factor
            delta
        );

        groupRef.current.rotation.y = targetRotation.current;
    });

    return { groupRef };
}
