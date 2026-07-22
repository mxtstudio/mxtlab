/* MXT Lab — lesson content for 'g12-poultry-project' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g12-poultry-project'] = {
  title: 'Bird Anatomy & Planning a Poultry Project',
  strand: 'Strand 2: Animals · Units 4–5', grade: 12, icon: '',
  lessons: ['Bird Anatomy & Physiology','Planning a Poultry Project','Managing the Flock'],
  currentLesson: 0,
  objectives: [
    'Describe the anatomy and physiology of domesticated birds',
    'Plan and design a basic poultry project including site selection, house design, and equipment',
    'Explain the key stages of managing a broiler or layer flock'
  ],
  keyTerms: [
    {word:'Broiler',def:'A chicken bred and raised specifically for meat production — characterised by fast growth rates and high feed conversion efficiency.'},
    {word:'Layer',def:'A chicken bred specifically for egg production — selected for high egg-laying frequency and feed-to-egg conversion efficiency.'},
    {word:'Brooder',def:'A heated enclosure keeping day-old chicks warm during the first weeks of life before they can regulate their own body temperature.'},
    {word:'Cloaca',def:'The common posterior opening in birds through which the digestive, urinary, and reproductive systems all empty.'},
    {word:'Air sac',def:'Thin-walled sacs connected to bird lungs that allow one-directional airflow — making birds highly efficient respirators but sensitive to airborne disease.'},
    {word:'Gizzard',def:'A muscular organ in the bird\'s digestive system that grinds food — replacing the function of teeth. Grit in the feed aids grinding efficiency.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Bird Anatomy and Physiology</h2>
    <h3>Skeletal and Structural Features</h3>
    <ul>
      <li><strong>Lightweight skeleton</strong> — many bones are hollow (pneumatised), reducing weight. In domesticated poultry, this energy is redirected to growth and egg production.</li>
      <li><strong>Keel (breastbone)</strong> — a large flat bone to which flight muscles attach. Well-developed in broilers due to breast meat breeding.</li>
      <li><strong>Beak</strong> — replaces teeth; used for pecking food. Sometimes trimmed in commercial poultry to reduce injurious pecking.</li>
    </ul>
    <h3>Digestive System</h3>
    <ul>
      <li><strong>Crop</strong> — a pouch in the oesophagus where food is temporarily stored and moistened.</li>
      <li><strong>Proventriculus</strong> — the glandular stomach that secretes digestive enzymes and acids.</li>
      <li><strong>Gizzard</strong> — muscular organ that grinds food. Grit in feed helps grinding efficiency.</li>
      <li><strong>Cloaca</strong> — common exit for digestive waste, urine, and eggs.</li>
    </ul>
    <h3>Respiratory System</h3>
    <p>Birds have <strong>air sacs</strong> that allow one-directional, continuous airflow through the lungs — more efficient than the mammalian system. This makes birds highly sensitive to airborne diseases and poor ventilation.</p>
  </div>
  <div class="lesson-section">
    <h2>Planning a Poultry Project</h2>
    <ol>
      <li><strong>Market assessment</strong> — determine who will buy the birds and estimate demand.</li>
      <li><strong>Site selection</strong> — choose a site with good drainage, protection from wind, access to clean water, and security from predators.</li>
      <li><strong>House design</strong> — appropriate size, ventilation, lighting, and ease of cleaning. Allow 0.1 m² per broiler for intensive production.</li>
      <li><strong>Mobilise materials</strong> — secure funding, day-old chicks (DOC), feed, and equipment before starting.</li>
      <li><strong>Set up brooder</strong> — brooder temperature should be 35°C in week one, reduced by 3°C per week until reaching ambient temperature.</li>
    </ol>
  </div>
  <div class="lesson-section">
    <h2>Managing the Flock</h2>
    <ul>
      <li><strong>Feed and nutrition</strong> — starter ration (22–24% protein) for weeks 1–3; grower/finisher ration from week 4. Fresh water always available.</li>
      <li><strong>Health and vaccination</strong> — follow a vaccination schedule for Newcastle disease, Gumboro, and Marek\'s disease. Monitor daily for signs of illness.</li>
      <li><strong>Biosecurity</strong> — control farm access; clean and disinfect all equipment; implement a "downtime" period between batches to break the disease cycle.</li>
      <li><strong>Record keeping</strong> — track mortality, feed consumption, growth rates, and costs to evaluate performance and profitability.</li>
    </ul>
  </div>`,
  summary: [
    'Birds have unique features: hollow bones, a keel, crop, proventriculus, gizzard, and cloaca',
    'Air sacs allow one-directional airflow through bird lungs — making birds very sensitive to airborne pathogens',
    'Poultry project planning: market assessment, site selection, house design, material sourcing, and brooder setup',
    'Brooder temperature for day-old chicks: 35°C in week one, reduced by 3°C per week',
    'Flock management includes nutrition management, vaccination, biosecurity, and record keeping',
    'A downtime period between batches breaks the disease cycle — critical for long-term flock health',
  ],
  quiz: [
    {q:'What is the function of the gizzard in a bird?', opts:['Stores food before digestion','Secretes digestive enzymes and acids','Grinds food, replacing the function of teeth','Absorbs water from digested food'], ans:2},
    {q:'Why are birds sensitive to airborne diseases and poor ventilation?', opts:['Feathers trap air pollutants','Air sacs allow continuous airflow directly through the lungs','Birds produce no antibodies against respiratory diseases','Their skin is thinner than mammalian skin'], ans:1},
    {q:'What temperature should a brooder be in the first week for day-old chicks?', opts:['20°C','25°C','35°C','40°C'], ans:2},
    {q:'What is a broiler?', opts:['A type of brooder for heating chicks','A chicken bred specifically for egg production','A chicken bred and raised specifically for meat production','A hen that has completed her laying cycle'], ans:2},
    {q:'What is the purpose of a downtime period between poultry batches?', opts:['To let the farmer rest','To reduce labour costs','To break the disease cycle by cleaning and disinfecting the house','To allow chick prices to stabilise before restocking'], ans:2},
  ],
  furtherReading: [
    {url:'https://www.fao.org/poultry-production-products/en/',label:'FAO Poultry Management',desc:'FAO resources on bird anatomy, poultry project planning, and flock management.'},
  ]
};
