import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, ScrollControls, Scroll, useScroll, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CONTENT, GALLERY_CONTENT, TUNNEL_RADIUS, FOG_COLOR, CYLINDER_RADIUS, CYLINDER_HEIGHT, CYLINDER_ARC } from '../constants';
import SpeedLines from './SpeedLines';

// --- CONFIGURATION ---
const TIMELINE = {
  TUNNEL_END: 0.2,
  ABOUT_START: 0.2,
  ABOUT_STAY: 0.45,
  TRANSITION: 0.6,
  GALLERY_START: 0.6,
  END: 1.0
};

// --- HERO OVERLAY (HTML) ---
const HeroOverlay: React.FC = () => {
  const scroll = useScroll();
  const [currentStep, setCurrentStep] = useState(0);

  useFrame(() => {
    const r = scroll.offset;
    if (r < TIMELINE.TUNNEL_END) {
      const progress = r / TIMELINE.TUNNEL_END;
      const index = Math.floor(progress * CONTENT.length);
      setCurrentStep(index);
    } else {
      setCurrentStep(-1);
    }
  });

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex items-center justify-center">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {CONTENT.map((item, index) => {
          const isActive = index === currentStep;
          return (
            <div
              key={index}
              className={`absolute text-center transition-all duration-700 ease-out transform
                ${isActive ? 'opacity-100 blur-0 translate-y-0 scale-100' : 'opacity-0 blur-lg translate-y-20 scale-90'}
              `}
            >
              <h2 className="text-5xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter mix-blend-overlay">
                {item.title}
              </h2>
              <p className="text-lg md:text-2xl text-white/80 font-light tracking-[1em] uppercase ml-2">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- TUNNEL ---
const TunnelGroup: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const TUNNEL_DIST = 80;

  useFrame(() => {
    if (!groupRef.current) return;
    const r = scroll.offset;

    if (r > TIMELINE.ABOUT_START + 0.1) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    const progress = Math.min(r / TIMELINE.TUNNEL_END, 1);
    groupRef.current.position.z = progress * TUNNEL_DIST;
    groupRef.current.rotation.z = progress * Math.PI * 2;

    if (r > TIMELINE.TUNNEL_END - 0.05) {
      const fadeOut = 1 - (r - (TIMELINE.TUNNEL_END - 0.05)) / 0.05;
      groupRef.current.scale.setScalar(Math.max(0, fadeOut));
    } else {
      groupRef.current.scale.setScalar(1);
    }
  });

  return (
    <group ref={groupRef}>
      {CONTENT.map((item, i) => {
        const angle = (i / CONTENT.length) * Math.PI * 2;
        const z = -10 + i * -15;
        return (
          <Image
            key={i}
            url={item.url}
            transparent
            side={THREE.DoubleSide}
            position={[Math.cos(angle) * TUNNEL_RADIUS, Math.sin(angle) * TUNNEL_RADIUS, z]}
            rotation={[0, 0, angle - Math.PI / 2]}
            scale={[4, 5]}
            opacity={0.6}
          />
        );
      })}
    </group>
  );
};

// --- FLAT ABOUT SECTION ---
const FlatAboutSection: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const r = scroll.offset;

    if (r < TIMELINE.TUNNEL_END - 0.05 || r > TIMELINE.TRANSITION + 0.1) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    let opacity = 1;
    if (r < TIMELINE.ABOUT_START) {
      opacity = (r - (TIMELINE.TUNNEL_END - 0.05)) / 0.05;
    }

    let xPos = 0;
    if (r > TIMELINE.ABOUT_STAY) {
      const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.TRANSITION - TIMELINE.ABOUT_STAY);
      xPos = -30 * t * t;
      opacity = Math.max(0, 1 - t * 1.5);
    }

    groupRef.current.position.x = xPos;

    groupRef.current.children.forEach((child) => {
      if ((child as any).fillOpacity !== undefined) (child as any).fillOpacity = opacity;
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        mat.opacity = opacity * (mat.userData.baseOpacity || 1);
        mat.transparent = true;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial color="#050505" transparent opacity={0.95} userData={{ baseOpacity: 0.95 }} />
      </mesh>

      <Text
        position={[0, 2, 0]}
        fontSize={1.2}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
      >
        ABOUT US
      </Text>

      <Text
        position={[0, 0, 0]}
        fontSize={0.35}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        lineHeight={1.6}
      >
        We are the architects of the digital void.
        Exploring the boundaries between memory, space, and time.
        Our mission is to curate the unexplainable and
        visualize the impossible.
      </Text>

      <mesh position={[0, -1.5, 0]}>
        <planeGeometry args={[2, 0.02]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} userData={{ baseOpacity: 0.5 }} />
      </mesh>

      <Text
        position={[0, -2.5, 0]}
        fontSize={0.15}
        color="#4444ff"
        anchorX="center"
        letterSpacing={0.2}
      >
        SCROLL TO VIEW ARCHIVE
      </Text>
    </group>
  );
};

