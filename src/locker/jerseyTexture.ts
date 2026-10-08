import * as THREE from 'three';
import type { LockerPlayer } from './roster';

/**
 * Texture della canotta: un solo canvas con due pannelli affiancati
 * (fronte a sinistra, retro a destra). Ogni pannello è la proiezione ortogonale
 * della maglia: s ∈ [-1, 1] da sinistra a destra, t ∈ [0, 1] dall'orlo alla spalla.
 * La stessa convenzione (s, t) è usata da jerseyGeometry.ts.
 */

/** Lettering college (HYRIA, numeri, NOLANI) e sans per il cognome, come da bozzetto divisa. */
export const FONT_VARSITY = '"Graduate", "Rockwell Extra Bold", Rockwell, Georgia, serif';
export const FONT_NAME = '"Montserrat", "Arial", sans-serif';

/** Dimensioni canvas a risoluzione piena (2K). I tier più bassi scalano linearmente. */
export const TEX_W = 2048;
export const TEX_H = 1536;

export interface KitOptions {
  /** Grafica/pattern societario a tutta maglia. */
  graphic: HTMLImageElement | null;
  /** Quanto la grafica si fonde sul tessuto base, 0–1. */
  graphicBlend: number;
  /** Stemma sul petto; `null` = stemma ufficiale Hyria. */
  logo: HTMLImageElement | null;
  /** Logo sponsor al centro del fronte; `null` = archi gialli disegnati. */
  sponsor: HTMLImageElement | null;
}

export const DEFAULT_KIT: KitOptions = { graphic: null, graphicBlend: 0.6, logo: null, sponsor: null };

const COLORS = {
  fabric: '#560a10',
  fabricLight: '#650d14',
  fabricDark: '#3a0509',
  black: '#120a0b',
  gold: '#c9a46a',
  goldLight: '#dcbc85',
  white: '#f7f3ec',
  sponsor: '#ffbc0d',
};

type Pt = [number, number];

function buildPaths(ox: number, S: number, back: boolean) {
  const PW = (TEX_W / 2) * S;
  const PH = TEX_H * S;
  const p = (s: number, t: number): Pt => [ox + ((s + 1) / 2) * PW, (1 - t) * PH];

  const top = 0.992;
  const neckY = back ? 0.935 : 0.82;
  const neckInner = back ? 0.2 : 0.22;

  const sil = new Path2D();
  const trim = new Path2D();
  const hem = new Path2D();

  const bez = (path: Path2D, c1: Pt, c2: Pt, to: Pt) =>
    path.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], to[0], to[1]);

  // orlo (leggermente curvo, più basso al centro)
  sil.moveTo(...p(-1, 0.05));
  bez(sil, p(-0.55, -0.004), p(0.55, -0.004), p(1, 0.05));
  hem.moveTo(...p(-1, 0.05));
  bez(hem, p(-0.55, -0.004), p(0.55, -0.004), p(1, 0.05));

  // fianco destro fino al sottoascella
  sil.lineTo(...p(1, 0.62));

  // giromanica destro
  const a1c1 = p(0.97, 0.72), a1c2 = p(0.78, 0.73), a1to = p(0.74, 0.84);
  const a2c1 = p(0.7, 0.93), a2c2 = p(0.8, 0.985), a2to = p(0.93, top);
  bez(sil, a1c1, a1c2, a1to);
  bez(sil, a2c1, a2c2, a2to);
  trim.moveTo(...p(1, 0.62));
  bez(trim, a1c1, a1c2, a1to);
  bez(trim, a2c1, a2c2, a2to);

  // spalla destra → collo
  sil.lineTo(...p(0.4, top));

  // scollo
  const n1c1 = p(0.4, neckY + 0.075), n1c2 = p(neckInner, neckY), n1to = p(0, neckY);
  const n2c1 = p(-neckInner, neckY), n2c2 = p(-0.4, neckY + 0.075), n2to = p(-0.4, top);
  bez(sil, n1c1, n1c2, n1to);
  bez(sil, n2c1, n2c2, n2to);
  trim.moveTo(...p(0.4, top));
  bez(trim, n1c1, n1c2, n1to);
  bez(trim, n2c1, n2c2, n2to);

  // spalla sinistra → giromanica sinistro → fianco sinistro
  sil.lineTo(...p(-0.93, top));
  const l1c1 = p(-0.8, 0.985), l1c2 = p(-0.7, 0.93), l1to = p(-0.74, 0.84);
  const l2c1 = p(-0.78, 0.73), l2c2 = p(-0.97, 0.72), l2to = p(-1, 0.62);
  bez(sil, l1c1, l1c2, l1to);
  bez(sil, l2c1, l2c2, l2to);
  trim.moveTo(...p(-0.93, top));
  bez(trim, l1c1, l1c2, l1to);
  bez(trim, l2c1, l2c2, l2to);
  sil.closePath();

  return { sil, trim, hem, p, PW, PH };
}

