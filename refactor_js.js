const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const mainJsPath = path.join(baseDir, 'assets/js/main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// 1. Replace nav(page) function
const navFn = `function nav(page){
  const pageMap = {
    'home': '/',
    'modules': '/topics.html',
    'blog': '/resources.html',
    'about': '/about.html',
    'careers': '/careers.html',
    'contact': '/contact.html',
    'privacy': '/privacy.html',
    'terms': '/terms.html'
  };
  if (pageMap[page]) {
    window.location.href = pageMap[page];
  }
}`;

mainJs = mainJs.replace(/function nav\(page\)\{[\s\S]*?if\(page==='blog'\) renderBlogFull\(\);\s*\}/, navFn);

// 2. Replace setGrade
mainJs = mainJs.replace(/function setGrade\(g\)\{ currentGrade = g; \}/, `function setGrade(g){
  const url = new URL(window.location.href);
  url.pathname = '/topics.html';
  url.searchParams.set('grade', g);
  window.location.href = url.toString();
}`);

// 3. Update search results
// We'll do a more robust replacement for the search result templates
mainJs = mainJs.replace(/<div class="sri" onclick="openLesson\('\${r\.id}'\);closeSearch\(\)">/g, '<a href="/lessons/${r.id}.html" class="sri">');
mainJs = mainJs.replace(/<\/div>\s*<\/div>\s*`\)\.join\(''\);/g, '</div></a>`).join("");');

// 4. Fix openLesson (make it work if called, though we prefer <a>)
mainJs = mainJs.replace(/function openLesson\(id\)\{[\s\S]*?\}/, `function openLesson(id){ window.location.href = '/lessons/' + id + '.html'; }`);

// 5. Add missing logic
mainJs += `
function submitLessonQuiz() {
    const quizSection = document.getElementById('quiz-section');
    if(!quizSection) return;
    const questions = quizSection.querySelectorAll('.quiz-q');
    let correct = 0;
    let total = questions.length;
    let allAnswered = true;

    questions.forEach((q, i) => {
        const selected = q.querySelector('input[type="radio"]:checked');
        if(!selected) { allAnswered = false; return; }
        const ans = parseInt(q.dataset.ans);
        const val = parseInt(selected.value);

        q.querySelectorAll('.qopt').forEach((opt, oi) => {
            opt.classList.add('revealed');
            if(oi === ans) opt.classList.add('correct');
            else if(oi === val && val !== ans) opt.classList.add('wrong');
        });

        if(val === ans) correct++;
    });

    if(!allAnswered) { alert('Please answer all questions first'); return; }

    const pct = Math.round((correct/total)*100);
    const resultEl = document.getElementById('quiz-result');
    if(resultEl) {
        resultEl.className = 'quiz-result ' + (pct >= 60 ? 'pass' : 'fail');
        resultEl.innerHTML = pct >= 60 ? '✅ Great work! You scored ' + correct + '/' + total + ' (' + pct + '%). Well done!' : 'You scored ' + correct + '/' + total + ' (' + pct + '%). Review the content and try again.';
        resultEl.style.display = 'block';
    }
    const submitBtn = document.getElementById('quiz-submit-btn');
    if(submitBtn) submitBtn.style.display = 'none';
}

(function initMPA() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html') || path === '') {
        if (typeof renderBlogPreview === 'function') renderBlogPreview();
    } else if (path.includes('topics.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const grade = parseInt(urlParams.get('grade')) || 9;
        if (typeof filterGrade === 'function') filterGrade(grade);
    } else if (path.includes('resources.html')) {
        if (typeof renderBlogFull === 'function') renderBlogFull();
    }
    if (typeof initReveal === 'function') initReveal();
})();
`;

fs.writeFileSync(mainJsPath, mainJs);
console.log("Main JS refactored for MPA.");
