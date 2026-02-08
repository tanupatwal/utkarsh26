import React from 'react';
import { ScrollControls, Scroll } from '@react-three/drei';
import { SCROLL_CONFIG } from '../../config';

// Canvas components
import SceneSetup from './SceneSetup';

// Section components
import { TunnelGroup } from '../sections/tunnel';
import { FlatAboutSection } from '../sections/about';
import { GalleryGroup } from '../sections/gallery';

// Effects
// import { SpeedLines } from '../effects'; // Disabled - removed neon particle effect

// Overlays
import { HeroOverlay, AnimatedBackground } from '../overlays';

/**
 * Experience - Main 3D scene orchestrator.
 * Composes all sections and manages scroll-based navigation.
 */
const Experience: React.FC = () => {
    return (
        <>
            <SceneSetup />
            {/* <SpeedLines /> Disabled - removed neon particle effect */}

            <ScrollControls pages={SCROLL_CONFIG.PAGES} damping={0.2}>
                <TunnelGroup />
                <FlatAboutSection />
                <GalleryGroup />

                <Scroll html style={{ width: '100%', height: '100%' }}>
                    {/* Fixed-feel overlays with scroll compensation */}
                    <AnimatedBackground />
                    {/* Foreground title overlay */}
                    <HeroOverlay />
                </Scroll>
            </ScrollControls>
        </>
    );
};

export default Experience;
