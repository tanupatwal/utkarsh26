import React from 'react';

export const SceneSetup: React.FC = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
        </>
    );
};

export const GalleryCylinder: React.FC = () => {
    return (
        <group>
            <mesh position={[0, 0, -5]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="hotpink" />
            </mesh>
        </group>
    );
};
