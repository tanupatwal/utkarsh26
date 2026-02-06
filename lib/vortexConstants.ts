import { ImageData } from '@/types/image';

// Event images from assets
export const TUNNEL_IMAGES: ImageData[] = [
    { url: '/assets/eventimg/img1.jpg', title: 'Event 1', description: 'Past Event' },
    { url: '/assets/eventimg/img2.jpg', title: 'Event 2', description: 'Past Event' },
    { url: '/assets/eventimg/img3.jpg', title: 'Event 3', description: 'Past Event' },
    { url: '/assets/eventimg/img4.jpg', title: 'Event 4', description: 'Past Event' },
    { url: '/assets/eventimg/img5.jpg', title: 'Event 5', description: 'Past Event' },
    { url: '/assets/eventimg/img6.jpg', title: 'Event 6', description: 'Past Event' },
    { url: '/assets/eventimg/img7.jpg', title: 'Event 7', description: 'Past Event' },
    { url: '/assets/eventimg/img8.jpg', title: 'Event 8', description: 'Past Event' },
    { url: '/assets/eventimg/img9.jpg', title: 'Event 9', description: 'Past Event' },
];

// Duplicate for denser tunnel
export const ALL_TUNNEL_IMAGES = [...TUNNEL_IMAGES, ...TUNNEL_IMAGES, ...TUNNEL_IMAGES];

// 3D Scene Configuration
export const TUNNEL_RADIUS = 4;        // Radius of tunnel spiral
export const TUNNEL_LENGTH = 40;       // Z-depth of tunnel
export const FOG_COLOR = '#000000';    // Deep black for contrast
export const CYLINDER_RADIUS = 8;      // Radius of gallery cylinder
export const CYLINDER_HEIGHT = 6;      // Height of gallery panels
