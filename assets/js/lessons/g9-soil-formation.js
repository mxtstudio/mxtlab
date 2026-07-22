/* MXT Lab — lesson content for 'g9-soil-formation' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g9-soil-formation'] = {
  title: 'Soil — Types & Formation',
  strand: 'Strand 1: Crops · Unit 1', grade: 9, icon: '',
  lessons: ['Soil Composition & Components','Physical Properties of Soil','Chemical Properties of Soil','Soil Types Summary'],
  currentLesson: 0,
  objectives: [
    'Describe the different types of soil and how soil is formed',
    'Identify and describe the different components of soil',
    'Classify soils based on their physical and chemical characteristics'
  ],
  content: `
  <div class="lesson-section">
    <h2>What is Soil?</h2>
    <p>Soil is the thin layer of material covering the earth's surface that supports plant life. All soils are different because of where and how they formed. Basically, soil is formed by the weathering or breakdown of rock on the upper layers of the solid earth — and this very rock is called the <strong>parent material</strong>.</p>
    <figure class="lesson-figure">
      <img src="Images/Crops.png" alt="Soil profile showing different layers from topsoil to bedrock" loading="lazy"/>
      <figcaption>A typical soil profile showing the distinct layers (horizons) from topsoil down to bedrock.</figcaption>
    </figure>
    <div class="fact-grid">
      <div class="fact-box"><div class="fact-n">45%</div><div class="fact-l">Mineral matter</div></div>
      <div class="fact-box"><div class="fact-n">25%</div><div class="fact-l">Water</div></div>
      <div class="fact-box"><div class="fact-n">25%</div><div class="fact-l">Air</div></div>
      <div class="fact-box"><div class="fact-n">5%</div><div class="fact-l">Organic matter</div></div>
    </div>
  </div>
  <div class="lesson-section">
    <h2>The Five Factors That Form Soil</h2>
    <p>Five factors interact together to determine what type of soil forms in any location:</p>
    <ol>
      <li><strong>Living organisms</strong> — bacteria, fungi, earthworms, and plant roots all contribute organic material and speed up breakdown of rock</li>
      <li><strong>Climate</strong> — temperature and rainfall determine how fast weathering occurs and what types of minerals form</li>
      <li><strong>Parent material</strong> — the type of rock being broken down determines the mineral content of the soil</li>
      <li><strong>Time</strong> — the longer rock weathers, the more developed the soil becomes</li>
      <li><strong>Topography</strong> — the slope and position of land affects drainage and erosion</li>
    </ol>
  </div>
  <div class="lesson-section">
    <h2>How Weathering Breaks Down Rock</h2>
    <p>Weathering is the process by which rock is broken down into the particles that eventually become soil. It can be mechanical, chemical, or biological:</p>
    <ul>
      <li><strong>Moving water</strong> — streams and rivers move stones, rubbing them together. Small particles break off and eventually become soil particles</li>
      <li><strong>Heat and cold</strong> — rocks expand in heat and contract in cold. Repeated cycles crack and break them</li>
      <li><strong>Wind</strong> — in dry areas, wind blows sand against rock, wearing it down slowly</li>
      <li><strong>Carbon dioxide</strong> — in the air, CO₂ forms weak carbonic acid that can dissolve limestone and chalk rock</li>
    </ul>
    <div class="info-box"><strong>Important:</strong> The activities of plants and animals also contribute to soil formation by adding organic materials as they die and decompose.</div>
  </div>
  <div class="lesson-section">
    <h2>Physical Properties of Soil</h2>
    <p>Physical properties are aspects of the soil that can be seen and touched. These include:</p>
    <h3>Soil Texture</h3>
    <p>Soil is made up of particles categorised into three groups by size: <strong>sand</strong> (largest), <strong>silt</strong> (medium), and <strong>clay</strong> (smallest). Most soils are a mixture of all three. The relative percentages give soil its texture. A soil texture triangle is used to classify the proportions.</p>
    <h3>Soil Structure</h3>
    <p>Individual particles of sand, silt, clay, and organic matter can cement together to form <strong>aggregates</strong> (also called peds). The way these aggregates are arranged gives soil its structure, which affects drainage and air movement.</p>
    <h3>Soil Colour</h3>
    <p>Soil colour is related to its chemical properties, drainage, and organic matter content. Dark soils are usually rich in organic matter. Red or orange soils contain iron oxides. Colour can indicate the different layers (horizons) of a soil profile.</p>
    <h3>Soil Porosity</h3>
    <p>Porosity refers to the spaces or pores between aggregates. These pores can be filled with air or water. The number, size, and shape of pores determines how much water the soil can hold and how quickly water drains through.</p>
  </div>
  <div class="lesson-section">
    <h2>Chemical Properties of Soil</h2>
    <p>The chemical properties of soil affect its ability to supply nutrients to plants. They also affect the activity of micro-organisms living in the soil.</p>
    <p>A key chemical property is <strong>soil pH</strong> — how acidic or alkaline the soil is. Most crops grow best in slightly acidic to neutral soils. If soil becomes too acidic or too alkaline, plants cannot absorb nutrients properly.</p>
    <p>Soils can also lose so many nutrients that they become <strong>lateritic</strong> and barren. Lateritic soils contain so much aluminium and iron that they are toxic to plants — even weeds struggle to grow in them.</p>
  </div>`,
  keyTerms: [
    {word:'Weathering', def:'The process of breaking down rock into smaller particles through physical, chemical, or biological action'},
    {word:'Parent material', def:'The original rock from which soil is formed'},
    {word:'Soil texture', def:'The proportion of sand, silt, and clay in a soil'},
    {word:'Aggregate (ped)', def:'A clump of soil particles held together by organic matter or chemical forces'},
    {word:'Porosity', def:'The spaces between soil particles that can hold air or water'},
    {word:'Lateritic soil', def:'A soil type containing high levels of iron and aluminium, often barren and infertile'},
  ],
  summary: [
    'Soil is formed by the weathering of rock (parent material) over time',
    'Five factors affect soil formation: living organisms, climate, parent material, time, and topography',
    'Soil is made up of mineral matter (45%), water (25%), air (25%), and organic matter (5%)',
    'Physical properties include texture (sand/silt/clay), structure, colour, and porosity',
    'Chemical properties include pH and nutrient content — these determine whether crops can grow'
  ],
  quiz: [
    {q:'What is the correct composition of soil by volume?', opts:['45% mineral, 25% water, 25% air, 5% organic','50% mineral, 25% water, 20% air, 5% organic','40% mineral, 30% water, 25% air, 5% organic','45% mineral, 30% water, 20% air, 5% organic'], ans:0},
    {q:'Which of the following is NOT one of the five factors that affect soil formation?', opts:['Climate','Topography','Rainfall alone','Living organisms'], ans:2},
    {q:'What are the three particle sizes in soil texture, from largest to smallest?', opts:['Sand, silt, clay','Clay, silt, sand','Silt, sand, clay','Sand, clay, silt'], ans:0},
    {q:'What is a lateritic soil?', opts:['A very dark soil rich in organic matter','A soil containing high iron and aluminium that is toxic to most plants','A clay-heavy soil that holds too much water','A sandy soil with poor nutrient content'], ans:1},
    {q:'Which weathering agent dissolves limestone and chalk rocks?', opts:['Moving water','Wind','Carbon dioxide forming carbonic acid','Heat and cold expansion'], ans:2},
  ],
  furtherReading: [
    {url:'https://www.fao.org/soils-portal/en/',label:'FAO Soils Portal',desc:'Global soil resources, soil health information, and soil management guidelines from the Food and Agriculture Organization.'},
    {url:'https://www.fao.org/soils-portal/soil-degradation-restoration/en/',label:'FAO Soil Degradation',desc:'How soils are degraded and how they can be restored — relevant to farming conditions in Papua New Guinea.'},
  ]
};
