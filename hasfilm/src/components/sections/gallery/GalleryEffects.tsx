// @ts-nocheck
import React from 'react';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';

/**
 * GalleryEffects - Handles post-processing for the gallery scene.
 */
const GalleryEffects = () => {
    return (
        <EffectComposer disableNormalPass>
            {/* Bloom for "Volumetric Glow" and "Diffuse Radiosity" */}
            <Bloom
                luminanceThreshold={0.5}
                mipmapBlur
                intensity={1.5}
                radius={0.6}
            />

            {/* Noise for "Atmospheric Haze" texture */}
            <Noise opacity={0.05} />

            {/* Vignette for focus */}
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
    );
};

export default GalleryEffects;
