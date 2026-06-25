/* ══════════════════════════════════════════
   MXT Lab — Lesson Page App Logic
   Requires: quiz-answers.js loaded before this file
   ══════════════════════════════════════════ */

/* Runtime state */
let quizSubmitted = false;
let currentGrade = parseInt(localStorage.getItem('mxt_grade') || '9', 10);

function setGrade(g){ currentGrade = g; try{ localStorage.setItem("mxt_grade", g); }catch(e){} }

/* ══════════════════════════════════════════
   QUIZ GRADING
   ══════════════════════════════════════════ */
function getCurrentLessonSlug(){
  const path = location.pathname;
  return path.substring(path.lastIndexOf('/')+1).replace('.html','');
}

function submitQuiz(){
  const slug = getCurrentLessonSlug();
  const answers = (typeof QUIZ_ANS !== 'undefined') ? QUIZ_ANS[slug] : null;
  const resultEl = document.getElementById('quiz-result');
  if(!answers || !answers.length){
    if(resultEl){ resultEl.textContent = 'Could not load quiz data for this lesson.'; resultEl.style.display='block'; }
    return;
  }

  const qEls = document.querySelectorAll('#quiz-section .quiz-q');
  let answered = 0, score = 0;

  qEls.forEach((qEl, i) => {
    const correctIdx = answers[i] !== undefined ? answers[i] : -1;
    const opts = qEl.querySelectorAll('.qopt');
    const checked = qEl.querySelector('input[type="radio"]:checked');
    const selectedIdx = checked ? parseInt(checked.value, 10) : -1;
    if(checked) answered++;
    if(selectedIdx === correctIdx) score++;

    opts.forEach((opt, idx) => {
      opt.classList.add('revealed');
      if(idx === correctIdx) opt.classList.add('correct');
      else if(idx === selectedIdx) opt.classList.add('wrong');
    });
  });

  const total = qEls.length;
  const pct = total ? Math.round((score/total)*100) : 0;

  if(resultEl){
    let msg = `You scored ${score} / ${total} (${pct}%).`;
    if(answered < total) msg = `You answered ${answered} of ${total} questions. ` + msg;
    if(pct === 100) msg += ' Perfect score!';
    else if(pct >= 70) msg += ' Good job!';
    else msg += ' Review the lesson and try again.';
    resultEl.textContent = msg;
    resultEl.classList.remove('pass','fail');
    resultEl.classList.add(pct >= 70 ? 'pass' : 'fail');
    resultEl.style.display = 'block';
  }

  const btn = document.getElementById('quiz-submit-btn');
  if(btn){
    btn.textContent = 'Try Again';
    btn.onclick = resetQuiz;
  }

  quizSubmitted = true;
}

function resetQuiz(){
  document.querySelectorAll('#quiz-section input[type=radio]').forEach(r => r.checked = false);
  document.querySelectorAll('#quiz-section .qopt').forEach(o => o.classList.remove('correct','wrong','revealed'));
  const resultEl = document.getElementById('quiz-result');
  if(resultEl){ resultEl.style.display = 'none'; resultEl.classList.remove('pass','fail'); }
  const btn = document.getElementById('quiz-submit-btn');
  if(btn){ btn.textContent = 'Check Answers'; btn.onclick = submitQuiz; }
  quizSubmitted = false;
}

/* ══════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════ */
function nav(page){
  const current = document.querySelector('.page.active');
  if(current){
    current.style.opacity='0';
    current.style.transform='translateY(-8px)';
    current.style.transition='opacity .15s ease,transform .15s ease';
  }
  setTimeout(()=>{
    document.querySelectorAll('.page').forEach(p=>{
      p.classList.remove('active');
      p.style.opacity='';
      p.style.transform='';
      p.style.transition='';
    });
    const t = document.getElementById('page-'+page);
    if(t) t.classList.add('active');
    scrollTo({top:0,behavior:'smooth'});
    setTimeout(initReveal, 80);
    if(page==='home'){ renderBlogPreview(); setLogoColor(DEFAULT_COLOR); }
    if(page==='modules') renderModules(currentGrade);
    if(page==='blog') renderBlogFull();
    if(page==='glossary'){ window.location.href='/glossary.html'; return; }
    // Save current page so refresh restores it
    try{ localStorage.setItem('mxt_page', page); }catch(e){}
  }, current ? 150 : 0);
}

