import { useScrollStore } from '@/shared/stores/scrollStore'

/**
 * Convenience hook to read the user's reduced-motion preference.
 * The preference is detected in App.tsx via matchMedia and stored in Zustand.
 */
export const useReducedMotion = () =>
    useScrollStore((s) => s.reducedMotion)
