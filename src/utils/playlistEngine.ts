// Global Music Playlist Engine & Audio Synthesizer with Atmosphere Sync

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  fileUrl: string;
  fallbackSynthesizerTheme: string;
  themeId: 'blossom' | 'nostalgia_forest' | 'prismatic_colors';
  themeName: string;
  themeDescription: string;
  palette: {
    primary: string;
    secondary: string;
    ambientLight: string;
    glow: string;
    bgStyle: string;
    canvasBg: string;
    particleHue: number[];
  };
}

export const PLAYLIST: SongTrack[] = [
  {
    id: 'like-you',
    title: "I Like You So Much, You'll Know It",
    artist: 'YS Belle (A Love So Beautiful)',
    fileUrl: '/music/i-like-you-so-much-youll-know-it.mp3',
    fallbackSynthesizerTheme: 'Sweet Romantic Melody in C Major',
    themeId: 'blossom',
    themeName: 'Blossom Romance',
    themeDescription: 'Soft petal pinks, peach twilight warmth, and gentle glowing bokeh.',
    palette: {
      primary: '#f43f5e',
      secondary: '#fb7185',
      ambientLight: '#ffd1dc',
      glow: 'rgba(244, 63, 94, 0.25)',
      bgStyle: 'from-rose-950/40 via-pink-950/20 to-neutral-950',
      canvasBg: '#130c10',
      particleHue: [330, 350, 15],
    },
  },
  {
    id: 'somewhere',
    title: 'Somewhere Only We Know',
    artist: 'Keane',
    fileUrl: '/music/somewhere-only-we-know.mp3',
    fallbackSynthesizerTheme: 'Nostalgic Pine Piano & Earth Chords',
    themeId: 'nostalgia_forest',
    themeName: 'Emerald Solitude',
    themeDescription: 'Misty forest moss, slate pine shadows, and serene firefly specks.',
    palette: {
      primary: '#10b981',
      secondary: '#059669',
      ambientLight: '#a7f3d0',
      glow: 'rgba(16, 185, 129, 0.25)',
      bgStyle: 'from-emerald-950/50 via-teal-950/30 to-neutral-950',
      canvasBg: '#081410',
      particleHue: [140, 165, 180],
    },
  },
  {
    id: 'true-colors',
    title: 'True Colors',
    artist: 'Justin Timberlake & Anna Kendrick',
    fileUrl: '/music/true-colors.mp3',
    fallbackSynthesizerTheme: 'Prismatic Aurora Chords in F Major',
    themeId: 'prismatic_colors',
    themeName: 'True Chromatic Spectrum',
    themeDescription: 'Dynamic iridescent rainbow shifts, violet waves, and kaleidoscopic auroras.',
    palette: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      ambientLight: '#c4b5fd',
      glow: 'rgba(139, 92, 246, 0.3)',
      bgStyle: 'from-purple-950/50 via-indigo-950/30 to-neutral-950',
      canvasBg: '#0d0c18',
      particleHue: [260, 190, 45, 310],
    },
  },
];

type PlaylistListener = () => void;

class GlobalPlaylistController {
  private audioElement: HTMLAudioElement | null = null;
  private currentTrackIndex = 0;
  private isPlaying = false;
  private isSynthesizerActive = false;
  private volume = 0.65;
  private currentTime = 0;
  private duration = 0;
  private listeners = new Set<PlaylistListener>();
  private userUploadedUrls = new Map<string, string>();