/* ══════════════════════════════════════════
   MODULES
   ══════════════════════════════════════════ */
function filterGrade(g){
  currentGrade = g;
  document.querySelectorAll('.grade-tab').forEach(t=>t.classList.toggle('active',+t.dataset.grade===g));
  renderModules(g);
  renderProgressBar(g);
}

function renderModules(grade){
  const strands = grade===9 ? STRANDS_9 : grade===10 ? STRANDS_10 : grade===11 ? STRANDS_11 : STRANDS_12;
  const el = document.getElementById('modules-content');
  if(!el) return;
  el.innerHTML = strands.map(s=>`
    <div class="strand-section">
      <div class="strand-header">
        <div class="strand-header-icon" style="background:${s.bg}">${s.icon}</div>
        <div>
          <h2>${s.strand}: ${s.name}</h2>
          <p>${s.desc}</p>
        </div>
      </div>
      <div class="topics-grid">
        ${s.topics.map(t=>`
          <article class="topic-card" ${t.id?`onclick="window.location='/lessons/'+t.id+'.html'"`:''}>
            <div class="tc-thumb" style="background:${t.bg}">
              ${t.icon}
              <span class="tc-status available">Available</span>
            </div>
            <div class="tc-body">
              <h3>${t.title}</h3>
              <p>${t.desc}</p>
            </div>
            <div class="tc-foot">
              <div class="tc-meta">${t.lessons} lessons</div>
              ${t.id
                ? `<a class="tc-btn" href="/lessons/${t.id}.html">Start →</a>`
                : `<button class="tc-btn" disabled>Coming Soon</button>`}
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════
   LESSON PAGE
   ══════════════════════════════════════════ */
/* ── LOGO COLOR SWITCHER ── */
const STRAND_COLORS = {
  'Crops': '#3a7d2c',
  'Animals': '#c47c00',
  'Aquaculture': '#0891b2',
  'NRM': '#166534',
  'Agribusiness':'#7c3aed'
};
const DEFAULT_COLOR = '#3a7d2c';

function setLogoColor(color){
  const bg = document.getElementById('logo-bg');
  const stem = document.getElementById('logo-stem');
  const leaf1 = document.getElementById('logo-leaf1');
  const leaf2 = document.getElementById('logo-leaf2');
  const lab = document.getElementById('lab-text');
  if(bg) bg.setAttribute('fill', color);
  if(stem) stem.setAttribute('stroke', color);
  if(leaf1) leaf1.setAttribute('stroke', color);
  if(leaf2) leaf2.setAttribute('stroke', color);
  if(lab) lab.style.color = color;
  // Update favicon
  const faviconSVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='18' fill='${color}'/><text y='.9em' font-size='72' x='12'></text></svg>`;
  let link = document.querySelector("link[rel~='icon']");
  if(link) link.href = 'data:image/svg+xml,' + encodeURIComponent(faviconSVG);
}

function getStrandColor(strandStr){
  if(!strandStr) return DEFAULT_COLOR;
  const s = strandStr.toLowerCase();
  if(s.includes('crop')) return STRAND_COLORS['Crops'];
  if(s.includes('animal')) return STRAND_COLORS['Animals'];
  if(s.includes('aqua')) return STRAND_COLORS['Aquaculture'];
  if(s.includes('nrm') || s.includes('natural')) return STRAND_COLORS['NRM'];
  if(s.includes('agribusiness')) return STRAND_COLORS['Agribusiness'];
  return DEFAULT_COLOR;
}


/* ═══════════════════════════════════════════════════
   UNSPLASH AUTO IMAGE — fetches relevant lesson image
   ═══════════════════════════════════════════════════ */
const STRAND_FALLBACKS = {
  'Crops': 'Image/crops.webp',
  'Animals': 'Image/animals.webp',
  'Aquaculture': 'Image/aquaculture.webp',
  'Natural Resources': 'Image/nrm.webp',
  'Agribusiness': 'Image/AgriBusiness.webp',
};

function applyLessonHeroImage(lessonId, title, strand) {
  const hero = document.getElementById('lesson-hero-bg');
  if (!hero) return;
  const strandKeyword = strand.split(':')[0].trim();
  const url = STRAND_FALLBACKS[strandKeyword] || 'Image/hero.webp';
  hero.style.backgroundImage = `url('${url}')`;
  hero.style.opacity = '1';
}

function openLesson(id){
  window.location.href = 'lessons/' + id + '.html';
}



/* ══════════════════════════════════════════
   BLOG
   ══════════════════════════════════════════ */
function renderBlogPreview(){
  const g = document.getElementById('blog-preview');
  if(!g) return;
  g.innerHTML = POSTS.slice(0,3).map(p=>`
    <article class="topic-card" style="cursor:pointer" onclick="window.location='/lessons/'+p.id+'.html'">
      <div class="tc-thumb" style="background:${p.bg}">${p.icon}</div>
      <div class="tc-body">
        <div class="blog-meta"><span class="chip">${p.cat}</span><span style="font-size:.7rem;color:var(--ink3)">${p.read} read</span></div>
        <h3>${p.title}</h3>
        <p>${p.ex.slice(0,100)}…</p>
        <span class="blog-read">Read →</span>
      </div>
    </article>
  `).join('');
}

function renderBlogFull(){
  const g = document.getElementById('blog-main');
  if(!g) return;
  g.innerHTML = POSTS.map(p=>`
    <article class="blc" style="cursor:pointer" onclick="window.location='/lessons/'+p.id+'.html'">
      <div class="blc-thumb" style="background:${p.bg}">${p.icon}</div>
      <div class="blc-body">
        <div class="blog-meta"><span class="chip">${p.cat}</span><span style="font-size:.7rem;color:var(--ink3)">${p.date}</span><span style="font-size:.7rem;color:var(--ink3)">${p.read} read</span></div>
        <h3>${p.title}</h3>
        <p>${p.ex}</p>
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px">
          <span class="blog-read">Read lesson →</span>
          ${p.ref?`<a href="${p.ref}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" style="font-size:.74rem;color:var(--ink3);display:inline-flex;align-items:center;gap:3px;transition:color .18s" onmouseover="this.style.color='var(--green)'" onmouseout="this.style.color='var(--ink3)'">↗ ${p.refLabel}</a>`:''}
        </div>
      </div>
    </article>
  `).join('');
  const t = document.getElementById('sw-tags');
  if(t) t.innerHTML = TAGS.map(tag=>`<span class="chip" style="cursor:pointer;margin-bottom:4px">${tag}</span>`).join('');
}

/* ══════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════ */
function buildSearchIndex(){
  const items = [];
  [...STRANDS_9,...STRANDS_10,...STRANDS_11,...STRANDS_12].forEach(s=>{
    s.topics.filter(t=>t.status==='available'&&t.id).forEach(t=>{
      const g = s.id.includes('12') ? 12 : s.id.includes('11') ? 11 : s.id.includes('10') ? 10 : 9;
      items.push({id:t.id,title:t.title,meta:`Grade ${g} · ${s.strand}: ${s.name}`,icon:t.icon,grade:g});
    });
  });
  return items;
}
const SEARCH_INDEX = buildSearchIndex();

document.getElementById('search-input').addEventListener('input', function(){
  const q = this.value.toLowerCase().trim();
  const results = q.length < 2
    ? SEARCH_INDEX.slice(0,5)
    : SEARCH_INDEX.filter(i=>i.title.toLowerCase().includes(q));
  const el = document.getElementById('s-results');
  if(!results.length){ el.innerHTML='<div style="padding:14px 16px;font-size:.84rem;color:var(--ink3)">No results found.</div>'; return; }
  el.innerHTML = results.map(r=>`
    <div class="sri" onclick="window.location='/lessons/'+r.id+'.html';closeSearch()">
      <div class="sri-ic">${r.icon}</div>
      <div><div class="sri-t">${r.title}</div><div class="sri-m">Grade ${r.grade} · ${r.meta.split('·')[1]||''}</div></div>
    </div>
  `).join('');
});

// Populate default results
document.getElementById('s-results').innerHTML = SEARCH_INDEX.slice(0,5).map(r=>`
  <div class="sri" onclick="window.location='/lessons/'+r.id+'.html';closeSearch()">
    <div class="sri-ic">${r.icon}</div>
    <div><div class="sri-t">${r.title}</div><div class="sri-m">Grade ${r.grade}</div></div>
  </div>
`).join('');

document.getElementById('search-trigger').addEventListener('click',()=>{
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(()=>document.getElementById('search-input').focus(),100);
});
document.getElementById('search-close').addEventListener('click',closeSearch);
document.getElementById('search-overlay').addEventListener('click',e=>{ if(e.target.id==='search-overlay') closeSearch(); });
function closeSearch(){ document.getElementById('search-overlay').classList.remove('open'); }

/* ══════════════════════════════════════════
   MOBILE MENU
   ══════════════════════════════════════════ */
const ham = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
ham.addEventListener('click',()=>{
  ham.classList.toggle('open');
  drawer.classList.toggle('open');
  ham.setAttribute('aria-expanded', drawer.classList.contains('open'));
});
function closeDrawer(){ ham.classList.remove('open'); drawer.classList.remove('open'); ham.setAttribute('aria-expanded','false'); }

function filterCareers(strand, btn){
  document.querySelectorAll('#career-filter .cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#career-grid .career-card').forEach(card => {
    card.style.display = (strand === 'all' || card.dataset.strand === strand) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════
   DARK MODE
   ══════════════════════════════════════════ */
let dark=localStorage.getItem('mxt-theme')==='dark';
function applyTheme(){
  document.documentElement.setAttribute('data-theme',dark?'dark':'light');
  document.getElementById('t-icon').textContent=dark?'':'';
  document.getElementById('t-lbl').textContent=dark?'Light':'Dark';
  localStorage.setItem('mxt-theme',dark?'dark':'light');
}
applyTheme();
document.getElementById('theme-toggle').addEventListener('click',()=>{
  dark=!dark;
  applyTheme();
});

/* ══════════════════════════════════════════
   SCROLL
   ══════════════════════════════════════════ */
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',scrollY>20);
  document.getElementById('back-top').classList.toggle('visible',scrollY>300);
});

/* ══════════════════════════════════════════
   MISC
   ══════════════════════════════════════════ */
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeSearch(); closeDrawer(); } });
document.getElementById('announce-close').addEventListener('click',()=>document.getElementById('announce-bar').style.display='none');

// Navbar glass effect on scroll
(function(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

function toast(ic,msg){
  document.getElementById('t-ic2').textContent=ic;
  document.getElementById('t-msg2').textContent=msg;
  const t=document.getElementById('toast');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
}

async function submitForm(){
  const n=document.getElementById('fn').value;
  const l=document.getElementById('fl').value;
  const e=document.getElementById('fe').value;
  const r=document.getElementById('fg2').value;
  const m=document.getElementById('fm').value;
  if(!n||!e){ toast('','Please fill in your name and email.'); return; }
  const btn=document.querySelector('#cform .btn-primary');
  btn.textContent='Sending…';btn.disabled=true;
  document.getElementById('cform').style.opacity='.6';
  try{
    const res=await fetch('https://formspree.io/f/mojbeweo',{
      method:'POST',
      headers:{'Accept':'application/json','Content-Type':'application/json'},
      body:JSON.stringify({name:n+' '+l,email:e,role:r,message:m})
    });
    if(res.ok){
      document.getElementById('cform').style.display='none';
      document.getElementById('form-ok').classList.add('show');
      toast('','Message sent!');
    } else {
      throw new Error('Server error');
    }
  } catch(err){
    toast('','Something went wrong. Please try again.');
    btn.textContent='Send Message →';btn.disabled=false;
    document.getElementById('cform').style.opacity='1';
  }
}

function backToTop(){
  try{ window.scrollTo({top:0,behavior:'smooth'}); }
  catch(e){ document.documentElement.scrollTop=0; document.body.scrollTop=0; }
}

/* ══════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

function initReveal(){
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.remove('revealed');
    revealObserver.observe(el);
  });
  document.querySelectorAll('[data-reveal-group]').forEach(el => {
    el.classList.remove('revealed');
    revealObserver.observe(el);
  });
  // Also stagger-reveal cards that are immediately visible
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight) el.classList.add('revealed');
    });
  }, 60);
}

// Parallax on hero - GPU only
let ticking = false;
window.addEventListener('scroll', () => {
  if(!ticking){
    requestAnimationFrame(() => {
      const hero = document.querySelector('.hero');
      if(hero){
        const y = scrollY * 0.28;
        hero.style.backgroundPositionY = y + 'px';
        const visual = hero.querySelector('.hero-visual');
        if(visual) visual.style.transform = `translateY(${-y * 0.12}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });



/* ══════════════════════════════════════════
   PROGRESS TRACKING
   ══════════════════════════════════════════ */
function getCompleted(){ try{ return JSON.parse(localStorage.getItem('mxt-completed')||'[]'); }catch(e){ return []; } }
function isCompleted(id){ return getCompleted().includes(id); }
function markComplete(id){
  if(!id) return;
  const c = getCompleted();
  if(!c.includes(id)){ c.push(id); localStorage.setItem('mxt-completed',JSON.stringify(c)); }
  const btn = document.getElementById('complete-btn');
  if(btn){ btn.textContent='Completed'; btn.classList.add('done'); }
  // Update topic card if visible
  const cards = document.querySelectorAll('.topic-card');
  cards.forEach(card=>{ if(card.getAttribute('onclick')&&card.getAttribute('onclick').includes(id)) card.classList.add('completed'); });
}
function toggleComplete(id){
  const c = getCompleted();
  const idx = c.indexOf(id);
  if(idx===-1){ c.push(id); } else { c.splice(idx,1); }
  localStorage.setItem('mxt-completed',JSON.stringify(c));
  const btn = document.getElementById('complete-btn');
  const done = c.includes(id);
  if(btn){ btn.textContent=done?'Completed':'Mark as Complete'; btn.classList.toggle('done',done); }
  renderProgressBar(currentGrade);
}
function renderProgressBar(grade){
  const wrap = document.getElementById('grade-progress-wrap');
  if(!wrap) return;
  const strands = grade===9?STRANDS_9:grade===10?STRANDS_10:grade===11?STRANDS_11:STRANDS_12;
  const all = strands.flatMap(s=>s.topics).filter(t=>t.status==='available'&&t.id);
  const done = all.filter(t=>isCompleted(t.id)).length;
  const pct = all.length ? Math.round((done/all.length)*100) : 0;
  wrap.innerHTML = `<div class="grade-progress">
    <span>Grade ${grade} Progress</span>
    <div class="grade-progress-bar"><div class="grade-progress-fill" style="width:${pct}%"></div></div>
    <span class="grade-progress-label">${done}/${all.length}</span>
  </div>`;
}

/* ══════════════════════════════════════════
   CONFETTI
   ══════════════════════════════════════════ */
function launchConfetti(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.style.display='block';
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const pieces=[];
  const colors=['#3a7d2c','#c8900a','#0369a1','#16a34a','#f59e0b','#ef4444','#8b5cf6'];
  for(let i=0;i<120;i++){
    pieces.push({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height-canvas.height,
      w:Math.random()*10+5, h:Math.random()*5+3,
      color:colors[Math.floor(Math.random()*colors.length)],
      rot:Math.random()*360, vx:(Math.random()-0.5)*4,
      vy:Math.random()*4+2, vr:Math.random()*4-2
    });
  }
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
      p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.08;
    });
    frame++;
    if(frame<120) requestAnimationFrame(draw);
    else{ ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display='none'; }
  }
  draw();
}


