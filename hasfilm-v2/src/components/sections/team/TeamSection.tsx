import React, { useRef, useState } from 'react';
import styles from './TeamSection.module.css';
import { useTeamAnimation } from './useTeamAnimation';
import { TEAM_MEMBERS } from '@/data/team';

import TeamBackground from './TeamBackground';

const TeamSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useTeamAnimation(containerRef, setActiveIndex);

    return (
        <section ref={containerRef} className={styles.teamSection}>
            <TeamBackground />
            <div className={styles.content} style={{ zIndex: 2, position: 'relative' }}>
                {/* Left Panel: Photo Display */}
                <div className={styles.leftPanel}>
                    <div className={styles.imageContainer}>
                        {TEAM_MEMBERS.map((member, i) => (
                            <img
                                key={member.name}
                                src={member.image}
                                alt={member.name}
                                className={`${styles.memberImage} ${i === activeIndex ? styles.active : ''}`}
                                loading="eager" // Preload for smooth transition
                            />
                        ))}
                    </div>
                </div>

                {/* Right Panel: Name List */}
                <div className={styles.rightPanel}>
                    <ul className={styles.nameList}>
                        {TEAM_MEMBERS.map((member, i) => (
                            <li
                                key={i}
                                className={`${styles.nameItem} ${i === activeIndex ? styles.active : ''}`}
                                onClick={() => setActiveIndex(i)} // Allow click to jump
                            >
                                {member.name}
                                <span className={styles.role}>{member.role}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
