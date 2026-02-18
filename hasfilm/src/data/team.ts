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
    { name: 'Tanu Patwal', role: 'Assistant General Secretary (Website)', image: '/assets/team/ags-website-Tanu-Patwal.webp' },
    { name: 'Aditya Paswan', role: 'Assistant General Secretary (Website)', image: '/assets/team/ags_website_aditya-paswan.webp' },
    { name: 'Love', role: 'Assistant General Secretary (Website)', image: '/assets/team/ags-website-love.webp' },
    { name: 'Krishna', role: 'General Secretary', image: '/assets/team/gs-krishna.webp' },
    { name: 'Farhan', role: 'Assistant General Secretary', image: '/assets/team/ags-farhan.webp' },
    { name: 'Aashi', role: 'Assistant General Secretary', image: '/assets/team/ags-aashi.webp' },
    { name: 'Rajat', role: 'Assistant General Secretary', image: '/assets/team/ags-rajat.webp' },
    { name: 'Bhawana', role: 'Assistant General Secretary (Sponsorship)', image: '/assets/team/ags-sponsorship-bhawana.webp' },
    { name: 'Dev Sharma', role: 'Assistant General Secretary (Classroom)', image: '/assets/team/ags-classroom.webp' },
    { name: 'Harshit', role: 'Assistant General Secretary (Canteen)', image: '/assets/team/ags_canteen_harshit.webp' },
    { name: 'Hemang', role: 'Assistant General Secretary', image: '/assets/team/ags-hemang.webp' },
    { name: 'Mahima', role: 'Assistant General Secretary (Amphitheatre)', image: '/assets/team/ags-amphitheatre-mahima.webp' },
    { name: 'Nikhil', role: 'Assistant General Secretary (Non-Tech)', image: '/assets/team/ags-non-tech-nikhil.webp' },
    { name: 'Pawan', role: 'Assistant General Secretary (Media)', image: '/assets/team/ags-media-pawan.webp' },
    { name: 'Piyush', role: 'Assistant General Secretary', image: '/assets/team/ags-piyush.webp' },
    { name: 'Rajeshwari', role: 'Assistant General Secretary', image: '/assets/team/ags-rajeshwari.webp' },
    { name: 'Sahitya', role: 'Assistant General Secretary (Media)', image: '/assets/team/ags-media-sahitya.webp' },
    { name: 'Shivansh', role: 'Assistant General Secretary (Marketing)', image: '/assets/team/ags-marketing-shivansh.webp' },
    { name: 'Shruti', role: 'Assistant General Secretary (Marketing)', image: '/assets/team/ags_shruti_marketing.webp' },
    { name: 'Shubham', role: 'Assistant General Secretary (Media)', image: '/assets/team/ags-media-shubham.webp' },
    { name: 'Vinayak', role: 'Assistant General Secretary (Tech)', image: '/assets/team/ags-tech-vinayak.webp' },
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
