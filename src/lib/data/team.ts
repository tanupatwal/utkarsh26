// src/lib/data/team.ts

export interface TeamMember {
    name: string;
    role: string;
    image: string;
}

/**
 * Team members — 24 entries.
 * Uses images from static/assets/team/.
 */
export const TEAM_MEMBERS: TeamMember[] = [
    { name: 'ADITYA', role: 'President', image: '/assets/team/gs.png' },
    { name: 'PRIYA', role: 'Vice President', image: '/assets/team/gs1.jpg' },
    { name: 'ROHAN', role: 'General Secretary', image: '/assets/team/gs2.jpg' },
    { name: 'ANANYA', role: 'Treasurer', image: '/assets/team/gs3.jpg' },
    { name: 'VIKRAM', role: 'Tech Lead', image: '/assets/team/tech1.png' },
    { name: 'SNEHA', role: 'Tech Co-Lead', image: '/assets/team/tech2.png' },
    { name: 'ARJUN', role: 'Marketing Head', image: '/assets/team/marketing1.png' },
    { name: 'KAVYA', role: 'Marketing Co-Head', image: '/assets/team/marketing2.png' },
    { name: 'RAHUL', role: 'PR & Outreach', image: '/assets/team/marketing3.png' },
    { name: 'MEERA', role: 'Media Head', image: '/assets/team/media1.png' },
    { name: 'SARTHAK', role: 'Media Co-Head', image: '/assets/team/media2.png' },
    { name: 'ISHAAN', role: 'Content Lead', image: '/assets/team/media3.png' },
    { name: 'RIYA', role: 'Creative Director', image: '/assets/team/creativity1.png' },
    { name: 'MANAV', role: 'Design Lead', image: '/assets/team/creativity2.png' },
    { name: 'TANVI', role: 'Design Co-Lead', image: '/assets/team/creativity3.png' },
    { name: 'KUNAL', role: 'Sponsorship Head', image: '/assets/team/spons1.png' },
    { name: 'NISHA', role: 'Sponsorship Co-Head', image: '/assets/team/spons2.png' },
    { name: 'AARAV', role: 'Stage Manager', image: '/assets/team/agstage.png' },
    { name: 'DIYA', role: 'Event Coordinator', image: '/assets/team/agstage2.png' },
    { name: 'SAHIL', role: 'Web Lead', image: '/assets/team/agsweb1.png' },
    { name: 'POOJA', role: 'Web Developer', image: '/assets/team/agsweb2.png' },
    { name: 'DHRUV', role: 'Hospitality Head', image: '/assets/team/hospitality1.png' },
    { name: 'SIMRAN', role: 'Hospitality Co-Head', image: '/assets/team/hospitality2.png' },
    { name: 'KARAN', role: 'Logistics Head', image: '/assets/team/amphi.png' },
];

/**
 * Background drift images — group/event photos for the ambient parallax layer.
 */
export const TEAM_BG_IMAGES: string[] = [
    '/assets/team-bg/bg1.webp',
    '/assets/team-bg/bg2.webp',
    '/assets/team-bg/bg3.webp',
    '/assets/team-bg/bg4.webp',
    '/assets/team-bg/bg5.webp',
    '/assets/team-bg/bg6.jpg',
    '/assets/team-bg/bg7.jpg',
    '/assets/team-bg/bg8.jpg',
    '/assets/team-bg/bg9.jpg',
    '/assets/team-bg/bg10.jpg',
];
