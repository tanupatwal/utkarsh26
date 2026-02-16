export interface ScheduleItem {
    time: string;
    title: string;
    location: string;
    category: string;
}

export interface DaySchedule {
    id: number;
    label: string;
    date: string;
    events: ScheduleItem[];
}

export const SCHEDULE: DaySchedule[] = [
    {
        id: 1,
        label: 'DAY 1',
        date: 'MARCH 14',
        events: [
            { time: '10:00 AM', title: 'Inauguration', location: 'Main Audi', category: 'General' },
            { time: '11:30 AM', title: 'Hackathon Starts', location: 'Lab Complex', category: 'Technical' },
            { time: '02:00 PM', title: 'Robo Wars (Round 1)', location: 'Open Air Theatre', category: 'Technical' },
            { time: '06:00 PM', title: 'Battle of Bands', location: 'Main Stage', category: 'Cultural' },
            { time: '09:00 PM', title: 'DJ Night', location: 'Main Ground', category: 'Flagship' }
        ]
    },
    {
        id: 2,
        label: 'DAY 2',
        date: 'MARCH 15',
        events: [
            { time: '09:00 AM', title: 'Code Golf', location: 'Lab 3', category: 'Technical' },
            { time: '11:00 AM', title: 'Esports Finals', location: 'Seminar Hall', category: 'Esports' },
            { time: '03:00 PM', title: 'Fashion Show', location: 'Main Audi', category: 'Cultural' },
            { time: '07:00 PM', title: 'Star Performance', location: 'Main Stage', category: 'Flagship' }
        ]
    },
    {
        id: 3,
        label: 'DAY 3',
        date: 'MARCH 16',
        events: [
            { time: '10:00 AM', title: 'Treasure Hunt', location: 'Campus Wide', category: 'Cultural' },
            { time: '01:00 PM', title: 'Hackathon Judging', location: 'Lab Complex', category: 'Technical' },
            { time: '04:00 PM', title: 'Prize Distribution', location: 'Main Audi', category: 'General' },
            { time: '06:00 PM', title: 'Closing Ceremony', location: 'Main Audi', category: 'General' }
        ]
    }
];
