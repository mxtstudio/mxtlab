// apply-teacher.js – handles teacher application form submission
import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_DOCUMENTS = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

function validateFiles(files) {
  if (!files || files.length === 0) {
    throw new Error('Please attach at least one supporting document.');
  }

  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const expectedType = extension ? ALLOWED_DOCUMENTS[extension] : null;
    if (!expectedType || (file.type && file.type !== expectedType)) {
      throw new Error('Only PDF, JPG and PNG documents are accepted.');
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      throw new Error('Each document must be greater than 0 bytes and no larger than 5 MB.');
    }
  }
}

async function removeUploadedFiles(paths) {
  if (!paths.length) return;
  const { error } = await supabase.storage.from('teacher-applications').remove(paths);
  if (error) {
    // Do not expose storage details or document paths to the applicant.
    console.error('Could not clean up incomplete application uploads.');
  }
}

async function uploadFiles(files) {
  const uploaded = [];
  try {
    for (const file of files) {
      const extension = file.name.split('.').pop().toLowerCase();
      const path = `applications/${crypto.randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage
        .from('teacher-applications')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: ALLOWED_DOCUMENTS[extension] });

      if (error || !data?.path) {
        throw new Error('A document could not be uploaded. Please try again.');
      }
      uploaded.push(data.path);
    }
    return uploaded;
  } catch (error) {
    await removeUploadedFiles(uploaded);
    throw error;
  }
}

async function submitApplication(event) {
  event.preventDefault();
  const statusEl = document.getElementById('form-status');
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const setStatus = (message, isSuccess = false) => {
    statusEl.textContent = message;
    statusEl.style.color = isSuccess ? 'var(--green)' : 'var(--brown)';
  };

  if (submitButton?.disabled) return;
  if (submitButton) submitButton.disabled = true;

  let docPaths = [];
  try {
    const profile = await getCurrentUserProfile();
    if (!profile) {
      setStatus('You must be signed in to apply.');
      return;
    }

    const files = Array.from(form.documents.files || []);
    validateFiles(files);

    const experience = Number(form.experience.value);
    if (!Number.isInteger(experience) || experience < 0) {
      setStatus('Enter a valid number of years of teaching experience.');
      return;
    }

    docPaths = await uploadFiles(files);
    const { error } = await supabase.from('teacher_applications').insert([{
      user_id: profile.id,
      full_name: form.full_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      school: form.school.value.trim(),
      province: form.province.value.trim(),
      district: form.district.value.trim(),
      position: form.position.value.trim(),
      subjects: form.subjects.value.trim(),
      years_experience: experience,
      documents: docPaths,
      status: 'Pending',
    }]);

    if (error) {
      await removeUploadedFiles(docPaths);
      docPaths = [];
      setStatus('Failed to submit application. Please try again.');
      return;
    }

    setStatus('Application submitted successfully! You will be notified via dashboard.', true);
    form.reset();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
    setStatus(message);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

document.getElementById('teacher-application-form')?.addEventListener('submit', submitApplication);

// Pre-populate email and name if profile available.
getCurrentUserProfile().then(profile => {
  if (!profile) return;
  const emailInput = document.getElementById('email');
  const nameInput = document.getElementById('full_name');
  if (emailInput) emailInput.value = profile.email || '';
  if (nameInput) nameInput.value = profile.full_name || profile.name || '';
}).catch(() => {
  // The form remains usable if profile prefill is temporarily unavailable.
});
