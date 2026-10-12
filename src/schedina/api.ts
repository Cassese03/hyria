import { supabase } from '../lib/supabase';
import { LOCKER_ROSTER } from '../locker/roster';
import {
  MAX_SELECTIONS,
  type Market,
  type MarketGroup,
  type MarketKind,
  type OutcomeKind,
  type PlayerMarkets,
  type Selection,
} from './markets';
import type { Ticket, TicketStatus } from './ticket';

export interface Match {
  id: number;
  opponent: string;
  startsAt: string;
  home: boolean;
  venue: string | null;
  players: PlayerMarkets[];
}

export interface LeaderRow {
  nickname: string;
  coins: number;
}

/* ───────── righe del database ───────── */

interface DbEsito {
  id: number;
  codice: OutcomeKind;
  etichetta: string;
  pick: string;
  quota: number;
}

interface DbMercato {
  id: number;
  giocatore_id: string;
  tipo: MarketKind;
  gruppo: MarketGroup;
  etichetta: string;
  descrizione: string | null;
  linea: number | null;
  stato: string;
  esiti: DbEsito[];
}

interface DbPartita {
  id: number;
  avversario: string;
  data_ora: string;
  in_casa: boolean;
  luogo: string | null;
  mercati: DbMercato[];
}

interface DbSchedina {
  codice: string;
  token: string;
  nickname: string;
  created_at: string;
  stake: number;
  quota_base: number;
  bonus_pct: number;
  quota_totale: number;
  vincita_potenziale: number;
  vincita: number | null;
  stato: TicketStatus;
  selezioni: {
    mercato_id: number;
    esito_id: number;
    quota: number;
    codice: OutcomeKind;
    pick: string;
    giocatore_id: string;
    etichetta: string;
  }[];
}

/* ───────── errori ───────── */

const MESSAGES: Record<string, string> = {
  quote_cambiate: 'Alcune quote sono cambiate e le abbiamo aggiornate in schedina. Controllale e piazza di nuovo.',
  partita_chiusa: 'La partita è iniziata: le giocate sono chiuse.',
  mercato_non_disponibile: 'Un pronostico non è più disponibile ed è stato tolto dalla schedina. Controlla e piazza di nuovo.',
  esiti_duplicati: 'Puoi scegliere un solo esito per ogni mercato.',
  troppi_eventi: `Puoi giocare al massimo ${MAX_SELECTIONS} eventi per schedina.`,
  stake_non_valido: 'Scegli una puntata tra quelle proposte.',
  schedina_vuota: 'Aggiungi almeno un pronostico.',
  nickname_non_valido: 'Il nickname va da 3 a 20 caratteri: lettere, numeri, punto, trattino o underscore.',
  email_non_valida: 'Controlla l’indirizzo email, ad esempio nome@email.it.',
  limite_email: 'Hai raggiunto le 10 schedine di oggi con questa email. Riprova domani.',
  limite_rete: 'Troppe giocate da questa rete nell’ultima ora. Riprova più tardi.',
};

export class ApiError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function toApiError(err: { message?: string; code?: string } | null | undefined): ApiError {
  const raw = `${err?.code ?? ''} ${err?.message ?? ''}`;
  const code = Object.keys(MESSAGES).find((k) => raw.includes(k));
  if (code) return new ApiError(code, MESSAGES[code]);
  return new ApiError('unknown', 'Il server non ha risposto. Controlla la connessione e riprova.');
}

export function asApiError(e: unknown): ApiError {
  return e instanceof ApiError ? e : toApiError(e as { message?: string });
}

function client() {
  if (!supabase) throw new ApiError('off', 'Il gioco non è ancora attivo.');
  return supabase;
}

export const isConfigured = () => supabase !== null;

/* ───────── palinsesto ───────── */

const OUTCOME_ORDER: OutcomeKind[] = ['over', 'under', 'si', 'no'];
const rosterIndex = new Map(LOCKER_ROSTER.map((p, i) => [p.id, i]));

