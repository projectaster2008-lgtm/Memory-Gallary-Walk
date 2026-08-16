import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TimeOfDayProfile } from '../utils/timeOfDayLighting';

interface DynamicSkyLightingProps {
  profile: TimeOfDayProfile;
}

export default function DynamicSkyLighting({ profile }: DynamicSkyLightingProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const sunRef = useRef<THREE.PointLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  // Reusable THREE.Color instances to avoid per-frame GC allocations
  const targetAmbientColor = useRef(new THREE.Color(profile.lighting.ambientColor));
  const targetSunColor = useRef(new THREE.Color(profile.lighting.sunColor));
  const targetSkyRimColor = useRef(new THREE.Color(profile.lighting.skyRimColor));
  const targetGroundColor = useRef(new THREE.Color(profile.lighting.groundBounceColor));
  const targetSunPos = useRef(new THREE.Vector3(...profile.lighting.sunPosition));

  useEffect(() => {
    targetAmbientColor.current.set(profile.lighting.ambientColor);
    targetSunColor.current.set(profile.lighting.sunColor);
    targetSkyRimColor.current.set(profile.lighting.skyRimColor);
    targetGroundColor.current.set(profile.lighting.groundBounceColor);
    targetSunPos.current.set(...profile.lighting.sunPosition);
  }, [profile]);

  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 3.5, 0.15);

    // Smoothly lerp Ambient Light
    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbientColor.current, lerpFactor);
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        profile.lighting.ambientIntensity,
        lerpFactor
      );
    }

    // Smoothly lerp Sun / Celestial Key Light
    if (sunRef.current) {
      sunRef.current.color.lerp(targetSunColor.current, lerpFactor);
      sunRef.current.intensity = THREE.MathUtils.lerp(
        sunRef.current.intensity,
        profile.lighting.sunIntensity,
        lerpFactor
      );
      sunRef.current.position.lerp(targetSunPos.current, lerpFactor);
    }

    // Smoothly lerp Hemisphere Atmospheric Rim & Ground Bounce Light
    if (hemiRef.current) {
      hemiRef.current.color.lerp(targetSkyRimColor.current, lerpFactor);
      hemiRef.current.groundColor.lerp(targetGroundColor.current, lerpFactor);
      hemiRef.current.intensity = THREE.MathUtils.lerp(
        hemiRef.current.intensity,
        profile.lighting.hemisphereIntensity,
        lerpFactor
      );
    }

    // Smoothly lerp Fill Light
    if (fillRef.current) {
      fillRef.current.color.lerp(targetSkyRimColor.current, lerpFactor);
    }
  });

  return (
    <group>
      {/* Dynamic Ambient Fill */}
      <ambientLight
        ref={ambientRef}
        intensity={profile.lighting.ambientIntensity}
        color={profile.lighting.ambientColor}
      />

      {/* Orbiting Celestial Key Light (Sun / Aurora Zenith) */}
      <pointLight
        ref={sunRef}
        position={profile.lighting.sunPosition}
        intensity={profile.lighting.sunIntensity}
        color={profile.lighting.sunColor}
        distance={90}
        decay={1.2}
      />

      {/* Atmospheric Hemisphere Light for 3D Specular & Rim Depth */}
      <hemisphereLight
        ref={hemiRef}
        color={profile.lighting.skyRimColor}
        groundColor={profile.lighting.groundBounceColor}
        intensity={profile.lighting.hemisphereIntensity}
      />

      {/* Subtle Counter-Fill Light for back-facing cards */}
      <pointLight
        ref={fillRef}
        position={[0, -18, -20]}
        intensity={0.4}
        color={profile.lighting.skyRimColor}
        distance={70}
      />
    </group>
  );
}
