import { createMcpHandler } from '@vercel/mcp-adapter';
import { z } from 'zod';
import { getServiceClient, getDemoTeacherId } from '@/lib/supabase';

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'save_to_dashboard',
      'Save a generated teaching artifact (lesson plan, assessment, or resource) to the teacher\'s mxtlab dashboard.',
      {
        subject: z.string().describe('e.g. Physics, Agriculture, Maths'),
        grade: z.string().describe('e.g. Grade 9, Grade 10'),
        type: z.string().describe('e.g. lesson_plan, assessment, resource'),
        content: z.string().describe('The full generated content to save, as text/markdown'),
      },
      async ({ subject, grade, type, content }) => {
        const supabase = getServiceClient();
        const teacher_id = getDemoTeacherId();

        const { data, error } = await supabase
          .from('dashboard_entries')
          .insert({ teacher_id, subject, grade, type, content })
          .select()
          .single();

        if (error) {
          return {
            content: [{ type: 'text', text: `Save failed: ${error.message}` }],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `Saved to dashboard: ${subject} · ${grade} · ${type} (id: ${data.id}, created ${data.created_at})`,
            },
          ],
        };
      },
    );

    server.tool(
      'get_my_dashboard',
      'Retrieve previously saved teaching artifacts from the teacher\'s mxtlab dashboard, optionally filtered.',
      {
        subject: z.string().optional().describe('Filter by subject, e.g. Physics'),
        grade: z.string().optional().describe('Filter by grade, e.g. Grade 10'),
        type: z.string().optional().describe('Filter by type, e.g. lesson_plan'),
        limit: z.number().int().min(1).max(50).optional().describe('Max results (default 10)'),
      },
      async ({ subject, grade, type, limit }) => {
        const supabase = getServiceClient();
        const teacher_id = getDemoTeacherId();

        let query = supabase
          .from('dashboard_entries')
          .select('*')
          .eq('teacher_id', teacher_id)
          .order('created_at', { ascending: false })
          .limit(limit ?? 10);

        if (subject) query = query.eq('subject', subject);
        if (grade) query = query.eq('grade', grade);
        if (type) query = query.eq('type', type);

        const { data, error } = await query;

        if (error) {
          return {
            content: [{ type: 'text', text: `Retrieval failed: ${error.message}` }],
            isError: true,
          };
        }

        if (!data || data.length === 0) {
          return { content: [{ type: 'text', text: 'No saved entries match those filters.' }] };
        }

        const summary = data
          .map(
            (e) =>
              `• [${e.id}] ${e.subject} · ${e.grade} · ${e.type} — created ${e.created_at}\n${e.content.slice(0, 300)}${e.content.length > 300 ? '…' : ''}`,
          )
          .join('\n\n');

        return { content: [{ type: 'text', text: summary }] };
      },
    );
  },
  {},
  { basePath: '/api', maxDuration: 60, verboseLogs: true },
);

export { handler as GET, handler as POST };
