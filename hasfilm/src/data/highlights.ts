// src/data/highlights.ts
import { ImageData } from '../types';

/**
 * Event Highlights content — high-energy photos of crowds, stages, winners.
 * Used in the floating state after the gallery cylinder shatters.
 */
export const HIGHLIGHTS_CONTENT: ImageData[] = [
    {
        url: "/assets/highlights/1.jpg",
        title: "The Grand Stage",
        description: "Where thousands gathered under one sky to celebrate the spirit of Utkarsh."
    },
    {
        url: "/assets/highlights/2.jpg",
        title: "Night of a Thousand Stars",
        description: "The main stage lit up with electrifying performances that echoed through the campus."
    },
    {
        url: "/assets/highlights/3.jpg",
        title: "The Creative Pulse",
        description: "Art, code, and culture collide in the most unexpected ways."
    },
    {
        url: "/assets/highlights/4.jpg",
        title: "Rise of Champions",
        description: "Winners emerge from a battlefield of innovation and raw talent."
    },
    {
        url: "/assets/highlights/5.jpg",
        title: "The Crowd Roars",
        description: "A sea of energy, passion, and unity — the heartbeat of the festival."
    },
    {
        url: "/assets/highlights/6.jpg",
        title: "Behind the Curtain",
        description: "The unsung moments that make the magic happen — preparation meets perfection."
    },
    {
        url: "/assets/highlights/7.jpg",
        title: "Dawn of VIKAS",
        description: "From Virasat to VIKAS — every ending is a new beginning."
    }
];

/**
 * Get a highlight image URL at any index, wrapping around if index exceeds content length.
 * This ensures we always have enough images regardless of panel count.
 */
export function getHighlightAtIndex(index: number): ImageData {
    return HIGHLIGHTS_CONTENT[index % HIGHLIGHTS_CONTENT.length]!;
}

/**
 * Generate N highlight items with looping/wrapping.
 * If N > HIGHLIGHTS_CONTENT.length, images repeat.
 */
export function getHighlightImages(count: number): ImageData[] {
    return Array.from({ length: count }, (_, i) => getHighlightAtIndex(i));
}
