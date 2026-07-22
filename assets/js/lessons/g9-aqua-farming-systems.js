/* MXT Lab — lesson content for 'g9-aqua-farming-systems' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g9-aqua-farming-systems'] = {
  title: 'Aqua Farming Systems & Practices',
  strand: 'Strand 3: Aquaculture · Unit 2', grade: 9, icon: '',
  lessons: ['Principles of Aqua Farming','Types of Aqua Farming Systems','Monoculture & Polyculture'],
  currentLesson: 0,
  objectives: [
    'Explain the management principles of different types of aqua farming',
    'Identify and describe different aqua farming systems and practices used in different environments',
    'Distinguish between monoculture and polyculture fish production systems'
  ],
  keyTerms: [
    {word:'Aquaculture',def:'The farming of aquatic organisms such as fish, crustaceans, molluscs, and aquatic plants under controlled conditions.'},
    {word:'Extensive system',def:'A low-input aquaculture system with large ponds and low stocking density, relying mainly on natural food production.'},
    {word:'Intensive system',def:'A high-input aquaculture system with small ponds, high stocking density, and formulated feed to achieve maximum production.'},
    {word:'Semi-intensive system',def:'An intermediate system combining natural food production with supplemental feeding to achieve moderate yields.'},
    {word:'Monoculture',def:'A fish production system in which only one fish species is reared in the culture system.'},
    {word:'Polyculture',def:'A fish production system in which two or more different species are farmed together, using different food sources to reduce competition.'},
    {word:'Cage culture',def:'Rearing fish in a volume of water enclosed on all sides including bottom, allowing free circulation of water.'},
    {word:'Pond culture',def:'The most common method of fish culture, where water is maintained in an enclosed area by artificial construction of dikes or bunds.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Principles of Aqua Farming</h2>
    <p>Aquaculture is the farming of aquatic organisms such as fish, crustaceans, molluscs, and aquatic plants. Successful aquaculture takes into consideration the biology of the aquatic species — including feeding habits, water flow and temperature needs, and disease prevention — as well as the engineering design of the farming system, including water source, pond design, filtration, and aeration.</p>
    <p>The key principles of freshwater aquaculture include:</p>
    <ul>
      <li>Principles of organic aquaculture</li>
      <li>Pre-stocking and post-stocking pond management</li>
      <li>Criteria for selection of candidate species for culture</li>
      <li>Water and soil quality management in relation to fish production</li>
      <li>Estimation of pond productivity and factors affecting it</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Classification of Aquaculture Systems</h2>
    <p>Aquaculture practices are classified in several ways based on water type, intensity of management, and enclosure type.</p>
    <h3>By Water Type</h3>
    <ul>
      <li><strong>Freshwater farming</strong> — farming in zero-salinity water, mostly inland. Common species: catla, rohu, tilapia, freshwater prawn.</li>
      <li><strong>Brackish water farming</strong> — farming in water with partial salinity, found near estuaries and river mouths.</li>
      <li><strong>Marine water farming (Mariculture)</strong> — farming in seawater. Includes molluscs, prawns, shellfish, seaweed, and fish in open sea cages.</li>
    </ul>
    <h3>By Intensity of Management</h3>
    <ul>
      <li><strong>Extensive system</strong> — large ponds (1–5 ha), low stocking density (under 5,000 fish/ha), no supplemental feeding. Fish depend on natural food. Low yield (500 kg to 2 tonnes/ha) but low cost.</li>
      <li><strong>Semi-intensive system</strong> — smaller ponds (0.5–1 ha), stocking density of 10,000–15,000 fish/ha. Natural food supplemented with fertilisation and feeding. Moderate yield (3–10 tonnes/ha).</li>
      <li><strong>Intensive system</strong> — small ponds or tanks, very high stocking density (10–50 fish/m³). Fish fed completely on formulated feed. Water quality actively managed using aerators. Highest yields (15–100+ tonnes/ha) but high capital cost.</li>
    </ul>
    <h3>By Enclosure Type</h3>
    <ul>
      <li><strong>Pond culture</strong> — the most common method. Water held in an enclosed area by artificial bunds. Ponds filled by rain, canals, or bores.</li>
      <li><strong>Cage culture</strong> — fish raised in cages enclosed on all sides, allowing free water circulation. Suited to lakes, reservoirs, and rivers. Fish species include carps, tilapia, trout, and catfish.</li>
      <li><strong>Pen culture</strong> — fish raised in an enclosure open at the bottom, with the lake floor forming the base. Fish can feed on natural benthic fauna.</li>
      <li><strong>Raceway culture</strong> — fish raised in running water at high stocking density. Two types: linear (ponds in sequence) and lateral (ponds in parallel). Lateral type reduces disease spread between ponds.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Monoculture and Polyculture</h2>
    <p><strong>Monoculture</strong> is a production system in which only one fish species is reared. Common monoculture species include trout, tilapia, catfish, carps, and shrimp. It is widely practised in intensive systems where supplemental feeding is essential.</p>
    <p><strong>Polyculture</strong> is a system in which two or more different species are farmed together. Species are chosen so that they occupy different water depths and have different food preferences, avoiding competition. Polyculture generally produces higher yields than monoculture under the same conditions.</p>
    <p>The principal requirements for a successful polyculture system are:</p>
    <ul>
      <li>Species must have different feeding habits</li>
      <li>Species should occupy different columns (levels) within the pond</li>
      <li>All species should reach marketable size at the same time</li>
      <li>Species should be non-predatory toward each other</li>
    </ul>
  </div>`,
  summary: [
    'Aquaculture is the controlled farming of fish, crustaceans, molluscs, and aquatic plants',
    'Systems are classified by water type: freshwater, brackish water, and marine (mariculture)',
    'By intensity: extensive (low input/yield), semi-intensive (moderate), and intensive (high input/yield)',
    'By enclosure type: pond culture, cage culture, pen culture, and raceway culture',
    'Monoculture farms one species; polyculture farms two or more species with different food habits',
    'Intensive systems use aerators, formulated feed, and small tanks to achieve the highest yields',
  ],
  quiz: [
    {q:'Which aquaculture system requires the highest capital investment but produces the greatest yield?', opts:['Extensive','Semi-intensive','Intensive','Pond culture'], ans:2},
    {q:'What is the main advantage of polyculture over monoculture?', opts:['It requires less water','Different species use different food sources, reducing competition and increasing yield','It only requires one type of feed','It is cheaper to set up'], ans:1},
    {q:'In cage culture, what happens to water?', opts:['It is pumped in and out manually','It circulates freely through the cage','It is treated with chemicals daily','It remains still around the cage'], ans:1},
    {q:'What type of aquaculture involves farming in seawater?', opts:['Freshwater farming','Brackish water farming','Mariculture','Raceway culture'], ans:2},
    {q:'In an extensive aquaculture system, what do fish primarily rely on for food?', opts:['Formulated pellet feed','Organic manure only','Natural food produced in the pond','Feed from automatic feeders'], ans:2},
  ],
  furtherReading: [
    {url:'https://www.fao.org/fishery/en/aquaculture',label:'FAO Aquaculture',desc:'Aquaculture systems, fish farming practices, and Pacific fisheries information from the FAO.'},
  ]
};
