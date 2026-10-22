import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Suspense, lazy, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { seoFor } from '../seo/routes';
import StoriaCard from '../components/StoriaCard';
import { canUseWebGL, isMobileDevice, lowPowerDevice, saveData } from '../arena/shots';
import { createTrack } from '../arena/store';
import { useLoaderDoneAt } from '../loaders/gate';
import { categoryLabel, fetchPosts, formatDate, formatMonth, isCategory, seasonsOf } from '../storia/api';
import { historyStations, timelinePosts, toBanners } from '../storia/track';
import { CATEGORIES, type Category, type Post } from '../storia/types';
import { easeOutExpo, fadeInUp, revealTransition } from '../utils/animations';
import '../styles/arena.css';
import '../styles/storia.css';

const HistoryScene = lazy(() => import('../arena/history'));

// fuori dal componente: tornando sulla pagina la camera riparte da dov'era
const track = createTrack();

const smooth = (t: number) => t * t * (3 - 2 * t);
const pad2 = (n: number) => String(n).padStart(2, '0');

/* ─── Un capitolo della timeline ─────────────────────────────────────────── */

interface ChapterProps {
  post: Post;
  index: number;
  total: number;
  is3D: boolean;
  reduced: boolean;
  mobile: boolean;
  register: (el: HTMLElement | null) => void;
}

