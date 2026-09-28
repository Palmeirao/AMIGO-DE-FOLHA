/**
 * Synthesized Web Audio API for Amigo de Folha
 * Completely self-contained, no external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lullabyInterval: number | null = null;
  private lullabyStep: number = 0;
  private ambientNoiseNode: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    // Lazy initialize upon first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopLullaby();
      this.stopAmbientSleep();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft bell / music box note
  public playNote(frequency: number, duration: number = 0.8, volume: number = 0.15) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with soft triangle harmonic for music box feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  // Gentle purring / cuddle sound
  public playPurrGiggle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.25);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Handle gracefully
    }
  }

  // Water drop sound for watering plant
  public playWaterDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Handle gracefully
    }
  }

  // Sparkle chime for XP or task completion
  public playSparkle() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.6, 0.12);
      }, idx * 75);
    });
  }

  // Calming aroma chime (lavender notes)
  public playAromaChime() {
    if (this.isMuted) return;
    const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 1.4, 0.1);
      }, idx * 90);
    });
  }

  // Soft wooden click
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Handle gracefully
    }
  }

  // Brahms' Lullaby music box melody
  public startLullaby() {
    if (this.isMuted) return;
    this.stopLullaby();
    this.initContext();

    // Notes: [freq, duration in seconds]
    // Classic Brahms Lullaby opening (G4 G4 B4, G4 G4 B4, G4 B4 D5 C5 B4 A4...)
    const melody: [number, number][] = [
      [392.00, 0.6], [392.00, 0.6], [493.88, 1.0],
      [392.00, 0.6], [392.00, 0.6], [493.88, 1.0],
      [392.00, 0.5], [493.88, 0.5], [587.33, 0.9], [523.25, 0.5], [493.88, 0.7], [440.00, 1.1],
      [349.23, 0.6], [392.00, 0.6], [440.00, 1.0],
      [349.23, 0.6], [392.00, 0.6], [440.00, 1.0],
      [440.00, 0.5], [493.88, 0.5], [523.25, 0.8], [493.88, 0.5], [440.00, 0.7], [392.00, 1.2],
    ];

    this.lullabyStep = 0;

    const playNext = () => {
      if (this.isMuted) return;
      const [freq, dur] = melody[this.lullabyStep % melody.length];
      this.playNote(freq, dur * 1.2, 0.09);
      this.lullabyStep++;

      const nextInterval = (dur + 0.25) * 1000;
      this.lullabyInterval = window.setTimeout(playNext, nextInterval);
    };

    playNext();
  }

  public stopLullaby() {
    if (this.lullabyInterval !== null) {
      clearTimeout(this.lullabyInterval);
      this.lullabyInterval = null;
    }
  }

  // Soft sleep ambience (soothing night crickets & breeze synthesized)
  public startAmbientSleep() {
    if (this.isMuted) return;
    this.stopAmbientSleep();
    this.initContext();
    if (!this.ctx) return;

    try {
      // Create gentle filtered noise for soft night breeze
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.ambientNoiseNode = this.ctx.createBufferSource();
      this.ambientNoiseNode.buffer = buffer;
      this.ambientNoiseNode.loop = true;

      // Low pass filter to make it sound like gentle wind
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.ambientNoiseNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNoiseNode.start();
    } catch {
      // Ignore
    }
  }

  public stopAmbientSleep() {
    if (this.ambientNoiseNode) {
      try {
        this.ambientNoiseNode.stop();
        this.ambientNoiseNode.disconnect();
      } catch {
        // Ignore
      }
      this.ambientNoiseNode = null;
    }
  }
}

export const sounds = new SoundEngine();
