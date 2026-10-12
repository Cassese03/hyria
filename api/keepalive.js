// Vercel Cron (vedi "crons" in vercel.json): una richiesta al giorno tiene sveglio il progetto Supabase Free,
// che senza traffico per 7 giorni va in pausa. Usa le stesse variabili d'ambiente del sito.
export default async function handler(req, res) {
  // Vercel firma le chiamate del cron con CRON_SECRET, se impostato
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false });
  }

  // stessi nomi letti da vite.config.ts
  const env = process.env;
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key =
    env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Mancano SUPABASE_URL o SUPABASE_PUBLISHABLE_KEY' });
  }

  const r = await fetch(`${url}/rest/v1/partite?select=id&limit=1`, { headers: { apikey: key } });
  return res.status(r.ok ? 200 : 502).json({ ok: r.ok, supabase: r.status, at: new Date().toISOString() });
}
