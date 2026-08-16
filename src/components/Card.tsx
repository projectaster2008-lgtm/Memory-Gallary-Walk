import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { CARD_WIDTH, CARD_HEIGHT, GLOBE_RADIUS } from '../data';
import { MemoryItem } from '../types';

interface CardProps {
  index: number;
  memory: MemoryItem;
  position: THREE.Vector3;
  scale?: number;
  isActive?: boolean;
  onSelect: (memory: MemoryItem) => void;
  onHover?: (memory: MemoryItem) => void;
  onHoverOut?: () => void;
}

export default function Card({
  index,
  memory,
  position,
  scale = 1,
  isActive = false,
  onSelect,
  onHover,
  onHoverOut,
}: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const borderRef = useRef<THREE.LineSegments>(null);
  const glowPlaneRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normal vector pointing outward from sphere center (0,0,0)
  const normalVector = useMemo(() => {
    return position.clone().normalize();
  }, [position]);

  // GSAP Animated values proxy
  const animState = useRef({
    scale: 1,
    elevation: 0,
    borderOpacity: 0.2,
    borderGlow: 0,
    clickSquash: 1,
  });

  // GSAP Tween management for smooth hover and selection animations
  useEffect(() => {
    const targetScale = isActive ? 1.24 : hovered ? 1.18 : 1.0;
    const targetElevation = isActive ? 0.72 : hovered ? 0.48 : 0.0;
    const targetBorderOpacity = isActive ? 0.95 : hovered ? 0.85 : 0.25;
    const targetGlow = isActive ? 1.0 : hovered ? 0.75 : 0.0;

    gsap.to(animState.current, {
      scale: targetScale,
      elevation: targetElevation,
      borderOpacity: targetBorderOpacity,
      borderGlow: targetGlow,
      duration: isActive ? 0.65 : 0.4,
      ease: isActive ? 'back.out(1.8)' : 'power2.out',
    });

    // Subtle GSAP Hover and Exit Animation for the .globe-node location label
    if (labelRef.current) {
      if (hovered || isActive) {
        gsap.to(labelRef.current, {
          opacity: 1,
          y: -4,
          scale: isActive ? 1.15 : 1.1,
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.75)) brightness(1.15)',
          duration: 0.35,
          ease: 'back.out(1.7)',
          overwrite: 'auto',
        });
      } else {
        gsap.to(labelRef.current, {
          opacity: 0,
          y: 6,
          scale: 0.8,
          filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0)) brightness(0.9)',
          duration: 0.28,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
      }
    }
  }, [hovered, isActive]);

  // Initial Sleek Placeholder Texture & Multi-Tier Reliable Loader
  useEffect(() => {
    let active = true;

    // Create a sleek minimalist placeholder canvas with subtle gradient and title
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 680);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 680);

      // Subtle inner frame
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, 488, 656);

      // Title & number
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      const cleanTitle = (memory.title || `Memory #${index + 1}`).slice(0, 22);
      ctx.fillText(cleanTitle, 256, 320);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText(memory.location || 'Echoes Spherical Gallery', 256, 360);
    }

    const placeholderTex = new THREE.CanvasTexture(canvas);
    placeholderTex.colorSpace = THREE.SRGBColorSpace;
    placeholderTex.minFilter = THREE.LinearMipmapLinearFilter;
    placeholderTex.generateMipmaps = true;
    setTexture(placeholderTex);

    // Stagger texture load slightly for performance
    const delay = (index % 12) * 35;
    const timer = setTimeout(() => {
      const fileIdMatch =
        memory.driveFileId ||
        (memory.id || '').replace('drive-', '') ||
        (memory.imageUrl || '').match(/drive-image\/([^/?]+)/)?.[1] ||
        (memory.imageUrl || '').match(/\/d\/([^/?=]+)/)?.[1];

      // Multi-Tier fallback URLs (Direct Google CDN -> Drive Thumbnail -> Direct Download -> Local Proxy)
      const primaryUrl = fileIdMatch
        ? `https://lh3.googleusercontent.com/d/${fileIdMatch}=s800`
        : memory.imageUrl || memory.thumbnailUrl;

      const fallbackUrl1 = fileIdMatch
        ? `https://drive.google.com/thumbnail?id=${fileIdMatch}&sz=w800`
        : null;

      const fallbackUrl2 = fileIdMatch
        ? `https://drive.usercontent.google.com/download?id=${fileIdMatch}&export=download`
        : null;

      const fallbackUrl3 = fileIdMatch ? `/api/drive-image/${fileIdMatch}` : null;

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      const applyTexture = (loadedTex: THREE.Texture) => {
        if (!active) return;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.generateMipmaps = true;
        loadedTex.anisotropy = 4;
        setTexture(loadedTex);
        setIsLoaded(true);
      };

      const tryLoad = (url: string, onFail?: () => void) => {
        if (!url) {
          if (onFail) onFail();
          return;
        }
        loader.load(
          url,
          (loadedTex) => applyTexture(loadedTex),
          undefined,
          () => {
            if (onFail) onFail();
          }
        );
      };

      tryLoad(primaryUrl, () => {
        if (fallbackUrl1) {
          tryLoad(fallbackUrl1, () => {
            if (fallbackUrl2) {
              tryLoad(fallbackUrl2, () => {
                if (fallbackUrl3) {
                  tryLoad(fallbackUrl3, () => {
                    // Retain stylish placeholder canvas
                  });
                }
              });
            }
          });
        }
      });
    }, delay);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [memory.imageUrl, memory.thumbnailUrl, memory.title, memory.location, memory.id, memory.driveFileId, index]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  // Curved Geometry for Card Face - Optimized vertex density for ultra-high 60+ FPS
  const geometry = useMemo(() => {
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 8, 8);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const theta = x / GLOBE_RADIUS;
      const phi = y / GLOBE_RADIUS;

      const newX = GLOBE_RADIUS * Math.sin(theta) * Math.cos(phi);
      const newY = GLOBE_RADIUS * Math.sin(phi);
      const newZ = GLOBE_RADIUS * Math.cos(theta) * Math.cos(phi) - GLOBE_RADIUS;

      pos.setXYZ(i, newX, newY, newZ);
    }

    geo.computeVertexNormals();
    return geo;
  }, [scale]);

  // 3D Outer Perimeter Border Edges (threshold angle 40 removes all internal grid lines)
  const wireframeGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry, 40);
  }, [geometry]);

  // Pre-allocated temporary vector to avoid 60fps garbage collection
  const tempPosRef = useRef(new THREE.Vector3());

  // Subtle breathing pulse for active destination node
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const { scale: animScale, elevation, borderOpacity, clickSquash } = animState.current;

    // Active beacon pulse
    let pulseExtra = 0;
    if (isActive) {
      pulseExtra = Math.sin(clock.getElapsedTime() * 4.5) * 0.04;
    }

    const currentScale = (animScale + pulseExtra) * clickSquash;
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Physical 3D Elevation along outward normal without garbage collection
    const currentElevation = elevation + (isActive ? pulseExtra * 2 : 0);
    tempPosRef.current.copy(position).addScaledVector(normalVector, currentElevation);
    groupRef.current.position.copy(tempPosRef.current);

    if (borderRef.current) {
      const mat = borderRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, borderOpacity, 0.15);
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();

    // Tactile Click GSAP Squash & Spring Recoil Feedback
    gsap.timeline()
      .to(animState.current, {
        clickSquash: 0.9,
        duration: 0.08,
        ease: 'power2.in',
      })
      .to(animState.current, {
        clickSquash: 1.0,
        duration: 0.25,
        ease: 'back.out(2.5)',
      });

    onSelect(memory);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      quaternion={rotationQuaternion}
    >
      {/* Active Glowing Backlight Disc */}
      {(isActive || hovered) && (
        <mesh
          ref={glowPlaneRef}
          position={[0, 0, -0.05]}
          geometry={geometry}
        >
          <meshBasicMaterial
            color={isActive ? '#38bdf8' : '#10b981'}
            transparent
            opacity={isActive ? 0.35 : 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Main Card Photo Mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
          if (onHover) onHover(memory);
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
          if (onHoverOut) onHoverOut();
        }}
      >
        {texture && (
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent={!isLoaded}
            opacity={isLoaded ? 1 : 0.85}
          />
        )}
      </mesh>

      {/* 3D Glowing Selection / Hover Frame Border */}
      <lineSegments
        ref={borderRef}
        geometry={wireframeGeometry}
      >
        <lineBasicMaterial
          color={isActive ? '#38bdf8' : hovered ? '#10b981' : '#ffffff'}
          transparent
          opacity={0.25}
          linewidth={2}
        />
      </lineSegments>

      {/* Subtle GSAP Hover Location Label (.globe-node) */}
      <Html
        position={[0, -CARD_HEIGHT * scale * 0.5 - 0.28, 0.05]}
        center
        distanceFactor={16}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={labelRef}
          className="globe-node flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/90 backdrop-blur-md border border-white/20 text-white shadow-xl pointer-events-none select-none text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0"
          style={{
            transform: 'translateY(6px) scale(0.9)',
            boxShadow: isActive
              ? '0 0 16px rgba(56, 189, 248, 0.45)'
              : '0 4px 14px rgba(0, 0, 0, 0.6)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: isActive ? '#38bdf8' : '#34d399' }}
          />
          <span className="text-gray-100 font-semibold">{memory.location || memory.title || 'Memory'}</span>
        </div>
      </Html>
    </group>
  );
}
