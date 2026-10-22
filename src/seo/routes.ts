import { categoryLabel } from '../storia/api';
import type { Post } from '../storia/types';
import {
  AREA_SERVED,
  CLUB,
  HOME_VENUE,
  OG_IMAGE,
  PARENT_FAQS,
  SITE_URL,
  activePrograms,
  breadcrumbs,
  faqPage,
  pageGraph,
  type Faq,
} from './site';

/**
 * Metadati di ogni pagina indicizzabile. Le pagine li passano a <PageHead>,
 * la build li scrive nell'HTML statico (prerender) insieme a un riassunto
 * testuale leggibile anche dai crawler che non eseguono JavaScript (GPTBot,
 * ClaudeBot, PerplexityBot…).
 */
export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  structuredData: object;
  /** contenuto statico per il prerender */
  h1: string;
  text: string[];
  faqs?: Faq[];
  priority: number;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  lastmod?: string;
}

const crumbs = (name: string, path: string) => breadcrumbs([{ name: 'Home', path: '/' }, { name, path }]);
const page = (type: string, path: string, name: string, description: string) => ({
  '@type': type,
  '@id': `${SITE_URL}${path}#pagina`,
  url: `${SITE_URL}${path}`,
  name,
  description,
  inLanguage: 'it-IT',
  isPartOf: { '@type': 'WebSite', name: CLUB.name, url: SITE_URL },
  about: { '@id': `${SITE_URL}/#club` },
});

const towns = AREA_SERVED.slice(1).join(', ');
const programsText = activePrograms()
  .map((p) => `${p.name} (${p.ages})`)
  .join(', ');

const SETTORE_FAQS: Faq[] = PARENT_FAQS;

