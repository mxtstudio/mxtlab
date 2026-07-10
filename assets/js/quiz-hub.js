const QUIZ_LIST=[
{slug:'g9-soil-formation',title:'Soil — Types & Formation',grade:9,strand:'crops'},
{slug:'g9-types-crops',title:'Types of Crops & Their Environments',grade:9,strand:'crops'},
{slug:'g9-crop-farming',title:'Crop Farming Practices & Management',grade:9,strand:'crops'},
{slug:'g9-crop-technology',title:'Crop Farming Technology',grade:9,strand:'crops'},
{slug:'g9-horticulture',title:'Horticulture — Fruits, Vegetables & Spices',grade:9,strand:'crops'},
{slug:'g9-monogastric-polygastric',title:'Monogastric & Polygastric Animals',grade:9,strand:'animals'},
{slug:'g9-intro-aquaculture',title:'Introduction to Aquaculture',grade:9,strand:'aquaculture'},
{slug:'g9-forests',title:'Types of Forests & Forest Resources',grade:9,strand:'nrm'},
{slug:'g9-agribusiness-economics',title:'Economic Principles in Agribusiness',grade:9,strand:'agribusiness'},
{slug:'g10-soil-improvement',title:'Soil Improvement Practices',grade:10,strand:'crops'},
{slug:'g10-crop-classification',title:'Crop Classification',grade:10,strand:'crops'},
{slug:'g10-agribusiness-risk',title:'Managing Risk in Agribusiness',grade:10,strand:'agribusiness'},
{slug:'g10-agribusiness-marketing',title:'Agribusiness Communication & Marketing',grade:10,strand:'agribusiness'},
{slug:'g9-animal-anatomy',title:'Anatomy of Farm Animals',grade:9,strand:'animals'},
{slug:'g9-animal-farming',title:'Animal Farming Practices & Management',grade:9,strand:'animals'},
{slug:'g9-poultry-types',title:'Types of Poultry & Their Behaviour',grade:9,strand:'animals'},
{slug:'g9-poultry-farming',title:'Poultry Farming Principles & Systems',grade:9,strand:'animals'},
{slug:'g9-pomology-olericulture',title:'Plant Farming Practices — Pomology & Olericulture',grade:9,strand:'crops'},
{slug:'g9-horticulture-technology',title:'Technology in Horticulture Production',grade:9,strand:'crops'},
{slug:'g9-aqua-farming-systems',title:'Aqua Farming Systems & Practices',grade:9,strand:'aquaculture'},
{slug:'g9-aqua-technology',title:'Gears & Technology in Aqua Farming',grade:9,strand:'aquaculture'},
{slug:'g9-forest-harvesting',title:'Forest Harvesting Practices',grade:9,strand:'nrm'},
{slug:'g9-forest-management',title:'Forest Management & Conservation',grade:9,strand:'nrm'},
{slug:'g9-forestry-technology',title:'Forestry Technology: Tools & Challenges',grade:9,strand:'nrm'},
{slug:'g9-agri-imports-exports',title:'Agricultural Imports & Exports',grade:9,strand:'agribusiness'},
{slug:'g9-agribusiness-planning',title:'Planning & Managing an Agribusiness',grade:9,strand:'agribusiness'},
{slug:'g10-crop-management',title:'Crop Management Systems & Practices',grade:10,strand:'crops'},
{slug:'g10-plant-propagation',title:'Plant Propagation Technology',grade:10,strand:'crops'},
{slug:'g10-types-plants',title:'Types of Agricultural Plants',grade:10,strand:'crops'},
{slug:'g10-ornamental-cultivation',title:'Cultivation of Ornamental & Bedding Plants',grade:10,strand:'crops'},
{slug:'g10-horticulture-tech',title:'Technology in Horticulture Production',grade:10,strand:'crops'},
{slug:'g10-agribusiness-startup',title:'Starting Up an Agribusiness',grade:10,strand:'agribusiness'},
{slug:'g10-animal-breeds',title:'Breeds of Monogastric & Polygastric Animals',grade:10,strand:'animals'},
{slug:'g10-animal-physiology',title:'Animal Physiology: Digestive & Reproductive Systems',grade:10,strand:'animals'},
{slug:'g10-animal-husbandry',title:'Animal Husbandry & Management Practices',grade:10,strand:'animals'},
{slug:'g10-animal-nutrition',title:'Animal Nutrition, Feeding & Health',grade:10,strand:'animals'},
{slug:'g10-animal-postharvest',title:'Post-Harvest Processing of Animal Products',grade:10,strand:'animals'},
{slug:'g10-poultry-management',title:'Poultry Breeds, Management & Technology',grade:10,strand:'animals'},
{slug:'g10-aqua-environments',title:'Freshwater, Brackish & Saltwater Farming',grade:10,strand:'aquaculture'},
{slug:'g10-aqua-management',title:'Aqua Farming Management Systems',grade:10,strand:'aquaculture'},
{slug:'g10-capture-fishery',title:'Capture Fishery: Harvesting & Management',grade:10,strand:'nrm'},
{slug:'g10-aqua-tech',title:'Technology in Aquaculture & Capture Fishery',grade:10,strand:'aquaculture'},
{slug:'g10-forests-types',title:'Tropical Forests & Their Characteristics',grade:10,strand:'nrm'},
{slug:'g10-forest-management',title:'Forest Management & Monitoring Systems',grade:10,strand:'nrm'},
{slug:'g10-forest-conservation',title:'Preserving & Sustaining Forests',grade:10,strand:'nrm'},
{slug:'g10-forestry-tech',title:'Forestry Technology: Harvesting & Processing',grade:10,strand:'nrm'},
{slug:'g11-soil-nutrients',title:'Soil Nutrients: Macro & Micro',grade:11,strand:'crops'},
{slug:'g11-aromatic-plants',title:'Aromatic & Herbal Plants',grade:11,strand:'crops'},
{slug:'g11-apiculture',title:'Apiculture: Beekeeping in PNG',grade:11,strand:'animals'},
{slug:'g11-fish-species',title:'Fish Species & Cultivation Environments',grade:11,strand:'aquaculture'},
{slug:'g11-capture-fishery',title:'Capture Fishery: Cultivation & Regulations',grade:11,strand:'nrm'},
{slug:'g11-forest-products',title:'Forest Products, Regulations & Technology',grade:11,strand:'nrm'},
{slug:'g11-financial-management',title:'Agribusiness Financial Management',grade:11,strand:'agribusiness'},
{slug:'g12-soil-topography',title:'Soil Topography & Crop Production Returns',grade:12,strand:'crops'},
{slug:'g12-crop-physiology',title:'Crop Physiology & Farming Practices',grade:12,strand:'crops'},
{slug:'g12-horticulture-commercialisation',title:'Plants, Horticulture & Commercialisation',grade:12,strand:'crops'},
{slug:'g12-quality-animal-products',title:'Quality Animal Products & Technology',grade:12,strand:'animals'},
{slug:'g12-aqua-advanced',title:'Advanced Aqua Farming & Post-Harvest Technology',grade:12,strand:'aquaculture'},
{slug:'g12-forestry-processing',title:'Forestry Processing, Silviculture & Technology',grade:12,strand:'nrm'},
{slug:'g12-advanced-finance',title:'Advanced Agribusiness Finance & Capital',grade:12,strand:'agribusiness'},
{slug:'g11-biennial-crops',title:'Biennial Crops & Crop Protection',grade:11,strand:'crops'},
{slug:'g11-horticulture-tech',title:'Horticulture Technology & Constraints',grade:11,strand:'crops'},
{slug:'g11-livestock-management',title:'Livestock Management & Husbandry',grade:11,strand:'animals'},
{slug:'g11-poultry-processing',title:'Poultry Processing, Regulation & Technology',grade:11,strand:'animals'},
{slug:'g11-aqua-marketing',title:'Aquaculture Production, Marketing & Regulations',grade:11,strand:'aquaculture'},
{slug:'g11-credit-financing',title:'Credit Organisations & Financing',grade:11,strand:'agribusiness'},
{slug:'g11-financial-statements',title:'Financial Statements & Cash Flow',grade:11,strand:'agribusiness'},
{slug:'g12-poultry-project',title:'Bird Anatomy & Planning a Poultry Project',grade:12,strand:'animals'}
];