  // Procedural Web Audio Synthesizer for instant fallback & chimes
  private audioCtx: AudioContext | null = null;
  private synthGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private synthStep = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audioElement) return;
    this.audioElement = new Audio();
    this.audioElement.volume = this.volume;
    this.audioElement.crossOrigin = 'anonymous';

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
        this.duration = this.audioElement.duration || 0;
        this.notify();
      }
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement) {
        this.duration = this.audioElement.duration || 0;
        this.notify();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audioElement.addEventListener('error', () => {
      // If local MP3 is not in /public/music/ yet, seamlessly switch to procedural synth
      if (this.isPlaying) {
        this.startProceduralSynthesizer();
      }
    });
  }

  public subscribe(listener: PlaylistListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getCurrentTrack(): SongTrack {
    return PLAYLIST[this.currentTrackIndex];
  }

  public getTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsSynthesizerActive(): boolean {
    return this.isSynthesizerActive;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public async play(): Promise<void> {
    this.initAudioElement();
    this.isPlaying = true;
    const track = this.getCurrentTrack();
    const sourceUrl = this.userUploadedUrls.get(track.id) || track.fileUrl;

    if (this.audioElement) {
      if (this.audioElement.src !== window.location.origin + sourceUrl && !this.audioElement.src.endsWith(sourceUrl)) {
        this.audioElement.src = sourceUrl;
      }

      try {
        await this.audioElement.play();
        this.stopProceduralSynthesizer();
        this.isSynthesizerActive = false;
      } catch (err) {
        // Autoplay policy or missing file -> activate theme synthesizer
        this.startProceduralSynthesizer();
      }
    } else {
      this.startProceduralSynthesizer();
    }
    this.notify();
  }

  public pause(): void {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopProceduralSynthesizer();
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setTrack(index: number): void {
    this.currentTrackIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    this.currentTime = 0;
    if (this.isPlaying) {
      this.stopProceduralSynthesizer();
      this.play();
    } else {
      this.notify();
    }
  }

  public nextTrack(): void {
    this.setTrack(this.currentTrackIndex + 1);
  }

  public prevTrack(): void {
    this.setTrack(this.currentTrackIndex - 1);
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.synthGain && this.audioCtx) {
      this.synthGain.gain.setValueAtTime(this.volume * 0.12, this.audioCtx.currentTime);
    }
    this.notify();
  }

  public seek(seconds: number): void {
    if (this.audioElement && this.duration > 0) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.duration, seconds));
      this.currentTime = this.audioElement.currentTime;
      this.notify();
    }
  }

  public setCustomTrackFile(trackId: string, file: File): void {
    const objectUrl = URL.createObjectURL(file);
    this.userUploadedUrls.set(trackId, objectUrl);
    if (this.getCurrentTrack().id === trackId && this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  // --- Procedural Melody & Chord Synthesizer ---
  private initSynthContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.synthGain = this.audioCtx.createGain();
      this.synthGain.gain.setValueAtTime(this.volume * 0.12, this.audioCtx.currentTime);
      this.synthGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private startProceduralSynthesizer() {
    this.initSynthContext();
    if (!this.audioCtx || !this.synthGain) return;
    this.isSynthesizerActive = true;
    this.stopProceduralSynthesizer();

    const track = this.getCurrentTrack();
    this.synthStep = 0;

    // Distinct note sequences based on track theme
    let chordProgressions: number[][];

    if (track.themeId === 'blossom') {
      // "I Like You So Much, You'll Know It" sweet bouncy C / G / Am / F
      chordProgressions = [
        [261.63, 329.63, 392.0, 523.25], // C maj
        [196.0, 246.94, 293.66, 392.0],  // G maj
        [220.0, 261.63, 329.63, 440.0],  // A min
        [174.61, 220.0, 261.63, 349.23], // F maj
      ];
    } else if (track.themeId === 'nostalgia_forest') {
      // "Somewhere Only We Know" signature Keane A major & C# minor piano chords
      chordProgressions = [
        [220.0, 277.18, 329.63, 440.0],  // A maj
        [277.18, 329.63, 415.3, 554.37], // C# min
        [246.94, 293.66, 369.99, 493.88],// B min
        [164.81, 207.65, 246.94, 329.63],// E maj
      ];
    } else {
      // "True Colors" hopeful chromatic rainbow chords (F - G - Am - Em)
      chordProgressions = [
        [174.61, 220.0, 261.63, 349.23], // F maj
        [196.0, 246.94, 293.66, 392.0],  // G maj
        [220.0, 261.63, 329.63, 440.0],  // Am
        [164.81, 196.0, 246.94, 329.63], // Em
      ];
    }

    const stepIntervalMs = 500;
    this.synthInterval = window.setInterval(() => {
      if (!this.audioCtx || !this.synthGain || !this.isPlaying) return;

      const chordIdx = Math.floor(this.synthStep / 4) % chordProgressions.length;
      const noteIdx = this.synthStep % 4;
      const currentChord = chordProgressions[chordIdx];
      const freq = currentChord[noteIdx];

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = track.themeId === 'nostalgia_forest' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(noteGain);
      noteGain.connect(this.synthGain);

      osc.start(now);
      osc.stop(now + 1.25);

      this.synthStep++;
      this.currentTime = (this.synthStep * 0.5);
      this.duration = 45; // 45 seconds loop cycle in synthesized fallback mode
      
      // Auto-advance loop to next track when synthesized cycle finishes
      if (this.currentTime >= this.duration) {
        this.nextTrack();
        return;
      }
      this.notify();
    }, stepIntervalMs);
  }

  private stopProceduralSynthesizer() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public playCardChime(index: number = 0) {
    try {
      this.initSynthContext();
      if (!this.audioCtx) return;
      const track = this.getCurrentTrack();
      const pentatonic =
        track.themeId === 'blossom'
          ? [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
          : track.themeId === 'nostalgia_forest'
          ? [440.0, 493.88, 554.37, 659.25, 739.99, 880.0]
          : [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 880.0];

      const freq = pentatonic[index % pentatonic.length];
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.15);
    } catch (e) {
      // Ignore initial user-gesture constraints
    }
  }
}

export const globalPlaylist = new GlobalPlaylistController();
