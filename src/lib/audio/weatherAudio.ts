/**
 * Synthesizes cozy, soothing procedural ambient soundscapes using the Web Audio API.
 * 100% zero external file dependencies - pure browser audio synthesis.
 */

class WeatherAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentMode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora' = 'sunny';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private intervalId: any = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMode(mode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora') {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stop();
      this.play(mode);
    }
  }

  public play(mode: 'sunny' | 'gentle_rain' | 'breezy_mist' | 'twilight_aurora') {
    this.init();
    if (!this.ctx) return;
    this.stop();

    this.currentMode = mode;
    this.isPlaying = true;

    // Master volume node
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (mode === 'gentle_rain') {
      this.startRainSound();
    } else if (mode === 'sunny') {
      this.startSunnySound();
    } else if (mode === 'breezy_mist') {
      this.startBreezeSound();
    } else {
      this.startNightSound();
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop?.();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }
    this.isPlaying = false;
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

  // --- Rain generator (Pink noise + lowpass filter + periodic soft droplet pings) ---
  private startRainSound() {
    if (!this.ctx || !this.gainNode) return;
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
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft garden rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // Soft occasional raindrop ping
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      const freq = 1200 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(dropGain);
      dropGain.connect(this.gainNode);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    }, 450);
  }

  // --- Sunny ambiance (Gentle warm breeze tone + harmonic warm pad) ---
  private startSunnySound() {
    if (!this.ctx || !this.gainNode) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, this.ctx.currentTime); // A3
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(329.63, this.ctx.currentTime); // E4

    subGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    osc1.connect(subGain);
    osc2.connect(subGain);
    subGain.connect(this.gainNode);

    osc1.start();
    osc2.start();
    this.noiseNode = osc1;

    // Periodic gentle bird chirp harmonic
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      const birdOsc = this.ctx.createOscillator();
      const birdGain = this.ctx.createGain();
      birdOsc.type = 'sine';
      const baseFreq = 2400 + Math.random() * 400;
      birdOsc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      birdOsc.frequency.exponentialRampToValueAtTime(baseFreq + 300, this.ctx.currentTime + 0.06);
      birdOsc.frequency.exponentialRampToValueAtTime(baseFreq - 200, this.ctx.currentTime + 0.12);

      birdGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      birdGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.13);

      birdOsc.connect(birdGain);
      birdGain.connect(this.gainNode);
      birdOsc.start();
      birdOsc.stop(this.ctx.currentTime + 0.14);
    }, 3200);
  }

  // --- Breezy mist ambiance ---
  private startBreezeSound() {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.connect(filter);
    filter.connect(this.gainNode);
    osc.start();
    this.noiseNode = osc;
  }

  // --- Night & Twilight Aurora ambiance (Deep calming 432Hz ambient chord) ---
  private startNightSound() {
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(144, this.ctx.currentTime); // D3
    padGain.gain.setValueAtTime(0.035, this.ctx.currentTime);

    osc.connect(padGain);
    padGain.connect(this.gainNode);
    osc.start();
    this.noiseNode = osc;
  }
}

export const weatherAudio = new WeatherAudioEngine();
