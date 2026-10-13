import * as THREE from 'three';

// Misure FIBA in metri: il campo è centrato nell'origine, lato lungo sull'asse X.
export const COURT_L = 28;
export const COURT_W = 15;
export const FLOOR_L = 32; // campo + fascia esterna dipinta
export const FLOOR_W = 19;
export const RIM_X = COURT_L / 2 - 1.575;
export const RIM_Y = 3.05;
export const RIM_R = 0.225;

const PX = 64; // pixel per metro sulla texture del parquet
const X = (x: number) => (x + FLOOR_L / 2) * PX;
const Z = (z: number) => (z + FLOOR_W / 2) * PX;

const MAROON = '#5e0303';
const APRON = '#3a0405';
const LINE = '#f4efe6';
const ORANGE = '#d96c00';
const LED_ORANGE = '#ff8a1f';

export const DISPLAY_FONT = 'Arvo, Georgia, serif';
export const UI_FONT = 'Montserrat, Arial, sans-serif';

// RNG deterministico: il parquet è uguale a ogni caricamento
const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d') as CanvasRenderingContext2D] as const;
};

const toTexture = (c: HTMLCanvasElement, aniso = 1) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};

const spacedText = (ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) => {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let x = cx - total / 2;
  const align = ctx.textAlign;
  ctx.textAlign = 'left';
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, x, y);
    x += widths[i] + spacing;
  });
  ctx.textAlign = align;
};

/* ─── Parquet ────────────────────────────────────────────────────────────── */

