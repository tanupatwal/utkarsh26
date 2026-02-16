// src/lib/data/highlights.ts

export interface HighlightImage {
    url: string;
    title: string;
    description: string;
}

/**
 * Event Highlights content — 12 high-energy photos for the floating gallery.
 * Each has a title and short description shown on hover.
 */
export const HIGHLIGHTS_CONTENT: HighlightImage[] = [
    {
        url: '/assets/highlights/1.webp',
        title: 'The Grand Stage',
        description:
            'Where thousands gathered under one sky to celebrate the spirit of Utkarsh.',
    },
    {
        url: '/assets/highlights/2.webp',
        title: 'Night of Stars',
        description:
            'Electrifying performances that echoed through the campus long after the lights went down.',
    },
    {
        url: '/assets/highlights/3.webp',
        title: 'Behind the Curtain',
        description:
            'The chaos, the laughter, the last-minute magic that made it all come together.',
    },
    {
        url: '/assets/highlights/4.webp',
        title: 'Creative Minds',
        description:
            'Art installations that transformed empty halls into worlds of wonder.',
    },
    {
        url: '/assets/highlights/5.webp',
        title: 'Victory Roar',
        description:
            'The moment of triumph — where hard work met glory under the spotlight.',
    },
    {
        url: '/assets/highlights/6.webp',
        title: 'The Crowd',
        description:
            'A sea of faces, each carrying their own story of Utkarsh.',
    },
    {
        url: '/assets/highlights/7.webp',
        title: 'First Light',
        description:
            'Dawn breaking over a campus still buzzing from the night before.',
    },
    {
        url: '/assets/highlights/8.webp',
        title: 'Innovation Hub',
        description:
            'Where ideas became prototypes and prototypes became possibilities.',
    },
    {
        url: '/assets/highlights/9.webp',
        title: 'Street Vibes',
        description:
            'The open grounds turned festival — food, music, and spontaneous dance.',
    },
    {
        url: '/assets/highlights/10.webp',
        title: 'Rhythm & Soul',
        description:
            'Bodies in motion, telling stories that words never could.',
    },
    {
        url: '/assets/highlights/11.webp',
        title: 'Acoustic Evenings',
        description:
            'Melodies that carried through the corridors and stayed in our hearts.',
    },
    {
        url: '/assets/highlights/12.jpg',
        title: 'Our Campus',
        description:
            'The backdrop to it all — where memories were made and friendships forged.',
    },
];
