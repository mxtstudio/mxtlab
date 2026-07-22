/* MXT Lab — lesson content for 'g12-crop-physiology' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g12-crop-physiology'] = {
  title: 'Crop Physiology & Farming Practices',
  strand: 'Strand 1: Crops · Units 2–3', grade: 12, icon: '',
  lessons: ['Fundamental Crop Processes','Crop Physiology & Yield','Crop Marketing & Regulation'],
  currentLesson: 0,
  objectives: [
    'Explain photosynthesis, respiration, plant nutrition, plant hormones, and photo-morphogenesis',
    'Describe crop physiology and how it affects yield',
    'Investigate how crops are processed, stored, transported, and regulated in PNG'
  ],
  keyTerms: [
    {word:'Photosynthesis',def:'The process by which plants use sunlight, water, and CO₂ to produce oxygen and sugar.'},
    {word:'Plant hormones',def:'Chemicals produced by plants that regulate growth, development, and reproduction.'},
    {word:'Auxins',def:'A plant hormone that promotes cell enlargement and differentiation — important for shoot and root growth.'},
    {word:'Photo-morphogenesis',def:'Light-mediated plant development — how growth patterns respond to the light spectrum.'},
    {word:'Crop physiology',def:'The study of internal functions of crop plants and how they determine productivity and yield.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Fundamental Crop Processes</h2>
    <ol>
      <li><strong>Photosynthesis</strong> — plants capture sunlight using chlorophyll to convert H₂O and CO₂ into oxygen and sugar. The foundation of all plant productivity.</li>
      <li><strong>Respiration</strong> — controlled oxidation of sugars inside cells to release energy for growth and maintenance.</li>
      <li><strong>Plant nutrition</strong> — autotrophic plants make their own food from air and water via photosynthesis.</li>
      <li><strong>Plant hormones</strong> — chemical signals regulating growth:
        <ul>
          <li><strong>Auxins</strong> — promote cell enlargement and differentiation</li>
          <li><strong>Gibberellins</strong> — break dormancy in seeds and buds</li>
          <li><strong>Cytokinins</strong> — promote cell division</li>
          <li><strong>Abscisic acid</strong> — promotes dormancy in seeds and buds</li>
        </ul>
      </li>
      <li><strong>Photo-morphogenesis</strong> — plants detect light quality, intensity, and duration to control germination, flowering, and growth direction.</li>
    </ol>
  </div>
  <div class="lesson-section">
    <h2>Crop Physiology and Yield</h2>
    <ul>
      <li><strong>Source–sink relationships</strong> — sugars move from leaves (source) to growing tissues and seeds (sink). Managing this balance improves yield.</li>
      <li><strong>Leaf area index (LAI)</strong> — total leaf area relative to ground area. Higher LAI means more light is captured for photosynthesis.</li>
      <li><strong>Harvest index</strong> — the proportion of total crop biomass that is harvestable. Crop breeding aims to improve harvest index.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Crop Marketing, Storage and Regulation</h2>
    <p>After harvest, crops must be processed (cleaning, grading, packaging), stored (cool rooms, silos), and transported efficiently to market.</p>
    <p>Crop production and marketing in PNG is regulated by the <strong>Department of Agriculture and Livestock (DAL)</strong> and commodity agencies such as the Coffee Industry Corporation and the Cocoa Board — which set quality standards and issue licences.</p>
  </div>`,
  summary: [
    'The five fundamental crop processes: photosynthesis, respiration, plant nutrition, plant hormones, photo-morphogenesis',
    'Photosynthesis converts sunlight, water, and CO₂ into oxygen and sugar — the basis of all plant productivity',
    'Four plant hormones: auxins (cell enlargement), gibberellins (break dormancy), cytokinins (cell division), abscisic acid (promote dormancy)',
    'Photo-morphogenesis describes how plants respond to light quality and duration',
    'Crop physiology examines source-sink relationships, LAI, and harvest index as determinants of yield',
    'Crop marketing in PNG is regulated by DAL and commodity-specific agencies that set quality standards',
  ],
  quiz: [
    {q:'What is photosynthesis?', opts:['Breakdown of sugar for energy','Plants using sunlight, water, and CO₂ to produce oxygen and sugar','Movement of water from roots to leaves','How plants respond to different light spectrums'], ans:1},
    {q:'Which plant hormone promotes cell division?', opts:['Auxins','Gibberellins','Cytokinins','Abscisic acid'], ans:2},
    {q:'What does photo-morphogenesis describe?', opts:['Plant nutrition through sunlight','How plant growth patterns respond to the light spectrum','Chemical breakdown of plant hormones','Storage of sugars in plant roots'], ans:1},
    {q:'What is the harvest index?', opts:['Total crop land available','Proportion of total crop biomass that is harvestable','Number of harvests per year','Yield per hectare adjusted for rainfall'], ans:1},
    {q:'Which hormone breaks dormancy in seeds and buds?', opts:['Auxins','Cytokinins','Abscisic acid','Gibberellins'], ans:3},
  ],
  furtherReading: [
    {url:'https://www.fao.org/agriculture/crops/en/',label:'FAO Crop Production',desc:'FAO resources on crop physiology, production management, and regulation.'},
  ]
};
