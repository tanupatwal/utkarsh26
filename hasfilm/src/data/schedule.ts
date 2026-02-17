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
    registrationLink?: string;
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

const img = (n: number) => `/assets/eventimg/img${((n - 1) % 9) + 1}.webp`;

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
    // ════════════════════════════════════════
    //  DAY 1 — 20 events
    // ════════════════════════════════════════
    { dayId: 1, time: '08:00', endTime: '09:00', title: 'Opening Ceremony', venue: 'Main Auditorium', category: 'ceremony', description: 'The grand inauguration of Utkarsh — lighting of the lamp, keynote address, and the official countdown.', image: img(1) },
    { dayId: 1, time: '09:00', endTime: '11:00', title: 'Hackathon Kickoff', venue: 'Innovation Lab', category: 'tech', description: '24 hours of non-stop coding. Teams of 4. Build anything. The clock starts now.', image: img(2), prizePool: '₹75,000', teamSize: '2-4 Members' },
    { dayId: 1, time: '09:30', endTime: '11:00', title: 'Robo Wars', venue: 'Tech Block C', category: 'tech', description: 'Design, build, and battle your custom combat robot for supremacy in the arena.', image: img(3), prizePool: '₹50,000', teamSize: '2-4 Members' },
    { dayId: 1, time: '10:00', endTime: '12:00', title: 'Dance Battle', venue: 'Open Stage', category: 'cultural', description: 'Crews from across the state go head-to-head in an electrifying dance showdown.', image: img(4), prizePool: '₹30,000', teamSize: '4-8 Members' },
    { dayId: 1, time: '10:00', endTime: '11:30', title: 'Code Sprint', venue: 'Lab 201', category: 'tech', description: 'Solve algorithmic challenges under intense time pressure. Only the sharpest coders survive.', image: img(5), prizePool: '₹25,000', teamSize: '1-2 Members' },
    { dayId: 1, time: '10:30', endTime: '12:00', title: 'Photography Walk', venue: 'Campus Grounds', category: 'cultural', description: 'Capture the essence of the fest through your lens. Best shots win prizes.', image: img(6) },
    { dayId: 1, time: '11:00', endTime: '13:00', title: 'Cricket T10', venue: 'Sports Ground', category: 'sports', description: 'Fast-paced T10 cricket with knockout rounds. Bring your A-game.', image: img(7), prizePool: '₹20,000', teamSize: '11 Members' },
    { dayId: 1, time: '11:30', endTime: '13:00', title: 'AI Nexus', venue: 'Seminar Hall B', category: 'tech', description: 'Workshop on building AI agents — from prompt engineering to autonomous systems.', image: img(8) },
    { dayId: 1, time: '12:00', endTime: '13:30', title: 'Meme War', venue: 'Student Center', category: 'cultural', description: 'The internet\'s finest art form meets live competition. Create, present, dominate.', image: img(9), prizePool: '₹5,000' },
    { dayId: 1, time: '13:00', endTime: '14:30', title: 'CTF Arena', venue: 'Cyber Lab', category: 'tech', description: 'Capture The Flag — crack ciphers, exploit vulnerabilities, and hack your way to the top.', image: img(1), prizePool: '₹40,000', teamSize: '2-3 Members' },
    { dayId: 1, time: '14:00', endTime: '15:30', title: 'Debate Championship', venue: 'Seminar Hall A', category: 'cultural', description: 'Oxford-style debates on the most polarizing topics of our time.', image: img(2), teamSize: '2 Members' },
    { dayId: 1, time: '14:00', endTime: '16:00', title: 'Futsal League', venue: 'Indoor Court', category: 'sports', description: 'Five-a-side football with non-stop action. Fast feet and faster goals.', image: img(3), prizePool: '₹15,000', teamSize: '5+2 Members' },
    { dayId: 1, time: '14:30', endTime: '16:00', title: 'Pitch Fest', venue: 'Innovation Lab', category: 'tech', description: 'Got a startup idea? Pitch it to real investors and win seed funding.', image: img(4), prizePool: '₹1,00,000' },
    { dayId: 1, time: '15:00', endTime: '16:30', title: 'Beatboxing Showdown', venue: 'Open Stage', category: 'music', description: 'Drop beats with nothing but your voice. The crowd decides the winner.', image: img(5), prizePool: '₹10,000' },
    { dayId: 1, time: '15:30', endTime: '17:00', title: 'Drone Racing', venue: 'Sports Ground', category: 'tech', description: 'FPV drones race through an obstacle course at breakneck speed.', image: img(6), prizePool: '₹35,000', teamSize: '1-2 Members' },
    { dayId: 1, time: '16:00', endTime: '17:30', title: 'Treasure Hunt', venue: 'Full Campus', category: 'cultural', description: 'Solve cryptic clues and race to hidden checkpoints across campus.', image: img(7), teamSize: '3-5 Members' },
    { dayId: 1, time: '16:30', endTime: '18:00', title: 'Robotics Arena', venue: 'Tech Block C', category: 'tech', description: 'Autonomous bots compete in obstacle courses, sumo wrestling, and line following.', image: img(8), prizePool: '₹50,000', teamSize: '2-4 Members' },
    { dayId: 1, time: '17:00', endTime: '18:30', title: 'Open Mic Night', venue: 'Amphitheatre', category: 'music', description: 'Singers, poets, comedians — the stage is yours. Sign up and shine.', image: img(9) },
    { dayId: 1, time: '18:00', endTime: '19:30', title: 'Battle of Bands', venue: 'Main Stage', category: 'music', description: 'College bands go head-to-head in an epic musical showdown.', image: img(1), prizePool: '₹25,000', teamSize: '3-7 Members' },
    { dayId: 1, time: '20:00', endTime: '23:00', title: 'Pro Night — DJ Set', venue: 'Main Stage', category: 'music', description: 'The bass drops as the campus transforms into a festival ground under the stars.', image: img(2) },

    // ════════════════════════════════════════
    //  DAY 2 — 20 events
    // ════════════════════════════════════════
    { dayId: 2, time: '08:30', endTime: '10:00', title: 'Yoga & Wellness', venue: 'Sports Ground', category: 'sports', description: 'Start the day with energy. Yoga, meditation, and group warm-ups.', image: img(3) },
    { dayId: 2, time: '09:00', endTime: '10:30', title: 'Guest Lecture', venue: 'Seminar Hall A', category: 'tech', description: 'Industry leaders share insights on AI, startups, and the future of technology.', image: img(4) },
    { dayId: 2, time: '09:30', endTime: '11:00', title: 'Web Dev Sprint', venue: 'Lab 301', category: 'tech', description: 'Build a full-stack web app in 90 minutes. Judged on design, functionality, and creativity.', image: img(5), prizePool: '₹20,000', teamSize: '1-3 Members' },
    { dayId: 2, time: '10:00', endTime: '12:00', title: 'Art Exhibition', venue: 'Gallery Wing', category: 'cultural', description: 'Student artists showcase paintings, sculptures, and digital installations.', image: img(6) },
    { dayId: 2, time: '10:00', endTime: '11:30', title: 'Quiz Bowl', venue: 'Seminar Hall B', category: 'cultural', description: 'Test your general knowledge in this high-stakes, rapid-fire quiz competition.', image: img(7), prizePool: '₹15,000', teamSize: '3 Members' },
    { dayId: 2, time: '10:30', endTime: '12:00', title: 'E-Sports: Valorant', venue: 'Gaming Arena', category: 'tech', description: 'Squad up and dominate in the Valorant tournament. Glory awaits.', image: img(8), prizePool: '₹30,000', teamSize: '5 Members' },
    { dayId: 2, time: '11:00', endTime: '13:00', title: 'Street Play', venue: 'Open Stage', category: 'cultural', description: 'Nukkad Natak — powerful street theatre tackling social issues.', image: img(9), teamSize: '8-15 Members' },
    { dayId: 2, time: '11:30', endTime: '13:00', title: 'IoT Workshop', venue: 'Lab 201', category: 'tech', description: 'Hands-on workshop: build a smart home device with Arduino and sensors.', image: img(1) },
    { dayId: 2, time: '12:00', endTime: '14:00', title: 'Basketball 3v3', venue: 'Indoor Court', category: 'sports', description: 'Half-court, full intensity. Three-on-three basketball with knockout format.', image: img(2), prizePool: '₹12,000', teamSize: '3+1 Members' },
    { dayId: 2, time: '13:00', endTime: '14:30', title: 'Cooking Without Fire', venue: 'Student Center', category: 'cultural', description: 'Create gourmet dishes without any heat source. Creativity is the main ingredient.', image: img(3), teamSize: '2 Members' },
    { dayId: 2, time: '14:00', endTime: '17:00', title: 'Cricket Finals', venue: 'Sports Ground', category: 'sports', description: 'The culmination of the inter-college cricket tournament. Winner takes the trophy.', image: img(4), prizePool: '₹40,000', teamSize: '11 Members' },
    { dayId: 2, time: '14:00', endTime: '15:30', title: 'Short Film Screening', venue: 'Auditorium B', category: 'cultural', description: 'Student-directed short films premiere on the big screen. Followed by Q&A.', image: img(5) },
    { dayId: 2, time: '15:00', endTime: '16:30', title: 'ML Challenge', venue: 'Cyber Lab', category: 'tech', description: 'Build and train a machine learning model on a surprise dataset. Accuracy wins.', image: img(6), prizePool: '₹30,000', teamSize: '1-2 Members' },
    { dayId: 2, time: '15:30', endTime: '17:00', title: 'Arm Wrestling', venue: 'Amphitheatre', category: 'sports', description: 'Raw strength, technique, and willpower. Weight categories from 60kg to 90kg+.', image: img(7), prizePool: '₹8,000' },
    { dayId: 2, time: '16:00', endTime: '17:30', title: 'Fashion Design', venue: 'Gallery Wing', category: 'cultural', description: 'Design an outfit from recycled materials. Sustainability meets high fashion.', image: img(8), teamSize: '2-3 Members' },
    { dayId: 2, time: '16:30', endTime: '18:00', title: 'Rap Battle', venue: 'Amphitheatre', category: 'music', description: 'Bars, flow, and punchlines. Freestyle rap with elimination rounds.', image: img(9), prizePool: '₹10,000' },
    { dayId: 2, time: '17:00', endTime: '18:30', title: 'Stand-Up Comedy', venue: 'Open Stage', category: 'cultural', description: 'Laugh till it hurts. Campus comedians and a surprise guest keep the energy high.', image: img(1) },
    { dayId: 2, time: '18:00', endTime: '19:30', title: 'Unplugged Session', venue: 'Amphitheatre', category: 'music', description: 'Acoustic performances under the evening sky. Pure music, zero electronics.', image: img(2) },
    { dayId: 2, time: '19:00', endTime: '20:30', title: 'DJ Workshop', venue: 'Main Stage', category: 'music', description: 'Learn mixing, scratching, and beat-matching from a professional DJ.', image: img(3) },
    { dayId: 2, time: '20:00', endTime: '23:00', title: 'Band Night', venue: 'Main Stage', category: 'music', description: 'Live performances from student bands and a headliner act that will shake the ground.', image: img(4) },

    // ════════════════════════════════════════
    //  DAY 3 — 20 events
    // ════════════════════════════════════════
    { dayId: 3, time: '08:00', endTime: '09:30', title: 'Fun Run 5K', venue: 'Campus Loop', category: 'sports', description: 'A fun 5K run around campus with colour splashes and music at every kilometer.', image: img(5) },
    { dayId: 3, time: '09:00', endTime: '11:00', title: 'Hackathon Demos', venue: 'Innovation Lab', category: 'tech', description: 'Teams present their creations to a panel of judges. The best hack wins it all.', image: img(6), prizePool: '₹75,000', teamSize: '2-4 Members' },
    { dayId: 3, time: '09:30', endTime: '11:00', title: 'Paper Presentation', venue: 'Seminar Hall B', category: 'tech', description: 'Present your research to an academic panel. Best paper wins publication support.', image: img(7) },
    { dayId: 3, time: '10:00', endTime: '12:00', title: 'Cosplay Contest', venue: 'Main Auditorium', category: 'cultural', description: 'Become your favorite character. Judged on accuracy, creativity, and stage presence.', image: img(8), prizePool: '₹15,000' },
    { dayId: 3, time: '10:00', endTime: '11:30', title: 'E-Sports: FIFA', venue: 'Gaming Arena', category: 'tech', description: 'FIFA 26 tournament on the big screen. May the best gamer win.', image: img(9), prizePool: '₹20,000' },
    { dayId: 3, time: '10:30', endTime: '12:00', title: 'Pottery Workshop', venue: 'Art Room', category: 'cultural', description: 'Get your hands dirty. Learn the art of wheel-thrown pottery from a master craftsperson.', image: img(1) },
    { dayId: 3, time: '11:00', endTime: '13:00', title: 'Badminton Finals', venue: 'Indoor Court', category: 'sports', description: 'Singles and doubles finals. Speed, precision, and nerves of steel.', image: img(2), prizePool: '₹10,000' },
    { dayId: 3, time: '11:30', endTime: '13:00', title: 'Blockchain Talk', venue: 'Seminar Hall A', category: 'tech', description: 'Deep dive into DeFi, NFTs, and the future of decentralized technology.', image: img(3) },
    { dayId: 3, time: '12:00', endTime: '13:30', title: 'Rangoli Competition', venue: 'Gallery Wing', category: 'cultural', description: 'Create stunning colorful rangolis. Blend tradition with innovation.', image: img(4), teamSize: '2-3 Members' },
    { dayId: 3, time: '12:30', endTime: '14:00', title: 'Fashion Show', venue: 'Main Auditorium', category: 'cultural', description: 'Glamour meets creativity — students walk the ramp in original designs.', image: img(5) },
    { dayId: 3, time: '13:00', endTime: '14:30', title: 'Chess Blitz', venue: 'Student Center', category: 'sports', description: '3-minute chess blitz tournament. Rapid thinking under brutal time pressure.', image: img(6), prizePool: '₹8,000' },
    { dayId: 3, time: '14:00', endTime: '15:30', title: 'Virtuality', venue: 'Lab 301', category: 'tech', description: 'VR gaming experience — explore immersive worlds and compete in virtual challenges.', image: img(7) },
    { dayId: 3, time: '14:30', endTime: '16:00', title: 'Graffiti Wall', venue: 'Campus Grounds', category: 'cultural', description: 'Spray paint your vision on the fest wall. Street art at its finest.', image: img(8) },
    { dayId: 3, time: '15:00', endTime: '17:00', title: 'E-Sports Tournament', venue: 'Gaming Arena', category: 'tech', description: 'Grand finals across all titles on the big screen. Massive crowd, massive stakes.', image: img(9), prizePool: '₹60,000', teamSize: '1-5 Members' },
    { dayId: 3, time: '15:30', endTime: '17:00', title: 'Tug of War', venue: 'Sports Ground', category: 'sports', description: 'Raw power meets team coordination. Eight vs eight, no mercy.', image: img(1), teamSize: '8 Members' },
    { dayId: 3, time: '16:00', endTime: '17:30', title: 'Slam Poetry', venue: 'Amphitheatre', category: 'cultural', description: 'Words that hit hard. Spoken word performances that leave the audience breathless.', image: img(2), prizePool: '₹8,000' },
    { dayId: 3, time: '17:00', endTime: '18:30', title: 'Awards & Closing', venue: 'Main Auditorium', category: 'ceremony', description: 'Celebrating the winners, the moments, and the memories. See you next year.', image: img(3) },
    { dayId: 3, time: '18:00', endTime: '19:30', title: 'Lantern Release', venue: 'Sports Ground', category: 'ceremony', description: 'Light a lantern and let it float into the night sky. A moment of collective beauty.', image: img(4) },
    { dayId: 3, time: '19:00', endTime: '20:00', title: 'Alumni Mixer', venue: 'Student Center', category: 'ceremony', description: 'Connect with alumni over snacks and stories. Networking that actually matters.', image: img(5) },
    { dayId: 3, time: '20:00', endTime: '23:00', title: 'Star Night', venue: 'Main Stage', category: 'music', description: 'The grand finale — a celebrity performance to close Utkarsh with a bang.', image: img(6) },
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