/* ══════════════════════════════════════════
   GLOSSARY
   ══════════════════════════════════════════ */
let glossaryData=[];
let glossaryFilter='all';
function buildGlossary(){
  if(glossaryData.length) return;
  const allLessons = Object.values(LESSONS);
  allLessons.forEach(L=>{
    if(!L.keyTerms||!L.keyTerms.length) return;
    L.keyTerms.forEach(t=>{
      if(!glossaryData.find(g=>g.word.toLowerCase()===t.word.toLowerCase())){
        glossaryData.push({word:t.word,def:t.def,strand:L.strand.split(':')[1]?.trim()||L.strand,grade:L.grade});
      }
    });
  });
  glossaryData.sort((a,b)=>a.word.localeCompare(b.word));
}
function renderGlossary(filter){
  buildGlossary();
  if(filter) glossaryFilter=filter;
  const q=(document.getElementById('glossary-search')||{}).value||'';
  const data = glossaryData.filter(g=>{
    const matchQ = !q||g.word.toLowerCase().includes(q.toLowerCase())||g.def.toLowerCase().includes(q.toLowerCase());
    const matchF = glossaryFilter==='all'||g.grade===parseInt(glossaryFilter);
    return matchQ&&matchF;
  });
  const grid=document.getElementById('glossary-grid');
  const count=document.getElementById('glossary-count');
  const filters=document.getElementById('glossary-filters');
  if(count) count.textContent=`Showing ${data.length} of ${glossaryData.length} terms`;
  if(filters&&!filters.innerHTML){
    filters.innerHTML=['all',9,10,11,12].map(g=>`
      <button class="grade-tab${g==='all'?' active':''}" onclick="renderGlossary('${g}')">${g==='all'?'All Grades':'Grade '+g}</button>
    `).join('');
  }
  if(filters){
    filters.querySelectorAll('.grade-tab').forEach(b=>{
      b.classList.toggle('active', b.textContent.trim()===(glossaryFilter==='all'?'All Grades':'Grade '+glossaryFilter)||
        (glossaryFilter==='all'&&b.textContent.trim()==='All Grades'));
    });
  }
  if(grid) grid.innerHTML = data.length
    ? data.map(g=>`
      <div class="glossary-card">
        <div class="glossary-word">${g.word}</div>
        <div class="glossary-def">${g.def}</div>
        <span class="glossary-tag">Grade ${g.grade} · ${g.strand}</span>
      </div>`).join('')
    : '<p style="color:var(--ink3);grid-column:1/-1">No terms found.</p>';
}
function filterGlossary(q){ renderGlossary(glossaryFilter); }


