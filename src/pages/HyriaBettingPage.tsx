import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PageHead from '../components/PageHead';
import PlayerBetCard from '../components/schedina/PlayerBetCard';
import BetSlipDrawer from '../components/schedina/BetSlipDrawer';
import BetSummaryTicket from '../components/schedina/BetSummaryTicket';
import { CATEGORY_ORDER, type LockerCategory } from '../locker/roster';
import { MAX_SELECTIONS, formatOdds, slipTotals, type Market, type Outcome, type PlayerMarkets, type Selection } from '../schedina/markets';
import { STATUS_LABEL, formatCoins, formatDate, type Ticket } from '../schedina/ticket';
import { loadDevice, saveDevice } from '../schedina/device';
import {
  asApiError,
  fetchLeaderboard,
  fetchMatches,
  fetchTickets,
  isConfigured,
  placeTicket,
  reconcile,
  type LeaderRow,
  type Match,
} from '../schedina/api';
import '../styles/schedina.css';

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Bebas+Neue&family=Graduate&display=swap';
const NO_PICKS: Record<string, string> = {};
/** Errori dopo i quali il palinsesto in pagina non è più affidabile. */
const STALE_ERRORS = new Set(['quote_cambiate', 'mercato_non_disponibile', 'partita_chiusa']);

type Filter = 'TUTTI' | LockerCategory;
const FILTERS: Filter[] = ['TUTTI', ...CATEGORY_ORDER];
type Load = 'loading' | 'ready' | 'error' | 'off';

const matchDay = (iso: string) =>
  new Date(iso).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Rome' });
const matchTime = (iso: string) => new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });

