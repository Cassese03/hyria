import { Suspense, use, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { loadImage } from './assets';
import { CameraRig } from './rig';
import type { Station, Track } from './store';
import { DISPLAY_FONT, UI_FONT } from './textures';
import { ArenaWorld } from './world';
import { BANNER_Y, BANNER_Z, bannerX, type HistoryBanner } from '../storia/track';

/* ─── Texture dello stendardo ────────────────────────────────────────────── */

// stesse proporzioni del telo (4.1 × 5 m)
const TW = 656;
const TH = 800;
const ORANGE = '#d96c00';

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();
const loadCover = (src: string) => {
  let p = imageCache.get(src);
  if (!p) {
    p = loadImage(src);
    imageCache.set(src, p);
  }
  return p;
};

const coversKey = new Map<string, Promise<(HTMLImageElement | null)[]>>();
const loadCovers = (srcs: string[]) => {
  const key = srcs.join('|');
  let p = coversKey.get(key);
  if (!p) {
    p = Promise.all(srcs.map(loadCover));
    coversKey.set(key, p);
  }
  return p;
};

const wrap = (ctx: CanvasRenderingContext2D, text: string, max: number, lines: number) => {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= max || !line) line = next;
    else {
      out.push(line);
      line = word;
    }
  }
  if (line) out.push(line);
  if (out.length > lines) {
    out.length = lines;
    out[lines - 1] = `${out[lines - 1].replace(/\s+\S*$/, '')}…`;
  }
  return out;
};

const spaced = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) => {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
};

function createBannerTexture(b: HistoryBanner, img: HTMLImageElement | null) {
  const c = document.createElement('canvas');
  c.width = TW;
  c.height = TH;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;
  const pad = 48;

  // telo bordeaux con una leggera caduta di luce verso il basso
  const g = ctx.createLinearGradient(0, 0, 0, TH);
  g.addColorStop(0, '#6a0505');
  g.addColorStop(1, '#3d0203');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, TW, TH);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(244, 238, 231, 0.7)';
  ctx.font = `800 20px ${UI_FONT}`;
  spaced(ctx, 'HYRIA BASKET · NOLA', pad, 70, 5);
  ctx.fillStyle = ORANGE;
  ctx.font = `800 20px ${UI_FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(b.month.toUpperCase(), TW - pad, 70);
  ctx.textAlign = 'left';

  // foto del capitolo, ritagliata come object-fit: cover
  const px = pad;
  const py = 96;
  const pw = TW - pad * 2;
  const phh = 300;
  if (img) {
    const scale = Math.max(pw / img.width, phh / img.height);
    const sw = pw / scale;
    const sh = phh / scale;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, px, py, pw, phh);
  } else {
    ctx.fillStyle = '#2a0405';
    ctx.fillRect(px, py, pw, phh);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = `700 104px ${DISPLAY_FONT}`;
  ctx.fillText(b.season, pad - 4, 506);

  ctx.fillStyle = ORANGE;
  ctx.fillRect(pad, 534, 56, 5);
  ctx.font = `800 22px ${UI_FONT}`;
  spaced(ctx, b.category.toUpperCase(), pad + 74, 544, 4);

  ctx.fillStyle = '#f4eee7';
  ctx.font = `800 40px ${UI_FONT}`;
  wrap(ctx, b.title.toUpperCase(), TW - pad * 2, 3).forEach((l, i) => ctx.fillText(l, pad, 614 + i * 50));

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ─── Stendardi ──────────────────────────────────────────────────────────── */

const DIM = new THREE.Color('#7d7470');
const FULL = new THREE.Color('#ffffff');

interface BannersProps {
  banners: HistoryBanner[];
  /** percorso della timeline: lo stendardo davanti alla camera si accende */
  track?: Track;
  /** in alternativa, lo stendardo acceso è fisso (pagina del singolo post) */
  active?: number;
}

export function HistoryBanners({ banners, track, active = -1 }: BannersProps) {
  const covers = use(loadCovers(banners.map((b) => b.image)));
  const maps = useMemo(() => banners.map((b, i) => createBannerTexture(b, covers[i])), [banners, covers]);
  useEffect(() => () => maps.forEach((m) => m.dispose()), [maps]);

  const cloth = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const stripe = useRef<(THREE.Mesh | null)[]>([]);
  const n = banners.length;

  // con la timeline la tappa 0 è la panoramica: lo stendardo i è la tappa i + 1
  useFrame(() => {
    const focus = track ? track.state.cam - 1 : active;
    for (let i = 0; i < n; i++) {
      const w = THREE.MathUtils.clamp(1 - Math.abs(focus - i), 0, 1);
      cloth.current[i]?.color.lerpColors(DIM, FULL, w);
      const s = stripe.current[i];
      if (s) s.scale.x = 0.25 + 0.75 * w;
    }
  });

  return (
    <>
      {banners.map((b, i) => (
        <group key={b.key} position={[bannerX(i, n), BANNER_Y, BANNER_Z]}>
          <mesh position={[0, -0.3, 0]}>
            <planeGeometry args={[4.1, 5]} />
            <meshBasicMaterial
              ref={(m) => {
                cloth.current[i] = m;
              }}
              map={maps[i]}
              toneMapped={false}
              color="#7d7470"
            />
          </mesh>
          <mesh
            ref={(m) => {
              stripe.current[i] = m;
            }}
            position={[0, -2.62, 0.01]}
          >
            <planeGeometry args={[4.1, 0.09]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </mesh>
          {[-1.8, 1.8].map((cx) => (
            <mesh key={cx} position={[cx, 7, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 9.6, 5]} />
              <meshBasicMaterial color="#1c1a20" />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

/* ─── Scena della timeline ───────────────────────────────────────────────── */

interface SceneProps {
  banners: HistoryBanner[];
  stations: Station[];
  track: Track;
  mobile: boolean;
  reduced: boolean;
  introAt: number;
  /** false quando la timeline è fuori schermo: si smette di disegnare */
  active: boolean;
  onReady: () => void;
}

export default function HistoryScene({ banners, stations, track, mobile, reduced, introAt, active, onReady }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? 'demand' : 'never'}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 20, 24] }}
    >
      <Suspense fallback={null}>
        <ArenaWorld
          mobile={mobile}
          reduced={reduced}
          tour={false}
          title="Archivio storico"
          banners={<HistoryBanners banners={banners} track={track} />}
          onReady={onReady}
        >
          <CameraRig stations={stations} track={track} reduced={reduced} desktop={!mobile} introAt={introAt} />
        </ArenaWorld>
      </Suspense>
    </Canvas>
  );
}
