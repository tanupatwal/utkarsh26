import { ImageData } from '../types';

// ============================================================================
// DYNAMIC IMAGE LOADING FROM FOLDER
// ============================================================================

/**
 * Dynamically discover all images from the tunnel-trailer folder using Vite's import.meta.glob.
 *
 * Images in the folder are automatically discovered at build time.
 * Simply drop images in /public/assets/tunnel-trailer/ and rebuild.
 *
 * Naming convention: Use frame-01.jpg, frame-02.jpg, etc. for proper ordering.
 */
const imageModules = import.meta.glob<{ default: string }>('../../public/assets/tunnel-trailer/*', {
    eager: true,
    as: 'url',
});

/**
 * Extract and sort URLs from discovered modules.
 * Sorts numerically by filename (frame-01 before frame-02, etc.)
 */
const imageUrls = Object.values(imageModules)
    .filter((url): url is string => typeof url === 'string')
    .map(url => url.replace('/public', ''))
    .sort((a, b) => {
        const getFilename = (url: string) => url.split('/').pop() ?? '';
        return getFilename(a).localeCompare(getFilename(b), undefined, { numeric: true });
    });

/**
 * Dynamically generate content data from the discovered images.
 */
export const CONTENT: ImageData[] = imageUrls.map((url) => {
    const filename = url.split('/').pop()?.split('.')[0] ?? '';
    return {
        url,
        title: `Utkarsh 2025 - ${filename}`,
        description: `Tunnel moment.`
    };
});

/**
 * For debugging: log how many images were loaded.
 */
if (import.meta.env.DEV) {
    console.log(`[Tunnel Content] Loaded ${CONTENT.length} images from /assets/tunnel-trailer/`);
    console.log(`[Tunnel Content] Images:`, imageUrls);
}
