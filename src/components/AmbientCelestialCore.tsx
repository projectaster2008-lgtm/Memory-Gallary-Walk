import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../data';

interface AmbientCelestialCoreProps {
  color?: string;
  viewMode?: 'sphere' | 'inside_dome' | 'orbit';
}

export default function AmbientCelestialCore({
  color = '#38bdf8',
  viewMode = 'sphere',
}: AmbientCelestialCoreProps) {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Pre-generate 3D Aurora stardust & cosmic ions around the memory sphere
  const { particlePositions, particleColors } = useMemo(() => {
    const count = 160;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Aurora Borealis palette: Emerald (#10b981), Cyan (#06b6d4), Violet (#a855f7), Sky (#38bdf8), Rose (#fb7185)
    const auroraHexes = [
      new THREE.Color('#10b981'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#34d399'),
      new THREE.Color('#c084fc'),
    ];

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = GLOBE_RADIUS * (0.65 + Math.random() * 0.75);

      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = auroraHexes[i % auroraHexes.length];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    return {
      particlePositions: positions,
      particleColors: colors,
    };
  }, []);

  // Pre-created geometries for celestial Aurora rings
  const ringGeom1 = useMemo(() => new THREE.RingGeometry(GLOBE_RADIUS * 0.98, GLOBE_RADIUS * 0.995, 64), []);
  const ringGeom2 = useMemo(() => new THREE.RingGeometry(GLOBE_RADIUS * 1.04, GLOBE_RADIUS * 1.052, 64), []);
  const ringGeom3 = useMemo(() => new THREE.RingGeometry(GLOBE_RADIUS * 0.45, GLOBE_RADIUS * 0.465, 48), []);

  const coreGeom = useMemo(() => new THREE.IcosahedronGeometry(GLOBE_RADIUS * 0.28, 1), []);
  const innerSphereGeom = useMemo(() => new THREE.SphereGeometry(GLOBE_RADIUS * 0.18, 16, 16), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle counter-rotations for Aurora rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.035;
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.12) * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.025;
      ring2Ref.current.rotation.y = Math.PI / 4 + Math.cos(t * 0.1) * 0.06;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.18) * 0.04;
      ring3Ref.current.rotation.z = t * 0.05;
    }

    // Breathing pulse for the central memory crystal
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(t * 1.8) * 0.04;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y = t * 0.1;
      coreRef.current.rotation.x = t * 0.07;
    }

    // Slow ambient cosmic drift of Aurora stardust
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -t * 0.012;
    }
  });

  const parsedColor = useMemo(() => new THREE.Color(color), [color]);
  const emeraldColor = useMemo(() => new THREE.Color('#10b981'), []);
  const violetColor = useMemo(() => new THREE.Color('#a855f7'), []);

  return (
    <group>
      {/* Central Luminous Memory Core */}
      <group ref={coreRef}>
        <mesh geometry={coreGeom}>
          <meshBasicMaterial
            color={parsedColor}
            wireframe
            transparent
            opacity={viewMode === 'inside_dome' ? 0.12 : 0.28}
          />
        </mesh>
        <mesh geometry={innerSphereGeom}>
          <meshBasicMaterial
            color={parsedColor}
            transparent
            opacity={viewMode === 'inside_dome' ? 0.08 : 0.22}
          />
        </mesh>
      </group>

      {/* Aurora Borealis Primary Emerald Ring */}
      <group ref={ring1Ref}>
        <mesh geometry={ringGeom1}>
          <meshBasicMaterial
            color={emeraldColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>

      {/* Polar Violet Oblique Ring */}
      <group ref={ring2Ref}>
        <mesh geometry={ringGeom2}>
          <meshBasicMaterial
            color={violetColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.16}
          />
        </mesh>
      </group>

      {/* Inner Arctic Cyan Core Ring */}
      <group ref={ring3Ref}>
        <mesh geometry={ringGeom3}>
          <meshBasicMaterial
            color={parsedColor}
            side={THREE.DoubleSide}
            transparent
            opacity={0.24}
          />
        </mesh>
      </group>

      {/* 3D Multi-Spectral Aurora Stardust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
