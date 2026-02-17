import React from 'react';
import { getLenis } from '../../providers/LenisProvider';
import { useActiveSection, NAV_SECTIONS, SectionId } from '../../hooks/useActiveSection';
import './SideDots.css';

/**
 * SideDots — Vertical dot indicator on the right edge of the viewport.
 *
 * - 6 dots, one per section
 * - Active dot glows (heritage gold), determined by shared useActiveSection hook
 * - Hover shows section name tooltip
 * - Click scrolls via Lenis
 */
const SideDots: React.FC = () => {
    const active = useActiveSection();

    const handleClick = (id: SectionId) => {
        const lenis = getLenis();
        if (lenis) {
            // Hero scrolls to top, others get a small offset for the capsule
            const offset = id === 'hero-section' ? 0 : -60;
            lenis.scrollTo(id === 'hero-section' ? 0 : `#${id}`, { offset });
        }
    };

    return (
        <div className="side-dots" aria-label="Section navigation">
            {NAV_SECTIONS.map(({ id, label }, index) => (
                <React.Fragment key={id}>
                    {index > 0 && <div className="side-dots__line" />}
                    <button
                        className={`side-dots__item ${active === id ? 'active' : ''}`}
                        onClick={() => handleClick(id)}
                        aria-label={`Navigate to ${label}`}
                        aria-current={active === id ? 'true' : undefined}
                    >
                        <span className="side-dots__tooltip">{label}</span>
                        <span className="side-dots__dot" />
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};

export default SideDots;
