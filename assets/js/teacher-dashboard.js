import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Sign-in required.');
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session.access_token}`);
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) throw new Error(`Fetch ${url} failed ${resp.status}`);
  return resp.json();
}

async function loadClasses() {
  const container = document.getElementById('classesContainer');
  if (!container) return;
  container.textContent = 'Class roster integration is not connected yet.';
}

async function loadAnalytics() {
  // Demonstration data only; this is not calculated from student records.
  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
      datasets: [{ label: 'Sample score (demo only) %', data: [78, 62, 85, 55], backgroundColor: '#3a7d2c' }],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } },
  });
}

async function loadPriorities() {
  const ul = document.getElementById('priorityList');
  if (!ul) return;
  // Demonstration placeholders; not based on student performance.
  const lowScoreTopics = [
    'Topic: Soil Nutrients (Grade 9 – Agriculture)',
    'Topic: Aquaculture Management (Grade 10 – Agriculture)',
  ];
  lowScoreTopics.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    ul.appendChild(li);
  });
}

function initLessonPlanner() {
  const modal = document.getElementById('lessonModal');
  const btn = document.getElementById('newLessonBtn');
  const saveBtn = document.getElementById('saveLesson');
  const cancelBtn = document.getElementById('cancelLesson');

  if (!modal || !btn || !saveBtn || !cancelBtn) return;
  btn.addEventListener('click', () => { modal.style.display = 'block'; });
  cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  saveBtn.addEventListener('click', () => {
    const title = document.getElementById('lessonTitle')?.value.trim() || '';
    const notes = document.getElementById('lessonNotes')?.value.trim() || '';
    if (!title) { alert('Title required'); return; }
    // Draft preview only: no lesson is persisted to the database.
    console.log('Lesson draft preview', { title, notes });
    modal.style.display = 'none';
    alert('Draft preview only. This lesson has not been saved.');
  });
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return; // not signed in – nav already shows sign-in
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'teacher') {
    const main = document.querySelector('main');
    if (main) main.textContent = 'Access denied. A verified teacher account is required.';
    return;
  }
  await loadClasses();
  await loadAnalytics();
  await loadPriorities();
  initLessonPlanner();
}

init();
