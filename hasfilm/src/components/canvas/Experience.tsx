import React from 'react';
import { ScrollControls, Scroll } from '@react-three/drei';
import { SCROLL_CONFIG } from '../../config';

import GalleryOverlay from '../sections/gallery/GalleryOverlay';
import HighlightsSection from '../sections/gallery/HighlightsSection';
import ScheduleSection from '../sections/schedule/ScheduleSection';
import TeamSection from '../sections/team/TeamSection';

// Canvas components
import SceneSetup from './SceneSetup';

// Section components
import { AboutSection } from '../sections/about';
import { GalleryGroup } from '../sections/gallery';

/**
 * Experience - Main 3D scene orchestrator.
 * Composes all sections and manages scroll-based navigation.
 *
 * The tunnel has been removed — Hero scrolls directly into About.
 * GalleryGroup is the only remaining 3D scene.
 */
const Experience: React.FC = () => {
    return (
        <>
            <SceneSetup />

            <ScrollControls pages={SCROLL_CONFIG.PAGES} damping={0.2}>
                {/* 3D scenes */}
                <GalleryGroup />

                <Scroll html style={{ width: '100%', height: '100%' }}>
                    {/* About section — HTML overlay with staggered reveals */}
                    <AboutSection />

                    <GalleryOverlay />

                    {/* Floating bento highlights — fades in during gallery dissolve */}
                    <HighlightsSection />

                    {/* Schedule section — fades in as highlights dissolve */}
                    <ScheduleSection />

                    {/* Team section — fades in after schedule */}
                    <TeamSection />
                </Scroll>
            </ScrollControls>
        </>
    );
};

export default Experience;
