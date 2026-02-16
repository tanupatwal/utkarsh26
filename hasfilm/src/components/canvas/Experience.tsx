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
import { TunnelGroup } from '../sections/tunnel';
import { AboutSection } from '../sections/about';
import { GalleryGroup } from '../sections/gallery';

/**
 * Experience - Main 3D scene orchestrator.
 * Composes all sections and manages scroll-based navigation.
 *
 * GPU strategy: Both 3D scenes stay mounted (they manage their own
 * visible = false logic internally). FlatAboutSection removed — the
 * AboutSection HTML overlay now has a CSS gradient background instead.
 */
const Experience: React.FC = () => {
    return (
        <>
            <SceneSetup />

            <ScrollControls pages={SCROLL_CONFIG.PAGES} damping={0.2}>
                {/* 3D scenes — both mounted, self-manage visibility */}
                <TunnelGroup />
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