// --- CYLINDRICAL GALLERY ---

const CurvedPanel: React.FC<{
  url: string;
  index: number;
  total: number;
  radius: number;
}> = ({ url, index, total, radius }) => {
  const texture = useTexture(url);
  // Fix texture orientation for outside viewing
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);

  // Calculate angle for semi-cylinder arc (panels distributed across the arc)
  const angleStep = CYLINDER_ARC / total;
  // Center the arc so it faces the camera (offset by half the arc minus 90 degrees)
  const angleOffset = Math.PI + (CYLINDER_ARC / 2);
  const thetaStart = angleOffset - (index * angleStep) - angleStep;

  // Calculate opacity based on distance from center (creates depth of field effect)
  const centerIndex = (total - 1) / 2;
  const distanceFromCenter = Math.abs(index - centerIndex) / centerIndex;
  // Center panels are full opacity, sides fade out
  const opacity = THREE.MathUtils.lerp(1, 0.3, distanceFromCenter * distanceFromCenter);

  // Using CylinderGeometry to create a perfect curved segment
  // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  const height = CYLINDER_HEIGHT;

  return (
    <group>
      {/* Main Image Segment */}
      <mesh>
        <cylinderGeometry
          args={[radius, radius, height, 32, 1, true, thetaStart, angleStep]}
        />
        {/* Scale X -1 to correct texture mirroring on outside face */}
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
        />
        <mesh scale={[-1, 1, 1]} />
      </mesh>

      {/* Floor Reflection Segment */}
      <mesh position={[0, -height + 0.1, 0]} scale={[1, -1, 1]}>
        <cylinderGeometry
          args={[radius, radius, height, 32, 1, true, thetaStart, angleStep]}
        />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity * 0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
        <mesh scale={[-1, 1, 1]} />
      </mesh>
    </group>
  );
};

// Foreground Silhouette People
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
  )
}

const GalleryGroup: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const silhouetteRef = useRef<THREE.Group>(null);

  // Camera closer to fill the viewport with the curved display
  const CAM_POS_START = new THREE.Vector3(0, 0, 0);
  const CAM_POS_END = new THREE.Vector3(0, -2, 60);

  useFrame((state) => {
    if (!groupRef.current) return;
    const r = scroll.offset;

    if (r < TIMELINE.ABOUT_STAY) {
      groupRef.current.visible = false;
      if (silhouetteRef.current) silhouetteRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;
    if (silhouetteRef.current) silhouetteRef.current.visible = true;

    // 1. TRANSITION
    if (r >= TIMELINE.ABOUT_STAY && r < TIMELINE.GALLERY_START) {
      const t = (r - TIMELINE.ABOUT_STAY) / (TIMELINE.GALLERY_START - TIMELINE.ABOUT_STAY);
      const smoothT = t * t * (3 - 2 * t);

      camera.position.lerpVectors(CAM_POS_START, CAM_POS_END, smoothT);

      // Subtle fade in
      const scale = THREE.MathUtils.lerp(0.8, 1, smoothT);
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.y = smoothT * 0.2;

    } else if (r >= TIMELINE.GALLERY_START) {
      // 2. ACTIVE
      camera.position.copy(CAM_POS_END);
      groupRef.current.scale.setScalar(1);

      // Rotation speed
      const rotProgress = (r - TIMELINE.GALLERY_START) / (TIMELINE.END - TIMELINE.GALLERY_START);
      groupRef.current.rotation.y = 0.2 + (rotProgress * Math.PI * 1.5);
    }

    // Look straight ahead at the center of the curved panels
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]}>
        {GALLERY_CONTENT.map((item, i) => (
          <CurvedPanel
            key={i}
            url={item.url}
            index={i}
            total={GALLERY_CONTENT.length}
            radius={CYLINDER_RADIUS}
          />
        ))}

        {/* Inner Glow */}
        <pointLight position={[0, 0, 0]} intensity={3} color="#6666ff" distance={25} />
      </group>

      {/* Grid removed for cleaner look */}
    </>
  );
};

// --- MAIN EXPERIENCE ---

const Experience: React.FC = () => {
  return (
    <>
      <color attach="background" args={[FOG_COLOR]} />
      <fog attach="fog" args={[FOG_COLOR, 10, 50]} />

      <ambientLight intensity={0.5} />
      <spotLight position={[-10, 20, 10]} angle={0.6} penumbra={0.5} intensity={1.5} color="#e0e0ff" />
      <spotLight position={[10, 5, 20]} angle={0.4} penumbra={1} intensity={1} color="#a0a0ff" />

      <SpeedLines />

      <ScrollControls pages={8} damping={0.2}>
        <TunnelGroup />
        <FlatAboutSection />
        <GalleryGroup />

        <Scroll html style={{ width: '100%', height: '100%' }}>
          <HeroOverlay />
        </Scroll>
      </ScrollControls>
    </>
  );
};

export default Experience;