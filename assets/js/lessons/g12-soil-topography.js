/* MXT Lab — lesson content for 'g12-soil-topography' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g12-soil-topography'] = {
  title: 'Soil Topography & Crop Production Returns',
  strand: 'Strand 1: Crops · Unit 1', grade: 12, icon: '',
  lessons: ['Soil Topography','Soil Analysis & Crop Production'],
  currentLesson: 0,
  objectives: [
    'Explain soil topography and its effect on soil formation and erosion',
    'Describe soil analysis, soil pH testing, and nutrient balance assessment',
    'Explain how soil type affects cultivation decisions and crop production returns'
  ],
  keyTerms: [
    {word:'Soil topography',def:'A detailed map of the surface features of the land — mountains, hills, creeks, valleys — and how these affect soil formation through erosion.'},
    {word:'Soil analysis',def:'A process to determine the amount of plant nutrients available in the soil.'},
    {word:'Soil pH',def:'Measure of acidity or alkalinity on a scale of 0–14 — most crops grow best between pH 6.0 and 7.0.'},
    {word:'Nutrient balance',def:'An assessment of the nutritional quality of soil and the ability of crops to cope with biotic and abiotic stresses.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Soil Topography</h2>
    <p>Soil topography is a detailed map of the land surface — including mountains, hills, creeks, and rivers. Topography significantly affects soil formation through <strong>erosion</strong>: soils on steep hillsides are shallow and less developed because erosion carries particles downslope. Flat, low-lying areas accumulate deep, fertile soils. Valley floors and flood plains are usually the most productive agricultural land.</p>
  </div>
  <div class="lesson-section">
    <h2>Soil Analysis</h2>
    <p>Soil analysis determines available plant nutrients. Key tests:</p>
    <ul>
      <li><strong>Soil pH test</strong> — most crops grow best between pH 6.0 and 7.0. Below 6, nutrients become less available; above 7, micronutrients can be locked up.</li>
      <li><strong>Nutrient balance test</strong> — determines the level of major and minor mineral elements.</li>
      <li><strong>Organic matter content</strong> — higher organic matter means better structure, water retention, and fertility.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Soil Types and Cultivation Decisions</h2>
    <ul>
      <li><strong>Sandy soils</strong> — minimise ground pressure; use deep tines for sub-soiling.</li>
      <li><strong>Silty soils</strong> — bed systems for vegetables; reduce tillage where possible.</li>
      <li><strong>Clay soils</strong> — minimal cultivation; reduced tillage with deep loosening every 3–4 years and mole draining every 4–7 years.</li>
      <li><strong>Loam soils</strong> — reduced cultivation suitable where free lime is present.</li>
      <li><strong>Peat soils</strong> — avoid excessive cultivation to prevent wind erosion of dry surface layers.</li>
    </ul>
  </div>`,
  summary: [
    'Soil topography studies surface features and their effect on soil formation and erosion',
    'Steep slopes have shallow, eroded soils; flat valleys have deeper, more fertile soils',
    'Soil analysis measures nutrient levels, pH, and organic matter content',
    'Most crops grow best between soil pH 6.0 and 7.0',
    'Cultivation decisions should match soil type — sandy, silty, clay, loam, and peat soils each need different approaches',
    'Crop production returns incorporate yield, fertiliser costs, and selling prices — all vary with soil type',
  ],
  quiz: [
    {q:'What is soil topography?', opts:['Chemical composition of soil nutrients','A detailed study of surface features and their effect on soil formation','The process of analysing soil pH levels','A method for predicting rainfall'], ans:1},
    {q:'What is the ideal pH range for most crops?', opts:['3.0–5.0','6.0–7.0','7.5–9.0','1.0–3.0'], ans:1},
    {q:'Why do hillside soils tend to be shallow?', opts:['Less rainfall','Different rock types','Erosion carries soil particles downslope','Dense forest prevents soil development'], ans:2},
    {q:'Which soil type requires minimal cultivation and mole draining every 4–7 years?', opts:['Sandy soil','Loam soil','Clay soil','Peat soil'], ans:2},
    {q:'What does a nutrient balance test determine?', opts:['Best crop varieties for the region','Level of mineral elements and soil ability to support growth under stress','Amount of rainfall needed per season','Number of insects living in the soil'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/soils-portal/soil-management/en/',label:'FAO Soil Management',desc:'FAO resources on soil topography, analysis, and fertility management.'},
  ]
};
