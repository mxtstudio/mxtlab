/**
 * Authentication and tenant-isolation tests for app/api/mcp/route.ts.
 * Mirrors the "Required authentication test matrix" in AUDIT_REPORT.md.
 *
 * Supabase is replaced by an in-memory fake (tests/fakeSupabase.ts). The fake's
 * service client bypasses RLS exactly like the real service-role key, so these
 * tests prove the ROUTE's own ownership logic, not database policies.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@supabase/supabase-js', async () => await import('./fakeSupabase'));

import { state, resetState } from './fakeSupabase';
import { setEnv, loadRoute, toolCall, mcpRequest, readRpc, readFirstMessage, toolText } from './helpers';

const A = { id: 'user-a', token: 'tok-a' };
const B = { id: 'user-b', token: 'tok-b' };
const bearer = (t: string) => ({ authorization: `Bearer ${t}` });

function seedTeachers() {
  for (const u of [A, B]) {
    state.tokens.set(u.token, u.id);
    state.tables.profiles.push({ id: u.id });
  }
}

function seedEntries() {
  const base = { grade: 'Grade 9', type: 'lesson_plan' };
  state.tables.dashboard_entries.push(
    { id: 'a-1', teacher_id: A.id, subject: 'Agriculture', content: 'A CONFIDENTIAL plan', created_at: '2026-10-01T00:00:00Z', ...base },
    { id: 'a-2', teacher_id: A.id, subject: 'Maths', content: 'A maths plan', created_at: '2026-10-02T00:00:00Z', ...base },
    { id: 'b-1', teacher_id: B.id, subject: 'Agriculture', content: 'B PRIVATE plan', created_at: '2026-10-03T00:00:00Z', ...base },
    { id: 'b-2', teacher_id: B.id, subject: 'Physics', content: 'B physics plan', created_at: '2026-10-04T00:00:00Z', ...base },
  );
}

let errSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  resetState();
  setEnv();
  errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => errSpy.mockRestore());

describe('1. No Authorization header', () => {
  it('returns 401 and no data', async () => {
    seedTeachers(); seedEntries();
    const { POST, GET } = await loadRoute();
    for (const h of [POST, GET]) {
      const res = await h(toolCall('get_my_dashboard', {}));
      expect(res.status).toBe(401);
      expect(res.headers.get('www-authenticate')).toBe('Bearer');
      expect(res.headers.get('cache-control')).toBe('no-store');
      expect(await res.text()).not.toMatch(/PRIVATE|CONFIDENTIAL|plan/);
    }
  });
});

describe('2. Malformed Authorization header', () => {
  const bad = [
    'Bearer',
    'Bearer ',
    'Bearer    ',
    'Basic dXNlcjpwYXNz',
    'Token tok-a',
    'tok-a',
    'Bearertok-a',
    '',
  ];
  it.each(bad)('rejects %j with 401', async (value) => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    const res = await POST(toolCall('get_my_dashboard', {}, { authorization: value }));
    expect(res.status).toBe(401);
  });

  it('accepts standard Bearer variants (regression for PR #11)', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    for (const value of ['Bearer tok-a', 'bearer tok-a', 'BEARER tok-a', 'Bearer   tok-a', 'Bearer tok-a ']) {
      const res = await POST(toolCall('get_my_dashboard', {}, { authorization: value }));
      expect(res.status, value).toBe(200);
    }
  });
});

describe('3. Invalid, expired or revoked token', () => {
  it('rejects unknown, expired and revoked tokens with 401', async () => {
    seedTeachers(); seedEntries();
    state.rejected.add('expired-tok');
    const { POST } = await loadRoute();
    for (const t of ['made-up', 'expired-tok', 'eyJhbGciOi.fake.jwt', "tok-a'; drop table profiles;--"]) {
      const res = await POST(toolCall('get_my_dashboard', {}, bearer(t)));
      expect(res.status, t).toBe(401);
      expect(await res.text()).not.toMatch(/plan/);
    }
  });

  it('a token that was valid and is then revoked stops working immediately', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    expect((await POST(toolCall('get_my_dashboard', {}, bearer(A.token)))).status).toBe(200);
    state.tokens.delete(A.token);
    state.rejected.add(A.token);
    expect((await POST(toolCall('get_my_dashboard', {}, bearer(A.token)))).status).toBe(401);
  });
});

describe('4. Valid token, no teacher profile', () => {
  it('is denied for both tools and writes nothing', async () => {
    state.tokens.set('tok-ghost', 'user-ghost'); // authenticated in Auth, but no profiles row
    seedEntries();
    const { POST } = await loadRoute();
    const get = await POST(toolCall('get_my_dashboard', {}, bearer('tok-ghost')));
    expect(get.status).toBe(401);
    const save = await POST(toolCall('save_to_dashboard',
      { subject: 'x', grade: 'x', type: 'x', content: 'x' }, bearer('tok-ghost')));
    expect(save.status).toBe(401);
    expect(state.tables.dashboard_entries.some((r) => r.teacher_id === 'user-ghost')).toBe(false);
    expect(state.tables.dashboard_entries).toHaveLength(4);
  });
});

describe('5. Valid token returns only that teacher\'s records', () => {
  it('teacher A sees only A; teacher B sees only B', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    const a = toolText(await readRpc(await POST(toolCall('get_my_dashboard', {}, bearer(A.token)))));
    expect(a).toContain('a-1'); expect(a).toContain('a-2');
    expect(a).not.toContain('b-1'); expect(a).not.toContain('b-2');
    expect(a).not.toContain('B PRIVATE');
    const b = toolText(await readRpc(await POST(toolCall('get_my_dashboard', {}, bearer(B.token)))));
    expect(b).toContain('b-1'); expect(b).toContain('b-2');
    expect(b).not.toContain('a-1'); expect(b).not.toContain('A CONFIDENTIAL');
  });

  it('filters narrow within the teacher\'s own data, never widen across teachers', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    // B also has an Agriculture entry; A filtering on Agriculture must only get A's.
    const out = toolText(await readRpc(await POST(
      toolCall('get_my_dashboard', { subject: 'Agriculture' }, bearer(A.token)))));
    expect(out).toContain('a-1');
    expect(out).not.toContain('b-1');
  });

  it('saved entries are stamped with the verified teacher id', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const res = await POST(toolCall('save_to_dashboard',
      { subject: 'Agriculture', grade: 'Grade 10', type: 'quiz', content: 'new' }, bearer(A.token)));
    expect(res.status).toBe(200);
    expect(toolText(await readRpc(res))).toMatch(/Saved to dashboard/); // body must be consumed for the tool to run
    expect(state.tables.dashboard_entries).toHaveLength(1);
    expect(state.tables.dashboard_entries[0].teacher_id).toBe(A.id);
  });
});

describe('6. Teacher A attempts to read or change teacher B\'s data', () => {
  it('cannot spoof teacher_id (or other ownership fields) through tool arguments', async () => {
    seedTeachers(); seedEntries();
    const before = JSON.stringify(state.tables.dashboard_entries.filter((r) => r.teacher_id === B.id));
    const { POST } = await loadRoute();

    await readRpc(await POST(toolCall('save_to_dashboard', {
      subject: 'Agriculture', grade: 'Grade 9', type: 'quiz', content: 'injected',
      teacher_id: B.id, teacherId: B.id, user_id: B.id, id: 'b-1',
    }, bearer(A.token))));

    const injected = state.tables.dashboard_entries.filter((r) => r.content === 'injected');
    expect(injected).toHaveLength(1);
    expect(injected[0].teacher_id).toBe(A.id);
    expect(injected[0].id).not.toBe('b-1');
    // B's rows untouched
    expect(JSON.stringify(state.tables.dashboard_entries.filter((r) => r.teacher_id === B.id))).toBe(before);

    // reading with a spoofed teacher_id argument returns A's data only
    const out = toolText(await readRpc(await POST(
      toolCall('get_my_dashboard', { teacher_id: B.id }, bearer(A.token)))));
    expect(out).not.toContain('B PRIVATE');
  });

  it('exposes no update, delete or by-id tools that could cross tenants', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const rpc = await readRpc(await POST(mcpRequest('tools/list', {}, bearer(A.token))));
    const names = (rpc.result.tools as Array<{ name: string }>).map((t) => t.name).sort();
    expect(names).toEqual(['get_my_dashboard', 'save_to_dashboard']);
  });

  it('cannot read B\'s entry by guessing its subject, grade or type filters', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    const out = toolText(await readRpc(await POST(
      toolCall('get_my_dashboard', { subject: 'Physics' }, bearer(A.token))))); // only B has Physics
    expect(out).toMatch(/No saved entries/);
  });
});

describe('7. Concurrent requests for different teachers', () => {
  it('each request stays bound to its own identity under interleaving', async () => {
    seedTeachers();
    state.authDelay.set(A.token, 40); // A's auth resolves slower than B's, forcing interleaving
    const { POST } = await loadRoute();

    const jobs: Promise<Response>[] = [];
    for (let i = 0; i < 25; i++) {
      jobs.push(POST(toolCall('save_to_dashboard',
        { subject: 'S', grade: 'G', type: 'T', content: `A-${i}` }, bearer(A.token))));
      jobs.push(POST(toolCall('save_to_dashboard',
        { subject: 'S', grade: 'G', type: 'T', content: `B-${i}` }, bearer(B.token))));
    }
    const results = await Promise.all(jobs.map(async (p) => {
      const r = await p;
      return { status: r.status, rpc: await readRpc(r) };
    }));
    expect(results.every((r) => r.status === 200 && !r.rpc?.result?.isError)).toBe(true);

    const rows = state.tables.dashboard_entries;
    expect(rows).toHaveLength(50);
    for (const r of rows) {
      const owner = r.content.startsWith('A-') ? A.id : B.id;
      expect(r.teacher_id, r.content).toBe(owner);
    }
  });

  it('concurrent reads never leak across teachers', async () => {
    seedTeachers(); seedEntries();
    state.authDelay.set(B.token, 30);
    const { POST } = await loadRoute();
    const reads = await Promise.all(Array.from({ length: 20 }, (_, i) => {
      const u = i % 2 === 0 ? A : B;
      return POST(toolCall('get_my_dashboard', {}, bearer(u.token)))
        .then(readRpc).then((rpc) => ({ u, text: toolText(rpc) }));
    }));
    for (const { u, text } of reads) {
      const other = u === A ? 'b-' : 'a-';
      expect(text).not.toContain(`[${other}`);
      expect(text).toContain(u === A ? 'a-1' : 'b-1');
    }
  });
});

describe('8. Database or Auth failure', () => {
  const LEAKS = /SECRET|password|apikey|refused|unreachable|internal|5432|stack|at \w+ \(/i;

  it('Auth service down: 401, no internal details', async () => {
    seedTeachers(); seedEntries();
    state.authDown = true;
    const { POST } = await loadRoute();
    const res = await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    expect(res.status).toBe(401);
    expect(await res.text()).not.toMatch(LEAKS);
  });

  it('database down during profile lookup: 401, no internal details', async () => {
    seedTeachers(); seedEntries();
    state.dbDown = true;
    const { POST } = await loadRoute();
    const res = await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    expect(res.status).toBe(401);
    expect(await res.text()).not.toMatch(LEAKS);
  });

  it('database fails after auth succeeds: generic tool error, no internal details', async () => {
    seedTeachers(); seedEntries();
    state.failTables.add('dashboard_entries'); // profiles lookup (auth) still works
    const { POST } = await loadRoute();
    const get = await readRpc(await POST(toolCall('get_my_dashboard', {}, bearer(A.token))));
    const save = await readRpc(await POST(toolCall('save_to_dashboard',
      { subject: 's', grade: 'g', type: 't', content: 'c' }, bearer(A.token))));
    for (const rpc of [get, save]) {
      expect(rpc.result.isError).toBe(true);
      expect(JSON.stringify(rpc)).not.toMatch(LEAKS);
    }
    expect(toolText(get)).toMatch(/Retrieval failed/);
    expect(toolText(save)).toMatch(/Save failed/);
    expect(JSON.stringify(errSpy.mock.calls)).not.toMatch(/SECRET|password|5432/);
  });

  it('missing Supabase env: 401, and nothing sensitive is logged', async () => {
    seedTeachers();
    delete process.env.SUPABASE_ANON_KEY;
    const { POST } = await loadRoute();
    const res = await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    expect(res.status).toBe(401);
    expect(JSON.stringify(errSpy.mock.calls)).not.toContain(A.token);
  });

  it('logs never contain access tokens or service-role keys', async () => {
    seedTeachers(); seedEntries();
    const { POST } = await loadRoute();
    state.dbDown = true;
    await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    state.dbDown = false; state.authDown = true;
    await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    const logged = JSON.stringify(errSpy.mock.calls);
    expect(logged).not.toContain(A.token);
    expect(logged).not.toContain('test-service-key');
    expect(logged).not.toContain('SECRET');
  });
});

describe('input validation', () => {
  const cases: Array<[string, Record<string, unknown>]> = [
    ['oversized content', { subject: 's', grade: 'g', type: 't', content: 'x'.repeat(50_001) }],
    ['blank subject', { subject: '  ', grade: 'g', type: 't', content: 'c' }],
    ['missing field', { subject: 's', grade: 'g', type: 't' }],
  ];

  it.each(cases)('rejects %s with a protocol error and writes nothing', async (_name, args) => {
    seedTeachers();
    const { POST } = await loadRoute();
    const rpc = await readFirstMessage(await POST(toolCall('save_to_dashboard', args, bearer(A.token))));
    expect(rpc?.error?.code ?? (rpc?.result?.isError ? 'tool' : null)).toBeTruthy();
    expect(state.tables.dashboard_entries).toHaveLength(0);
  });

  // KNOWN ISSUE: with @modelcontextprotocol/sdk 1.12.0 + @vercel/mcp-adapter 0.5,
  // the error event is delivered but the stream is left open until the function's
  // maxDuration (60 s). `it.fails` passes while the bug exists and starts failing
  // (prompting removal of `.fails`) once the stream closes promptly.
  it.fails('closes the response promptly after a validation error', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const res = await POST(toolCall('save_to_dashboard',
      { subject: '  ', grade: 'g', type: 't', content: 'c' }, bearer(A.token)));
    const closed = await Promise.race([
      res.text().then(() => true),
      new Promise<boolean>((r) => setTimeout(() => r(false), 1500)),
    ]);
    expect(closed).toBe(true);
  });
});
