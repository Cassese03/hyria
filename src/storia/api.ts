import { CATEGORIES, type Block, type Category, type Post } from './types';

/**
 * Accesso ai dati dell'archivio. Le pagine leggono queste Promise con `use()`:
 * oggi i post arrivano da posts.ts, domani possono arrivare da Supabase
 * cambiando solo `load()`, senza toccare le pagine.
 */
const load = async (): Promise<Post[]> => (await import('./posts')).POSTS;

const cache = new Map<string, Promise<unknown>>();
const memo = <T>(key: string, fn: () => Promise<T>) => {
  let p = cache.get(key) as Promise<T> | undefined;
  if (!p) {
    p = fn();
    cache.set(key, p);
  }
  return p;
};

/** Tutti i post in ordine cronologico (dal più vecchio) */
export const fetchPosts = () => memo('posts', async () => [...(await load())].sort((a, b) => a.date.localeCompare(b.date)));

export const fetchPost = (slug: string) =>
  memo(`post:${slug}`, async () => (await fetchPosts()).find((p) => p.slug === slug) ?? null);

/* ─── Helper sulle liste ─────────────────────────────────────────────────── */

export const categoryLabel = (c: Category) => CATEGORIES[c];

export const isCategory = (v: string | null): v is Category => !!v && v in CATEGORIES;

/** Stagioni presenti, dalla più recente */
export const seasonsOf = (posts: Post[]) => [...new Set(posts.map((p) => p.season))].sort().reverse();

export const adjacent = (posts: Post[], slug: string) => {
  const i = posts.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? posts[i - 1] : null, next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null };
};

// a mezzogiorno: la data non slitta al giorno prima con i fusi orari
const day = (iso: string) => new Date(`${iso}T12:00:00`);

export const formatDate = (iso: string) =>
  day(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatMonth = (iso: string) => day(iso).toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });

const blockText = (b: Block) => {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'quote':
      return b.text;
    case 'list':
      return b.items.join(' ');
    default:
      return '';
  }
};

export const readingMinutes = (post: Post) => {
  const words = post.content.map(blockText).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
