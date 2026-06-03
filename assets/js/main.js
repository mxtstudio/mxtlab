/* ══════════════════════════════════════════
   STATE & DATA
   ══════════════════════════════════════════ */
let currentGrade = 9;
const DEFAULT_COLOR = '#3a7d2c';

// Shared data for Search and Modules
const STRANDS_9 = [
  {
    id:'crops9', strand:'Strand 1', name:'Crops', icon:'🌾', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil science, crop types, farming practices, horticulture, and technology used in crop production.',
    topics:[
      {id:'g9-soil-formation',title:'Unit 1 — Soil: Types & Formation',icon:'🌱',bg:'#e8f5e2',desc:'What soil is made of, how it forms, and the physical and chemical properties of different soil types.',status:'available',lessons:4},
      {id:'g9-types-crops',title:'Unit 2 — Types of Crops & Their Environments',icon:'🌽',bg:'#fdf3d6',desc:'The different types of crops, where they grow best, and the environmental conditions they need.',status:'available',lessons:3},
      {id:'g9-crop-farming',title:'Unit 3 — Crop Farming Practices & Management',icon:'🚜',bg:'#e8f5e2',desc:'How crops are planted, managed, and harvested — different farming methods and crop management systems.',status:'available',lessons:3},
      {id:'g9-crop-technology',title:'Unit 4 — Crop Farming Technology',icon:'⚙️',bg:'#e0f2fe',desc:'The tools and technologies used in crop cultivation and management — and the advantages and disadvantages.',status:'available',lessons:3},
      {id:'g9-horticulture',title:'Unit 5 — Types of Plants: Introduction to Horticulture',icon:'🍅',bg:'#fdf3d6',desc:'Introduction to horticulture: fruit trees, vegetables, and spice crops — how they are cultivated and processed.',status:'available',lessons:4},
      {id:'g9-pomology-olericulture',title:'Unit 6 — Plant Farming Practices (Pomology & Olericulture)',icon:'🌿',bg:'#e8f5e2',desc:'Cultivation and management of pomology (fruit growing), olericulture (vegetable growing), ornamental plants, and arboriculture.',status:'available',lessons:4},
      {id:'g9-horticulture-technology',title:'Unit 7 — Technology in Horticulture',icon:'💡',bg:'#e0f2fe',desc:'How technology is used to improve cultivation, processing, and marketing of horticulture plants.',status:'available',lessons:3},
    ]
  },
  {
    id:'animals9', strand:'Strand 2', name:'Animals', icon:'🐄', bg:'#f5ece4', color:'#7c4a1e',
    desc:'Monogastric and polygastric animals, their characteristics, care, poultry farming, and management systems.',
    topics:[
      {id:'g9-monogastric-polygastric',title:'Unit 1 — Monogastric & Polygastric Animals',icon:'🐷',bg:'#f5ece4',desc:'What monogastric animals and polygastric (ruminant) animals are — and how they differ.',status:'available',lessons:3},
      {id:'g9-animal-anatomy',title:'Unit 2 — Anatomy of Farm Animals',icon:'🐄',bg:'#e8f5e2',desc:'The body systems of monogastric and polygastric animals — how their digestive systems work.',status:'available',lessons:3},
      {id:'g9-animal-farming',title:'Unit 3 — Animal Farming Practices & Management',icon:'🏠',bg:'#fdf3d6',desc:'How farm animals are housed, fed, and cared for — extensive, semi-intensive, and intensive systems.',status:'available',lessons:4},
      {id:'g9-poultry-types',title:'Unit 4 — Types of Poultry & Their Behaviour',icon:'🐔',bg:'#f5ece4',desc:'Domesticated and farmed birds — their characteristics, behaviours, purposes, and how they are kept.',status:'available',lessons:3},
      {id:'g9-poultry-farming',title:'Unit 5 — Poultry Farming Principles & Systems',icon:'🥚',bg:'#e8f5e2',desc:'Free-range, semi-intensive, and intensive poultry systems and how each is practised.',status:'available',lessons:3},
    ]
  },
  {
    id:'aqua9', strand:'Strand 3', name:'Aquaculture', icon:'🐟', bg:'#e0f2fe', color:'#0369a1',
    desc:'Fish farming in freshwater, brackish, and saltwater environments. Aqua farming practices and technology.',
    topics:[
      {id:'g9-intro-aquaculture',title:'Unit 1 — Introduction to Aquaculture',icon:'🐟',bg:'#e0f2fe',desc:'What aquaculture is, why it matters in Papua New Guinea, and the types of environments.',status:'available',lessons:3},
      {id:'g9-aqua-farming-systems',title:'Unit 2 — Aqua Farming Systems & Practices',icon:'🌊',bg:'#e8f5e2',desc:'How fish and aquatic plants are farmed in freshwater, brackish, and saltwater environments.',status:'available',lessons:4},
      {id:'g9-aqua-technology',title:'Unit 3 — Gears & Technology in Aqua Farming',icon:'⚓',bg:'#e0f2fe',desc:'The equipment and technology used in aquaculture — and how technology improves fish farming.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm9', strand:'Strand 4', name:'Natural Resource Management', icon:'🌳', bg:'#dcfce7', color:'#16a34a',
    desc:'Forestry, forest types, land management, sustainable harvesting practices, and resource protection.',
    topics:[
      {id:'g9-forests',title:'Unit 1 — Types of Forests & Forest Resources',icon:'🌳',bg:'#dcfce7',desc:'The different types of forests in Papua New Guinea, their characteristics, and the resources they provide.',status:'available',lessons:3},
      {id:'g9-forest-harvesting',title:'Unit 2 — Forest Harvesting Practices',icon:'🪓',bg:'#fdf3d6',desc:'Selective cutting, clear cutting, and strip cutting — how timber is harvested and the environmental consequences.',status:'available',lessons:3},
      {id:'g9-forest-management',title:'Unit 3 — Forest Management & Conservation',icon:'♻️',bg:'#dcfce7',desc:'How forests are managed sustainably and the importance of protecting forest ecosystems.',status:'available',lessons:3},
      {id:'g9-forestry-technology',title:'Unit 4 — Forestry Technology',icon:'🔧',bg:'#e0f2fe',desc:'The tools and technologies used in forest harvesting — and their strengths and weaknesses.',status:'available',lessons:2},
    ]
  },
  {
    id:'agri9', strand:'Strand 5', name:'Agribusiness', icon:'📊', bg:'#fdf3d6', color:'#c8900a',
    desc:'Starting and managing an agricultural business — economics, imports and exports, and business planning.',
    topics:[
      {id:'g9-agribusiness-economics',title:'Unit 1 — Economic Principles in Agribusiness',icon:'💰',bg:'#fdf3d6',desc:'What agribusiness is and how micro and macroeconomic principles apply to farming businesses.',status:'available',lessons:3},
      {id:'g9-agri-imports-exports',title:'Unit 2 — Agricultural Imports & Exports',icon:'🚢',bg:'#e8f5e2',desc:'The role of imports and exports in Papua New Guinea — how global trade affects local farming.',status:'available',lessons:3},
      {id:'g9-agribusiness-planning',title:'Unit 3 — Planning & Managing an Agribusiness',icon:'📋',bg:'#fdf3d6',desc:'Entrepreneurship, types of business ownership, and how to write a basic agribusiness plan.',status:'available',lessons:4},
    ]
  },
];

const STRANDS_10 = [
  {
    id:'crops10', strand:'Strand 1', name:'Crops', icon:'🌾', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil improvement, crop classification, crop management systems, plant propagation technology, and horticulture.',
    topics:[
      {id:'g10-soil-improvement',title:'Unit 1 — Soil Improvement Practices',icon:'🌱',bg:'#e8f5e2',desc:'Natural and artificial techniques to improve soil — and strategies to sustain soil fertility over time.',status:'available',lessons:3},
      {id:'g10-crop-classification',title:'Unit 2 — Crop Classification',icon:'🌾',bg:'#fdf3d6',desc:'How crops are classified by growing cycle, species, season, land type, and type of product.',status:'available',lessons:3},
      {id:'g10-crop-management',title:'Unit 3 — Crop Management Systems & Practices',icon:'🚜',bg:'#e8f5e2',desc:'Different crop management systems used in various contexts and principles of effective crop cultivation.',status:'available',lessons:4},
      {id:'g10-plant-propagation',title:'Unit 4 — Plant Propagation Technology',icon:'🌿',bg:'#e0f2fe',desc:'How technology improves plant propagation — and its impact on plant anatomy and physiology.',status:'available',lessons:3},
      {id:'g10-types-plants',title:'Unit 5 — Types of Agricultural Plants',icon:'🪴',bg:'#f5ece4',desc:'Plantation crops, ornamental plants, and bedding plants — benefits, functions, and classification.',status:'available',lessons:3},
      {id:'g10-ornamental-cultivation',title:'Unit 6 — Cultivation of Ornamental & Bedding Plants',icon:'🌸',bg:'#fce7f3',desc:'How ornamental and bedding plants are cultivated, processed, and marketed.',status:'available',lessons:3},
      {id:'g10-horticulture-tech',title:'Unit 7 — Technology in Horticulture Production',icon:'💡',bg:'#e0f2fe',desc:'Post-harvest technology, processing, packaging, transportation, and marketing.',status:'available',lessons:3},
    ]
  },
  {
    id:'animals10', strand:'Strand 2', name:'Animals', icon:'🐄', bg:'#f5ece4', color:'#7c4a1e',
    desc:'Animal breeds and physiology, husbandry, post-harvest technology, and online marketing of animal products.',
    topics:[
      {id:'g10-animal-breeds',title:'Unit 1 — Breeds of Monogastric & Polygastric Animals',icon:'🐷',bg:'#f5ece4',desc:'Classification of pig, goat, sheep, and cattle breeds — their characteristics and purposes.',status:'available',lessons:4},
      {id:'g10-animal-physiology',title:'Unit 2 — Animal Physiology: Digestive & Reproductive Systems',icon:'🔬',bg:'#e8f5e2',desc:'How digestive and reproductive systems of farm animals work — including the oestrous cycle.',status:'available',lessons:4},
      {id:'g10-animal-husbandry',title:'Unit 3 — Animal Husbandry & Management Practices',icon:'🏠',bg:'#fdf3d6',desc:'Extensive, semi-intensive, and intensive management systems and day-to-day husbandry.',status:'available',lessons:4},
      {id:'g10-animal-nutrition',title:'Unit 4 — Animal Nutrition, Feeding & Health',icon:'🌿',bg:'#e8f5e2',desc:'How animals are fed, grazing land management, and how animal health and housing are maintained.',status:'available',lessons:3},
      {id:'g10-animal-postharvest',title:'Unit 5 — Post-Harvest Processing of Animal Products',icon:'🥩',bg:'#f5ece4',desc:'Technology used to process, preserve, and package animal products.',status:'available',lessons:3},
      {id:'g10-poultry-management',title:'Unit 6 — Poultry Breeds, Management & Technology',icon:'🐔',bg:'#fdf3d6',desc:'Breeds of domesticated birds, poultry production systems, and technology impact.',status:'available',lessons:4},
    ]
  },
  {
    id:'aqua10', strand:'Strand 3', name:'Aquaculture', icon:'🐟', bg:'#e0f2fe', color:'#0369a1',
    desc:'Freshwater, brackish, and saltwater aqua farming — systems, capture fishery, sustainability, and technology.',
    topics:[
      {id:'g10-aqua-environments',title:'Unit 1 — Freshwater, Brackish & Saltwater Farming',icon:'💧',bg:'#e0f2fe',desc:'How fish and aquatic plants are cultivated in different water environments.',status:'available',lessons:4},
      {id:'g10-aqua-management',title:'Unit 2 — Aqua Farming Management Systems',icon:'🌊',bg:'#e8f5e2',desc:'Fish and aqua plant farming management systems and sustainable practices.',status:'available',lessons:4},
      {id:'g10-capture-fishery',title:'Unit 3 — Capture Fishery: Harvesting & Management',icon:'🎣',bg:'#e0f2fe',desc:'How capture fish and other aquatic organisms are harvested and managed.',status:'available',lessons:3},
      {id:'g10-aqua-tech',title:'Unit 4 — Technology in Aquaculture & Capture Fishery',icon:'⚙️',bg:'#fdf3d6',desc:'Technology for farming, harvesting, processing, and preserving fish.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm10', strand:'Strand 4', name:'Natural Resource Management', icon:'🌳', bg:'#dcfce7', color:'#16a34a',
    desc:'Tropical forestry, forest management, regulation and monitoring, preservation technology.',
    topics:[
      {id:'g10-forests-types',title:'Unit 1 — Tropical Forests & Their Characteristics',icon:'🌴',bg:'#dcfce7',desc:'Types of tropical forests in PNG — farm forestry, agroforestry, community forestry, and silviculture.',status:'available',lessons:3},
      {id:'g10-forest-management',title:'Unit 2 — Forest Management & Monitoring Systems',icon:'📋',bg:'#e8f5e2',desc:'Sustainable forest management — ecosystem approach, regulations, and monitoring practices.',status:'available',lessons:3},
      {id:'g10-forest-conservation',title:'Unit 3 — Preserving & Sustaining Forests',icon:'♻️',bg:'#dcfce7',desc:'Why forest preservation matters and the ways forests can be sustained.',status:'available',lessons:3},
      {id:'g10-forestry-tech',title:'Unit 4 — Forestry Technology: Harvesting & Processing',icon:'🔧',bg:'#e0f2fe',desc:'Technology for monitoring, preserving, processing, and marketing forestry products.',status:'available',lessons:2},
    ]
  },
  {
    id:'agri10', strand:'Strand 5', name:'Agribusiness', icon:'📊', bg:'#fdf3d6', color:'#c8900a',
    desc:'Risk management, marketing strategies, sales, and obtaining and managing start-up capital.',
    topics:[
      {id:'g10-agribusiness-risk',title:'Unit 1 — Managing Risk in Agribusiness',icon:'⚠️',bg:'#fdf3d6',desc:'Sources of risk and uncertainty in farming businesses — and strategies to manage and reduce them.',status:'available',lessons:3},
      {id:'g10-agribusiness-marketing',title:'Unit 2 — Agribusiness Communication & Marketing',icon:'📣',bg:'#e8f5e2',desc:'Markets, marketing principles, sales strategies, and the components of an effective sales process.',status:'available',lessons:3},
      {id:'g10-agribusiness-startup',title:'Unit 3 — Starting Up an Agribusiness',icon:'🚀',bg:'#fdf3d6',desc:'How to obtain start-up capital, manage it, and launch a farming business.',status:'available',lessons:3},
    ]
  },
];

const POSTS = [
  {title:'What is Soil and Why Does It Matter?',cat:'Grade 9 — Crops',icon:'🌱',bg:'#e8f5e2',date:'May 5, 2026',read:'5 min',ex:'Soil is much more than dirt. It is a living system that determines whether crops will thrive or fail. Understanding soil composition, physical properties, and chemical properties is a foundation for all crop farming.',id:'g9-soil-formation',grade:9,ref:'https://www.fao.org/soils-portal/en/',refLabel:'FAO Soils Portal'},
  {title:'Monogastric vs Polygastric Animals — What is the Difference?',cat:'Grade 9 — Animals',icon:'🐷',bg:'#f5ece4',date:'Apr 22, 2026',read:'4 min',ex:'Pigs and cattle are both farm animals — but their digestive systems are completely different. Understanding the distinction between monogastric and polygastric animals is essential for Grade 9 Animal Science.',id:'g9-monogastric-polygastric',grade:9,ref:'https://www.fao.org/animal-production/en/',refLabel:'FAO Animal Production'},
  {title:'An Introduction to Aquaculture in Papua New Guinea',cat:'Grade 9 — Aquaculture',icon:'🐟',bg:'#e0f2fe',date:'Apr 10, 2026',read:'5 min',ex:'Papua New Guinea has some of the richest aquatic environments in the world. Aquaculture — the farming of fish and aquatic plants — is a growing industry that plays an important role in food security.',id:'g9-intro-aquaculture',grade:9,ref:'https://www.fao.org/fishery/en/aquaculture',refLabel:'FAO Aquaculture'},
  {title:'Soil Improvement — Natural vs Artificial Techniques',cat:'Grade 10 — Crops',icon:'🌿',bg:'#dcfce7',date:'Mar 28, 2026',read:'5 min',ex:'Grade 10 students go beyond understanding soil — they need to know how to improve it. From composting and green manuring to lime application and inorganic fertilisers, soil improvement is central to sustainable crop farming.',id:'g10-soil-improvement',grade:10,ref:'https://www.fao.org/soils-portal/soil-management/en/',refLabel:'FAO Soil Management'},
  {title:'What is Agribusiness? A Plain Language Guide',cat:'Grade 9 & 10 — Agribusiness',icon:'📊',bg:'#fdf3d6',date:'Mar 14, 2026',read:'4 min',ex:'Agribusiness is not just farming — it covers everything from production to marketing to finance. This guide explains economic principles, supply and demand, and how they apply to farming businesses in Papua New Guinea.',id:'g9-agribusiness-economics',grade:9,ref:'https://www.fao.org/rural-employment/en/',refLabel:'FAO Agribusiness Resources'},
  {title:'Forest Types in Papua New Guinea',cat:'Grade 9 — Natural Resources',icon:'🌳',bg:'#dcfce7',date:'Feb 28, 2026',read:'5 min',ex:"Papua New Guinea is home to some of the world\'s most biodiverse forests. This article covers the major forest types — tropical rainforest, monsoon forest, mangrove, and grassland — and the resources each provides.",id:'g9-forests',grade:9,ref:'https://www.fao.org/forestry/en/',refLabel:'FAO Forestry'},
  {title:'Pomology, Olericulture & Ornamental Horticulture',cat:'Grade 9 — Crops (Unit 6)',icon:'🌿',bg:'#e8f5e2',date:'Feb 14, 2026',read:'5 min',ex:'The horticulture industry covers three main areas: pomology (fruit growing), olericulture (vegetable growing), and ornamental horticulture. Each has distinct management practices, cultivation techniques, and markets.',id:'g9-pomology-olericulture',grade:9,ref:'https://www.fao.org/horticulture/en/',refLabel:'FAO Horticulture'},
  {title:'Technology in Horticulture Production',cat:'Grade 9 — Crops (Unit 7)',icon:'💡',bg:'#e0f2fe',date:'Jan 30, 2026',read:'4 min',ex:'Technology is changing how horticulture products are grown, preserved, and marketed in Papua New Guinea — from irrigation systems and pest control to E-Commerce and digital marketing tools for small farmers.',id:'g9-horticulture-technology',grade:9,ref:'https://www.fao.org/digital-agriculture/en/',refLabel:'FAO Digital Agriculture'},
];

const TAGS = ['Soil Science','Crops','Horticulture','Farm Animals','Aquaculture','Forestry','Agribusiness','Grade 9','Grade 10','PNG Agriculture','Poultry','Fish Farming'];

/* ══════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════ */
// Redundant SPA navigation function removed.
// Standard <a> links are used in HTML templates.

function setGradeMPA(g){
  window.location.href = `/topics.html?grade=${g}`;
}

/* ══════════════════════════════════════════
   MODULES & BLOG RENDERING
   ══════════════════════════════════════════ */
function filterGrade(g){
  currentGrade = g;
  document.querySelectorAll('.grade-tab').forEach(t=>t.classList.toggle('active',+t.dataset.grade===g));
  renderModules(g);
}

function renderModules(grade){
  const strands = grade===9 ? STRANDS_9 : STRANDS_10;
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
          <article class="topic-card${t.status==='coming'?' locked':''}">
            ${t.status==='available'&&t.id ? `<a href="/lessons/${t.id}.html" style="display:block">` : ''}
            <div class="tc-thumb" style="background:${t.bg}">
              ${t.icon}
              <span class="tc-status ${t.status}">${t.status==='available'?'Available':'In Progress'}</span>
            </div>
            <div class="tc-body">
              <h3>${t.title}</h3>
              <p>${t.desc}</p>
            </div>
            <div class="tc-foot">
              <div class="tc-meta">📖 ${t.lessons} lessons</div>
              ${t.status==='available'&&t.id
                ? `<span class="tc-btn">Start →</span>`
                : `<button class="tc-btn locked-btn" disabled>In Progress</button>`}
            </div>
            ${t.status==='available'&&t.id ? `</a>` : ''}
          </article>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderBlogPreview(){
  const g = document.getElementById('blog-preview');
  if(!g) return;
  g.innerHTML = POSTS.slice(0,3).map(p=>`
    <article class="topic-card">
      <a href="/lessons/${p.id}.html" style="display:block">
        <div class="tc-thumb" style="background:${p.bg}">${p.icon}</div>
        <div class="tc-body">
          <div class="blog-meta"><span class="chip">${p.cat}</span><span style="font-size:.7rem;color:var(--ink3)">${p.read} read</span></div>
          <h3>${p.title}</h3>
          <p>${p.ex.slice(0,100)}…</p>
          <span class="blog-read">Read →</span>
        </div>
      </a>
    </article>
  `).join('');
}

function renderBlogFull(){
  const g = document.getElementById('blog-main');
  if(!g) return;
  g.innerHTML = POSTS.map(p=>`
    <article class="blc">
      <a href="/lessons/${p.id}.html" style="display:grid;grid-template-columns:inherit;overflow:inherit">
        <div class="blc-thumb" style="background:${p.bg}">${p.icon}</div>
        <div class="blc-body">
          <div class="blog-meta"><span class="chip">${p.cat}</span><span style="font-size:.7rem;color:var(--ink3)">${p.date}</span><span style="font-size:.7rem;color:var(--ink3)">${p.read} read</span></div>
          <h3>${p.title}</h3>
          <p>${p.ex}</p>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px">
            <span class="blog-read">Read lesson →</span>
          </div>
        </div>
      </a>
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
  [...STRANDS_9,...STRANDS_10].forEach(s=>{
    s.topics.filter(t=>t.status==='available'&&t.id).forEach(t=>{
      items.push({id:t.id,title:t.title,meta:`Grade ${s.id.includes('10')?10:9} · ${s.strand}: ${s.name}`,icon:t.icon,grade:s.id.includes('10')?10:9});
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
    <a href="/lessons/${r.id}.html" class="sri">
      <div class="sri-ic">${r.icon}</div>
      <div><div class="sri-t">${r.title}</div><div class="sri-m">Grade ${r.grade} · ${r.meta.split('·')[1]||''}</div></div>
    </a>
  `).join('');
});

document.getElementById('s-results').innerHTML = SEARCH_INDEX.slice(0,5).map(r=>`
  <a href="/lessons/${r.id}.html" class="sri">
    <div class="sri-ic">${r.icon}</div>
    <div><div class="sri-t">${r.title}</div><div class="sri-m">Grade ${r.grade}</div></div>
  </a>
`).join('');

document.getElementById('search-trigger').addEventListener('click',()=>{
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(()=>document.getElementById('search-input').focus(),100);
});
document.getElementById('search-close').addEventListener('click',closeSearch);
document.getElementById('search-overlay').addEventListener('click',e=>{ if(e.target.id==='search-overlay') closeSearch(); });
function closeSearch(){ document.getElementById('search-overlay').classList.remove('open'); }

/* ══════════════════════════════════════════
   UI HELPERS
   ══════════════════════════════════════════ */
const ham = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
if(ham && drawer) {
    ham.addEventListener('click',()=>{
        ham.classList.toggle('open');
        drawer.classList.toggle('open');
        ham.setAttribute('aria-expanded', drawer.classList.contains('open'));
    });
}
function closeDrawer(){
    if(ham) ham.classList.remove('open');
    if(drawer) drawer.classList.remove('open');
    if(ham) ham.setAttribute('aria-expanded','false');
}

function filterCareers(strand, btn){
  document.querySelectorAll('#career-filter .cf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#career-grid .career-card').forEach(card => {
    card.style.display = (strand === 'all' || card.dataset.strand === strand) ? '' : 'none';
  });
}

let dark=false;
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
    themeToggle.addEventListener('click',()=>{
        dark=!dark;
        document.documentElement.setAttribute('data-theme',dark?'dark':'light');
        document.getElementById('t-icon').textContent=dark?'☀️':'🌙';
        document.getElementById('t-lbl').textContent=dark?'Light':'Dark';
    });
}

window.addEventListener('scroll',()=>{
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('back-top');
  if(navbar) navbar.classList.toggle('scrolled',window.scrollY>20);
  if(backTop) backTop.classList.toggle('visible',window.scrollY>300);
},{ passive: true });

document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeSearch(); closeDrawer(); } });
const announceClose = document.getElementById('announce-close');
if(announceClose) {
    announceClose.addEventListener('click',()=>document.getElementById('announce-bar').style.display='none');
}

