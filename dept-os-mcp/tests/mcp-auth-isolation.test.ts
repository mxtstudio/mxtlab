/**
 * Authentication and tenant-isolation tests for app/api/mcp/route.ts.
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
    state.tables.profiles.push({ id: u.id, role: 'teacher' });
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

describe('MCP authorization', () => {
  it('rejects missing and malformed bearer tokens', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    for (const authorization of [undefined, 'Basic abc', 'Bearer', 'Bearer   ']) {
      const response = await POST(toolCall('get_my_dashboard', {}, authorization ? { authorization } : {}));
      expect(response.status).toBe(401);
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
  });

  it('rejects invalid tokens and accounts without profiles', async () => {
    seedTeachers();
    state.tokens.set('ghost-token', 'ghost-profile');
    const { POST } = await loadRoute();
    expect((await POST(toolCall('get_my_dashboard', {}, bearer('invalid')))).status).toBe(401);
    expect((await POST(toolCall('get_my_dashboard', {}, bearer('ghost-token')))).status).toBe(401);
  });

  it('denies students before exposing tools or writing dashboard data', async () => {
    const student = { id: 'student-user', token: 'student-token' };
    state.tokens.set(student.token, student.id);
    state.tables.profiles.push({ id: student.id, role: 'student' });
    seedTeachers();
    const { POST, GET } = await loadRoute();

    for (const response of [
      await POST(toolCall('get_my_dashboard', {}, bearer(student.token))),
      await POST(toolCall('save_to_dashboard', {
        subject: 'Agriculture', grade: 'Grade 9', type: 'lesson_plan', content: 'must not save',
      }, bearer(student.token))),
      await GET(new Request('http://localhost/api/mcp', { headers: bearer(student.token) })),
    ]) {
      expect(response.status).toBe(403);
      expect(await response.text()).not.toMatch(/must not save/);
    }
    expect(state.tables.dashboard_entries).toHaveLength(0);
  });

  it('allows an administrator to use their own dashboard, not another teacher\'s', async () => {
    const admin = { id: 'admin-user', token: 'admin-token' };
    state.tokens.set(admin.token, admin.id);
    state.tables.profiles.push({ id: admin.id, role: 'admin' });
    seedTeachers();
    seedEntries();
    const { POST } = await loadRoute();

    const response = await POST(toolCall('get_my_dashboard', {}, bearer(admin.token)));
    expect(response.status).toBe(200);
    expect(toolText(await readRpc(response))).toMatch(/No saved entries/);
  });
});

describe('MCP tenant isolation', () => {
  it('returns only the signed-in teacher\'s records', async () => {
    seedTeachers();
    seedEntries();
    const { POST } = await loadRoute();

    const a = toolText(await readRpc(await POST(toolCall('get_my_dashboard', {}, bearer(A.token)))));
    expect(a).toContain('a-1');
    expect(a).toContain('a-2');
    expect(a).not.toContain('b-1');
    expect(a).not.toContain('B PRIVATE');

    const b = toolText(await readRpc(await POST(toolCall('get_my_dashboard', {}, bearer(B.token)))));
    expect(b).toContain('b-1');
    expect(b).not.toContain('a-1');
    expect(b).not.toContain('A CONFIDENTIAL');
  });

  it('stamps saved entries with the verified profile ID, ignoring spoofed ownership fields', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const response = await POST(toolCall('save_to_dashboard', {
      subject: 'Agriculture',
      grade: 'Grade 10',
      type: 'quiz',
      content: 'new',
      teacher_id: B.id,
      user_id: B.id,
    }, bearer(A.token)));

    expect(response.status).toBe(200);
    await readRpc(response);
    expect(state.tables.dashboard_entries).toHaveLength(1);
    expect(state.tables.dashboard_entries[0].teacher_id).toBe(A.id);
  });

  it('does not expose update/delete/by-id tools', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const rpc = await readRpc(await POST(mcpRequest('tools/list', {}, bearer(A.token))));
    const names = (rpc.result.tools as Array<{ name: string }>).map((tool) => tool.name).sort();
    expect(names).toEqual(['get_my_dashboard', 'save_to_dashboard']);
  });
});

describe('MCP input and failure handling', () => {
  it('rejects invalid tool payloads without writes', async () => {
    seedTeachers();
    const { POST } = await loadRoute();
    const response = await POST(toolCall('save_to_dashboard', {
      subject: ' ', grade: 'Grade 9', type: 'lesson', content: 'x',
    }, bearer(A.token)));
    const rpc = await readFirstMessage(response);
    expect(rpc?.error || rpc?.result?.isError).toBeTruthy();
    expect(state.tables.dashboard_entries).toHaveLength(0);
  });

  it('returns generic errors without leaking database details', async () => {
    seedTeachers();
    seedEntries();
    state.failTables.add('dashboard_entries');
    const { POST } = await loadRoute();
    const response = await POST(toolCall('get_my_dashboard', {}, bearer(A.token)));
    const rpc = await readRpc(response);
    expect(rpc.result.isError).toBe(true);
    expect(JSON.stringify(rpc)).not.toMatch(/SECRET|password|5432|db.internal/);
    expect(JSON.stringify(errSpy.mock.calls)).not.toMatch(/SECRET|password|5432/);
  });

  it('refuses requests when authentication configuration is missing', async () => {
    seedTeachers();
    delete process.env.SUPABASE_ANON_KEY;
    const { POST } = await loadRoute();
    expect((await POST(toolCall('get_my_dashboard', {}, bearer(A.token)))).status).toBe(401);
  });
});