export const ROUTES: RouteSeo[] = [
  {
    path: '/',
    title: 'ASD Hyria Basket | Scuola Basket e Minibasket a Nola',
    description:
      'Hyria Basket è la società di pallacanestro di Nola: minibasket dai 5 agli 11 anni, prima squadra nel campionato regionale e prova gratuita per i più piccoli.',
    keywords: 'basket Nola, minibasket Nola, scuola basket Agro Nolano, Hyria Basket',
    structuredData: pageGraph(page('WebPage', '/', 'Hyria Basket – Basket a Nola', 'Sito ufficiale di ASD Hyria Basket, Nola.')),
    h1: 'Hyria Basket – la squadra di basket di Nola',
    text: [
      `ASD Hyria Basket è la società di pallacanestro di Nola (NA), fondata nel ${CLUB.foundingYear}. Il nome richiama Hyria, l’antica città che sorgeva nell’area nolana.`,
      `Attività: ${programsText}.`,
      `Ci alleniamo a Nola, in ${HOME_VENUE.streetAddress}, e accogliamo atleti da tutto l’Agro Nolano: ${towns}.`,
      'Per i bambini del minibasket sono previsti fino a 3 allenamenti di prova gratuiti.',
    ],
    priority: 1,
    changefreq: 'weekly',
  },
  {
    path: '/minibasket-nola',
    title: 'Scuola Minibasket a Nola | Corsi di basket per bambini – Hyria Basket',
    description:
      'Corsi di minibasket a Nola per bambini dai 5 agli 11 anni: due allenamenti a settimana, staff dedicato e 3 lezioni di prova gratuite. Vicino a Cimitile, Casamarciano e Saviano.',
    keywords: 'minibasket Nola, corsi basket bambini Nola, scuola basket Agro Nolano, basket Cimitile, basket Casamarciano, basket Saviano',
    structuredData: pageGraph(
      page('WebPage', '/minibasket-nola', 'Scuola Minibasket a Nola', 'Corsi di minibasket per bambini dai 5 agli 11 anni a Nola.'),
      crumbs('Scuola Minibasket a Nola', '/minibasket-nola'),
      faqPage(PARENT_FAQS, `${SITE_URL}/minibasket-nola`),
    ),
    h1: 'Scuola Minibasket a Nola',
    text: [
      'Hyria Basket organizza corsi di minibasket a Nola per bambine e bambini dai 5 agli 11 anni, con due allenamenti a settimana.',
      'Gruppi: Pulcini (5–6 anni), Scoiattoli (7–8), Aquilotti (9–10), Esordienti (11).',
      `La palestra è in ${HOME_VENUE.streetAddress}, ${HOME_VENUE.postalCode} Nola, a pochi minuti da Cimitile, Casamarciano e Saviano; accogliamo famiglie da tutto l’Agro Nolano (${towns}).`,
      'Si può iniziare con fino a 3 allenamenti di prova gratuiti. Per iscriversi servono il modulo di iscrizione e un certificato medico sportivo.',
    ],
    faqs: PARENT_FAQS,
    priority: 0.9,
    changefreq: 'monthly',
  },
  {
    path: '/settore-giovanile',
    title: 'Minibasket e Settore Giovanile | Hyria Basket Nola',
    description:
      'Il minibasket di Hyria Basket a Nola: gruppi Pulcini, Scoiattoli, Aquilotti ed Esordienti, metodo, staff tecnico e domande frequenti.',
    keywords: 'settore giovanile basket Nola, minibasket, Pulcini, Scoiattoli, Aquilotti, Esordienti',
    structuredData: pageGraph(
      page('WebPage', '/settore-giovanile', 'Minibasket e Settore Giovanile', 'Gruppi, metodo e staff del minibasket di Hyria Basket.'),
      crumbs('Minibasket', '/settore-giovanile'),
      faqPage(SETTORE_FAQS, `${SITE_URL}/settore-giovanile`),
    ),
    h1: 'Minibasket – Settore giovanile Hyria Basket',
    text: [
      'Il minibasket è il cuore del progetto Hyria Basket: un percorso di crescita sportiva e personale per bambini dai 5 agli 11 anni.',
      'Metodo: approccio progressivo adattato all’età, sviluppo tecnico, fisico e mentale, valori educativi come rispetto e spirito di squadra.',
    ],
    faqs: SETTORE_FAQS,
    priority: 0.8,
    changefreq: 'monthly',
  },
  {
    path: '/chi-siamo',
    title: 'Chi siamo | ASD Hyria Basket, il club di basket di Nola',
    description:
      'La storia, i valori e le persone di Hyria Basket: club di pallacanestro nato a Nola nel 2025 da giovani imprenditori del territorio.',
    structuredData: pageGraph(
      page('AboutPage', '/chi-siamo', 'Chi siamo – Hyria Basket', 'Storia, valori e persone del club.'),
      crumbs('Chi siamo', '/chi-siamo'),
    ),
    h1: 'Chi siamo',
    text: [
      'Hyria Basket nasce nel 2025 a Nola dal progetto di un gruppo di giovani imprenditori appassionati di basket e del proprio territorio.',
      'Valori: passione, comunità, crescita tecnica e umana di ogni atleta.',
    ],
    priority: 0.7,
    changefreq: 'yearly',
  },
  {
    path: '/storia',
    title: 'Archivio storico | Hyria Basket – La nostra storia',
    description:
      'Stagioni, tornei, minibasket ed eventi: la storia di Hyria Basket, il club di basket di Nola, raccontata capitolo per capitolo.',
    structuredData: pageGraph(
      page('CollectionPage', '/storia', 'Archivio storico – Hyria Basket', 'La storia del club capitolo per capitolo.'),
      crumbs('Archivio storico', '/storia'),
    ),
    h1: 'La nostra storia',
    text: ['L’archivio storico di Hyria Basket: campionati, giovanili, tornei ed eventi sociali dalla fondazione a oggi.'],
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/spogliatoio',
    title: 'Roster prima squadra | Hyria Basket Nola',
    description: 'Il roster della prima squadra di Hyria Basket: sfoglia le maglie in 3D e scopri la scheda di ogni giocatore.',
    structuredData: pageGraph(page('WebPage', '/spogliatoio', 'Roster – Hyria Basket', 'Il roster della prima squadra.'), crumbs('Roster', '/spogliatoio')),
    h1: 'Il roster della prima squadra',
    text: ['La prima squadra di Hyria Basket gioca il campionato regionale. Qui trovi giocatori, numeri e ruoli.'],
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/calendario',
    title: 'Classifica e campionato | Hyria Basket Nola – Stagione 2026/27',
    description: 'La classifica aggiornata del campionato di Hyria Basket, stagione 2026/27.',
    structuredData: pageGraph(page('WebPage', '/calendario', 'Classifica – Hyria Basket', 'Classifica della stagione.'), crumbs('Classifica', '/calendario')),
    h1: 'Classifica',
    text: ['Classifica aggiornata del campionato regionale della prima squadra di Hyria Basket.'],
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/sponsor',
    title: 'Sponsor e partner | Hyria Basket Nola',
    description: 'I partner di Hyria Basket e le opportunità di sponsorizzazione per le aziende di Nola e dell’Agro Nolano.',
    structuredData: pageGraph(page('WebPage', '/sponsor', 'Sponsor – Hyria Basket', 'Sponsor e partnership.'), crumbs('Sponsor', '/sponsor')),
    h1: 'I nostri sponsor',
    text: ['Le aziende che sostengono Hyria Basket e le formule di partnership per il territorio.'],
    priority: 0.5,
    changefreq: 'yearly',
  },
  {
    path: '/contatti',
    title: 'Contatti e iscrizioni | Hyria Basket Nola',
    description: `Contatta Hyria Basket per iscrizioni al minibasket e prove gratuite: ${HOME_VENUE.streetAddress}, Nola. Telefono ${CLUB.phones[0]}, email ${CLUB.email}.`,
    structuredData: pageGraph(page('ContactPage', '/contatti', 'Contatti – Hyria Basket', 'Recapiti e iscrizioni.'), crumbs('Contatti', '/contatti')),
    h1: 'Contatti',
    text: [
      `Indirizzo: ${HOME_VENUE.streetAddress}, ${HOME_VENUE.postalCode} ${HOME_VENUE.locality} (${HOME_VENUE.region}).`,
      `Telefono: ${CLUB.phones.join(' · ')}. Email: ${CLUB.email}.`,
    ],
    priority: 0.8,
    changefreq: 'yearly',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy policy | Hyria Basket',
    description: 'Informativa sul trattamento dei dati personali di ASD Hyria Basket.',
    structuredData: pageGraph(page('WebPage', '/privacy-policy', 'Privacy policy', 'Informativa privacy.')),
    h1: 'Privacy policy',
    text: ['Informativa sul trattamento dei dati personali di ASD Hyria Basket.'],
    priority: 0.2,
    changefreq: 'yearly',
  },
];

