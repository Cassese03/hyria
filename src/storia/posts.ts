import type { Post } from './types';

// CONTENUTI DI ESEMPIO: testi verosimili ma da verificare/sostituire con la cronaca reale del club
// (date, risultati, luoghi). L'ordine qui non conta: l'API li ordina per data.

export const POSTS: Post[] = [
  {
    id: 'p-2025-fondazione',
    slug: 'nasce-hyria-basket',
    title: 'Nasce Hyria Basket',
    season: '2025/26',
    date: '2025-06-21',
    category: 'eventi-sociali',
    featured: true,
    cover: { src: '/images/4.jpg', alt: 'Lo stemma di Hyria Basket ricamato su tessuto bianco', width: 1122, height: 1402 },
    excerpt:
      'Un gruppo di giovani imprenditori nolani mette insieme passione e territorio: nasce un club che prende il nome dall’antica città di Hyria.',
    tags: ['fondazione', 'Nola', 'identità'],
    content: [
      {
        type: 'p',
        text: 'Tutto comincia attorno a un tavolo, con un’idea semplice: dare a Nola una squadra di basket moderna, che parli ai giovani senza dimenticare da dove viene. Da quell’idea nasce Hyria Basket.',
      },
      {
        type: 'p',
        text: 'Il nome non è casuale. Hyria è l’antica città che sorgeva nell’area nolana: un richiamo alle radici del territorio, mentre lo sguardo resta rivolto al basket di domani.',
      },
      { type: 'h2', text: 'Uno stemma che racconta il territorio' },
      {
        type: 'p',
        text: 'Lo stemma unisce il giglio, la sagoma incappucciata e il pallone arancio: tradizione e sport nello stesso segno. Bordeaux e arancio diventano da subito i colori del club.',
      },
      {
        type: 'quote',
        text: 'Volevamo un club che sentisse suo chi cresce qui. Il resto lo costruiremo palla dopo palla.',
        cite: 'I soci fondatori',
      },
      { type: 'h2', text: 'I primi passi' },
      {
        type: 'list',
        items: [
          'Costituzione della società e affiliazione',
          'Scelta della palestra di casa a Nola',
          'Primi contatti con atleti e allenatori del territorio',
        ],
      },
    ],
  },
  {
    id: 'p-2025-esordio',
    slug: 'palla-a-due-la-prima-stagione',
    title: 'Palla a due: la prima stagione',
    season: '2025/26',
    date: '2025-10-18',
    category: 'campionati',
    featured: true,
    cover: { src: '/images/1.jpg', alt: 'Foto di squadra di Hyria Basket in palestra, con maglie bordeaux', width: 1066, height: 1600 },
    excerpt:
      'Il roster si presenta al completo e Hyria debutta nel campionato regionale: la prima palla a due davanti al pubblico di casa.',
    tags: ['prima squadra', 'campionato regionale', 'esordio'],
    content: [
      {
        type: 'p',
        text: 'Dopo un’estate di allenamenti e amichevoli, il roster della prima squadra si ritrova al completo per la foto ufficiale. Maglie bordeaux, il nome Hyria sul petto: si comincia davvero.',
      },
      {
        type: 'image',
        src: '/images/1.jpg',
        alt: 'Giocatori e staff di Hyria Basket in posa sotto il canestro',
        caption: 'La foto di squadra della stagione d’esordio.',
        width: 1066,
        height: 1600,
      },
      { type: 'h2', text: 'La prima in casa' },
      {
        type: 'p',
        text: 'Per l’esordio casalingo la palestra si riempie di famiglie, amici e curiosi. Il risultato conta, ma conta di più vedere la tribuna colorata di bordeaux per la prima volta.',
      },
      {
        type: 'facts',
        items: [
          { value: '50+', label: 'Atleti tesserati' },
          { value: '15+', label: 'Dirigenti e staff' },
          { value: '1ª', label: 'Stagione' },
        ],
      },
      {
        type: 'p',
        text: 'La stagione è un banco di prova: un gruppo giovane che impara a vincere e a perdere insieme, settimana dopo settimana.',
      },
    ],
  },
  {
    id: 'p-2026-minibasket',
    slug: 'il-minibasket-apre-le-porte',
    title: 'Il minibasket apre le porte',
    season: '2025/26',
    date: '2026-02-14',
    category: 'giovanili',
    featured: true,
    cover: { src: '/images/5.jpg', alt: 'Palestra vuota con parquet illuminato dal sole e canestro mobile', width: 1152, height: 2048 },
    excerpt:
      'Pulcini, Scoiattoli, Aquilotti ed Esordienti: una giornata di porte aperte per far provare il basket ai bambini dai 5 agli 11 anni.',
    tags: ['minibasket', 'open day', 'famiglie'],
    content: [
      {
        type: 'p',
        text: 'Una mattina di festa in palestra: canestri abbassati, palloni piccoli e tanti bambini alla prima esperienza con la palla a spicchi.',
      },
      { type: 'h2', text: 'Un gruppo per ogni età' },
      {
        type: 'list',
        items: ['Pulcini · 5–6 anni', 'Scoiattoli · 7–8 anni', 'Aquilotti · 9–10 anni', 'Esordienti · 11 anni'],
      },
      {
        type: 'p',
        text: 'Gli allenatori hanno guidato giochi di coordinazione e piccole partite, mentre i genitori hanno conosciuto lo staff e il metodo del club.',
      },
      {
        type: 'quote',
        text: 'Qui si impara giocando. Il canestro arriva dopo: prima vengono il sorriso e la squadra.',
        cite: 'Lo staff del minibasket',
      },
      {
        type: 'p',
        text: 'Da quella giornata il minibasket è diventato il cuore del progetto: due allenamenti a settimana e un gruppo che cresce, anno dopo anno.',
      },
    ],
  },
  {
    id: 'p-2026-3x3',
    slug: 'hyria-3x3-il-basket-in-piazza',
    title: 'Hyria 3x3: il basket in piazza',
    season: '2026/27',
    date: '2026-09-13',
    category: 'tornei',
    featured: true,
    cover: { src: '/images/6.jpg', alt: 'Pallone da basket nero con il logo Hyria e la scritta 2025', width: 1254, height: 1254 },
    excerpt:
      'Un torneo 3x3 all’aperto apre la seconda stagione: squadre di amici, giovani del vivaio e tifosi, tutti sullo stesso campo.',
    tags: ['3x3', 'torneo', 'territorio', 'nuova stagione'],
    content: [
      {
        type: 'p',
        text: 'Per aprire la stagione 2026/27 il club porta il basket fuori dalla palestra: un campo 3x3 montato all’aperto, musica e partite fino a sera.',
      },
      { type: 'h2', text: 'La formula' },
      {
        type: 'list',
        items: [
          'Tabellone Open e Under 16',
          'Partite da 10 minuti o a 21 punti',
          'Gara di tiro da tre per il pubblico',
        ],
      },
      {
        type: 'p',
        text: 'Squadre di amici, ragazzi del vivaio e giocatori della prima squadra si sono sfidati sullo stesso campo: lo spirito del 3x3 è proprio questo.',
      },
      {
        type: 'facts',
        items: [
          { value: '3x3', label: 'Formula' },
          { value: '2', label: 'Tabelloni' },
          { value: '2ª', label: 'Stagione al via' },
        ],
      },
      {
        type: 'p',
        text: 'Un modo per ringraziare chi ci ha seguito nel primo anno e per dare appuntamento a tutti in palestra, per una nuova stagione.',
      },
    ],
  },
];
