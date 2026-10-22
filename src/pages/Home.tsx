import { motion, useReducedMotion, type Variants } from 'framer-motion';
import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import { canUseWebGL, isMobileDevice, saveData } from '../arena/shots';
import { useLoaderDoneAt } from '../loaders/gate';
import { STATIONS, arena, setArenaTarget } from '../arena/store';
import { easeOutExpo } from '../utils/animations';
import '../styles/arena.css';

const ArenaScene = lazy(() => import('../arena/ArenaScene'));

// Ogni sezione corrisponde a una o più tappe della camera (la galleria ne ha due)
const SECTIONS = [
  { id: 'inizio', label: 'Inizio', span: 1 },
  { id: 'chi-siamo', label: 'Chi siamo', span: 1 },
  { id: 'pilastri', label: 'Pilastri', span: 1 },
  { id: 'numeri', label: 'Numeri', span: 1 },
  { id: 'galleria', label: 'Galleria', span: 2 },
  { id: 'unisciti', label: 'Unisciti', span: 1 },
];
const STATION_TO_SECTION = SECTIONS.flatMap((sec, i) => Array<number>(sec.span).fill(i));

const PILLARS = [
  {
    title: 'Innovazione',
    text: "Utilizziamo tecnologie all'avanguardia per l'analisi delle prestazioni e lo sviluppo dei talenti.",
  },
  { title: 'Community', text: 'Una community attiva e partecipe che supporta il nostro progetto di crescita.' },
  { title: 'Sostenibilità', text: 'Gestione trasparente e sostenibile per garantire un futuro solido al nostro club.' },
];

const STATS = [
  { value: '50+', label: 'Atleti' },
  { value: '15+', label: 'Dirigenti e staff' },
];

const GALLERY = [1, 2, 3, 4, 5, 6];

const smooth = (t: number) => t * t * (3 - 2 * t);

