import React from 'react';
import styles from './ScheduleSection.module.css';
import { CATEGORY_COLORS } from '@/data/schedule';
import type { ScheduleEvent } from '@/data/schedule';

interface EventCardProps {
    event: ScheduleEvent;
    onClick: (event: ScheduleEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    const categoryColor = CATEGORY_COLORS[event.category || 'tech'] || '#fff';

    return (
        <div
            className={`${styles.card} schedule-card`}
            onClick={() => onClick(event)}
            style={{ borderColor: `${categoryColor}33` }} // 20% opacity border
        >
            <div className={styles.cardImageWrapper}>
                <img src={event.image} alt={event.title} className={styles.cardImage} loading="lazy" />
            </div>

            <div className={styles.cardContent}>
                <span className={styles.cardCategory} style={{ color: categoryColor }}>
                    {event.category}
                </span>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <div className={styles.cardTime}>
                    {event.time} - {event.endTime} | {event.venue}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