const HyriaBettingPage = () => {
  const [device] = useState(loadDevice);
  const [load, setLoad] = useState<Load>(isConfigured() ? 'loading' : 'off');
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchId, setMatchId] = useState<number | null>(null);
  const [tokens, setTokens] = useState<string[]>(device.tokens);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);

  const [selections, setSelections] = useState<Selection[]>([]);
  const [nickname, setNickname] = useState(device.nickname);
  const [email, setEmail] = useState(device.email);
  const [stake, setStake] = useState(10);
  const [busy, setBusy] = useState(false);
  const [slipError, setSlipError] = useState<string | null>(null);

  const [filter, setFilter] = useState<Filter>('TUTTI');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState<{ ticket: Ticket; fresh: boolean } | null>(null);

  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);

  // pagina ancora in prova: fuori dai motori di ricerca finché non torna nel menu
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!isConfigured()) return;
    let cancelled = false;
    (async () => {
      try {
        const [list, history, board] = await Promise.all([fetchMatches(), fetchTickets(device.tokens), fetchLeaderboard()]);
        if (cancelled) return;
        setMatches(list);
        setMatchId(list[0]?.id ?? null);
        setTickets(history);
        setLeaders(board);
        setLoad('ready');
      } catch {
        if (!cancelled) setLoad('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [device]);

  // nickname, email e chiavi delle schedine restano su questo dispositivo
  useEffect(() => {
    saveDevice({ nickname, email, tokens });
  }, [nickname, email, tokens]);

  const match = matches.find((m) => m.id === matchId) ?? null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (match?.players ?? []).filter(({ player: p }) => {
      if (filter !== 'TUTTI' && p.category !== filter) return false;
      if (!q) return true;
      return String(p.number) === q || `${p.firstName} ${p.lastName}`.toLowerCase().includes(q);
    });
  }, [match, filter, query]);

  const picksByPlayer = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    for (const s of selections) (map[s.playerId] ??= {})[s.key] = s.outcomeId;
    return map;
  }, [selections]);

  const totals = useMemo(() => slipTotals(selections), [selections]);

  const onPick = useCallback(
    ({ player }: PlayerMarkets, market: Market, outcome: Outcome) => {
      const full = !selections.some((s) => s.key === market.id) && selections.length >= MAX_SELECTIONS;
      setSlipError(full ? `Puoi giocare al massimo ${MAX_SELECTIONS} eventi per schedina.` : null);
      const next: Selection = {
        key: market.id,
        outcomeId: outcome.id,
        outcomeKind: outcome.kind,
        playerId: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        number: player.number,
        market: market.label,
        pick: outcome.pick,
        odds: outcome.odds,
      };
      // aggiornamento funzionale: più clic ravvicinati non si sovrascrivono
      setSelections((prev) => {
        const existing = prev.find((s) => s.key === market.id);
        if (existing?.outcomeId === outcome.id) return prev.filter((s) => s.key !== market.id);
        // stesso mercato, esito diverso: sostituisce mantenendo la posizione in schedina
        if (existing) return prev.map((s) => (s.key === market.id ? next : s));
        return prev.length >= MAX_SELECTIONS ? prev : [...prev, next];
      });
    },
    [selections],
  );

  const removeSelection = (key: string) => {
    setSlipError(null);
    setSelections((prev) => prev.filter((s) => s.key !== key));
  };

  const place = async () => {
    setBusy(true);
    setSlipError(null);
    try {
      const { codice, token } = await placeTicket(selections, stake, nickname.trim(), email.trim());
      const nextTokens = [token, ...tokens];
      setTokens(nextTokens);
      const history = await fetchTickets(nextTokens);
      setTickets(history);
      const placed = history.find((t) => t.code === codice);
      if (placed) setShown({ ticket: placed, fresh: true });
    } catch (e) {
      const err = asApiError(e);
      setSlipError(err.message);
      if (STALE_ERRORS.has(err.code)) {
        const list = await fetchMatches().catch(() => null);
        if (list) {
          setMatches(list);
          setSelections((prev) => reconcile(prev, list));
          if (!list.some((m) => m.id === matchId)) setMatchId(list[0]?.id ?? null);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const closeTicket = useCallback(() => setShown(null), []);

  const startNew = () => {
    setSelections([]);
    setShown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PageHead
        title="Schedina virtuale – Hyria Basket"
        description="Pronostica la partita dei giocatori di Hyria Basket con la schedina virtuale: gioco amatoriale tra tifosi, senza soldi veri."
        canonicalUrl="https://hyriabasket.it/schedina"
        ogUrl="https://hyriabasket.it/schedina"
      />

      <div className="bet-page">
        <header className="bet-hero">
          <h1>La schedina dello spogliatoio</h1>
          {match ? (
            <p className="bet-hero__match">
              <span className="bet-hero__teams">
                {match.home ? `Hyria Basket – ${match.opponent}` : `${match.opponent} – Hyria Basket`}
              </span>
              <span>
                {matchDay(match.startsAt)}, palla a due alle {matchTime(match.startsAt)}
                {match.venue ? ` · ${match.venue}` : ''}
              </span>
            </p>
          ) : (
            <p className="bet-hero__lede">
              Scegli i tuoi giocatori, pronostica la loro partita e sfida gli altri tifosi a colpi di Hyria Coin.
            </p>
          )}
          <p className="bet-hero__note">
            Gioco amatoriale tra tifosi: gli Hyria Coin non hanno alcun valore e non si vince denaro. Le quote sono inventate per divertimento.
            L’email serve solo a mandarti l’esito: non la mostriamo e non la usiamo per altro.
          </p>
        </header>

        <div className="bet-layout">
          <section className="bet-roster" aria-label="Roster e quote">
            {matches.length > 1 && (
              <div className="bet-matches" role="group" aria-label="Scegli la partita">
                {matches.map((m) => (
                  <button key={m.id} type="button" aria-pressed={m.id === matchId} className={m.id === matchId ? 'is-active' : ''} onClick={() => setMatchId(m.id)}>
                    <strong>{m.opponent}</strong>
                    <span>{formatDate(m.startsAt)}</span>
                  </button>
                ))}
              </div>
            )}

            {load === 'loading' && (
              <div className="bet-grid" aria-busy="true" aria-label="Carico il palinsesto">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bet-card bet-card--skeleton" />
                ))}
              </div>
            )}

            {load === 'off' && (
              <div className="bet-empty">
                <p>Le giocate non sono ancora attive. Torna presto: il palinsesto esce qualche giorno prima di ogni partita.</p>
                {import.meta.env.DEV && <p className="bet-empty__dev">Sviluppo: imposta SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY in .env.local.</p>}
              </div>
            )}

            {load === 'error' && (
              <div className="bet-empty">
                <p>Non riesco a caricare il palinsesto. Controlla la connessione e ricarica la pagina.</p>
                <button type="button" onClick={() => window.location.reload()}>
                  Ricarica la pagina
                </button>
              </div>
            )}

            {load === 'ready' && !match && (
              <div className="bet-empty">
                <p>Nessuna partita aperta in questo momento. Il palinsesto esce qualche giorno prima della palla a due.</p>
              </div>
            )}

            {match && (
              <>
                <div className="bet-filters">
                  <div className="bet-filters__chips" role="group" aria-label="Filtra per reparto">
                    {FILTERS.map((f) => (
                      <button key={f} type="button" aria-pressed={filter === f} className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <label className="bet-filters__search">
                    <MagnifyingGlassIcon aria-hidden="true" />
                    <span className="bet-sr">Cerca giocatore</span>
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cognome o numero di maglia" />
                  </label>
                </div>

                {visible.length === 0 ? (
                  <div className="bet-empty">
                    <p>
                      {query ? `Nessun giocatore corrisponde a “${query}”. Prova con il cognome o il numero di maglia.` : 'Nessun giocatore in palinsesto per questo reparto.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setFilter('TUTTI');
                      }}
                    >
                      Mostra tutto il roster
                    </button>
                  </div>
                ) : (
                  <div className="bet-grid">
                    {visible.map((d) => (
                      <PlayerBetCard key={d.player.id} data={d} picks={picksByPlayer[d.player.id] ?? NO_PICKS} onPick={onPick} />
                    ))}
                  </div>
                )}
              </>
            )}

            {tickets.length > 0 && (
              <section className="bet-history" aria-labelledby="bet-history-title">
                <h2 id="bet-history-title">Le tue schedine</h2>
                <ul>
                  {tickets.map((t) => (
                    <li key={t.code}>
                      <button type="button" onClick={() => setShown({ ticket: t, fresh: false })}>
                        <span className="bet-history__code">#{t.code}</span>
                        <span className="bet-history__odds">{formatOdds(t.totalOdds)}</span>
                        <span className="bet-history__date">
                          {formatDate(t.createdAt)} · {t.selections.length} {t.selections.length === 1 ? 'pronostico' : 'pronostici'}
                        </span>
                        <span className={`bet-history__status is-${t.status}`}>
                          {STATUS_LABEL[t.status]}
                          {t.status === 'in_corso' ? ` · ${formatCoins(t.payout)}` : t.status === 'vinta' && t.winnings ? ` · +${formatCoins(t.winnings)}` : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="bet-history__privacy">
                  Lo storico è salvato su questo dispositivo; l’esito di ogni partita arriva comunque per email. Per cancellare il tuo indirizzo scrivi a{' '}
                  <a href="mailto:info@hyriabasket.it">info@hyriabasket.it</a>.
                </p>
              </section>
            )}

            {leaders.length > 0 && (
              <section className="bet-leaders" aria-labelledby="bet-leaders-title">
                <h2 id="bet-leaders-title">Classifica Hyria Coin</h2>
                <ol>
                  {leaders.map((r, i) => (
                    <li key={`${r.nickname}-${i}`} className={r.nickname === nickname.trim() ? 'is-me' : ''}>
                      <span className="bet-leaders__pos">{i + 1}</span>
                      <span className="bet-leaders__name">{r.nickname}</span>
                      <span className="bet-leaders__coins">{formatCoins(r.coins)}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </section>

          <BetSlipDrawer
            selections={selections}
            totals={totals}
            nickname={nickname}
            onNickname={setNickname}
            email={email}
            onEmail={setEmail}
            stake={stake}
            onStake={setStake}
            busy={busy}
            error={slipError}
            onRemove={removeSelection}
            onClear={() => {
              setSlipError(null);
              setSelections([]);
            }}
            onPlace={place}
          />
        </div>
      </div>

      <AnimatePresence>
        {shown && <BetSummaryTicket key={shown.ticket.code} ticket={shown.ticket} fresh={shown.fresh} onClose={closeTicket} onNew={startNew} />}
      </AnimatePresence>
    </>
  );
};

export default HyriaBettingPage;
