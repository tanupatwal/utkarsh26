/**
 * Camera Path Calculator
 *
 * Maps section HTML heights (dvh) to 3D world Z positions.
 * Run this to verify height-to-Z alignment before building Scene.svelte.
 *
 * Usage: bun run src/lib/utils/cameraPath.ts
 */

interface Section {
    name: string;
    heightVh: number;
    zone: string;
    hasCanvas: boolean;
}

const SECTIONS: Section[] = [
    { name: 'Hero', heightVh: 100, zone: 'HERO', hasCanvas: true },
    { name: 'WarpSpacer', heightVh: 100, zone: 'WARP', hasCanvas: true },
    { name: 'About', heightVh: 100, zone: 'ABOUT', hasCanvas: true },
    { name: 'Gallery', heightVh: 200, zone: 'GALLERY', hasCanvas: false }, // Separate canvas
    { name: 'Highlights', heightVh: 150, zone: 'HIGHLIGHTS', hasCanvas: false },
    { name: 'Schedule', heightVh: 200, zone: 'SCHEDULE', hasCanvas: false },
    { name: 'Team', heightVh: 100, zone: 'TEAM', hasCanvas: false },
    { name: 'Footer', heightVh: 50, zone: 'FOOTER', hasCanvas: false }
];

/**
 * World-space scale factor.
 * Maps 100vh of scroll → Z_SCALE units of camera movement.
 *
 * The tunnel camera path covers sections 1-3 (300dvh).
 * With Z_SCALE = 0.5, the camera travels 150 units in Z.
 */
const Z_SCALE = 0.5;

// Calculate
const totalHeight = SECTIONS.reduce((sum, s) => sum + s.heightVh, 0);
console.log(`\n═══ UTKARSH 2026 — Camera Path Map ═══\n`);
console.log(`Total page height: ${totalHeight}dvh\n`);

let cumulative = 0;

const pathMap = SECTIONS.map((section) => {
    const startProgress = cumulative / totalHeight;
    const zStart = -cumulative * Z_SCALE;

    cumulative += section.heightVh;

    const endProgress = cumulative / totalHeight;
    const zEnd = -cumulative * Z_SCALE;

    return {
        ...section,
        startProgress: Math.round(startProgress * 1000) / 1000,
        endProgress: Math.round(endProgress * 1000) / 1000,
        zStart: Math.round(zStart * 10) / 10,
        zEnd: Math.round(zEnd * 10) / 10
    };
});

console.log('Section              Height  Progress Range     Z Range         Canvas');
console.log('─'.repeat(80));

pathMap.forEach((s) => {
    const name = s.name.padEnd(20);
    const height = `${s.heightVh}dvh`.padEnd(8);
    const progress = `${s.startProgress.toFixed(3)} → ${s.endProgress.toFixed(3)}`.padEnd(18);
    const z = `Z: ${s.zStart} → ${s.zEnd}`.padEnd(16);
    const canvas = s.hasCanvas ? '✅ Main' : '—';

    console.log(`${name}${height}${progress}${z}${canvas}`);
});

console.log('─'.repeat(80));
console.log(`\nCamera spline points (for CatmullRomCurve3):`);
console.log(`  Hero start:    new Vector3(0, 0, ${pathMap[0].zStart})`);
console.log(`  Tunnel mid:    new Vector3(0, 0, ${pathMap[1].zEnd})`);
console.log(`  About end:     new Vector3(0, 0, ${pathMap[2].zEnd})`);
console.log(`\nMain canvas active during: HERO → WARP → ABOUT (0.0 → ${pathMap[2].endProgress})`);

// Export the map for use in Scene.svelte
export const CAMERA_PATH_MAP = pathMap;
export const TOTAL_PAGE_HEIGHT_VH = totalHeight;
export const Z_WORLD_SCALE = Z_SCALE;
