// Minimal in-memory stand-in for @supabase/supabase-js, covering only what
// app/api/mcp/route.ts uses. It models the two properties that matter for
// isolation: Auth validates tokens, and the service client BYPASSES RLS
// (so isolation depends entirely on the route's own filtering).
export const ANON_KEY = 'test-anon-key';
export const SERVICE_KEY = 'test-service-key';

type Row = Record<string, any>;

const g = globalThis as any;
export const state = (g.__fakeSupabaseState ??= {
  // token -> user id (valid tokens only)
  tokens: new Map<string, string>(),
  // tokens that Auth rejects explicitly (expired/revoked)
  rejected: new Set<string>(),
  // simulate the Auth service being down
  authDown: false,
  // simulate the database being down
  dbDown: false,
  // fail only queries against these tables (e.g. after auth succeeded)
  failTables: new Set<string>(),
  // artificial Auth latency per token (ms), for concurrency tests
  authDelay: new Map<string, number>(),
  tables: { profiles: [] as Row[], dashboard_entries: [] as Row[] },
  nextId: 1,
}) as {
  tokens: Map<string, string>;
  rejected: Set<string>;
  authDown: boolean;
  dbDown: boolean;
  failTables: Set<string>;
  authDelay: Map<string, number>;
  tables: { profiles: Row[]; dashboard_entries: Row[] };
  nextId: number;
};

export function resetState() {
  state.tokens.clear();
  state.rejected.clear();
  state.authDown = false;
  state.dbDown = false;
  state.failTables.clear();
  state.authDelay.clear();
  state.tables.profiles = [];
  state.tables.dashboard_entries = [];
  state.nextId = 1;
}

class Query implements PromiseLike<{ data: any; error: any }> {
  private filters: Array<(r: Row) => boolean> = [];
  private op: 'select' | 'insert' = 'select';
  private payload: Row | null = null;
  private orderBy: { col: string; asc: boolean } | null = null;
  private max: number | null = null;
  private mode: 'single' | 'maybe' | null = null;
  constructor(private table: keyof typeof state.tables) {}

  select(_cols?: string) { return this; }
  insert(row: Row) { this.op = 'insert'; this.payload = row; return this; }
  eq(col: string, val: any) { this.filters.push((r) => r[col] === val); return this; }
  order(col: string, o?: { ascending?: boolean }) { this.orderBy = { col, asc: o?.ascending ?? true }; return this; }
  limit(n: number) { this.max = n; return this; }
  maybeSingle() { this.mode = 'maybe'; return this; }
  single() { this.mode = 'single'; return this; }

  private run(): { data: any; error: any } {
    if (state.dbDown || state.failTables.has(this.table)) return { data: null, error: { message: 'connection refused to db.internal:5432 password=SECRET' } };
    const rows = state.tables[this.table];
    if (this.op === 'insert') {
      const row = { id: `entry-${state.nextId++}`, created_at: new Date().toISOString(), ...this.payload };
      rows.push(row);
      return { data: this.mode ? row : [row], error: null };
    }
    let out = rows.filter((r) => this.filters.every((f) => f(r)));
    if (this.orderBy) {
      const { col, asc } = this.orderBy;
      out = [...out].sort((a, b) => (a[col] < b[col] ? -1 : a[col] > b[col] ? 1 : 0) * (asc ? 1 : -1));
    }
    if (this.max != null) out = out.slice(0, this.max);
    if (this.mode) return { data: out[0] ?? null, error: null };
    return { data: out, error: null };
  }

  then<T1 = any, T2 = never>(
    onfulfilled?: ((v: { data: any; error: any }) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((r: any) => T2 | PromiseLike<T2>) | null,
  ) {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

export function createClient(_url: string, key: string) {
  if (key === ANON_KEY) {
    return {
      auth: {
        async getUser(token: string) {
          const delay = state.authDelay.get(token) ?? 0;
          if (delay) await new Promise((r) => setTimeout(r, delay));
          if (state.authDown) throw new Error('fetch failed: auth.internal unreachable apikey=SECRET');
          if (state.rejected.has(token)) return { data: { user: null }, error: { message: 'JWT expired' } };
          const id = state.tokens.get(token);
          if (!id) return { data: { user: null }, error: { message: 'invalid JWT' } };
          return { data: { user: { id } }, error: null };
        },
      },
    };
  }
  if (key === SERVICE_KEY) {
    return { from: (t: keyof typeof state.tables) => new Query(t) };
  }
  throw new Error('unexpected key in test');
}