export function createCourtTexture(logo: HTMLImageElement | null, aniso: number, apronTitle = 'HYRIA BASKET') {
  const [c, ctx] = canvas(FLOOR_L * PX, FLOOR_W * PX);
  const rand = rng(2025);

  // fascia esterna bordeaux
  ctx.fillStyle = APRON;
  ctx.fillRect(0, 0, c.width, c.height);

  // listoni di legno lungo il lato lungo
  const plank = 0.075;
  const x0 = X(-COURT_L / 2);
  const x1 = X(COURT_L / 2);
  for (let z = -COURT_W / 2; z < COURT_W / 2; z += plank) {
    let x = x0 - rand() * 3 * PX;
    while (x < x1) {
      const len = (1.6 + rand() * 2.6) * PX;
      const l = 27 + rand() * 7;
      ctx.fillStyle = `hsl(${24 + rand() * 4} 46% ${l}%)`;
      const sx = Math.max(x, x0);
      const ex = Math.min(x + len, x1);
      ctx.fillRect(sx, Z(z), ex - sx, plank * PX + 0.5);
      // venatura
      ctx.strokeStyle = `rgba(40, 18, 6, ${0.05 + rand() * 0.07})`;
      ctx.lineWidth = 1;
      for (let g = 0; g < 2; g++) {
        const gy = Z(z) + 1 + rand() * (plank * PX - 2);
        ctx.beginPath();
        ctx.moveTo(sx, gy);
        ctx.bezierCurveTo(sx + (ex - sx) * 0.3, gy + rand() * 2 - 1, sx + (ex - sx) * 0.7, gy + rand() * 2 - 1, ex, gy);
        ctx.stroke();
      }
      // giunto di testa
      ctx.fillStyle = 'rgba(20, 8, 2, 0.35)';
      ctx.fillRect(ex - 1, Z(z), 1, plank * PX);
      x += len;
    }
    ctx.fillStyle = 'rgba(20, 8, 2, 0.22)';
    ctx.fillRect(x0, Z(z), x1 - x0, 1);
  }

  // area dei tre secondi dipinta bordeaux
  ctx.fillStyle = MAROON;
  ctx.globalAlpha = 0.94;
  for (const side of [-1, 1]) {
    const bx = X(side * COURT_L / 2);
    const fx = X(side * (COURT_L / 2 - 5.8));
    ctx.fillRect(Math.min(bx, fx), Z(-2.45), Math.abs(fx - bx), 4.9 * PX);
  }
  ctx.globalAlpha = 1;

  // cerchio centrale chiaro con lo stemma
  ctx.fillStyle = '#efe6d8';
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 1.8 * PX, 0, Math.PI * 2);
  ctx.fill();
  if (logo) {
    const s = 3.9 * PX;
    ctx.drawImage(logo, X(0) - s / 2, Z(0) - s / 2 - 0.05 * PX, s, s);
  }

  // linee
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 0.055 * PX;
  ctx.strokeRect(x0, Z(-COURT_W / 2), x1 - x0, COURT_W * PX);
  ctx.beginPath();
  ctx.moveTo(X(0), Z(-COURT_W / 2));
  ctx.lineTo(X(0), Z(COURT_W / 2));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 1.8 * PX, 0, Math.PI * 2);
  ctx.stroke();

  const alpha = Math.asin(6.6 / 6.75);
  for (const side of [-1, 1]) {
    const rimX = X(side * RIM_X);
    const base = X(side * COURT_L / 2);
    const ft = X(side * (COURT_L / 2 - 5.8));
    // area
    ctx.strokeRect(Math.min(base, ft), Z(-2.45), Math.abs(ft - base), 4.9 * PX);
    // lunetta: metà piena verso il centro, tratteggiata dentro l'area
    const toCenter = side > 0 ? Math.PI : 0;
    ctx.beginPath();
    ctx.arc(ft, Z(0), 1.8 * PX, toCenter - Math.PI / 2, toCenter + Math.PI / 2);
    ctx.stroke();
    ctx.setLineDash([0.3 * PX, 0.25 * PX]);
    ctx.beginPath();
    ctx.arc(ft, Z(0), 1.8 * PX, toCenter + Math.PI / 2, toCenter + Math.PI * 1.5);
    ctx.stroke();
    ctx.setLineDash([]);
    // tre punti
    const meet = X(side * (RIM_X - Math.sqrt(6.75 ** 2 - 6.6 ** 2)));
    ctx.beginPath();
    ctx.moveTo(base, Z(-6.6));
    ctx.lineTo(meet, Z(-6.6));
    ctx.arc(rimX, Z(0), 6.75 * PX, toCenter + side * alpha, toCenter - side * alpha, side > 0);
    ctx.lineTo(base, Z(6.6));
    ctx.stroke();
    // semicerchio no-sfondamento
    ctx.beginPath();
    ctx.arc(rimX, Z(0), 1.25 * PX, toCenter - Math.PI / 2, toCenter + Math.PI / 2);
    ctx.stroke();
  }

  // scritte sulla fascia esterna
  ctx.fillStyle = 'rgba(244, 239, 230, 0.9)';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = `900 ${1.05 * PX}px ${UI_FONT}`;
  spacedText(ctx, apronTitle.toUpperCase(), X(0), Z(-COURT_W / 2 - 1), 0.35 * PX);
  ctx.font = `900 ${0.9 * PX}px ${UI_FONT}`;
  for (const side of [-1, 1]) {
    spacedText(ctx, 'NOLA', X(side * 9), Z(COURT_W / 2 + 1), 0.3 * PX);
    ctx.save();
    ctx.translate(X(side * (COURT_L / 2 + 1)), Z(0));
    ctx.rotate(side > 0 ? Math.PI / 2 : -Math.PI / 2);
    ctx.fillStyle = ORANGE;
    spacedText(ctx, 'HYRIA', 0, 0, 0.3 * PX);
    ctx.restore();
  }

  // vernice: leggera vignettatura calda verso i bordi
  const g = ctx.createRadialGradient(X(0), Z(0), 4 * PX, X(0), Z(0), 18 * PX);
  g.addColorStop(0, 'rgba(255, 190, 120, 0.06)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  return toTexture(c, aniso);
}

/* ─── Pallone ────────────────────────────────────────────────────────────── */

export function createBallTexture() {
  const [c, ctx] = canvas(1024, 512);
  ctx.fillStyle = '#c4560f';
  ctx.fillRect(0, 0, 1024, 512);
  const rand = rng(7);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = rand() > 0.5 ? 'rgba(0,0,0,0.08)' : 'rgba(255,200,150,0.06)';
    ctx.fillRect(rand() * 1024, rand() * 512, 2, 2);
  }
  ctx.strokeStyle = '#1a0a04';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 256);
  ctx.lineTo(1024, 256);
  for (const x of [256, 768]) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
  }
  ctx.stroke();
  for (const cx of [0, 512, 1024]) {
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      for (let y = 0; y <= 512; y += 8) {
        const x = cx + dir * 150 * Math.sin((Math.PI * y) / 512);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  return toTexture(c);
}

/* ─── Tabellone centrale ─────────────────────────────────────────────────── */

const ledGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  for (let x = 0; x < w; x += 4) ctx.fillRect(x, 0, 1, h);
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
};

