import type { LockerCategory, LockerPlayer } from '../locker/roster';

export type MarketGroup = 'stat' | 'special';
export type MarketKind = 'punti' | 'assist' | 'rimbalzi' | 'triple' | 'falli' | 'tecnico' | 'double-double' | 'clutch' | 'foul-out' | 'combo';
export type OutcomeKind = 'over' | 'under' | 'si' | 'no';

export const MAX_SELECTIONS = 15;
export const MAX_PAYOUT = 100000;

export interface Outcome {
  /** Nel generatore coincide con `kind`; dal database è l'id dell'esito. */
  id: string;
  kind: OutcomeKind;
  /** Testo sul bottone: "Over", "Under", "Sì", "No". */
  label: string;
  /** Testo completo sullo scontrino: "Over 12.5 punti". */
  pick: string;
  odds: number;
}

export interface Market {
  /** Nel generatore coincide con `kind`; dal database è l'id del mercato. */
  id: string;
  kind: MarketKind;
  group: MarketGroup;
  label: string;
  /** Linea .5 per i mercati Over/Under. */
  line?: number;
  /** Solo combo: soglia della seconda statistica. */
  line2?: number;
  stat2?: 'assist' | 'rimbalzi';
  hint?: string;
  outcomes: Outcome[];
}

export interface PlayerMarkets {
  player: LockerPlayer;
  markets: Market[];
}

export interface Selection {
  /** Id del mercato: un solo esito per mercato. */
  key: string;
  outcomeId: string;
  outcomeKind: OutcomeKind;
  playerId: string;
  firstName: string;
  lastName: string;
  number: number;
  market: string;
  pick: string;
  odds: number;
}

type Range = [number, number];

interface Profile {
  points: Range;
  assists: Range;
  rebounds: Range;
  threes: Range;
  fouls: Range;
  doubleDouble: Range;
  foulOut: Range;
  clutch: Range;
}

/** Linee intere (poi +0.5) e quote tipiche per reparto. */
const PROFILES: Record<LockerCategory, Profile> = {
  GUARDIE: {
    points: [9, 16],
    assists: [2, 5],
    rebounds: [2, 4],
    threes: [1, 2],
    fouls: [2, 3],
    doubleDouble: [3.6, 5],
    foulOut: [5.5, 8],
    clutch: [0.38, 0.55],
  },
  ALI: {
    points: [9, 15],
    assists: [1, 3],
    rebounds: [4, 6],
    threes: [1, 2],
    fouls: [2, 3],
    doubleDouble: [3, 4.4],
    foulOut: [4.5, 7],
    clutch: [0.3, 0.45],
  },
  CENTRI: {
    points: [8, 14],
    assists: [0, 2],
    rebounds: [6, 9],
    threes: [0, 1],
    fouls: [3, 4],
    doubleDouble: [2.5, 3.4],
    foulOut: [3.5, 5.5],
    clutch: [0.24, 0.4],
  },
};

const MARGIN = 1.06;

// PRNG deterministico: le quote di un giocatore restano stabili tra un caricamento e l'altro
function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const odds = (n: number) => Math.max(1.05, Math.round(n * 100) / 100);
const fromProb = (p: number) => odds(1 / (p * MARGIN));

export const formatOdds = (n: number) => n.toFixed(2);

function overUnder(rand: () => number, id: MarketKind, label: string, unit: string, [lo, hi]: Range): Market {
  const line = lo + Math.floor(rand() * (hi - lo + 1)) + 0.5;
  const pOver = 0.4 + rand() * 0.2;
  return {
    id,
    kind: id,
    group: 'stat',
    label,
    line,
    outcomes: [
      { id: 'over', kind: 'over', label: 'Over', pick: `Over ${line} ${unit}`, odds: fromProb(pOver) },
      { id: 'under', kind: 'under', label: 'Under', pick: `Under ${line} ${unit}`, odds: fromProb(1 - pOver) },
    ],
  };
}

