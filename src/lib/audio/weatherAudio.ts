/**
 * Garden Ambient Music & Weather Audio Engine
 * Pure Web Audio API procedural synthesis with zero external dependencies.
 * Creates tranquil, meditative pentatonic melodies, warm atmospheric chords,
 * and soothing natural weather soundscapes.
 */

class WeatherAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentMode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora' = 'sunny';
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private weatherGain: GainNode | null = null;
  
  // Track active nodes and timers
  private melodyInterval: any = null;
  private chordInterval: any = null;
  private sfxInterval: any = null;
  private activeOscillators: OscillatorNode[] = [];
  private noiseSource: AudioBufferSourceNode | null = null;

  // Gentle, tranquil pentatonic notes (Hz)
  // C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
  private pentatonicScale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];

  // Warm chord progressions for atmospheric pads (root frequencies in Hz)
  private chordProgressions = [
    [130.81, 164.81, 196.0, 246.94], // Cmaj7
    [110.0, 130.81, 164.81, 196.0],   // Am7
    [87.31, 130.81, 164.81, 220.0],   // Fmaj7
    [98.0, 146.83, 196.0, 246.94],    // G6
  ];
  private currentChordIndex = 0;

  public async init(): Promise<AudioContext | null> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume notice:', err);
      }
    }
    return this.ctx;
  }

  public setMode(mode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora') {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stop();
      this.play(mode);
    }
  }

  public async play(mode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora') {
    await this.init();
    if (!this.ctx) return;
    this.stop();

    this.currentMode = mode;
    this.isPlaying = true;

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Sub-buses
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.weatherGain = this.ctx.createGain();
    this.weatherGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
    this.weatherGain.connect(this.masterGain);

    // 1. Start procedural relaxing melody & warm chords
    this.startMusicSequence();

    // 2. Start weather natural ambiance
    if (mode === 'gentle_rain') {
      this.startRainSoundscape();
    } else if (mode === 'breezy_mist') {
      this.startBreezeSoundscape();
    } else if (mode === 'twilight_aurora') {
      this.startNightSoundscape();
    } else {
      this.startSunnySoundscape();
    }
  }

  public stop() {
    this.isPlaying = false;

    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
    if (this.sfxInterval) {
      clearInterval(this.sfxInterval);
      this.sfxInterval = null;
    }

    // Stop and disconnect all active oscillators
    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    }
    this.activeOscillators = [];

    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      } catch {}
      this.noiseSource = null;
    }

    if (this.musicGain) {
      try { this.musicGain.disconnect(); } catch {}
      this.musicGain = null;
    }
    if (this.weatherGain) {
      try { this.weatherGain.disconnect(); } catch {}
      this.weatherGain = null;
    }
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch {}
      this.masterGain = null;
    }
  }

  public toggle(mode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora'): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(mode);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // ==========================================
  // PROCEDURAL RELAXING GARDEN MUSIC
  // ==========================================
  private startMusicSequence() {
    if (!this.ctx || !this.musicGain) return;

    // Trigger initial pad chord immediately
    this.playPadChord();

    // Chord cycle every 4.8 seconds
    this.chordInterval = setInterval(() => {
      if (!this.isPlaying) return;
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
      this.playPadChord();
    }, 4800);

    // Play tranquil melody notes randomly picked from pentatonic scale
    this.playPluckNote();
    this.melodyInterval = setInterval(() => {
      if (!this.isPlaying) return;
      // 75% chance to play note for breathing room
      if (Math.random() > 0.25) {
        this.playPluckNote();
      }
    }, 1200);
  }

  /**
   * Plays a warm, soft atmospheric chord pad with slow attack and release
   */
  private playPadChord() {
    if (!this.ctx || !this.musicGain) return;
    const chord = this.chordProgressions[this.currentChordIndex];
    const now = this.ctx.currentTime;
    const duration = 4.7;

    chord.forEach((freq) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Lowpass filter for smooth warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);

      // Gentle swell attack and slow fadeout
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.4);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);

      this.activeOscillators.push(osc);
      setTimeout(() => {
        const idx = this.activeOscillators.indexOf(osc);
        if (idx !== -1) this.activeOscillators.splice(idx, 1);
      }, (duration + 0.2) * 1000);
    });
  }

  /**
   * Plays a delicate, clear bell/harp chime tone
   */
  private playPluckNote() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const noteFreq = this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];

    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Subtle octave harmonic
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(noteFreq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);

    // Bell envelope: instant soft attack, gentle exponential ring
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + 1.5);
    subOsc.stop(now + 1.5);

    this.activeOscillators.push(osc, subOsc);
    setTimeout(() => {
      let idx = this.activeOscillators.indexOf(osc);
      if (idx !== -1) this.activeOscillators.splice(idx, 1);
      idx = this.activeOscillators.indexOf(subOsc);
      if (idx !== -1) this.activeOscillators.splice(idx, 1);
    }, 1600);
  }

  // ==========================================
  // NATURAL WEATHER SOUNDSCAPES
  // ==========================================
  private startRainSoundscape() {
    if (!this.ctx || !this.weatherGain) return;

    // Filtered pink noise for steady rainfall
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.15;
      b6 = white * 0.115926;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(this.weatherGain);
    rainSource.start();
    this.noiseSource = rainSource;

    // Gentle raindrop droplet pings
    this.sfxInterval = setInterval(() => {
      if (!this.ctx || !this.weatherGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();

      const freq = 1100 + Math.random() * 700;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.09);

      dropGain.gain.setValueAtTime(0.02, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(dropGain);
      dropGain.connect(this.weatherGain);
      osc.start(now);
      osc.stop(now + 0.1);
    }, 420);
  }

  private startSunnySoundscape() {
    if (!this.ctx || !this.weatherGain) return;
    // Gentle meadow breeze + occasional bird chirp
    this.sfxInterval = setInterval(() => {
      if (!this.ctx || !this.weatherGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const birdOsc = this.ctx.createOscillator();
      const birdGain = this.ctx.createGain();

      birdOsc.type = 'sine';
      const baseFreq = 2600 + Math.random() * 400;
      birdOsc.frequency.setValueAtTime(baseFreq, now);
      birdOsc.frequency.exponentialRampToValueAtTime(baseFreq + 350, now + 0.05);
      birdOsc.frequency.exponentialRampToValueAtTime(baseFreq - 150, now + 0.11);

      birdGain.gain.setValueAtTime(0.025, now);
      birdGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      birdOsc.connect(birdGain);
      birdGain.connect(this.weatherGain);
      birdOsc.start(now);
      birdOsc.stop(now + 0.13);
    }, 2800);
  }

  private startBreezeSoundscape() {
    if (!this.ctx || !this.weatherGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(this.weatherGain);
    osc.start();
    this.activeOscillators.push(osc);
  }

  private startNightSoundscape() {
    if (!this.ctx || !this.weatherGain) return;
    // Deep calming 432Hz ambient night resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(216, this.ctx.currentTime); // 432Hz octave sub
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.weatherGain);
    osc.start();
    this.activeOscillators.push(osc);
  }
}

export const weatherAudio = new WeatherAudioEngine();
