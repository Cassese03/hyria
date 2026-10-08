/**
 * Sintesi audio nativa (Web Audio API), nessun file esterno.
 * L'AudioContext nasce solo dopo il primo gesto dell'utente (policy autoplay dei browser).
 */
export class LockerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.02);
    }
  }

  /** Da chiamare dentro un handler di click/touch. */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(this.ctx.destination);

    // 1s di rumore bianco riutilizzato da clink e swoosh
    const len = this.ctx.sampleRate;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  /** Appendino metallico che scorre sul binario e urta i vicini. */
  clink() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise || this.muted) return;
    const t = ctx.currentTime;

    // scorrimento: rumore passa-banda che scende leggermente
    const slide = ctx.createBufferSource();
    slide.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 3;
    bp.frequency.setValueAtTime(3600, t);
    bp.frequency.exponentialRampToValueAtTime(2000, t + 0.28);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.1, t + 0.04);
    sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    slide.connect(bp).connect(sg).connect(this.master);
    slide.start(t, Math.random() * 0.5, 0.32);

    // urto: parziali inarmonici con decadimento rapido (timbro "metallo")
    const base = 1900 + Math.random() * 500;
    [1, 1.51, 2.76, 4.07].forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = base * ratio;
      const g = ctx.createGain();
      const start = t + 0.12;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.22 / (i + 1.4), start + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.45 - i * 0.07);
      osc.connect(g).connect(this.master!);
      osc.start(start);
      osc.stop(start + 0.5);
    });
  }

  /** Swoosh cinematico: rumore filtrato che sale (zoom in) o scende (zoom out). */
  swoosh(direction: 'in' | 'out') {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise || this.muted) return;
    const t = ctx.currentTime;
    const dur = 0.9;

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    const [from, to] = direction === 'in' ? [260, 3400] : [3000, 220];
    bp.frequency.setValueAtTime(from, t);
    bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + dur * 0.42);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  dispose() {
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.noise = null;
  }
}
