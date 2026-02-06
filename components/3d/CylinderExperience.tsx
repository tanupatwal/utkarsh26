'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Text, useTexture, Preload } from '@react-three/drei';
import * as THREE from 'three';
import {
    ALL_TUNNEL_IMAGES,
    TUNNEL_RADIUS,
    FOG_COLOR,
    CYLINDER_RADIUS
} from '@/lib/vortexConstants';
import SpeedLines from './SpeedLines';

// --- SCROLL CONTEXT: Syncs with native page scroll ---

interface ScrollContextValue {
    offset: number;
}

const ScrollContext = React.createContext<ScrollContextValue>({ offset: 0 });

export const useNativeScroll = () => React.useContext(ScrollContext);

export const NativeScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const newOffset = maxScroll > 0 ? scrollY / maxScroll : 0;
            setOffset(newOffset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Get initial value
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ScrollContext.Provider value={{ offset }}>
            {children}
        </ScrollContext.Provider>
    );
};

// --- TUNNEL GROUP: Images spiral from far away toward camera ---

const TunnelGroup: React.FC = () => {
    const { offset } = useNativeScroll();
    const groupRef = useRef<THREE.Group>(null);

    // Timeline: 0.0 to 0.4 - tunnel phase
    const END_TUNNEL = 0.4;
    const TUNNEL_DIST = 100;

    useFrame(() => {
        if (!groupRef.current) return;
        const r = offset;

        // Only active in first phase
        if (r > 0.5) {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        // Movement - images fly toward camera
        const progress = Math.min(r / END_TUNNEL, 1);
        groupRef.current.position.z = progress * TUNNEL_DIST;
        groupRef.current.rotation.z = progress * Math.PI * 2; // Rotation for vortex effect

        // Fade out as we approach the end of tunnel
        if (progress > 0.85) {
            const fadeProgress = (progress - 0.85) / 0.15;
            groupRef.current.scale.setScalar(1 - fadeProgress);
        } else {
            groupRef.current.scale.setScalar(1);
        }
    });

    return (
        <group ref={groupRef}>
            {ALL_TUNNEL_IMAGES.map((item, i) => {
                const angle = (i / ALL_TUNNEL_IMAGES.length) * Math.PI * 2;
                const z = -10 + i * -8; // Staggered depth
                return (
                    <Image
                        key={i}
                        url={item.url}
                        transparent
                        side={THREE.DoubleSide}
                        position={[
                            Math.cos(angle) * TUNNEL_RADIUS,
                            Math.sin(angle) * TUNNEL_RADIUS,
                            z
                        ]}
                        rotation={[0, 0, angle - Math.PI / 2]}
                        scale={[4, 3]}
                    />
                );
            })}
        </group>
    );
};

// --- ABOUT US PANEL: Text on the cylinder wall ---

const AboutUsPanel: React.FC<{ radius: number; angle: number }> = ({ radius, angle }) => {
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const rotY = -angle + Math.PI / 2;

    return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
            {/* Background Panel */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[10, 6]} />
                <meshBasicMaterial color="black" transparent opacity={0.85} />
            </mesh>

            {/* Title */}
            <Text
                position={[0, 1.5, 0]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={8}
            >
                ABOUT UTKARSH
            </Text>

            {/* Description */}
            <Text
                position={[0, -0.3, 0]}
                fontSize={0.25}
                color="#cccccc"
                anchorX="center"
                anchorY="top"
                maxWidth={7}
                lineHeight={1.6}
            >
                {`Utkarsh, formerly known as INNOVIZ, is a three-day extravaganza
celebrating arts, culture, and engineering. Since 2006, it has
established itself as a premier tech fest in Delhi & NCR.

Join us in pushing boundaries, redefining the present,
and pioneering a smarter tomorrow.`}
            </Text>

            {/* Stats */}
            <group position={[0, -2.2, 0]}>
                <Text position={[-3, 0, 0]} fontSize={0.35} color="#FFD700" anchorX="center">
                    18+
                </Text>
                <Text position={[-3, -0.4, 0]} fontSize={0.12} color="#888888" anchorX="center">
                    YEARS
                </Text>

                <Text position={[0, 0, 0]} fontSize={0.35} color="#FFD700" anchorX="center">
                    20k+
                </Text>
                <Text position={[0, -0.4, 0]} fontSize={0.12} color="#888888" anchorX="center">
                    FOOTFALL
                </Text>

                <Text position={[3, 0, 0]} fontSize={0.35} color="#FFD700" anchorX="center">
                    50+
                </Text>
                <Text position={[3, -0.4, 0]} fontSize={0.12} color="#888888" anchorX="center">
                    EVENTS
                </Text>
            </group>
        </group>
    );
};

// --- CURVED IMAGE PANEL: For cylindrical gallery ---

const CurvedPanel: React.FC<{
    url: string;
    index: number;
    total: number;
    radius: number;
    startAngle: number;
}> = ({ url, index, total, radius, startAngle }) => {
    const texture = useTexture(url);

    // Distribute panels around the cylinder (reserve space for About panel)
    const angleStep = (Math.PI * 2) / (total + 1);
    const angle = startAngle + (index + 1) * angleStep;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return (
        <mesh position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <planeGeometry args={[4, 3]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />

            {/* Reflection effect */}
            <mesh position={[0, -3.1, 0]} scale={[1, -1, 1]}>
                <planeGeometry args={[4, 3]} />
                <meshBasicMaterial map={texture} transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
        </mesh>
    );
};

// --- GALLERY GROUP: Cylindrical layout with camera animation ---

const GalleryGroup: React.FC = () => {
    const { offset } = useNativeScroll();
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Timeline Configuration
    const PHASE_TUNNEL_END = 0.35;
    const PHASE_ABOUT_START = 0.4;
    const PHASE_ABOUT_READ = 0.55;
    const PHASE_MORPH = 0.7;
    const PHASE_ROTATE = 1.0;

    const ABOUT_ANGLE = -Math.PI / 2;

    // Use first 6 images for gallery panels
    const galleryImages = ALL_TUNNEL_IMAGES.slice(0, 6);

    useFrame((state) => {
        if (!groupRef.current) return;
        const r = offset;

        // 1. VISIBILITY - Only show after tunnel phase
        if (r < PHASE_TUNNEL_END) {
            groupRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;

        // Target Positions
        const center = new THREE.Vector3(0, 0, 0);
        const readingPos = new THREE.Vector3(0, 0, -CYLINDER_RADIUS + 4);

        // Phase: Fly in from tunnel to reading position
        if (r >= PHASE_TUNNEL_END && r < PHASE_ABOUT_START) {
            const t = (r - PHASE_TUNNEL_END) / (PHASE_ABOUT_START - PHASE_TUNNEL_END);
            camera.position.lerpVectors(new THREE.Vector3(0, 0, 40), readingPos, t);
            camera.lookAt(0, 0, -CYLINDER_RADIUS - 10);
        }

        // Phase: Reading (Static with subtle breathe)
        else if (r >= PHASE_ABOUT_START && r < PHASE_ABOUT_READ) {
            camera.position.copy(readingPos);
            camera.position.z += Math.sin(state.clock.elapsedTime) * 0.1;
            camera.lookAt(0, 0, -CYLINDER_RADIUS - 10);
            groupRef.current.rotation.y = 0;
        }

        // Phase: Pull back to center
        else if (r >= PHASE_ABOUT_READ && r < PHASE_MORPH) {
            const t = (r - PHASE_ABOUT_READ) / (PHASE_MORPH - PHASE_ABOUT_READ);
            const ease = 1 - Math.pow(1 - t, 3); // Ease out cubic
            camera.position.lerpVectors(readingPos, center, ease);
            camera.lookAt(0, 0, -CYLINDER_RADIUS - 10);
        }

        // Phase: Rotate the gallery
        else if (r >= PHASE_MORPH) {
            camera.position.copy(center);
            const t = (r - PHASE_MORPH) / (PHASE_ROTATE - PHASE_MORPH);
            groupRef.current.rotation.y = t * Math.PI * 2;
            camera.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            camera.lookAt(0, 0, -10);
        }
    });

    return (
        <group ref={groupRef}>
            {/* About Us Panel on cylinder wall */}
            <AboutUsPanel radius={CYLINDER_RADIUS} angle={ABOUT_ANGLE} />

            {/* Gallery image panels */}
            {galleryImages.map((item, i) => (
                <CurvedPanel
                    key={i}
                    url={item.url}
                    index={i}
                    total={galleryImages.length}
                    radius={CYLINDER_RADIUS}
                    startAngle={ABOUT_ANGLE}
                />
            ))}

            {/* Floor grid for spatial context */}
            <gridHelper args={[40, 40, 0x222222, 0x111111]} position={[0, -4, 0]} />
        </group>
    );
};

// --- MAIN EXPERIENCE ---

const CylinderExperience: React.FC = () => {
    return (
        <NativeScrollProvider>
            <color attach="background" args={[FOG_COLOR]} />
            <fog attach="fog" args={[FOG_COLOR, 10, 80]} />

            <ambientLight intensity={0.5} />
            {/* Cylinder interior lighting */}
            <pointLight position={[0, 0, 0]} intensity={1.5} distance={20} decay={2} />
            {/* Tunnel accent light */}
            <spotLight position={[0, 0, 20]} angle={0.5} penumbra={1} intensity={1} color="#4444ff" />

            <SpeedLines />
            <TunnelGroup />
            <GalleryGroup />
            <Preload all />
        </NativeScrollProvider>
    );
};

export default CylinderExperience;
