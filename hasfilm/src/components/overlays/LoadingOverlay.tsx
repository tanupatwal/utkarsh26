import React, { useState, useEffect } from 'react';

/**
 * LoadingOverlay - Initial loading screen with smooth fade-out.
 * Uses state-driven opacity transition instead of CSS animation.
 */
const LoadingOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Show the loader for 2s, then begin smooth fade-out
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        // After the fade-out transition completes, remove from DOM
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 3200); // 2000ms hold + 1200ms fade

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 100,
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: isFading ? 'none' : 'auto',
                opacity: isFading ? 0 : 1,
                transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'opacity',
            }}
        >
            <div
                style={{
                    color: '#fff',
                    fontSize: '0.875rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: "'Inter', 'Outfit', sans-serif",
                }}
            >
                Initializing Simulation...
            </div>
        </div>
    );
};

export default LoadingOverlay;
