import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../providers/LenisProvider';
import { useActiveSection, NAV_SECTIONS, SectionId } from '../../hooks/useActiveSection';
import './DesktopNavbar.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * DesktopNavbar — Floating glassmorphic capsule at top-center.
 *
 * - Hidden during Hero section, fades in once user scrolls past hero
 * - Active link determined by shared `useActiveSection` hook
 * - Click scrolls via Lenis for smooth integration
 * - Thin gradient progress bar along the bottom
 */

// Skip "Home" in the capsule — clicking the logo scrolls to top
const CAPSULE_LINKS = NAV_SECTIONS.filter((s) => s.id !== 'hero-section');

const DesktopNavbar: React.FC = () => {
    const active = useActiveSection();
    const capsuleRef = useRef<HTMLElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Show/hide capsule when scrolling past Hero
    useEffect(() => {
        const st = ScrollTrigger.create({
            trigger: '#hero-section',
            start: 'bottom top',
            end: '+=1',
            onEnter: () => setIsVisible(true),
            onLeaveBack: () => setIsVisible(false),
        });

        return () => st.kill();
    }, []);

    // Scroll progress bar
    useEffect(() => {
        const tick = () => {
            if (!progressRef.current) return;
            const el = document.documentElement;
            const maxScroll = el.scrollHeight - el.clientHeight;
            const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            progressRef.current.style.transform = `scaleX(${progress})`;
        };

        window.addEventListener('scroll', tick, { passive: true });
        return () => window.removeEventListener('scroll', tick);
    }, []);

    const handleClick = (id: SectionId) => {
        const lenis = getLenis();
        if (lenis) {
            lenis.scrollTo(`#${id}`, { offset: -60 });
        }
    };

    return (
        <nav
            ref={capsuleRef}
            className={`desktop-navbar ${isVisible ? 'visible' : ''}`}
            aria-label="Desktop navigation"
        >
            {CAPSULE_LINKS.map(({ id, label }) => (
                <button
                    key={id}
                    className={`desktop-navbar__link ${active === id ? 'active' : ''}`}
                    onClick={() => handleClick(id)}
                    aria-current={active === id ? 'true' : undefined}
                >
                    {label}
                </button>
            ))}

            {/* Thin gradient progress bar */}
            <div className="desktop-navbar__progress">
                <div ref={progressRef} className="desktop-navbar__progress-fill" />
            </div>
        </nav>
    );
};

export default DesktopNavbar;
