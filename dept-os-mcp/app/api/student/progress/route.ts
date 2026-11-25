import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

const progressPayloadSchema = z.object({
  topic_id: z.string().uuid(),
  status: z.enum(['in_progress', 'completed']),
});

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

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function unauthorized(): Response {
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function forbidden(): Response {
  return jsonResponse({ error: 'Forbidden: you can only access your own progress.' }, 403);
}

function invalidPayload(): Response {
  return jsonResponse({ error: 'Invalid payload' }, 400);
}

export async function GET(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized();
  const userId = await verifySupabaseAccessToken(match[1].trim());
  if (!userId) return unauthorized();

  // Do not trust a caller-supplied student_id when using the service-role client.
  // Teacher-to-roster authorization is not implemented in this endpoint yet, so
  // callers are restricted to their own authenticated user ID until that model exists.
  const url = new URL(request.url);
  const requestedStudentId = url.searchParams.get('student_id');
  if (requestedStudentId && requestedStudentId !== userId) return forbidden();
  const studentId = userId;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('student_progress').select('*').eq('student_id', studentId);
  if (error) {
    console.error('Student progress retrieval failed.');
    return jsonResponse({ error: 'Unable to retrieve progress' }, 500);
  }

  return jsonResponse({ progress: data }, 200);
}

export async function POST(request: Request): Promise<Response> {
  const authHeader = request.headers.get('authorization');
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  if (!match) return unauthorized();
  const userId = await verifySupabaseAccessToken(match[1].trim());
  if (!userId) return unauthorized();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidPayload();
  }

  const parsed = progressPayloadSchema.safeParse(payload);
  if (!parsed.success) return invalidPayload();

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('student_progress')
    .insert({
      student_id: userId,
      topic_id: parsed.data.topic_id,
      status: parsed.data.status,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Student progress update failed.');
    return jsonResponse({ error: 'Unable to update progress' }, 500);
  }

  return jsonResponse({ record: data }, 201);
}