const byPath = new Map(ROUTES.map((r) => [r.path, r]));

/** Props per <PageHead> della pagina */
export const seoFor = (path: string) => {
  const r = byPath.get(path);
  if (!r) throw new Error(`SEO mancante per ${path}`);
  return headProps(r);
};

export const headProps = (r: RouteSeo) => ({
  title: r.title,
  description: r.description,
  keywords: r.keywords,
  ogImage: r.ogImage,
  ogUrl: `${SITE_URL}${r.path === '/' ? '' : r.path}`,
  canonicalUrl: `${SITE_URL}${r.path === '/' ? '' : r.path}`,
  structuredData: r.structuredData,
});

/** Capitolo dell'archivio storico */
export const postSeo = (post: Post): RouteSeo => {
  const path = `/storia/${post.slug}`;
  const image = `${SITE_URL}${post.cover.src}`;
  return {
    path,
    title: `${post.title} | Archivio storico Hyria Basket`,
    description: post.excerpt,
    keywords: ['Hyria Basket', categoryLabel(post.category), ...post.tags].join(', '),
    ogImage: image,
    structuredData: pageGraph(
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}${path}#articolo`,
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        image,
        keywords: post.tags.join(', '),
        articleSection: categoryLabel(post.category),
        url: `${SITE_URL}${path}`,
        inLanguage: 'it-IT',
        author: { '@id': `${SITE_URL}/#club` },
        publisher: { '@id': `${SITE_URL}/#club` },
      },
      breadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Archivio storico', path: '/storia' },
        { name: post.title, path },
      ]),
    ),
    h1: post.title,
    text: [post.excerpt, ...post.content.flatMap((b) => (b.type === 'p' ? [b.text] : []))],
    priority: 0.5,
    changefreq: 'yearly',
    lastmod: post.date,
  };
};

export { OG_IMAGE };
