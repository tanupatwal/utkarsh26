import React, { useRef, useState, useMemo } from 'react';
import styles from './ScheduleSection.module.css';
import { useScheduleAnimation } from './useScheduleAnimation';
import { SCHEDULE_DAYS, getEventsForDay } from '@/data/schedule';
import type { ScheduleEvent } from '@/data/schedule';
import EventCard from './EventCard';
import EventModal from './EventModal';

const ScheduleSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeDay, setActiveDay] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useScheduleAnimation(containerRef);

    const events = useMemo(() => getEventsForDay(activeDay), [activeDay]);

    const openModal = (event: ScheduleEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEvent(null), 300); // Clear after fade out
    };

    return (
        <section ref={containerRef} className={styles.scheduleSection}>
            <div className={styles.container}>
                <header className={`${styles.header} schedule-header`}>
                    <h2 className={styles.title}>Event Schedule</h2>
                    <p style={{ color: '#94a3b8' }}>Three days of non-stop action</p>
                </header>

                <div className={styles.tabs}>
                    {SCHEDULE_DAYS.map((day) => (
                        <button
                            key={day.id}
                            className={`${styles.tabBtn} ${activeDay === day.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveDay(day.id)}
                        >
                            {day.label} <span style={{ opacity: 0.6, fontSize: '0.8em' }}>| {day.date}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {events.map((event, index) => (
                        <EventCard
                            key={`${event.dayId}-${event.time}-${index}`}
                            event={event}
                            onClick={openModal}
                        />
                    ))}
                </div>
            </div>

            <EventModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </section>
    );
};

export default ScheduleSection;
