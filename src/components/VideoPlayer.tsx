import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Film,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MemoryItem } from '../types';

interface VideoPlayerProps {
  memory: MemoryItem;
  className?: string;
  autoPlay?: boolean;
}

export default function VideoPlayer({
  memory,
  className = '',
  autoPlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mode: If it's a Drive video, default to Google Drive embed for reliable 1080p playback, or allow toggling to HTML5 player
  const hasDriveEmbed = Boolean(memory.videoEmbedUrl || memory.driveFileId);
  const [playerMode, setPlayerMode] = useState<'embed' | 'html5'>(
    hasDriveEmbed ? 'embed' : 'html5'
  );

  // HTML5 Player States
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const embedUrl =
    memory.videoEmbedUrl ||
    (memory.driveFileId
      ? `https://drive.google.com/file/d/${memory.driveFileId}/preview`
      : undefined);

  const rawVideoUrl = memory.videoUrl;

  // Format seconds to mm:ss
  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '0:00';
    const minutes = Math.floor(timeInSec / 60);
    const seconds = Math.floor(timeInSec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  // Seek bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  // Mute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Playback Rate
  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls on mouse idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      {/* 1. GOOGLE DRIVE EMBED PLAYER MODE */}
      {playerMode === 'embed' && embedUrl ? (
        <div className="relative w-full h-full">
          <iframe
            src={embedUrl}
            title={memory.title}
            className="w-full h-full border-0 bg-black"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />

          {/* Top Bar with Mode switcher and Drive direct link */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full text-white text-[11px] font-medium border border-white/10 pointer-events-auto shadow-lg">
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>Drive Video Stream</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {rawVideoUrl && (
                <button
                  onClick={() => setPlayerMode('html5')}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-[11px] backdrop-blur-md transition-all flex items-center gap-1 border border-white/10"
                >
                  <Layers className="w-3 h-3" />
                  <span>HTML5 Player</span>
                </button>
              )}

              {memory.webViewLink && (
                <a
                  href={memory.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[11px] font-semibold backdrop-blur-md transition-all flex items-center gap-1 shadow-md"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open in Drive</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2. CUSTOM HTML5 VIDEO PLAYER MODE */
        <div className="relative w-full h-full flex items-center justify-center group">
          <video
            ref={videoRef}
            src={rawVideoUrl || memory.imageUrl}
            poster={memory.thumbnailUrl || memory.imageUrl}
            playsInline
            autoPlay={autoPlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                setIsLoading(false);
              }
            }}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Center Play/Pause Floating Icon on hover or pause */}
          {(!isPlaying || showControls) && (
            <button
              onClick={togglePlay}
              className="absolute p-4 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all hover:scale-110 shadow-2xl border border-white/10"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-0.5" />
              )}
            </button>
          )}

          {/* Top Bar */}
          <div
            className={`absolute top-3 left-3 right-3 flex items-center justify-between transition-opacity duration-300 z-20 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-white text-[11px] font-medium border border-white/10">
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[200px]">{memory.title}</span>
            </div>

            {hasDriveEmbed && (
              <button
                onClick={() => setPlayerMode('embed')}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-full text-[11px] backdrop-blur-md transition-all flex items-center gap-1 border border-white/10"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Drive Stream Mode</span>
              </button>
            )}
          </div>

          {/* Bottom Custom Control Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 transition-opacity duration-300 z-20 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Seek Timeline */}
            <div className="flex items-center gap-3 w-full">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/30 hover:bg-white/50 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>

                {/* Time Display */}
                <span className="text-[11px] text-gray-300 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume & Mute */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Playback speed */}
                <button
                  onClick={cyclePlaybackRate}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[10px] font-semibold text-gray-200 transition-colors"
                  title="Playback Speed"
                >
                  {playbackRate}x
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  title="Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
