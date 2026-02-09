// src/utils/colorExtraction.ts

export interface RGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Extract the dominant vibrant color from an image URL using canvas pixel sampling.
 * Downscales the image to 20x20, then averages the top 25% most saturated pixels.
 */
export function extractDominantColor(imageUrl: string): Promise<RGB> {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 20;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, size, size);

            const data = ctx.getImageData(0, 0, size, size).data;

            // Collect all pixels with a vibrancy score
            const scored: (RGB & { score: number })[] = [];

            for (let i = 0; i < data.length; i += 4) {
                const r = (data[i] ?? 0) / 255;
                const g = (data[i + 1] ?? 0) / 255;
                const b = (data[i + 2] ?? 0) / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const saturation = max === 0 ? 0 : (max - min) / max;
                const brightness = (r + g + b) / 3;

                // Penalize very dark or very bright pixels, prefer saturated mid-tones
                const brightPenalty = brightness < 0.08 ? -3 : brightness > 0.92 ? -1.5 : 0;
                const score = saturation * 3 + brightness * 0.5 + brightPenalty;

                scored.push({ r, g, b, score });
            }

            // Sort by vibrancy score (descending)
            scored.sort((a, b) => b.score - a.score);

            // Average the top 25% most vibrant pixels for a stable, representative color
            const topN = Math.max(1, Math.floor(scored.length * 0.25));
            let rSum = 0, gSum = 0, bSum = 0;
            for (let i = 0; i < topN; i++) {
                const px = scored[i];
                if (px) { rSum += px.r; gSum += px.g; bSum += px.b; }
            }

            resolve({
                r: rSum / topN,
                g: gSum / topN,
                b: bSum / topN,
            });
        };

        img.onerror = () => resolve({ r: 0.3, g: 0.3, b: 0.8 }); // Fallback blue
        img.src = imageUrl;
    });
}

// Module-level cache
let colorCache: RGB[] | null = null;

/**
 * Extract dominant colors for an array of image URLs.
 * Results are cached globally after first extraction.
 */
export async function extractAllGalleryColors(urls: string[]): Promise<RGB[]> {
    if (colorCache && colorCache.length === urls.length) return colorCache;
    colorCache = await Promise.all(urls.map(extractDominantColor));
    return colorCache;
}
