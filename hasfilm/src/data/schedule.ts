// src/data/schedule.ts — Real event data from final list

export interface ScheduleEvent {
    dayId: number;
    time: string;
    title: string;
    venue: string;
    society?: string;
    coordinator?: string;
    coordinatorContact?: string;
    description?: string;
    registrationLink?: string;
    imageUrl?: string;
}

export interface ScheduleDay {
    id: number;
    label: string;
    date: string;
}

export const SCHEDULE_DAYS: ScheduleDay[] = [
    { id: 1, label: 'DAY 01', date: 'Feb 19' },
    { id: 2, label: 'DAY 02', date: 'Feb 20' },
    { id: 3, label: 'DAY 03', date: 'Feb 21' },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
    // ════════════════════════════════════════
    //  DAY 1
    // ════════════════════════════════════════

    // ── Main Stage / Auditorium / Amphitheater ──
    { dayId: 1, time: '3:00 PM – 6:00 PM', title: 'Mr & Mrs Utkarsh', venue: 'Main Stage', society: 'Imperials', coordinator: 'Ritika Tiwari', coordinatorContact: '8383953234' },
    { dayId: 1, time: '12:00 PM – 2:30 PM', title: 'Kalam Kriti', venue: 'Auditorium', society: 'Alfaaz', coordinator: 'Amar Singh', coordinatorContact: '7982148861' },
    { dayId: 1, time: '3:00 PM – 6:00 PM', title: 'Naadsangam (Indian Classical Group Singing)', venue: 'Auditorium', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Jagran – Street Play Competition', venue: 'Flag Hosting Ground', society: 'Yakshagan', coordinator: 'Priyanshi Sharma', coordinatorContact: '8368281307' },
    { dayId: 1, time: '1:00 PM – 2:30 PM', title: 'Inferno / Nach Baliye', venue: 'Amphitheater', society: 'Insync', coordinator: 'Priyanshi Suneja', coordinatorContact: '7837501502' },
    { dayId: 1, time: '12:00 PM – 2:00 PM', title: 'Solo Dance Competition', venue: 'Amphitheater', coordinator: 'Dishti Kaushik', coordinatorContact: '8527830710' },
    { dayId: 1, time: '9:00 AM – 10:00 AM', title: 'Nukkad Natak', venue: 'Amphitheater', society: 'NSS', coordinator: 'Maitraiyee', coordinatorContact: '7827855396' },

    // ── Classrooms / Labs ──
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Escape Room 2.0', venue: '2101-2102', society: 'Word Wizards', coordinator: 'Nikunj Sharma', coordinatorContact: '8860262882' },
    { dayId: 1, time: '12:00 PM – 3:00 PM', title: 'The Trial', venue: '2008-2009', society: 'Awaaz', coordinator: 'Shobhna', coordinatorContact: '8178732481' },
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Chitraka', venue: '2002', society: 'Confluenz', coordinator: 'Nikhil', coordinatorContact: '8527884605' },
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Back in Time', venue: '20035305', society: 'Avant', coordinator: 'Yug Bhagat', coordinatorContact: '9560196454' },
    { dayId: 1, time: '12:00 PM – 3:00 PM', title: 'Arogyam Quest', venue: '2310', society: 'NSS', coordinator: 'Rubi Negi', coordinatorContact: '7982016030' },
    { dayId: 1, time: '11:30 AM – 4:00 PM', title: 'Rocket League', venue: '2208', society: 'Datazoic', coordinator: 'Sarthak Rajwar', coordinatorContact: '8851920675' },
    { dayId: 1, time: '11:30 AM – 4:00 PM', title: 'Rangoli Making', venue: 'Corridor of AIML Block', society: 'Kritrim Dhi', coordinator: 'Riddhi Bansal', coordinatorContact: '7982940921' },
    { dayId: 1, time: '1:30 PM – 3:30 PM', title: 'Decrypt And Escape', venue: '2404', society: 'GeeksForGeeks', coordinator: 'Aashi Maheshwari', coordinatorContact: '9311713551' },
    { dayId: 1, time: '11:30 AM – 1:30 PM', title: 'Technical Rangoli', venue: '5302', coordinator: 'Sakshi Prasad', coordinatorContact: '9582568838' },
    { dayId: 1, time: '11:30 AM – 1:30 PM', title: 'Debate Competition', venue: '2004', society: 'Neev', coordinator: 'Vivek Kumar', coordinatorContact: '9953994956' },
    { dayId: 1, time: '12:00 PM – 2:00 PM', title: 'Poster Making', venue: '4003', society: 'Neev', coordinator: 'Aryan Verma', coordinatorContact: '9310754460' },
    { dayId: 1, time: '11:30 AM – 1:30 PM', title: 'Debate', venue: '4301', coordinator: 'Satyam', coordinatorContact: '9310415494' },
    { dayId: 1, time: '11:30 AM – 5:30 PM', title: 'REDEMPTION: Personality Debate (ADABI 5.0)', venue: '2409', society: 'Quintessence', coordinator: 'Harsh Punia', coordinatorContact: '7619997487' },
    { dayId: 1, time: '12:00 PM – 1:00 PM', title: 'Cyber-sense', venue: '2108', society: 'GDGC', coordinator: 'Mehak Aggarwal', coordinatorContact: '9899745351' },
    { dayId: 1, time: '12:00 PM – 1:00 PM', title: 'Phish or Legit', venue: '4101', society: 'GDGC', coordinator: 'Arnav Singla', coordinatorContact: '9205229659' },
    { dayId: 1, time: '2:30 PM – 5:30 PM', title: 'Hamsadhwani (Semi-Classical Solo)', venue: '2113', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 1, time: '2:00 PM – 5:00 PM', title: 'Mridangam (Instrumental Solo)', venue: '2216', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 1, time: '11:30 AM – 1:30 PM', title: 'Balloon Blast Challenge', venue: '4202', coordinator: 'Sangati Veera Mounika', coordinatorContact: '9311639978' },
    { dayId: 1, time: '11:00 AM – 2:00 PM', title: 'AdCraft', venue: '1203', society: 'Sankalp Society', coordinator: 'Riya', coordinatorContact: '9205824949' },
    { dayId: 1, time: '11:00 AM – 2:00 PM', title: 'AdCraft', venue: '1203A', society: 'Sankalp Society', coordinator: 'Rohit', coordinatorContact: '9311844351' },
    { dayId: 1, time: '10:00 AM – 11:30 AM', title: 'Poster Making Competition', venue: '1002', coordinator: 'Mohd. Tamheed', coordinatorContact: '9220823244' },
    { dayId: 1, time: '1:30 PM – 2:30 PM', title: 'Case Analysis Competition', venue: '1007', coordinator: 'Ashwin', coordinatorContact: '7042519590' },
    { dayId: 1, time: '12:00 PM – 1:00 PM', title: 'Debate Competition', venue: '1007', coordinator: 'Khushi Bhandari', coordinatorContact: '9811558813' },
    { dayId: 1, time: '12:00 PM – 1:00 PM', title: 'Quiz Competition', venue: '1004', coordinator: 'Mr. Anjal David', coordinatorContact: '7011131445' },
    { dayId: 1, time: '11:30 AM – 3:30 PM', title: 'Roast and Defend', venue: '2202', society: 'Kritrim Dhi', coordinator: 'Zubair', coordinatorContact: '7678263597' },
    { dayId: 1, time: '11:30 AM – 5:30 PM', title: 'Write-O-Mania & War of Verses', venue: '4106', society: 'Alfaaz', coordinator: 'Kanishka Singhal', coordinatorContact: '9310525081' },
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Candescent', venue: 'Open Area of Block 2', society: 'Avant Garde', coordinator: 'Yug Bhagat', coordinatorContact: '9560196454' },
    { dayId: 1, time: '11:30 AM – 3:30 PM', title: 'FLIPSIDE FORUM II', venue: 'Moot Court', society: 'The Discurso Masters', coordinator: 'Apoorv Sharma', coordinatorContact: '7982522043' },

    // ── Tech Events (Day 1) ──
    { dayId: 1, time: '11:30 AM – 6:00 PM', title: 'Gaming Arena', venue: '2203', society: 'Kritrim Dhi', coordinator: 'Nirmaan Vashisht', coordinatorContact: '9560485315' },
    { dayId: 1, time: '11:30 AM – 2:30 PM', title: 'Vibe Coding', venue: '2208', society: 'Datazoic', coordinator: 'Sarthak Rajwar', coordinatorContact: '8851920675' },
    { dayId: 1, time: '1:00 PM – 3:00 PM', title: 'CreatEX', venue: '2210', society: 'Geek Room ADGIPS', coordinator: 'Sampreeti Rastogi', coordinatorContact: '9643638194' },
    { dayId: 1, time: '10:00 AM – 1:00 PM', title: 'IdeaXcelerate', venue: '3201', society: 'CS Dept', coordinator: 'Ishaan Saklani', coordinatorContact: '8448617197' },
    { dayId: 1, time: '11:00 AM – 1:00 PM', title: 'Automation Arena', venue: '2303', society: 'AAIRO', coordinator: 'Pranav Kaushik', coordinatorContact: '9821213075' },
    { dayId: 1, time: '1:00 PM – 3:00 PM', title: 'Black Box Crawl', venue: '4101', society: 'GDGC', coordinator: 'Mridul Chaudhary', coordinatorContact: '9654252294' },
    { dayId: 1, time: '12:00 PM – 3:00 PM', title: 'NFT Rush', venue: '4303', society: 'E-Cell', coordinator: 'Dakshyani Murari', coordinatorContact: '8178045176' },
    { dayId: 1, time: '11:00 AM – 2:00 PM', title: 'Buzzer Time', venue: '5001', society: 'Bityug', coordinator: 'Deepesh Jain', coordinatorContact: '9582690242' },
    { dayId: 1, time: '2:00 PM – 5:00 PM', title: 'AI Compatibility Test', venue: '5001', society: 'Bityug', coordinator: 'Deepesh Jain', coordinatorContact: '9582690242' },
    { dayId: 1, time: '9:00 AM – 12:00 PM', title: 'Poster Making Using AI', venue: '5203', coordinator: 'Kanishk Mishra', coordinatorContact: '9354706457' },
    { dayId: 1, time: '9:00 AM – 2:00 PM', title: 'Hackathon', venue: '5206', coordinator: 'Mayank Baliyan', coordinatorContact: '9667389721' },
    { dayId: 1, time: '11:00 AM – 3:00 PM', title: 'Subway Surfers', venue: 'Canteen Area', society: 'Robogyan', coordinator: 'Ayush Kumar Jha', coordinatorContact: '7827109679' },
    { dayId: 1, time: '11:00 AM – 1:00 PM', title: 'Hackathon', venue: '2404', society: 'ECE Dept', coordinator: 'Mayank Baliyan', coordinatorContact: '9667389721' },
    { dayId: 1, time: '12:00 PM – 2:00 PM', title: 'Tech Debate', venue: '5202', society: 'ECE Dept', coordinator: 'Karan Jha', coordinatorContact: '9310349603' },
    { dayId: 1, time: '12:00 PM – 1:00 PM', title: 'AI Logo Prompt Showdown', venue: '2106', society: 'GDGC', coordinator: 'Mehak Aggarwal', coordinatorContact: '9899745351' },

    // ════════════════════════════════════════
    //  DAY 2
    // ════════════════════════════════════════

    // ── Main Stage ──
    { dayId: 2, time: '9:30 AM – 11:30 AM', title: 'Cultural Clash', venue: 'Main Stage', society: 'Virsa', coordinator: 'Harsh Vardhan', coordinatorContact: '9555954349' },
    { dayId: 2, time: '12:00 PM – 2:00 PM', title: 'Talaash-e-Kala', venue: 'Main Stage', society: 'Nrityakumb', coordinator: 'Namami', coordinatorContact: '8287812506' },
    { dayId: 2, time: '3:00 PM – 5:00 PM', title: 'Fashionista', venue: 'Main Stage', society: 'Imperials', coordinator: 'Ritika Tiwari', coordinatorContact: '8383953234' },

    // ── Other Cultural & Classroom Events ──
    { dayId: 2, time: '10:00 AM', title: 'OUTLAST ARENA 2.0', venue: 'In Front of 4th-5th Block', society: 'The Campus Chronicles', coordinator: 'Nikhil Garg', coordinatorContact: '9560570312' },
    { dayId: 2, time: 'Full Day', title: 'Old-School Sketchbook', venue: '20035305', society: 'Avant', coordinator: 'Yug Bhagat', coordinatorContact: '9560196454' },
    { dayId: 2, time: 'Full Day', title: 'Chitraka 7.0', venue: '2002', society: 'Confluenz', coordinator: 'Nikhil Sood' },
    { dayId: 2, time: 'Full Day', title: 'Escape Room 2.0', venue: '2101-2102', society: 'Word Wizard', coordinator: 'Nikunj Sharma', coordinatorContact: '8860262882' },
    { dayId: 2, time: '11:30 AM – 2:30 PM', title: 'Picture This! & Campus Feud', venue: '2209', society: 'Datazoic', coordinator: 'Sarthak Rajwar', coordinatorContact: '8851920675' },
    { dayId: 2, time: '11:00 AM – 4:00 PM', title: 'Odysseia', venue: '2303-2304', society: 'The Invincibles', coordinator: 'Vibhuti Chaddha', coordinatorContact: '8014251300' },
    { dayId: 2, time: '10:00 AM – 2:30 PM', title: 'Clash of Carnival', venue: '5001', society: 'Enactus', coordinator: 'Shruti Shrivastava', coordinatorContact: '9968596642' },
    { dayId: 2, time: '12:00 PM – 1:30 PM', title: 'Mystery Investigation', venue: '4003', society: 'Neev', coordinator: 'Vaibhav Singh', coordinatorContact: '8595976141' },
    { dayId: 2, time: '11:00 AM – 12:00 PM', title: 'Starlight Showcase', venue: '3201', coordinator: 'Khushi Bhardwaj', coordinatorContact: '8882035057' },
    { dayId: 2, time: '11:30 AM – 4:30 PM', title: 'Bidding Wars 2.0', venue: '2404', society: 'IEEE ADGIPS', coordinator: 'Krish Batra', coordinatorContact: '9311293521' },
    { dayId: 2, time: '11:00 AM – 3:00 PM', title: 'I am the Star!', venue: '1205', society: 'Sankalp Society', coordinator: 'Ms. Arti', coordinatorContact: '7275741300' },
    { dayId: 2, time: '11:00 AM – 2:00 PM', title: 'Trash to Treasure', venue: '1205', society: 'Sankalp Society', coordinator: 'Ms. Meenu', coordinatorContact: '7703820873' },
    { dayId: 2, time: '9:00 AM – 11:30 AM', title: 'Yugantar – Mono Act Competition', venue: 'Auditorium', society: 'Yakshagan', coordinator: 'Priyanshi Sharma', coordinatorContact: '8368281307' },
    { dayId: 2, time: '2:30 PM – 6:00 PM', title: 'Nocturne (Western Group Singing – A Cappella)', venue: 'Auditorium', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 2, time: '12:00 PM – 2:00 PM', title: "Trader's Tussle", venue: '5004', society: 'E-Cell', coordinator: 'Dakshyani Murari', coordinatorContact: '8178045176' },
    { dayId: 2, time: '9:00 AM – 3:30 PM', title: 'Verdict: A Multilevel Debate (ADABI 5.0)', venue: '2409-2401', society: 'Quintessence', coordinator: 'Harsh Punia', coordinatorContact: '7619997487' },
    { dayId: 2, time: '12:00 PM – 3:00 PM', title: "Survivor's Arena", venue: '2nd Block Basement', society: 'Awaaz', coordinator: 'Saransh', coordinatorContact: '8375954517' },
    { dayId: 2, time: '1:00 PM – 5:00 PM', title: 'AID O EIGHT', venue: 'Amphitheater', society: 'Alfaaz', coordinator: 'Ananway Tripathi', coordinatorContact: '8887821309' },
    { dayId: 2, time: '11:00 AM – 12:00 PM', title: 'Nukkad Natak', venue: 'Flag Hosting Ground', society: 'NSS', coordinator: 'Maitreey Jakhmola', coordinatorContact: '7827855396' },
    { dayId: 2, time: '9:00 AM – 6:00 PM', title: 'Freak It Out', venue: 'Badminton Court', society: 'Freak Streets', coordinator: 'Aayush Pandey', coordinatorContact: '8826870013' },

    // ── Tech Events (Day 2) ──
    { dayId: 2, time: '12:00 PM – 3:00 PM', title: 'Bridge Competition', venue: '2103', society: 'Neev', coordinator: 'Vivek Kumar', coordinatorContact: '9953994956' },
    { dayId: 2, time: '1:30 PM – 4:00 PM', title: 'Chaos Circuit', venue: '2113', society: 'GeeksForGeeks', coordinator: 'Aashi Maheshwari', coordinatorContact: '9311713551' },
    { dayId: 2, time: '11:00 AM – 3:00 PM', title: 'Digital Crime Scene', venue: '2203', society: 'Kritrim Dhi', coordinator: 'Saksham Gupta', coordinatorContact: '9911912563' },
    { dayId: 2, time: '11:00 AM – 2:00 PM', title: 'Prompt the Beat', venue: '2205', society: 'Kritrim Dhi', coordinator: 'Ritik Choudhary', coordinatorContact: '7011148769' },
    { dayId: 2, time: '12:00 PM – 2:00 PM', title: 'Glitch Arena', venue: '3201', society: 'CS Dept', coordinator: 'Khushi Bhardwaj', coordinatorContact: '8882035057' },
    { dayId: 2, time: '10:00 AM – 12:00 PM', title: 'TechTag Protocol', venue: '3205', society: 'CS Dept', coordinator: 'Tarun Kumar', coordinatorContact: '9289080835' },
    { dayId: 2, time: '11:00 AM – 1:30 PM', title: 'AI Coding Arena', venue: '2303', society: 'AAIRO', coordinator: 'Pranav Kaushik', coordinatorContact: '9821213075' },
    { dayId: 2, time: '12:00 PM – 2:30 PM', title: 'Project Parade', venue: '4101', society: 'GDGC', coordinator: 'Mehak Agarwal', coordinatorContact: '9899745351' },
    { dayId: 2, time: '11:30 AM – 1:00 PM', title: 'BGMI Gaming', venue: '4202', society: 'CSE Dept', coordinator: 'Pushker Rawat', coordinatorContact: '9310094714' },
    { dayId: 2, time: '1:30 PM – 2:30 PM', title: 'THE LOGIC MATRIX', venue: '4202', society: 'CSE Dept', coordinator: 'Khushal', coordinatorContact: '7838832423' },
    { dayId: 2, time: '2:00 PM – 5:00 PM', title: 'Reaction Time', venue: '5001, 5004', society: 'Bityug', coordinator: 'Deepesh Jain', coordinatorContact: '9582690242' },
    { dayId: 2, time: '9:00 AM – 5:00 PM', title: 'Technical Presentation', venue: '5106', society: 'ECE Dept', coordinator: 'Dimple', coordinatorContact: '9310716967' },
    { dayId: 2, time: '2:00 PM – 5:00 PM', title: 'Technical Presentation', venue: '5301', society: 'Bityug', coordinator: 'Deepesh Jain', coordinatorContact: '9582690242' },
    { dayId: 2, time: '11:00 AM – 3:00 PM', title: 'Subway Surfers', venue: 'Canteen Area', society: 'Robogyan', coordinator: 'Ayush Kumar Jha', coordinatorContact: '7827109679' },

    // ════════════════════════════════════════
    //  DAY 3
    // ════════════════════════════════════════
    { dayId: 3, time: 'Evening', title: 'Star Night — Charu Semwal Live', venue: 'Main Stage', description: 'The star event of Utkarsh 2026 — an electrifying live performance by Charu Semwal.', imageUrl: '/eventposters/charu_semwal_live.jpg' },
    { dayId: 3, time: '11:00 AM', title: 'Inferno / Nach Baliye', venue: 'Main Stage', society: 'Insync', coordinator: 'Divya Chauhan', coordinatorContact: '7053612015' },
    { dayId: 3, time: '9:00 AM – 2:00 PM', title: 'Contentio: A Conventional Debate (ADABI 5.0)', venue: '2409 & 2401', society: 'Quintessence', coordinator: 'Harsh Punia', coordinatorContact: '7619997487' },
    { dayId: 3, time: '11:00 AM – 12:30 PM', title: 'Poetry (Hindi)', venue: '4301', coordinator: 'Ms. Apurva Jain', coordinatorContact: '9871097922' },
    { dayId: 3, time: '11:00 AM – 12:30 PM', title: 'Nostalgia Cut', venue: '20035305', society: 'Avant Garde', coordinator: 'Yug Bhagat', coordinatorContact: '9560196454' },
    { dayId: 3, time: 'TBD', title: 'What If?', venue: '2101-2102', society: 'Word Wizards', coordinator: 'Nikunj Sharma', coordinatorContact: '886026288' },
    { dayId: 3, time: '11:00 AM – 1:00 PM', title: 'Face Painting', venue: '2404', society: 'Imperials', coordinator: 'Ritika Tiwari', coordinatorContact: '8383953234' },
    { dayId: 3, time: '2:30 PM – 5:30 PM', title: 'Cadence (Western Solo Singing)', venue: '2113', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 3, time: '11:00 AM – 3:00 PM', title: 'Vedic Ventures', venue: '1203 B', society: 'Sankalp Society', coordinator: 'Ms. Preeti Mam', coordinatorContact: '9899170291' },
    { dayId: 3, time: '9:00 AM – 2:00 PM', title: 'Utkarsh Idol', venue: 'Amphitheater', society: 'Swaranjali', coordinator: 'Shashank Poddar', coordinatorContact: '7669663186' },
    { dayId: 3, time: '12:00 PM – 2:30 PM', title: "Yakshagan's Annual Plays (Ticketed Shows)", venue: 'Auditorium', society: 'Yakshagan', coordinator: 'Priyanshi Sharma', coordinatorContact: '8368281307' },
    { dayId: 3, time: '10:00 AM – 1:30 PM', title: 'Jack Of All Jests', venue: '2214', society: 'Alfaaz', coordinator: 'Vedant Joshi', coordinatorContact: '7668212892' },
    { dayId: 3, time: '10:00 AM – 11:00 AM', title: 'Play', venue: 'Near Canteen Area', coordinator: 'Priyanshi Sharma', coordinatorContact: '8368281307' },
];

export function getEventsForDay(dayId: number): ScheduleEvent[] {
    return SCHEDULE_EVENTS.filter(e => e.dayId === dayId);
}
