// MXT Lab -- Supabase Auth (Google Sign-In)
// Include via: <script type="module" src="/assets/js/auth.js"></script>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://mqiwckclyohjdhjaoaor.supabase.co';
// Publishable/anon key – safe to expose client‑side; RLS enforces access control server‑side.
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5f7g4ZUZUGejDvffge5GUg_1s1FAg4W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/**
 * Trigger Google sign‑in. Called from a button's onclick.
 */
export async function signInWithGoogle(redirectTo = null) {
  // Keep OAuth callbacks on this origin and return users to the workflow they started.
  const requestedRedirect = redirectTo || (window.location.pathname === '/apply-teacher.html' ? '/apply-teacher.html' : '/dashboard.html');
  const safeRedirect = typeof requestedRedirect === 'string' && requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
    ? requestedRedirect
    : '/dashboard.html';
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: new URL(safeRedirect, window.location.origin).toString() },
  });
  if (error) {
    console.error('Google sign‑in failed:', error.message);
    if (typeof showToast === 'function') {
      showToast('Sign‑in failed. Please try again.', 'error');
    } else {
      alert('Sign‑in failed. Please try again.');
    }
  }
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

/**
 * Retrieve the signed‑in user's profile row (contains role, etc.).
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
    if (typeof showToast === 'function') {
      showToast('Failed to load your profile. Some features may be limited.', 'warn');
    }
    return null;
  }
  return profile;
}

/**
 * Update navigation visibility based on the logged‑in user's role.
 * Expected placeholder <li> elements have IDs:
 *   nav-apply-teacher, nav-teacher-dashboard, nav-admin-dashboard
 */
async function updateNavForRole(session) {
  const role = session ? (await getCurrentUserProfile())?.role || 'student' : 'guest';
  const applyLinks = document.querySelectorAll('[data-nav-role="apply-teacher"]');
  const teacherLinks = document.querySelectorAll('[data-nav-role="teacher-dashboard"]');
  const adminLinks = document.querySelectorAll('[data-nav-role="admin-dashboard"]');
  applyLinks.forEach(link => { link.style.display = role === 'student' ? '' : 'none'; });
  teacherLinks.forEach(link => { link.style.display = role === 'teacher' ? '' : 'none'; });
  adminLinks.forEach(link => { link.style.display = role === 'admin' ? '' : 'none'; });
  // Public navigation always points to the Teacher Centre. Staff-only workspace links remain role-gated.
  document.querySelectorAll('a[href="/teacher-os.html"]').forEach(link => { link.href = '/teacher-centre.html'; });
  const teacherOsLinks = document.querySelectorAll('a[href="/teacher-os.html"]');
  teacherOsLinks.forEach(l => {
    l.style.display = (role === 'teacher' || role === 'admin') ? '' : 'none';
  });
}

/**
 * Render UI for sign‑in / sign‑out state (avatar badge, button visibility).
 */
function renderAuthUI(session) {
  const pairs = [
    { signIn: 'google-signin', badge: 'profile-badge', avatar: 'profile-avatar', name: 'profile-name' },
    { signIn: 'google-signin-mobile', badge: 'profile-badge-mobile', avatar: 'profile-avatar-mobile', name: 'profile-name-mobile' },
  ];
  pairs.forEach(({ signIn, badge, avatar, name }) => {
    const signInBtn = document.getElementById(signIn);
    const badgeEl = document.getElementById(badge);
    if (!signInBtn || !badgeEl) return;
    if (session) {
      const meta = session.user.user_metadata || {};
      const avatarEl = document.getElementById(avatar);
      const nameEl = document.getElementById(name);
      if (avatarEl) avatarEl.src = meta.avatar_url || meta.picture || '';
      if (nameEl) nameEl.textContent = (meta.full_name || meta.name || session.user.email || '').split(' ')[0];
      signInBtn.style.display = 'none';
      badgeEl.style.display = 'flex';
      badgeEl.onclick = () => { window.location.href = '/dashboard.html'; };
    } else {
      signInBtn.style.display = '';
      badgeEl.style.display = 'none';
    }
    signInBtn.classList.add('auth-ready');
    badgeEl.classList.add('auth-ready');
  });

  // Mobile drawer extras: Dashboard link and Sign‑out button.
  const dashLink = document.getElementById('mob-dashboard-link');
  const signOutBtn = document.getElementById('mob-signout');
  if (dashLink) dashLink.style.display = session ? 'block' : 'none';
  if (signOutBtn) {
    signOutBtn.style.display = session ? 'block' : 'none';
    signOutBtn.onclick = signOut;
  }
}

// Public teacher links must lead to the public entry page, never directly to the staff-only workspace.
document.querySelectorAll('a[href="/teacher-os.html"]').forEach(link => { link.href = '/teacher-centre.html'; });

// Initial session handling – render UI and update nav.
supabase.auth.getSession().then(({ data: { session } }) => {
  renderAuthUI(session);
  updateNavForRole(session);
});

// Wire sign‑in buttons.
['google-signin', 'google-signin-mobile'].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.onclick = () => signInWithGoogle(btn.dataset.authRedirect || null);
});

// Allow workflow-specific buttons to return to their originating page after OAuth.
document.querySelectorAll('[data-auth-redirect]').forEach((btn) => {
  btn.onclick = () => signInWithGoogle(btn.dataset.authRedirect);
});

// Keep UI in sync on every auth state change.
supabase.auth.onAuthStateChange((event, session) => {
  renderAuthUI(session);
  updateNavForRole(session);
});
