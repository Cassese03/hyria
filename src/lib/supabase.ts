import { createClient } from '@supabase/supabase-js';

/**
 * `null` finché le variabili d'ambiente non sono configurate: la pagina lo segnala invece di rompersi.
 * Nessun login: il sito usa solo la chiave pubblica e le funzioni esposte dal database.
 */
export const supabase =
  __SUPABASE_URL__ && __SUPABASE_KEY__
    ? createClient(__SUPABASE_URL__, __SUPABASE_KEY__, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;
