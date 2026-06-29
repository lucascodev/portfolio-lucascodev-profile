import { sessionOptions, type SessionData } from '@/shared/config/session/session.config';
import { STORAGE_BUCKET, getSupabaseAdmin } from '@/shared/lib/supabase/supabase-admin.lib';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const FOLDER_PATTERN = /^[a-z0-9][a-z0-9_-]{0,49}$/i;
const EXT_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = formData.get('folder');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 });
  }
  if (typeof folder !== 'string' || !FOLDER_PATTERN.test(folder)) {
    return NextResponse.json({ error: 'Pasta inválida' }, { status: 400 });
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Arquivo excede 5 MB' }, { status: 400 });
  }

  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const client = getSupabaseAdmin();
  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl }, { status: 201 });
}
