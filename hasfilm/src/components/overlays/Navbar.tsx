import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-0 pointer-events-none">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="pointer-events-auto cursor-pointer -mt-0">
                    <img 
                        src="/assets/fest.png" 
                        alt="Utkarsh Fest Logo" 
                        className="h-32 w-auto object-contain"
                    />
                </div>
                
                {/* Additional navbar items can go here */}
            </div>
        </nav>
    );
};

export default Navbar;
