import { getServiceClient, getDemoTeacherId } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = getServiceClient();
  const teacher_id = getDemoTeacherId();

  const { data, error } = await supabase
    .from('dashboard_entries')
    .select('*')
    .eq('teacher_id', teacher_id)
    .order('created_at', { ascending: false });

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>My Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Saved via Claude · MXT Lab Department OS (demo)</p>

      {error && <p style={{ color: '#b00020' }}>Couldn&apos;t load entries: {error.message}</p>}

      {!error && (!data || data.length === 0) && (
        <p style={{ color: '#666' }}>Nothing saved yet. Ask Claude to save a lesson plan.</p>
      )}

      {!error && data && data.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 16 }}>
          {data.map((entry) => (
            <li
              key={entry.id}
              style={{ border: '1px solid #e2e2e2', borderRadius: 10, padding: 16 }}
            >
              <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#888', marginBottom: 8 }}>
                <span style={{ background: '#f0f4ff', padding: '2px 8px', borderRadius: 6 }}>{entry.subject}</span>
                <span style={{ background: '#f0fff4', padding: '2px 8px', borderRadius: 6 }}>{entry.grade}</span>
                <span style={{ background: '#fff8f0', padding: '2px 8px', borderRadius: 6 }}>{entry.type}</span>
                <span style={{ marginLeft: 'auto' }}>{new Date(entry.created_at).toLocaleString()}</span>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, margin: 0 }}>
                {entry.content}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
