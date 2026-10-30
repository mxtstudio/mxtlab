import { supabase, getCurrentUserProfile, signInWithGoogle } from '/assets/js/auth.js';

// Utility to fetch with auth token
async function authFetch(url, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) throw new Error(`Fetch ${url} failed: ${resp.status}`);
  return resp.json();
}

async function loadOverview() {
  // Get student progress and compute overall completion
  const { data: { session } } = await supabase.auth.getSession();
  const user = await getCurrentUserProfile();
  if (!user) return;
  const studentId = user.id; // profiles.id matches roster_students.id? Actually roster_students.id is separate. For demo we use profile id as student identifier.
  const progressRes = await authFetch('/api/student/progress');
  const progress = progressRes.progress || [];
  const completed = progress.filter(p => p.status === 'completed').length;
  const total = progress.length || 1;
  const pct = Math.round((completed / total) * 100);
  const ctx = document.getElementById('overallChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [{ data: [pct, 100 - pct], backgroundColor: ['#3a7d2c', '#ddd'] }],
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
  });
}

async function loadCurriculum() {
  const res = await authFetch('/api/curriculum/subjects');
  const { curriculum } = res;
  const container = document.getElementById('curriculumTree');
  if (!curriculum) { container.innerText = 'No curriculum data.'; return; }
  const ul = document.createElement('ul');
  curriculum.forEach(subject => {
    const liSub = document.createElement('li');
    liSub.textContent = `${subject.name} (Grade ${subject.grade})`;
    const ulStrand = document.createElement('ul');
    (subject.strands || []).forEach(strand => {
      const liStrand = document.createElement('li');
      liStrand.textContent = strand.name;
      const ulUnit = document.createElement('ul');
      (strand.units || []).forEach(unit => {
        const liUnit = document.createElement('li');
        liUnit.textContent = unit.name;
        const ulTopic = document.createElement('ul');
        (unit.standards || []).forEach(std => {
          (std.benchmarks || []).forEach(bm => {
            (bm.topics || []).forEach(topic => {
              const liTopic = document.createElement('li');
              liTopic.textContent = topic.title;
              ulTopic.appendChild(liTopic);
            });
          });
        });
        if (ulTopic.childElementCount) {
          liUnit.appendChild(ulTopic);
        }
        ulUnit.appendChild(liUnit);
      });
      if (ulUnit.childElementCount) liStrand.appendChild(ulUnit);
      ulStrand.appendChild(liStrand);
    });
    if (ulStrand.childElementCount) liSub.appendChild(ulStrand);
    ul.appendChild(liSub);
  });
  container.appendChild(ul);
}

async function loadRecentQuizzes() {
  const res = await authFetch('/api/student/progress');
  const { progress } = res;
  const tableBody = document.querySelector('#quizTable tbody');
  // For demo we treat each completed progress as a quiz attempt placeholder
  const recent = progress.slice(-5).reverse();
  recent.forEach(p => {
    const tr = document.createElement('tr');
    const dateTd = document.createElement('td');
    dateTd.textContent = new Date(p.completed_at || p.started_at).toLocaleDateString();
    const topicTd = document.createElement('td');
    topicTd.textContent = p.topic_id.slice(0, 8); // placeholder
    const scoreTd = document.createElement('td');
    scoreTd.textContent = p.status === 'completed' ? '✓' : '';
    tr.append(dateTd, topicTd, scoreTd);
    tableBody.appendChild(tr);
  });
}

async function loadRecommendations() {
  // Simple recommendation: list topics with no completed progress
  const res = await authFetch('/api/curriculum/subjects');
  const { curriculum } = res;
  const progressRes = await authFetch('/api/student/progress');
  const completedTopicIds = new Set((progressRes.progress || []).filter(p => p.status === 'completed').map(p => p.topic_id));
  const recList = document.getElementById('recommendList');
  curriculum.forEach(sub => {
    (sub.strands || []).forEach(strand => {
      (strand.units || []).forEach(unit => {
        (unit.standards || []).forEach(std => {
          (std.benchmarks || []).forEach(bm => {
            (bm.topics || []).forEach(topic => {
              if (!completedTopicIds.has(topic.id)) {
                const li = document.createElement('li');
                li.textContent = `${topic.title} (${sub.name} → ${strand.name})`;
                recList.appendChild(li);
              }
            });
          });
        });
      });
    });
  });
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Not signed in – show sign‑in button (already in nav). Nothing else.
    return;
  }
  await loadOverview();
  await loadCurriculum();
  await loadRecentQuizzes();
  await loadRecommendations();
}

init();
