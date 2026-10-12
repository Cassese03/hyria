import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Supabase: nel sito entrano SOLO l'URL e la chiave pubblica, letti per nome.
// Non allarghiamo `envPrefix`: l'integrazione Vercel crea anche SUPABASE_SERVICE_ROLE_KEY e SUPABASE_JWT_SECRET.
const URL_VARS = ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL']
const KEY_VARS = [
  'SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_ANON_KEY',
]

const pick = (env: Record<string, string>, names: string[]) => names.map((n) => env[n]).find(Boolean) ?? ''

function assertPublicKey(key: string) {
  if (key.startsWith('sb_secret_')) throw new Error('Chiave Supabase SEGRETA (sb_secret_…) nelle variabili del sito: usa la publishable.')
  if (key.split('.').length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString())
      if (payload.role === 'service_role') throw new Error('Chiave service_role nelle variabili del sito: usa la anon/publishable.')
    } catch (e) {
      if (e instanceof Error && e.message.includes('service_role')) throw e
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env } as Record<string, string>
  const supabaseUrl = pick(env, URL_VARS)
  const supabaseKey = pick(env, KEY_VARS)
  assertPublicKey(supabaseKey)

  return {
    plugins: [react()],
    define: {
      __SUPABASE_URL__: JSON.stringify(supabaseUrl),
      __SUPABASE_KEY__: JSON.stringify(supabaseKey),
    },
    server: {
      port: 8080,
      host: true,
    },
  }
})
