import React, { useRef } from 'react';
import styles from './StatBar.module.css';
import { useStatAnimation } from './useStatAnimation';

interface Stat {
    label: string;
    value: number;
    suffix?: string;
}

interface StatBarProps {
    stats: Stat[];
}

const StatBar: React.FC<StatBarProps> = ({ stats }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useStatAnimation(containerRef, stats);

    return (
        <div ref={containerRef} className={styles.statBar}>
            {stats.map((stat, index) => (
                <div key={index} className={`${styles.statItem} stat-item`}>
                    <span className={`${styles.statValue} stat-value`}>0</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StatBar;