/* ══════════════════════════════════════════
   QUIZ HUB — rendering, filtering, scoring
   ══════════════════════════════════════════ */
(function(){
  const STRAND_LABELS = {crops:'Crops',animals:'Animals',aquaculture:'Aquaculture',nrm:'Natural Resources',agribusiness:'Agribusiness'};
  let activeGrade = 'all';
  let activeStrand = 'all';
  let searchTerm = '';
  let currentQuizSlug = null;

  function getScores(){
    try{ return JSON.parse(localStorage.getItem('mxt_quiz_scores')||'{}'); }catch(e){ return {}; }
  }
  function saveScore(slug, score, total){
    const scores = getScores();
    scores[slug] = { score, total, pct: Math.round((score/total)*100), date: Date.now() };
    try{ localStorage.setItem('mxt_quiz_scores', JSON.stringify(scores)); }catch(e){}
  }
  function updateCompletedStat(){
    const scores = getScores();
    const el = document.getElementById('qh-completed-stat');
    if(el) el.textContent = Object.keys(scores).length;
  }

  function matchesFilters(item){
    if(activeGrade !== 'all' && item.grade !== parseInt(activeGrade,10)) return false;
    if(activeStrand !== 'all' && item.strand !== activeStrand) return false;
    if(searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }

  function cardHTML(item){
    const scores = getScores();
    const result = scores[item.slug];
    const lesson = (typeof LESSONS !== 'undefined') ? LESSONS[item.slug] : null;
    const qCount = lesson && lesson.quiz ? lesson.quiz.length : '–';
    let scoreHTML;
    if(result){
      const cls = result.pct >= 70 ? 'pass' : 'fail';
      scoreHTML = `<span class="qh-score ${cls}">${result.score}/${result.total} (${result.pct}%)</span>`;
    } else {
      scoreHTML = `<span class="qh-score unattempted">Not attempted</span>`;
    }
    return `
      <div class="qh-card" data-slug="${item.slug}" tabindex="0" role="button" aria-label="Open quiz: ${item.title}">
        <div class="qh-card-top">
          <span class="qh-tag qh-tag-${item.strand}">${STRAND_LABELS[item.strand]}</span>
          <span class="qh-grade-badge">G${item.grade}</span>
        </div>
        <h3>${item.title}</h3>
        <div class="qh-card-foot">
          <span class="qh-qcount">${qCount} questions</span>
          ${scoreHTML}
        </div>
      </div>`;
  }

  function renderGrid(){
    const grid = document.getElementById('qh-grid');
    const empty = document.getElementById('qh-empty');
    if(!grid) return;
    const filtered = QUIZ_LIST.filter(matchesFilters);
    if(filtered.length === 0){
      grid.innerHTML = '';
      empty.classList.add('show');
      return;
    }
    empty.classList.remove('show');
    grid.innerHTML = filtered.map(cardHTML).join('');
    grid.querySelectorAll('.qh-card').forEach(card => {
      card.addEventListener('click', () => openQuiz(card.dataset.slug));
      card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openQuiz(card.dataset.slug); } });
    });
    updateCompletedStat();
  }

  function openQuiz(slug){
    const lesson = (typeof LESSONS !== 'undefined') ? LESSONS[slug] : null;
    const meta = QUIZ_LIST.find(q => q.slug === slug);
    if(!lesson || !lesson.quiz || !meta) return;
    currentQuizSlug = slug;

    document.getElementById('qh-modal-title').textContent = meta.title;
    const tagEl = document.getElementById('qh-modal-tag');
    tagEl.textContent = STRAND_LABELS[meta.strand];
    tagEl.className = 'qh-tag qh-tag-' + meta.strand;
    document.getElementById('qh-modal-lesson-link').href = '/lessons/' + slug + '.html';

    const qWrap = document.getElementById('qh-quiz-questions');
    qWrap.innerHTML = lesson.quiz.map((q, i) => `
      <div class="quiz-q" data-qindex="${i}">
        <p class="qh-q-text">Q${i+1}: ${q.q}</p>
        <div class="qopts">
          ${q.opts.map((opt, oi) => `
            <label class="qopt">
              <input type="radio" name="hq${i}" value="${oi}"/>
              <span class="opt-text">${opt}</span>
            </label>`).join('')}
        </div>
      </div>`).join('');

    document.getElementById('qh-quiz-result').style.display = 'none';
    document.getElementById('qh-quiz-result').className = '';
    const btn = document.getElementById('qh-quiz-submit-btn');
    btn.textContent = 'Check Answers';
    btn.onclick = submitHubQuiz;

    document.getElementById('qh-modal').classList.add('open');
    document.getElementById('qh-modal').setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuiz(){
    document.getElementById('qh-modal').classList.remove('open');
    document.getElementById('qh-modal').setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    renderGrid();
  }

  function submitHubQuiz(){
    const slug = currentQuizSlug;
    const lesson = LESSONS[slug];
    const resultEl = document.getElementById('qh-quiz-result');
    const qEls = document.querySelectorAll('#qh-quiz-questions .quiz-q');
    let answered = 0, score = 0;

    qEls.forEach((qEl, i) => {
      const correctIdx = lesson.quiz[i] ? lesson.quiz[i].ans : -1;
      const opts = qEl.querySelectorAll('.qopt');
      const checked = qEl.querySelector('input[type="radio"]:checked');
      const selectedIdx = checked ? parseInt(checked.value, 10) : -1;
      if(checked) answered++;
      if(selectedIdx === correctIdx) score++;
      opts.forEach((opt, idx) => {
        if(idx === correctIdx) opt.classList.add('correct');
        else if(idx === selectedIdx) opt.classList.add('wrong');
      });
    });

    const total = qEls.length;
    const pct = total ? Math.round((score/total)*100) : 0;
    let msg = `You scored ${score} / ${total} (${pct}%).`;
    if(answered < total) msg = `You answered ${answered} of ${total} questions. ` + msg;
    if(pct === 100) msg += ' Perfect score!';
    else if(pct >= 70) msg += ' Good job!';
    else msg += ' Review the lesson and try again.';
    resultEl.textContent = msg;
    resultEl.className = pct >= 70 ? 'pass' : 'fail';
    resultEl.style.display = 'block';

    saveScore(slug, score, total);

    const btn = document.getElementById('qh-quiz-submit-btn');
    btn.textContent = 'Try Again';
    btn.onclick = () => openQuiz(slug);
  }

  function setupFilters(){
    document.querySelectorAll('[data-grade]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-grade]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeGrade = btn.dataset.grade;
        renderGrid();
      });
    });
    document.querySelectorAll('[data-strand]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-strand]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeStrand = btn.dataset.strand;
        renderGrid();
      });
    });
    const searchInput = document.getElementById('qh-search-input');
    if(searchInput){
      searchInput.addEventListener('input', () => {
        searchTerm = searchInput.value.trim();
        renderGrid();
      });
    }
  }

  function init(){
    if(typeof LESSONS === 'undefined' || typeof QUIZ_LIST === 'undefined') {
      setTimeout(init, 50);
      return;
    }
    setupFilters();
    renderGrid();
    document.getElementById('qh-modal-close').addEventListener('click', closeQuiz);
    document.getElementById('qh-modal').addEventListener('click', e => {
      if(e.target.id === 'qh-modal') closeQuiz();
    });
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && document.getElementById('qh-modal').classList.contains('open')) closeQuiz();
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
