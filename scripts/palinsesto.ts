// Genera l'SQL del palinsesto di una partita a partire dal roster dello spogliatoio.
//
//   node scripts/palinsesto.ts --avversario "Basket Pomigliano" --data "2026-10-25 18:30" [--trasferta]
//        [--luogo "PalaMerliano"] [--escludi 21-cassese,9-spiezia] [--apri]
//
// Scrive supabase/palinsesti/<data>-<avversario>.sql: incollalo nel SQL Editor di Supabase.
// Senza --apri la partita nasce in `bozza` (invisibile) per poterla controllare prima.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { LOCKER_ROSTER } from '../src/locker/roster.ts';
import { buildMarkets } from '../src/schedina/markets.ts';

const { values: args } = parseArgs({
  options: {
    avversario: { type: 'string' },
    data: { type: 'string' },
    trasferta: { type: 'boolean', default: false },
    luogo: { type: 'string' },
    escludi: { type: 'string', default: '' },
    apri: { type: 'boolean', default: false },
  },
});

const fail = (msg: string) => {
  console.error(`Errore: ${msg}`);
  process.exit(1);
};

if (!args.avversario) fail('manca --avversario "Nome squadra"');
if (!args.data || !/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(args.data)) fail('--data deve essere "AAAA-MM-GG HH:MM" (ora italiana)');

const avversario = args.avversario!;
const data = args.data!.replace('T', ' ');
const excluded = new Set(args.escludi.split(',').map((s) => s.trim()).filter(Boolean));
const unknown = [...excluded].filter((id) => !LOCKER_ROSTER.some((p) => p.id === id));
if (unknown.length) fail(`id non presenti nel roster: ${unknown.join(', ')}. Id validi: ${LOCKER_ROSTER.map((p) => p.id).join(', ')}`);

const q = (v: string | number | null | undefined) =>
  v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`;

const players = LOCKER_ROSTER.filter((p) => !excluded.has(p.id));
const seed = `${data}|${avversario}`;
const lines: string[] = [
  `-- Palinsesto: Hyria Basket ${args.trasferta ? '@' : 'vs'} ${avversario} · ${data}`,
  `-- ${players.length} giocatori${excluded.size ? ` (esclusi: ${[...excluded].join(', ')})` : ''}`,
  'do $$',
  'declare',
  '  v_partita bigint;',
  '  v_mercato bigint;',
  'begin',
  `  insert into public.partite (avversario, data_ora, in_casa, luogo, stato)`,
  `  values (${q(avversario)}, timestamp ${q(data)} at time zone 'Europe/Rome', ${!args.trasferta}, ${q(args.luogo)}, ${q(args.apri ? 'aperta' : 'bozza')})`,
  '  returning id into v_partita;',
];

for (const p of players) {
  const { markets } = buildMarkets(p, seed);
  lines.push('', `  -- ${p.number} ${p.firstName} ${p.lastName}`);
  for (const m of markets) {
    lines.push(
      `  insert into public.mercati (partita_id, giocatore_id, tipo, gruppo, etichetta, descrizione, linea, linea2, stat2)`,
      `  values (v_partita, ${q(p.id)}, ${q(m.kind)}, ${q(m.group)}, ${q(m.label)}, ${q(m.hint)}, ${q(m.line)}, ${q(m.line2)}, ${q(m.stat2)}) returning id into v_mercato;`,
      `  insert into public.esiti (mercato_id, codice, etichetta, pick, quota) values`,
      m.outcomes.map((o) => `    (v_mercato, ${q(o.kind)}, ${q(o.label)}, ${q(o.pick)}, ${o.odds.toFixed(2)})`).join(',\n') + ';',
    );
  }
}

lines.push('', `  raise notice 'Creata la partita %', v_partita;`, 'end $$;', '');

const slug = avversario.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'supabase', 'palinsesti', `${data.slice(0, 10)}-${slug}.sql`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join('\n'));

console.log(`Scritto ${out}`);
console.log(`${players.length} giocatori, ${players.length * 10} mercati. Stato iniziale: ${args.apri ? 'aperta' : 'bozza'}.`);
if (!args.apri) console.log(`Dopo il controllo: update public.partite set stato = 'aperta' where id = <id>;`);
