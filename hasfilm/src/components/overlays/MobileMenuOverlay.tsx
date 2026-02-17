import React from 'react';
import { getLenis } from '../../providers/LenisProvider';
import { useActiveSection, NAV_SECTIONS, SectionId } from '../../hooks/useActiveSection';
import './MobileMenuOverlay.css';

/**
 * MobileMenuOverlay — Full-screen overlay triggered by the burger button.
 *
 * - Shows all 6 section links with stagger animation
 * - Active section highlighted in heritage gold
 * - Social links + Register CTA at the bottom
 * - Clicking a link scrolls via Lenis and closes the overlay
 */

interface MobileMenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose }) => {
    const active = useActiveSection();

    const handleLinkClick = (id: SectionId) => {
        const lenis = getLenis();

        // Close overlay first
        onClose();

        // Small delay to let overlay animation start, then scroll
        setTimeout(() => {
            if (lenis) {
                lenis.scrollTo(id === 'hero-section' ? 0 : `#${id}`, { offset: 0 });
            }
        }, 100);
    };

    return (
        <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
            {/* Section links */}
            <ul className="mobile-overlay__links" role="navigation" aria-label="Mobile menu">
                {NAV_SECTIONS.map(({ id, label }) => (
                    <li key={id}>
                        <button
                            className={`mobile-overlay__link ${active === id ? 'active' : ''}`}
                            onClick={() => handleLinkClick(id)}
                            tabIndex={isOpen ? 0 : -1}
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Divider */}
            <div className="mobile-overlay__divider" />

            {/* Footer — socials + CTA */}
            <div className="mobile-overlay__footer">
                <div className="mobile-overlay__socials">
                    <a href="#" className="mobile-overlay__social-link" tabIndex={isOpen ? 0 : -1}>
                        Instagram
                    </a>
                    <a href="#" className="mobile-overlay__social-link" tabIndex={isOpen ? 0 : -1}>
                        Twitter
                    </a>
                    <a href="#" className="mobile-overlay__social-link" tabIndex={isOpen ? 0 : -1}>
                        YouTube
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MobileMenuOverlay;