/* INIT — only run SPA nav on index.html */
(function(){
  if(!document.getElementById('page-home')) return; // not index.html, skip
  const validPages = ['home','modules','lesson','about','blog','contact','privacy','terms','careers'];
  const saved = (function(){ try{ return localStorage.getItem('mxt_page'); }catch(e){ return null; } })();
  const startPage = (saved && validPages.includes(saved)) ? saved : 'home';
  const savedGrade = (function(){ try{ return parseInt(localStorage.getItem('mxt_grade'))||9; }catch(e){ return 9; } })();
  currentGrade = savedGrade;
  nav(startPage);
})();
const QH_LESSONS = [
  {slug:'g9-soil-formation',title:"Soil \u2014 Types & Formation",strand:"Crops",unit:"Unit 1",grade:9,qcount:5},
  {slug:'g9-types-crops',title:"Types of Crops & Their Environments",strand:"Crops",unit:"Unit 2",grade:9,qcount:5},
  {slug:'g9-crop-farming',title:"Crop Farming Practices & Management",strand:"Crops",unit:"Unit 3",grade:9,qcount:5},
  {slug:'g9-crop-technology',title:"Crop Farming Technology",strand:"Crops",unit:"Unit 4",grade:9,qcount:4},
  {slug:'g9-horticulture',title:"Horticulture \u2014 Fruits, Vegetables & Spices",strand:"Crops",unit:"Unit 5",grade:9,qcount:5},
  {slug:'g9-monogastric-polygastric',title:"Monogastric & Polygastric Animals",strand:"Animals",unit:"Unit 1",grade:9,qcount:5},
  {slug:'g9-intro-aquaculture',title:"Introduction to Aquaculture",strand:"Aquaculture",unit:"Unit 1",grade:9,qcount:5},
  {slug:'g9-forests',title:"Types of Forests & Forest Resources",strand:"NRM",unit:"Unit 1",grade:9,qcount:5},
  {slug:'g9-agribusiness-economics',title:"Economic Principles in Agribusiness",strand:"Agribusiness",unit:"Unit 1",grade:9,qcount:5},
  {slug:'g10-soil-improvement',title:"Soil Improvement Practices",strand:"Crops",unit:"Unit 1",grade:10,qcount:5},
  {slug:'g10-crop-classification',title:"Crop Classification",strand:"Crops",unit:"Unit 2",grade:10,qcount:5},
  {slug:'g10-agribusiness-risk',title:"Managing Risk in Agribusiness",strand:"Agribusiness",unit:"Unit 1",grade:10,qcount:5},
  {slug:'g10-agribusiness-marketing',title:"Agribusiness Communication & Marketing",strand:"Agribusiness",unit:"Unit 2",grade:10,qcount:5},
  {slug:'g9-animal-anatomy',title:"Anatomy of Farm Animals",strand:"Animals",unit:"Unit 2",grade:9,qcount:5},
  {slug:'g9-animal-farming',title:"Animal Farming Practices & Management",strand:"Animals",unit:"Unit 3",grade:9,qcount:5},
  {slug:'g9-poultry-types',title:"Types of Poultry & Their Behaviour",strand:"Animals",unit:"Unit 4",grade:9,qcount:5},
  {slug:'g9-poultry-farming',title:"Poultry Farming Principles & Systems",strand:"Animals",unit:"Unit 5",grade:9,qcount:5},
  {slug:'g9-pomology-olericulture',title:"Plant Farming Practices \u2014 Pomology & Olericulture",strand:"Crops",unit:"Unit 6",grade:9,qcount:5},
  {slug:'g9-horticulture-technology',title:"Technology in Horticulture Production",strand:"Crops",unit:"Unit 7",grade:9,qcount:5},
  {slug:'g9-aqua-farming-systems',title:"Aqua Farming Systems & Practices",strand:"Aquaculture",unit:"Unit 2",grade:9,qcount:5},
  {slug:'g9-aqua-technology',title:"Gears & Technology in Aqua Farming",strand:"Aquaculture",unit:"Unit 3",grade:9,qcount:5},
  {slug:'g9-forest-harvesting',title:"Forest Harvesting Practices",strand:"Natural Resources",unit:"Unit 5",grade:9,qcount:5},
  {slug:'g9-forest-management',title:"Forest Management & Conservation",strand:"Natural Resources",unit:"Unit 4",grade:9,qcount:5},
  {slug:'g9-forestry-technology',title:"Forestry Technology: Tools & Challenges",strand:"Natural Resources",unit:"Unit 6",grade:9,qcount:5},
  {slug:'g9-agri-imports-exports',title:"Agricultural Imports & Exports",strand:"Agribusiness",unit:"Unit 2",grade:9,qcount:5},
  {slug:'g9-agribusiness-planning',title:"Planning & Managing an Agribusiness",strand:"Agribusiness",unit:"Unit 3",grade:9,qcount:5},
  {slug:'g10-crop-management',title:"Crop Management Systems & Practices",strand:"Crops",unit:"Unit 3",grade:10,qcount:5},
  {slug:'g10-plant-propagation',title:"Plant Propagation Technology",strand:"Crops",unit:"Unit 4",grade:10,qcount:5},
  {slug:'g10-types-plants',title:"Types of Agricultural Plants",strand:"Crops",unit:"Unit 5",grade:10,qcount:5},
  {slug:'g10-ornamental-cultivation',title:"Cultivation of Ornamental & Bedding Plants",strand:"Crops",unit:"Unit 6",grade:10,qcount:5},
  {slug:'g10-horticulture-tech',title:"Technology in Horticulture Production",strand:"Crops",unit:"Unit 7",grade:10,qcount:5},
  {slug:'g10-agribusiness-startup',title:"Starting Up an Agribusiness",strand:"Agribusiness",unit:"Unit 3",grade:10,qcount:5},
  {slug:'g10-animal-breeds',title:"Breeds of Monogastric & Polygastric Animals",strand:"Animals",unit:"Unit 1",grade:10,qcount:5},
  {slug:'g10-animal-physiology',title:"Animal Physiology: Digestive & Reproductive Systems",strand:"Animals",unit:"Unit 1",grade:10,qcount:5},
  {slug:'g10-animal-husbandry',title:"Animal Husbandry & Management Practices",strand:"Animals",unit:"Unit 2",grade:10,qcount:5},
  {slug:'g10-animal-nutrition',title:"Animal Nutrition, Feeding & Health",strand:"Animals",unit:"Unit 2",grade:10,qcount:5},
  {slug:'g10-animal-postharvest',title:"Post-Harvest Processing of Animal Products",strand:"Animals",unit:"Unit 3",grade:10,qcount:5},
  {slug:'g10-poultry-management',title:"Poultry Breeds, Management & Technology",strand:"Animals",unit:"Unit 4-6",grade:10,qcount:5},
  {slug:'g10-aqua-environments',title:"Freshwater, Brackish & Saltwater Farming",strand:"Aquaculture",unit:"Unit 1",grade:10,qcount:5},
  {slug:'g10-aqua-management',title:"Aqua Farming Management Systems",strand:"Aquaculture",unit:"Unit 2",grade:10,qcount:5},
  {slug:'g10-capture-fishery',title:"Capture Fishery: Harvesting & Management",strand:"Natural Resources",unit:"Unit 1-2",grade:10,qcount:5},
  {slug:'g10-aqua-tech',title:"Technology in Aquaculture & Capture Fishery",strand:"Strand 3 & 4: Aquaculture & NRM",unit:"Unit 3",grade:10,qcount:5},
  {slug:'g10-forests-types',title:"Tropical Forests & Their Characteristics",strand:"Natural Resources",unit:"Unit 4",grade:10,qcount:5},
  {slug:'g10-forest-management',title:"Forest Management & Monitoring Systems",strand:"Natural Resources",unit:"Unit 5",grade:10,qcount:5},
  {slug:'g10-forest-conservation',title:"Preserving & Sustaining Forests",strand:"Natural Resources",unit:"Unit 5",grade:10,qcount:5},
  {slug:'g10-forestry-tech',title:"Forestry Technology: Harvesting & Processing",strand:"Natural Resources",unit:"Unit 6",grade:10,qcount:5},
  {slug:'g11-soil-nutrients',title:"Soil Nutrients: Macro & Micro",strand:"Crops",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g11-aromatic-plants',title:"Aromatic & Herbal Plants",strand:"Crops",unit:"Units 5\u20136",grade:11,qcount:5},
  {slug:'g11-apiculture',title:"Apiculture: Beekeeping in PNG",strand:"Animals",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g11-fish-species',title:"Fish Species & Cultivation Environments",strand:"Aquaculture",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g11-capture-fishery',title:"Capture Fishery: Cultivation & Regulations",strand:"Natural Resources",unit:"Units 1\u20133",grade:11,qcount:5},
  {slug:'g11-forest-products',title:"Forest Products, Regulations & Technology",strand:"Natural Resources",unit:"Units 4\u20136",grade:11,qcount:5},
  {slug:'g11-financial-management',title:"Agribusiness Financial Management",strand:"Agribusiness",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g12-soil-topography',title:"Soil Topography & Crop Production Returns",strand:"Crops",unit:"Unit 1",grade:12,qcount:5},
  {slug:'g12-crop-physiology',title:"Crop Physiology & Farming Practices",strand:"Crops",unit:"Units 2\u20133",grade:12,qcount:5},
  {slug:'g12-horticulture-commercialisation',title:"Plants, Horticulture & Commercialisation",strand:"Crops",unit:"Units 5\u20137",grade:12,qcount:5},
  {slug:'g12-quality-animal-products',title:"Quality Animal Products & Technology",strand:"Animals",unit:"Units 1\u20133",grade:12,qcount:5},
  {slug:'g12-aqua-advanced',title:"Advanced Aqua Farming & Post-Harvest Technology",strand:"Aquaculture",unit:"Units 1\u20133",grade:12,qcount:5},
  {slug:'g12-forestry-processing',title:"Forestry Processing, Silviculture & Technology",strand:"Natural Resources",unit:"Units 4\u20136",grade:12,qcount:5},
  {slug:'g12-advanced-finance',title:"Advanced Agribusiness Finance & Capital",strand:"Agribusiness",unit:"Unit 1",grade:12,qcount:5},
  {slug:'g11-biennial-crops',title:"Biennial Crops & Crop Protection",strand:"Crops",unit:"Units 2\u20133",grade:11,qcount:5},
  {slug:'g11-horticulture-tech',title:"Horticulture Technology & Constraints",strand:"Crops",unit:"Unit 7",grade:11,qcount:5},
  {slug:'g11-livestock-management',title:"Livestock Management & Husbandry",strand:"Animals",unit:"Unit 2",grade:11,qcount:5},
  {slug:'g11-poultry-processing',title:"Poultry Processing, Regulation & Technology",strand:"Animals",unit:"Units 5\u20136",grade:11,qcount:5},
  {slug:'g11-aqua-marketing',title:"Aquaculture Production, Marketing & Regulations",strand:"Aquaculture",unit:"Units 2\u20133",grade:11,qcount:5},
  {slug:'g11-credit-financing',title:"Credit Organisations & Financing",strand:"Agribusiness",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g11-financial-statements',title:"Financial Statements & Cash Flow",strand:"Agribusiness",unit:"Unit 1",grade:11,qcount:5},
  {slug:'g12-poultry-project',title:"Bird Anatomy & Planning a Poultry Project",strand:"Animals",unit:"Units 4\u20135",grade:12,qcount:5}
];