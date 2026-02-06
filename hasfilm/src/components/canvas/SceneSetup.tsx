import React from 'react';
import { SCENE_CONFIG } from '../../config';

/**
 * SceneSetup - Configures lighting, fog, and background for the 3D scene.
 */
const SceneSetup: React.FC = () => {
    return (
        <>
            {/* No background color - canvas is transparent to show hero image */}
            {/* Fog starts later for depth during tunnel/gallery phases */}
            <fog attach="fog" args={[SCENE_CONFIG.FOG_COLOR, 15, 60]} />

            {/* Ambient lighting */}
            <ambientLight intensity={0.5} />

            {/* Key lights */}
            <spotLight
                position={[-10, 20, 10]}
                angle={0.6}
                penumbra={0.5}
                intensity={1.5}
                color="#e0e0ff"
            />
            <spotLight
                position={[10, 5, 20]}
                angle={0.4}
                penumbra={1}
                intensity={1}
                color="#a0a0ff"
            />
        </>
    );
};

export default SceneSetup;
