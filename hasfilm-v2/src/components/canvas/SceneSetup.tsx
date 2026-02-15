import React from 'react';

export const SceneSetup: React.FC = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <fog attach="fog" args={['#050505', 5, 20]} />
        </>
    );
};
