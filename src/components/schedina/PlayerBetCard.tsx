import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { formatOdds, type Market, type MarketGroup, type Outcome, type PlayerMarkets } from '../../schedina/markets';

interface PlayerBetCardProps {
  data: PlayerMarkets;
  /** marketId → outcomeId scelto per questo giocatore. */
  picks: Record<string, string>;
  onPick: (data: PlayerMarkets, market: Market, outcome: Outcome) => void;
}

const TABS: { id: MarketGroup; label: string }[] = [
  { id: 'stat', label: 'Statistiche' },
  { id: 'special', label: 'Speciali' },
];

const PlayerBetCard = ({ data, picks, onPick }: PlayerBetCardProps) => {
  const { player, markets } = data;
  const [tab, setTab] = useState<MarketGroup>('stat');
  const picked = Object.keys(picks).length;

  return (
    <article className="bet-card" aria-labelledby={`bet-${player.id}`}>
      <header className="bet-card__head">
        <span className="bet-card__num" aria-hidden="true">
          {player.number}
        </span>
        <div className="bet-card__who">
          <h3 id={`bet-${player.id}`}>
            <span>{player.firstName}</span>
            {player.lastName}
          </h3>
          <p>
            {player.role} · n. {player.number}
          </p>
        </div>
        {picked > 0 && (
          <span className="bet-card__count" aria-label={`${picked} pronostici in schedina`}>
            {picked}
          </span>
        )}
      </header>

      <div className="bet-card__tabs" role="tablist" aria-label={`Mercati di ${player.lastName}`}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'is-active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="bet-card__markets" role="tabpanel">
        {markets
          .filter((m) => m.group === tab)
          .map((m) => (
            <li key={m.id} className="bet-market">
              <div className="bet-market__name">
                <span>{m.label}</span>
                {m.hint ? <small>{m.hint}</small> : m.line !== undefined && <em>{m.line}</em>}
              </div>
              <div className={`bet-market__odds ${m.outcomes.length === 1 ? 'is-single' : ''}`}>
                {m.outcomes.map((o) => {
                  const active = picks[m.id] === o.id;
                  return (
                    <motion.button
                      key={o.id}
                      type="button"
                      className={`bet-odd ${active ? 'is-active' : ''}`}
                      aria-pressed={active}
                      aria-label={`${player.lastName}, ${o.pick}, quota ${formatOdds(o.odds)}`}
                      onClick={() => onPick(data, m, o)}
                      whileTap={{ scale: 0.94 }}
                      animate={active ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28 }}
                    >
                      <span>{o.label}</span>
                      <strong>{formatOdds(o.odds)}</strong>
                    </motion.button>
                  );
                })}
              </div>
            </li>
          ))}
      </ul>
    </article>
  );
};

export default memo(PlayerBetCard);
