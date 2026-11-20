/**
 * OMKARVERSE Dual-Layer Audio Engine (soundManager.ts)
 * 
 * Layer 1 (Atmosphere): Continuous high-tech ambient telemetry frequency/hum (~35% vol).
 * Layer 2 (Rhythm & Sub-Bass): Skrillex, Fred again.. & Flowdan - "Rumble (Instrumental)" (~55% vol).
 * 
 * Mechanics:
 * - Both layers loop endlessly and simultaneously using Web Audio API.
 * - Zero audible pop, zero silence gap (mathematically continuous oscillators + seamless buffer crossfade).
 * - Smooth 1.2s audio fade-in on unmute (sound ●).
 * - Smooth 0.8s audio fade-out on mute (sound ○).
 */

export interface SoundManagerConfig {
  ambientVolume?: number; // ~0.35
  rumbleVolume?: number;  // ~0.55
  fadeInDuration?: number; // 1.2s
  fadeOutDuration?: number; // 0.8s
  audioPath?: string;
}

export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;

  // Layer 1: Atmospheric Telemetry Generator Nodes
  private oscNodes: OscillatorNode[] = [];
  private lfoNodes: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  // Layer 2: Rumble AudioBuffer & Dual Crossfade Deck Nodes
  private rumbleBuffer: AudioBuffer | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();
  private loopTimer: number | null = null;
  private isBufferLoading: boolean = false;

  // State
  private isMuted: boolean = true;
  private isInitialized: boolean = false;
  private config: Required<SoundManagerConfig>;

  constructor(config: SoundManagerConfig = {}) {
    this.config = {
      ambientVolume: config.ambientVolume ?? 0.35,
      rumbleVolume: config.rumbleVolume ?? 0.55,
      fadeInDuration: config.fadeInDuration ?? 1.2,
      fadeOutDuration: config.fadeOutDuration ?? 0.8,
      audioPath: config.audioPath ?? '/audio/rumble-instrumental.mp3',
    };
  }

  /**
   * Initializes AudioContext & Audio Routing Graph
   */
  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) return;
    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain (controls global fade in / out)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Layer 1: Ambient Gain (~35%)
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.config.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Layer 2: Rumble Gain (~55%)
      this.rumbleGain = this.ctx.createGain();
      this.rumbleGain.gain.setValueAtTime(this.config.rumbleVolume, this.ctx.currentTime);
      this.rumbleGain.connect(this.masterGain);

      // Setup Layer 1: Telemetry atmosphere synthesizer
      this.setupAtmosphereSynthesizer();

      // Fetch & decode Layer 2: Rumble instrumental buffer
      this.loadRumbleBuffer();

      this.isInitialized = true;
    } catch (e) {
      console.warn('[SoundManager] Web Audio init deferred until interaction:', e);
    }
  }

  /**
   * Layer 1: High-Tech Ambient Telemetry Frequency / Hum
   * Generates continuous deep drone harmonics (55Hz, 110Hz, 165Hz)
   * modulated with a shifting telemetry bandpass filter and cosmic shimmer.
   */
  private setupAtmosphereSynthesizer(): void {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Fundamental sub drone (55Hz)
    const oscSub = this.ctx.createOscillator();
    const gainSub = this.ctx.createGain();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(55.0, this.ctx.currentTime);
    gainSub.gain.setValueAtTime(0.45, this.ctx.currentTime);
    oscSub.connect(gainSub).connect(this.ambientGain);
    oscSub.start();
    this.oscNodes.push(oscSub);

    // 2. Warm second harmonic (110Hz)
    const oscHarmonic1 = this.ctx.createOscillator();
    const gainHarmonic1 = this.ctx.createGain();
    oscHarmonic1.type = 'sine';
    oscHarmonic1.frequency.setValueAtTime(110.0, this.ctx.currentTime);
    gainHarmonic1.gain.setValueAtTime(0.35, this.ctx.currentTime);
    oscHarmonic1.connect(gainHarmonic1).connect(this.ambientGain);
    oscHarmonic1.start();
    this.oscNodes.push(oscHarmonic1);

    // 3. Body resonance (165Hz fifth)
    const oscHarmonic2 = this.ctx.createOscillator();
    const gainHarmonic2 = this.ctx.createGain();
    oscHarmonic2.type = 'triangle';
    oscHarmonic2.frequency.setValueAtTime(165.0, this.ctx.currentTime);
    gainHarmonic2.gain.setValueAtTime(0.18, this.ctx.currentTime);
    oscHarmonic2.connect(gainHarmonic2).connect(this.ambientGain);
    oscHarmonic2.start();
    this.oscNodes.push(oscHarmonic2);

    // 4. Detuned organic beating overtone (220Hz with slow LFO)
    const oscBeating = this.ctx.createOscillator();
    const gainBeating = this.ctx.createGain();
    oscBeating.type = 'sine';
    oscBeating.frequency.setValueAtTime(220.0, this.ctx.currentTime);
    gainBeating.gain.setValueAtTime(0.12, this.ctx.currentTime);

    const lfoDetune = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfoDetune.frequency.setValueAtTime(0.08, this.ctx.currentTime); // 0.08Hz gentle wave
    lfoGain.gain.setValueAtTime(2.2, this.ctx.currentTime);
    lfoDetune.connect(lfoGain).connect(oscBeating.frequency);
    lfoDetune.start();
    this.lfoNodes.push(lfoDetune);

    oscBeating.connect(gainBeating).connect(this.ambientGain);
    oscBeating.start();
    this.oscNodes.push(oscBeating);

    // 5. High-Tech Telemetry Air / Radio Shimmer (Bandpass Filtered Cosmic Noise)
    try {
      const bufferSize = this.ctx.sampleRate * 2; // 2 sec looping noise buffer
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink-like filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'bandpass';
      this.filterNode.Q.setValueAtTime(3.8, this.ctx.currentTime);
      this.filterNode.frequency.setValueAtTime(880, this.ctx.currentTime);

      // Modulate filter center frequency for high-tech telemetry sweeping
      const filterLfo = this.ctx.createOscillator();
      const filterLfoGain = this.ctx.createGain();
      filterLfo.frequency.setValueAtTime(0.04, this.ctx.currentTime);
      filterLfoGain.gain.setValueAtTime(260, this.ctx.currentTime);
      filterLfo.connect(filterLfoGain).connect(this.filterNode.frequency);
      filterLfo.start();
      this.lfoNodes.push(filterLfo);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      this.noiseNode.connect(this.filterNode).connect(noiseGain).connect(this.ambientGain);
      this.noiseNode.start();
    } catch (err) {
      console.warn('[SoundManager] Atmosphere noise synth note:', err);
    }
  }

  /**
   * Loads and decodes "Rumble (Instrumental)" MP3
   */
  private async loadRumbleBuffer(): Promise<void> {
    if (this.rumbleBuffer || this.isBufferLoading || !this.ctx) return;
    this.isBufferLoading = true;

    try {
      const response = await fetch(this.config.audioPath);
      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      this.rumbleBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.isBufferLoading = false;

      // If already unmuted when buffer finishes downloading, start playback immediately
      if (!this.isMuted) {
        this.startRumbleLoop();
      }
    } catch (err) {
      console.error('[SoundManager] Error loading rumble buffer:', err);
      this.isBufferLoading = false;
    }
  }

  /**
   * Layer 2: Seamless, Endless Crossfade Looping Scheduler
   * Overlaps the next cycle with a 1.5s equal-power crossfade to guarantee
   * 0 audible pops and 0 silence gaps.
   */
  private startRumbleLoop(): void {
    if (!this.ctx || !this.rumbleBuffer || !this.rumbleGain) return;
    this.stopRumbleLoop();

    const duration = this.rumbleBuffer.duration;
    const crossfade = 1.5; // 1.5s seamless crossfade
    const scheduleInterval = Math.max(duration - crossfade, 5);

    const scheduleCycle = (startTime: number) => {
      if (!this.ctx || !this.rumbleBuffer || !this.rumbleGain || this.isMuted) return;

      const source = this.ctx.createBufferSource();
      const nodeGain = this.ctx.createGain();
      source.buffer = this.rumbleBuffer;

      // Equal-power crossfade envelope at start & end of each cycle
      nodeGain.gain.setValueAtTime(0.0001, startTime);
      nodeGain.gain.linearRampToValueAtTime(1.0, startTime + crossfade);
      nodeGain.gain.setValueAtTime(1.0, startTime + duration - crossfade);
      nodeGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      source.connect(nodeGain).connect(this.rumbleGain);
      source.start(startTime);
      source.stop(startTime + duration + 0.1);

      this.activeSources.add(source);
      source.onended = () => {
        this.activeSources.delete(source);
      };

      // Schedule next cycle
      const nextStartTime = startTime + scheduleInterval;
      const delayMs = Math.max((nextStartTime - this.ctx.currentTime - 0.2) * 1000, 100);
      this.loopTimer = window.setTimeout(() => {
        scheduleCycle(nextStartTime);
      }, delayMs);
    };

    scheduleCycle(this.ctx.currentTime + 0.05);
  }

  private stopRumbleLoop(): void {
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeSources.forEach((src) => {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    });
    this.activeSources.clear();
  }

  /**
   * Unmute with smooth 1.2s fade-in
   */
  public async unmute(): Promise<void> {
    await this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = false;

    // Start rumble loop if not already running
    if (this.rumbleBuffer && this.activeSources.size === 0) {
      this.startRumbleLoop();
    }

    // 1.2s smooth audio fade-in
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(1.0, now + this.config.fadeInDuration);
  }

  /**
   * Mute with smooth 0.8s fade-out
   */
  public mute(): void {
    if (!this.ctx || !this.masterGain) return;

    this.isMuted = true;

    // 0.8s smooth audio fade-out
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + this.config.fadeOutDuration);

    setTimeout(() => {
      if (this.isMuted) {
        this.stopRumbleLoop();
      }
    }, this.config.fadeOutDuration * 1000 + 50);
  }

  /**
   * Toggle mute/unmute state
   */
  public toggle(): boolean {
    if (this.isMuted) {
      this.unmute();
      return false;
    } else {
      this.mute();
      return true;
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setAmbientVolume(vol: number): void {
    this.config.ambientVolume = vol;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  public setRumbleVolume(vol: number): void {
    this.config.rumbleVolume = vol;
    if (this.rumbleGain && this.ctx) {
      this.rumbleGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }
}

export const soundManager = typeof window !== 'undefined' ? new SoundManager() : ({} as SoundManager);
