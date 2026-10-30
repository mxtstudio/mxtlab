// admin-dashboard.js – list pending teacher applications for admins
import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

async function loadApplications() {
  const container = document.getElementById('applications-table');
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    container.textContent = 'Access denied.';
    return;
  }
  const { data: apps, error } = await supabase
    .from('teacher_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    container.textContent = 'Failed to load applications.';
    console.error(error);
    return;
  }
  if (!apps || apps.length === 0) {
    container.textContent = 'No teacher applications.';
    return;
  }
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  const header = document.createElement('tr');
  ['Name','Email','School','Province','Subjects','Submitted','Status','Actions'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = '1px solid var(--border)';
    th.style.padding = '8px';
    header.appendChild(th);
  });
  table.appendChild(header);
  apps.forEach(app => {
    const tr = document.createElement('tr');
    const fields = [app.full_name, app.email, app.school, app.province, app.subjects, new Date(app.created_at).toLocaleString(), app.status];
    fields.forEach(val => {
      const td = document.createElement('td');
      td.textContent = val || '';
      td.style.border = '1px solid var(--border)';
      td.style.padding = '6px';
      tr.appendChild(td);
    });
    // Actions cell
    const actionTd = document.createElement('td');
    actionTd.style.border = '1px solid var(--border)';
    actionTd.style.padding = '6px';
    const approveBtn = document.createElement('button');
    approveBtn.textContent = 'Approve';
    approveBtn.className = 'btn btn-primary';
    approveBtn.onclick = async () => await handleDecision(app.id, 'Approved');
    const rejectBtn = document.createElement('button');
    rejectBtn.textContent = 'Reject';
    rejectBtn.className = 'btn btn-danger';
    rejectBtn.style.marginLeft = '4px';
    rejectBtn.onclick = async () => {
      const reason = prompt('Enter rejection reason:');
      await handleDecision(app.id, 'Rejected', reason);
    };
    actionTd.appendChild(approveBtn);
    actionTd.appendChild(rejectBtn);
    tr.appendChild(actionTd);
    table.appendChild(tr);
  });
  container.innerHTML = '';
  container.appendChild(table);
}

async function handleDecision(appId, newStatus, note = null) {
  const { error } = await supabase.from('teacher_applications').update({
    status: newStatus,
    admin_note: note,
    admin_id: (await supabase.auth.getUser()).data.user.id,
    reviewed_at: new Date().toISOString(),
  }).eq('id', appId);
  if (error) {
    alert('Failed to update status');
    console.error(error);
    return;
  }
  // If approved, promote the applicant to teacher role
  if (newStatus === 'Approved') {
    // Fetch the application to get user_id
    const { data: app } = await supabase.from('teacher_applications').select('user_id').eq('id', appId).single();
    if (app && app.user_id) {
      await supabase.from('profiles').update({ role: 'teacher' }).eq('id', app.user_id);
    }
  }
  // Record audit log
  await supabase.from('audit_logs').insert({
    admin_id: (await supabase.auth.getUser()).data.user.id,
    action: `teacher_application_${newStatus.toLowerCase()}`,
    target_user_id: null,
    details: { application_id: appId, note },
  });
  // Reload list
  loadApplications();
}

// Load on page ready
window.addEventListener('load', loadApplications);
