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
  birthYear: null,
  birthPlace: null,
  heightCm: null,
  weightKg: null,
});

/** Ordinato per categoria (poi per numero): è l'ordine in cui le maglie sono appese al binario. */
export const LOCKER_ROSTER: LockerPlayer[] = [
  base(3, 'Alessandro', 'Ascione', 'Guardia', 'GUARDIE'),
  base(19, 'Davide', 'Esposito', 'Playmaker', 'GUARDIE'),
  base(30, 'Paolino', 'Franzese', 'Guardia', 'GUARDIE'),
  base(32, 'Attilio', 'De Sena', 'Playmaker', 'GUARDIE'),
  base(34, 'Giovanni', 'Sangermano', 'Guardia', 'GUARDIE'),
  base(93, 'Giovanni', 'Attanasio', 'Guardia', 'GUARDIE'),

  base(5, 'Agostino Pio', 'Esposito', 'Ala Grande', 'ALI'),
  base(7, 'Christian', 'Barrella', 'Ala Piccola', 'ALI'),
  base(9, 'Giovanni', 'Spiezia', 'Ala Grande', 'ALI'),
  base(17, 'Ciro Francesco', 'Piscopo', 'Ala Grande', 'ALI'),
  base(21, 'Christian', 'CASSSHEEEEEEESEEEEEE', 'Ala Piccola', 'ALI'),
  base(33, 'Lorenzo', 'Cassese', 'Ala Piccola', 'ALI'),
  base(35, 'Giacomo', 'Mascolo', 'Ala Piccola', 'ALI'),
  base(42, 'Davide', 'Guadagni', 'Ala Grande', 'ALI'),

  base(0, 'Luigi', 'Manfellotto', 'Centro', 'CENTRI'),
];
