// src/data/schedule.ts

export interface ScheduleEvent {
    dayId: number;
    time: string;
    endTime?: string;
    title: string;
    venue: string;
    description?: string;
    category?: 'tech' | 'cultural' | 'sports' | 'ceremony' | 'music';
    image: string;
    prizePool?: string;
    teamSize?: string;
}

export interface ScheduleDay {
    id: number;
    label: string;
    date: string;
}

export const SCHEDULE_DAYS: ScheduleDay[] = [
    { id: 1, label: 'DAY 01', date: 'Feb 25' },
    { id: 2, label: 'DAY 02', date: 'Feb 26' },
    { id: 3, label: 'DAY 03', date: 'Feb 27' },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
    // ── Day 1 ──
    {
        dayId: 1, time: '10:00', endTime: '11:00',
        title: 'Opening Ceremony', venue: 'Main Auditorium',
        category: 'ceremony',
        description: 'The grand inauguration of Utkarsh — lighting of the lamp, keynote address, and the official countdown.',
        image: '/assets/eventimg/img1.jpg',
    },
    {
        dayId: 1, time: '11:30', endTime: '13:00',
        title: 'Hackathon Kickoff', venue: 'Innovation Lab',
        category: 'tech',
        description: '24 hours of non-stop coding. Teams of 4. Build anything. The clock starts now.',
        image: '/assets/eventimg/img2.jpg',
        prizePool: '₹75,000',
        teamSize: '2-4 Members',
    },
    {
        dayId: 1, time: '14:00', endTime: '16:00',
        title: 'Dance Battle', venue: 'Open Stage',
        category: 'cultural',
        description: 'Crews from across the state go head-to-head in an electrifying dance showdown.',
        image: '/assets/eventimg/img3.jpg',
        prizePool: '₹30,000',
        teamSize: '4-8 Members',
    },
    {
        dayId: 1, time: '16:30', endTime: '18:00',
        title: 'Robotics Arena', venue: 'Tech Block C',
        category: 'tech',
        description: 'Autonomous bots compete in obstacle courses, sumo wrestling, and line following.',
        image: '/assets/eventimg/img4.jpg',
        prizePool: '₹50,000',
        teamSize: '2-4 Members',
    },
    {
        dayId: 1, time: '19:00', endTime: '22:00',
        title: 'Pro Night — DJ Set', venue: 'Main Stage',
        category: 'music',
        description: 'The bass drops as the campus transforms into a festival ground under the stars.',
        image: '/assets/eventimg/img5.jpg',
    },

    // ── Day 2 ──
    {
        dayId: 2, time: '09:00', endTime: '10:30',
        title: 'Guest Lecture', venue: 'Seminar Hall',
        category: 'tech',
        description: 'Industry leaders share insights on AI, startups, and the future of technology.',
        image: '/assets/eventimg/img6.jpg',
    },
    {
        dayId: 2, time: '11:00', endTime: '13:00',
        title: 'Art Exhibition', venue: 'Gallery Wing',
        category: 'cultural',
        description: 'Student artists showcase paintings, sculptures, and digital installations.',
        image: '/assets/eventimg/img7.jpg',
    },
    {
        dayId: 2, time: '14:00', endTime: '17:00',
        title: 'Cricket Finals', venue: 'Sports Ground',
        category: 'sports',
        description: 'The culmination of the inter-college cricket tournament. Winner takes the trophy.',
        image: '/assets/eventimg/img8.jpg',
        prizePool: '₹40,000',
        teamSize: '11 Members',
    },
    {
        dayId: 2, time: '17:30', endTime: '19:00',
        title: 'Stand-Up Comedy', venue: 'Open Stage',
        category: 'cultural',
        description: 'Laugh till it hurts. Campus comedians and a surprise guest keep the energy high.',
        image: '/assets/eventimg/img9.jpg',
    },
    {
        dayId: 2, time: '20:00', endTime: '23:00',
        title: 'Band Night', venue: 'Main Stage',
        category: 'music',
        description: 'Live performances from student bands and a headliner act that will shake the ground.',
        image: '/assets/eventimg/img1.jpg',
    },

    // ── Day 3 ──
    {
        dayId: 3, time: '10:00', endTime: '12:00',
        title: 'Hackathon Demos', venue: 'Innovation Lab',
        category: 'tech',
        description: 'Teams present their creations to a panel of judges. The best hack wins it all.',
        image: '/assets/eventimg/img2.jpg',
        prizePool: '₹75,000',
        teamSize: '2-4 Members',
    },
    {
        dayId: 3, time: '12:30', endTime: '14:00',
        title: 'Fashion Show', venue: 'Main Auditorium',
        category: 'cultural',
        description: 'Glamour meets creativity — students walk the ramp in original designs.',
        image: '/assets/eventimg/img3.jpg',
    },
    {
        dayId: 3, time: '15:00', endTime: '17:00',
        title: 'E-Sports Tournament', venue: 'Gaming Arena',
        category: 'tech',
        description: 'Valorant and FIFA finals on the big screen. May the best gamer win.',
        image: '/assets/eventimg/img5.jpg',
        prizePool: '₹60,000',
        teamSize: '1-5 Members',
    },
    {
        dayId: 3, time: '18:00', endTime: '19:30',
        title: 'Awards & Closing', venue: 'Main Auditorium',
        category: 'ceremony',
        description: 'Celebrating the winners, the moments, and the memories. See you next year.',
        image: '/assets/eventimg/img6.jpg',
    },
    {
        dayId: 3, time: '20:00', endTime: '23:00',
        title: 'Star Night', venue: 'Main Stage',
        category: 'music',
        description: 'The grand finale — a celebrity performance to close Utkarsh with a bang.',
        image: '/assets/eventimg/img7.jpg',
    },
];

export function getEventsForDay(dayId: number): ScheduleEvent[] {
    return SCHEDULE_EVENTS.filter(e => e.dayId === dayId);
}

// Category accent colors
export const CATEGORY_COLORS: Record<string, string> = {
    tech: '#38BDF8',
    cultural: '#A78BFA',
    sports: '#34D399',
    ceremony: '#FBBF24',
    music: '#F472B6',
};
