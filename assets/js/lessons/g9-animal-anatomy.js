/* MXT Lab — lesson content for 'g9-animal-anatomy' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g9-animal-anatomy'] = {
  title: 'Anatomy of Farm Animals',
  strand: 'Strand 2: Animals · Unit 2', grade: 9, icon: '',
  lessons: ['Monogastric vs Polygastric Digestive Systems','Anatomy & Body Systems','Skeletal & Muscular Systems','Reproductive Systems Overview'],
  currentLesson: 0,
  objectives: [
    'Identify the body systems of farm animals and explain their functions',
    'Compare monogastric and polygastric digestive systems',
    'Describe how skeletal, muscular, and reproductive systems differ between animal types'
  ],
  content: `
  <div class="lesson-section">
    <h2>Monogastric vs Polygastric (Ruminant) Digestive Systems</h2>
    <h3>Monogastric Animals (Simple Stomach)</h3>
    <p><strong>Monogastric</strong> animals have a single-chambered stomach. Digestion occurs mainly through chemical processes. Examples: pigs, chickens, rabbits.</p>
    <p><strong>Digestive pathway:</strong> Mouth → Oesophagus → Stomach → Small intestine → Large intestine → Rectum</p>
    <ul>
      <li>Quick passage through digestive tract (12-24 hours)</li>
      <li>Can digest grains, vegetables, and meat</li>
      <li>Less efficient at extracting nutrients from fibrous plants</li>
      <li>Require more concentrated feed</li>
    </ul>
    <h3>Polygastric Animals (Ruminants)</h3>
    <p><strong>Polygastric</strong> or <strong>ruminant</strong> animals have a four-chambered stomach: rumen, reticulum, omasum, and abomasum. Examples: cattle, sheep, goats.</p>
    <p><strong>Process: </strong> Food enters the rumen where it\'s broken down by microorganisms, then returns to mouth for further chewing (chewing cud), then progresses through remaining chambers.</p>
    <ul>
      <li>Slow digestion (48-72 hours) allows maximum nutrient extraction</li>
      <li>Excellent at digesting fibrous plant material (grass, hay)</li>
      <li>Microorganisms synthesize vitamins and amino acids</li>
      <li>More efficient at converting pasture to meat/milk</li>
    </ul>
    <div class="info-box"><strong>Key Difference:</strong> Monogastrics need grain supplements; ruminants thrive on grass and hay. This affects feed costs and farm management.</div>
  </div>
  <div class="lesson-section">
    <h2>Skeletal System</h2>
    <p>The skeleton provides structure, protects organs, and works with muscles for movement.</p>
    <ul>
      <li><strong>Skull</strong> — protects the brain</li>
      <li><strong>Spine (vertebral column)</strong> — supports the body and protects the spinal cord</li>
      <li><strong>Ribs</strong> — protect the heart and lungs</li>
      <li><strong>Limb bones</strong> — support body weight and enable movement</li>
      <li><strong>Pelvis</strong> — protects organs and provides attachment for back legs</li>
    </ul>
    <p>In ruminants, the skeleton is generally lighter and more adapted for running. In pigs, the skeleton is heavier and more compact.</p>
  </div>
  <div class="lesson-section">
    <h2>Muscular System</h2>
    <p>Muscles enable movement and heat production. There are three types:</p>
    <ul>
      <li><strong>Skeletal muscle</strong> — voluntary muscles attached to bones; responsible for movement</li>
      <li><strong>Smooth muscle</strong> — involuntary muscles in digestive and reproductive organs</li>
      <li><strong>Cardiac muscle</strong> — heart muscle; pumps blood</li>
    </ul>
    <p>Muscle quality and development depend on genetics, nutrition, and exercise. Proper feeding and management improve meat quality.</p>
  </div>
  <div class="lesson-section">
    <h2>Reproductive System Basics</h2>
    <h3>Female Reproductive System</h3>
    <ul>
      <li><strong>Ovaries</strong> — produce eggs (ova) and hormones</li>
      <li><strong>Oviducts</strong> — transport eggs from ovaries</li>
      <li><strong>Uterus</strong> — where embryo develops</li>
      <li><strong>Vagina</strong> — reproductive opening</li>
    </ul>
    <h3>Male Reproductive System</h3>
    <ul>
      <li><strong>Testicles</strong> — produce sperm and hormones</li>
      <li><strong>Epididymis</strong> — stores sperm</li>
      <li><strong>Vas deferens</strong> — transports sperm</li>
      <li><strong>Penis</strong> — delivers sperm during mating</li>
    </ul>
    <p>Understanding reproductive anatomy helps farmers manage breeding, recognize health issues, and optimize production.</p>
  </div>`,
  keyTerms: [
    {word:'Monogastric', def:'An animal with a single-chambered stomach — pig, chicken, or rabbit'},
    {word:'Polygastric (Ruminant)', def:'An animal with a multi-chambered stomach designed to digest fibrous plant material — cattle, sheep, goat'},
    {word:'Rumen', def:'The first chamber of a ruminant stomach where microbial fermentation occurs'},
    {word:'Chewing cud', def:'The process where ruminants regurgitate and re-chew food for more complete digestion'},
    {word:'Anatomy', def:'The structure of a body or body part'},
  ],
  summary: [
    'Monogastric animals have one stomach chamber; ruminants have four chambers',
    'Monogastrics need concentrated feed; ruminants efficiently digest grass and hay',
    'The skeletal system provides structure and protection; muscles enable movement',
    'Reproductive systems differ between males and females in structure and function',
    'Understanding animal anatomy helps farmers manage nutrition and health'
  ],
  quiz: [
    {q:'Which animals are monogastric?', opts:['Cattle and sheep','Pigs and chickens','Goats and buffaloes','Horses and llamas'], ans:1},
    {q:'How many chambers does a ruminant stomach have?', opts:['One','Two','Four','Six'], ans:2},
    {q:'What is chewing cud?', opts:['The first chewing of food in the mouth','Regurgitation and re-chewing of food from the rumen','Swallowing food without chewing','Chewing inedible material'], ans:1},
    {q:'Why are ruminants efficient at digesting grass?', opts:['They have larger mouths','Microorganisms in the rumen break down fibrous material','Grass is easier to digest than grain','They have longer intestines'], ans:1},
    {q:'Which body system provides structure and protects organs?', opts:['Muscular system','Respiratory system','Skeletal system','Nervous system'], ans:2},
  ]
};
