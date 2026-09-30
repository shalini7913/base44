/**
 * =============================================================================
 * Emergency Siren Service (Web Audio API)
 * =============================================================================
 * High-fidelity, self-contained emergency siren audio synthesizer.
 * - Requires NO external audio files or network requests.
 * - Detects browser autoplay policy restrictions & exposes unlock handlers.
 * - Automatically shuts off after a configurable safety duration (default 15s)
 *   to prevent endless looping.
 * - Fully stops on demand when user clicks "Stop Siren".
 */

class EmergencySirenService {
  constructor() {
    this.audioCtx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.gainNode = null;
    this.modulator = null;
    this.isPlaying = false;
    this.isAudioBlocked = false;
    this.autoStopTimer = null;
    this.listeners = new Set();
    this.maxDurationMs = 15000; // 15 seconds auto-shutoff safety limit
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener({
          isPlaying: this.isPlaying,
          isAudioBlocked: this.isAudioBlocked,
        });
      } catch (err) {
        console.error('Siren listener error:', err);
      }
    }
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    return this.audioCtx;
  }

  /**
   * Unlock AudioContext on user interaction if blocked by browser autoplay policy
   */
  async unlockAudio() {
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        this.isAudioBlocked = false;
        this.notify();
        return true;
      } catch (err) {
        console.warn('Failed to unlock audio context:', err);
        this.isAudioBlocked = true;
        this.notify();
        return false;
      }
    }
    this.isAudioBlocked = false;
    this.notify();
    return true;
  }

  /**
   * Triggers the emergency siren tone.
   * Modulates between 650 Hz and 950 Hz with an emergency wail rhythm.
   */
  async startSiren(durationMs = this.maxDurationMs) {
    if (this.isPlaying) return; // Already active

    const ctx = this.getAudioContext();
    if (!ctx) {
      console.warn('Web Audio API not supported in this environment');
      return;
    }

    // Check for browser autoplay suspension
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        this.isAudioBlocked = true;
        this.notify();
        console.warn('Emergency siren waiting for user audio unlock:', e);
        return;
      }
    }

    if (ctx.state === 'suspended') {
      this.isAudioBlocked = true;
      this.notify();
      return;
    }

    try {
      this.isAudioBlocked = false;

      // Master Gain for smooth fade-in/out and volume control
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.3); // Safe, audible 35% volume
      this.gainNode.connect(ctx.destination);

      // Primary Siren Oscillator (Carrier)
      this.osc1 = ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(750, ctx.currentTime);

      // Secondary Harmonizing Oscillator for fullness
      this.osc2 = ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(754, ctx.currentTime);

      // Low Frequency Oscillator (LFO) for the authentic European/Disaster emergency wail sweep
      this.modulator = ctx.createOscillator();
      this.modulator.type = 'sine';
      this.modulator.frequency.setValueAtTime(0.65, ctx.currentTime); // ~1.5 second wail cycle

      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(180, ctx.currentTime); // Swings +/- 180Hz (570Hz to 930Hz)

      this.modulator.connect(modGain);
      modGain.connect(this.osc1.frequency);
      modGain.connect(this.osc2.frequency);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);

      this.osc1.start();
      this.osc2.start();
      this.modulator.start();

      this.isPlaying = true;
      this.notify();

      // Auto-stop after safety duration to prevent indefinite noise
      if (this.autoStopTimer) clearTimeout(this.autoStopTimer);
      if (durationMs > 0) {
        this.autoStopTimer = setTimeout(() => {
          this.stopSiren();
        }, durationMs);
      }
    } catch (err) {
      console.error('Failed to start emergency siren synthesis:', err);
      this.isPlaying = false;
      this.notify();
    }
  }

  /**
   * Stops the emergency siren immediately with a gentle click-free decay.
   */
  stopSiren() {
    if (!this.isPlaying && !this.gainNode) return;

    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }

    try {
      const ctx = this.audioCtx;
      if (this.gainNode && ctx) {
        // Quick 100ms fadeout to eliminate audible popping
        this.gainNode.gain.cancelScheduledValues(ctx.currentTime);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      }

      setTimeout(() => {
        try {
          if (this.osc1) { this.osc1.stop(); this.osc1.disconnect(); this.osc1 = null; }
          if (this.osc2) { this.osc2.stop(); this.osc2.disconnect(); this.osc2 = null; }
          if (this.modulator) { this.modulator.stop(); this.modulator.disconnect(); this.modulator = null; }
          if (this.gainNode) { this.gainNode.disconnect(); this.gainNode = null; }
        } catch (_) {}
      }, 120);
    } catch (err) {
      console.warn('Error during siren teardown:', err);
    }

    this.isPlaying = false;
    this.notify();
  }
}

export const sirenService = new EmergencySirenService();
export default sirenService;
