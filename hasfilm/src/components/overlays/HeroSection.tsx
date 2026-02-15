import React from 'react';

/**
 * HeroSection — Dead-simple hero. No animations, no RAF loop, no scroll tracking.
 * Just a full-screen div with text. Sits behind the Canvas.
 */
const HeroSection: React.FC = () => {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0b0f1a',
                color: '#ffffff',
                textAlign: 'center',
                padding: '0 2rem',
            }}
        >
            <h1
                style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    margin: 0,
                }}
            >
                Utkarsh 2026
            </h1>
            <p
                style={{
                    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                    fontWeight: 300,
                    opacity: 0.7,
                    marginTop: '1rem',
                    maxWidth: '600px',
                }}
            >
                The Annual Cultural Festival
            </p>
        </div>
    );
};

export default HeroSection;
