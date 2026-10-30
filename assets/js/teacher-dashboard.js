// teacher-dashboard.js – shows current user's teacher application status
import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

async function loadStatus() {
  const container = document.getElementById('status-section');
  const profile = await getCurrentUserProfile();
  if (!profile) {
    container.textContent = 'You must be signed in to view this page.';
    return;
  }
  if (profile.role !== 'teacher') {
    container.textContent = 'Access denied. This page is for verified teachers only.';
    return;
  }
  const { data: apps, error } = await supabase
    .from('teacher_applications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) {
    container.textContent = 'Failed to load application status.';
    console.error(error);
    return;
  }
  if (!apps || apps.length === 0) {
    container.innerHTML = `
      <p>You have not submitted a teacher application.</p>
      <a href="/apply-teacher.html" class="btn btn-primary">Apply Now</a>
    `;
    return;
  }
  const app = apps[0];
  const statusMap = {
    'Pending': 'Your application is pending review.',
    'Under Review': 'Your application is under review.',
    'Approved': 'Congratulations! Your teacher account is approved.',
    'Rejected': `Your application was rejected. Reason: ${app.admin_note || 'N/A'}`,
    'Additional Information Required': `Additional information required: ${app.admin_note || ''}`,
  };
  container.innerHTML = `
    <p><strong>Status:</strong> ${app.status}</p>
    <p>${statusMap[app.status] || ''}</p>
    ${app.status === 'Approved' ? '<a href="/teacher-dashboard.html" class="btn btn-primary">Go to Teacher Resources</a>' : ''}
  `;
}

window.addEventListener('load', loadStatus);
