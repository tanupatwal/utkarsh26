/**
 * Content-related type definitions.
 */

export interface ImageData {
    url: string;
    title: string;
    description: string;
}

export interface GalleryItem extends ImageData {
    category?: string;
}
