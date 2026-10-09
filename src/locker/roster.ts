export type LockerCategory = 'GUARDIE' | 'ALI' | 'CENTRI';

export interface LockerPlayer {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  role: string;
  category: LockerCategory;
  club: string;
  /** Statistiche non ancora fornite dal club: restano `null` e la scheda mostra "—". */
  appearances: number | null;
  points: number | null;
  birthYear: number | null;
  birthPlace: string | null;
  heightCm: number | null;
  weightKg: number | null;
}

export const CATEGORY_ORDER: LockerCategory[] = ['GUARDIE', 'ALI', 'CENTRI'];

const base = (
  number: number,
  firstName: string,
  lastName: string,
  role: string,
  category: LockerCategory,
  birthYear: number | null = null,
  birthPlace: string | null = null,
  heightCm: number | null = null,
): LockerPlayer => ({
  id: `${number}-${lastName.toLowerCase().replace(/\s+/g, '-')}`,
  number,
  firstName,
  lastName,
  role,
  category,
  club: 'Hyria Basket',
  appearances: null,
  points: null,
  birthYear,
  birthPlace,
  heightCm,
  weightKg: null,
});

/** Ordinato per categoria (poi per numero): è l'ordine in cui le maglie sono appese al binario. */
export const LOCKER_ROSTER: LockerPlayer[] = [
  base(3, 'Alessandro', 'Ascione', 'Guardia', 'GUARDIE',1997,'Napoli',180),
  base(19, 'Davide', 'Esposito', 'Playmaker', 'GUARDIE'),
  base(10, 'Attilio', 'De Sena', 'Playmaker', 'GUARDIE'),

  base(2, 'Paolino', 'Franzese', 'Guardia', 'GUARDIE',2001,'Napoli',174),
  base(34, 'Giovanni', 'Sangermano', 'Guardia', 'GUARDIE'),
  base(93, 'Giovanni', 'Attanasio', 'Guardia', 'GUARDIE',2006,'Napoli',182),

  // base(7, 'Christian', 'Barrella', 'Ala Piccola', 'ALI'),
  // base(21, 'Christian', 'CASSSHEEEEEEESEEEEEE', 'Ala Piccola', 'ALI'),

  base(21, 'Lorenzo', 'Cassese', 'Ala Piccola', 'ALI',2003,'San Gennaro Vesuviano',185),
  base(35, 'Giacomo', 'Mascolo', 'Ala Piccola', 'ALI'),

  base(42, 'Davide', 'Guadagni', 'Ala Grande', 'ALI',2005,'Napoli',187),
  base(5, 'Agostino Pio', 'Esposito', 'Ala Grande', 'ALI'),
  base(9, 'Giovanni', 'Spiezia', 'Ala Grande', 'ALI',1997,'Nola',188),
  // base(17, 'Ciro Francesco', 'Piscopo', 'Ala Grande', 'ALI'),

  // base(0, 'Luigi', 'Manfellotto', 'Centro', 'CENTRI'),
  base(0, 'Claudio', 'Capone', 'Centro', 'CENTRI',2004,'Napoli',194),
  base(4, 'Simone', 'Soricelli', 'Centro', 'CENTRI',2006,'Torre del Greco',192),
  base(0, 'Alfonso', 'Carillo', 'Centro', 'CENTRI',2006,'Sarno',193),
  base(0, 'Marco', 'Gallo', 'Centro', 'CENTRI',1996,'Agropoli',190),
];
