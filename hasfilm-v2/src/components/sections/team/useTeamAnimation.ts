
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS } from '@/data/team';

gsap.registerPlugin(ScrollTrigger);

export function useTeamAnimation(
    containerRef: React.RefObject<HTMLDivElement | null>,
    setActiveIndex: (index: number) => void
) {
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        // Pin the section while we scroll through the list
        // The scroll distance is determined by the number of team members

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${TEAM_MEMBERS.length * 50}%`, // 50% viewport height per member
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => {
                // Calculate which index is active based on progress
                // self.progress is 0 to 1
                const index = Math.min(
                    Math.floor(self.progress * TEAM_MEMBERS.length),
                    TEAM_MEMBERS.length - 1
                );
                setActiveIndex(index);
            },
        });

    }, { scope: containerRef, dependencies: [setActiveIndex] }); // dependencies might need check
}
