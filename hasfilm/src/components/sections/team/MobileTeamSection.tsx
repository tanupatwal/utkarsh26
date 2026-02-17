import React, { useState, useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { TEAM_MEMBERS } from '../../../data/team';
import './MobileTeamSection.css';

gsap.registerPlugin(Flip);

/**
 * MobileTeamSection — Mosaic grid for mobile (< 768px).
 *
 * Features:
 *   - 3-column grid
 *   - Tap to expand: Active tile becomes 2x2
 *   - Smooth FLIP animation using GSAP Flip
 *   - Tap again to collapse
 */
const MobileTeamSection: React.FC = () => {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<Flip.FlipState | null>(null);
    const q = gsap.utils.selector(containerRef);

    useLayoutEffect(() => {
        if (!stateRef.current) return;

        // Animate from the captured state to the new state
        Flip.from(stateRef.current, {
            targets: q('.mob-team__cell'),
            duration: 0.6,
            ease: 'power3.inOut',
            simple: true, // Optimizes for simple position changes without complex nesting
            onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 }),
            onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.4 })
        });

        stateRef.current = null;
    }, [activeIdx]);

    const handleTap = useCallback((idx: number) => {
        // Capture state before layout change
        stateRef.current = Flip.getState(q('.mob-team__cell'));

        setActiveIdx((prev) => (prev === idx ? null : idx));
    }, []);

    return (
        <div className="mob-team">
            {/* Header */}
            <header className="mob-team__header">
                <h2 className="mob-team__title">
                    Meet
                    <span className="mob-team__title-accent">The Crew</span>
                </h2>
                <p className="mob-team__tagline">
                    The people who bring Utkarsh to life
                </p>
                <div className="mob-team__divider" />
            </header>

            {/* Mosaic grid */}
            <div className="mob-team__grid" ref={containerRef}>
                {TEAM_MEMBERS.map((member, idx) => {
                    const isActive = activeIdx === idx;

                    const cellClasses = [
                        'mob-team__cell',
                        isActive ? 'mob-team__cell--active' : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div
                            key={member.name}
                            className={cellClasses}
                            onClick={() => handleTap(idx)}
                        >
                            {/* Photo */}
                            <img
                                className="mob-team__img"
                                src={member.image}
                                alt={member.name}
                                loading="lazy"
                                draggable={false}
                            />

                            {/* Expandable overlay */}
                            <div className="mob-team__overlay">
                                <p className="mob-team__name">{member.name}</p>
                                <p className="mob-team__role">{member.role}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileTeamSection;
