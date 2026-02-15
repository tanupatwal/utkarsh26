import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '1rem', zIndex: 50, display: 'flex', justifyContent: 'space-between', mixBlendMode: 'difference' }}>
            <div style={{ fontWeight: 700 }}>UTKARSH 2026</div>
            <div>Menu</div>
        </nav>
    );
};

export default Navbar;
