import { createMcpHandler } from '@vercel/mcp-adapter';
import { z } from 'zod';
import { getServiceClient, getDemoTeacherId } from '@/lib/supabase';

const subjectSchema = z.string().trim().min(1).max(100);
const gradeSchema = z.string().trim().min(1).max(50);
const typeSchema = z.string().trim().min(1).max(50);
const contentSchema = z.string().min(1).max(50_000);
const filterSchema = z.string().trim().min(1).max(100);

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'save_to_dashboard',
      'Save a generated teaching artifact (lesson plan, assessment, or resource) to the teacher\'s mxtlab dashboard.',
      {
        subject: subjectSchema.describe('e.g. Physics, Agriculture, Maths (max 100 characters)'),
        grade: gradeSchema.describe('e.g. Grade 9, Grade 10 (max 50 characters)'),
        type: typeSchema.describe('e.g. lesson_plan, assessment, resource (max 50 characters)'),
        content: contentSchema.describe('Full generated content as text/markdown (max 50,000 characters)'),
      },
      async ({ subject, grade, type, content }) => {
        const supabase = getServiceClient();
        const teacher_id = getDemoTeacherId();

        const { data, error } = await supabase
          .from('dashboard_entries')
          .insert({ teacher_id, subject, grade, type, content })
          .select('id, created_at')
          .single();

        if (error || !data) {
          // Keep database details in server-side diagnostics only; never return them to a caller.
          console.error('MCP dashboard save failed');
          return {
            content: [{ type: 'text', text: 'Save failed. Please try again later.' }],
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
        subject: filterSchema.optional().describe('Filter by subject, e.g. Physics (max 100 characters)'),
        grade: z.string().trim().min(1).max(50).optional().describe('Filter by grade, e.g. Grade 10 (max 50 characters)'),
        type: z.string().trim().min(1).max(50).optional().describe('Filter by type, e.g. lesson_plan (max 50 characters)'),
        limit: z.number().int().min(1).max(20).optional().describe('Max results (default 10, maximum 20)'),
      },
      async ({ subject, grade, type, limit }) => {
        const supabase = getServiceClient();
        const teacher_id = getDemoTeacherId();

        let query = supabase
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

        if (!data || data.length === 0) {
          return { content: [{ type: 'text', text: 'No saved entries match those filters.' }] };
        }

        const summary = data
          .map(
            (entry) =>
              `• [${entry.id}] ${entry.subject} · ${entry.grade} · ${entry.type} — created ${entry.created_at}\n${entry.content.slice(0, 300)}${entry.content.length > 300 ? '…' : ''}`,
          )
          .join('\n\n');

        return { content: [{ type: 'text', text: summary }] };
      },
    );
  },
  {},
  { basePath: '/api', maxDuration: 60, verboseLogs: false },
);

export { handler as GET, handler as POST };
