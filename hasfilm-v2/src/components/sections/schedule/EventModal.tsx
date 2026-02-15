import React, { useEffect, useRef } from 'react';
import styles from './ScheduleSection.module.css';
import { CATEGORY_COLORS } from '@/data/schedule';
import type { ScheduleEvent } from '@/data/schedule';

interface EventModalProps {
    event: ScheduleEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!event) return null;

    const categoryColor = CATEGORY_COLORS[event.category || 'tech'] || '#fff';

    return (
        <div
            className={`${styles.modalOverlay} ${isOpen ? styles.modalOpen : ''}`}
            onClick={onClose}
        >
            <div
                ref={contentRef}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div className={styles.modalGrid}>
                    <img src={event.image} alt={event.title} className={styles.modalImage} />

                    <div className={styles.modalDetails}>
                        <span className={styles.cardCategory} style={{ color: categoryColor, fontSize: '1rem' }}>
                            {event.category}
                        </span>
                        <h2 className={styles.title} style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{event.title}</h2>

                        <div style={{ margin: '1.5rem 0', color: '#94a3b8' }}>
                            <p><strong>Time:</strong> {event.time} - {event.endTime}</p>
                            <p><strong>Venue:</strong> {event.venue}</p>
                            {event.prizePool && <p><strong>Prize Pool:</strong> {event.prizePool}</p>}
                            {event.teamSize && <p><strong>Team Size:</strong> {event.teamSize}</p>}
                        </div>

                        <p style={{ lineHeight: 1.6, color: '#e2e8f0' }}>{event.description}</p>

                        <button
                            style={{
                                marginTop: '2rem',
                                padding: '1rem 2rem',
                                background: categoryColor,
                                color: '#000',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textTransform: 'uppercase'
                            }}
                        >
                            Register Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