function toast(ic,msg){
  const t_ic = document.getElementById('t-ic2');
  const t_msg = document.getElementById('t-msg2');
  const t = document.getElementById('toast');
  if(t_ic) t_ic.textContent=ic;
  if(t_msg) t_msg.textContent=msg;
  if(t) {
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),3200);
  }
}

function backToTop(){
  try{ window.scrollTo({top:0,behavior:'smooth'}); }
  catch(e){ document.documentElement.scrollTop=0; document.body.scrollTop=0; }
}

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
}

/* ══════════════════════════════════════════
   LESSON QUIZ LOGIC
   ══════════════════════════════════════════ */
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
    resultEl.className = 'quiz-result ' + (pct >= 60 ? 'pass' : 'fail');
    resultEl.innerHTML = pct >= 60 ? `✅ Great work! You scored ${correct}/${total} (${pct}%). Well done!` : `You scored ${correct}/${total} (${pct}%). Review the content and try again.`;
    resultEl.style.display = 'block';
    const submitBtn = document.getElementById('quiz-submit-btn');
    if(submitBtn) submitBtn.style.display = 'none';
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
(function initMPA() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html') || path === '') {
        renderBlogPreview();
    } else if (path.includes('topics.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const grade = parseInt(urlParams.get('grade')) || 9;
        filterGrade(grade);
    } else if (path.includes('resources.html')) {
        renderBlogFull();
    }
    initReveal();
})();
