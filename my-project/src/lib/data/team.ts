export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    socials?: {
        linkedin?: string;
        github?: string;
        instagram?: string;
    }
}

export const TEAM: TeamMember[] = [
    {
        id: 'aditya',
        name: 'ADITYA PASWAN',
        role: 'LEAD DEVELOPER',
        image: '/assets/team/aditya.jpg'
    },
    {
        id: 'tanu',
        name: 'TANU PATWAL',
        role: 'CREATIVE DIRECTOR',
        image: '/assets/team/tanu.jpg'
    },
    {
        id: 'rishabh',
        name: 'RISHABH SINGH',
        role: 'EVENT MANAGER',
        image: '/assets/team/rishabh.jpg'
    },
    {
        id: 'shreya',
        name: 'SHREYA GUPTA',
        role: 'PR & OUTREACH',
        image: '/assets/team/shreya.jpg'
    },
    {
        id: 'rahul',
        name: 'RAHUL KUMAR',
        role: 'TECHNICAL HEAD',
        image: '/assets/team/rahul.jpg'
    },
    {
        id: 'priya',
        name: 'PRIYA SHARMA',
        role: 'DESIGN LEAD',
        image: '/assets/team/priya.jpg'
    }
];
