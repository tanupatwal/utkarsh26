/**
 * 3D Scene configuration constants.
 */
export const SCENE_CONFIG = {
    /** Radius of the image tunnel */
    TUNNEL_RADIUS: 8,
    /** Length of the tunnel */
    TUNNEL_LENGTH: 20,
    /** Fog color (deep black) */
    FOG_COLOR: "#000000",
    /** Radius of the cylindrical gallery */
    CYLINDER_RADIUS: 40,
    /** Height of gallery panels (20% taller) */
    CYLINDER_HEIGHT: 24,
    /** Arc of gallery display (~229 degrees) */
    CYLINDER_ARC: Math.PI * 1.475
} as const;

/** Camera positions for gallery transition */
export const CAMERA_CONFIG = {
    START: { x: 0, y: 0, z: 0 },
    END: { x: 0, y: -2, z: 60 }
} as const;
