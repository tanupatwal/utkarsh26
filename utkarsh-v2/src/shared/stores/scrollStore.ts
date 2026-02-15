import { create } from 'zustand'

interface ScrollState {
    /** Normalized scroll progress 0–1 */
    progress: number
    /** Currently active section name */
    activeSection: string
    /** Whether reduced motion is preferred */
    reducedMotion: boolean

    // Actions
    setProgress: (progress: number) => void
    setActiveSection: (section: string) => void
    setReducedMotion: (reduced: boolean) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
    progress: 0,
    activeSection: 'hero',
    reducedMotion: false,

    setProgress: (progress) => set({ progress }),
    setActiveSection: (section) => set({ activeSection: section }),
    setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
}))
