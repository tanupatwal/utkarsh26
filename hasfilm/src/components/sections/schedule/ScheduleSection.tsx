import React, { useRef, useState, useCallback } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCROLL_CONFIG } from '../../../config';
import { SCHEDULE_DAYS, getEventsForDay } from '../../../data/schedule';
import type { ScheduleEvent } from '../../../data/schedule';

// ════════════════════════════════════════════════
//  CONFIGURATION
// ════════════════════════════════════════════════

const SCHEDULE_FADE_START = 0.98;   // begin fading in
const SCHEDULE_FADE_FULL = 0.995;   // fully visible

// Stagger delay per card (seconds) — won't change once set
const CARD_STAGGER_MS = 80;

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
    tech: '#6a8cff',
    cultural: '#e879a5',
    sports: '#6ae8b0',
    ceremony: '#f0c95a',
    music: '#c084fc',
};

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════

const ScheduleSection: React.FC = () => {
    const scroll = useScroll();
    const containerRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef(0);

    // Interactive state (click-driven, not scroll-driven)
    const [activeDay, setActiveDay] = useState(1);
    const [focusedEvent, setFocusedEvent] = useState<ScheduleEvent | null>(null);
    const [cardsRevealed, setCardsRevealed] = useState(false);
    const revealTimerRef = useRef(0);

    const handleDayClick = useCallback((dayId: number) => {
        setActiveDay(dayId);
        setFocusedEvent(null);
    }, []);

    const handleEventClick = useCallback((event: ScheduleEvent) => {
        setFocusedEvent(prev => prev?.title === event.title ? null : event);
    }, []);

    useFrame((_state, delta) => {
        if (!containerRef.current) return;

        const r = scroll.offset;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
        const targetY = vh * (SCROLL_CONFIG.PAGES - 1) * r;

        containerRef.current.style.transform = `translate3d(0, ${targetY}px, 0)`;

        // Fade in logic
        let targetOpacity = 0;
        if (r >= SCHEDULE_FADE_START && r < SCHEDULE_FADE_FULL) {
            targetOpacity = (r - SCHEDULE_FADE_START) / (SCHEDULE_FADE_FULL - SCHEDULE_FADE_START);
        } else if (r >= SCHEDULE_FADE_FULL) {
            targetOpacity = 1;
        }

        opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 4, delta);
        containerRef.current.style.opacity = opacityRef.current.toFixed(3);

        // Trigger card reveal stagger once visible
        if (opacityRef.current > 0.5 && !cardsRevealed) {
            revealTimerRef.current += delta;
            if (revealTimerRef.current > 0.3) {
                setCardsRevealed(true);
            }
        }

        // Pointer events only when visible
        containerRef.current.style.pointerEvents = opacityRef.current > 0.1 ? 'auto' : 'none';
    });

    const dayEvents = getEventsForDay(activeDay);
    const activeDayData = SCHEDULE_DAYS.find(d => d.id === activeDay);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                opacity: 0,
                zIndex: 25,
                overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 60%, #020208 100%)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Inter', 'Outfit', sans-serif",
            }}
        >
            {/* ── Section Title (ghost typography) ── */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 0,
                userSelect: 'none',
            }}>
                <h1 style={{
                    fontSize: 'clamp(4rem, 12vw, 10rem)',
                    fontWeight: 100,
                    color: 'rgba(255,255,255,0.025)',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    margin: 0,
                    whiteSpace: 'nowrap',
                }}>
                    SCHEDULE
                </h1>
            </div>

            {/* ── Main Content Area ── */}
            <div style={{
                display: 'flex',
                flex: 1,
                padding: 'clamp(2rem, 4vh, 4rem) clamp(1.5rem, 3vw, 3rem)',
                gap: 'clamp(1.5rem, 2vw, 2.5rem)',
                position: 'relative',
                zIndex: 1,
                minHeight: 0,
            }}>

                {/* ── Left: Day Selector ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    width: 'clamp(140px, 15vw, 200px)',
                    flexShrink: 0,
                    paddingTop: '2rem',
                }}>
                    <div style={{
                        fontSize: 'clamp(0.6rem, 0.8vw, 0.75rem)',
                        fontWeight: 300,
                        color: 'rgba(255,255,255,0.3)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                    }}>
                        Select Day
                    </div>

                    {SCHEDULE_DAYS.map((day, i) => {
                        const isActive = activeDay === day.id;
                        return (
                            <button
                                key={day.id}
                                onClick={() => handleDayClick(day.id)}
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(124,106,239,0.15), rgba(124,106,239,0.05))'
                                        : 'rgba(255,255,255,0.02)',
                                    border: isActive
                                        ? '1px solid rgba(124,106,239,0.4)'
                                        : '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '1rem 1.2rem',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                    backdropFilter: isActive ? 'blur(20px)' : 'none',
                                    boxShadow: isActive
                                        ? '0 0 30px rgba(124,106,239,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)'
                                        : 'none',
                                    opacity: cardsRevealed ? 1 : 0,
                                    transform: cardsRevealed
                                        ? 'translateX(0)'
                                        : 'translateX(-20px)',
                                    transitionDelay: `${i * CARD_STAGGER_MS}ms`,
                                }}
                            >
                                <div style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                                    fontWeight: isActive ? 500 : 300,
                                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                                    letterSpacing: '0.05em',
                                    transition: 'all 0.4s ease',
                                }}>
                                    {day.label}
                                </div>
                                <div style={{
                                    fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)',
                                    fontWeight: 300,
                                    color: isActive ? 'rgba(124,106,239,0.9)' : 'rgba(255,255,255,0.2)',
                                    marginTop: '0.25rem',
                                    letterSpacing: '0.08em',
                                    transition: 'all 0.4s ease',
                                }}>
                                    {day.date}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* ── Center: Event List (scrollable timeline) ── */}
                <div style={{
                    flex: '0 0 35%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {/* Day header */}
                    <div style={{
                        marginBottom: '1.5rem',
                        paddingTop: '2rem',
                    }}>
                        <div style={{
                            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                            fontWeight: 200,
                            color: '#ffffff',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>
                            {activeDayData?.label}
                        </div>
                        <div style={{
                            fontSize: 'clamp(0.75rem, 1vw, 0.9rem)',
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.08em',
                            marginTop: '0.25rem',
                        }}>
                            {activeDayData?.date}, 2026
                        </div>
                    </div>

                    {/* Timeline line + events */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingLeft: '1.5rem',
                        position: 'relative',
                        scrollbarWidth: 'none',
                    }}>
                        {/* Vertical timeline line */}
                        <div style={{
                            position: 'absolute',
                            left: '4px',
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background: 'linear-gradient(to bottom, rgba(124,106,239,0.3), rgba(124,106,239,0.05))',
                        }} />

                        {dayEvents.map((event, i) => {
                            const isFocused = focusedEvent?.title === event.title;
                            const catColor = CATEGORY_COLORS[event.category || 'tech'] || '#6a8cff';

                            return (
                                <div
                                    key={`${activeDay}-${i}`}
                                    onClick={() => handleEventClick(event)}
                                    style={{
                                        position: 'relative',
                                        marginBottom: '0.75rem',
                                        cursor: 'pointer',
                                        opacity: cardsRevealed ? 1 : 0,
                                        transform: cardsRevealed
                                            ? 'translateY(0) scale(1)'
                                            : 'translateY(20px) scale(0.95)',
                                        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                                        transitionDelay: `${(i + 3) * CARD_STAGGER_MS}ms`,
                                    }}
                                >
                                    {/* Timeline dot */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-1.5rem',
                                        top: '1.2rem',
                                        width: isFocused ? '10px' : '7px',
                                        height: isFocused ? '10px' : '7px',
                                        borderRadius: '50%',
                                        background: isFocused ? catColor : 'rgba(124,106,239,0.4)',
                                        border: `2px solid ${isFocused ? catColor : 'rgba(124,106,239,0.2)'}`,
                                        transform: 'translateX(-50%)',
                                        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                                        boxShadow: isFocused ? `0 0 12px ${catColor}40` : 'none',
                                    }} />

                                    {/* Event card */}
                                    <div style={{
                                        background: isFocused
                                            ? 'rgba(255,255,255,0.06)'
                                            : 'rgba(255,255,255,0.02)',
                                        border: isFocused
                                            ? `1px solid ${catColor}30`
                                            : '1px solid rgba(255,255,255,0.04)',
                                        borderRadius: '10px',
                                        padding: '0.9rem 1rem',
                                        backdropFilter: 'blur(16px)',
                                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                                        boxShadow: isFocused
                                            ? `0 4px 30px ${catColor}10`
                                            : 'none',
                                    }}>
                                        {/* Time */}
                                        <div style={{
                                            fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                                            fontWeight: 400,
                                            color: catColor,
                                            fontVariantNumeric: 'tabular-nums',
                                            letterSpacing: '0.1em',
                                            marginBottom: '0.3rem',
                                        }}>
                                            {event.time}{event.endTime ? ` — ${event.endTime}` : ''}
                                        </div>
                                        {/* Title */}
                                        <div style={{
                                            fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                                            fontWeight: isFocused ? 500 : 300,
                                            color: isFocused ? '#ffffff' : 'rgba(255,255,255,0.7)',
                                            letterSpacing: '0.02em',
                                            transition: 'all 0.3s ease',
                                        }}>
                                            {event.title}
                                        </div>
                                        {/* Venue */}
                                        <div style={{
                                            fontSize: 'clamp(0.55rem, 0.7vw, 0.65rem)',
                                            fontWeight: 300,
                                            color: 'rgba(255,255,255,0.3)',
                                            marginTop: '0.2rem',
                                            letterSpacing: '0.05em',
                                        }}>
                                            📍 {event.venue}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Right: Event Detail Panel ── */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}>
                    {focusedEvent ? (
                        <div
                            key={focusedEvent.title}
                            style={{
                                maxWidth: '500px',
                                width: '100%',
                                padding: '2.5rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '16px',
                                backdropFilter: 'blur(24px)',
                                animation: 'scheduleDetailIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
                            }}
                        >
                            {/* Category pill */}
                            {focusedEvent.category && (
                                <div style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.65rem',
                                    fontWeight: 500,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: CATEGORY_COLORS[focusedEvent.category] || '#6a8cff',
                                    background: `${CATEGORY_COLORS[focusedEvent.category] || '#6a8cff'}15`,
                                    border: `1px solid ${CATEGORY_COLORS[focusedEvent.category] || '#6a8cff'}30`,
                                    marginBottom: '1.2rem',
                                }}>
                                    {focusedEvent.category}
                                </div>
                            )}

                            {/* Title */}
                            <h2 style={{
                                fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
                                fontWeight: 300,
                                color: '#ffffff',
                                letterSpacing: '0.06em',
                                margin: 0,
                                lineHeight: 1.2,
                            }}>
                                {focusedEvent.title}
                            </h2>

                            {/* Time & Venue */}
                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                marginTop: '1rem',
                                fontSize: 'clamp(0.7rem, 0.9vw, 0.85rem)',
                                color: 'rgba(255,255,255,0.5)',
                                fontWeight: 300,
                                letterSpacing: '0.05em',
                            }}>
                                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    🕐 {focusedEvent.time}{focusedEvent.endTime ? ` — ${focusedEvent.endTime}` : ''}
                                </span>
                                <span>📍 {focusedEvent.venue}</span>
                            </div>

                            {/* Divider */}
                            <div style={{
                                height: '1px',
                                background: 'linear-gradient(to right, rgba(124,106,239,0.3), transparent)',
                                margin: '1.5rem 0',
                            }} />

                            {/* Description */}
                            {focusedEvent.description && (
                                <p style={{
                                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                                    fontWeight: 300,
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.7,
                                    letterSpacing: '0.02em',
                                    margin: 0,
                                }}>
                                    {focusedEvent.description}
                                </p>
                            )}
                        </div>
                    ) : (
                        /* Empty state */
                        <div style={{
                            textAlign: 'center',
                            opacity: cardsRevealed ? 1 : 0,
                            transition: 'opacity 1s ease 0.8s',
                        }}>
                            <div style={{
                                fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                                fontWeight: 200,
                                color: 'rgba(255,255,255,0.15)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}>
                                Select an event
                            </div>
                            <div style={{
                                fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
                                fontWeight: 300,
                                color: 'rgba(255,255,255,0.08)',
                                marginTop: '0.5rem',
                                letterSpacing: '0.06em',
                            }}>
                                to see details
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Inline keyframes */}
            <style>{`
                @keyframes scheduleDetailIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                /* Hide scrollbar in timeline */
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ScheduleSection;
