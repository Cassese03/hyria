/**
 * Ponte tra lo scroll della pagina (DOM) e la scena 3D.
 * `s` è la posizione lungo il percorso: 0 = prima tappa, 1 = seconda, …
 * La pagina scrive `s`, la camera lo insegue con uno smorzamento.
 */
export interface Track {
  state: { s: number; cam: number };
  subscribe: (fn: () => void) => () => void;
  setTarget: (s: number) => void;
}

/** Un percorso camera guidato dallo scroll: la Home ha il suo, l'archivio storico un altro */
export const createTrack = (): Track => {
  const state = {
    s: 0, // obiettivo calcolato dallo scroll
    cam: 0, // posizione attuale (smorzata) della camera
  };
  const listeners = new Set<() => void>();
  return {
    state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    setTarget: (s) => {
      if (Math.abs(s - state.s) < 1e-5) return;
      state.s = s;
      listeners.forEach((fn) => fn());
    },
  };
};

export const homeTrack = createTrack();
export const arena = homeTrack.state;
export const subscribeArena = homeTrack.subscribe;
export const setArenaTarget = homeTrack.setTarget;

// [x, y, z] in metri: niente three.js qui, così la Home non lo carica all'avvio
export type Vec3 = [number, number, number];
const v = (x: number, y: number, z: number): Vec3 => [x, y, z];

export interface Station {
  label: string;
  pos: Vec3;
  look: Vec3;
  mPos?: Vec3; // inquadratura per schermi verticali
  mLook?: Vec3;
}

// Una tappa per sezione; la galleria ne usa due (panoramica sugli stendardi).
export const STATIONS: Station[] = [
  { label: 'Centrocampo', pos: v(-3, 17.5, 14), look: v(0.6, 0, 0.6), mPos: v(0, 17, 16), mLook: v(0, 0, 4.5) },
  { label: 'Panchina', pos: v(-2.4, 1.55, 10.3), look: v(-8.5, 1.2, -1.4), mPos: v(-2.6, 1.6, 10.3), mLook: v(-10, 1.6, 1.4) },
  { label: 'Lunetta', pos: v(7.4, 1.85, 0.8), look: v(12.4, 3.15, -2.3), mPos: v(7.6, 1.8, 0.2), mLook: v(12.4, 2.55, 0) },
  { label: 'Tabellone', pos: v(0, 5.2, 14.5), look: v(0, 9.6, 0), mPos: v(0, 4.8, 14.5), mLook: v(0, 9.2, 0) },
  { label: 'Tribuna', pos: v(9, 4.6, -2.8), look: v(9, 8.2, -10.5), mPos: v(11.5, 4.4, -3.4), mLook: v(11.5, 8.6, -10.5) },
  { label: 'Tribuna', pos: v(-9, 4.6, -2.8), look: v(-9, 8.2, -10.5), mPos: v(-11.5, 4.4, -3.4), mLook: v(-11.5, 8.6, -10.5) },
  { label: 'Canestro', pos: v(-7.7, 1.75, 3.3), look: v(-12.4, 2.5, 0), mPos: v(-8.3, 1.6, 2.2), mLook: v(-12.4, 2.7, 0) },
];

if (import.meta.env.DEV) (window as unknown as { __arena: typeof arena }).__arena = arena;
