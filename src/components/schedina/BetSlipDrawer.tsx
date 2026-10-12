import { useEffect, useId, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUpIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatOdds, nextBonus, type Selection, type SlipTotals } from '../../schedina/markets';
import { STAKES, formatCoins, potentialPayout } from '../../schedina/ticket';

interface BetSlipDrawerProps {
  selections: Selection[];
  totals: SlipTotals;
  nickname: string;
  onNickname: (v: string) => void;
  email: string;
  onEmail: (v: string) => void;
  stake: number;
  onStake: (v: number) => void;
  busy: boolean;
  error: string | null;
  onRemove: (key: string) => void;
  onClear: () => void;
  onPlace: () => void;
}

// stesse regole di piazza_schedina nel database
const NICK_RE = /^[A-Za-z0-9_.-]{3,20}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

function validate(nickname: string, email: string) {
  const errors: Partial<Record<'nickname' | 'email', string>> = {};
  const nick = nickname.trim();
  if (nick.length < 3) errors.nickname = 'Scegli un nickname di almeno 3 caratteri.';
  else if (!NICK_RE.test(nick)) errors.nickname = 'Usa da 3 a 20 caratteri tra lettere, numeri, punto, trattino o underscore.';
  const mail = email.trim();
  if (!mail) errors.email = 'Inserisci l’email: ti mandiamo lì l’esito e gli Hyria Coin vinti.';
  else if (!EMAIL_RE.test(mail) || mail.length > 254) errors.email = 'Controlla l’indirizzo email, ad esempio nome@email.it.';
  return errors;
}

const BetSlipDrawer = ({
  selections,
  totals,
  nickname,
  onNickname,
  email,
  onEmail,
  stake,
  onStake,
  busy,
  error,
  onRemove,
  onClear,
  onPlace,
}: BetSlipDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const formId = useId();
  const count = selections.length;
  const errors = validate(nickname, email);
  const shown = touched ? errors : {};
  const next = nextBonus(count);
  const payout = potentialPayout(totals.totalOdds, stake);

  // il cassetto mobile si chiude da solo quando la schedina si svuota
  useEffect(() => {
    if (count === 0) setOpen(false);
  }, [count]);

  // un errore del server deve restare visibile anche su mobile
  useEffect(() => {
    if (error && count > 0) setOpen(true);
  }, [error, count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (busy || count === 0 || Object.keys(errors).length) return;
    setTouched(false);
    onPlace();
  };

  return (
    <>
      {/* barra riassuntiva: solo mobile */}
      <button
        type="button"
        className={`slip-bar ${count ? 'is-visible' : ''}`}
        onClick={() => setOpen(true)}
        aria-hidden={!count}
        tabIndex={count ? 0 : -1}
      >
        <span className="slip-bar__count">{count}</span>
        <span className="slip-bar__label">{count === 1 ? 'pronostico' : 'pronostici'}</span>
        <span className="slip-bar__odds">
          <small>Quota</small>
          {formatOdds(totals.totalOdds)}
        </span>
        <ChevronUpIcon aria-hidden="true" />
      </button>
      {open && <div className="slip-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside className={`slip ${open ? 'is-open' : ''}`} aria-label="Schedina">
        <header className="slip__head">
          <h2>
            Schedina <span>{count}</span>
          </h2>
          {count > 0 && (
            <button type="button" className="slip__clear" onClick={onClear}>
              <TrashIcon aria-hidden="true" />
              Svuota
            </button>
          )}
          <button type="button" className="slip__close" aria-label="Chiudi schedina" onClick={() => setOpen(false)}>
            <XMarkIcon />
          </button>
        </header>

        {count === 0 ? (
          <div className="slip__empty">
            <p>Tocca una quota per aggiungere il primo pronostico.</p>
            <p>Con 3 eventi scatta il Bonus Hyria del 5%, con 5 il 10%, con 7 il 20%.</p>
          </div>
        ) : (
          <>
            <ul className="slip__list">
              <AnimatePresence initial={false}>
                {selections.map((s) => (
                  <motion.li
                    key={s.key}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.18 } }}
                    className="slip-item"
                  >
                    <span className="slip-item__num">{s.number}</span>
                    <div className="slip-item__body">
                      <p className="slip-item__player">{s.lastName}</p>
                      <p className="slip-item__pick">
                        {s.market} · {s.pick}
                      </p>
                    </div>
                    <strong className="slip-item__odds">{formatOdds(s.odds)}</strong>
                    <button type="button" className="slip-item__remove" aria-label={`Rimuovi ${s.lastName}, ${s.pick}`} onClick={() => onRemove(s.key)}>
                      <XMarkIcon />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <div className="slip__bonus" data-active={totals.bonusPct > 0}>
              {totals.bonusPct > 0 && <strong>Bonus Hyria +{totals.bonusPct}%</strong>}
              {next ? (
                <span>
                  Aggiungi {next.min - count} {next.min - count === 1 ? 'evento' : 'eventi'} per il +{next.pct}%
                </span>
              ) : (
                <span>Bonus massimo raggiunto</span>
              )}
            </div>

            <form className="slip__form" id={formId} onSubmit={submit} noValidate>
              <label className="slip-field">
                <span>Nickname</span>
                <input
                  type="text"
                  value={nickname}
                  placeholder="TifosoHyria99"
                  autoComplete="off"
                  maxLength={20}
                  aria-invalid={!!shown.nickname}
                  aria-describedby={`${formId}-nick`}
                  onChange={(e) => onNickname(e.target.value)}
                />
                {shown.nickname ? (
                  <small role="alert" className="is-error">
                    {shown.nickname}
                  </small>
                ) : (
                  <small id={`${formId}-nick`}>Compare sul biglietto e in classifica. Non usare nome e cognome.</small>
                )}
              </label>

              <label className="slip-field">
                <span>Email</span>
                <input
                  type="email"
                  value={email}
                  placeholder="nome@email.it"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!shown.email}
                  aria-describedby={`${formId}-mail`}
                  onChange={(e) => onEmail(e.target.value)}
                />
                {shown.email ? (
                  <small role="alert" className="is-error">
                    {shown.email}
                  </small>
                ) : (
                  <small id={`${formId}-mail`}>Solo per mandarti l’esito e gli Hyria Coin vinti dopo la partita. Non la mostriamo a nessuno.</small>
                )}
              </label>

              <fieldset className="slip-stake">
                <legend>Hyria Coin da giocare</legend>
                <div>
                  {STAKES.map((v) => (
                    <button key={v} type="button" aria-pressed={stake === v} className={stake === v ? 'is-active' : ''} onClick={() => onStake(v)}>
                      {v}
                    </button>
                  ))}
                </div>
              </fieldset>
            </form>

            <dl className="slip__totals">
              <div>
                <dt>Quota totale</dt>
                <dd className="slip__total-odds">
                  {totals.bonusPct > 0 && <s>{formatOdds(totals.baseOdds)}</s>}
                  {formatOdds(totals.totalOdds)}
                </dd>
              </div>
              <div>
                <dt>Vincita potenziale</dt>
                <dd className="slip__payout">{formatCoins(payout)}</dd>
              </div>
            </dl>

            {error && (
              <p className="slip__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" form={formId} className="slip__cta" disabled={busy}>
              {busy ? 'Piazzo la schedina…' : 'Piazza schedina'}
            </button>
          </>
        )}
      </aside>
    </>
  );
};

export default BetSlipDrawer;
