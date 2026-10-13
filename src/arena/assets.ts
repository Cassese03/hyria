/** Caricamento degli asset della scena e stato condiviso tra i componenti 3D */

// Foto della galleria: `null` è lo slot del video
const GALLERY = ['/images/1.jpg', '/images/2.jpg', null, '/images/4.jpg', '/images/5.jpg', '/images/6.jpg'];
/* ─── Asset ──────────────────────────────────────────────────────────────── */

interface Assets {
  logo: HTMLImageElement | null;
  photos: (HTMLImageElement | null)[];
}

export const loadImage = (src: string, cors = false) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

let assetsPromise: Promise<Assets> | null = null;
export const loadAssets = () =>
  (assetsPromise ??= (async () => {
    const fonts = Promise.race([
      Promise.all(['900 64px Montserrat', '800 64px Montserrat', '700 64px Arvo'].map((f) => document.fonts.load(f))),
      new Promise((r) => setTimeout(r, 2500)),
    ]).catch(() => undefined);
    const [logo, ...photos] = await Promise.all([
      loadImage('/images/logo-hyria-white.png'),
      ...GALLERY.map((src) => (src ? loadImage(src) : Promise.resolve(null))),
    ]);
    await fonts;
    return { logo, photos };
  })());

/** Stato condiviso del tiro finale (letto da pallone e retina) */
export const shot = { t: -1, armed: true };

export interface Sponsor {
  name: string;
  image: string;
}

const boardCache = new Map<string, Promise<{ name: string; image: HTMLImageElement | null }[]>>();

/** Loghi per i cartelloni: quelli esterni senza CORS diventano il nome scritto */
export const loadBoardItems = (sponsors: Sponsor[]) => {
  const key = sponsors.map((s) => s.image).join('|');
  let p = boardCache.get(key);
  if (!p) {
    p = Promise.all(
      sponsors.map(async (s) => ({
        name: s.name,
        image: await loadImage(s.image, /^https?:/.test(s.image)),
      })),
    );
    boardCache.set(key, p);
  }
  return p;
};
