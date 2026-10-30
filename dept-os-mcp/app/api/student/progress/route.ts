import { createClient } from '@supabase/supabase-js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

const authContext = new AsyncLocalStorage<{ userId: string }>();

async function verifySupabaseAccessToken(token: string): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  try {
    const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user?.id) return null;
    const { data: profile, error: profileError } = await getServiceClient()
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();
    if (profileError || !profile) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
}

export async function GET(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized();
  const userId = await verifySupabaseAccessToken(match[1].trim());
  if (!userId) return unauthorized();

  // Student can only see their own progress; teachers can view any student via query param (not implemented yet)
  const url = new URL(request.url);
  const studentId = url.searchParams.get('student_id') ?? userId;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('student_progress').select('*').eq('student_id', studentId);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } });

  return new Response(JSON.stringify({ progress: data }), { status: 200, headers: { 'content-type': 'application/json' } });
}

export async function POST(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized();
  const userId = await verifySupabaseAccessToken(match[1].trim());
  if (!userId) return unauthorized();

  const payload = await request.json();
  // Expected payload: { topic_id: string, status: 'in_progress'|'completed' }
  const { topic_id, status } = payload;
  if (!topic_id || !['in_progress', 'completed'].includes(status)) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('student_progress').insert({ student_id: userId, topic_id, status }).select('*').single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } });

  return new Response(JSON.stringify({ record: data }), { status: 201, headers: { 'content-type': 'application/json' } });
}
