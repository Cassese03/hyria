import { Suspense, lazy, useCallback, useEffect, useState, type ComponentType, type LazyExoticComponent } from 'react';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import PageHead from '../components/PageHead';
import LoadingPage from '../components/LoadingPage';
import type { LoaderProps } from '../loaders/shared';
import '../styles/loaders.css';

/* Pagina temporanea per confrontare i loading screen 3D: non è nel menu né nella sitemap */

const importers = {
  swish: () => import('../loaders/SwishLoader'),
  rovine: () => import('../loaders/RovineLoader'),
  arena: () => import('../loaders/ArenaLuciLoader'),
  particelle: () => import('../loaders/ParticelleLoader'),
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
    id: 'particelle',
    n: '06',
    name: 'Stemma + Particelle',
    desc: 'Lo stemma in rilievo al centro. Migliaia di scintille formano un pallone che gli gira alle spalle, poi esplodono verso lo schermo.',
    Component: lazy(importers.particelle),
  },
  {
    id: 'attuale',
    n: '—',
    name: 'Attuale',
    desc: 'La griglia di quadretti di adesso, per avere un termine di paragone.',
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
    <div className="min-h-screen bg-hyria-dark text-hyria-light">
      <PageHead title="Anteprima loading | Hyria Basket" />

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-hyria-orange">Anteprima interna</p>
        <h1 className="mt-3 font-heading text-3xl md:text-5xl">Scegli il loading screen</h1>
        <p className="mt-4 max-w-2xl text-sm text-white/70 md:text-base">
          Ogni scena segue il caricamento vero: la barra avanza, e quando il sito è pronto parte il finale. Con la
          durata puoi vedere come si comporta su una connessione veloce o lenta.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Caricamento simulato</span>
          {DURATIONS.map((d) => (
            <button
              key={d.ms}
              type="button"
              onClick={() => setDuration(d.ms)}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                duration === d.ms
                  ? 'border-hyria-orange bg-hyria-orange text-white'
                  : 'border-white/20 text-white/70 hover:border-white/50'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <article
              key={o.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                o.id === 'attuale' ? 'border-white/10 bg-white/[0.02]' : 'border-white/10 bg-hyria-primary/40'
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-2xl text-hyria-orange">{o.n}</span>
                <h2 className="text-lg font-extrabold uppercase tracking-wide">{o.name}</h2>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{o.desc}</p>
              <button
                type="button"
                onClick={() => play([o.id])}
                className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-hyria-primary transition-transform hover:scale-[1.03] active:scale-95"
              >
                <PlayIcon className="h-4 w-4" />
                Guarda
              </button>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => play(OPTIONS.filter((o) => o.id !== 'attuale').map((o) => o.id))}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-hyria-orange px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-transform hover:scale-[1.03] active:scale-95"
        >
          <PlayIcon className="h-5 w-5" />
          Guardale tutte di fila
        </button>
      </section>

      {current && (
        <>
          <Suspense fallback={<div className="hl-loader" />}>
            <current.Component key={`${current.id}-${run}`} isLoading={loading} onAnimationEnd={next} />
          </Suspense>
          <div className="fixed left-4 top-4 z-[10000] flex items-center gap-3 rounded-full bg-black/50 py-2 pl-4 pr-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
            <span className="text-hyria-orange">{current.n}</span>
            {current.name}
            <button
              type="button"
              onClick={() => setQueue([])}
              aria-label="Chiudi anteprima"
              className="rounded-full p-1 hover:bg-white/10"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoaderPreview;
