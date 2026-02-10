import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SCENE_CONFIG } from '../../../config';

// ──────────────────────────────────────────────
// DISSOLVE SHADER — disintegrates from left → right
// ──────────────────────────────────────────────

const dissolveVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const dissolveFragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform float uDissolve;   // 0 = fully visible, 1 = fully dissolved
uniform float uBaseOpacity; // 1.0 for front face, 0.3 for reflection
uniform float uIsReflection; // 0.0 for front, 1.0 for reflection
varying vec2 vUv;

// Simple hash-based noise
float hash(vec2 p) {
    p = fract(p * vec2(443.8975, 397.2973));
    p += dot(p, p.yx + 19.19);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
        val += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
    }
    return val;
}

void main() {
    vec4 texColor = texture2D(uTexture, vUv);

    if (uDissolve <= 0.0) {
        gl_FragColor = vec4(texColor.rgb, uBaseOpacity);
        return;
    }

    // Dissolve mask: left side goes first
    float noiseVal = fbm(vUv * 8.0);
    float sweep = uDissolve * 1.6 - 0.1;
    float mask = vUv.x + noiseVal * 0.3;

    if (mask < sweep) {
        discard;
    }

    // Edge glow (dimmer for reflection)
    float edgeDist = mask - sweep;
    float edgeWidth = 0.06;
    float glowStrength = mix(0.8, 0.3, uIsReflection);

    if (edgeDist < edgeWidth) {
        float edgeT = 1.0 - (edgeDist / edgeWidth);
        edgeT = edgeT * edgeT;
        vec3 glowColor = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 1.0, 1.0), edgeT * 0.5);
        texColor.rgb = mix(texColor.rgb, glowColor, edgeT * glowStrength);
    }

    gl_FragColor = vec4(texColor.rgb, uBaseOpacity);
}
`;

// ──────────────────────────────────────────────

interface ThickPanelProps {
    url: string;
    index: number;
    total: number;
    radius: number;
    gap?: number;
    thickness?: number;
    /** Ref to dissolve progress for this panel (0→1). */
    dissolveProgressRef?: React.RefObject<number>;
}

/**
 * ThickPanel - A solid, curved panel with thickness and gaps.
 * If dissolveProgressRef is provided, both front face and reflection use dissolve shader.
 */
const ThickPanel: React.FC<ThickPanelProps> = ({
    url,
    index,
    total,
    radius,
    gap = 0.05,
    thickness = 2,
    dissolveProgressRef,
}) => {
    const texture = useTexture(url);

    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);

    const height = SCENE_CONFIG.CYLINDER_HEIGHT;
    const angleStep = SCENE_CONFIG.CYLINDER_ARC / total;
    const panelAngle = angleStep - gap;

    const GALLERY_START_ROTATION = 0.2;
    const thetaStart = -GALLERY_START_ROTATION - (index * angleStep) - (panelAngle / 2);

    const casingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7,
        metalness: 0.2
    }), []);

    // ── Dissolve materials (front + reflection) ──
    const dissolveUniformsFront = useRef({
        uTexture: { value: texture },
        uDissolve: { value: 0.0 },
        uBaseOpacity: { value: 1.0 },
        uIsReflection: { value: 0.0 },
    });

    const dissolveUniformsReflection = useRef({
        uTexture: { value: texture },
        uDissolve: { value: 0.0 },
        uBaseOpacity: { value: 0.3 },
        uIsReflection: { value: 1.0 },
    });

    const dissolveMaterialFront = useMemo(() => {
        if (!dissolveProgressRef) return null;
        return new THREE.ShaderMaterial({
            vertexShader: dissolveVertexShader,
            fragmentShader: dissolveFragmentShader,
            uniforms: dissolveUniformsFront.current,
            side: THREE.DoubleSide,
            transparent: true,
        });
    }, [dissolveProgressRef]);

    const dissolveMaterialReflection = useMemo(() => {
        if (!dissolveProgressRef) return null;
        return new THREE.ShaderMaterial({
            vertexShader: dissolveVertexShader,
            fragmentShader: dissolveFragmentShader,
            uniforms: dissolveUniformsReflection.current,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });
    }, [dissolveProgressRef]);

    // Update both dissolve uniforms each frame
    useFrame(() => {
        if (!dissolveProgressRef) return;
        const val = dissolveProgressRef.current;
        if (dissolveMaterialFront?.uniforms.uDissolve) {
            dissolveMaterialFront.uniforms.uDissolve.value = val;
        }
        if (dissolveMaterialReflection?.uniforms.uDissolve) {
            dissolveMaterialReflection.uniforms.uDissolve.value = val;
        }
    });

    return (
        <group>
            {/* FRONT FACE (Image) */}
            <mesh>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
                />
                {dissolveMaterialFront ? (
                    <primitive object={dissolveMaterialFront} attach="material" />
                ) : (
                    <meshBasicMaterial
                        map={texture}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                    />
                )}
            </mesh>

            {/* SATIN FINISH OVERLAY — skip on dissolving panels */}
            {!dissolveProgressRef && (
                <mesh>
                    <cylinderGeometry
                        args={[radius + 0.05, radius + 0.05, height, 32, 1, true, thetaStart, panelAngle]}
                    />
                    <meshPhysicalMaterial
                        transparent
                        opacity={0.1}
                        roughness={0.6}
                        metalness={0.1}
                        clearcoat={0.5}
                        clearcoatRoughness={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* BACK FACE (Casing) */}
            <mesh>
                <cylinderGeometry
                    args={[radius - thickness, radius - thickness, height, 32, 1, true, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* TOP CAP */}
            <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                    args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* BOTTOM CAP */}
            <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                    args={[radius - thickness, radius, 32, 1, thetaStart, panelAngle]}
                />
                <primitive object={casingMaterial} attach="material" side={THREE.DoubleSide} />
            </mesh>

            {/* LEFT SIDE CAP */}
            <mesh
                position={[
                    (radius - thickness / 2) * Math.sin(thetaStart),
                    0,
                    (radius - thickness / 2) * Math.cos(thetaStart)
                ]}
                rotation={[0, thetaStart, 0]}
            >
                <boxGeometry args={[0.1, height, thickness]} />
                <primitive object={casingMaterial} attach="material" />
            </mesh>

            {/* RIGHT SIDE CAP */}
            <mesh
                position={[
                    (radius - thickness / 2) * Math.sin(thetaStart + panelAngle),
                    0,
                    (radius - thickness / 2) * Math.cos(thetaStart + panelAngle)
                ]}
                rotation={[0, thetaStart + panelAngle, 0]}
            >
                <boxGeometry args={[0.1, height, thickness]} />
                <primitive object={casingMaterial} attach="material" />
            </mesh>

            {/* REFLECTION (Floor) — uses dissolve shader when dissolving */}
            <mesh position={[0, -height - 0.1, 0]} scale={[1, -1, 1]}>
                <cylinderGeometry
                    args={[radius, radius, height, 32, 1, true, thetaStart, panelAngle]}
                />
                {dissolveMaterialReflection ? (
                    <primitive object={dissolveMaterialReflection} attach="material" />
                ) : (
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                )}
                <mesh scale={[-1, 1, 1]} />
            </mesh>
        </group>
    );
};

export default ThickPanel;
