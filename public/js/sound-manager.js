/**
 * OMKARVERSE Dual-Layer Audio Engine (Client Runtime)
 * 
 * Layer 1 (Atmosphere): Continuous high-tech ambient telemetry frequency/hum (~35% volume)
 * Layer 2 (Rhythm & Sub-Bass): Skrillex, Fred again.. & Flowdan - "Rumble (Instrumental)" (~55% volume)
 * 
 * Looping & Fade Mechanics:
 * - Simultaneous endless looping with zero pop, zero gap (synthesized telemetry + crossfade buffer scheduling)
 * - On unmute (sound ●): Smooth 1.2s audio fade-in
 * - On mute (sound ○): Smooth 0.8s audio fade-out
 * - Hooked to top-right [ sound ○ ] toggle button
 */

(function () {
  'use strict';

  class DualLayerAudioEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.ambientGain = null;
      this.rumbleGain = null;

      // Layer 1: Continuous Atmospheric Telemetry Nodes
      this.oscNodes = [];
      this.lfoNodes = [];
      this.noiseNode = null;
      this.filterNode = null;

      // Layer 2: Rumble AudioBuffer & Overlapping Seamless Looper
      this.rumbleBuffer = null;
      this.activeSources = new Set();
      this.loopTimer = null;
      this.isBufferLoading = false;

      // Settings
      this.ambientVolume = 0.35; // ~35% volume
      this.rumbleVolume = 0.55;  // ~55% volume
      this.fadeInDuration = 1.2;  // 1.2s fade-in
      this.fadeOutDuration = 0.8; // 0.8s fade-out
      
      const isTiger = typeof window !== 'undefined' && window.location.pathname.startsWith('/tiger');
      this.audioPath = isTiger ? '/audio/stellar_fission.m4a' : '/audio/rumble-instrumental.mp3';

      this.isMuted = true;
      this.isInitialized = false;
    }

    async init() {
      if (this.isInitialized && this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();

        // Master Gain (global mute/unmute fader)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Layer 1: Ambient Gain Node
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);

        // Layer 2: Rumble Gain Node
        this.rumbleGain = this.ctx.createGain();
        this.rumbleGain.gain.setValueAtTime(this.rumbleVolume, this.ctx.currentTime);
        this.rumbleGain.connect(this.masterGain);

        // Build continuous high-tech telemetry synthesizer
        this.setupAtmosphereSynthesizer();

        // Fetch & decode Rumble (Instrumental)
        this.loadRumbleBuffer();

        this.isInitialized = true;
      } catch (err) {
        console.warn('[Omkarverse Audio] Web Audio deferred:', err);
      }
    }

    /**
     * Layer 1: Continuous High-Tech Ambient Telemetry Frequency / Hum
     * Sine & triangle foundation + resonant bandpass filter telemetry modulation
     */
    setupAtmosphereSynthesizer() {
      if (!this.ctx || !this.ambientGain) return;

      // 1. Fundamental sub-drone (55Hz G1 deep earth/aerospace resonance)
      const oscSub = this.ctx.createOscillator();
      const gainSub = this.ctx.createGain();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(55.0, this.ctx.currentTime);
      gainSub.gain.setValueAtTime(0.40, this.ctx.currentTime);
      oscSub.connect(gainSub).connect(this.ambientGain);
      oscSub.start();
      this.oscNodes.push(oscSub);

      // 2. Harmonic warm overtone (110Hz)
      const oscHarmonic1 = this.ctx.createOscillator();
      const gainHarmonic1 = this.ctx.createGain();
      oscHarmonic1.type = 'sine';
      oscHarmonic1.frequency.setValueAtTime(110.0, this.ctx.currentTime);
      gainHarmonic1.gain.setValueAtTime(0.32, this.ctx.currentTime);
      oscHarmonic1.connect(gainHarmonic1).connect(this.ambientGain);
      oscHarmonic1.start();
      this.oscNodes.push(oscHarmonic1);

      // 3. Body warmth (165Hz fifth)
      const oscHarmonic2 = this.ctx.createOscillator();
      const gainHarmonic2 = this.ctx.createGain();
      oscHarmonic2.type = 'triangle';
      oscHarmonic2.frequency.setValueAtTime(165.0, this.ctx.currentTime);
      gainHarmonic2.gain.setValueAtTime(0.16, this.ctx.currentTime);
      oscHarmonic2.connect(gainHarmonic2).connect(this.ambientGain);
      oscHarmonic2.start();
      this.oscNodes.push(oscHarmonic2);

      // 4. Detuned organic beating overtone (220Hz with slow 0.08Hz LFO)
      const oscBeating = this.ctx.createOscillator();
      const gainBeating = this.ctx.createGain();
      oscBeating.type = 'sine';
      oscBeating.frequency.setValueAtTime(220.0, this.ctx.currentTime);
      gainBeating.gain.setValueAtTime(0.10, this.ctx.currentTime);

      const lfoDetune = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfoDetune.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(2.4, this.ctx.currentTime);
      lfoDetune.connect(lfoGain).connect(oscBeating.frequency);
      lfoDetune.start();
      this.lfoNodes.push(lfoDetune);

      oscBeating.connect(gainBeating).connect(this.ambientGain);
      oscBeating.start();
      this.oscNodes.push(oscBeating);

      // 5. High-Tech Telemetry Air (Bandpass Filtered Cosmic Noise)
      try {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
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

        const filterLfo = this.ctx.createOscillator();
        const filterLfoGain = this.ctx.createGain();
        filterLfo.frequency.setValueAtTime(0.05, this.ctx.currentTime);
        filterLfoGain.gain.setValueAtTime(250, this.ctx.currentTime);
        filterLfo.connect(filterLfoGain).connect(this.filterNode.frequency);
        filterLfo.start();
        this.lfoNodes.push(filterLfo);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.14, this.ctx.currentTime);

        this.noiseNode.connect(this.filterNode).connect(noiseGain).connect(this.ambientGain);
        this.noiseNode.start();
      } catch (e) {
        console.warn('[Omkarverse Audio] Noise atmosphere note:', e);
      }
    }

    /**
     * Load & decode Rumble (Instrumental)
     */
    async loadRumbleBuffer() {
      if (this.rumbleBuffer || this.isBufferLoading || !this.ctx) return;
      this.isBufferLoading = true;

      try {
        const res = await fetch(this.audioPath);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ab = await res.arrayBuffer();
        this.rumbleBuffer = await this.ctx.decodeAudioData(ab);
        this.isBufferLoading = false;

        // If unmuted while audio finished downloading, launch loop
        if (!this.isMuted) {
          this.startRumbleLoop();
        }
      } catch (err) {
        console.warn('[Omkarverse Audio] Rumble load failed:', err);
        this.isBufferLoading = false;
      }
    }

    /**
     * Layer 2: Seamless, Pop-free Crossfade Looping Scheduler
     */
    startRumbleLoop() {
      if (!this.ctx || !this.rumbleBuffer || !this.rumbleGain) return;
      this.stopRumbleLoop();

      const duration = this.rumbleBuffer.duration;
      const crossfade = 1.5; // 1.5s seamless crossfade
      const scheduleInterval = Math.max(duration - crossfade, 5);

      const scheduleCycle = (startTime) => {
        if (!this.ctx || !this.rumbleBuffer || !this.rumbleGain || this.isMuted) return;

        const source = this.ctx.createBufferSource();
        const nodeGain = this.ctx.createGain();
        source.buffer = this.rumbleBuffer;

        // Envelope: 1.5s equal power crossfade at boundaries
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

        const nextStartTime = startTime + scheduleInterval;
        const delayMs = Math.max((nextStartTime - this.ctx.currentTime - 0.2) * 1000, 100);
        this.loopTimer = window.setTimeout(() => {
          scheduleCycle(nextStartTime);
        }, delayMs);
      };

      scheduleCycle(this.ctx.currentTime + 0.05);
    }

    stopRumbleLoop() {
      if (this.loopTimer) {
        clearTimeout(this.loopTimer);
        this.loopTimer = null;
      }
      this.activeSources.forEach((src) => {
        try {
          src.stop();
        } catch (_) {}
      });
      this.activeSources.clear();
    }

    /**
     * Unmute: 1.2s smooth audio fade-in
     */
    async unmute() {
      await this.init();
      if (!this.ctx || !this.masterGain) return;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.isMuted = false;

      if (this.rumbleBuffer && this.activeSources.size === 0) {
        this.startRumbleLoop();
      }

      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(1.0, now + this.fadeInDuration);
    }

    /**
     * Mute: 0.8s smooth audio fade-out
     */
    mute() {
      if (!this.ctx || !this.masterGain) return;

      this.isMuted = true;

      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + this.fadeOutDuration);

      setTimeout(() => {
        if (this.isMuted) {
          this.stopRumbleLoop();
        }
      }, this.fadeOutDuration * 1000 + 50);
    }

    toggle() {
      if (this.isMuted) {
        this.unmute();
        return false;
      } else {
        this.mute();
        return true;
      }
    }

    /**
     * Stellar Fission Audio Cue for Field Dossier
     */
    async playStellarFissionCue() {
      await this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Ensure audio is unmuted so cue and layers ring out
      this.unmute();

      try {
        const now = this.ctx.currentTime;
        const fissionGain = this.ctx.createGain();
        fissionGain.gain.setValueAtTime(0.001, now);
        fissionGain.gain.linearRampToValueAtTime(0.85, now + 0.04);
        fissionGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        fissionGain.connect(this.masterGain);

        // Sub-bass sweep
        const oscSub = this.ctx.createOscillator();
        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(140, now);
        oscSub.frequency.exponentialRampToValueAtTime(35, now + 1.2);

        // Harmonic resonance sweep
        const oscHarm = this.ctx.createOscillator();
        oscHarm.type = 'sawtooth';
        oscHarm.frequency.setValueAtTime(680, now);
        oscHarm.frequency.exponentialRampToValueAtTime(80, now + 0.9);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 5.5;
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(90, now + 1.1);

        oscSub.connect(fissionGain);
        oscHarm.connect(filter);
        filter.connect(fissionGain);

        oscSub.start(now);
        oscHarm.start(now);
        oscSub.stop(now + 1.9);
        oscHarm.stop(now + 1.9);
      } catch (err) {
        console.warn('Stellar fission audio error:', err);
      }
    }
  }

  // Create singleton instance
  const audio = new DualLayerAudioEngine();
  window.omkarverseAudio = audio;

  // Hook to the top-right [ sound ○ ] toggle button
  function bindSoundButton() {
    const sndBtn = document.getElementById('snd');
    if (!sndBtn) return;

    function updateButtonUI(isActive) {
      sndBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      sndBtn.textContent = isActive ? 'sound ●' : 'sound ○';
      try {
        localStorage.setItem('ins.sound', isActive ? '1' : '0');
      } catch (e) {}
    }

    function syncState() {
      const isPressed = sndBtn.getAttribute('aria-pressed') === 'true' || sndBtn.textContent.includes('●');
      if (isPressed && audio.isMuted) {
        audio.unmute();
      } else if (!isPressed && !audio.isMuted) {
        audio.mute();
      }
    }

    // Observe attribute changes on #snd
    const observer = new MutationObserver(() => {
      syncState();
    });
    observer.observe(sndBtn, { attributes: true, attributeFilter: ['aria-pressed'], childList: true, characterData: true });

    // Handle clicks smoothly on all pages
    sndBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyActive = sndBtn.getAttribute('aria-pressed') === 'true' || sndBtn.textContent.includes('●');
      const nextActive = !isCurrentlyActive;
      updateButtonUI(nextActive);
      if (nextActive) {
        audio.unmute();
      } else {
        audio.mute();
      }
    });

    // Check initial state from localStorage or button attribute
    const savedState = localStorage.getItem('ins.sound') || localStorage.getItem('insert.sound');
    if (savedState === '1' || sndBtn.getAttribute('aria-pressed') === 'true') {
      updateButtonUI(true);
      const unlockAudio = () => {
        audio.unmute();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindSoundButton);
  } else {
    bindSoundButton();
  }
})();