export function createJumboBrand(logo: HTMLImageElement | null) {
  const [c, ctx] = canvas(1024, 576);
  ctx.fillStyle = '#0a0206';
  ctx.fillRect(0, 0, 1024, 576);
  const g = ctx.createRadialGradient(512, 230, 20, 512, 230, 420);
  g.addColorStop(0, 'rgba(120, 10, 10, 0.75)');
  g.addColorStop(1, 'rgba(10, 2, 6, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 576);
  if (logo) ctx.drawImage(logo, 512 - 190, 18, 380, 380);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 76px ${DISPLAY_FONT}`;
  ctx.fillText('HYRIA BASKET', 512, 478);
  ctx.fillStyle = LED_ORANGE;
  ctx.font = `700 34px ${UI_FONT}`;
  spacedText(ctx, 'NOLA', 512, 532, 14);
  ledGrid(ctx, 1024, 576);
  return toTexture(c);
}

/** Faccia con i numeri: ridisegnabile per il contatore animato */
export interface JumboColumn {
  value: string;
  label: string;
}

export interface JumboContent {
  title: string;
  columns: JumboColumn[];
}

export function createJumboStats() {
  const [c, ctx] = canvas(1024, 576);
  const texture = toTexture(c);
  const render = ({ title, columns }: JumboContent) => {
    ctx.fillStyle = '#0a0206';
    ctx.fillRect(0, 0, 1024, 576);
    ctx.fillStyle = 'rgba(94, 3, 3, 0.85)';
    ctx.fillRect(0, 0, 1024, 84);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 40px ${DISPLAY_FONT}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText('HYRIA', 40, 44);
    ctx.textAlign = 'right';
    ctx.font = `700 30px ${UI_FONT}`;
    ctx.fillText(title.toUpperCase(), 984, 44);

    const w = 1024 / columns.length;
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let i = 1; i < columns.length; i++) ctx.fillRect(w * i - 1, 130, 2, 380);

    const col = (x: number, value: string, label: string) => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = LED_ORANGE;
      ctx.shadowBlur = 28;
      ctx.fillStyle = LED_ORANGE;
      let size = 230;
      ctx.font = `900 ${size}px ${UI_FONT}`;
      while (ctx.measureText(value).width > w - 60 && size > 80) {
        size -= 10;
        ctx.font = `900 ${size}px ${UI_FONT}`;
      }
      ctx.fillText(value, x, 390);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 46px ${UI_FONT}`;
      spacedText(ctx, label, x, 480, 10);
    };
    columns.forEach((cl, i) => col(w * i + w / 2, cl.value, cl.label.toUpperCase()));
    ledGrid(ctx, 1024, 576);
    texture.needsUpdate = true;
  };
  const draw = (athletes: number, staff: number) =>
    render({
      title: 'Il club in numeri',
      columns: [
        { value: `${athletes}+`, label: 'Atleti' },
        { value: `${staff}+`, label: 'Staff' },
      ],
    });
  draw(50, 15);
  return { texture, draw, render };
}

/* ─── Striscia LED del tavolo ufficiali ──────────────────────────────────── */

