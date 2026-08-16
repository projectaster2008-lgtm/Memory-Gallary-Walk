import * as THREE from 'three';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Placeholder Texture
  useEffect(() => {
    let active = true;

    // Create a sleek minimalist placeholder canvas with subtle gradient and index
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Warm modern neutral background
      const grad = ctx.createLinearGradient(0, 0, 0, 680);
      grad.addColorStop(0, '#f3f4f6');
      grad.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 680);

      // Subtle inner border
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 496, 664);

      // Caption text
      ctx.fillStyle = '#9ca3af';
      ctx.font = '600 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(memory.title ? memory.title.slice(0, 24) : `Memory #${index + 1}`, 256, 340);
    }

    const placeholderTex = new THREE.CanvasTexture(canvas);
    placeholderTex.colorSpace = THREE.SRGBColorSpace;
    placeholderTex.minFilter = THREE.LinearMipmapLinearFilter;
    placeholderTex.generateMipmaps = true;
    setTexture(placeholderTex);

    // Stagger texture load slightly for performance
    const delay = (index % 12) * 40;
    const timer = setTimeout(() => {
      const urlToLoad = memory.imageUrl || memory.thumbnailUrl;
      if (!urlToLoad) return;

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
        loader.load(
          url,
          (loadedTex) => {
            applyTexture(loadedTex);
          },
          undefined,
          () => {
            if (onFail) onFail();
          }
        );
      };

      // Extract file id if present
      const fileIdMatch = (memory.id || '').replace('drive-', '') || (memory.imageUrl || '').match(/drive-image\/([^/?]+)/)?.[1];
      const fallbackUrl1 = fileIdMatch ? `https://lh3.googleusercontent.com/d/${fileIdMatch}=s800` : null;
      const fallbackUrl2 = fileIdMatch ? `https://drive.google.com/thumbnail?id=${fileIdMatch}&sz=w800` : null;

      tryLoad(urlToLoad, () => {
        if (fallbackUrl1) {
          tryLoad(fallbackUrl1, () => {
            if (fallbackUrl2) {
              tryLoad(fallbackUrl2, () => {
                // Keep initial placeholder texture gracefully
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
  }, [memory.imageUrl, memory.thumbnailUrl, memory.title, memory.id, index]);

  const rotationQuaternion = useMemo(() => {
    const dummy = new THREE.Object3D();
    dummy.position.copy(position);
    // Point outward perpendicular to sphere center (0,0,0)
    dummy.lookAt(position.clone().multiplyScalar(2));
    return dummy.quaternion.clone();
  }, [position]);

  const geometry = useMemo(() => {
    // 32x32 vertices for smooth curvature conforming to sphere
    const width = CARD_WIDTH * scale;
    const height = CARD_HEIGHT * scale;
    const geo = new THREE.PlaneGeometry(width, height, 32, 32);
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

  // Smooth hover and active animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetScale = hovered || isActive ? 1.08 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      quaternion={rotationQuaternion}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(memory);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        if (onHover) {
          onHover(memory);
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        if (onHoverOut) {
          onHoverOut();
        }
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
  );
}
