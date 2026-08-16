// Web Audio API ambient soundscape generator for immersive memory gallery walk

class MemorySoundscape {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.linearRampToValueAtTime(0.18, now + 3);

    // Warm ambient chords (F maj9: F2, C3, A3, E4)
    const baseFreqs = [87.31, 130.81, 220.0, 329.63];

    this.droneOscs = [];
    this.droneGains = [];

    baseFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Add gentle slow LFO tremolo
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.015, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.droneOscs.push(osc);
      this.droneGains.push(gain);
    });
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
    setTimeout(() => {
      this.droneOscs.forEach(o => {
        try { o.stop(); o.disconnect(); } catch (e) {}
      });
      this.droneOscs = [];
      this.isPlaying = false;
    }, 1600);
  }

  public playCardChime(pitchIndex: number = 0) {
    try {
      this.initContext();
      if (!this.ctx) return;
      
      const notes = [440, 493.88, 554.37, 659.25, 739.99, 880, 987.77, 1108.73];
      const freq = notes[pitchIndex % notes.length];
      
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      // Audio context might be restricted before first click
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new MemorySoundscape();
