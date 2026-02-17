import React, { useEffect, useRef, useState } from 'react';
import { getLenis } from '../../providers/LenisProvider';
import { useActiveSection, SectionId } from '../../hooks/useActiveSection';
import './MobileNavbar.css';

/**
 * MobileNavbar — Glassmorphic bottom tab bar + top-right burger trigger.
 *
 * - 4 icon tabs for quick section jumps (Home, Gallery, Schedule, Team)
 * - Active tab synced via shared useActiveSection hook
 * - Auto-hides on scroll-down, reappears on scroll-up
 * - Burger button at top-right toggles the MobileMenuOverlay
 */

// Subset of sections for the bottom bar (keep it minimal)
const TAB_SECTIONS: { id: SectionId; label: string; icon: string }[] = [
    { id: 'hero-section', label: 'Home', icon: '⌂' },
    { id: 'gallery-section', label: 'Gallery', icon: '◈' },
    { id: 'schedule-section', label: 'Schedule', icon: '▦' },
    { id: 'team-section', label: 'Team', icon: '◉' },
];

// SVG icons as inline components for crisp rendering
const HomeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const GalleryIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const ScheduleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const TeamIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);

const ICONS: Record<string, React.FC> = {
    'hero-section': HomeIcon,
    'gallery-section': GalleryIcon,
    'schedule-section': ScheduleIcon,
    'team-section': TeamIcon,
};

interface MobileNavbarProps {
    onBurgerClick: () => void;
    isMenuOpen: boolean;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onBurgerClick, isMenuOpen }) => {
    const active = useActiveSection();
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Auto-hide on scroll-down, show on scroll-up
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (delta > 8 && currentY > 100) {
                setIsHidden(true);
            } else if (delta < -8) {
                setIsHidden(false);
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (id: SectionId) => {
        const lenis = getLenis();
        if (lenis) {
            lenis.scrollTo(id === 'hero-section' ? 0 : `#${id}`, { offset: 0 });
        }
    };

    // Map active section to nearest tab (highlights -> gallery, about -> home)
    const getActiveTab = (): SectionId => {
        const tabIds = TAB_SECTIONS.map((t) => t.id);
        if (tabIds.includes(active)) return active;
        // Map non-tab sections to nearest tab
        if (active === 'about-section') return 'hero-section';
        if (active === 'highlights-section') return 'gallery-section';
        return 'hero-section';
    };

    const activeTab = getActiveTab();

    return (
        <>
            {/* Burger button (top-right) */}
            <button
                className={`mobile-burger ${isMenuOpen ? 'open' : ''}`}
                onClick={onBurgerClick}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
            >
                <span className="mobile-burger__line" />
                <span className="mobile-burger__line" />
                <span className="mobile-burger__line" />
            </button>

            {/* Bottom tab bar */}
            <nav
                className={`mobile-navbar ${isHidden && !isMenuOpen ? 'hidden' : ''}`}
                aria-label="Mobile navigation"
            >
                {TAB_SECTIONS.map(({ id, label }) => {
                    const Icon = ICONS[id];
                    return (
                        <button
                            key={id}
                            className={`mobile-navbar__tab ${activeTab === id ? 'active' : ''}`}
                            onClick={() => handleTabClick(id)}
                            aria-label={`Navigate to ${label}`}
                            aria-current={activeTab === id ? 'true' : undefined}
                        >
                            <span className="mobile-navbar__icon">
                                {Icon && <Icon />}
                            </span>
                            <span className="mobile-navbar__label">{label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
};

export default MobileNavbar;
