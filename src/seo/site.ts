/**
 * Dati del club per SEO locale e motori AI: un'unica fonte per i JSON-LD delle
 * pagine (PageHead), per il prerender statico (scripts/seo-plugin.ts) e per la sitemap.
 * Niente import da React o dal DOM: questo file gira anche in Node durante la build.
 *
 * Tutto ciò che è marcato DA CONFERMARE non compare online finché non lo si attiva.
 */

export const SITE_URL = 'https://hyriabasket.it';
export const OG_IMAGE = { url: `${SITE_URL}/images/og-hyria.jpg`, width: 1200, height: 630, alt: 'La squadra di Hyria Basket in palestra a Nola' };

export const CLUB = {
  legalName: 'ASD Hyria Basket',
  name: 'Hyria Basket',
  foundingYear: '2025',
  email: 'info@hyriabasket.it',
  phones: ['+39 333 746 1777', '+39 331 402 3282'],
  logo: `${SITE_URL}/images/logo-hyria.png`,
  sameAs: ['https://www.instagram.com/hyria_basket', 'https://www.youtube.com/hyriabasket'],
};

/** Sede e palestra di casa (dalla pagina Contatti; coordinate dalla mappa incorporata) */
export const HOME_VENUE = {
  name: 'Palestra Hyria Basket – Nola',
  streetAddress: 'Via Madonna delle Grazie, 61',
  postalCode: '80035',
  locality: 'Nola',
  region: 'NA',
  geo: { latitude: 40.92413, longitude: 14.53382 },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Madonna+delle+Grazie+61+Nola',
};

/**
 * DA CONFERMARE: altre strutture convenzionate. Aggiungerle qui (con indirizzo e
 * coordinate verificate) le pubblica nel JSON-LD e nella landing del minibasket.
 */
export const OTHER_VENUES: (typeof HOME_VENUE)[] = [];

export const AREA_SERVED = ['Nola', 'Cimitile', 'Casamarciano', 'Saviano', 'San Vitaliano', 'Marigliano', 'Palma Campania'];

/** DA CONFERMARE: true solo se tutti gli istruttori del minibasket hanno la qualifica FIP/settore minibasket */
export const ISTRUTTORI_FIP = false;

export interface Program {
  id: string;
  name: string;
  ages: string;
  description: string;
  /** false = non ancora attivo / da confermare: escluso da pagine e dati strutturati */
  active: boolean;
}

export const PROGRAMS: Program[] = [
  { id: 'pulcini', name: 'Minibasket Pulcini', ages: '5–6 anni', description: 'Primi passi con la palla: coordinazione e gioco.', active: true },
  { id: 'scoiattoli', name: 'Minibasket Scoiattoli', ages: '7–8 anni', description: 'Palleggio, passaggio e tiro attraverso il gioco.', active: true },
  { id: 'aquilotti', name: 'Minibasket Aquilotti', ages: '9–10 anni', description: 'Fondamentali e prime regole di squadra.', active: true },
  { id: 'esordienti', name: 'Minibasket Esordienti', ages: '11 anni', description: 'Il ponte verso il basket giovanile.', active: true },
  // DA CONFERMARE: sul sito oggi non risultano squadre Under. Impostare active: true quando sono iscritte.
  { id: 'under', name: 'Settore giovanile (Under 13–19)', ages: '12–19 anni', description: 'Squadre giovanili e campionati di categoria.', active: false },
  { id: 'prima-squadra', name: 'Prima squadra', ages: 'Senior', description: 'Campionato regionale.', active: true },
];

export const activePrograms = () => PROGRAMS.filter((p) => p.active);

export interface Faq {
  question: string;
  answer: string;
}

