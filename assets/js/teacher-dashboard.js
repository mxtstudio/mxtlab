import { supabase, getCurrentUserProfile } from '/assets/js/auth.js';

async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) throw new Error(`Fetch ${url} failed ${resp.status}`);
  return resp.json();
}

async function loadClasses() {
  const profile = await getCurrentUserProfile();
  if (!profile) return;
  // For simplicity, list grades where teacher has students in roster_students (owner_id = teacher)
  const { data, error } = await authFetch('/api/student/progress'); // placeholder – we could have a dedicated endpoint later
  // Here we just display a static placeholder list
  const container = document.getElementById('classesContainer');
  container.innerHTML = `<p>Grade 9 – Agriculture</p><p>Grade 10 – Agriculture</p>`;
}

async function loadAnalytics() {
  // Simple mock analytics: random data for demo. In real implementation would aggregate quiz_attempts.
  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Topic A', 'Topic B', 'Topic C', 'Topic D'],
      datasets: [{ label: 'Average Score %', data: [78, 62, 85, 55], backgroundColor: '#3a7d2c' }],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } },
  });
}

async function loadPriorities() {
  const ul = document.getElementById('priorityList');
  // Placeholder: list static low‑score topics
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

  btn.addEventListener('click', () => { modal.style.display = 'block'; });
  cancelBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  saveBtn.addEventListener('click', () => {
    const title = (document.getElementById('lessonTitle') as HTMLInputElement).value.trim();
    const notes = (document.getElementById('lessonNotes') as HTMLTextAreaElement).value.trim();
    if (!title) { alert('Title required'); return; }
    // In a real system we would POST to /api/lesson. For now we just close and log.
    console.log('Lesson saved', { title, notes });
    modal.style.display = 'none';
    alert('Lesson saved (demo)');
  });
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return; // not signed in – nav already shows sign‑in
  await loadClasses();
  await loadAnalytics();
  await loadPriorities();
  initLessonPlanner();
}

init();
