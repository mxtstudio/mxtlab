export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  // The old demo page queried with the service-role key and a fixed demo
  // identity without verifying a browser session. Keep it closed until the
  // server-side session authentication flow is implemented.
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>MXT Lab Dashboard</h1>
      <p>Dashboard access is temporarily unavailable while secure teacher sign-in is being implemented.</p>
      <p>Your public MXT Lab learning resources remain available.</p>
    </main>
  );
}
