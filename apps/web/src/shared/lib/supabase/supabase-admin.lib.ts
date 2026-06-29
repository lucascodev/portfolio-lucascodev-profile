import { createClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = 'portfolio';

let _adminClient: ReturnType<typeof createClient> | null = null;

/**
 * Cliente Supabase com a service role key (SUPABASE_SECRET_KEY).
 * USO EXCLUSIVO NO SERVIDOR — ignora as Storage Policies (RLS), portanto a
 * chave nunca pode chegar ao browser. Importar apenas em route handlers / código server.
 */
export function getSupabaseAdmin() {
  if (!_adminClient) {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!url || !secretKey) {
      throw new Error(
        'SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórios para uploads no servidor',
      );
    }
    _adminClient = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _adminClient;
}
