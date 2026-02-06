import { ImageData } from './types';

export const CONTENT: ImageData[] = [
  {
    url: "https://picsum.photos/id/10/800/1200",
    title: "The Beginning",
    description: "Where the journey started."
  },
  {
    url: "https://picsum.photos/id/14/800/1200",
    title: "Expansion",
    description: "Moving outward."
  },
  {
    url: "https://picsum.photos/id/24/800/1200",
    title: "Discovery",
    description: "Finding new patterns."
  },
  {
    url: "https://picsum.photos/id/28/800/1200",
    title: "Nature",
    description: "Reconnecting roots."
  },
  {
    url: "https://picsum.photos/id/43/800/1200",
    title: "Structure",
    description: "Building frames."
  },
  {
    url: "https://picsum.photos/id/55/800/1200",
    title: "Momentum",
    description: "Picking up speed."
  }
];

export const GALLERY_CONTENT: ImageData[] = [
  {
    url: "https://picsum.photos/id/237/1000/600",
    title: "Project Alpha",
    description: "Immersive events."
  },
  {
    url: "https://picsum.photos/id/238/1000/600",
    title: "Academic Islands",
    description: "Virtual open days."
  },
  {
    url: "https://picsum.photos/id/239/1000/600",
    title: "Neon City",
    description: "Cyberpunk exploration."
  },
  {
    url: "https://picsum.photos/id/240/1000/600",
    title: "Data Viz",
    description: "Complex datasets."
  },
  {
    url: "https://picsum.photos/id/242/1000/600",
    title: "Sculpture",
    description: "Digital artifacts."
  }
];

// Configuration for the 3D scene
export const TUNNEL_RADIUS = 8;
export const TUNNEL_LENGTH = 20;
export const FOG_COLOR = "#000000"; // Deep black for better contrast
export const CYLINDER_RADIUS = 40;
export const CYLINDER_HEIGHT = 24; // 20% taller
export const CYLINDER_ARC = Math.PI * 1.475; // 50% wider arc (~229 degrees)
