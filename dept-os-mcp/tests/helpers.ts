import { vi } from 'vitest';
import { ANON_KEY, SERVICE_KEY } from './fakeSupabase';

export function setEnv() {
  process.env.SUPABASE_URL = 'https://fake.supabase.test';
  process.env.SUPABASE_ANON_KEY = ANON_KEY;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
}

export async function loadRoute() {
  return await import('@/app/api/mcp/route');
}

let rpcId = 1;

export function mcpRequest(
  method: string,
  params: Record<string, unknown>,
  headers: Record<string, string> = {},
) {
  return new Request('http://localhost/api/mcp', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: rpcId++, method, params }),
  });
}

export function toolCall(name: string, args: Record<string, unknown>, headers: Record<string, string> = {}) {
  return mcpRequest('tools/call', { name, arguments: args }, headers);
}

// MCP streamable HTTP can answer as JSON or as an SSE stream; handle both.
export async function readRpc(res: Response): Promise<any> {
  const text = await res.text();
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/event-stream')) {
    const line = text.split('\n').find((l) => l.startsWith('data:'));
    return line ? JSON.parse(line.slice(5).trim()) : null;
  }
  try { return JSON.parse(text); } catch { return text; }
}

export function toolText(rpc: any): string {
  return (rpc?.result?.content ?? []).map((c: any) => c.text).join('\n');
}

// Read only the first SSE/JSON message, then release the stream. Needed for
// requests whose stream the server leaves open (see the known-issue test).
export async function readFirstMessage(res: Response, timeoutMs = 2000): Promise<any> {
  const reader = res.body!.getReader();
  let buf = '';
  const deadline = Date.now() + timeoutMs;
  try {
    while (Date.now() < deadline) {
      const r: any = await Promise.race([
        reader.read(),
        new Promise((x) => setTimeout(() => x({ timeout: true }), Math.max(1, deadline - Date.now()))),
      ]);
      if (r.timeout || r.done) break;
      buf += new TextDecoder().decode(r.value);
      const line = buf.split('\n').find((l) => l.startsWith('data:'));
      if (line) { try { return JSON.parse(line.slice(5).trim()); } catch { /* keep reading */ } }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  return null;
}
