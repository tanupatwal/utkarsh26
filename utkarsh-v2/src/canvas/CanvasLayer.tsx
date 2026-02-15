import { Canvas } from '@react-three/fiber'
import styles from './CanvasLayer.module.css'

/**
 * Single fixed <Canvas> that sits behind all HTML content.
 * 3D scenes (Tunnel, Gallery) render as children of this component.
 * Visibility is toggled per-section via Zustand state.
 */
export function CanvasLayer() {
    return (
        <div className={styles.canvasContainer}>
            <Canvas
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
            >
                <ambientLight intensity={0.5} />
                {/* 3D scenes will be added here in later phases */}
            </Canvas>
        </div>
    )
}
