import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { TIMELINE, SCENE_CONFIG, CAMERA_CONFIG } from '../../../config';
import { GALLERY_CONTENT } from '../../../data';
import CurvedPanel from './CurvedPanel';

/**
 * GalleryGroup - Cylindrical gallery with rotating curved panels.
 * Visible during the final phase of scroll (GALLERY_START - END).
 */
const GalleryGroup: React.FC = () => {
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);
    const silhouetteRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    const CAM_POS_START = new THREE.Vector3(
        CAMERA_CONFIG.START.x,
        CAMERA_CONFIG.START.y,
        CAMERA_CONFIG.START.z
    );
    const CAM_POS_END = new THREE.Vector3(
        CAMERA_CONFIG.END.x,
        CAMERA_CONFIG.END.y,
        CAMERA_CONFIG.END.z
    );

    useFrame(() => {
        if (!groupRef.current) return;
        const r = scroll.offset;

        // Hide during about section
        if (r < TIMELINE.ABOUT_STAY) {
            groupRef.current.visible = false;
            if (silhouetteRef.current) silhouetteRef.current.visible = false;
            return;
        }
        groupRef.current.visible = true;
        if (silhouetteRef.current) silhouetteRef.current.visible = true;

        // TRANSITION phase
        if (r >= TIMELINE.ABOUT_STAY && r < TIMELINE.GALLERY_START) {
            const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.GALLERY_START - TIMELINE.ABOUT_STAY);
            const smoothT = t * t * (3 - 2 * t);

            camera.position.lerpVectors(CAM_POS_START, CAM_POS_END, smoothT);

            const scale = THREE.MathUtils.lerp(0.8, 1, smoothT);
            groupRef.current.scale.setScalar(scale);
            groupRef.current.rotation.y = smoothT * 0.2;
        }
        // ACTIVE gallery phase
        else if (r >= TIMELINE.GALLERY_START) {
            camera.position.copy(CAM_POS_END);
            groupRef.current.scale.setScalar(1);

            const rotProgress = (r - TIMELINE.GALLERY_START) / (TIMELINE.END - TIMELINE.GALLERY_START);
            groupRef.current.rotation.y = 0.2 + (rotProgress * Math.PI * 1.5);
        }

        camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <group ref={groupRef} position={[0, 0, 0]}>
                {GALLERY_CONTENT.map((item, i) => (
                    <CurvedPanel
                        key={i}
                        url={item.url}
                        index={i}
                        total={GALLERY_CONTENT.length}
                        radius={SCENE_CONFIG.CYLINDER_RADIUS}
                    />
                ))}

                {/* Inner Glow */}
                <pointLight position={[0, 0, 0]} intensity={3} color="#6666ff" distance={25} />
            </group>
        </>
    );
};

export default GalleryGroup;
