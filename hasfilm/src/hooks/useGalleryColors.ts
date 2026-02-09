// src/hooks/useGalleryColors.ts
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { GALLERY_CONTENT } from '../data/gallery';
import { extractAllGalleryColors } from '../utils/colorExtraction';

const DEFAULT_COLOR = new THREE.Color(0.4, 0.4, 1.0); // Fallback blue

/**
 * Hook that extracts dominant colors from all gallery images.
 * Returns an array of THREE.Color objects (one per gallery item).
 * Colors are cached globally after first extraction.
 */
export function useGalleryColors(): THREE.Color[] {
    const [colors, setColors] = useState<THREE.Color[]>(
        () => GALLERY_CONTENT.map(() => DEFAULT_COLOR.clone())
    );

    useEffect(() => {
        const urls = GALLERY_CONTENT.map(item => item.url);
        extractAllGalleryColors(urls).then(rgbs => {
            setColors(rgbs.map(c => new THREE.Color(c.r, c.g, c.b)));
        });
    }, []);

    return colors;
}

/** Convert a THREE.Color to a CSS rgba string */
export function colorToCSS(color: THREE.Color, alpha = 1): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return alpha < 1
        ? `rgba(${r}, ${g}, ${b}, ${alpha})`
        : `rgb(${r}, ${g}, ${b})`;
}

/** Create a very dark tinted version of a color for fog/background use */
export function tintFogColor(color: THREE.Color, intensity = 0.15): THREE.Color {
    const base = new THREE.Color('#050505');
    return base.lerp(color.clone(), intensity);
}
