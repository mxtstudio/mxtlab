/* MXT Lab — lesson content for 'g12-aqua-advanced' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g12-aqua-advanced'] = {
  title: 'Advanced Aqua Farming & Post-Harvest Technology',
  strand: 'Strand 3: Aquaculture · Units 1–3', grade: 12, icon: '',
  lessons: ['Advanced Aquaculture Systems','Post-Harvest Technology','Global Aquaculture Trade'],
  currentLesson: 0,
  objectives: [
    'Investigate advanced aqua farming systems and their advantages and disadvantages',
    'Explain post-harvest technologies for handling, processing, and maintaining fish quality',
    'Discuss global trading of aquaculture products and communication technologies in marketing'
  ],
  keyTerms: [
    {word:'Recirculating Aquaculture System (RAS)',def:'A closed-loop fish farming system that recycles and treats water — enabling high-density, year-round production with minimal water use.'},
    {word:'Post-harvest technology',def:'Methods used after harvesting to handle, process, store, and transport fish while maintaining quality and safety.'},
    {word:'Cold chain',def:'The temperature-controlled supply chain maintaining quality of perishable fish from harvest to consumer.'},
    {word:'HACCP',def:'Hazard Analysis and Critical Control Points — an international food safety management system for fish processing.'},
    {word:'Biofloc technology',def:'A system where microorganisms in the water convert fish waste into microbial protein the fish can eat — reducing feed costs.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Advanced Aqua Farming Systems</h2>
    <ul>
      <li><strong>Recirculating Aquaculture Systems (RAS)</strong> — closed-loop systems treating and recycling water continuously. Advantages: year-round production, water efficiency, biosecurity. Disadvantage: high capital and energy cost.</li>
      <li><strong>Cage culture</strong> — fish grown in net cages in lakes, rivers, or the sea. Lower capital cost; production depends on water conditions.</li>
      <li><strong>Integrated farming</strong> — fish ponds combined with rice or poultry, where waste from one system feeds another (e.g. fish-rice systems).</li>
      <li><strong>Biofloc technology</strong> — microorganisms cultivated in water convert fish waste to protein, reducing feed costs and improving water quality.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Post-Harvest Technology</h2>
    <p>Fish deteriorate rapidly after death. Key post-harvest steps:</p>
    <ul>
      <li><strong>Handling</strong> — rapid chilling immediately after harvest is the single most important step.</li>
      <li><strong>Processing</strong> — gutting, filleting, smoking, drying, canning, or fermenting depending on market requirements.</li>
      <li><strong>Cold chain management</strong> — maintaining a continuous temperature-controlled supply chain using ice, refrigeration, or freezing.</li>
      <li><strong>HACCP systems</strong> — required for fish processing targeting export markets.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Global Trade and Communication Technology</h2>
    <p>PNG exports tuna, prawns, and seafood to Asia, Australia, and Europe — requiring compliance with international quality and safety standards.</p>
    <p>Communication technologies transforming PNG aquaculture marketing:</p>
    <ul>
      <li>Mobile phones and SMS for real-time market prices</li>
      <li>Internet and e-commerce connecting farmers directly with buyers</li>
      <li>GPS-enabled temperature loggers tracking cold chain integrity</li>
    </ul>
  </div>`,
  summary: [
    'Advanced aquaculture systems: RAS, cage culture, integrated farming, and biofloc technology',
    'RAS provides precise environmental control and high density but requires high capital and energy',
    'Post-harvest: chilling, processing, cold chain management, and HACCP food safety systems',
    'Rapid chilling immediately after harvest is the most important step for fish quality',
    'PNG exports tuna, prawns, and seafood requiring strict international quality standards',
    'Mobile phones, internet, and e-commerce are transforming PNG aquaculture marketing',
  ],
  quiz: [
    {q:'What is a Recirculating Aquaculture System (RAS)?', opts:['A large open-water fish cage','A closed-loop system recycling water for high-density fish farming','A natural pond using seasonal flooding','A government fish hatchery'], ans:1},
    {q:'What is the most important post-harvest step for fish quality?', opts:['Packaging in attractive containers','Rapid chilling immediately after harvest','Smoking fish within 24 hours','Adding salt to transport water'], ans:1},
    {q:'What does biofloc technology do in aquaculture?', opts:['Removes salt from seawater','Converts fish waste to microbial protein — reducing feed costs','Monitors fish growth using GPS','Produces fish vaccines automatically'], ans:1},
    {q:'What is the HACCP system?', opts:['Hazard Analysis and Critical Control Points — international food safety management','High Aquaculture Culture and Certification Process','Harvest and Cold Chain Processing','Healthy Agriculture Consumer Care Program'], ans:0},
    {q:'Why must PNG aquaculture exporters meet international quality standards?', opts:['To avoid import duties in PNG','To access premium markets in Asia, Australia, and Europe','To qualify for domestic subsidies','To increase pond stocking density'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/fishery/en/aquaculture',label:'FAO Advanced Aquaculture',desc:'FAO resources on advanced aquaculture systems, post-harvest technology, and global fish trade.'},
  ]
};
