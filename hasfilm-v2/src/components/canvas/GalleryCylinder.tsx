import React, { useMemo } from 'react';
import { GALLERY_CONTENT } from '@/data/gallery';
import { useGalleryCylinder } from './useGalleryCylinder';
import { GalleryItem } from './GalleryItem';

export const GalleryCylinder: React.FC = () => {
    const { groupRef } = useGalleryCylinder();
    const radius = 6;
    const count = GALLERY_CONTENT.length;

    const panels = useMemo(() => {
        return GALLERY_CONTENT.map((item, i) => {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            return (
                <GalleryItem
                    key={i}
                    index={i}
                    url={item.url}
                    position={[x, 0, z]}
                    rotation={[0, angle, 0]}
                />
            );
        });
    }, [count, radius]);

    return (
        <group ref={groupRef}>
            {panels}
        </group>
    );
};
