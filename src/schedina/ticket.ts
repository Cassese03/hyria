import { MAX_PAYOUT, formatOdds, type Selection } from './markets';

export type TicketStatus = 'in_corso' | 'vinta' | 'persa' | 'annullata';

export interface Ticket {
  code: string;
  /** Chiave segreta della schedina, salvata solo su questo dispositivo. */
  token: string;
  createdAt: string;
  nickname: string;
  stake: number;
  selections: Selection[];
  baseOdds: number;
  bonusPct: number;
  totalOdds: number;
  payout: number;
  status: TicketStatus;
  /** HC vinti alla chiusura: 0 se persa o annullata, null se in corso. */
  winnings: number | null;
}

export const STAKES = [10, 25, 50, 100] as const;

export const STATUS_LABEL: Record<TicketStatus, string> = {
  in_corso: 'In corso',
  vinta: 'Vinta',
  persa: 'Persa',
  annullata: 'Annullata',
};

// interi senza separatore: il punto è già usato come decimale nelle quote
export const formatCoins = (n: number) => `${Math.round(n)} HC`;

/** Stessa regola di `piazza_schedina` nel database. */
export const potentialPayout = (totalOdds: number, stake: number) => Math.min(Math.round(totalOdds * stake), MAX_PAYOUT);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function shareUrl() {
  return `${window.location.origin}/schedina`;
}

export function shareText(t: Ticket) {
  const over = t.selections.find((s) => s.outcomeKind === 'over');
  const lead = over ?? t.selections[0];
  const question = over ? `Riuscirà ${lead.lastName} a fare ${lead.pick}?` : `Riuscirà ${lead.lastName} a centrare "${lead.pick}"?`;
  return `Ho piazzato la mia schedina su Hyria Basket! Quota finale: ${formatOdds(t.totalOdds)}. ${question} #HyriaBasket`;
}

/* ───────── PNG su canvas nativo ───────── */

