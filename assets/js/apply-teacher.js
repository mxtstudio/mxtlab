// apply-teacher.js – handles teacher application form submission
import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

async function uploadFiles(files) {
  const uploaded = [];
  for (const file of files) {
    const ext = file.name.split('.').pop();
    const path = `applications/${Date.now()}_${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage.from('teacher-applications').upload(path, file);
    if (error) {
      console.error('Upload error', error);
      continue;
    }
    uploaded.push(data.path);
  }
  return uploaded;
}

async function submitApplication(event) {
  event.preventDefault();
  const statusEl = document.getElementById('form-status');
  const form = event.target;
  const profile = await getCurrentUserProfile();
  if (!profile) {
    statusEl.textContent = 'You must be signed in to apply.';
    statusEl.style.color = 'var(--brown)';
    return;
  }
  const full_name = form.full_name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const school = form.school.value.trim();
  const province = form.province.value.trim();
  const district = form.district.value.trim();
  const position = form.position.value.trim();
  const subjects = form.subjects.value.trim();
  const experience = parseInt(form.experience.value, 10);
  const files = form.documents.files;
  const docPaths = await uploadFiles(files);
  const { error } = await supabase.from('teacher_applications').insert([
    {
      user_id: profile.id,
      full_name,
      email,
      phone,
      school,
      province,
      district,
      position,
      subjects,
      years_experience: experience,
      documents: docPaths,
      status: 'Pending',
    },
  ]);
  if (error) {
    console.error('Insert error', error);
    statusEl.textContent = 'Failed to submit application. Please try again.';
    statusEl.style.color = 'var(--brown)';
  } else {
    statusEl.textContent = 'Application submitted successfully! You will be notified via dashboard.';
    statusEl.style.color = 'var(--green)';
    form.reset();
  }
}

document.getElementById('teacher-application-form').addEventListener('submit', submitApplication);

// Pre‑populate email and name if profile available
getCurrentUserProfile().then(profile => {
  if (!profile) return;
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('full_name');
  if (emailInput) emailInput.value = profile.email || '';
  if (nameInput) nameInput.value = profile.full_name || profile.name || '';
});