function toMarket(m: DbMercato): Market {
  return {
    id: String(m.id),
    kind: m.tipo,
    group: m.gruppo,
    label: m.etichetta,
    line: m.linea ?? undefined,
    hint: m.descrizione ?? undefined,
    outcomes: [...m.esiti]
      .sort((a, b) => OUTCOME_ORDER.indexOf(a.codice) - OUTCOME_ORDER.indexOf(b.codice))
      .map((e) => ({ id: String(e.id), kind: e.codice, label: e.etichetta, pick: e.pick, odds: Number(e.quota) })),
  };
}

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await client()
    .from('partite')
    .select('id, avversario, data_ora, in_casa, luogo, mercati(id, giocatore_id, tipo, gruppo, etichetta, descrizione, linea, stato, esiti(id, codice, etichetta, pick, quota))')
    .eq('stato', 'aperta')
    .gt('data_ora', new Date().toISOString())
    .order('data_ora');
  if (error) throw toApiError(error);

  return (data as unknown as DbPartita[]).map((p) => {
    const byPlayer = new Map<string, Market[]>();
    for (const m of p.mercati) {
      if (m.stato !== 'aperto' || !rosterIndex.has(m.giocatore_id)) continue;
      const list = byPlayer.get(m.giocatore_id) ?? [];
      list.push(toMarket(m));
      byPlayer.set(m.giocatore_id, list);
    }
    const players = [...byPlayer.entries()]
      .sort(([a], [b]) => rosterIndex.get(a)! - rosterIndex.get(b)!)
      .map(([id, markets]) => ({
        player: LOCKER_ROSTER[rosterIndex.get(id)!],
        markets: markets.sort((a, b) => Number(a.id) - Number(b.id)),
      }));
    return { id: p.id, opponent: p.avversario, startsAt: p.data_ora, home: p.in_casa, venue: p.luogo, players };
  });
}

/** Riallinea la schedina dopo un rifiuto del server: quote aggiornate, pronostici spariti rimossi. */
export function reconcile(selections: Selection[], matches: Match[]): Selection[] {
  const odds = new Map<string, number>();
  for (const m of matches) for (const p of m.players) for (const mk of p.markets) for (const o of mk.outcomes) odds.set(o.id, o.odds);
  return selections.filter((s) => odds.has(s.outcomeId)).map((s) => ({ ...s, odds: odds.get(s.outcomeId)! }));
}

/* ───────── schedine ───────── */

export async function placeTicket(selections: Selection[], stake: number, nickname: string, email: string) {
  const { data, error } = await client().rpc('piazza_schedina', {
    p_selezioni: selections.map((s) => ({ esito: Number(s.outcomeId), quota: s.odds })),
    p_stake: stake,
    p_nickname: nickname,
    p_email: email,
  });
  if (error) throw toApiError(error);
  return data as { codice: string; token: string };
}

export async function fetchTickets(tokens: string[]): Promise<Ticket[]> {
  if (tokens.length === 0) return [];
  const { data, error } = await client().rpc('le_mie_schedine', { p_token: tokens });
  if (error) throw toApiError(error);

  return (data as DbSchedina[]).map((t) => ({
    code: t.codice,
    token: t.token,
    createdAt: t.created_at,
    nickname: t.nickname,
    stake: t.stake,
    baseOdds: Number(t.quota_base),
    bonusPct: t.bonus_pct,
    totalOdds: Number(t.quota_totale),
    payout: t.vincita_potenziale,
    status: t.stato,
    winnings: t.vincita,
    selections: (t.selezioni ?? []).map((s) => {
      const p = LOCKER_ROSTER[rosterIndex.get(s.giocatore_id) ?? -1];
      return {
        key: String(s.mercato_id),
        outcomeId: String(s.esito_id),
        outcomeKind: s.codice,
        playerId: s.giocatore_id,
        firstName: p?.firstName ?? '',
        lastName: p?.lastName ?? s.giocatore_id,
        number: p?.number ?? 0,
        market: s.etichetta,
        pick: s.pick,
        odds: Number(s.quota),
      };
    }),
  }));
}

export async function fetchLeaderboard(): Promise<LeaderRow[]> {
  const { data, error } = await client().rpc('classifica', { p_limite: 10 });
  if (error) throw toApiError(error);
  return (data as { nickname: string; hyria_coin: number }[]).map((r) => ({ nickname: r.nickname, coins: r.hyria_coin }));
}