function Chapter({ post, index, total, is3D, reduced, mobile, register }: ChapterProps) {
  const ref = useRef<HTMLElement | null>(null);
  // 0 → la sezione entra dal basso, ~0.37 → stage fermo (camera arrivata), ~0.63 → la camera riparte
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const keys = [0.16, 0.34, 0.66, 0.86];
  const opacity = useTransform(scrollYProgress, keys, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, keys, [56, 0, 0, -40]);
  const blur = useTransform(scrollYProgress, keys, [10, 0, 0, 6]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  // il blur costa: solo su desktop; con "riduci movimento" resta la dissolvenza
  const style = !is3D ? undefined : reduced ? { opacity } : mobile ? { opacity, y } : { opacity, y, filter };
  const reveal = !is3D
    ? { variants: fadeInUp, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 } }
    : {};

  return (
    <section
      id={`capitolo-${post.slug}`}
      ref={(el) => {
        ref.current = el;
        register(el);
      }}
      className="ah-sec st-chapter"
      aria-labelledby={`capitolo-${post.slug}-titolo`}
    >
      <div className="ah-stage ah-stage--left">
        <motion.article className="ah-copy st-chapter-copy" style={style} {...reveal}>
          <p className="st-chapter-count">
            Capitolo {pad2(index + 1)}
            <span> / {pad2(total)}</span>
          </p>
          <p className="st-meta">
            <span className="st-meta-cat">{categoryLabel(post.category)}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
          <p className="st-season">{post.season}</p>
          <h2 id={`capitolo-${post.slug}-titolo`} className="hy-h2 st-chapter-title">
            {post.title}
          </h2>
          <p className="ah-body">{post.excerpt}</p>
          {!is3D && (
            <figure className="st-chapter-photo">
              <img
                src={post.cover.src}
                alt={post.cover.alt}
                width={post.cover.width}
                height={post.cover.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
          )}
          <Link to={`/storia/${post.slug}`} className="hy-link">
            Leggi il capitolo
          </Link>
        </motion.article>
      </div>
    </section>
  );
}

/* ─── Archivio filtrabile ────────────────────────────────────────────────── */

function Archive({ posts, reduced }: { posts: Post[]; reduced: boolean }) {
  const [params, setParams] = useSearchParams();
  const catParam = params.get('categoria');
  const category: Category | null = isCategory(catParam) ? catParam : null;
  const seasons = useMemo(() => seasonsOf(posts), [posts]);
  const seasonParam = params.get('stagione')?.replace('-', '/') ?? null;
  const season = seasonParam && seasons.includes(seasonParam) ? seasonParam : null;

  // dal più recente: chi arriva qui cerca l'ultimo capitolo
  const list = useMemo(
    () =>
      posts
        .filter((p) => (!category || p.category === category) && (!season || p.season === season))
        .slice()
        .reverse(),
    [posts, category, season],
  );

  const setFilter = (key: 'categoria' | 'stagione', value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const chip = (active: boolean, label: string, onClick: () => void) => (
    <button key={label} type="button" className="st-chip" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <section id="archivio" className="pg-sec st-archive" aria-labelledby="archivio-titolo">
      <div className="pg-wrap">
        <header className="pg-head">
          <p className="hy-kicker">Tutto l'archivio</p>
          <h2 id="archivio-titolo" className="hy-h2">
            Ogni capitolo, stagione per stagione
          </h2>
          <p>Filtra per categoria o per stagione sportiva e ritrova le giornate che hanno fatto la nostra storia.</p>
        </header>

        <div className="st-filters">
          <div className="st-filter-row" role="group" aria-label="Filtra per categoria">
            {chip(!category, 'Tutte', () => setFilter('categoria', null))}
            {(Object.keys(CATEGORIES) as Category[]).map((c) =>
              chip(category === c, categoryLabel(c), () => setFilter('categoria', category === c ? null : c)),
            )}
          </div>
          {seasons.length > 1 && (
            <div className="st-filter-row" role="group" aria-label="Filtra per stagione">
              {chip(!season, 'Tutte le stagioni', () => setFilter('stagione', null))}
              {seasons.map((s) =>
                chip(season === s, s, () => setFilter('stagione', season === s ? null : s.replace('/', '-'))),
              )}
            </div>
          )}
          <p className="st-count" aria-live="polite">
            {list.length === 1 ? '1 capitolo' : `${list.length} capitoli`}
          </p>
        </div>

        {list.length ? (
          <motion.ul className="st-grid" layout={!reduced}>
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout={!reduced}
                  initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ ...revealTransition, delay: reduced ? 0 : (i % 3) * 0.08 }}
                >
                  <StoriaCard post={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="st-empty">
            <p>Nessun capitolo per questa combinazione di filtri.</p>
            <button
              type="button"
              className="hy-btn hy-btn--ghost"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Mostra tutto
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Pagina ─────────────────────────────────────────────────────────────── */

const Storia = () => {
  const posts = use(fetchPosts());
  const tour = useMemo(() => timelinePosts(posts), [posts]);
  const banners = useMemo(() => toBanners(tour), [tour]);
  const stations = useMemo(() => historyStations(tour), [tour]);

  const reduced = !!useReducedMotion();
  const [is3D] = useState(() => canUseWebGL() && !saveData() && !lowPowerDevice());
  const mobile = useMemo(isMobileDevice, []);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(true);
  const [railOn, setRailOn] = useState(true);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const tourRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const loaderDoneAt = useLoaderDoneAt();
  const introAt = loaderDoneAt === null ? Infinity : loaderDoneAt + (reduced ? 0 : 150);
  const onReady = useCallback(() => setReady(true), []);

  // i link interni non riportano in cima: ci pensa la pagina (o va all'ancora richiesta)
  useLayoutEffect(() => {
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    // solo all'ingresso: i filtri cambiano la query, non devono spostare la pagina
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll → posizione della camera lungo la fila di stendardi (stessa logica della Home)
  useEffect(() => {
    if (!is3D) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const vh = window.innerHeight;
      let s = 0;
      let base = 0;
      for (const el of sections.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top > 1) break;
        // la sezione resta ferma per `dwell` px, poi la camera passa allo stendardo successivo
        const dwell = Math.max(0, r.height - vh);
        const into = -r.top;
        s = into <= dwell ? base : base + smooth(Math.min(1, (into - dwell) / vh));
        base += 1;
      }
      s = Math.min(s, stations.length - 1);
      track.setTarget(s);
      setActive(Math.round(s));
      // la rail accompagna solo la timeline: quando sale l'archivio se ne va
      const archive = document.getElementById('archivio');
      setRailOn(!archive || archive.getBoundingClientRect().top > vh * 0.6);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    track.state.cam = track.state.s;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [is3D, stations]);

  // quando l'archivio copre la scena il canvas smette di disegnare
  useEffect(() => {
    const el = tourRef.current;
    if (!el || !is3D) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [is3D]);

  // senza 3D la timeline ha una linea verticale che si riempie con lo scroll
  const { scrollYProgress: spine } = useScroll({ target: chaptersRef, offset: ['start 70%', 'end 70%'] });

  const goTo = (i: number) => {
    const el = sections.current[i];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: reduced ? 'auto' : 'smooth' });
  };

  const register = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el;
  };

  const heroCopy: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: is3D && !reduced ? 0.5 : 0.1, staggerChildren: 0.09 } },
  };
  const heroItem: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutExpo } },
  };

  const first = tour[0];
  const rail = [{ id: 'inizio', label: 'Inizio' }, ...tour.map((p) => ({ id: p.slug, label: formatMonth(p.date) }))];

  return (
    <>
      <PageHead {...seoFor('/storia')} />

      <div className={`ah st ${is3D ? 'ah--3d' : 'ah--static'} ${ready ? 'is-ready' : ''}`}>
        <div ref={tourRef} className="st-tour">
          <div className="ah-backdrop" aria-hidden="true" />
          {is3D && (
            <div className="ah-canvas" aria-hidden="true">
              <Suspense fallback={null}>
                <HistoryScene
                  banners={banners}
                  stations={stations}
                  track={track}
                  mobile={mobile}
                  reduced={reduced}
                  introAt={introAt}
                  active={onScreen}
                  onReady={onReady}
                />
              </Suspense>
            </div>
          )}

          {is3D && railOn && (
            <nav className="ah-rail" aria-label="Capitoli della timeline">
              <ol>
                {rail.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={active === i ? 'step' : undefined}
                      className={active === i ? 'is-active' : ''}
                    >
                      <span className="ah-rail-label">{item.label}</span>
                      <span className="ah-rail-dot" />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <section id="inizio" ref={register(0)} className="ah-sec ah-sec--hero">
            <div className="ah-stage ah-stage--hero">
              <motion.div
                className="ah-copy st-hero-copy"
                variants={heroCopy}
                initial="hidden"
                animate={loaderDoneAt === null ? 'hidden' : 'visible'}
              >
                <motion.p variants={heroItem} className="hy-kicker">
                  Archivio storico · dal 2025
                </motion.p>
                <motion.h1 variants={heroItem} className="ah-title st-title">
                  La nostra
                  <br />
                  storia
                </motion.h1>
                <motion.p variants={heroItem} className="ah-body">
                  {is3D
                    ? 'Ogni traguardo del club è uno stendardo appeso sopra la tribuna. Scorri e rivivi stagioni, tornei, minibasket ed eventi che hanno fatto crescere Hyria Basket.'
                    : 'Stagioni, tornei, minibasket ed eventi: i capitoli che hanno fatto crescere Hyria Basket, dal primo giorno a oggi.'}
                </motion.p>
                <motion.div variants={heroItem} className="hy-actions">
                  {first && (
                    <a href={`#capitolo-${first.slug}`} className="hy-btn hy-btn--primary">
                      Dal primo capitolo
                    </a>
                  )}
                  <a href="#archivio" className="hy-btn hy-btn--ghost">
                    Tutto l'archivio
                  </a>
                </motion.div>
              </motion.div>
              {is3D && (
                <p className="ah-hint" aria-hidden="true">
                  Scorri la timeline
                </p>
              )}
            </div>
          </section>

          <div ref={chaptersRef} className="st-chapters">
            {!is3D && (
              <div className="st-spine" aria-hidden="true">
                <motion.span style={{ scaleY: spine }} />
              </div>
            )}
            {tour.map((p, i) => (
              <Chapter
                key={p.id}
                post={p}
                index={i}
                total={tour.length}
                is3D={is3D}
                reduced={reduced}
                mobile={mobile}
                register={register(i + 1)}
              />
            ))}
          </div>
        </div>

        <Archive posts={posts} reduced={reduced} />

        <section className="pg-sec pg-sec--maroon st-cta">
          <div className="pg-wrap pg-cta">
            <h2 className="hy-h2">Questa storia la scriviamo insieme</h2>
            <p>Hai foto o ricordi di una delle nostre giornate? Mandaceli: il prossimo capitolo può partire da te.</p>
            <div className="hy-actions">
              <Link to="/contatti" className="hy-btn hy-btn--light">
                Scrivici
              </Link>
              <Link to="/chi-siamo" className="hy-btn hy-btn--ghost">
                Chi siamo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Storia;
