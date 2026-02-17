import { useState, useEffect } from 'react';

/**
 * Returns `true` when viewport width < 768px.
 * Uses `matchMedia` with a live `change` listener.
 * Defaults to `false` on first render (SSR-safe).
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        setIsMobile(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile;
}
