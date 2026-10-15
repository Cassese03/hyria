import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import PageHead from '../components/PageHead';
import LoadingPage from '../components/LoadingPage';
import type { LoaderProps } from '../loaders/shared';
import '../styles/loaders.css';
import '../styles/loader-preview.css';

/* Pagina temporanea per confrontare i loading screen 3D: non è nel menu né nella sitemap */

const importers = {
  swish: () => import('../loaders/SwishLoader'),
  rovine: () => import('../loaders/RovineLoader'),
  arena: () => import('../loaders/ArenaLuciLoader'),
};

interface Option {
  id: string;
  n: string;
  name: string;
  desc: string;
  Component: ComponentType<LoaderProps> | LazyExoticComponent<ComponentType<LoaderProps>>;
}

const OPTIONS: Option[] = [
  {
    id: 'swish',
    n: '01',
    name: 'Swish',
    desc: 'Il pallone gira sul ferro mentre il cronometro dei 24" scende col caricamento. Poi entra pulito e dal canestro esce lo stemma.',
    Component: lazy(importers.swish),
  },
  {
    id: 'rovine',
    n: '02',
    name: 'Le Rovine di Hyria',
    desc: 'Tra colonne antiche, un tondo a figure rosse come le anfore nolane si ricompone coccio dopo coccio. Alla fine le crepe si accendono d’arancio.',
    Component: lazy(importers.rovine),
  },
  {
    id: 'arena',
    n: '04',
    name: 'Luci dell’Arena',
    desc: 'Il palazzetto è al buio e i riflettori si accendono a coppie. L’ultimo illumina lo stemma a centrocampo, poi la camera ci si tuffa dentro.',
    Component: lazy(importers.arena),
  },
  {
    id: 'attuale',
    n: '—',
    name: 'Precedente',
    desc: 'La griglia di quadretti usata prima di Swish. Resta come riserva sui dispositivi senza grafica 3D.',
    Component: LoadingPage,
  },
];

const DURATIONS = [
  { label: 'Veloce · 1s', ms: 1000 },
  { label: 'Normale · 2,5s', ms: 2500 },
  { label: 'Lenta · 6s', ms: 6000 },
];

const LoaderPreview = () => {
  const [duration, setDuration] = useState(2500);
  const [queue, setQueue] = useState<string[]>([]);
  const [run, setRun] = useState(0);
  const [loading, setLoading] = useState(false);
  const current = OPTIONS.find((o) => o.id === queue[0]);

  // scarica subito le scene così il confronto non dipende dalla rete
  useEffect(() => {
    Object.values(importers).forEach((load) => void load());
  }, []);

  // ogni scena parte "in caricamento" e finisce dopo la durata scelta
  useEffect(() => {
    if (!current) return;
    const id = window.setTimeout(() => setLoading(false), duration);
    return () => window.clearTimeout(id);
  }, [current, run, duration]);

  const play = (ids: string[]) => {
    setLoading(true);
    setQueue(ids);
    setRun((r) => r + 1);
  };

  const next = useCallback(() => {
    setLoading(true);
    setQueue((q) => q.slice(1));
    setRun((r) => r + 1);
  }, []);

  return (
    <div className="lp">
      <PageHead title="Anteprima loading | Hyria Basket" />

      <section className="lp__wrap">
        <p className="lp__eyebrow">Anteprima interna</p>
        <h1 className="lp__title">Scegli il loading screen</h1>
        <p className="lp__lead">
          Ogni scena segue il caricamento vero: la barra avanza, e quando il sito è pronto parte il finale. Con la
          durata puoi vedere come si comporta su una connessione veloce o lenta.
        </p>

        <div className="lp__durations">
          <span className="lp__label">Caricamento simulato</span>
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              type="button"
              onClick={() => setDuration(d.ms)}
              className={`lp__chip${duration === d.ms ? ' is-active' : ''}`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="lp__grid">
          {OPTIONS.map((o) => (
            <article key={o.id} className={`lp__card${o.id === 'attuale' ? ' is-muted' : ''}`}>
              <div className="lp__card-head">
                <span className="lp__num">{o.n}</span>
                <h2 className="lp__name">{o.name}</h2>
              </div>
              <p className="lp__desc">{o.desc}</p>
              <button type="button" onClick={() => play([o.id])} className="lp__play">
                <PlayIcon className="lp__icon" />
                Guarda
              </button>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => play(OPTIONS.filter((o) => o.id !== 'attuale').map((o) => o.id))}
          className="lp__all"
        >
          <PlayIcon className="lp__icon" />
          Guardale tutte di fila
        </button>
      </section>

      {current && (
        <>
          <Suspense fallback={<div className="hl-loader" />}>
            <current.Component key={`${current.id}-${run}`} isLoading={loading} onAnimationEnd={next} />
          </Suspense>
          <div className="lp__badge">
            <span className="lp__badge-num">{current.n}</span>
            {current.name}
            <button type="button" onClick={() => setQueue([])} aria-label="Chiudi anteprima" className="lp__close">
              <XMarkIcon className="lp__icon" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoaderPreview;
