import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import ArenaPageHero from '../components/ArenaPageHero';
import '../styles/classifica.css';

const CLASSIFICA_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-yoKJ6mZg-97DM9iw6Ig4zZd5-PyR1uqlySH2q9uUAcdJbjavJ_d4nWK2Lx9wojFcV8uFoPyTU1bQ/pub?gid=0&single=true&output=csv';

interface Row {
  pos: string;
  team: string;
  points: string;
  played?: string;
  wins?: string;
  losses?: string;
}

// Colonne opzionali: compaiono se il foglio le contiene (riconosciute dall'intestazione)
const OPTIONAL: { key: 'played' | 'wins' | 'losses'; label: string; title: string; names: string[] }[] = [
  { key: 'played', label: 'G', title: 'Partite giocate', names: ['g', 'giocate', 'partite'] },
  { key: 'wins', label: 'V', title: 'Vittorie', names: ['v', 'vinte', 'vittorie'] },
  { key: 'losses', label: 'P', title: 'Sconfitte', names: ['p', 'perse', 'sconfitte'] },
];

/** CSV pubblicato da Google Sheets: gestisce anche le virgole tra virgolette */
function parseCsv(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      const cells: string[] = [];
      let cur = '';
      let quoted = false;
      for (const ch of line) {
        if (ch === '"') quoted = !quoted;
        else if (ch === ',' && !quoted) {
          cells.push(cur.trim());
          cur = '';
        } else cur += ch;
      }
      cells.push(cur.trim());
      return cells;
    });
}

function toRows(table: string[][]): Row[] {
  const [head, ...body] = table;
  const names = head.map((h) => h.toLowerCase());
  const find = (...keys: string[]) => names.findIndex((n) => keys.includes(n));
  const teamCol = Math.max(find('squadra', 'team'), 1);
  const ptsCol = find('punti', 'pt', 'pts');
  const pointsCol = ptsCol >= 0 ? ptsCol : 2;
  const optional = OPTIONAL.map((o) => ({ key: o.key, col: find(...o.names) }));
  return body
    .filter((r) => r[teamCol])
    .map((r) => {
      const row: Row = { pos: r[0], team: r[teamCol], points: r[pointsCol] ?? '' };
      optional.forEach(({ key, col }) => {
        if (col >= 0) row[key] = r[col];
      });
      return row;
    });
}

const isHyria = (team: string) => team.toUpperCase().includes('HYRIA');

const Calendario = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    setState('loading');
    try {
      const res = await fetch(CLASSIFICA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = toRows(parseCsv(await res.text()));
      if (!data.length) throw new Error('Classifica vuota');
      setRows(data);
      setState('ready');
    } catch (error) {
      console.error('Errore caricamento classifica:', error);
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = OPTIONAL.filter((o) => rows.some((r) => r[o.key] !== undefined));
  const hyria = rows.find((r) => isHyria(r.team));

  // il tabellone del palazzetto mostra la nostra posizione
  const jumbo = useMemo(
    () =>
      hyria
        ? {
            title: 'Classifica',
            columns: [
              { value: `${hyria.pos}°`, label: 'Posizione' },
              { value: hyria.points || '0', label: 'Punti' },
            ],
          }
        : undefined,
    [hyria],
  );

  return (
    <>
      <PageHead {...seoFor('/calendario')} />

      <div className="pg">
        <ArenaPageHero
          shot="classifica"
          floorTitle="Classifica"
          kicker="Stagione 2026/27 · Serie DR2"
          title="Classifica"
          lead={
            hyria
              ? `Hyria è ${hyria.pos}ª con ${hyria.points || 0} punti. Segui il campionato giornata dopo giornata.`
              : 'Segui il campionato di Hyria Basket giornata dopo giornata.'
          }
          image="/images/1.jpg"
          jumbo={jumbo}
          actions={
            <a href="#classifica" className="hy-btn hy-btn--primary">
              Vedi la classifica
            </a>
          }
        />

        <section id="classifica" className="pg-sec">
          <div className="pg-wrap">
            <header className="pg-head cl-head">
              <h2 className="hy-h2">Classifica generale</h2>
              <p>Aggiornata automaticamente dalla piattaforma ufficiale del campionato.</p>
            </header>

            {state === 'loading' && (
              <p className="cl-status" role="status">
                Carico la classifica…
              </p>
            )}

            {state === 'error' && (
              <div className="cl-status cl-status--error" role="alert">
                <p>Non riesco a caricare la classifica in questo momento. Controlla la connessione e riprova.</p>
                <button type="button" className="hy-btn hy-btn--ghost" onClick={load}>
                  Riprova
                </button>
              </div>
            )}

            {state === 'ready' && (
              <div className="cl-board">
                <table className="cl-table">
                  <caption className="cl-sr">Classifica Serie DR2, stagione 2026/27</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="cl-pos">
                        <abbr title="Posizione">#</abbr>
                      </th>
                      <th scope="col" className="cl-team">
                        Squadra
                      </th>
                      {columns.map((c) => (
                        <th scope="col" key={c.key} className="cl-num">
                          <abbr title={c.title}>{c.label}</abbr>
                        </th>
                      ))}
                      <th scope="col" className="cl-num cl-pts">
                        <abbr title="Punti">PT</abbr>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const us = isHyria(r.team);
                      return (
                        <tr key={`${r.pos}-${r.team}`} className={us ? 'is-us' : undefined}>
                          <td className="cl-pos">{r.pos}</td>
                          <th scope="row" className="cl-team">
                            {r.team}
                            {us && <span className="cl-badge">Noi</span>}
                          </th>
                          {columns.map((c) => (
                            <td key={c.key} className="cl-num">
                              {r[c.key] ?? '–'}
                            </td>
                          ))}
                          <td className="cl-num cl-pts">{r.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Calendario;
