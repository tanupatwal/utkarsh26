import React from 'react';

const GallerySection: React.FC = () => {
    return (
        <section style={{ height: '300vh', position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <h2 style={{ background: '#00000088', padding: '1rem' }}>Gallery Overlay (300vh scroll)</h2>
            </div>
        </section>
    );
};

export default GallerySection;