export function createLedStrip(text = 'HYRIA BASKET') {
  const [c, ctx] = canvas(2048, 128);
  ctx.fillStyle = '#050104';
  ctx.fillRect(0, 0, 2048, 128);
  ctx.fillStyle = LED_ORANGE;
  ctx.shadowColor = LED_ORANGE;
  ctx.shadowBlur = 14;
  const label = text.toUpperCase();
  // il testo deve stare nella sua metà di striscia, con spazio per il separatore
  let size = 74;
  const fits = () => ctx.measureText(label).width + 12 * (label.length - 1) < 900;
  ctx.font = `900 ${size}px ${UI_FONT}`;
  while (!fits() && size > 36) {
    size -= 2;
    ctx.font = `900 ${size}px ${UI_FONT}`;
  }
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (let i = 0; i < 2; i++) {
    spacedText(ctx, label, 512 + i * 1024, 68, 12);
    ctx.fillRect(1024 * i + 1020, 58, 8, 8);
  }
  ctx.shadowBlur = 0;
  ledGrid(ctx, 2048, 128);
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

export function createShotClock() {
  const [c, ctx] = canvas(256, 128);
  ctx.fillStyle = '#050104';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#ff3b1f';
  ctx.shadowColor = '#ff3b1f';
  ctx.shadowBlur = 16;
  ctx.font = `900 100px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('24', 128, 70);
  return toTexture(c);
}

/** Bagliore morbido per le luci del soffitto */
export function createGlowTexture() {
  const [c, ctx] = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255, 236, 210, 1)');
  g.addColorStop(0.25, 'rgba(255, 210, 160, 0.45)');
  g.addColorStop(1, 'rgba(255, 180, 120, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

export function createShadowTexture() {
  const [c, ctx] = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.75)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

/** Maschera "HYRIA" per colorare i seggiolini della tribuna opposta */
export function seatLetterMask(cols: number, rows: number) {
  const [, ctx] = canvas(cols, rows);
  ctx.fillStyle = '#fff';
  ctx.font = `900 ${rows - 1}px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  spacedText(ctx, 'HYRIA', cols / 2, rows - 2, 1);
  const data = ctx.getImageData(0, 0, cols, rows).data;
  return (col: number, row: number) => data[(row * cols + col) * 4 + 3] > 110;
}

/* ─── Cartelloni LED a bordo campo ───────────────────────────────────────── */

export interface BoardItem {
  name: string;
  image: HTMLImageElement | null;
}

export const BOARD_H = 0.9; // altezza del cartellone in metri
const CELL_W = 512;
const CELL_H = 146; // ~3,15 m per cella su un cartellone alto 0,9 m

/**
 * Striscia ripetibile: un logo per cella, intervallato dalla scritta del club.
 * Restituisce anche la lunghezza in metri, per calcolare il `repeat`.
 */
export function createAdBoard(items: BoardItem[]) {
  const cells: (BoardItem | null)[] = [];
  items.forEach((it, i) => {
    cells.push(it);
    if (i % 3 === 2) cells.push(null);
  });
  if (cells[cells.length - 1] !== null) cells.push(null);

  const [c, ctx] = canvas(cells.length * CELL_W, CELL_H);
  ctx.fillStyle = '#060105';
  ctx.fillRect(0, 0, c.width, c.height);

  cells.forEach((cell, i) => {
    const x0 = i * CELL_W;
    if (!cell) {
      ctx.save();
      ctx.fillStyle = MAROON;
      ctx.fillRect(x0 + 6, 6, CELL_W - 12, CELL_H - 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 64px ${DISPLAY_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      spacedText(ctx, 'HYRIA', x0 + CELL_W / 2, CELL_H / 2 + 4, 10);
      ctx.restore();
      return;
    }
    // pannello chiaro: i loghi degli sponsor sono quasi tutti su fondo bianco
    ctx.fillStyle = '#f7f4ef';
    ctx.fillRect(x0 + 6, 6, CELL_W - 12, CELL_H - 12);
    const img = cell.image;
    if (img && img.naturalWidth) {
      const boxW = CELL_W - 60;
      const boxH = CELL_H - 34;
      const s = Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, x0 + (CELL_W - w) / 2, (CELL_H - h) / 2, w, h);
    } else {
      ctx.fillStyle = '#1a0a0a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 46;
      ctx.font = `800 ${size}px ${UI_FONT}`;
      while (ctx.measureText(cell.name.toUpperCase()).width > CELL_W - 70 && size > 20) {
        size -= 2;
        ctx.font = `800 ${size}px ${UI_FONT}`;
      }
      ctx.fillText(cell.name.toUpperCase(), x0 + CELL_W / 2, CELL_H / 2 + 2);
    }
  });
  ledGrid(ctx, c.width, c.height);

  const texture = toTexture(c);
  texture.wrapS = THREE.RepeatWrapping;
  return { texture, length: (cells.length * CELL_W * BOARD_H) / CELL_H };
}
