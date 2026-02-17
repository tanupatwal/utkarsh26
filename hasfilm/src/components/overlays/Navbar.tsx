import React, { useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import DesktopNavbar from './DesktopNavbar';
import SideDots from './SideDots';
import MobileNavbar from './MobileNavbar';
import MobileMenuOverlay from './MobileMenuOverlay';

/**
 * Navbar — Root navigation component.
 *
 * Desktop: floating capsule + side dots alongside the logo.
 * Mobile:  bottom tab bar + burger overlay.
 */
const Navbar: React.FC = () => {
    const isMobile = useIsMobile();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Logo — always visible, separate from nav components */}
            <div className="fixed top-0 left-0 z-50 px-6 pt-0 pointer-events-none">
                <div className="pointer-events-auto cursor-pointer">
                    <img
                        src="/assets/fest.webp"
                        alt="Utkarsh Fest Logo"
                        className="h-32 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Desktop-only navigation layers */}
            {!isMobile && (
                <>
                    <DesktopNavbar />
                    <SideDots />
                </>
            )}

            {/* Mobile-only navigation layers */}
            {isMobile && (
                <>
                    <MobileNavbar onBurgerClick={toggleMenu} isMenuOpen={isMenuOpen} />
                    <MobileMenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
                </>
            )}
        </>
    );
};

export default Navbar;
