import { supabase } from '/assets/js/auth.js';

async function authFetch(url, token) {
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { headers, cache: 'no-store' });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

function flattenCurriculum(curriculum) {
  const entries = [];
  curriculum.forEach((subject) => {
    (subject.strands || []).forEach((strand) => {
      (strand.units || []).forEach((unit) => {
        (unit.standards || []).forEach((standard) => {
          (standard.benchmarks || []).forEach((benchmark) => {
            (benchmark.topics || []).forEach((topic) => {
              entries.push({ topic, subject, strand });
            });
          });
        });
      });
    });
  });
  return entries;
}

function renderOverview(progress, topics) {
  const completedIds = new Set(
    progress.filter((item) => item.status === 'completed').map((item) => item.topic_id),
  );
  const completed = topics.filter(({ topic }) => completedIds.has(topic.id)).length;
  const total = topics.length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const summary = document.getElementById('overallSummary');

  summary.textContent = total
    ? `${completed} of ${total} curriculum topics completed (${percentage}%).`
    : 'Curriculum progress is not available yet.';

  const canvas = document.getElementById('overallChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (canvas.chartInstance) canvas.chartInstance.destroy();
  canvas.chartInstance = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Not yet completed'],
      datasets: [{
        data: [completed, Math.max(total - completed, 0)],
        backgroundColor: ['#3a7d2c', '#ddd'],
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    },
  });
}

function renderCurriculum(curriculum) {
  const container = document.getElementById('curriculumTree');
  if (!curriculum.length) {
    container.textContent = 'No curriculum data is available yet.';
    return;
  }

  const root = document.createElement('ul');
  curriculum.forEach((subject) => {
    const subjectItem = document.createElement('li');
    subjectItem.textContent = `${subject.name} (Grade ${subject.grade})`;
    const strandsList = document.createElement('ul');

    (subject.strands || []).forEach((strand) => {
      const strandItem = document.createElement('li');
      strandItem.textContent = strand.name;
      const unitsList = document.createElement('ul');

      (strand.units || []).forEach((unit) => {
        const unitItem = document.createElement('li');
        unitItem.textContent = unit.name;
        const topicsList = document.createElement('ul');

        (unit.standards || []).forEach((standard) => {
          (standard.benchmarks || []).forEach((benchmark) => {
            (benchmark.topics || []).forEach((topic) => {
              const topicItem = document.createElement('li');
              topicItem.textContent = topic.title;
              topicsList.appendChild(topicItem);
            });
          });
        });

        if (topicsList.childElementCount) unitItem.appendChild(topicsList);
        unitsList.appendChild(unitItem);
      });

      if (unitsList.childElementCount) strandItem.appendChild(unitsList);
      strandsList.appendChild(strandItem);
    });

    if (strandsList.childElementCount) subjectItem.appendChild(strandsList);
    root.appendChild(subjectItem);
  });

  container.replaceChildren(root);
}

function renderRecentActivity(progress, topics) {
  const tableBody = document.querySelector('#activityTable tbody');
  const topicNames = new Map(topics.map(({ topic }) => [topic.id, topic.title]));
  const recent = [...progress]
    .sort((a, b) => {
      const dateA = Date.parse(a.completed_at || a.started_at || a.created_at || '') || 0;
      const dateB = Date.parse(b.completed_at || b.started_at || b.created_at || '') || 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  if (!recent.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'Your learning activity will appear here as you work through topics.';
    row.appendChild(cell);
    tableBody.replaceChildren(row);
    return;
  }

  const rows = recent.map((item) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    const topicCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const timestamp = item.completed_at || item.started_at || item.created_at;

    dateCell.textContent = timestamp ? new Date(timestamp).toLocaleDateString() : '—';
    topicCell.textContent = topicNames.get(item.topic_id) || 'Curriculum topic';
    statusCell.textContent = item.status === 'completed' ? 'Completed' : 'In progress';
    row.append(dateCell, topicCell, statusCell);
    return row;
  });

  tableBody.replaceChildren(...rows);
}

function renderRecommendations(progress, topics) {
  const progressByTopic = new Map(progress.map((item) => [item.topic_id, item.status]));
  const recommendations = topics
    .filter(({ topic }) => progressByTopic.get(topic.id) !== 'completed')
    .sort((a, b) => {
      const aInProgress = progressByTopic.get(a.topic.id) === 'in_progress';
      const bInProgress = progressByTopic.get(b.topic.id) === 'in_progress';
      return Number(bInProgress) - Number(aInProgress);
    })
    .slice(0, 8);

  const list = document.getElementById('recommendList');
  if (!recommendations.length) {
    list.textContent = 'You have completed every topic currently listed in this curriculum.';
    return;
  }

  const items = recommendations.map(({ topic, subject, strand }) => {
    const item = document.createElement('li');
    const action = progressByTopic.get(topic.id) === 'in_progress' ? 'Continue' : 'Start';
    item.textContent = `${action}: ${topic.title} (${subject.name} → ${strand.name})`;
    return item;
  });
  list.replaceChildren(...items);
}

async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  try {
    // Load each protected dataset once, in parallel, using the same session token.
    const [progressResponse, curriculumResponse] = await Promise.all([
      authFetch('/api/student/progress', session.access_token),
      authFetch('/api/curriculum/subjects', session.access_token),
    ]);

    const progress = Array.isArray(progressResponse.progress) ? progressResponse.progress : [];
    const curriculum = Array.isArray(curriculumResponse.curriculum) ? curriculumResponse.curriculum : [];
    const topics = flattenCurriculum(curriculum);

    renderOverview(progress, topics);
    renderCurriculum(curriculum);
    renderRecentActivity(progress, topics);
    renderRecommendations(progress, topics);
  } catch (error) {
    console.error('Student dashboard could not load.');
    document.getElementById('dashboardError').textContent =
      'We could not load your learning information. Please refresh and try again.';
  }
}

init();
