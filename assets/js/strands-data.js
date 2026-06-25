/* ══════════════════════════════════════════
   MXT Lab — Strands & Posts Data
   ══════════════════════════════════════════ */

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
