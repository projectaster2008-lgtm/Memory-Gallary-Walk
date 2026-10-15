import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Globe2, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Compass, 
  MapPin, 
  ChevronDown,
  Layers,
  Lock
} from 'lucide-react';
import { AVAILABLE_WORLDS, WorldDefinition } from '../../worlds';
import { globalPlaylist, SongTrack } from '../../utils/playlistEngine';
import LobbyCanvas from './LobbyCanvas';

gsap.registerPlugin(ScrollTrigger);

interface LobbyScreenProps {
  onEnterGlobe: () => void;
  memoriesCount?: number;
}

export default function LobbyScreen({ onEnterGlobe, memoriesCount = 53 }: LobbyScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const worldsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState<WorldDefinition>(AVAILABLE_WORLDS[0]);

  // Audio control
  const [currentTrack, setCurrentTrack] = useState<SongTrack>(globalPlaylist.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(globalPlaylist.getIsPlaying());

  useEffect(() => {
    const unsub = globalPlaylist.subscribe(() => {
      setCurrentTrack(globalPlaylist.getCurrentTrack());
      setIsPlaying(globalPlaylist.getIsPlaying());
    });
    return unsub;
  }, []);

  const toggleMusic = () => {
    globalPlaylist.toggle();
  };

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // Animate Hero elements on mount
      gsap.from('.gsap-hero-item', {
        opacity: 0,
        y: 30,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Animate World cards on scroll
      gsap.from('.gsap-world-card', {
        scrollTrigger: {
          trigger: worldsRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power2.out',
      });

      // Animate quote section on scroll
      gsap.from('.gsap-quote-item', {
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        duration: 1.0,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleEnterWorld = (world: WorldDefinition) => {
    if (world.status !== 'active') return;
    setIsTransitioning(true);
    // Smooth cinematic delay for camera push-in before entering Globe
    setTimeout(() => {
      onEnterGlobe();
    }, 1100);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-neutral-950 text-white selection:bg-amber-500/30 font-sans"
    >
      {/* Visual Foundation: Warm Golden-Hour Nature Reference Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-transform duration-700 ease-out"
        style={{
          transform: `scale(${1.03 + scrollProgress * 0.05}) translate3d(0, ${-scrollProgress * 25}px, 0)`,
        }}
      >
        <img
          src="/reference-lobby-bg.jpg"
          alt="Lobby Reference Background"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.08] saturate-[1.12]"
        />
        {/* Soft Volumetric Vignette & Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/45 to-neutral-950/90" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-amber-900/15 via-transparent to-neutral-950/80" />
      </div>

      {/* 3D Three.js Layer: Ambient Dust Motes, World Portal Hologram & Camera Rig */}
      <LobbyCanvas
        scrollProgress={scrollProgress}
        isTransitioning={isTransitioning}
      />

      {/* Minimal Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between backdrop-blur-md bg-neutral-950/40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Globe2 className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wider font-display uppercase text-white/90">
              Memory Gallery
            </span>
            <span className="text-[10px] text-amber-200/70 tracking-wide uppercase">
              Cinematic Sanctuary
            </span>
          </div>
        </div>

        {/* Ambient Soundscape Controller */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white/90 backdrop-blur-md transition-all shadow-sm"
            title="Toggle Soundscape"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline truncate max-w-[140px] text-gray-300 text-[11px]">
                  {currentTrack.title}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline text-gray-400 text-[11px]">Soundscape Off</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleEnterWorld(AVAILABLE_WORLDS[0])}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs transition-all shadow-lg hover:shadow-amber-500/20"
          >
            <span>Enter Globe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="relative z-20 flex flex-col items-center">
        {/* =========================================
            SECTION 1: HERO / LOBBY GATE
            ========================================= */}
        <section 
          ref={heroRef}
          className="min-h-screen w-full max-w-6xl px-6 flex flex-col justify-center items-center text-center pt-28 pb-16"
        >
          {/* Active World Badge */}
          <div className="gsap-hero-item inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-300 text-xs font-medium tracking-wide mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>World 01 Active • {memoriesCount} Global Destinations Ready</span>
          </div>

          {/* Main Title */}
          <h1 className="gsap-hero-item text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-6 font-display max-w-4xl leading-tight">
            Step into the <br />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Memory Gallery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="gsap-hero-item text-gray-300/90 text-base sm:text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10">
            An immersive 3D realm preserving shared journeys, laughter, and milestones across {memoriesCount} hand-curated global destinations.
          </p>

          {/* Primary CTA */}
          <div className="gsap-hero-item flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => handleEnterWorld(AVAILABLE_WORLDS[0])}
              disabled={isTransitioning}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-semibold text-sm tracking-wide transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <span>Enter Living Globe</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#worlds"
              className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all backdrop-blur-md flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Explore Worlds</span>
            </a>
          </div>

          {/* Scroll Down Hint */}
          <div className="gsap-hero-item mt-16 flex flex-col items-center text-gray-400 text-xs tracking-widest uppercase">
            <span className="mb-2 text-[10px] text-gray-400/80">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-amber-400/80" />
          </div>
        </section>

        {/* =========================================
            SECTION 2: WORLDS SANCTUARY
            ========================================= */}
        <section 
          id="worlds"
          ref={worldsRef}
          className="min-h-screen w-full max-w-6xl px-6 py-24 flex flex-col justify-center"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-300/80 mb-3 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Sanctuary Registry</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight font-display">
              Worlds & Portals
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              Select an available world to enter or preview upcoming archival spheres designed for future memories.
            </p>
          </div>

          {/* Worlds Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVAILABLE_WORLDS.map((world) => {
              const isActive = world.status === 'active';
              return (
                <div
                  key={world.id}
                  onClick={() => setSelectedWorld(world)}
                  className={`gsap-world-card group relative rounded-2xl overflow-hidden border p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer backdrop-blur-xl ${
                    selectedWorld.id === world.id
                      ? 'border-amber-400/60 bg-neutral-900/80 shadow-[0_10px_35px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
                      : 'border-white/10 bg-neutral-950/60 hover:border-white/20 hover:bg-neutral-900/60'
                  }`}
                >
                  <div>
                    {/* Top Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-medium text-amber-400/90 uppercase tracking-widest">
                        {world.name}
                      </span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Ready • {world.destinationsCount} Places
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium">
                          <Lock className="w-3 h-3 text-gray-500" />
                          Archived
                        </span>
                      )}
                    </div>

                    {/* World Title & Tagline */}
                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-amber-200 transition-colors">
                      {world.title}
                    </h3>
                    <p className="text-xs text-amber-300/80 mb-3 font-medium">
                      {world.tagline}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-6">
                      {world.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {world.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isActive ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnterWorld(world);
                        }}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>Enter World</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-2.5 rounded-xl bg-white/5 text-gray-500 text-xs font-medium text-center border border-white/5">
                        In Development
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================
            SECTION 3: ATMOSPHERIC STORY & STATS
            ========================================= */}
        <section 
          ref={quoteRef}
          className="min-h-[80vh] w-full max-w-4xl px-6 py-24 flex flex-col justify-center items-center text-center"
        >
          <div className="gsap-quote-item w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-8" />

          <p className="gsap-quote-item text-xl sm:text-3xl font-light text-gray-200/90 leading-relaxed font-display max-w-2xl mb-8">
            &ldquo;Every coordinate holds a memory. Walk through moments frozen in time, from mountain ridges to quiet sunlit paths.&rdquo;
          </p>

          <div className="gsap-quote-item flex items-center gap-8 text-xs text-gray-400 uppercase tracking-widest mb-12">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-light text-white font-mono">{memoriesCount}</span>
              <span className="text-[10px] text-amber-300/80 mt-1">Destinations</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-light text-white font-mono">360°</span>
              <span className="text-[10px] text-amber-300/80 mt-1">Dome Walk</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-light text-white font-mono">3</span>
              <span className="text-[10px] text-amber-300/80 mt-1">Soundscapes</span>
            </div>
          </div>

          <div className="gsap-quote-item">
            <button
              onClick={() => handleEnterWorld(AVAILABLE_WORLDS[0])}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch The Memory Globe</span>
            </button>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="w-full py-8 border-t border-white/5 text-center text-xs text-gray-500">
          <p>Memory Gallery Walk • Echoes of 22 • All 53 Destinations Preserved</p>
        </footer>
      </div>

      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center text-white pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-amber-400/40 flex items-center justify-center animate-spin-slow">
                <Globe2 className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-sm font-light tracking-widest uppercase text-amber-200">
                Entering The Living Globe...
              </p>
              <span className="text-xs text-gray-400">
                Initializing 53 curated destinations
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
