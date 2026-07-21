// MXT Lab -- Supabase Auth (Google Sign-In)
// Include via: <script type="module" src="/assets/js/auth.js"></script>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mqiwckclyohjdhjaoaor.supabase.co';
// Publishable/anon key -- safe to expose client-side, RLS enforces access control server-side.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5f7g4ZUZUGejDvffge5GUg_1s1FAg4W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Trigger Google sign-in. Call this from a button's onclick.
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
 * Call to get the signed-in user's profile row (role, school, streaks, etc.)
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
 * Updates the nav UI to reflect signed-in / signed-out state.
 * Swaps the "Sign in with Google" button for an avatar + name badge,
 * on both desktop nav and mobile drawer. Click the badge to sign out.
 * Also drives the mobile drawer's Dashboard link and Sign out button,
 * where present. Every element lookup is guarded with `if(el)` since
 * not every page has every element.
 */
function renderAuthUI(session) {
  const pairs = [
    { signIn: 'google-signin', badge: 'profile-badge', avatar: 'profile-avatar', name: 'profile-name' },
    { signIn: 'google-signin-mobile', badge: 'profile-badge-mobile', avatar: 'profile-avatar-mobile', name: 'profile-name-mobile' },
  ];

  pairs.forEach(({ signIn, badge, avatar, name }) => {
    const signInBtn = document.getElementById(signIn);
    const badgeEl = document.getElementById(badge);
    if (!signInBtn || !badgeEl) return; // element not on this page, skip

    if (session) {
      const meta = session.user.user_metadata || {};
      const avatarEl = document.getElementById(avatar);
      const nameEl = document.getElementById(name);
      if (avatarEl) avatarEl.src = meta.avatar_url || meta.picture || '';
      if (nameEl) nameEl.textContent = (meta.full_name || meta.name || session.user.email || '').split(' ')[0];

      signInBtn.style.display = 'none';
      badgeEl.style.display = 'flex';
      badgeEl.onclick = () => {
        window.location.href = '/dashboard.html';
      };
    } else {
      signInBtn.style.display = '';
      badgeEl.style.display = 'none';
    }

    // Reveal now that we know which state applies -- prevents the
    // sign-in button flashing before the session check resolves.
    signInBtn.classList.add('auth-ready');
    badgeEl.classList.add('auth-ready');
  });

  // Mobile drawer extras: Dashboard link and Sign out button.
  const dashLink = document.getElementById('mob-dashboard-link');
  const signOutBtn = document.getElementById('mob-signout');
  if (dashLink) dashLink.style.display = session ? 'block' : 'none';
  if (signOutBtn) {
    signOutBtn.style.display = session ? 'block' : 'none';
    signOutBtn.onclick = signOut;
  }
}

// Run once on page load to reflect any existing session.
supabase.auth.getSession().then(({ data: { session } }) => renderAuthUI(session));

// Wire the sign-in buttons once. renderAuthUI only toggles visibility/badge
// content, it doesn't touch these listeners, so this only needs to run once.
['google-signin', 'google-signin-mobile'].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.onclick = signInWithGoogle;
});

// Keep the UI in sync on every sign-in / sign-out / token refresh.
supabase.auth.onAuthStateChange((event, session) => {
  renderAuthUI(session);
});
