// MXT Lab — Supabase Auth (Google Sign-In)
// Include via: <script type="module" src="/auth.js"></script>
// Requires: <script type="module"> import { createClient } from
//   'https://esm.sh/@supabase/supabase-js@2' </script> — or use the CDN import below.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mqiwckclyohjdhjaoaor.supabase.co';
// Publishable/anon key — safe to expose client-side, RLS enforces access control server-side.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5f7g4ZUZUGejDvffge5GUg_1s1FAg4W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Trigger Google sign-in. Call this from a button's onclick.
 * redirectTo should be the page you want the user landed on after auth completes
 * (e.g. a dashboard page) — adjust to match your site structure.
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard.html',
    },
  });
  if (error) {
    console.error('Google sign-in failed:', error.message);
    alert('Sign-in failed. Please try again.');
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

/**
 * Call on page load to check if a user is already signed in,
 * and get their profile row (role, school, streaks, etc.)
 */
export async function getCurrentUserProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Failed to load profile:', error.message);
    return null;
  }
  return profile;
}

/**
 * Listen for auth state changes (sign-in, sign-out, token refresh)
 * so UI can react without a page reload.
 */
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Signed in as', session.user.email);
    // e.g. document.getElementById('login-btn').style.display = 'none';
  }
  if (event === 'SIGNED_OUT') {
    console.log('Signed out');
  }
});
