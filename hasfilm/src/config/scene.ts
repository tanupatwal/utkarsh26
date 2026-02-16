/**
 * 3D Scene configuration constants.
 */
export const SCENE_CONFIG = {
    /** Fog color (deep blue-black, less harsh than pure black) */
    FOG_COLOR: "#050515",
    /** Radius of the cylindrical gallery (larger = fills more screen) */
    CYLINDER_RADIUS: 50,
    /** Height of gallery panels (20% taller) */
    CYLINDER_HEIGHT: 12,
    /** Arc of gallery display (~333 degrees - near full screen with slight edges) */
    CYLINDER_ARC: Math.PI * 0.8
} as const;

/** Camera positions for gallery transition */
export const CAMERA_CONFIG = {
    /** Start: Outside the cylinder, wide establishing shot */
    START: { x: 0, y: 2, z: 80 },
    /** End: Closer to the panels, slightly below center for dramatic angle */
    END: { x: 0, y: -2, z: 60 }
} as const;
