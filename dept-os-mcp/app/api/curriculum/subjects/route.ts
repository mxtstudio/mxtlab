import { createClient } from '@supabase/supabase-js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { z } from 'zod';
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
    // Ensure the user exists in profiles (optional but mirrors MCP route)
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

  // Run inside async local storage for consistency (not strictly needed here)
  return authContext.run({ userId }, async () => {
    const supabase = getServiceClient();
    const { data: subjects, error: subErr } = await supabase.from('subjects').select('*');
    if (subErr) return new Response(JSON.stringify({ error: subErr.message }), { status: 500 });
    const { data: strands, error: strandErr } = await supabase.from('strands').select('*');
    if (strandErr) return new Response(JSON.stringify({ error: strandErr.message }), { status: 500 });
    const { data: units, error: unitErr } = await supabase.from('units').select('*');
    if (unitErr) return new Response(JSON.stringify({ error: unitErr.message }), { status: 500 });
    const { data: standards, error: stdErr } = await supabase.from('content_standards').select('*');
    if (stdErr) return new Response(JSON.stringify({ error: stdErr.message }), { status: 500 });
    const { data: benchmarks, error: bmErr } = await supabase.from('benchmarks').select('*');
    if (bmErr) return new Response(JSON.stringify({ error: bmErr.message }), { status: 500 });
    const { data: topics, error: topErr } = await supabase.from('topics').select('*');
    if (topErr) return new Response(JSON.stringify({ error: topErr.message }), { status: 500 });

    // Simple nesting algorithm
    const topicsByBenchmark = topics.reduce((acc, t) => {
      (acc[t.benchmark_id] = acc[t.benchmark_id] || []).push(t);
      return acc;
    }, {} as Record<string, any[]>);
    const benchmarksNested = benchmarks.map(b => ({ ...b, topics: topicsByBenchmark[b.id] || [] }));
    const standardsNested = standards.map(s => ({ ...s, benchmarks: benchmarksNested.filter(b => b.standard_id === s.id) }));
    const unitsNested = units.map(u => ({ ...u, standards: standardsNested.filter(s => s.unit_id === u.id) }));
    const strandsNested = strands.map(s => ({ ...s, units: unitsNested.filter(u => u.strand_id === s.id) }));
    const subjectsNested = subjects.map(sub => ({ ...sub, strands: strandsNested.filter(st => st.subject_id === sub.id) }));

    return new Response(JSON.stringify({ curriculum: subjectsNested }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  });
}
