import type { Vec3 } from './store';

/** Inquadratura fissa dell'intestazione di una pagina interna */
export interface HeroShot {
  pos: Vec3;
  look: Vec3;
  mPos?: Vec3; // schermi verticali
  mLook?: Vec3;
}

export const SHOTS = {
  // dentro il campo, verso i cartelloni LED del lato opposto
  sponsor: { pos: [4, 1.5, -1.5], look: [-3, 0.9, -10.2], mPos: [1.5, 1.4, -3.5], mLook: [-1.5, -0.2, -10.2] },
  // dalla tribuna, oltre il tavolo degli ufficiali, verso lo stemma a centrocampo
  about: { pos: [2.2, 3.6, 12.6], look: [-1.2, 0.2, 0], mPos: [0.6, 2.9, 13.2], mLook: [0, -0.6, 0] },
  // ad altezza di bambino, davanti al canestro minibasket
  minibasket: { pos: [-5.2, 1.1, 1.6], look: [-9, 1.9, -4.2], mPos: [-5.6, 1.1, 2.4], mLook: [-6.5, 1.0, -4.2] },
  // di tre quarti sotto il tabellone, che mostra la posizione in classifica
  classifica: { pos: [-7, 2, 7.5], look: [-1.5, 9.6, 0], mPos: [-3, 2, 9.5], mLook: [-0.5, 8.8, 0] },
  // dalla tribuna sul tavolo degli ufficiali, con la mail sulla striscia LED
  contatti: { pos: [-5.5, 2.6, 13], look: [-1.5, 0.5, 6.5], mPos: [1.6, 2.6, 12.6], mLook: [-0.5, -0.4, 5] },
} satisfies Record<string, HeroShot>;

export type ShotName = keyof typeof SHOTS;

export const canUseWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

export const saveData = () =>
  !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

export const isMobileDevice = () => window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