const Home: React.FC = () => {
  const reduced = !!useReducedMotion();
  const [is3D] = useState(() => canUseWebGL() && !saveData());
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);

  const mobile = useMemo(isMobileDevice, []);
  // camera e testi partono quando la schermata di caricamento è uscita
  const loaderDoneAt = useLoaderDoneAt();
  const introAt = loaderDoneAt === null ? Infinity : loaderDoneAt + (reduced ? 0 : 150);
  const onReady = useCallback(() => setReady(true), []);

  // scroll → posizione della camera lungo il percorso
  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      const vh = window.innerHeight;
      let base = 0;
      let s = 0;
      for (const el of sections.current) {
        if (!el) continue;
        const span = Number(el.dataset.span || 1);
        const r = el.getBoundingClientRect();
        if (r.top > 1) break;
        // la sezione resta ferma per `dwell` px, poi la camera passa alla successiva
        const dwell = Math.max(0, r.height - vh);
        const into = -r.top;
        if (into <= dwell) s = base + (span > 1 ? (span - 1) * smooth(into / dwell) : 0);
        else s = base + span - 1 + smooth(Math.min(1, (into - dwell) / vh));
        base += span;
      }
      s = Math.min(s, STATIONS.length - 1);
      setArenaTarget(s);
      setActive(STATION_TO_SECTION[Math.round(s)]);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    arena.cam = arena.s; // al ritorno sulla Home la camera non rifà tutto il percorso
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const el = sections.current[i];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduced ? 'auto' : 'smooth' });
  };

  const heroCopy: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: is3D && !reduced ? 0.5 : 0.1, staggerChildren: 0.09 } },
  };
  const heroItem: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
  };

  const register = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };

  return (
    <>
      <PageHead {...seoFor('/')} />

      <div className={`ah ${is3D ? 'ah--3d' : 'ah--static'} ${ready ? 'is-ready' : ''}`}>
        <div className="ah-backdrop" aria-hidden="true" />
        {is3D && (
          <div className="ah-canvas" aria-hidden="true">
            <Suspense fallback={null}>
              <ArenaScene mobile={mobile} reduced={reduced} introAt={introAt} onReady={onReady} />
            </Suspense>
          </div>
        )}

        {is3D && (
          <nav className="ah-rail" aria-label="Sezioni della pagina">
            <ol>
              {SECTIONS.map((sec, i) => (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? 'step' : undefined}
                    className={active === i ? 'is-active' : ''}
                  >
                    <span className="ah-rail-label">{sec.label}</span>
                    <span className="ah-rail-dot" />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Centrocampo */}
        <section id="inizio" ref={register(0)} data-span={1} className="ah-sec ah-sec--hero">
          <div className="ah-stage ah-stage--hero">
            <motion.div
              className="ah-copy"
              variants={heroCopy}
              initial="hidden"
              animate={loaderDoneAt === null ? 'hidden' : 'visible'}
            >
              <motion.p variants={heroItem} className="hy-kicker">
                Nola, dal 2025
              </motion.p>
              <motion.h1 variants={heroItem} className="ah-title">
                Hyria
                <br />
                Basket
              </motion.h1>
              <motion.p variants={heroItem} className="ah-motto">
                Giovane. Audace. Radicata.
              </motion.p>
              <motion.p variants={heroItem} className="ah-body">
                Una squadra di basket giovane, nata dal progetto di giovani imprenditori convinti che
                un'atmosfera familiare, attenta al lato umano e allo spirito di squadra, possa conciliarsi
                con la tecnologia più avanzata e i giovani talenti del territorio.
              </motion.p>
              <motion.div variants={heroItem} className="hy-actions">
                <Link to="/chi-siamo" className="hy-btn hy-btn--primary">
                  Scopri il club
                </Link>
                <Link to="/contatti" className="hy-btn hy-btn--ghost">
                  Unisciti a noi
                </Link>
              </motion.div>
            </motion.div>
            {is3D && (
              <p className="ah-hint" aria-hidden="true">
                Scorri ed entra in campo
              </p>
            )}
          </div>
        </section>

        {/* Panchina */}
        <section id="chi-siamo" ref={register(1)} data-span={1} className="ah-sec">
          <div className="ah-stage ah-stage--right">
            <div className="ah-copy">
              <h2 className="hy-h2">Il futuro del basket passa da noi</h2>
              <p className="ah-body">
                Hyria è una squadra di basket moderna che milita nel campionato regionale. Il progetto conta
                oltre 50 atleti tesserati e circa 15 dirigenti, e punta al basket professionistico grazie
                alle nuove tecnologie e all'esperienza imprenditoriale dei soci fondatori.
              </p>
              <figure className="ah-photo">
                <img
                  src="/images/basketball-motto.jpg"
                  alt="Squadra Hyria Basket durante un momento di gioco"
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <Link to="/chi-siamo" className="hy-link">
                La nostra storia
              </Link>
            </div>
          </div>
        </section>

        {/* Lunetta */}
        <section id="pilastri" ref={register(2)} data-span={1} className="ah-sec">
          <div className="ah-stage ah-stage--left">
            <div className="ah-copy">
              <h2 className="hy-h2">Sport e tecnologia</h2>
              <p className="ah-lead">Tre pilastri guidano ogni scelta del club.</p>
              <ul className="ah-pillars">
                {PILLARS.map((p) => (
                  <li key={p.title}>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tabellone */}
        <section id="numeri" ref={register(3)} data-span={1} className="ah-sec">
          <div className="ah-stage ah-stage--bottom">
            <div className="ah-copy ah-copy--center">
              <h2 className="hy-h2">Il club in numeri</h2>
              <p className="ah-body">
                Oltre 50 atleti e più di 15 tra dirigenti e staff, ogni settimana sul parquet di Nola.
              </p>
              <dl className="ah-stats">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Tribuna */}
        <section id="galleria" ref={register(4)} data-span={2} className="ah-sec ah-sec--long">
          <div className="ah-stage ah-stage--bottom-left">
            <div className="ah-copy">
              <h2 className="hy-h2">La nostra galleria</h2>
              <p className="ah-body">
                {is3D
                  ? 'Partite, allenamenti e la gente di Nola: le nostre foto sono appese sopra la tribuna.'
                  : 'Partite, allenamenti e la gente di Nola.'}
              </p>
            </div>
            {!is3D && (
              <div className="ah-gallery">
                {GALLERY.map((n) =>
                  n === 3 ? (
                    <video
                      key={n}
                      muted
                      loop
                      playsInline
                      controls
                      preload="none"
                      poster="/images/1.jpg"
                      src="/images/1.mp4"
                      aria-label="Clip azione partita Hyria Basket"
                    />
                  ) : (
                    <img
                      key={n}
                      src={`/images/${n}.jpg`}
                      alt={`Momento di partita Hyria Basket ${n}`}
                      width={1200}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        {/* Canestro */}
        <section id="unisciti" ref={register(5)} data-span={1} className="ah-sec ah-sec--last">
          <div className="ah-stage ah-stage--bottom">
            <div className="ah-copy ah-copy--center">
              <h2 className="hy-h2">Entra a far parte della famiglia Hyria</h2>
              <p className="ah-body">Unisciti a noi e diventa protagonista di una nuova era del basket.</p>
              <div className="hy-actions">
                <Link to="/contatti" className="hy-btn hy-btn--primary">
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
