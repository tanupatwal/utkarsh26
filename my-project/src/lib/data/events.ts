export interface EventItem {
    id: string;
    title: string;
    category: 'FLAGSHIP' | 'CULTURAL' | 'ESPORTS' | 'TECHNICAL';
    description: string;
    image: string;
    color: string;
    span: string; // Tailwind grid classes
}

export const EVENTS: EventItem[] = [
    {
        id: 'robo-wars',
        title: 'ROBO WARS',
        category: 'TECHNICAL',
        description: 'The ultimate battle of steel and strategy. Watch bots clash for supremacy.',
        image: '/assets/events/robo.jpg',
        color: 'bg-red-500',
        span: 'md:col-span-2 md:row-span-2'
    },
    {
        id: 'hackathon',
        title: 'HACKATHON',
        category: 'TECHNICAL',
        description: '36 hours of non-stop coding. Solve real-world problems.',
        image: '/assets/events/hackathon.jpg',
        color: 'bg-blue-500',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'valorant',
        title: 'VALORANT',
        category: 'ESPORTS',
        description: 'Tactical shooter tournament. 5v5 action.',
        image: '/assets/events/valorant.jpg',
        color: 'bg-purple-500',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'fashion-show',
        title: 'PANACHE',
        category: 'CULTURAL',
        description: 'Walk the ramp in style. Theme: Cyberpunk 2077.',
        image: '/assets/events/fashion.jpg',
        color: 'bg-pink-500',
        span: 'md:col-span-1 md:row-span-2'
    },
    {
        id: 'edm-night',
        title: 'EDM NIGHT',
        category: 'FLAGSHIP',
        description: 'Drop the bass. Featuring top DJs from across the country.',
        image: '/assets/events/edm.jpg',
        color: 'bg-yellow-400',
        span: 'md:col-span-2 md:row-span-1'
    },
    {
        id: 'treasure-hunt',
        title: 'QUEST',
        category: 'CULTURAL',
        description: 'Solve riddles, find clues, claim the treasure.',
        image: '/assets/events/quest.jpg',
        color: 'bg-green-500',
        span: 'md:col-span-1 md:row-span-1'
    }
];
