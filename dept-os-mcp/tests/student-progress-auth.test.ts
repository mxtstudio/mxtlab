import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@supabase/supabase-js', async () => await import('./fakeSupabase'));

import { state, resetState } from './fakeSupabase';
import { setEnv } from './helpers';

const A = { id: 'student-a', token: 'tok-a' };
const B = { id: 'student-b', token: 'tok-b' };
const bearer = (token: string) => ({ authorization: `Bearer ${token}` });

beforeEach(() => {
  resetState();
  setEnv();
  for (const user of [A, B]) {
    state.tokens.set(user.token, user.id);
    state.tables.profiles.push({ id: user.id });
  }
  state.tables.student_progress.push(
    { id: 'progress-a', student_id: A.id, topic_id: 'topic-a', status: 'completed' },
    { id: 'progress-b', student_id: B.id, topic_id: 'topic-b', status: 'completed' },
  );
});

describe('student progress API authorization', () => {
  it('returns only the authenticated user\'s progress by default', async () => {
    const { GET } = await import('@/app/api/student/progress/route');
    const response = await GET(new Request('http://localhost/api/student/progress', {
      headers: bearer(A.token),
    }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.progress.map((row: { id: string }) => row.id)).toEqual(['progress-a']);
  });

  it('rejects a caller-supplied student_id belonging to another user', async () => {
    const { GET } = await import('@/app/api/student/progress/route');
    const response = await GET(new Request(
      `http://localhost/api/student/progress?student_id=${B.id}`,
      { headers: bearer(A.token) },
    ));

    expect(response.status).toBe(403);
    expect(await response.text()).not.toContain('progress-b');
  });

  it('rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/student/progress/route');
    const response = await GET(new Request('http://localhost/api/student/progress'));
    expect(response.status).toBe(401);
  });

  it('does not allow POST to assign progress to a different student', async () => {
    const { POST } = await import('@/app/api/student/progress/route');
    const response = await POST(new Request('http://localhost/api/student/progress', {
      method: 'POST',
      headers: { ...bearer(A.token), 'content-type': 'application/json' },
      body: JSON.stringify({ topic_id: 'topic-x', status: 'completed', student_id: B.id }),
    }));

    expect(response.status).toBe(201);
    const inserted = state.tables.student_progress.find(row => row.topic_id === 'topic-x');
    expect(inserted?.student_id).toBe(A.id);
  });
});
