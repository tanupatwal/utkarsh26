import React from 'react';
import { GALLERY_CONTENT } from '../../data';

interface GalleryOverlayProps {
    activeIndex: number;
    visible: boolean;
}

const GalleryOverlay: React.FC<GalleryOverlayProps> = ({ activeIndex, visible }) => {
    const activeItem = GALLERY_CONTENT[activeIndex] || GALLERY_CONTENT[0];

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100dvh',
                pointerEvents: 'none',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4rem',
                color: 'white',
                fontFamily: 'Inter, sans-serif' // Assuming font acts like sans
            }}
        >
            {/* Top Bar: Index / Count */}
            <div style={{
                fontSize: '1rem',
                opacity: 0.7,
                letterSpacing: '0.1em',
                fontVariantNumeric: 'tabular-nums'
            }}>
                {String(activeIndex + 1).padStart(2, '0')} — {String(GALLERY_CONTENT.length).padStart(2, '0')}
            </div>

            {/* Bottom Section: Info & Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Text Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxWidth: '40vw'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        margin: 0,
                        fontWeight: 300,
                        letterSpacing: '-0.02em',
                        // Key for causing fade animation on change
                        transition: 'opacity 0.3s ease',
                        animation: 'fadeIn 0.5s ease-out'
                    }} key={`title-${activeIndex}`}>
                        {activeItem.title}
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        margin: 0,
                        opacity: 0.6,
                        lineHeight: 1.5,
                        animation: 'fadeIn 0.5s ease-out 0.1s backwards'
                    }} key={`desc-${activeIndex}`}>
                        {activeItem.description}
                    </p>
                </div>

                {/* Timeline Indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem'
                }}>
                    {GALLERY_CONTENT.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: i === activeIndex ? '2.5rem' : '0.5rem',
                                height: '2px',
                                backgroundColor: 'white',
                                opacity: i === activeIndex ? 1 : 0.3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Inline Styles for Animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default GalleryOverlay;
