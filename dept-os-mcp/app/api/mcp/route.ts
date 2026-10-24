import { AsyncLocalStorage } from 'node:async_hooks';
import { createMcpHandler } from '@vercel/mcp-adapter';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const authContext = new AsyncLocalStorage<{ userId: string }>();

const subjectSchema = z.string().trim().min(1).max(100);
const gradeSchema = z.string().trim().min(1).max(50);
const typeSchema = z.string().trim().min(1).max(50);
const contentSchema = z.string().min(1).max(50_000);
const filterSchema = z.string().trim().min(1).max(100);

async function verifySupabaseAccessToken(token: string): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('MCP authentication is not configured');
    return null;
  }

  try {
    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    // Ask Supabase Auth to validate the token; do not trust decoded claims alone.
    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data.user?.id) return null;

    // dashboard_entries.teacher_id references profiles.id, so only accept a
    // verified Auth user that has a matching MXT Lab teacher profile.
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

function getAuthenticatedTeacherId(): string | null {
  return authContext.getStore()?.userId ?? null;
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'www-authenticate': 'Bearer',
      'cache-control': 'no-store',
    },
  });
}

const handler = createMcpHandler((server) => {
  server.tool(
    'save_to_dashboard',
    'Save a teaching artifact to the signed-in teacher\'s MXT Lab dashboard.',
    {
      subject: subjectSchema,
      grade: gradeSchema,
      type: typeSchema,
      content: contentSchema,
    },
    async ({ subject, grade, type, content }) => {
      const teacher_id = getAuthenticatedTeacherId();
      if (!teacher_id) {
        return { content: [{ type: 'text', text: 'Authentication required.' }], isError: true };
      }

      const { data, error } = await getServiceClient()
        .from('dashboard_entries')
        .insert({ teacher_id, subject, grade, type, content })
        .select('id, created_at')
        .single();

      if (error || !data) {
        console.error('MCP dashboard save failed');
        return {
          content: [{ type: 'text', text: 'Save failed. Please try again later.' }],
          isError: true,
        };
      }

      return {
        content: [{
          type: 'text',
          text: `Saved to dashboard: ${subject} · ${grade} · ${type} (id: ${data.id}, created ${data.created_at})`,
        }],
      };
    },
  );

  server.tool(
    'get_my_dashboard',
    'Retrieve the signed-in teacher\'s saved teaching artifacts.',
    {
      subject: filterSchema.optional(),
      grade: z.string().trim().min(1).max(50).optional(),
      type: z.string().trim().min(1).max(50).optional(),
      limit: z.number().int().min(1).max(20).optional(),
    },
    async ({ subject, grade, type, limit }) => {
      const teacher_id = getAuthenticatedTeacherId();
      if (!teacher_id) {
        return { content: [{ type: 'text', text: 'Authentication required.' }], isError: true };
      }

      let query = getServiceClient()
        .from('dashboard_entries')
        .select('id, subject, grade, type, content, created_at')
        .eq('teacher_id', teacher_id)
        .order('created_at', { ascending: false })
        .limit(limit ?? 10);

      if (subject) query = query.eq('subject', subject);
      if (grade) query = query.eq('grade', grade);
      if (type) query = query.eq('type', type);

      const { data, error } = await query;
      if (error) {
        console.error('MCP dashboard retrieval failed');
        return {
          content: [{ type: 'text', text: 'Retrieval failed. Please try again later.' }],
          isError: true,
        };
      }

      if (!data?.length) {
        return { content: [{ type: 'text', text: 'No saved entries match those filters.' }] };
      }

      const summary = data.map((entry) =>
        `• [${entry.id}] ${entry.subject} · ${entry.grade} · ${entry.type} — created ${entry.created_at}\n${entry.content.slice(0, 300)}${entry.content.length > 300 ? '…' : ''}`,
      ).join('\n\n');

      return { content: [{ type: 'text', text: summary }] };
    },
  );
}, {}, { basePath: '/api', maxDuration: 60, verboseLogs: false });

async function authenticatedHandler(request: Request): Promise<Response> {
  const authorization = request.headers.get('authorization');
  const match = authorization?.match(/^Bearer\\s+(.+)$/i);
  if (!match) return unauthorized();

  const userId = await verifySupabaseAccessToken(match[1].trim());
  if (!userId) return unauthorized();

  // AsyncLocalStorage binds identity to this request's async work, not global
  // mutable state, so concurrent teachers cannot overwrite one another.
  return authContext.run({ userId }, () => handler(request));
}

export { authenticatedHandler as GET, authenticatedHandler as POST };
