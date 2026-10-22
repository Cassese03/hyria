import type { HeroShot } from '../arena/shots';
import type { Station, Vec3 } from '../arena/store';
import { categoryLabel, formatMonth } from './api';
import type { Post } from './types';

/**
 * Stendardi dell'archivio: ogni capitolo della timeline è appeso sopra la tribuna
 * opposta, al posto della galleria della Home. Qui solo numeri: niente three.js,
 * così la pagina calcola le tappe senza caricare la scena.
 */
export const MAX_BANNERS = 6;
export const BANNER_GAP = 4.6;
export const BANNER_Y = 9;
export const BANNER_Z = -10.5;

export interface HistoryBanner {
  key: string;
  season: string;
  title: string;
  category: string;
  month: string;
  image: string;
}

/** Post con uno stendardo: i "featured" (o tutti), al massimo MAX_BANNERS, in ordine cronologico */
export const timelinePosts = (posts: Post[]) => {
  const featured = posts.filter((p) => p.featured);
  return (featured.length ? featured : posts).slice(-MAX_BANNERS);
};

export const toBanners = (posts: Post[]): HistoryBanner[] =>
  posts.map((p) => ({
    key: p.id,
    season: p.season,
    title: p.title,
    category: categoryLabel(p.category),
    month: formatMonth(p.date),
    image: p.cover.src,
  }));

export const bannerX = (i: number, n: number) => (i - (n - 1) / 2) * BANNER_GAP;

/** Panoramica di tutta la fila di stendardi (intestazione della pagina) */
export const OVERVIEW: Station = {
  label: 'Archivio',
  pos: [8, 2.6, 6.5],
  look: [-1.5, 7.6, -10.5],
  mPos: [6.5, 2.4, 3.5],
  mLook: [-2.5, 7.2, -10.5],
};

/**
 * Davanti allo stendardo `i`: su schermi larghi lo stendardo sta a destra
 * (il testo è a sinistra), su schermi verticali sta in alto (il testo è in basso).
 */
export const bannerStation = (i: number, n: number, label = ''): Station => {
  const x = bannerX(i, n);
  const v = (dx: number, y: number, z: number): Vec3 => [x + dx, y, z];
  return {
    label,
    pos: v(-2.4, 4.3, -1.6),
    look: v(-2.4, 7.9, -10.5),
    mPos: v(0, 3.2, 0),
    mLook: v(0, 6.6, -10.5),
  };
};

export const historyStations = (posts: Post[]): Station[] => [
  OVERVIEW,
  ...posts.map((p, i) => bannerStation(i, posts.length, p.season)),
];

/** Inquadratura fissa per l'intestazione del singolo post */
export const bannerShot = (i: number, n: number): HeroShot => {
  const { pos, look, mPos, mLook } = bannerStation(i, n);
  return { pos, look, mPos, mLook };
};
