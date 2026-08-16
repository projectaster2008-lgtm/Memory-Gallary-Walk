import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Upload,
  ChevronUp,
  ChevronDown,
  Disc3,
  X,
} from 'lucide-react';
import { globalPlaylist, PLAYLIST, SongTrack } from '../utils/playlistEngine';

interface MusicPlaylistBarProps {
  currentTrack: SongTrack;
  isPlaying: boolean;
  onTrackChange?: (track: SongTrack) => void;
}

export default function MusicPlaylistBar({
  currentTrack,
  isPlaying,
}: MusicPlaylistBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(globalPlaylist.getCurrentTime());
  const [duration, setDuration] = useState(globalPlaylist.getDuration());
  const [volume, setVolume] = useState(globalPlaylist.getVolume());
  const [isMuted, setIsMuted] = useState(false);
  const [isSynthActive, setIsSynthActive] = useState(globalPlaylist.getIsSynthesizerActive());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [uploadingTrackId, setUploadingTrackId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = globalPlaylist.subscribe(() => {
      setCurrentTime(globalPlaylist.getCurrentTime());
      setDuration(globalPlaylist.getDuration());
      setVolume(globalPlaylist.getVolume());
      setIsSynthActive(globalPlaylist.getIsSynthesizerActive());
    });
    return unsubscribe;
  }, []);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTogglePlay = () => {
    globalPlaylist.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalPlaylist.setVolume(val);
    setIsMuted(val === 0);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      globalPlaylist.setVolume(0.65);
      setIsMuted(false);
    } else {
      globalPlaylist.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    globalPlaylist.seek(val);
  };

  const handleUploadClick = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadingTrackId(trackId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingTrackId) {
      globalPlaylist.setCustomTrackFile(uploadingTrackId, file);
    }
  };

  return (
    <div ref={dropdownRef} className="relative pointer-events-auto interactive-control">
      {/* Hidden File Input for Custom MP3 files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Floating Compact Bar */}
      <div
        className="flex items-center gap-2 sm:gap-3 bg-neutral-950/85 backdrop-blur-xl border border-white/15 px-3.5 sm:px-4 py-2 rounded-full shadow-2xl text-white transition-all duration-300 hover:border-white/25"
        style={{
          boxShadow: `0 8px 32px -4px ${currentTrack.palette.glow}`,
        }}
      >
        {/* Toggle Expand Playlist */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-white/15 rounded-full transition-colors text-gray-300 hover:text-white flex items-center gap-1"
          title="Toggle Playlist Menu"
        >
          <Music className="w-3.5 h-3.5" style={{ color: currentTrack.palette.primary }} />
          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          )}
        </button>

        {/* Prev Track */}
        <button
          onClick={() => globalPlaylist.prevTrack()}
          className="p-1.5 hover:bg-white/15 rounded-full transition-colors text-gray-300 hover:text-white"
          title="Previous Track"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={handleTogglePlay}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-md flex-shrink-0"
          style={{
            backgroundColor: currentTrack.palette.primary,
          }}
          title={isPlaying ? 'Pause music' : 'Play atmosphere music'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white text-white" />
          ) : (
            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={() => globalPlaylist.nextTrack()}
          className="p-1.5 hover:bg-white/15 rounded-full transition-colors text-gray-300 hover:text-white"
          title="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Current Song Title & Theme Badge */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer min-w-0 max-w-[130px] sm:max-w-[210px] hidden xs:flex flex-col"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white truncate leading-tight">
              {currentTrack.title}
            </span>
          </div>
          <span
            className="text-[10px] font-medium truncate"
            style={{ color: currentTrack.palette.secondary }}
          >
            {currentTrack.themeName}
          </span>
        </div>

        {/* Equalizer Visualizer Bars */}
        <div className="hidden sm:flex items-end gap-0.5 h-3.5 px-1 flex-shrink-0">
          <span
            className={`w-0.5 bg-emerald-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3.5 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-teal-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2.5 animate-pulse delay-100' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-pink-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-3 animate-pulse delay-75' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-indigo-400 rounded-full transition-all duration-300 ${
              isPlaying ? 'h-2 animate-pulse delay-150' : 'h-1 opacity-40'
            }`}
          />
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/10">
          <button
            onClick={handleToggleMute}
            className="p-1.5 hover:bg-white/15 rounded-full text-gray-300 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 hidden md:block"
          />
        </div>
      </div>

      {/* Expanded Playlist Dropdown Menu - Drops down below bar with safe margin from right edge */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2.5 bg-neutral-900/95 backdrop-blur-2xl border border-white/15 text-white rounded-3xl p-4 shadow-2xl w-80 sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header with Title and explicit Close 'X' Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span className="text-xs font-bold font-display uppercase tracking-wider text-gray-200">
                Atmosphere Music Playlist
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                3 Themes
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/20 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Close playlist"
                aria-label="Close playlist"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tracks List */}
          <div className="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {PLAYLIST.map((t, idx) => {
              const isCurrent = t.id === currentTrack.id;
              return (
                <div
                  key={t.id}
                  onClick={() => globalPlaylist.setTrack(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${
                    isCurrent
                      ? 'bg-white/15 border-white/25 shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: isCurrent ? t.palette.primary : 'rgba(255,255,255,0.1)',
                        color: '#fff',
                      }}
                    >
                      {isCurrent && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-full bg-white animate-pulse" />
                          <span className="w-0.5 h-2 bg-white animate-pulse delay-75" />
                          <span className="w-0.5 h-2.5 bg-white animate-pulse delay-150" />
                        </div>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold truncate text-white leading-tight">
                        {t.title}
                      </h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 truncate">
                        <span>{t.artist}</span>
                        <span>•</span>
                        <span style={{ color: t.palette.primary }}>{t.themeName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Custom upload MP3 action */}
                  <button
                    onClick={(e) => handleUploadClick(t.id, e)}
                    title={`Audio file options for ${t.title}`}
                    className="p-1.5 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
