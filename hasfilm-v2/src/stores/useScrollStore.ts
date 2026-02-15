import { create } from 'zustand';

interface ScrollState {
    progress: number;         // 0–1 overall scroll progress
    scroll: number;           // Current scroll position in pixels
    velocity: number;         // Current scroll velocity
    direction: 'up' | 'down'; // Scroll direction
    isOpen: boolean;          // Is the overlay open?

    // Actions
    setProgress: (progress: number) => void;
    setScroll: (scroll: number) => void;
    setVelocity: (velocity: number) => void;
    setDirection: (direction: 'up' | 'down') => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
    progress: 0,
    scroll: 0,
    velocity: 0,
    direction: 'down',
    isOpen: false,

    setProgress: (progress) => set({ progress }),
    setScroll: (scroll) => set({ scroll }),
    setVelocity: (velocity) => set({ velocity }),
    setDirection: (direction) => set({ direction }),
}));
