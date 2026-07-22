/* MXT Lab — lesson content for 'g9-monogastric-polygastric' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g9-monogastric-polygastric'] = {
  title: 'Monogastric & Polygastric Animals',
  strand: 'Strand 2: Animals · Unit 1', grade: 9, icon: '',
  lessons: ['What are Monogastric Animals?','What are Polygastric Animals?','Comparison & Benefits'],
  currentLesson: 0,
  objectives: [
    'Define and distinguish between monogastric and polygastric animals',
    'Identify examples of each type found in Papua New Guinea',
    'Explain the purposes and benefits of each type of farm animal'
  ],
  content: `
  <div class="lesson-section">
    <h2>Monogastric Animals</h2>
    <figure class="lesson-figure">
      <img src="Images/Animals.png" alt="Farm animals raised in Papua New Guinea" loading="lazy"/>
      <figcaption>Common farm animals raised in Papua New Guinea, including pigs, cattle, and poultry.</figcaption>
    </figure>
    <p>A <strong>monogastric animal</strong> has a simple, single-chambered stomach. Their digestive system is similar to humans — food passes through the stomach once, enzymes break it down, and nutrients are absorbed.</p>
    <p>Monogastric animals cannot efficiently digest large amounts of plant fibre (cellulose) like grass. They rely mainly on grains, fruits, roots, and concentrates as their feed.</p>
    <h3>Examples of Monogastric Farm Animals</h3>
    <ul>
      <li><strong>Pigs (swine)</strong> — the most important monogastric farm animal in Papua New Guinea. Raised for pork, lard, and cultural ceremonies</li>
      <li><strong>Chickens and poultry</strong> — raised for eggs and meat; also monogastric</li>
      <li><strong>Rabbits</strong> — small monogastric animals raised for meat and fur</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Polygastric Animals (Ruminants)</h2>
    <p>A <strong>polygastric animal</strong> (also called a ruminant) has a stomach with multiple chambers — typically four. This complex digestive system allows them to break down tough plant material like grass and leaves that monogastric animals cannot digest.</p>
    <h3>The Four Stomach Chambers of a Ruminant</h3>
    <ul>
      <li><strong>Rumen</strong> — the largest chamber where food is stored and fermented by micro-organisms. Food is regurgitated from here as "cud" to be chewed again</li>
      <li><strong>Reticulum</strong> — also called the "honeycomb stomach," works with the rumen in fermentation</li>
      <li><strong>Omasum</strong> — absorbs water and further breaks down food particles</li>
      <li><strong>Abomasum</strong> — the "true stomach," works like a monogastric stomach with acid and enzyme digestion</li>
    </ul>
    <h3>Examples of Polygastric Farm Animals</h3>
    <ul>
      <li><strong>Cattle (cows)</strong> — raised for beef, dairy milk, and draught power</li>
      <li><strong>Goats</strong> — raised for meat (chevon), milk, and skins. Very adaptable to different environments</li>
      <li><strong>Sheep</strong> — raised for wool, meat (lamb and mutton), and milk</li>
      <li><strong>Buffalo</strong> — used as draught animals and raised for meat and milk in some countries</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Key Differences Between Monogastric and Polygastric</h2>
    <div class="fact-grid">
      <div class="fact-box"><div class="fact-n">1</div><div class="fact-l">Stomach chamber (monogastric)</div></div>
      <div class="fact-box"><div class="fact-n">4</div><div class="fact-l">Stomach chambers (polygastric)</div></div>
    </div>
    <p>The key practical difference is feeding: polygastric animals can graze on grass and pasture, which is cheap and widely available. Monogastric animals need more concentrated feeds like grain, which are more expensive but result in faster weight gain.</p>
    <div class="info-box"><strong>PNG Context:</strong> Pigs hold cultural and economic importance in Papua New Guinea — they are central to bride price ceremonies (bridewealth), feasts, and community events. Pig farming is one of the most widespread livestock activities in the country.</div>
  </div>`,
  keyTerms: [
    {word:'Monogastric', def:'An animal with a simple, single-chambered stomach — e.g. pig, chicken, rabbit'},
    {word:'Polygastric (ruminant)', def:'An animal with a complex stomach of four chambers that allows digestion of tough plant fibre — e.g. cattle, goat, sheep'},
    {word:'Rumen', def:'The first and largest stomach chamber of a ruminant where food is fermented by micro-organisms'},
    {word:'Cud', def:'Partially digested food that a ruminant brings back up from the rumen to chew again'},
    {word:'Cellulose', def:'The tough structural fibre in plant cell walls that only ruminants (and some insects) can fully digest'},
  ],
  summary: [
    'Monogastric animals have one simple stomach — examples include pigs, chickens, and rabbits',
    'Polygastric (ruminant) animals have four stomach chambers — examples include cattle, goats, and sheep',
    'Ruminants can digest grass and tough plant material; monogastrics require concentrated feeds like grain',
    'The four chambers of a ruminant stomach are the rumen, reticulum, omasum, and abomasum',
    'Pigs hold significant cultural and economic importance in Papua New Guinea'
  ],
  quiz: [
    {q:'How many stomach chambers does a ruminant have?', opts:['One','Two','Three','Four'], ans:3},
    {q:'Which of the following is a monogastric animal?', opts:['Goat','Cattle','Pig','Sheep'], ans:2},
    {q:'What is cud?', opts:['A type of animal feed made from grain','Partially digested food regurgitated from the rumen for re-chewing','The fourth chamber of a ruminant stomach','A chemical produced in the reticulum'], ans:1},
    {q:'Why can ruminants graze on grass while pigs cannot?', opts:['Pigs do not like the taste of grass','Ruminants have a complex multi-chambered stomach that can break down cellulose','Pigs need a special enzyme found only in grain','Grass contains toxins that harm pig digestion'], ans:1},
    {q:'What is the largest stomach chamber in a ruminant called?', opts:['Omasum','Abomasum','Reticulum','Rumen'], ans:3},
  ]
};