function makeDotPattern(ctx: CanvasRenderingContext2D, S: number): CanvasPattern | null {
  const tile = Math.max(6, Math.round(12 * S));
  const c = document.createElement('canvas');
  c.width = c.height = tile * 2;
  const g = c.getContext('2d');
  if (!g) return null;
  g.fillStyle = 'rgba(0,0,0,0.26)';
  const r = Math.max(1, tile * 0.17);
  for (const [x, y] of [[tile * 0.5, tile * 0.5], [tile * 1.5, tile * 1.5]]) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = 'rgba(255,255,255,0.05)';
  for (const [x, y] of [[tile * 1.5, tile * 0.5], [tile * 0.5, tile * 1.5]]) {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  return ctx.createPattern(c, 'repeat');
}

/** Contorni dall'esterno verso l'interno, poi il riempimento. */
type Layer = { color: string; width: number };

function layeredText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, layers: Layer[], fill: string | CanvasGradient) {
  ctx.lineJoin = 'round';
  for (const l of layers) {
    ctx.strokeStyle = l.color;
    ctx.lineWidth = l.width;
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

function fitFont(ctx: CanvasRenderingContext2D, font: (size: number) => string, text: string, size: number, maxW: number) {
  ctx.font = font(size);
  const w = ctx.measureText(text).width;
  if (w > maxW) ctx.font = font(size * (maxW / w));
}

/** Numero college: oro con filetto nero, banda bianca e contorno nero esterno. */
function drawNumber(ctx: CanvasRenderingContext2D, S: number, text: string, x: number, y: number, size: number, maxW: number) {
  ctx.save();
  fitFont(ctx, (px) => `${px}px ${FONT_VARSITY}`, text, size, maxW);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const k = size / 400;
  const grad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
  grad.addColorStop(0, COLORS.goldLight);
  grad.addColorStop(1, COLORS.gold);
  layeredText(
    ctx,
    text,
    x,
    y,
    [
      { color: COLORS.black, width: 46 * S * k },
      { color: COLORS.white, width: 34 * S * k },
      { color: COLORS.black, width: 12 * S * k },
    ],
    grad,
  );
  ctx.restore();
}

function drawArch(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  font: (size: number) => string,
  size: number,
  maxArc: number,
  layers: Layer[],
  fill: string | CanvasGradient,
  tracking: number,
) {
  ctx.save();
  ctx.font = font(size);
  const spacing = size * tracking;
  const chars = [...text];
  const widths = chars.map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  const k = total > maxArc ? maxArc / total : 1;
  if (k < 1) ctx.font = font(size * k);
  const ws = widths.map((w) => w * k);
  const gap = spacing * k;
  const arc = (total * k) / radius;
  let a = -arc / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const scaled = layers.map((l) => ({ ...l, width: l.width * k }));
  chars.forEach((ch, i) => {
    const mid = a + ws[i] / radius / 2;
    ctx.save();
    ctx.translate(cx + radius * Math.sin(mid), cy + radius - radius * Math.cos(mid));
    ctx.rotate(mid);
    layeredText(ctx, ch, 0, 0, scaled, fill);
    ctx.restore();
    a += (ws[i] + gap) / radius;
  });
  ctx.restore();
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const br = w / h;
  let dw = w, dh = h;
  if (ir > br) dw = h * ir; else dh = w / ir;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/** Versione bianca monocromatica dello stemma, come la serigrafia del bozzetto. */
const monoCache = new WeakMap<HTMLImageElement, HTMLCanvasElement>();
function monoLogo(img: HTMLImageElement) {
  const hit = monoCache.get(img);
  if (hit) return hit;
  const scale = Math.min(1, 320 / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(img.naturalWidth * scale));
  c.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const g = c.getContext('2d')!;
  g.drawImage(img, 0, 0, c.width, c.height);
  const data = g.getImageData(0, 0, c.width, c.height);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    // zone scure → velatura leggera, zone chiare → bianco pieno: il disegno resta leggibile
    const v = Math.min(1, 0.32 + lum * 1.25);
    d[i] = d[i + 1] = d[i + 2] = 247;
    d[i + 3] = Math.round(d[i + 3] * v);
  }
  g.putImageData(data, 0, 0);
  monoCache.set(img, c);
  return c;
}

function drawContain(ctx: CanvasRenderingContext2D, src: CanvasImageSource, iw: number, ih: number, cx: number, cy: number, box: number) {
  const ir = iw / ih;
  const w = ir >= 1 ? box : box * ir;
  const h = ir >= 1 ? box / ir : box;
  ctx.drawImage(src, cx - w / 2, cy - h / 2, w, h);
}

/** Monogramma "AV" (Archivio Volgare) nel cerchio, con l'anno ai lati. */
function drawAvMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number) {
  ctx.save();
  ctx.strokeStyle = COLORS.white;
  ctx.fillStyle = COLORS.white;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = R * 0.13;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = R * 0.17;
  ctx.beginPath();
  ctx.moveTo(cx - R * 0.78, cy + R * 0.55);
  ctx.lineTo(cx - R * 0.22, cy - R * 0.62);
  ctx.lineTo(cx + R * 0.34, cy + R * 0.55);
  ctx.moveTo(cx - R * 0.34, cy - R * 0.55);
  ctx.lineTo(cx + R * 0.22, cy + R * 0.62);
  ctx.lineTo(cx + R * 0.78, cy - R * 0.55);
  ctx.moveTo(cx - R * 0.58, cy + R * 0.1);
  ctx.lineTo(cx - R * 0.02, cy + R * 0.1);
  ctx.stroke();
  ctx.font = `700 ${R * 0.36}px ${FONT_NAME}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('20', cx - R * 1.45, cy + R * 0.55);
  ctx.fillText('25', cx + R * 1.45, cy + R * 0.55);
  ctx.restore();
}

/** Archi gialli dello sponsor (McDonald's, partner del club). */
function drawSponsorArches(ctx: CanvasRenderingContext2D, cx: number, cy: number, W: number, H: number) {
  ctx.save();
  const lw = W * 0.115;
  ctx.strokeStyle = COLORS.sponsor;
  ctx.lineWidth = lw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';
  const k = 0.851; // sin(πk) ≈ 0.45: la valle centrale scende circa a metà altezza
  const bottom = cy + H / 2;
  const legW = W / 2 - lw / 2;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const u = i / 48;
      const x = cx + side * (legW - u * legW);
      const y = bottom - (H - lw / 2) * Math.pow(Math.sin(Math.PI * k * u), 0.62);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export interface DefaultArt {
  /** Stemma club (versione a colori, viene reso bianco monocromatico). */
  logo: HTMLImageElement | null;
  /** Logo sponsor centrale da /images/sponsor-maglia.png, se presente. */
  sponsor: HTMLImageElement | null;
}

export function drawJerseyTexture(
  canvas: HTMLCanvasElement,
  player: LockerPlayer,
  kit: KitOptions,
  art: DefaultArt,
) {
  const defaultLogo = art.logo;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const S = canvas.width / TEX_W;
  const dots = makeDotPattern(ctx, S);
  const varsity = (px: number) => `${px}px ${FONT_VARSITY}`;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const back of [false, true]) {
    const ox = back ? (TEX_W / 2) * S : 0;
    const { sil, trim, hem, p, PW, PH } = buildPaths(ox, S, back);
    const cx = ox + PW / 2;

    ctx.save();
    ctx.clip(sil);

    // tessuto base cremisi, più scuro verso orlo e fianchi
    const vg = ctx.createLinearGradient(0, 0, 0, PH);
    vg.addColorStop(0, COLORS.fabricLight);
    vg.addColorStop(0.55, COLORS.fabric);
    vg.addColorStop(1, COLORS.fabricDark);
    ctx.fillStyle = vg;
    ctx.fillRect(ox, 0, PW, PH);
    const hg = ctx.createLinearGradient(ox, 0, ox + PW, 0);
    hg.addColorStop(0, 'rgba(20,0,2,0.35)');
    hg.addColorStop(0.25, 'rgba(20,0,2,0)');
    hg.addColorStop(0.75, 'rgba(20,0,2,0)');
    hg.addColorStop(1, 'rgba(20,0,2,0.35)');
    ctx.fillStyle = hg;
    ctx.fillRect(ox, 0, PW, PH);

    // grafica societaria caricata dall'utente (es. la statua tono su tono del bozzetto)
    if (kit.graphic && kit.graphicBlend > 0) {
      ctx.save();
      ctx.globalAlpha = kit.graphicBlend;
      ctx.beginPath();
      ctx.rect(ox, 0, PW, PH);
      ctx.clip();
      drawCover(ctx, kit.graphic, ox, 0, PW, PH);
      ctx.restore();
    }

    // pannelli laterali neri con filetto oro sul bordo interno
    const panelTop = p(0, 0.8)[1];
    for (const side of [-1, 1]) {
      const [xIn] = p(side * 0.865, 0);
      const [xOut] = p(side * 1.05, 0);
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(Math.min(xIn, xOut), panelTop, Math.abs(xOut - xIn), PH);
      ctx.fillStyle = COLORS.gold;
      ctx.fillRect(side > 0 ? xIn - 14 * S : xIn, panelTop, 14 * S, PH);
    }

    // orlo ripiegato con cucitura
    ctx.lineCap = 'butt';
    ctx.strokeStyle = 'rgba(25,0,3,0.45)';
    ctx.lineWidth = 2 * 40 * S;
    ctx.stroke(hem);
    ctx.setLineDash([20 * S, 13 * S]);
    ctx.strokeStyle = 'rgba(255,240,220,0.22)';
    ctx.lineWidth = 3 * S;
    ctx.save();
    ctx.translate(0, -44 * S);
    ctx.stroke(hem);
    ctx.restore();
    ctx.setLineDash([]);

    // colletto e giromanica a coste: nero / oro / nero / oro dal bordo verso l'interno
    ctx.lineJoin = 'round';
    const rib: [string, number][] = [
      [COLORS.gold, 46],
      [COLORS.black, 39],
      [COLORS.gold, 27],
      [COLORS.black, 18],
    ];
    for (const [color, w] of rib) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * w * S;
      ctx.stroke(trim);
    }

    if (!back) {
      // petto: monogramma AV a sinistra, stemma club a destra
      const chestY = p(0, 0.75)[1];
      drawAvMark(ctx, p(-0.5, 0)[0], chestY, 44 * S);
      if (kit.logo) {
        drawContain(ctx, kit.logo, kit.logo.naturalWidth, kit.logo.naturalHeight, p(0.5, 0)[0], chestY, 130 * S);
      } else if (defaultLogo) {
        const mono = monoLogo(defaultLogo);
        drawContain(ctx, mono, mono.width, mono.height, p(0.5, 0)[0], chestY, 135 * S);
      }

      // HYRIA ad arco: lettere color tessuto, filetto bianco, contorno scuro
      const hyFill = ctx.createLinearGradient(0, p(0, 0.7)[1], 0, p(0, 0.6)[1]);
      hyFill.addColorStop(0, '#7e1820');
      hyFill.addColorStop(1, '#55090e');
      drawArch(ctx, 'HYRIA', cx, p(0, 0.595)[1], 1300 * S, varsity, 205 * S, PW * 0.72, [
        { color: COLORS.black, width: 30 * S },
        { color: COLORS.white, width: 20 * S },
      ], hyFill, 0.02);

      drawNumber(ctx, S, String(player.number), cx, p(0, 0.512)[1], 165 * S, PW * 0.34);
      const sponsor = kit.sponsor ?? art.sponsor;
      const sponsorY = p(0, 0.35)[1];
      if (sponsor) drawContain(ctx, sponsor, sponsor.naturalWidth, sponsor.naturalHeight, cx, sponsorY, 330 * S);
      else drawSponsorArches(ctx, cx, sponsorY, 300 * S, 210 * S);
    } else {
      drawArch(ctx, 'NOLANI', cx, p(0, 0.845)[1], 1100 * S, varsity, 78 * S, PW * 0.34, [
        { color: COLORS.black, width: 12 * S },
      ], COLORS.gold, 0.06);

      ctx.save();
      const name = player.lastName.toUpperCase();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      fitFont(ctx, (px) => `700 ${px}px ${FONT_NAME}`, name, 70 * S, PW * 0.66);
      ctx.fillStyle = COLORS.white;
      ctx.fillText(name, cx, p(0, 0.765)[1]);
      ctx.restore();

      drawNumber(ctx, S, String(player.number), cx, p(0, 0.475)[1], 560 * S, PW * 0.72);
    }

    // microforatura del tessuto traspirante sopra tutto
    if (dots) {
      ctx.fillStyle = dots;
      ctx.fillRect(ox, 0, PW, PH);
    }
    ctx.restore();
  }
}

export function createJerseyCanvas(scale: number) {
  const c = document.createElement('canvas');
  c.width = Math.round(TEX_W * scale);
  c.height = Math.round(TEX_H * scale);
  return c;
}

/** Piccola texture ripetuta per il rilievo della maglia a rete (bump map). */
export function createMeshBumpTexture(renderer: THREE.WebGLRenderer) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#cfcfcf';
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#2a2a2a';
  for (const [x, y] of [[16, 16], [48, 48]]) {
    g.beginPath();
    g.arc(x, y, 8, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = '#9a9a9a';
  for (const [x, y] of [[48, 16], [16, 48]]) {
    g.beginPath();
    g.arc(x, y, 5, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(95, 130);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}