const W = 720;
const PAD = 44;
const ROW = 76;
const DISPLAY = '"Bebas Neue", "Arial Narrow", Impact, sans-serif';
const BODY = 'Montserrat, Arial, sans-serif';
const C = {
  paper: '#0f0d12',
  edge: '#2a1a1d',
  ink: '#f8fafc',
  muted: 'rgba(248,250,252,0.55)',
  faint: 'rgba(248,250,252,0.18)',
  orange: '#d96c00',
  gold: '#e3b04b',
  maroon: '#5e0303',
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t}…`;
}

function perforation(ctx: CanvasRenderingContext2D, y: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, y, 16, 0, Math.PI * 2);
  ctx.arc(W, y, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = C.faint;
  ctx.setLineDash([6, 8]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, y);
  ctx.lineTo(W - 28, y);
  ctx.stroke();
  ctx.setLineDash([]);
}

export async function renderTicketPng(t: Ticket): Promise<Blob | null> {
  if (document.fonts) {
    await Promise.all([document.fonts.load(`40px ${DISPLAY}`), document.fonts.load(`700 16px ${BODY}`)]).catch(() => undefined);
  }
  const logo = await loadImage('/images/logo-hyria.png');

  const headerH = 214;
  const rowsH = t.selections.length * ROW + 20;
  const totalsH = 232 + (t.bonusPct ? 30 : 0) + (t.status !== 'in_corso' ? 30 : 0);
  const footH = 190;
  const H = headerH + rowsH + totalsH + footH;
  const scale = 2;

  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(scale, scale);

  // carta
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1a0b0e');
  bg.addColorStop(0.35, C.paper);
  bg.addColorStop(1, C.paper);
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 22);
  ctx.fill();
  ctx.fillStyle = C.orange;
  ctx.fillRect(0, 0, W, 6);

  // intestazione
  let y = PAD;
  if (logo) {
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(PAD + 36, y + 36, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(logo, PAD + 5, y + 5, 62, 62);
  }
  const tx = logo ? PAD + 92 : PAD;
  ctx.fillStyle = C.ink;
  ctx.font = `44px ${DISPLAY}`;
  ctx.textBaseline = 'top';
  ctx.fillText('ASD HYRIA BASKET', tx, y + 4);
  ctx.fillStyle = C.muted;
  ctx.font = `600 15px ${BODY}`;
  ctx.fillText('Schedina virtuale · Hyria Coin', tx, y + 50);

  ctx.textAlign = 'right';
  ctx.fillStyle = C.orange;
  ctx.font = `30px ${DISPLAY}`;
  ctx.fillText(`#${t.code}`, W - PAD, y + 8);
  ctx.textAlign = 'left';

  y += 104;
  ctx.font = `600 13px ${BODY}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('GIOCATA DA', PAD, y);
  ctx.textAlign = 'right';
  ctx.fillText('DATA E ORA', W - PAD, y);
  ctx.textAlign = 'left';
  ctx.font = `700 20px ${BODY}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(fit(ctx, t.nickname, 380), PAD, y + 20);
  ctx.textAlign = 'right';
  ctx.fillText(formatDate(t.createdAt), W - PAD, y + 20);
  ctx.textAlign = 'left';

  perforation(ctx, headerH - 10);

  // pronostici
  y = headerH + 10;
  for (const s of t.selections) {
    ctx.fillStyle = C.orange;
    ctx.font = `36px ${DISPLAY}`;
    ctx.fillText(String(s.number), PAD, y + 10);
    ctx.fillStyle = C.ink;
    ctx.font = `700 18px ${BODY}`;
    ctx.fillText(fit(ctx, `${s.firstName.charAt(0)}. ${s.lastName}`, 420), PAD + 62, y + 8);
    ctx.fillStyle = C.muted;
    ctx.font = `500 15px ${BODY}`;
    ctx.fillText(fit(ctx, `${s.market} · ${s.pick}`, 460), PAD + 62, y + 34);
    ctx.textAlign = 'right';
    ctx.fillStyle = C.ink;
    ctx.font = `36px ${DISPLAY}`;
    ctx.fillText(formatOdds(s.odds), W - PAD, y + 12);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.faint;
    ctx.fillRect(PAD, y + ROW - 10, W - PAD * 2, 1);
    y += ROW;
  }

  // totali
  y = headerH + rowsH + 18;
  const line = (label: string, value: string, color = C.muted) => {
    ctx.font = `600 15px ${BODY}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(label, PAD, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = color;
    ctx.font = `700 16px ${BODY}`;
    ctx.fillText(value, W - PAD, y);
    ctx.textAlign = 'left';
    y += 30;
  };
  line(`Pronostici: ${t.selections.length}`, `Quota base ${formatOdds(t.baseOdds)}`);
  if (t.bonusPct) line('Bonus Hyria', `+${t.bonusPct}%`, C.gold);
  line('Giocati', formatCoins(t.stake));
  if (t.status !== 'in_corso') {
    const won = t.status === 'vinta';
    line('Esito', `${STATUS_LABEL[t.status]}${t.winnings ? ` · ${formatCoins(t.winnings)}` : ''}`, won ? C.gold : C.ink);
  }

  y += 12;
  const boxH = 120;
  ctx.fillStyle = 'rgba(94,3,3,0.45)';
  ctx.beginPath();
  ctx.roundRect(PAD, y, W - PAD * 2, boxH, 14);
  ctx.fill();
  ctx.font = `600 13px ${BODY}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('QUOTA TOTALE', PAD + 24, y + 22);
  ctx.textAlign = 'right';
  ctx.fillText('VINCITA POTENZIALE', W - PAD - 24, y + 22);
  ctx.font = `64px ${DISPLAY}`;
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'left';
  ctx.fillText(formatOdds(t.totalOdds), PAD + 24, y + 44);
  ctx.textAlign = 'right';
  ctx.fillStyle = C.orange;
  ctx.fillText(formatCoins(t.payout), W - PAD - 24, y + 44);
  ctx.textAlign = 'left';

  // codice a barre decorativo
  const footY = H - footH;
  perforation(ctx, footY + 10);
  let bx = PAD;
  let seed = hash(t.code);
  ctx.fillStyle = C.ink;
  while (bx < W - PAD) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0;
    const bw = 1 + (seed % 4);
    if (bx + bw > W - PAD) break;
    ctx.fillRect(bx, footY + 42, bw, 72);
    bx += bw + 2 + ((seed >>> 8) % 3);
  }
  ctx.textAlign = 'center';
  ctx.font = `600 13px ${BODY}`;
  ctx.fillStyle = C.muted;
  ctx.fillText(t.code.split('').join(' '), W / 2, footY + 124);
  ctx.font = `500 12px ${BODY}`;
  ctx.fillStyle = 'rgba(248,250,252,0.4)';
  ctx.fillText('Gioco amatoriale senza denaro reale · hyriabasket.it', W / 2, footY + 152);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
