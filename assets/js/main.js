/* ══════════════════════════════════════════
   DATA — from PNG Agriculture Teacher Guides
   ══════════════════════════════════════════ */

// LESSONS data moved to lesson-data.js
const STRANDS_9 = [
  {
    id:'crops9', strand:'Strand 1', name:'Crops', icon:'', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil science, crop types, farming practices, horticulture, and technology used in crop production.',
    topics:[
      {id:'g9-soil-formation',title:'Unit 1 — Soil: Types & Formation',icon:'',bg:'#e8f5e2',desc:'What soil is made of, how it forms, and the physical and chemical properties of different soil types.',status:'available',lessons:4},
      {id:'g9-types-crops',title:'Unit 2 — Types of Crops & Their Environments',icon:'',bg:'#fdf3d6',desc:'The different types of crops, where they grow best, and the environmental conditions they need.',status:'available',lessons:3},
      {id:'g9-crop-farming',title:'Unit 3 — Crop Farming Practices & Management',icon:'',bg:'#e8f5e2',desc:'How crops are planted, managed, and harvested — different farming methods and crop management systems.',status:'available',lessons:3},
      {id:'g9-crop-technology',title:'Unit 4 — Crop Farming Technology',icon:'',bg:'#e0f2fe',desc:'The tools and technologies used in crop cultivation and management — and the advantages and disadvantages.',status:'available',lessons:3},
      {id:'g9-horticulture',title:'Unit 5 — Types of Plants: Introduction to Horticulture',icon:'',bg:'#fdf3d6',desc:'Introduction to horticulture: fruit trees, vegetables, and spice crops — how they are cultivated and processed.',status:'available',lessons:4},
      {id:'g9-pomology-olericulture',title:'Unit 6 — Plant Farming Practices (Pomology & Olericulture)',icon:'',bg:'#e8f5e2',desc:'Cultivation and management of pomology (fruit growing), olericulture (vegetable growing), ornamental plants, and arboriculture.',status:'available',lessons:4},
      {id:'g9-horticulture-technology',title:'Unit 7 — Technology in Horticulture',icon:'',bg:'#e0f2fe',desc:'How technology is used to improve cultivation, processing, and marketing of horticulture plants.',status:'available',lessons:3},
    ]
  },
  {
    id:'animals9', strand:'Strand 2', name:'Animals', icon:'', bg:'#f5ece4', color:'#7c4a1e',
    desc:'Monogastric and polygastric animals, their characteristics, care, poultry farming, and management systems.',
    topics:[
      {id:'g9-monogastric-polygastric',title:'Unit 1 — Monogastric & Polygastric Animals',icon:'',bg:'#f5ece4',desc:'What monogastric animals and polygastric (ruminant) animals are — and how they differ.',status:'available',lessons:3},
      {id:'g9-animal-anatomy',title:'Unit 2 — Anatomy of Farm Animals',icon:'',bg:'#e8f5e2',desc:'The body systems of monogastric and polygastric animals — how their digestive systems work.',status:'available',lessons:3},
      {id:'g9-animal-farming',title:'Unit 3 — Animal Farming Practices & Management',icon:'',bg:'#fdf3d6',desc:'How farm animals are housed, fed, and cared for — extensive, semi-intensive, and intensive systems.',status:'available',lessons:4},
      {id:'g9-poultry-types',title:'Unit 4 — Types of Poultry & Their Behaviour',icon:'',bg:'#f5ece4',desc:'Domesticated and farmed birds — their characteristics, behaviours, purposes, and how they are kept.',status:'available',lessons:3},
      {id:'g9-poultry-farming',title:'Unit 5 — Poultry Farming Principles & Systems',icon:'',bg:'#e8f5e2',desc:'Free-range, semi-intensive, and intensive poultry systems and how each is practised.',status:'available',lessons:3},
    ]
  },
  {
    id:'aqua9', strand:'Strand 3', name:'Aquaculture', icon:'', bg:'#e0f2fe', color:'#0369a1',
    desc:'Fish farming in freshwater, brackish, and saltwater environments. Aqua farming practices and technology.',
    topics:[
      {id:'g9-intro-aquaculture',title:'Unit 1 — Introduction to Aquaculture',icon:'',bg:'#e0f2fe',desc:'What aquaculture is, why it matters in Papua New Guinea, and the types of environments.',status:'available',lessons:3},
      {id:'g9-aqua-farming-systems',title:'Unit 2 — Aqua Farming Systems & Practices',icon:'',bg:'#e8f5e2',desc:'How fish and aquatic plants are farmed in freshwater, brackish, and saltwater environments.',status:'available',lessons:4},
      {id:'g9-aqua-technology',title:'Unit 3 — Gears & Technology in Aqua Farming',icon:'',bg:'#e0f2fe',desc:'The equipment and technology used in aquaculture — and how technology improves fish farming.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm9', strand:'Strand 4', name:'Natural Resource Management', icon:'', bg:'#dcfce7', color:'#16a34a',
    desc:'Forestry, forest types, land management, sustainable harvesting practices, and resource protection.',
    topics:[
      {id:'g9-forests',title:'Unit 1 — Types of Forests & Forest Resources',icon:'',bg:'#dcfce7',desc:'The different types of forests in Papua New Guinea, their characteristics, and the resources they provide.',status:'available',lessons:3},
      {id:'g9-forest-harvesting',title:'Unit 2 — Forest Harvesting Practices',icon:'',bg:'#fdf3d6',desc:'Selective cutting, clear cutting, and strip cutting — how timber is harvested and the environmental consequences.',status:'available',lessons:3},
      {id:'g9-forest-management',title:'Unit 3 — Forest Management & Conservation',icon:'',bg:'#dcfce7',desc:'How forests are managed sustainably and the importance of protecting forest ecosystems.',status:'available',lessons:3},
      {id:'g9-forestry-technology',title:'Unit 4 — Forestry Technology',icon:'',bg:'#e0f2fe',desc:'The tools and technologies used in forest harvesting — and their strengths and weaknesses.',status:'available',lessons:2},
    ]
  },
  {
    id:'agri9', strand:'Strand 5', name:'Agribusiness', icon:'', bg:'#fdf3d6', color:'#c8900a',
    desc:'Starting and managing an agricultural business — economics, imports and exports, and business planning.',
    topics:[
      {id:'g9-agribusiness-economics',title:'Unit 1 — Economic Principles in Agribusiness',icon:'',bg:'#fdf3d6',desc:'What agribusiness is and how micro and macroeconomic principles apply to farming businesses.',status:'available',lessons:3},
      {id:'g9-agri-imports-exports',title:'Unit 2 — Agricultural Imports & Exports',icon:'',bg:'#e8f5e2',desc:'The role of imports and exports in Papua New Guinea — how global trade affects local farming.',status:'available',lessons:3},
      {id:'g9-agribusiness-planning',title:'Unit 3 — Planning & Managing an Agribusiness',icon:'',bg:'#fdf3d6',desc:'Entrepreneurship, types of business ownership, and how to write a basic agribusiness plan.',status:'available',lessons:4},
    ]
  },
];

const STRANDS_10 = [
  {
    id:'crops10', strand:'Strand 1', name:'Crops', icon:'', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil improvement, crop classification, crop management systems, plant propagation technology, and horticulture.',
    topics:[
      {id:'g10-soil-improvement',title:'Unit 1 — Soil Improvement Practices',icon:'',bg:'#e8f5e2',desc:'Natural and artificial techniques to improve soil — and strategies to sustain soil fertility over time.',status:'available',lessons:3},
      {id:'g10-crop-classification',title:'Unit 2 — Crop Classification',icon:'',bg:'#fdf3d6',desc:'How crops are classified by growing cycle, species, season, land type, and type of product.',status:'available',lessons:3},
      {id:'g10-crop-management',title:'Unit 3 — Crop Management Systems & Practices',icon:'',bg:'#e8f5e2',desc:'Different crop management systems used in various contexts and principles of effective crop cultivation.',status:'available',lessons:4},
      {id:'g10-plant-propagation',title:'Unit 4 — Plant Propagation Technology',icon:'',bg:'#e0f2fe',desc:'How technology improves plant propagation — and its impact on plant anatomy and physiology.',status:'available',lessons:3},
      {id:'g10-types-plants',title:'Unit 5 — Types of Agricultural Plants',icon:'',bg:'#f5ece4',desc:'Plantation crops, ornamental plants, and bedding plants — benefits, functions, and classification.',status:'available',lessons:3},
      {id:'g10-ornamental-cultivation',title:'Unit 6 — Cultivation of Ornamental & Bedding Plants',icon:'',bg:'#fce7f3',desc:'How ornamental and bedding plants are cultivated, processed, and marketed.',status:'available',lessons:3},
      {id:'g10-horticulture-tech',title:'Unit 7 — Technology in Horticulture Production',icon:'',bg:'#e0f2fe',desc:'Post-harvest technology, processing, packaging, transportation, and marketing.',status:'available',lessons:3},
    ]
  },
  {
    id:'animals10', strand:'Strand 2', name:'Animals', icon:'', bg:'#f5ece4', color:'#7c4a1e',
    desc:'Animal breeds and physiology, husbandry, post-harvest technology, and online marketing of animal products.',
    topics:[
      {id:'g10-animal-breeds',title:'Unit 1 — Breeds of Monogastric & Polygastric Animals',icon:'',bg:'#f5ece4',desc:'Classification of pig, goat, sheep, and cattle breeds — their characteristics and purposes.',status:'available',lessons:4},
      {id:'g10-animal-physiology',title:'Unit 2 — Animal Physiology: Digestive & Reproductive Systems',icon:'',bg:'#e8f5e2',desc:'How digestive and reproductive systems of farm animals work — including the oestrous cycle.',status:'available',lessons:4},
      {id:'g10-animal-husbandry',title:'Unit 3 — Animal Husbandry & Management Practices',icon:'',bg:'#fdf3d6',desc:'Extensive, semi-intensive, and intensive management systems and day-to-day husbandry.',status:'available',lessons:4},
      {id:'g10-animal-nutrition',title:'Unit 4 — Animal Nutrition, Feeding & Health',icon:'',bg:'#e8f5e2',desc:'How animals are fed, grazing land management, and how animal health and housing are maintained.',status:'available',lessons:3},
      {id:'g10-animal-postharvest',title:'Unit 5 — Post-Harvest Processing of Animal Products',icon:'',bg:'#f5ece4',desc:'Technology used to process, preserve, and package animal products.',status:'available',lessons:3},
      {id:'g10-poultry-management',title:'Unit 6 — Poultry Breeds, Management & Technology',icon:'',bg:'#fdf3d6',desc:'Breeds of domesticated birds, poultry production systems, and technology impact.',status:'available',lessons:4},
    ]
  },
  {
    id:'aqua10', strand:'Strand 3', name:'Aquaculture', icon:'', bg:'#e0f2fe', color:'#0369a1',
    desc:'Freshwater, brackish, and saltwater aqua farming — systems, capture fishery, sustainability, and technology.',
    topics:[
      {id:'g10-aqua-environments',title:'Unit 1 — Freshwater, Brackish & Saltwater Farming',icon:'',bg:'#e0f2fe',desc:'How fish and aquatic plants are cultivated in different water environments.',status:'available',lessons:4},
      {id:'g10-aqua-management',title:'Unit 2 — Aqua Farming Management Systems',icon:'',bg:'#e8f5e2',desc:'Fish and aqua plant farming management systems and sustainable practices.',status:'available',lessons:4},
      {id:'g10-capture-fishery',title:'Unit 3 — Capture Fishery: Harvesting & Management',icon:'',bg:'#e0f2fe',desc:'How capture fish and other aquatic organisms are harvested and managed.',status:'available',lessons:3},
      {id:'g10-aqua-tech',title:'Unit 4 — Technology in Aquaculture & Capture Fishery',icon:'',bg:'#fdf3d6',desc:'Technology for farming, harvesting, processing, and preserving fish.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm10', strand:'Strand 4', name:'Natural Resource Management', icon:'', bg:'#dcfce7', color:'#16a34a',
    desc:'Tropical forestry, forest management, regulation and monitoring, preservation technology.',
    topics:[
      {id:'g10-forests-types',title:'Unit 1 — Tropical Forests & Their Characteristics',icon:'',bg:'#dcfce7',desc:'Types of tropical forests in PNG — farm forestry, agroforestry, community forestry, and silviculture.',status:'available',lessons:3},
      {id:'g10-forest-management',title:'Unit 2 — Forest Management & Monitoring Systems',icon:'',bg:'#e8f5e2',desc:'Sustainable forest management — ecosystem approach, regulations, and monitoring practices.',status:'available',lessons:3},
      {id:'g10-forest-conservation',title:'Unit 3 — Preserving & Sustaining Forests',icon:'',bg:'#dcfce7',desc:'Why forest preservation matters and the ways forests can be sustained.',status:'available',lessons:3},
      {id:'g10-forestry-tech',title:'Unit 4 — Forestry Technology: Harvesting & Processing',icon:'',bg:'#e0f2fe',desc:'Technology for monitoring, preserving, processing, and marketing forestry products.',status:'available',lessons:2},
    ]
  },
  {
    id:'agri10', strand:'Strand 5', name:'Agribusiness', icon:'', bg:'#fdf3d6', color:'#c8900a',
    desc:'Risk management, marketing strategies, sales, and obtaining and managing start-up capital.',
    topics:[
      {id:'g10-agribusiness-risk',title:'Unit 1 — Managing Risk in Agribusiness',icon:'',bg:'#fdf3d6',desc:'Sources of risk and uncertainty in farming businesses — and strategies to manage and reduce them.',status:'available',lessons:3},
      {id:'g10-agribusiness-marketing',title:'Unit 2 — Agribusiness Communication & Marketing',icon:'',bg:'#e8f5e2',desc:'Markets, marketing principles, sales strategies, and the components of an effective sales process.',status:'available',lessons:3},
      {id:'g10-agribusiness-startup',title:'Unit 3 — Starting Up an Agribusiness',icon:'',bg:'#fdf3d6',desc:'How to obtain start-up capital, manage it, and launch a farming business.',status:'available',lessons:3},
    ]
  },
];

/* ══════════════════════════════════════════
   GRADE 11 STRAND DATA
   ══════════════════════════════════════════ */
const STRANDS_11 = [
  {
    id:'crops11', strand:'Strand 1', name:'Crops', icon:'', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil nutrients, biennial crops, crop protection, aromatic & herbal plants, and horticulture technology.',
    topics:[
      {id:'g11-soil-nutrients',title:'Unit 1 — Soil Nutrients: Macro & Micro',icon:'',bg:'#e8f5e2',desc:'What macro and micro nutrients are, their deficiency signs, and how they affect crop growth.',status:'available',lessons:2},
      {id:'g11-biennial-crops',title:'Unit 2 — Biennial Crops & Crop Protection',icon:'',bg:'#fdf3d6',desc:'Characteristics of biennial crops, crop pest management, and principles of crop protection.',status:'available',lessons:3},
      {id:'g11-aromatic-plants',title:'Units 5–6 — Aromatic & Herbal Plants',icon:'',bg:'#e8f5e2',desc:'Types, characteristics, cultivation, propagation, and preservation of aromatic and herbal plants.',status:'available',lessons:4},
      {id:'g11-horticulture-tech',title:'Unit 7 — Horticulture Technology & Constraints',icon:'',bg:'#e0f2fe',desc:'Technology for mass-producing horticulture plants and constraints in cultivation and marketing.',status:'available',lessons:2},
    ]
  },
  {
    id:'animals11', strand:'Strand 2', name:'Animals', icon:'', bg:'#fdf3d6', color:'#c8900a',
    desc:'Apiculture (beekeeping), livestock management, animal farming technology, and poultry production.',
    topics:[
      {id:'g11-apiculture',title:'Unit 1 — Apiculture: Beekeeping in PNG',icon:'',bg:'#fdf3d6',desc:'What apiculture is, purposes of beekeeping, cultivation practices, and management systems.',status:'available',lessons:3},
      {id:'g11-livestock-management',title:'Unit 2 — Livestock Management & Husbandry',icon:'',bg:'#f5ece4',desc:'Feeding regimes, grazing land tenure, herding arrangements, and mass production husbandry practices.',status:'available',lessons:3},
      {id:'g11-poultry-processing',title:'Units 5–6 — Poultry Processing, Regulation & Technology',icon:'',bg:'#e8f5e2',desc:'Processing and preserving bird products, poultry regulations, and technology in poultry farming.',status:'available',lessons:3},
    ]
  },
  {
    id:'aqua11', strand:'Strand 3', name:'Aquaculture', icon:'', bg:'#e0f2fe', color:'#0369a1',
    desc:'Fish species in different water environments, aquaculture production factors, and fisheries regulations.',
    topics:[
      {id:'g11-fish-species',title:'Unit 1 — Fish Species & Cultivation Environments',icon:'',bg:'#e0f2fe',desc:'Types of fish species in freshwater, brackish, and saltwater, and how they are cultivated.',status:'available',lessons:2},
      {id:'g11-aqua-marketing',title:'Unit 2 — Aquaculture Production, Marketing & Regulations',icon:'',bg:'#e8f5e2',desc:'Factors affecting aquaculture production, fish markets, price determination, and fisheries regulations.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm11', strand:'Strand 4', name:'Natural Resource Management', icon:'', bg:'#dcfce7', color:'#16a34a',
    desc:'Capture fishery, forest products, forestry regulations, and technology in growing timber species.',
    topics:[
      {id:'g11-capture-fishery',title:'Units 1–3 — Capture Fishery: Cultivation & Regulations',icon:'',bg:'#dcfce7',desc:'Capture fishery environments, fisheries management, and PNG fisheries laws and regulations.',status:'available',lessons:3},
      {id:'g11-forest-products',title:'Units 4–6 — Forest Products, Regulations & Technology',icon:'',bg:'#e8f5e2',desc:'Forest products, preservation of forest resources, PNG forestry regulations, and technology in timber growing.',status:'available',lessons:3},
    ]
  },
  {
    id:'agri11', strand:'Strand 5', name:'Agribusiness', icon:'', bg:'#fdf3d6', color:'#c8900a',
    desc:'Financial management, credit organisations, debt vs equity financing, and cash flow statements.',
    topics:[
      {id:'g11-financial-management',title:'Unit 1 — Financial Management & Business Records',icon:'',bg:'#fdf3d6',desc:'Financial management principles, importance of business records, and the role of the balance sheet.',status:'available',lessons:2},
      {id:'g11-credit-financing',title:'Unit 1 — Credit Organisations & Financing',icon:'',bg:'#e8f5e2',desc:'Formal and informal credit markets, debt financing, equity financing, and their impact on agribusiness.',status:'available',lessons:2},
      {id:'g11-financial-statements',title:'Unit 1 — Financial Statements & Cash Flow',icon:'',bg:'#fdf3d6',desc:'Types of financial statements, cash flow analysis, and the difference between profitability and liquidity.',status:'available',lessons:2},
    ]
  },
];

/* ══════════════════════════════════════════
   GRADE 12 STRAND DATA
   ══════════════════════════════════════════ */
const STRANDS_12 = [
  {
    id:'crops12', strand:'Strand 1', name:'Crops', icon:'', bg:'#e8f5e2', color:'#3a7d2c',
    desc:'Soil topography, crop physiology, crop marketing and regulation, and horticulture commercialisation.',
    topics:[
      {id:'g12-soil-topography',title:'Unit 1 — Soil Topography & Crop Production Returns',icon:'',bg:'#e8f5e2',desc:'Soil topography, soil analysis, pH testing, soil types and their effect on crop yields.',status:'available',lessons:2},
      {id:'g12-crop-physiology',title:'Units 2–3 — Crop Physiology & Farming Practices',icon:'',bg:'#fdf3d6',desc:'Photosynthesis, respiration, plant hormones, photo-morphogenesis, and crop marketing and regulation.',status:'available',lessons:3},
      {id:'g12-horticulture-commercialisation',title:'Units 5–7 — Plants, Horticulture & Commercialisation',icon:'',bg:'#e0f2fe',desc:'Plant anatomy and physiology, horticulture marketing systems, greenhouse cultivation, and genetic engineering.',status:'available',lessons:3},
    ]
  },
  {
    id:'animals12', strand:'Strand 2', name:'Animals', icon:'', bg:'#f5ece4', color:'#7c4a1e',
    desc:'Quality animal and apiculture products, value-added products, trends in animal agriculture, and poultry planning.',
    topics:[
      {id:'g12-quality-animal-products',title:'Units 1–3 — Quality Animal Products & Technology',icon:'',bg:'#f5ece4',desc:'Factors for quality monogastric, polygastric, and apiculture products, value-added products, and electronic agriculture.',status:'available',lessons:3},
      {id:'g12-poultry-project',title:'Units 4–5 — Bird Anatomy & Planning a Poultry Project',icon:'',bg:'#fdf3d6',desc:'Bird anatomy and physiology, and step-by-step planning and management of a poultry project.',status:'available',lessons:3},
    ]
  },
  {
    id:'aqua12', strand:'Strand 3', name:'Aquaculture', icon:'', bg:'#e0f2fe', color:'#0369a1',
    desc:'Advanced aqua farming systems, post-harvest technology, and global trading of aquaculture products.',
    topics:[
      {id:'g12-aqua-advanced',title:'Units 1–3 — Advanced Aqua Farming & Post-Harvest Technology',icon:'',bg:'#e0f2fe',desc:'Advanced aqua farming systems, post-harvest handling and processing, and global aquaculture trade.',status:'available',lessons:3},
    ]
  },
  {
    id:'nrm12', strand:'Strand 4', name:'Natural Resource Management', icon:'', bg:'#dcfce7', color:'#16a34a',
    desc:'Forestry products processing, silviculture, land tenure, plantation establishment, and sawmilling.',
    topics:[
      {id:'g12-forestry-processing',title:'Units 4–6 — Forestry Processing, Silviculture & Technology',icon:'',bg:'#dcfce7',desc:'Processing forest products, nursery and plantation establishment, sawmilling, silviculture, and GIS technology.',status:'available',lessons:3},
    ]
  },
  {
    id:'agri12', strand:'Strand 5', name:'Agribusiness', icon:'', bg:'#fdf3d6', color:'#c8900a',
    desc:'Advanced financial statements, cash flow management, capital acquisition, and agribusiness growth strategies.',
    topics:[
      {id:'g12-advanced-finance',title:'Unit 1 — Advanced Agribusiness Finance & Capital',icon:'',bg:'#fdf3d6',desc:'Advanced financial analysis, capital management, debt management, and preparing detailed financial statements.',status:'available',lessons:3},
    ]
  },
];

const POSTS = [
  {title:'What is Soil and Why Does It Matter?',cat:'Grade 9 — Crops',icon:'',bg:'#e8f5e2',date:'May 5, 2026',read:'5 min',ex:'Soil is much more than dirt. It is a living system that determines whether crops will thrive or fail. Understanding soil composition, physical properties, and chemical properties is a foundation for all crop farming.',id:'g9-soil-formation',grade:9,ref:'https://www.fao.org/soils-portal/en/',refLabel:'FAO Soils Portal'},
  {title:'Monogastric vs Polygastric Animals — What is the Difference?',cat:'Grade 9 — Animals',icon:'',bg:'#f5ece4',date:'Apr 22, 2026',read:'4 min',ex:'Pigs and cattle are both farm animals — but their digestive systems are completely different. Understanding the distinction between monogastric and polygastric animals is essential for Grade 9 Animal Science.',id:'g9-monogastric-polygastric',grade:9,ref:'https://www.fao.org/animal-production/en/',refLabel:'FAO Animal Production'},
  {title:'An Introduction to Aquaculture in Papua New Guinea',cat:'Grade 9 — Aquaculture',icon:'',bg:'#e0f2fe',date:'Apr 10, 2026',read:'5 min',ex:'Papua New Guinea has some of the richest aquatic environments in the world. Aquaculture — the farming of fish and aquatic plants — is a growing industry that plays an important role in food security.',id:'g9-intro-aquaculture',grade:9,ref:'https://www.fao.org/fishery/en/aquaculture',refLabel:'FAO Aquaculture'},
  {title:'Soil Improvement — Natural vs Artificial Techniques',cat:'Grade 10 — Crops',icon:'',bg:'#dcfce7',date:'Mar 28, 2026',read:'5 min',ex:'Grade 10 students go beyond understanding soil — they need to know how to improve it. From composting and green manuring to lime application and inorganic fertilisers, soil improvement is central to sustainable crop farming.',id:'g10-soil-improvement',grade:10,ref:'https://www.fao.org/soils-portal/soil-management/en/',refLabel:'FAO Soil Management'},
  {title:'What is Agribusiness? A Plain Language Guide',cat:'Grade 9–12 — Agribusiness',icon:'',bg:'#fdf3d6',date:'Mar 14, 2026',read:'4 min',ex:'Agribusiness is not just farming — it covers everything from production to marketing to finance. This guide explains economic principles, supply and demand, and how they apply to farming businesses in Papua New Guinea.',id:'g9-agribusiness-economics',grade:9,ref:'https://www.fao.org/rural-employment/en/',refLabel:'FAO Agribusiness Resources'},
  {title:'Forest Types in Papua New Guinea',cat:'Grade 9 — Natural Resources',icon:'',bg:'#dcfce7',date:'Feb 28, 2026',read:'5 min',ex:"Papua New Guinea is home to some of the world\'s most biodiverse forests. This article covers the major forest types — tropical rainforest, monsoon forest, mangrove, and grassland — and the resources each provides.",id:'g9-forests',grade:9,ref:'https://www.fao.org/forestry/en/',refLabel:'FAO Forestry'},
  {title:'Pomology, Olericulture & Ornamental Horticulture',cat:'Grade 9 — Crops (Unit 6)',icon:'',bg:'#e8f5e2',date:'Feb 14, 2026',read:'5 min',ex:'The horticulture industry covers three main areas: pomology (fruit growing), olericulture (vegetable growing), and ornamental horticulture. Each has distinct management practices, cultivation techniques, and markets.',id:'g9-pomology-olericulture',grade:9,ref:'https://www.fao.org/horticulture/en/',refLabel:'FAO Horticulture'},
  {title:'Technology in Horticulture Production',cat:'Grade 9 — Crops (Unit 7)',icon:'',bg:'#e0f2fe',date:'Jan 30, 2026',read:'4 min',ex:'Technology is changing how horticulture products are grown, preserved, and marketed in Papua New Guinea — from irrigation systems and pest control to E-Commerce and digital marketing tools for small farmers.',id:'g9-horticulture-technology',grade:9,ref:'https://www.fao.org/digital-agriculture/en/',refLabel:'FAO Digital Agriculture'},
];

const TAGS = ['Soil Science','Crops','Horticulture','Farm Animals','Aquaculture','Forestry','Agribusiness','Grade 9','Grade 10','Grade 11','Grade 12','PNG Agriculture','Poultry','Fish Farming'];

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
let currentGrade = 9;
let currentLessonId = null;
let quizAnswers = {};
let quizSubmitted = false;

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
  const lesson = LESSONS[slug];
  const resultEl = document.getElementById('quiz-result');
  if(!lesson || !lesson.quiz){
    if(resultEl){ resultEl.textContent = 'Could not load quiz data for this lesson.'; resultEl.style.display='block'; }
    return;
  }

  const qEls = document.querySelectorAll('#quiz-section .quiz-q');
  let answered = 0, score = 0, missed = [];

  qEls.forEach((qEl, i) => {
    const correctIdx = lesson.quiz[i] ? lesson.quiz[i].ans : -1;
    const opts = qEl.querySelectorAll('.qopt');
    const checked = qEl.querySelector('input[type="radio"]:checked');
    const selectedIdx = checked ? parseInt(checked.value, 10) : -1;
    if(checked) answered++;
    if(selectedIdx === correctIdx){ score++; } else { missed.push(i+1); }

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
    if(pct >= 70) markComplete(slug);
    if(pct === 100) msg += ' Perfect score!';
    else if(pct >= 70) msg += ' Good job!';
    else msg += ' Review the lesson and try again.';
    resultEl.textContent = msg;
    resultEl.classList.remove('pass','fail');
    resultEl.classList.add(pct >= 70 ? 'pass' : 'fail');
    resultEl.style.display = 'block';

    const feedbackEl = document.getElementById('quiz-feedback');
    if(feedbackEl){
      if(pct === 100){
        feedbackEl.innerHTML = '🎉 Perfect! You got every question right.';
        feedbackEl.className = 'quiz-feedback pass';
      } else if(missed.length > 0){
        feedbackEl.innerHTML = '<strong>Review needed:</strong> Question' +
          (missed.length > 1 ? 's ' : ' ') +
          missed.map(n => '<span class="missed-q">Q'+n+'</span>').join(', ') +
          ' — re-read those sections before trying again.';
        feedbackEl.className = 'quiz-feedback fail';
      }
      feedbackEl.style.display = 'block';
    }
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
  const feedbackEl = document.getElementById('quiz-feedback');
  if(feedbackEl){ feedbackEl.style.display = 'none'; feedbackEl.className = 'quiz-feedback'; }
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
  // Keep the URL in sync so the current grade is shareable/bookmarkable,
  // without adding a history entry for every tab click.
  try{
    const url = new URL(window.location.href);
    url.searchParams.set('grade', g);
    window.history.replaceState({}, '', url);
  }catch(e){}
}

// On any page with a #modules-content element (i.e. topics.html), render
// the right grade on load -- reading ?grade= from the URL when present,
// since every "Grade X" link across the site points to
// /topics.html?grade=X and nothing was previously reading that param.
// Falls back to grade 9 (matching the default active tab) otherwise.
(function initModulesFromURL(){
  function run(){
    if(!document.getElementById('modules-content')) return;
    const params = new URLSearchParams(window.location.search);
    const requested = parseInt(params.get('grade'), 10);
    const grade = [9,10,11,12].includes(requested) ? requested : 9;
    filterGrade(grade);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

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
          <article class="topic-card" ${t.id?`onclick="window.location='/lessons/${t.id}.html'"`:''}>
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
    <article class="topic-card" style="cursor:pointer" onclick="window.location='/lessons/${p.id}.html'">
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
    <article class="blc" style="cursor:pointer" onclick="window.location='/lessons/${p.id}.html'">
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
    <div class="sri" onclick="window.location='/lessons/${r.id}.html';closeSearch()">
      <div class="sri-ic">${r.icon}</div>
      <div><div class="sri-t">${r.title}</div><div class="sri-m">Grade ${r.grade} · ${r.meta.split('·')[1]||''}</div></div>
    </div>
  `).join('');
});

// Populate default results
document.getElementById('s-results').innerHTML = SEARCH_INDEX.slice(0,5).map(r=>`
  <div class="sri" onclick="window.location='/lessons/${r.id}.html';closeSearch()">
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

/* ═══════════════════════════════════════════
   WHATSAPP STICKY CTA BANNER
   ═══════════════════════════════════════════ */
(function(){
  var WA_KEY = 'mxt_wa_banner_dismissed';
  function showBanner(){
    if(sessionStorage.getItem(WA_KEY)) return;
    var el = document.getElementById('wa-sticky-banner');
    if(el) el.classList.add('show');
  }
  function initBanner(){
    if(sessionStorage.getItem(WA_KEY)) return;
    var banner = document.createElement('div');
    banner.id = 'wa-sticky-banner';
    banner.setAttribute('role','complementary');
    banner.setAttribute('aria-label','Join MXT Lab on WhatsApp');
    banner.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
      + '<a href="https://whatsapp.com/channel/0029VbCWBUbBA1ezAlkfJ928" target="_blank" rel="noopener noreferrer">'
      + 'Get new lessons on WhatsApp<span class="wa-text-hide"> — Follow the MXT Lab channel</span> →'
      + '</a>'
      + '<button id="wa-sticky-close" aria-label="Close WhatsApp banner">✕</button>';
    document.body.appendChild(banner);
    document.getElementById('wa-sticky-close').addEventListener('click', function(){
      banner.classList.remove('show');
      try{ sessionStorage.setItem(WA_KEY,'1'); }catch(e){}
    });
    setTimeout(showBanner, 8000);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBanner);
  else initBanner();
})();
