import { supabase, getCurrentUserProfile, signInWithGoogle } from '/assets/js/auth.js';

const signInButton = document.getElementById('teacher-entry-signin');
const status = document.getElementById('teacher-entry-status');
const workspace = document.getElementById('teacher-entry-workspace');

signInButton?.addEventListener('click', () => signInWithGoogle('/teacher-os.html'));

const menuToggle = document.getElementById('teacher-menu-toggle');
const mobileDrawer = document.getElementById('teacher-mobile-drawer');

if (menuToggle && mobileDrawer) {
  const closeMobileMenu = () => {
    mobileDrawer.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

async function refreshTeacherEntry() {
  if (!status || !workspace) return;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      workspace.hidden = true;
      return;
    }

    const profile = await getCurrentUserProfile();
    if (!profile) {
      workspace.hidden = true;
      status.textContent = 'We could not load your account profile. Please refresh or contact MXT Lab support.';
      return;
    }

    if (profile.role === 'teacher' || profile.role === 'admin') {
      const canOpenWorkspace = Boolean(profile.department_id);
      workspace.hidden = !canOpenWorkspace;
      if (signInButton) signInButton.hidden = true;
      status.textContent = canOpenWorkspace
        ? 'Your staff account is approved. Open your Teacher Workspace.'
        : 'Your staff account is approved, but it has not been assigned to a department yet. Contact your administrator.';
      return;
    }

    workspace.hidden = true;
    if (signInButton) signInButton.hidden = true;
    status.textContent = 'You are signed in. Submit a teacher access application to request teacher permissions.';
  } catch (error) {
    console.error('Could not load teacher entry status:', error);
    workspace.hidden = true;
    status.textContent = 'We could not check your teacher access. Please refresh or contact MXT Lab support.';
  }
}

refreshTeacherEntry();
