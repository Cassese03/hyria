import { motion, useReducedMotion, useScroll, type Variants } from 'framer-motion';
import { use, useLayoutEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import ArenaPageHero from '../components/ArenaPageHero';
import { headProps, postSeo } from '../seo/routes';
import { adjacent, categoryLabel, fetchPosts, formatDate, readingMinutes } from '../storia/api';
import { OVERVIEW, bannerShot, timelinePosts, toBanners } from '../storia/track';
import type { Block, Post } from '../storia/types';
import { revealTransition } from '../utils/animations';
import '../styles/storia.css';

/* ─── Contenuto a blocchi ────────────────────────────────────────────────── */

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>;
    case 'h2':
      return <h2 className="st-body-h2">{block.text}</h2>;
    case 'quote':
      return (
        <blockquote className="st-body-quote">
          <p>{block.text}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );
    case 'list':
      return (
        <ul className="st-body-list">
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <figure className="st-body-figure">
          <img src={block.src} alt={block.alt} width={block.width} height={block.height} loading="lazy" decoding="async" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'facts':
      return (
        <dl className="st-body-facts">
          {block.items.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

/* ─── Capitolo non trovato ───────────────────────────────────────────────── */

const NotFound = () => (
  <div className="pg">
    <PageHead title="Capitolo non trovato | Hyria Basket" description="Il capitolo richiesto non è nell'archivio storico." />
    <section className="pg-sec st-missing">
      <div className="pg-wrap">
        <p className="hy-kicker">Archivio storico</p>
        <h1 className="hy-h2">Questo capitolo non è nell'archivio</h1>
        <p>Forse il link è cambiato. Tutte le storie del club sono nell'archivio.</p>
        <div className="hy-actions">
          <Link to="/storia#archivio" className="hy-btn hy-btn--primary">
            Vai all'archivio
          </Link>
        </div>
      </div>
    </section>
  </div>
);

/* ─── Pagina del capitolo ────────────────────────────────────────────────── */

const Chapter = ({ post, posts }: { post: Post; posts: Post[] }) => {
  const reduced = !!useReducedMotion();
  const article = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: article, offset: ['start 70px', 'end end'] });

  // lo stesso stendardo della timeline, visto da vicino; fuori dalla timeline: la panoramica
  const tour = useMemo(() => timelinePosts(posts), [posts]);
  const index = tour.findIndex((p) => p.id === post.id);
  const shot = useMemo(
    () => (index >= 0 ? bannerShot(index, tour.length) : { pos: OVERVIEW.pos, look: OVERVIEW.look, mPos: OVERVIEW.mPos, mLook: OVERVIEW.mLook }),
    [index, tour.length],
  );
  const history = useMemo(() => ({ banners: toBanners(tour), active: index }), [tour, index]);
  const { prev, next } = adjacent(posts, post.slug);

  const reveal: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: revealTransition },
  };

  const seo = useMemo(() => headProps(postSeo(post)), [post]);

  return (
    <>
      <PageHead {...seo} ogType="article" />

      <motion.div className="st-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <div className="pg">
        <ArenaPageHero
          className="ph--storia"
          shot={shot}
          history={history}
          floorTitle="Archivio storico"
          kicker={`${categoryLabel(post.category)} · Stagione ${post.season}`}
          title={post.title}
          lead={post.excerpt}
          image={post.cover.src}
          actions={
            <>
              <a href="#racconto" className="hy-btn hy-btn--primary">
                Leggi il racconto
              </a>
              <Link to="/storia#archivio" className="hy-btn hy-btn--ghost">
                Torna all'archivio
              </Link>
            </>
          }
        />

        <article ref={article} id="racconto" className="pg-sec st-article" aria-label={post.title}>
          <div className="pg-wrap st-article-grid">
            <aside className="st-article-meta">
              <p className="st-season">{post.season}</p>
              <dl>
                <div>
                  <dt>Data</dt>
                  <dd>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </dd>
                </div>
                <div>
                  <dt>Categoria</dt>
                  <dd>
                    <Link to={`/storia?categoria=${post.category}#archivio`}>{categoryLabel(post.category)}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Lettura</dt>
                  <dd>{readingMinutes(post)} min</dd>
                </div>
              </dl>
              {post.tags.length > 0 && (
                <ul className="st-tags" aria-label="Tag">
                  {post.tags.map((t) => (
                    <li key={t}>#{t}</li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="st-body">
              {post.content.map((b, i) => (
                <motion.div
                  key={i}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                >
                  <BlockView block={b} />
                </motion.div>
              ))}
            </div>
          </div>
        </article>

        {(prev || next) && (
          <nav className="pg-sec pg-sec--deep st-pager" aria-label="Altri capitoli">
            <div className="pg-wrap st-pager-grid">
              {prev ? (
                <Link to={`/storia/${prev.slug}`} className="st-pager-link">
                  <span className="st-pager-dir">← Capitolo precedente</span>
                  <span className="st-pager-season">{prev.season}</span>
                  <span className="st-pager-title">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link to={`/storia/${next.slug}`} className="st-pager-link st-pager-link--next">
                  <span className="st-pager-dir">Capitolo successivo →</span>
                  <span className="st-pager-season">{next.season}</span>
                  <span className="st-pager-title">{next.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}

        <section className="pg-sec pg-sec--maroon">
          <div className="pg-wrap pg-cta">
            <h2 className="hy-h2">Il prossimo capitolo si gioca in palestra</h2>
            <p>Vieni a vederci giocare, porta i tuoi figli al minibasket o scrivici per entrare nel progetto.</p>
            <div className="hy-actions">
              <Link to="/calendario" className="hy-btn hy-btn--light">
                Classifica e partite
              </Link>
              <Link to="/storia" className="hy-btn hy-btn--ghost">
                Tutta la storia
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const StoriaPost = () => {
  const { slug = '' } = useParams();
  const posts = use(fetchPosts());
  const post = posts.find((p) => p.slug === slug);

  // tra un capitolo e l'altro si riparte dall'inizio della pagina
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // key: cambiando capitolo l'intestazione 3D riparte con la sua inquadratura
  return post ? <Chapter key={post.id} post={post} posts={posts} /> : <NotFound />;
};

export default StoriaPost;
