import { Suspense, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Compass, 
  Search, 
  Layers,
  RotateCcw,
  Shuffle,
  Eye,
  DoorOpen,
  ExternalLink,
} from 'lucide-react';
import { GLOBE_RADIUS } from '../data';
import { MemoryItem, ViewMode } from '../types';
import { globalPlaylist, SongTrack } from '../utils/playlistEngine';
import Globe from './Globe';
import ImmersiveAtmosphere from './ImmersiveAtmosphere';
import MusicPlaylistBar from './MusicPlaylistBar';
import SafeImage from './SafeImage';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const DEFAULT_CAMERA_Z = isMobile ? 22.0 : 17.0;

function CameraController({ 
  targetZ, 
  targetY = 0 
}: { 
  targetZ: React.MutableRefObject<number>; 
  targetY?: number;
}) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ.current,
      0.08
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.06
    );
  });
  return null;
}

interface GalleryGlobeProps {
  memories: MemoryItem[];
  folderName: string;
  onSelect: (memory: MemoryItem) => void;
  onResetView?: () => void;
}

export default function GalleryGlobe({
  memories,
  folderName,
  onSelect,
  onResetView,
}: GalleryGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Music & Atmosphere State
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(globalPlaylist.getCurrentTrack());
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(globalPlaylist.getIsPlaying());

  useEffect(() => {
    const unsub = globalPlaylist.subscribe(() => {
      setCurrentTrack(globalPlaylist.getCurrentTrack());
      setIsMusicPlaying(globalPlaylist.getIsPlaying());
    });
    return unsub;
  }, []);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchSearch =
        !searchQuery ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag = !activeTag || m.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [memories, searchQuery, activeTag]);

  const activeMemoryList = filteredMemories.length > 0 ? filteredMemories : memories;

  // Interaction State
  const targetZ = useRef(DEFAULT_CAMERA_Z);
  const rotationState = useRef({ x: 0, y: 0 });
  const velocityState = useRef({ x: 0, y: 0.002 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastInteractionTime = useRef(Date.now() - 3000);
  const pointerPos = useRef({ x: 0, y: 0 });

  // Touch gesture state
  const touchStartDist = useRef<number | null>(null);

  // GSAP Animation Timeline Ref
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const animProxyRef = useRef({ z: DEFAULT_CAMERA_Z });

  // Randomized Walk Tour State & History Stack
  const [isWalking, setIsWalking] = useState(false);
  const [walkIndex, setWalkIndex] = useState(0);
  const [isWalkPaused, setIsWalkPaused] = useState(false);
  const [walkHistory, setWalkHistory] = useState<number[]>([0]);
  const [historyPointer, setHistoryPointer] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('sphere');
  const [isExitingPortal, setIsExitingPortal] = useState(false);

  // Handle Cinematic Portal Exit Transition
  const handleExitPortal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isExitingPortal) return;
    setIsExitingPortal(true);

    // Zoom camera outwards and speed up globe rotation
    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
    }
    gsap.to(animProxyRef.current, {
      z: isMobile ? 45 : 36,
      duration: 1.2,
      ease: 'power3.in',
      onUpdate: () => {
        targetZ.current = animProxyRef.current.z;
      },
    });

    // Smooth redirect after cinematic warp animation
    setTimeout(() => {
      window.location.href = 'https://ating-universe.vercel.app';
    }, 1100);
  };

  // Cursor UI state
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [hoveredMemory, setHoveredMemory] = useState<MemoryItem | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Pick a truly random memory index avoiding immediate recent repeats
  const getRandomNextIndex = useCallback(
    (current: number, total: number, recent: number[]) => {
      if (total <= 1) return 0;
      const candidates: number[] = [];
      for (let i = 0; i < total; i++) {
        if (i !== current && (!recent.slice(-3).includes(i) || total <= 3)) {
          candidates.push(i);
        }
      }
      if (candidates.length === 0) {
        for (let i = 0; i < total; i++) {
          if (i !== current) candidates.push(i);
        }
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    },
    []
  );

  // GSAP Cinematic Camera Orchestrator: Zoom Out -> Rotate -> Zoom In
  const triggerGsapCameraTransition = useCallback(
    (targetMemoryIndex: number, mode: ViewMode = viewMode) => {
      if (gsapTimelineRef.current) {
        gsapTimelineRef.current.kill();
      }

      const isInside = mode === 'inside_dome';
      const wideZoomOutZ = isInside ? 1.5 : (isMobile ? 24.0 : 18.5);
      const targetFocusZoomInZ = isInside ? -1.8 : (isMobile ? 20.0 : 15.5);

      animProxyRef.current.z = targetZ.current;

      const tl = gsap.timeline({
        onUpdate: () => {
          targetZ.current = animProxyRef.current.z;
        },
      });

      // Stage 1: Subtle zoom adjustment
      tl.to(animProxyRef.current, {
        z: wideZoomOutZ,
        duration: 0.45,
        ease: 'power2.out',
      })
      // Stage 2: Smooth settle on target card
      .to(animProxyRef.current, {
        z: targetFocusZoomInZ,
        duration: 0.85,
        ease: 'power2.out',
        delay: 0.05,
      });

      gsapTimelineRef.current = tl;
    },
    [viewMode]
  );

  // All distinct tags
  const allTags = useMemo(() => {
    const priority = [
      'Videos',
      'Pangilatan',
      'Flood Moments',
      'Gullas Mountain',
      'Beach Hangout',
      'Long Rides',
      'Random Moments',
    ];
    const available = new Set<string>();
    memories.forEach((m) => m.tags.forEach((t) => available.add(t)));
    
    const sorted = [
      ...priority.filter((p) => available.has(p)),
      ...Array.from(available).filter((t) => !priority.includes(t)),
    ];
    return sorted.slice(0, 8);
  }, [memories]);

  // Handle Random Next Memory Tour Step
  const stepToNextRandom = useCallback(() => {
    if (activeMemoryList.length === 0) return;

    if (historyPointer < walkHistory.length - 1) {
      const nextPtr = historyPointer + 1;
      const nextIndex = walkHistory[nextPtr];
      setHistoryPointer(nextPtr);
      setWalkIndex(nextIndex);
      triggerGsapCameraTransition(nextIndex);
      globalPlaylist.playCardChime(nextIndex);
    } else {
      const nextRandom = getRandomNextIndex(walkIndex, activeMemoryList.length, walkHistory);
      const newHistory = [...walkHistory.slice(-15), nextRandom];
      setWalkHistory(newHistory);
      setHistoryPointer(newHistory.length - 1);
      setWalkIndex(nextRandom);
      triggerGsapCameraTransition(nextRandom);
      globalPlaylist.playCardChime(nextRandom);
    }
  }, [
    activeMemoryList.length,
    historyPointer,
    walkHistory,
    walkIndex,
    getRandomNextIndex,
    triggerGsapCameraTransition,
  ]);

  // Handle Step Back in Walk Tour
  const stepToPrevious = useCallback(() => {
    if (activeMemoryList.length === 0) return;

    if (historyPointer > 0) {
      const prevPtr = historyPointer - 1;
      const prevIndex = walkHistory[prevPtr];
      setHistoryPointer(prevPtr);
      setWalkIndex(prevIndex);
      triggerGsapCameraTransition(prevIndex);
      globalPlaylist.playCardChime(prevIndex);
    } else {
      const randomBack = getRandomNextIndex(walkIndex, activeMemoryList.length, walkHistory);
      const newHistory = [randomBack, ...walkHistory];
      setWalkHistory(newHistory);
      setHistoryPointer(0);
      setWalkIndex(randomBack);
      triggerGsapCameraTransition(randomBack);
      globalPlaylist.playCardChime(randomBack);
    }
  }, [
    activeMemoryList.length,
    historyPointer,
    walkHistory,
    walkIndex,
    getRandomNextIndex,
    triggerGsapCameraTransition,
  ]);

  // Walk Mode Timer (Random Steps)
  useEffect(() => {
    if (!isWalking || isWalkPaused) return;

    const interval = setInterval(() => {
      stepToNextRandom();
    }, 5000);

    return () => clearInterval(interval);
  }, [isWalking, isWalkPaused, stepToNextRandom]);

  // Wheel zoom handler with smooth dampening
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      lastInteractionTime.current = Date.now();

      if (gsapTimelineRef.current) {
        gsapTimelineRef.current.kill();
      }

      const delta = e.deltaY;
      targetZ.current += delta * 0.015;

      // Allow penetrating inside the sphere (-GLOBE_RADIUS * 0.85) to view inside dome!
      targetZ.current = Math.max(-GLOBE_RADIUS * 0.85, Math.min(isMobile ? 36 : 28, targetZ.current));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Handle View Mode Preset Switches
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    lastInteractionTime.current = Date.now();

    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill();
    }

    if (isWalking) {
      triggerGsapCameraTransition(walkIndex, mode);
    } else {
      const destZ =
        mode === 'sphere'
          ? (isMobile ? 26.5 : 19.5)
          : mode === 'inside_dome'
          ? -0.5
          : 10.5;

      animProxyRef.current.z = targetZ.current;
      gsap.to(animProxyRef.current, {
        z: destZ,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          targetZ.current = animProxyRef.current.z;
        },
      });
    }
  };

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    isDragging.current = true;
    setIsMouseDown(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
    lastInteractionTime.current = Date.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    pointerPos.current = { x: e.clientX, y: e.clientY };
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
    }

    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    velocityState.current.y += deltaX * 0.004;
    velocityState.current.x += deltaY * 0.004;

    lastInteractionTime.current = Date.now();
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsMouseDown(false);
    lastInteractionTime.current = Date.now();
  };

  // Touch Pinch Zoom Handler
  const handleTouchMove = (e: React.TouchEvent) => {
    lastInteractionTime.current = Date.now();
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (touchStartDist.current !== null) {
        const diff = touchStartDist.current - dist;
        targetZ.current += diff * 0.04;
        targetZ.current = Math.max(-GLOBE_RADIUS * 0.85, Math.min(36, targetZ.current));
      }
      touchStartDist.current = dist;
    }
  };

  const handleTouchEnd = () => {
    lastInteractionTime.current = Date.now();
    touchStartDist.current = null;
  };

  const currentWalkingMemory = activeMemoryList[walkIndex % activeMemoryList.length];

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative select-none overflow-hidden ${
        isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Immersive Animated Background synced with current Track Atmosphere */}
      <ImmersiveAtmosphere
        track={currentTrack}
        isPlaying={isMusicPlaying}
      />

      {/* 3D WebGL Canvas with Performance Clamping and High FPS */}
      <Canvas
        camera={{ position: [0, 0, DEFAULT_CAMERA_Z], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <CameraController targetZ={targetZ} />
        <Suspense fallback={null}>
          <Globe
            memories={activeMemoryList}
            activeMemoryId={isWalking ? currentWalkingMemory?.id : null}
            rotationState={rotationState}
            velocityState={velocityState}
            isDragging={isDragging}
            lastInteraction={lastInteractionTime}
            walkTargetIndex={isWalking ? walkIndex : null}
            viewMode={viewMode}
            ambientLightColor={currentTrack.palette.ambientLight}
            ambientLightIntensity={
              currentTrack.themeId === 'prismatic_colors'
                ? 1.55
                : currentTrack.themeId === 'blossom'
                ? 1.4
                : 1.25
            }
            onSelect={(mem) => {
              globalPlaylist.playCardChime(2);
              onSelect(mem);
            }}
            onHover={(mem) => {
              setHoveredMemory(mem);
              globalPlaylist.playCardChime(0);
            }}
            onHoverOut={() => setHoveredMemory(null)}
          />
        </Suspense>
      </Canvas>

      {/* Top Floating Navigation & Music Control Header */}
      <div className="absolute top-4 left-4 right-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pointer-events-none z-30">
        {/* Left: App Title & Active Count */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex items-center gap-3 bg-neutral-950/85 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-lg pointer-events-auto interactive-control text-white"
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
            style={{ backgroundColor: currentTrack.palette.primary }}
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 font-display">
              Memory Gallery Walk
            </span>
            <span className="text-[10px] text-gray-300 truncate max-w-[180px] sm:max-w-[260px]">
              {folderName} ({activeMemoryList.length} destinations)
            </span>
          </div>
        </motion.div>

        {/* Center: Search & Quick Tag Filter */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="hidden xl:flex items-center gap-1.5 bg-neutral-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-auto interactive-control text-white max-w-md"
        >
          <div className="flex items-center gap-1.5 pl-1.5">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs text-white placeholder:text-gray-400 bg-transparent outline-none w-28 focus:w-36 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
            {allTags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all whitespace-nowrap ${
                  activeTag === tag
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: View Modes & Global Music Bar */}
        <div className="flex items-center gap-2 pointer-events-auto flex-shrink-0">
          {/* View Modes Selector */}
          <div className="flex items-center gap-1 bg-neutral-950/85 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg text-white interactive-control">
            <button
              onClick={() => handleSetViewMode('sphere')}
              title="Outer Globe View"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'sphere'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Globe</span>
            </button>

            <button
              onClick={() => handleSetViewMode('inside_dome')}
              title="Inside Memory Dome View"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'inside_dome'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Inside Dome</span>
            </button>
          </div>

          {/* Global Music Playlist Floating Widget */}
          <MusicPlaylistBar
            currentTrack={currentTrack}
            isPlaying={isMusicPlaying}
          />
        </div>
      </div>

      {/* Bottom Left: Door Portal Exit to ating-universe.vercel.app (Positioned slightly above bottom controls to avoid mobile overlap) */}
      <div className="absolute bottom-20 sm:bottom-24 left-4 z-30 pointer-events-auto">
        <a
          href="https://ating-universe.vercel.app"
          onClick={handleExitPortal}
          className="group flex items-center gap-2 bg-neutral-950/90 hover:bg-neutral-900/95 backdrop-blur-xl border border-white/20 hover:border-emerald-400/50 px-3.5 py-2 sm:py-2.5 rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-105 active:scale-95 interactive-control cursor-pointer"
          style={{
            boxShadow: '0 8px 28px -4px rgba(16, 185, 129, 0.25)',
          }}
          title="Return to Ating Universe"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-400 transition-colors">
            <DoorOpen className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-semibold text-gray-100 group-hover:text-emerald-300 transition-colors leading-tight flex items-center gap-1">
              Universe Portal
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
            </span>
            <span className="text-[9px] text-gray-400 leading-tight">
              ating-universe.vercel.app
            </span>
          </div>
        </a>
      </div>

      {/* Cinematic Portal Warp Transition Overlay */}
      <AnimatePresence>
        {isExitingPortal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4 text-center px-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.8)] animate-pulse">
                  <DoorOpen className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 rounded-full border border-emerald-300 animate-ping opacity-30" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-wider text-white font-sans">
                  Entering Ating Universe
                </h3>
                <p className="text-xs text-emerald-300/80 font-mono tracking-widest uppercase">
                  Transitioning dimensions...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Walk Tour Controller */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none z-30 px-4">
        {/* Active Walk Memory Card Subtitle Preview with Motion Transitions */}
        <AnimatePresence mode="wait">
          {isWalking && currentWalkingMemory && (
            <motion.div
              key={currentWalkingMemory.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="bg-neutral-950/90 backdrop-blur-xl border border-white/15 shadow-2xl rounded-2xl p-3 sm:p-4 max-w-md w-full flex items-center gap-3.5 pointer-events-auto interactive-control text-white"
              style={{
                boxShadow: `0 12px 36px -6px ${currentTrack.palette.glow}`,
              }}
            >
              <div className="relative flex-shrink-0 group overflow-hidden rounded-xl">
                <SafeImage
                  memory={currentWalkingMemory}
                  src={currentWalkingMemory.imageUrl || currentWalkingMemory.thumbnailUrl}
                  alt={currentWalkingMemory.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Shuffle
                    className="w-3 h-3 flex-shrink-0 animate-pulse"
                    style={{ color: currentTrack.palette.secondary }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider block truncate"
                    style={{ color: currentTrack.palette.secondary }}
                  >
                    Random Tour ({historyPointer + 1}/{activeMemoryList.length})
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white truncate">
                  {currentWalkingMemory.title}
                </h4>
                <p className="text-xs text-gray-300 truncate">{currentWalkingMemory.location}</p>
              </div>
              <button
                onClick={() => onSelect(currentWalkingMemory)}
                className="px-3.5 py-2 bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 flex-shrink-0 hover:scale-105 active:scale-95"
              >
                <Eye className="w-3.5 h-3.5 text-gray-900" />
                <span>Inspect</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Controller Dock */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 bg-neutral-950/85 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-xl pointer-events-auto interactive-control text-white"
        >
          {/* Walk Mode Toggle */}
          <button
            onClick={() => {
              const nextWalk = !isWalking;
              setIsWalking(nextWalk);
              if (nextWalk) {
                setIsWalkPaused(false);
                // Pick a random starting destination
                const initialRandom = getRandomNextIndex(walkIndex, activeMemoryList.length, []);
                setWalkIndex(initialRandom);
                setWalkHistory([initialRandom]);
                setHistoryPointer(0);
                triggerGsapCameraTransition(initialRandom);
                globalPlaylist.playCardChime(1);
                if (!isMusicPlaying) {
                  globalPlaylist.play();
                }
              } else {
                if (gsapTimelineRef.current) {
                  gsapTimelineRef.current.kill();
                }
                // Smoothly restore default view distance
                animProxyRef.current.z = targetZ.current;
                gsap.to(animProxyRef.current, {
                  z: viewMode === 'inside_dome' ? -0.5 : (isMobile ? 26.5 : 19.5),
                  duration: 1.1,
                  ease: 'power2.out',
                  onUpdate: () => {
                    targetZ.current = animProxyRef.current.z;
                  },
                });
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            style={{
              backgroundColor: isWalking ? currentTrack.palette.primary : '#ffffff',
              color: isWalking ? '#ffffff' : '#0f172a',
            }}
          >
            {isWalking ? (
              <>
                <Shuffle className="w-4 h-4 animate-spin-slow" />
                <span>Random Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Random Walk</span>
              </>
            )}
          </button>

          {isWalking && (
            <>
              {/* Skip Back */}
              <button
                onClick={stepToPrevious}
                className="p-2 rounded-full hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                title="Previous memory in tour"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Pause / Resume */}
              <button
                onClick={() => setIsWalkPaused(!isWalkPaused)}
                className="p-2 rounded-full hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                title={isWalkPaused ? 'Resume random tour' : 'Pause random tour'}
              >
                {isWalkPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              {/* Next Random Memory */}
              <button
                onClick={stepToNextRandom}
                className="p-2 rounded-full hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                title="Next random memory"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="h-4 w-px bg-white/15 mx-1" />

          {/* Reset Orientation & Zoom */}
          <button
            onClick={() => {
              if (gsapTimelineRef.current) {
                gsapTimelineRef.current.kill();
              }
              handleSetViewMode('sphere');
              rotationState.current = { x: 0, y: 0 };
              velocityState.current = { x: 0, y: 0.002 };
              animProxyRef.current.z = targetZ.current;
              gsap.to(animProxyRef.current, {
                z: isMobile ? 26.5 : 19.5,
                duration: 1.0,
                ease: 'power2.out',
                onUpdate: () => {
                  targetZ.current = animProxyRef.current.z;
                },
              });
              if (onResetView) onResetView();
            }}
            title="Reset sphere orientation & zoom"
            className="text-[10px] text-gray-300 hover:text-white tracking-wider uppercase px-2 py-1 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </motion.div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredMemory && !isWalking && (
        <div
          ref={tooltipRef}
          className="pointer-events-none fixed top-0 left-0 z-50 bg-neutral-950/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-sans shadow-2xl flex flex-col gap-0.5 border border-white/15 max-w-xs transition-transform duration-75"
          style={{
            willChange: 'transform',
            transform: `translate(${pointerPos.current.x + 16}px, ${pointerPos.current.y + 16}px)`,
          }}
        >
          <span className="font-semibold text-white truncate">{hoveredMemory.title}</span>
          <span className="text-[10px] text-gray-300 truncate">{hoveredMemory.location} • {hoveredMemory.date}</span>
        </div>
      )}
    </div>
  );
}
