/**
 * useActiveSection — Single source of truth for the currently visible section.
 *
 * Creates one GSAP ScrollTrigger per section (start: 'top center', end: 'bottom center')
 * and exposes the active section ID via React state.
 *
 * Both DesktopNavbar and SideDots read from this hook — no duplicate observers.
 */
import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const NAV_SECTIONS = [
    { id: 'hero-section', label: 'Home' },
    { id: 'about-section', label: 'About' },
    { id: 'gallery-section', label: 'Gallery' },
    { id: 'highlights-section', label: 'Events' },
    { id: 'schedule-section', label: 'Schedule' },
    { id: 'team-section', label: 'Team' },
] as const;

export type SectionId = (typeof NAV_SECTIONS)[number]['id'];

export function useActiveSection(): SectionId {
    const [active, setActive] = useState<SectionId>('hero-section');

    useEffect(() => {
        const triggers: ScrollTrigger[] = [];

        NAV_SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;

            const st = ScrollTrigger.create({
                trigger: el,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => setActive(id),
                onEnterBack: () => setActive(id),
            });

            triggers.push(st);
        });

        return () => {
            triggers.forEach((st) => st.kill());
        };
    }, []);

    return active;
}
