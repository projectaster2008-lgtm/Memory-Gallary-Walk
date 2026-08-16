import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateFibonacciSphere } from '../utils/math';
import { GLOBE_RADIUS, DEFAULT_GRID_COUNT } from '../data';
import { MemoryItem } from '../types';
import Card from './Card';
import AmbientCelestialCore from './AmbientCelestialCore';
import DynamicSkyLighting from './DynamicSkyLighting';
import { TimeOfDayProfile, TIME_OF_DAY_PROFILES } from '../utils/timeOfDayLighting';

interface GlobeProps {
  memories: MemoryItem[];
  activeMemoryId?: string | null;
  rotationState: React.MutableRefObject<{ x: number; y: number }>;
  velocityState: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: React.MutableRefObject<boolean>;
  lastInteraction: React.MutableRefObject<number>;
  walkTargetIndex: number | null;
  viewMode?: 'sphere' | 'inside_dome' | 'orbit';
  timeProfile?: TimeOfDayProfile;
  ambientLightColor?: string;
  ambientLightIntensity?: number;
  onSelect: (memory: MemoryItem) => void;
  onHover?: (memory: MemoryItem) => void;
  onHoverOut?: () => void;
}

export default function Globe({
  memories,
  activeMemoryId,
  rotationState,
  velocityState,
  isDragging,
  lastInteraction,
  walkTargetIndex,
  viewMode = 'sphere',
  timeProfile = TIME_OF_DAY_PROFILES.night,
  ambientLightColor,
  ambientLightIntensity,
  onSelect,
  onHover,
  onHoverOut,
}: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const totalPositions = Math.max(memories.length, DEFAULT_GRID_COUNT);

  // Distribute spherical grid positions
  const cardLayout = useMemo(() => {
    const rawPositions = generateFibonacciSphere(totalPositions, GLOBE_RADIUS);
    return rawPositions.map((pos, i) => {
      const memory = memories[i % memories.length] || memories[0];
      return {
        position: pos,
        scale: 1.0,
        memory,
        index: i,
      };
    });
  }, [memories, totalPositions]);

  // Target rotation for Walk Mode targeting
  const targetRotation = useRef<{ x: number; y: number } | null>(null);

  // Smooth blending factor for idle auto-rotation (0 = fully paused, 1 = full auto-spin)
  const idleBlendRef = useRef<number>(0);

  useEffect(() => {
    if (walkTargetIndex !== null && cardLayout[walkTargetIndex]) {
      const pos = cardLayout[walkTargetIndex].position.clone();
      // Calculate spherical coordinates (theta, phi) of the target card
      const r = pos.length();
      const phi = Math.asin(pos.y / r); // latitude / pitch
      const theta = Math.atan2(pos.x, pos.z); // longitude / yaw

      if (viewMode === 'inside_dome') {
        // Inside dome view: Target card directly in front of internal perspective
        targetRotation.current = {
          x: -phi,
          y: Math.PI - theta,
        };
      } else {
        // Globe outer view: Rotate group so that card faces the camera along +Z
        targetRotation.current = {
          x: phi,
          y: -theta,
        };
      }
    } else {
      targetRotation.current = null;
    }
  }, [walkTargetIndex, cardLayout, viewMode]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (walkTargetIndex !== null && targetRotation.current && !isDragging.current) {
      // Shortest arc interpolation for smooth yaw & pitch
      const normalizeAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
      
      const diffX = targetRotation.current.x - rotationState.current.x;
      const diffY = normalizeAngle(targetRotation.current.y - rotationState.current.y);

      const lerpSpeed = Math.min(delta * 4.5, 0.18);
      rotationState.current.x += diffX * lerpSpeed;
      rotationState.current.y += diffY * lerpSpeed;

      velocityState.current.x = 0;
      velocityState.current.y = 0;
      idleBlendRef.current = 0;
    } else {
      // 1. User manual rotation or physics momentum
      rotationState.current.x += velocityState.current.x;
      rotationState.current.y += velocityState.current.y;

      // Restrict pitch angle to avoid polar flipping
      rotationState.current.x = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, rotationState.current.x)
      );

      const isInteracting = isDragging.current || Date.now() - lastInteraction.current < 1200;

      if (!isDragging.current) {
        // Momentum friction damping
        velocityState.current.x *= 0.93;
        velocityState.current.y *= 0.93;

        // Auto-rotation idle blending
        if (isInteracting) {
          // Rapidly ease out auto-rotation when user recently interacted
          idleBlendRef.current = THREE.MathUtils.lerp(idleBlendRef.current, 0, Math.min(delta * 8.0, 0.25));
        } else {
          // Smoothly ease in slow planetary auto-rotation during inactivity
          idleBlendRef.current = THREE.MathUtils.lerp(idleBlendRef.current, 1, Math.min(delta * 1.5, 0.04));
        }

        // Apply slow continuous idle auto-spin around Y axis (constant ~0.0016 rad/frame speed)
        const targetIdleSpeed = 0.0016;
        rotationState.current.y += targetIdleSpeed * idleBlendRef.current;
      } else {
        velocityState.current.x *= 0.3;
        velocityState.current.y *= 0.3;
        idleBlendRef.current = 0;
      }
    }

    groupRef.current.rotation.x = rotationState.current.x;
    groupRef.current.rotation.y = rotationState.current.y;
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Time-of-Day Multi-Source Lighting System */}
      <DynamicSkyLighting profile={timeProfile} />
      <AmbientCelestialCore color={timeProfile.lighting.coreColor} viewMode={viewMode} />
      {cardLayout.map((item) => (
        <Card
          key={`${item.memory.id}-${item.index}`}
          index={item.index}
          memory={item.memory}
          position={item.position}
          scale={item.scale}
          isActive={activeMemoryId === item.memory.id}
          onSelect={(mem) => {
            lastInteraction.current = Date.now();
            if (!isDragging.current) {
              onSelect(mem);
            }
          }}
          onHover={(mem) => {
            lastInteraction.current = Date.now();
            onHover?.(mem);
          }}
          onHoverOut={onHoverOut}
        />
      ))}
    </group>
  );
}
