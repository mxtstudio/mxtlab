import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

const progressPayloadSchema = z.object({
  topic_id: z.string().uuid(),
  status: z.enum(['in_progress', 'completed']),
});

type VerifiedIdentity = { userId: string; role: string };

async function verifySupabaseAccessToken(token: string): Promise<VerifiedIdentity | null> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  try {
    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data.user?.id) return null;

    const { data: profile, error: profileError } = await getServiceClient()
      .from('profiles')
      .select('id, role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile || typeof profile.role !== 'string') return null;
    return { userId: data.user.id, role: profile.role };
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

function forbidden(message = 'Forbidden'): Response {
  return jsonResponse({ error: message }, 403);
}

function invalidPayload(): Response {
  return jsonResponse({ error: 'Invalid payload' }, 400);
}

function getBearerToken(request: Request): string | null {
  const match = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function GET(request: Request): Promise<Response> {
  const token = getBearerToken(request);
  if (!token) return unauthorized();

  const identity = await verifySupabaseAccessToken(token);
  if (!identity) return unauthorized();
  if (!['student', 'teacher', 'admin'].includes(identity.role)) return forbidden();

  const requestedStudentId = new URL(request.url).searchParams.get('student_id');
  if (requestedStudentId && requestedStudentId !== identity.userId) {
    return forbidden('You can only access your own progress.');
  }

  const { data, error } = await getServiceClient()
    .from('student_progress')
    .select('*')
    .eq('student_id', identity.userId);

  if (error) {
    console.error('Student progress retrieval failed.');
    return jsonResponse({ error: 'Unable to retrieve progress' }, 500);
  }

  return jsonResponse({ progress: data }, 200);
}

export async function POST(request: Request): Promise<Response> {
  const token = getBearerToken(request);
  if (!token) return unauthorized();

  const identity = await verifySupabaseAccessToken(token);
  if (!identity) return unauthorized();
  if (identity.role !== 'student') return forbidden('A student account is required.');

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return invalidPayload();
  }

  const parsed = progressPayloadSchema.safeParse(payload);
  if (!parsed.success) return invalidPayload();

  const completedAt = parsed.data.status === 'completed' ? new Date().toISOString() : null;
  const { data, error } = await getServiceClient()
    .from('student_progress')
    .upsert({
      student_id: identity.userId,
      topic_id: parsed.data.topic_id,
      status: parsed.data.status,
      completed_at: completedAt,
    }, { onConflict: 'student_id,topic_id' })
    .select('*')
    .single();

  if (error) {
    console.error('Student progress update failed.');
    return jsonResponse({ error: 'Unable to update progress' }, 500);
  }

  return jsonResponse({ record: data }, 200);
}
