export interface GalleryItem {
    id: number;
    title: string;
    description: string;
    url: string;
    color: string;
}

export const GALLERY_CONTENT: GalleryItem[] = [
    {
        id: 1,
        title: 'THE ALCHEMY OF IDEAS',
        description: 'A fusion of technology and creativity.',
        url: '/assets/gallery/1.jpg',
        color: '#4fc3dc'
    },
    {
        id: 2,
        title: 'DIGITAL RENAISSANCE',
        description: 'Rebirth of art in the digital age.',
        url: '/assets/gallery/2.jpg',
        color: '#a45ee5'
    },
    {
        id: 3,
        title: 'ECHOES OF TOMORROW',
        description: 'Resonance of future possibilities.',
        url: '/assets/gallery/3.jpg',
        color: '#ff8c42'
    },
    {
        id: 4,
        title: 'VISUAL SYMPHONY',
        description: 'Harmonics of light and shadow.',
        url: '/assets/gallery/4.jpg',
        color: '#f44336'
    },
    {
        id: 5,
        title: 'INFINITE HORIZON',
        description: 'Beyond the boundaries of perception.',
        url: '/assets/gallery/5.jpg',
        color: '#66bb6a'
    }
];
