// src/data/highlights.ts
import { ImageData } from '../types';

/**
 * Event Highlights content — 12 high-energy photos for the floating gallery.
 * Each has a title and short description shown on hover.
 */
export const HIGHLIGHTS_CONTENT: ImageData[] = [
    {
        url: "/assets/highlights/1.webp",
        title: "Break It Out '25",
        description: "A vibrant crowd gathered around a dance battle arena, capturing the raw energy of street culture."
    },
    {
        url: "/assets/highlights/2.webp",
        title: "Centre Stage",
        description: "Dramatic moments unfold as characters come to life under the theatrical spotlight."
    },
    {
        url: "/assets/highlights/3.webp",
        title: "Shadow Play",
        description: "Emotion and storytelling merge in a captivating play of light and shadow."
    },
    {
        url: "/assets/highlights/4.webp",
        title: "Rhythm in Motion",
        description: "Synchronized beats and electric energy as dancers take over the main stage."
    },
    {
        url: "/assets/highlights/5.webp",
        title: "Voice of the Night",
        description: "A soulful performance that resonated with every heartbeat in the crowd."
    },
    {
        url: "/assets/highlights/6.webp",
        title: "Grace & Culture",
        description: "A beautiful fusion of tradition and modernity showcased through dance."
    },
    {
        url: "/assets/highlights/7.webp",
        title: "In The Spotlight",
        description: "Moments of recognition and discourse with distinguished guests."
    },
    {
        url: "/assets/highlights/8.webp",
        title: "Power Moves",
        description: "High-octane energy and precision choreography that captivated the audience."
    },
    {
        url: "/assets/highlights/9.webp",
        title: "Electric Atmosphere",
        description: "The stage illuminated by passion and performance."
    },
    {
        url: "/assets/highlights/10.webp",
        title: "Main Event",
        description: "A charismatic performance that set the night on fire."
    },
    {
        url: "/assets/highlights/11.webp",
        title: "Crowd Control",
        description: "Commanding the stage with an audience lost in the rhythm."
    },
    {
        url: "/assets/highlights/12.webp",
        title: "Peak Energy",
        description: "The crescendo of the night where music and spirit collide."
    },
    {
        url: "/assets/highlights/13.webp",
        title: "Behind the Decks",
        description: "Orchestrating the vibe that keeps the festival alive."
    },
    {
        url: "/assets/highlights/14.webp",
        title: "Innovation Showcase",
        description: "Distinguished guests exploring the creativity and technical prowess of students."
    },
    {
        url: "/assets/highlights/15.webp",
        title: "Hands in the Air",
        description: "Pure joy and connection as the beat drops."
    },
    {
        url: "/assets/highlights/16.webp",
        title: "Folk Rhythms",
        description: "Vibrant colors and energetic moves celebrating cultural heritage."
    },
    {
        url: "/assets/highlights/17.webp",
        title: "Words of Wisdom",
        description: "Inspiring speeches that set the tone for the event."
    },
    {
        url: "/assets/highlights/18.webp",
        title: "Leadership Speak",
        description: "Guidance and vision shared from the podium."
    },
    {
        url: "/assets/highlights/19.webp",
        title: "Honoring Excellence",
        description: "Recognizing talent and achievement on the main stage."
    },
    {
        url: "/assets/highlights/20.webp",
        title: "Confetti Celebration",
        description: "A magical moment of music and color filling the air."
    },
    {
        url: "/assets/highlights/21.webp",
        title: "Soulful Melodies",
        description: "Captivating the audience with a powerful vocal performance."
    },
];

/**
 * Get a highlight by index (loops if out of bounds).
 */
export function getHighlightAtIndex(index: number): ImageData {
    return HIGHLIGHTS_CONTENT[index % HIGHLIGHTS_CONTENT.length]!;
}

/**
 * Get all highlight image URLs.
 */
export function getHighlightImages(): string[] {
    return HIGHLIGHTS_CONTENT.map(h => h.url);
}
