import React, { useRef, useState } from 'react';
import { Image, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';

interface GalleryItemProps {
    index: number;
    url: string;
    position: [number, number, number];
    rotation: [number, number, number];
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ index, url, position, rotation }) => {
    const ref = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((_state, delta) => {
        if (!ref.current) return;
        // Scale up slightly on hover
        easing.damp3(ref.current.scale, hovered ? 1.1 : 1, 0.1, delta);
    });

    return (
        <group
            ref={ref}
            position={position}
            rotation={rotation}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <Image
                url={url}
                transparent
                side={THREE.DoubleSide}
                scale={[1.5, 2.2]} // Width, Height
            />

            {/* Optional Number/Text on top */}
            <Text
                position={[0, -1.3, 0.1]}
                fontSize={0.1}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/SpaceGrotesk-Medium.ttf" // We need to check if fonts exist, otherwise default
            >
                {`0${index + 1}`}
            </Text>
        </group>
    );
};
