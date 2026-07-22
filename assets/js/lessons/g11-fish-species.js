/* MXT Lab — lesson content for 'g11-fish-species' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g11-fish-species'] = {
  title: 'Fish Species & Cultivation Environments',
  strand: 'Strand 3: Aquaculture · Unit 1', grade: 11, icon: '',
  lessons: ['Fish Species in Different Water Environments','Cultivation of Fish'],
  currentLesson: 0,
  objectives: [
    'Examine the characteristics of fish species in freshwater, brackish, and saltwater',
    'Investigate the cultivation of fish in brackish and saltwater environments'
  ],
  keyTerms: [
    {word:'Freshwater fish',def:'Fish that live in rivers, lakes, and ponds — such as tilapia, barramundi (juvenile), catfish, and carp.'},
    {word:'Brackish water',def:'Water saltier than freshwater but less salty than seawater — found in estuaries and mangroves. Salinity 0.5–30 ppt.'},
    {word:'Stocking density',def:'The number of fish per unit of water volume or area — a key factor affecting growth and water quality.'},
    {word:'Aquaculture',def:'The farming of fish, shellfish, and aquatic plants in controlled environments for food or income.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Fish Species in Different Water Environments</h2>
    <h3>Freshwater Species</h3>
    <ul>
      <li><strong>Tilapia</strong> — hardy, fast-growing, well-suited to tropical PNG conditions. Most widely farmed freshwater fish globally.</li>
      <li><strong>Barramundi</strong> — juveniles begin in freshwater; also farmed in ponds.</li>
      <li><strong>Catfish</strong> — adaptable bottom-feeding fish suited to warm tropical waters.</li>
    </ul>
    <h3>Brackish Water Species</h3>
    <ul>
      <li><strong>Milkfish (Bangus)</strong> — popular in Southeast Asia and the Pacific.</li>
      <li><strong>Mud crab</strong> — high-value crustacean farmed in mangrove environments in PNG.</li>
      <li><strong>Giant tiger prawn</strong> — commercially important in coastal areas.</li>
    </ul>
    <h3>Saltwater Species</h3>
    <ul>
      <li><strong>Coral trout and grouper</strong> — high-value reef fish farmed in sea cages.</li>
      <li><strong>Snapper</strong> — farmed in offshore cages in PNG coastal waters.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Cultivation of Fish</h2>
    <h3>Pond Cultivation (Freshwater)</h3>
    <p>Most common aquaculture in PNG. Key aspects: proper pond construction, appropriate stocking density, regular feeding, and water quality monitoring (pH, dissolved oxygen, temperature).</p>
    <h3>Brackish Water Cultivation</h3>
    <p>Uses tidal ponds or earthen ponds in mangrove areas. Mud crab farming is particularly suited to PNG coastal communities.</p>
    <h3>Marine Cage Culture</h3>
    <p>Floating net cages anchored in sheltered coastal bays — capital-intensive but enables farming of high-value species like coral trout.</p>
  </div>`,
  summary: [
    'Fish are farmed across three water environments: freshwater, brackish, and saltwater',
    'Common freshwater species in PNG include tilapia, barramundi, and catfish',
    'Brackish water species include milkfish, mud crab, and giant tiger prawn',
    'Saltwater farming uses sea cages for coral trout, grouper, and snapper',
    'Pond aquaculture requires proper construction, stocking density, feeding, and water quality management',
    'Mud crab farming in mangroves is well-suited to PNG coastal communities',
  ],
  quiz: [
    {q:'What is brackish water?', opts:['Completely fresh water','Deep ocean water','Water saltier than fresh but less salty than seawater','Polluted freshwater'], ans:2},
    {q:'Which fish is described as hardy, fast-growing, and well-suited to tropical PNG?', opts:['Barramundi','Milkfish','Tilapia','Coral trout'], ans:2},
    {q:'What is the most common form of fish farming in PNG?', opts:['Sea cage culture','Recirculating systems','Pond cultivation','Open ocean ranching'], ans:2},
    {q:'Which high-value species is commonly farmed in mangrove environments in PNG?', opts:['Coral trout','Giant tiger prawn','Mud crab','Tilapia'], ans:2},
    {q:'What is stocking density in aquaculture?', opts:['The depth of the fish pond','Number of fish per unit of water volume or area','Weight of fish feed used per day','Salinity level of the water'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/fishery/en/aquaculture',label:'FAO Aquaculture',desc:'FAO resources on fish species, cultivation systems, and aquaculture management.'},
  ]
};
