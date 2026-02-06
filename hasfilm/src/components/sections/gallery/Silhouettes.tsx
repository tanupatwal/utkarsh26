import React from 'react';

/**
 * Silhouettes - Foreground silhouette people for the gallery scene.
 * Creates depth and atmosphere in the gallery view.
 */
const Silhouettes: React.FC = () => {
    return (
        <group>
            {/* Left silhouette - larger and closer */}
            <mesh position={[-6, -4, 8]} rotation={[0, 0.15, 0]}>
                <planeGeometry args={[2.5, 6]} />
                <meshBasicMaterial color="#000000" opacity={1} transparent />
            </mesh>

            {/* Right silhouette */}
            <mesh position={[7, -4.2, 7]} rotation={[0, -0.2, 0]}>
                <planeGeometry args={[2.8, 6.5]} />
                <meshBasicMaterial color="#000000" opacity={1} transparent />
            </mesh>

            {/* Center-right silhouette */}
            <mesh position={[2, -4.5, 6]} rotation={[0, 0, 0]}>
                <planeGeometry args={[2.2, 5.5]} />
                <meshBasicMaterial color="#000000" opacity={1} transparent />
            </mesh>
        </group>
    );
};

export default Silhouettes;
