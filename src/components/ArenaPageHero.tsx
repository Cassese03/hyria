import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Sponsor } from '../arena/assets';
import type { JumboContent } from '../arena/textures';
import { canUseWebGL, isMobileDevice, saveData, type ShotName } from '../arena/shots';
import { easeOutExpo } from '../utils/animations';
import { useLoaderDoneAt } from '../loaders/gate';

const ArenaHero = lazy(() => import('../arena/ArenaHero'));

interface ArenaPageHeroProps {
  /** inquadratura del palazzetto (vedi arena/shots.ts) */
  shot: ShotName;
  /** scritta dipinta sulla fascia del parquet */
  floorTitle: string;
  kicker: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  /** foto mostrata senza WebGL e durante il caricamento */
  image: string;
  boards?: Sponsor[];
  jumbo?: JumboContent;
  ledText?: string;
  miniHoop?: [number, number, number];
}

/**
 * Intestazione delle pagine interne: il palazzetto della Home visto da
 * un'inquadratura dedicata, con il titolo della pagina in sovrimpressione.
 */
const ArenaPageHero = ({ shot, floorTitle, kicker, title, lead, actions, image, boards, jumbo, ledText, miniHoop }: ArenaPageHeroProps) => {
  const reduced = !!useReducedMotion();
  const [is3D] = useState(() => canUseWebGL() && !saveData());
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const root = useRef<HTMLElement>(null);
  const mobile = useMemo(isMobileDevice, []);
  // camera e testi partono quando la schermata di caricamento è uscita
  const loaderDoneAt = useLoaderDoneAt();
  const introAt = loaderDoneAt === null ? Infinity : loaderDoneAt + (reduced ? 0 : 150);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = root.current;
    if (!el || !is3D) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [is3D]);

  const copy: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: reduced ? 0 : 0.4, staggerChildren: 0.08 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
  };

  return (
    <section ref={root} className={`ph ${ready ? 'is-ready' : ''}`}>
      <div className="ph-media" aria-hidden="true">
        <img src={image} alt="" className="ph-photo" decoding="async" fetchPriority="high" />
        {is3D && (
          <div className="ph-canvas">
            <Suspense fallback={null}>
              <ArenaHero
                shot={shot}
                floorTitle={floorTitle}
                boards={boards}
                jumbo={jumbo}
                ledText={ledText}
                miniHoop={miniHoop}
                mobile={mobile}
                reduced={reduced}
                introAt={introAt}
                active={active}
                onReady={onReady}
              />
            </Suspense>
          </div>
        )}
      </div>
      <motion.div className="ph-copy" variants={copy} initial="hidden" animate={loaderDoneAt === null ? 'hidden' : 'visible'}>
        <motion.p variants={item} className="hy-kicker">
          {kicker}
        </motion.p>
        <motion.h1 variants={item} className="ph-title">
          {title}
        </motion.h1>
        {lead && (
          <motion.p variants={item} className="ph-lead">
            {lead}
          </motion.p>
        )}
        {actions && (
          <motion.div variants={item} className="hy-actions">
            {actions}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ArenaPageHero;
