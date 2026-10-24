import { createMcpHandler, withMcpAuth } from '@vercel/mcp-adapter';
import { createClient } from '@supabase/supabase-js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { z } from 'zod';
import { getServiceClient } from '@/lib/supabase';

const subjectSchema = z.string().trim().min(1).max(100);
const gradeSchema = z.string().trim().min(1).max(50);
const typeSchema = z.string().trim().min(1).max(50);
const contentSchema = z.string().min(1).max(50_000);
const filterSchema = z.string().trim().min(1).max(100);

async function verifySupabaseAccessToken(
  _request: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('MCP authentication is not configured');
    return undefined;
  }
  try {
    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.getUser(bearerToken);
    if (error || !data.user?.id) return undefined;
    return {
      token: bearerToken,
      scopes: ['mxtlab:dashboard'],
      clientId: data.user.id,
      extra: { userId: data.user.id },
    };
  } catch {
    return undefined;
  }
}

function getAuthenticatedTeacherId(extra: { authInfo?: AuthInfo }): string | null {
  const userId = extra.authInfo?.extra?.userId;
  return typeof userId === 'string' && userId.length > 0 ? userId : null;
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
    async ({ subject, grade, type, content }, extra) => {
      const teacher_id = getAuthenticatedTeacherId(extra);
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
        return { content: [{ type: 'text', text: 'Save failed. Please try again later.' }], isError: true };
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
    async ({ subject, grade, type, limit }, extra) => {
      const teacher_id = getAuthenticatedTeacherId(extra);
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
        return { content: [{ type: 'text', text: 'Retrieval failed. Please try again later.' }], isError: true };
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

const authenticatedHandler = withMcpAuth(handler, verifySupabaseAccessToken, {
  required: true,
  requiredScopes: ['mxtlab:dashboard'],
});

export { authenticatedHandler as GET, authenticatedHandler as POST };
