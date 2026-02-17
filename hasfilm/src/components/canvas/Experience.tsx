import React from 'react';

// Canvas components
import SceneSetup from './SceneSetup';

// Section components
import { GalleryGroup } from '../sections/gallery';

/**
 * Experience - Minimal 3D scene orchestrator.
 *
 * With the Lenis migration, this only contains 3D scene elements.
 * All HTML sections have moved to App.tsx's <main> element.
 * ScrollControls is no longer needed — GalleryGroup reads
 * the shared scrollProgress ref directly.
 */
const Experience: React.FC = () => {
    return (
        <>
            <SceneSetup />
            <GalleryGroup />
        </>
    );
};

export default Experience;