function yesNo(id: MarketKind, label: string, hint: string, pick: string, pYes: number): Market {
  return {
    id,
    kind: id,
    group: 'special',
    label,
    hint,
    outcomes: [
      { id: 'si', kind: 'si', label: 'Sì', pick: `${pick}: Sì`, odds: fromProb(pYes) },
      { id: 'no', kind: 'no', label: 'No', pick: `${pick}: No`, odds: fromProb(1 - pYes) },
    ],
  };
}

const between = (rand: () => number, [lo, hi]: Range) => lo + rand() * (hi - lo);

/** `seed` (es. data e avversario) fa variare le linee da una partita all'altra. */
export function buildMarkets(player: LockerPlayer, seed = ''): PlayerMarkets {
  const rand = seeded(`${player.id}|${seed}`);
  const prof = PROFILES[player.category];
  const assists = player.role === 'Playmaker' ? ([prof.assists[0] + 1, prof.assists[1] + 1] as Range) : prof.assists;

  const points = overUnder(rand, 'punti', 'Punti', 'punti', prof.points);
  const ast = overUnder(rand, 'assist', 'Assist', 'assist', assists);
  const reb = overUnder(rand, 'rimbalzi', 'Rimbalzi', 'rimbalzi', prof.rebounds);
  const threes = overUnder(rand, 'triple', 'Triple segnate', 'triple', prof.threes);
  const fouls = overUnder(rand, 'falli', 'Falli commessi', 'falli', prof.fouls);

  // la combo usa assist per le guardie, rimbalzi per ali e centri
  const comboPts = Math.ceil(points.line!) + 2;
  const comboSecond = player.category === 'GUARDIE' ? { n: Math.floor(ast.line!), w: 'assist' as const } : { n: Math.floor(reb.line!), w: 'rimbalzi' as const };
  const comboText = `Almeno ${comboPts} punti + ${comboSecond.n} ${comboSecond.w}`;

  const foulOutYes = odds(between(rand, prof.foulOut));
  const ddYes = odds(between(rand, prof.doubleDouble));

  const specials: Market[] = [
    yesNo('tecnico', 'Fallo tecnico', 'Riceve almeno un tecnico nel match', 'Fallo tecnico', 0.18 + rand() * 0.08),
    {
      id: 'double-double',
      kind: 'double-double',
      group: 'special',
      label: 'Double-double',
      hint: 'Doppia cifra in punti e rimbalzi o punti e assist',
      outcomes: [{ id: 'si', kind: 'si', label: 'Sì', pick: 'Double-double: Sì', odds: ddYes }],
    },
    yesNo('clutch', 'Clutch finisher', 'Segna negli ultimi 2 minuti di gara', 'Clutch finisher', between(rand, prof.clutch)),
    yesNo('foul-out', 'Foul out', 'Esce per 5 falli', 'Foul out', 1 / (foulOutYes * MARGIN)),
    {
      id: 'combo',
      kind: 'combo',
      group: 'special',
      label: 'Combo prestazione',
      hint: comboText,
      line: comboPts,
      line2: comboSecond.n,
      stat2: comboSecond.w,
      outcomes: [{ id: 'si', kind: 'si', label: 'Sì', pick: comboText, odds: odds(2.8 + rand() * 1.4) }],
    },
  ];

  return { player, markets: [points, ast, reb, threes, fouls, ...specials] };
}

export const BONUS_TIERS = [
  { min: 3, pct: 5 },
  { min: 5, pct: 10 },
  { min: 7, pct: 20 },
] as const;

export function bonusFor(count: number) {
  let pct = 0;
  for (const t of BONUS_TIERS) if (count >= t.min) pct = t.pct;
  return pct;
}

export function nextBonus(count: number) {
  return BONUS_TIERS.find((t) => count < t.min) ?? null;
}

export interface SlipTotals {
  baseOdds: number;
  bonusPct: number;
  totalOdds: number;
}

export function slipTotals(selections: Selection[]): SlipTotals {
  const baseOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const bonusPct = bonusFor(selections.length);
  return { baseOdds, bonusPct, totalOdds: Math.round(baseOdds * (1 + bonusPct / 100) * 100) / 100 };
}