/** Domande dei genitori: le risposte riportano solo ciò che il club già dichiara sul sito */
export const PARENT_FAQS: Faq[] = [
  {
    question: 'Da che età si può iniziare il minibasket a Nola?',
    answer:
      'Da Hyria Basket il minibasket accoglie bambine e bambini dai 5 agli 11 anni, divisi in quattro gruppi: Pulcini (5–6), Scoiattoli (7–8), Aquilotti (9–10) ed Esordienti (11).',
  },
  {
    question: 'Quali documenti servono per l’iscrizione?',
    answer: 'Servono il modulo di iscrizione compilato e un certificato medico sportivo valido.',
  },
  {
    question: 'Si può fare una prova gratuita?',
    answer: 'Sì: offriamo fino a 3 allenamenti di prova gratuiti, senza impegno, per conoscere squadra e allenatori.',
  },
  {
    question: 'Dove si svolgono gli allenamenti?',
    answer:
      'Nella nostra palestra in Via Madonna delle Grazie 61 a Nola (NA), facilmente raggiungibile da Cimitile, Casamarciano, Saviano e dagli altri comuni dell’Agro Nolano.',
  },
  {
    question: 'Quante volte a settimana ci si allena?',
    answer: 'I gruppi del minibasket si allenano 2 volte a settimana. Gli orari di ogni gruppo vengono comunicati al momento della prova.',
  },
  {
    question: 'Quanto costa l’iscrizione al minibasket?',
    answer:
      'Il costo varia in base alla categoria; sono previste agevolazioni per le famiglie con più figli iscritti. Contattaci per i dettagli.',
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const ORG_ID = `${SITE_URL}/#club`;
const VENUE_ID = `${SITE_URL}/#palestra-nola`;

const postalAddress = (v: typeof HOME_VENUE) => ({
  '@type': 'PostalAddress',
  streetAddress: v.streetAddress,
  postalCode: v.postalCode,
  addressLocality: v.locality,
  addressRegion: v.region,
  addressCountry: 'IT',
});

const venue = (v: typeof HOME_VENUE, id?: string) => ({
  '@type': 'SportsActivityLocation',
  ...(id ? { '@id': id } : {}),
  name: v.name,
  address: postalAddress(v),
  geo: { '@type': 'GeoCoordinates', latitude: v.geo.latitude, longitude: v.geo.longitude },
  hasMap: v.mapsUrl,
  sport: 'Basketball',
});

export const areaServed = () => [
  ...AREA_SERVED.map((name) => ({ '@type': 'City', name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Città metropolitana di Napoli' } })),
  { '@type': 'Place', name: 'Agro Nolano' },
];

/** Il club: SportsClub (organizzazione) + la palestra come SportsActivityLocation */
export const clubGraph = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['SportsClub', 'SportsOrganization'],
      '@id': ORG_ID,
      name: CLUB.legalName,
      alternateName: CLUB.name,
      url: SITE_URL,
      logo: CLUB.logo,
      image: OG_IMAGE.url,
      description:
        'Società di pallacanestro di Nola fondata nel 2025: minibasket per bambini dai 5 agli 11 anni e prima squadra nel campionato regionale, al servizio dell’Agro Nolano.',
      foundingDate: CLUB.foundingYear,
      sport: 'Basketball',
      email: CLUB.email,
      telephone: CLUB.phones[0],
      address: postalAddress(HOME_VENUE),
      geo: { '@type': 'GeoCoordinates', latitude: HOME_VENUE.geo.latitude, longitude: HOME_VENUE.geo.longitude },
      location: [{ '@id': VENUE_ID }, ...OTHER_VENUES.map((v) => venue(v))],
      areaServed: areaServed(),
      contactPoint: CLUB.phones.map((telephone) => ({
        '@type': 'ContactPoint',
        contactType: 'iscrizioni e informazioni',
        telephone,
        email: CLUB.email,
        availableLanguage: 'it',
        areaServed: 'IT',
      })),
      sameAs: CLUB.sameAs,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Corsi e squadre',
        itemListElement: activePrograms().map((p) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: p.name,
            serviceType: 'Corso di basket',
            description: `${p.description} Età: ${p.ages}.`,
            provider: { '@id': ORG_ID },
            areaServed: AREA_SERVED.map((name) => ({ '@type': 'City', name })),
          },
        })),
      },
    },
    venue(HOME_VENUE, VENUE_ID),
  ],
});

export const faqPage = (faqs: Faq[], url: string) => ({
  '@type': 'FAQPage',
  '@id': `${url}#faq`,
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: `${SITE_URL}${it.path}`,
  })),
});

/** Grafo di una pagina: il club c'è sempre, la pagina aggiunge i suoi nodi */
export const pageGraph = (...nodes: object[]) => {
  const base = clubGraph();
  return { ...base, '@graph': [...base['@graph'], ...nodes] };
};
