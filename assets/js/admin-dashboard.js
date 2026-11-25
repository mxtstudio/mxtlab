import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

function cell(row, value) {
  const td = document.createElement('td');
  td.textContent = value ?? '';
  td.style.border = '1px solid var(--border)';
  td.style.padding = '6px';
  row.appendChild(td);
  return td;
}

async function signedDocumentLinks(paths) {
  const links = document.createDocumentFragment();
  for (const [index, path] of (paths || []).entries()) {
    const { data } = await supabase.storage.from('teacher-applications').createSignedUrl(path, 300);
    if (!data?.signedUrl) continue;
    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `Document ${index + 1}`;
    links.appendChild(link);
    if (index < paths.length - 1) links.append(' · ');
  }
  return links;
}

async function loadApplications() {
  const container = document.getElementById('applications-table');
  if (!container) return;

  try {
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
      return;
    }
    if (!apps?.length) {
      container.textContent = 'No teacher applications.';
      return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const header = document.createElement('tr');
    for (const label of ['Name', 'Email', 'School', 'Province', 'Subjects', 'Documents', 'Submitted', 'Status', 'Actions']) {
      const th = document.createElement('th');
      th.textContent = label;
      th.style.border = '1px solid var(--border)';
      th.style.padding = '8px';
      header.appendChild(th);
    }
    table.appendChild(header);

    for (const app of apps) {
      const tr = document.createElement('tr');
      cell(tr, app.full_name);
      cell(tr, app.email);
      cell(tr, app.school);
      cell(tr, app.province);
      cell(tr, app.subjects);
      const docs = cell(tr, '');
      docs.appendChild(await signedDocumentLinks(app.documents));
      cell(tr, app.created_at ? new Date(app.created_at).toLocaleString() : '');
      cell(tr, app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : '');

      const actions = cell(tr, '');
      if (app.status === 'pending') {
        const approve = document.createElement('button');
        approve.type = 'button';
        approve.textContent = 'Approve';
        approve.className = 'btn btn-primary';
        approve.addEventListener('click', () => handleDecision(app.id, true, null, approve));

        const reject = document.createElement('button');
        reject.type = 'button';
        reject.textContent = 'Reject';
        reject.className = 'btn btn-danger';
        reject.style.marginLeft = '4px';
        reject.addEventListener('click', () => {
          const note = prompt('Enter rejection reason:');
          if (note === null) return;
          handleDecision(app.id, false, note, reject);
        });
        actions.append(approve, reject);
      }
      table.appendChild(tr);
    }

    container.replaceChildren(table);
  } catch {
    container.textContent = 'Failed to load applications.';
  }
}

async function handleDecision(applicationId, approve, note, button) {
  if (button) button.disabled = true;
  try {
    const { error } = await supabase.rpc('review_teacher_application', {
      p_application_id: applicationId,
      p_approve: approve,
      p_note: note,
    });
    if (error) {
      alert('Failed to review application. Please refresh and try again.');
      return;
    }
    await loadApplications();
  } catch {
    alert('Failed to review application. Please refresh and try again.');
  } finally {
    if (button) button.disabled = false;
  }
}

window.addEventListener('load', loadApplications);
