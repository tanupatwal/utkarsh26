/**
 * galleryProgress — Shared, local gallery scroll progress (0 → 1).
 *
 * Updated by a ScrollTrigger on `#gallery-section` in App.tsx.
 * Read by GalleryGroup (useFrame) and GalleryOverlay (rAF loop).
 *
 * Unlike the global `scrollProgress` (which maps 0→1 across the entire page),
 * this ref is 0 at the top of the gallery section and 1 at the bottom.
 * This means gallery animation timing is independent of other sections' heights.
 */
export const galleryProgress = { current: 0 };
