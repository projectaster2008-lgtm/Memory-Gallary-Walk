import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AmbientParticlesProps {
  count?: number;
}

function AmbientParticles({ count = 180 }: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;

      sc[i] = Math.random() * 0.8 + 0.3;
      sp[i] = Math.random() * 0.4 + 0.2;
    }
    return [pos, sc, sp];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle floating upward & horizontal drift
      posArray[idx + 1] += speeds[i] * delta * 0.45;
      posArray[idx + 0] += Math.sin(t * 0.5 + i) * delta * 0.15;

      // Wrap around when reaching upper bounds
      if (posArray[idx + 1] > 8) {
        posArray[idx + 1] = -8;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#fbbf24"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

interface WorldPortalSphereProps {
  scrollProgress: number;
  isTransitioning: boolean;
}

function WorldPortalSphere({ scrollProgress, isTransitioning }: WorldPortalSphereProps) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow organic rotation
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.08;

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.25;
      ringRef1.current.rotation.x += delta * 0.12;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.18;
      ringRef2.current.rotation.y += delta * 0.15;
    }

    // Scroll reactive positioning: moves smoothly as user scrolls through the lobby
    const targetY = -scrollProgress * 2.5 + (isTransitioning ? 0 : Math.sin(state.clock.getElapsedTime()) * 0.1);
    const targetZ = isTransitioning ? 3.5 : -scrollProgress * 1.5;
    const targetScale = isTransitioning ? 2.8 : 1 + scrollProgress * 0.25;

    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.06);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Outer Ethereal Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[2.0, 32, 24]} />
        <meshBasicMaterial
          color="#f59e0b"
          wireframe
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Latitudinal & Longitudinal Rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.3, 0.015, 16, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.55, 0.012, 16, 64]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.3} />
      </mesh>

      {/* Glowing Inner Energy Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial
          color="#d97706"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function CameraRig({
  mouse,
  scrollProgress,
  isTransitioning,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scrollProgress: number;
  isTransitioning: boolean;
}) {
  useFrame((state) => {
    const targetX = mouse.current.x * 1.2;
    const targetY = -mouse.current.y * 0.8 - scrollProgress * 1.8;
    const targetZ = isTransitioning ? 2.5 : 8.5 - scrollProgress * 1.2;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, isTransitioning ? 0.08 : 0.04);

    state.camera.lookAt(0, -scrollProgress * 1.5, 0);
  });

  return null;
}

interface LobbyCanvasProps {
  scrollProgress: number;
  isTransitioning: boolean;
}

export default function LobbyCanvas({ scrollProgress, isTransitioning }: LobbyCanvasProps) {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouse.current = { x, y };
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="absolute inset-0 pointer-events-none z-10"
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 8, 6]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-6, -4, 4]} intensity={0.8} color="#d97706" />

        <CameraRig
          mouse={mouse}
          scrollProgress={scrollProgress}
          isTransitioning={isTransitioning}
        />

        <AmbientParticles count={160} />
        <WorldPortalSphere
          scrollProgress={scrollProgress}
          isTransitioning={isTransitioning}
        />
      </Canvas>
    </div>
  );
}
