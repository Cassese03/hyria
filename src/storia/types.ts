// Archivio storico: un post racconta un traguardo, un evento o una stagione del club.

export const CATEGORIES = {
  campionati: 'Campionati',
  giovanili: 'Giovanili',
  'eventi-sociali': 'Eventi sociali',
  tornei: 'Tornei',
} as const;

export type Category = keyof typeof CATEGORIES;

/** Contenuto a blocchi tipizzati: si rende senza HTML grezzo e si mappa facilmente da un CMS */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt: string; caption?: string; width: number; height: number }
  | { type: 'facts'; items: { value: string; label: string }[] };

export interface Media {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  /** stagione sportiva, es. "2025/26" */
  season: string;
  /** data ISO (YYYY-MM-DD) */
  date: string;
  category: Category;
  cover: Media;
  excerpt: string;
  content: Block[];
  tags: string[];
  /** compare come stendardo nella timeline 3D (se nessun post è marcato, ci vanno tutti) */
  featured?: boolean;
}
