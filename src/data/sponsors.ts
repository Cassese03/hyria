// Sponsor del club: usati dalla pagina Sponsor e dai cartelloni LED della scena 3D.

export interface SponsorEntry {
  name: string;
  image: string;
  website?: string;
}

export interface SponsorTier {
  id: 'main' | 'silver' | 'bronze';
  label: string;
  sponsors: SponsorEntry[];
}

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: 'main',
    label: 'Main sponsor',
    sponsors: [
      { name: "McDonald's", image: '/images/McDonalds.jpg', website: 'https://www.mcdonalds.it/' },
      {
        name: 'Casa Amica',
        image: 'https://casamicaservizi.it/wp-content/uploads/2024/05/logocasamica.png',
        website: 'https://casamicaservizi.it/',
      },
      {
        name: 'I Mobili',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2o2WCJrl0vaU4ae7_3IpyPOjCErE1HqAGNQ&s',
        website: 'https://www.imobiliarredamenti.it/',
      },
    ],
  },
  {
    id: 'silver',
    label: 'Silver sponsor',
    sponsors: [
      {
        name: 'Hyria Consulting',
        image: 'https://www.hyriaconsulting.it/wp-content/uploads/2023/08/logo-HC-2.png',
        website: 'https://www.hyriaconsulting.it/',
      },
    ],
  },
  {
    id: 'bronze',
    label: 'Bronze sponsor',
    sponsors: [
      {
        name: 'DilamaBaby',
        image:
          'https://dilamababystore.com/cdn/shop/files/Logo_int_f3c10636-63a1-4461-88c0-076d651e5428_1024x1024.png?v=1637411319',
        website: 'https://dilamababystore.com/',
      },
      { name: 'Softmaint S.R.L.', image: '/images/SM_Logo.jpg', website: 'https://softmaint.it' },
      { name: 'Queen Bees Baiano', image: '/images/StockShoes.jpg' },
      { name: 'Enoteca De Sena', image: '/images/EnotecaDeSena.jpg' },
      { name: 'Studio Napolitano Associati', image: '/images/StudioNapolitano.jpg' },
    ],
  },
];

/** Tutti gli sponsor in ordine di livello, per i cartelloni a bordo campo */
export const BOARD_SPONSORS = SPONSOR_TIERS.flatMap((t) => t.sponsors).map(({ name, image }) => ({ name, image }));

export interface SponsorPackage {
  name: string;
  price: string;
  /** pacchetto di cui questo include tutti i vantaggi */
  includes?: string;
  benefits: string[];
}

// Dal più accessibile al più completo: ogni livello comprende il precedente.
export const SPONSOR_PACKAGES: SponsorPackage[] = [
  {
    name: 'Bronze',
    price: 'Da 1.000 €/anno + IVA',
    benefits: [
      'Logo nella sezione sponsor del sito e sui social',
      'Ringraziamenti sui social',
      'Logo nel banner multisponsor, esposto in tutte le partite casalinghe',
      "Logo sull'attrezzatura del settore minibasket",
    ],
  },
  {
    name: 'Silver',
    price: 'Da 2.000 €/anno + IVA',
    includes: 'Bronze',
    benefits: ["Logo sull'attrezzatura della prima squadra e delle giovanili"],
  },
  {
    name: 'Main',
    price: 'Da 4.000 €/anno + IVA',
    includes: 'Silver',
    benefits: [
      "Scelta della posizione del logo sull'attrezzatura",
      'Banner pubblicitario dedicato, esposto in tutte le partite casalinghe',
    ],
  },
  {
    name: 'Title',
    price: 'Da 10.000 €/anno + IVA',
    includes: 'Main',
    benefits: ['Il nome della tua azienda accanto a quello della squadra, per esempio «Nome Azienda Hyria Basket»'],
  },
];

export const SPONSOR_BENEFITS = [
  {
    title: 'Visibilità locale',
    text: 'Raggiungi un pubblico locale e regionale attraverso le partite, gli eventi e la nostra presenza sui media.',
  },
  {
    title: 'Networking',
    text: 'Entra in contatto con altri sponsor e partner commerciali, creando nuove opportunità di business.',
  },
  {
    title: 'Coinvolgimento',
    text: 'Coinvolgi clienti e dipendenti in eventi sportivi emozionanti e iniziative per la comunità.',
  },
  {
    title: 'Associazione al marchio',
    text: 'Associa il tuo marchio ai valori di passione, impegno e innovazione che caratterizzano Hyria Basket.',
  },
  {
    title: 'Contenuti digitali',
    text: 'Sfrutta la nostra presenza sui social e ottieni contenuti esclusivi per il tuo marketing.',
  },
];
