// src/data/team.ts

export interface TeamMember {
    name: string;
    role: string;
    image: string;
}

/**
 * Team members — 24 entries.
 * Uses images from public/assets/team/.
 */
export const TEAM_MEMBERS: TeamMember[] = [
    { name: 'ADITYA', role: 'President', image: '/assets/team/gs.webp' },
    { name: 'PRIYA', role: 'Vice President', image: '/assets/team/gs1.webp' },
    { name: 'ROHAN', role: 'General Secretary', image: '/assets/team/gs2.webp' },
    { name: 'ANANYA', role: 'Treasurer', image: '/assets/team/gs3.webp' },
    { name: 'VIKRAM', role: 'Tech Lead', image: '/assets/team/tech1.webp' },
    { name: 'SNEHA', role: 'Tech Co-Lead', image: '/assets/team/tech2.webp' },
    { name: 'ARJUN', role: 'Marketing Head', image: '/assets/team/marketing1.webp' },
    { name: 'KAVYA', role: 'Marketing Co-Head', image: '/assets/team/marketing2.webp' },
    { name: 'RAHUL', role: 'PR & Outreach', image: '/assets/team/marketing3.webp' },
    { name: 'MEERA', role: 'Media Head', image: '/assets/team/media1.webp' },
    { name: 'SARTHAK', role: 'Media Co-Head', image: '/assets/team/media2.webp' },
    { name: 'ISHAAN', role: 'Content Lead', image: '/assets/team/media3.webp' },
    { name: 'RIYA', role: 'Creative Director', image: '/assets/team/creativity1.webp' },
    { name: 'MANAV', role: 'Design Lead', image: '/assets/team/creativity2.webp' },
    { name: 'TANVI', role: 'Design Co-Lead', image: '/assets/team/creativity3.webp' },
    { name: 'KUNAL', role: 'Sponsorship Head', image: '/assets/team/spons1.webp' },
    { name: 'NISHA', role: 'Sponsorship Co-Head', image: '/assets/team/spons2.webp' },
    { name: 'AARAV', role: 'Stage Manager', image: '/assets/team/agstage.webp' },
    { name: 'DIYA', role: 'Event Coordinator', image: '/assets/team/agstage2.webp' },
    { name: 'SAHIL', role: 'Web Lead', image: '/assets/team/agsweb1.webp' },
    { name: 'POOJA', role: 'Web Developer', image: '/assets/team/agsweb2.webp' },
    { name: 'DHRUV', role: 'Hospitality Head', image: '/assets/team/hospitality1.webp' },
    { name: 'SIMRAN', role: 'Hospitality Co-Head', image: '/assets/team/hospitality2.webp' },
    { name: 'KARAN', role: 'Logistics Head', image: '/assets/team/amphi.webp' },
];

/**
 * Background drift images — group/event photos for the ambient parallax layer.
 * Located in public/assets/team-bg/.
 */
export const TEAM_BG_IMAGES: string[] = [
    '/assets/team-bg/bg1.webp',
    '/assets/team-bg/bg2.webp',
    '/assets/team-bg/bg3.webp',
    '/assets/team-bg/bg4.webp',
    '/assets/team-bg/bg5.webp',
    '/assets/team-bg/bg6.webp',
    '/assets/team-bg/bg7.webp',
    '/assets/team-bg/bg8.webp',
    '/assets/team-bg/bg9.webp',
    '/assets/team-bg/bg10.webp',
];
