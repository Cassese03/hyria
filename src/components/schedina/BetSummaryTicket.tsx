import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, ArrowPathIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatOdds } from '../../schedina/markets';
import { STATUS_LABEL, formatCoins, formatDate, renderTicketPng, shareText, shareUrl, type Ticket } from '../../schedina/ticket';

interface BetSummaryTicketProps {
  ticket: Ticket;
  /** true appena piazzata, false quando la si riapre dallo storico. */
  fresh: boolean;
  onClose: () => void;
  onNew: () => void;
}

function barcode(code: string) {
  let seed = 0;
  for (const ch of code) seed = Math.imul(seed ^ ch.charCodeAt(0), 2654435761) >>> 0;
  const bars: number[] = [];
  for (let i = 0; i < 64; i++) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0;
    bars.push(1 + (seed % 4));
  }
  return bars;
}

const BetSummaryTicket = ({ ticket, fresh, onClose, onNew }: BetSummaryTicketProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const firstAction = useRef<HTMLButtonElement>(null);
  const bars = useMemo(() => barcode(ticket.code), [ticket.code]);
  const text = shareText(ticket);

  useEffect(() => {
    // senza preventScroll il biglietto lungo si aprirebbe già scrollato fino ai bottoni
    firstAction.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const download = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const blob = await renderTicketPng(ticket);
      if (!blob) throw new Error('canvas');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedina-${ticket.code}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Biglietto scaricato.');
    } catch {
      setStatus('Il browser non ha generato l’immagine. Fai uno screenshot del biglietto.');
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl()}`);
      setStatus('Testo e link copiati negli appunti.');
    } catch {
      setStatus('Copia non riuscita: seleziona il testo dal messaggio WhatsApp.');
    }
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text}\n${shareUrl()}`)}`;

  return (
    <div className="ticket-modal" role="dialog" aria-modal="true" aria-labelledby="ticket-title">
      <div className="ticket-modal__scrim" onClick={onClose} aria-hidden="true" />

      <motion.div
        className="ticket-modal__body"
        initial={{ opacity: 0, y: fresh ? 60 : 20, rotate: fresh ? -2 : 0 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className="ticket-modal__close" aria-label="Chiudi" onClick={onClose}>
          <XMarkIcon />
        </button>

        <div className="ticket">
          <header className="ticket__head">
            <img src="/images/logo-hyria.png" alt="" width={56} height={56} />
            <div>
              <p className="ticket__club">ASD Hyria Basket</p>
              <p className="ticket__sub">Schedina virtuale · Hyria Coin</p>
            </div>
            <p className="ticket__code" id="ticket-title">
              #{ticket.code}
            </p>
          </header>

          <dl className="ticket__meta">
            <div>
              <dt>Giocata da</dt>
              <dd>{ticket.nickname}</dd>
            </div>
            <div>
              <dt>Data e ora</dt>
              <dd>{formatDate(ticket.createdAt)}</dd>
            </div>
          </dl>

          <ol className="ticket__rows">
            {ticket.selections.map((s) => (
              <li key={s.key}>
                <span className="ticket__num">{s.number}</span>
                <div>
                  <p className="ticket__player">
                    {s.firstName.charAt(0)}. {s.lastName}
                  </p>
                  <p className="ticket__pick">
                    {s.market} · {s.pick}
                  </p>
                </div>
                <strong>{formatOdds(s.odds)}</strong>
              </li>
            ))}
          </ol>

          <dl className="ticket__lines">
            <div>
              <dt>Quota base</dt>
              <dd>{formatOdds(ticket.baseOdds)}</dd>
            </div>
            {ticket.bonusPct > 0 && (
              <div className="is-bonus">
                <dt>Bonus Hyria</dt>
                <dd>+{ticket.bonusPct}%</dd>
              </div>
            )}
            <div>
              <dt>Giocati</dt>
              <dd>{formatCoins(ticket.stake)}</dd>
            </div>
            {ticket.status !== 'in_corso' && (
              <div className={`is-status is-${ticket.status}`}>
                <dt>Esito</dt>
                <dd>
                  {STATUS_LABEL[ticket.status]}
                  {ticket.winnings ? ` · ${formatCoins(ticket.winnings)}` : ''}
                </dd>
              </div>
            )}
          </dl>

          <div className="ticket__totals">
            <div>
              <p>Quota totale</p>
              <strong>{formatOdds(ticket.totalOdds)}</strong>
            </div>
            <div>
              <p>Vincita potenziale</p>
              <strong className="is-payout">{formatCoins(ticket.payout)}</strong>
            </div>
          </div>

          <footer className="ticket__foot" aria-hidden="true">
            <div className="ticket__barcode">
              {bars.map((w, i) => (
                <i key={i} style={{ width: w }} />
              ))}
            </div>
            <p>{ticket.code.split('').join(' ')}</p>
          </footer>
        </div>

        <div className="ticket-actions">
          <button ref={firstAction} type="button" className="ticket-actions__primary" onClick={download} disabled={busy}>
            <ArrowDownTrayIcon aria-hidden="true" />
            {busy ? 'Preparo l’immagine…' : 'Scarica biglietto (PNG)'}
          </button>
          <a className="ticket-actions__btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"
              />
            </svg>
            Condividi su WhatsApp
          </a>
          <button type="button" className="ticket-actions__btn" onClick={copy}>
            <LinkIcon aria-hidden="true" />
            Copia testo e link
          </button>
          <button type="button" className="ticket-actions__btn" onClick={onNew}>
            <ArrowPathIcon aria-hidden="true" />
            Nuova schedina
          </button>
          <p className="ticket-actions__status" role="status">
            {status}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BetSummaryTicket;
