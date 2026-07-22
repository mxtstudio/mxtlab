/* MXT Lab — lesson content for 'g10-animal-nutrition' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g10-animal-nutrition'] = {
  title: 'Animal Nutrition, Feeding & Health',
  strand: 'Strand 2: Animals · Unit 2', grade: 10, icon: '',
  lessons: ['Principles of Animal Nutrition','Poultry Feeding & Water','Animal Diseases & Prevention'],
  currentLesson: 0,
  objectives: [
    'Identify the five key nutrients required in good quality animal feed',
    'Explain the importance of water and good quality feed in poultry production',
    'Describe the causes of poultry diseases and distinguish between infectious and non-infectious agents'
  ],
  keyTerms: [
    {word:'Protein',def:'One of the most important nutrients in poultry feed. Sources include soybeans, fish meal, oil seed cakes, insects, and legume leaves.'},
    {word:'Carbohydrates',def:'The largest source of energy for chickens. Sources include rice, root crops, starchy fruits, and seeds.'},
    {word:'Minerals',def:'Nutrients important for proper bone growth and egg production. Sources include eggshells, oyster shells, bone meal, and limestone.'},
    {word:'Vitamins',def:'Nutrients important for body functions. Found in fresh plant leaves, seeds, and fruits.'},
    {word:'Infectious agent',def:'A pathogen (bacteria, virus, parasite, or fungus) that causes disease by invading and harming the animal host.'},
    {word:'Newcastle disease',def:'A serious viral disease of poultry. Cannot be treated — vaccination is the only way to protect birds.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>The Five Key Nutrients in Animal Feed</h2>
    <p>Good quality animal feed contains five essential nutrients:</p>
    <ul>
      <li><strong>Protein</strong> — one of the most important parts of poultry feed. Protein is found in beans (soybeans, cowpeas, mung beans), fish meal, oil seed cakes (sesame cake, soya cake, cottonseed cake), insects, and leaves of legumes such as Leucaena, cassava leaves, and bean leaves.</li>
      <li><strong>Carbohydrates (starches)</strong> — the largest source of energy for chickens. Sources include rice, root crops, starchy fruits, and seeds.</li>
      <li><strong>Fats and oils</strong> — most grains have some fats and oils. Other sources include oil seed meals. Fats provide concentrated energy.</li>
      <li><strong>Minerals</strong> — important for proper bone growth and egg production. Sources include shells (eggshells, oyster shells, snail shells), bone meal (made by heating then crushing bones), and limestone products (lime is a good source of calcium).</li>
      <li><strong>Vitamins</strong> — important for body functions. Found in fresh plant leaves, seeds, and fruits.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Water and Feed in Poultry Production</h2>
    <h3>Water</h3>
    <p>Water is the most important part of poultry nutrition. Birds need a constant supply of fresh clean water — birds cannot lay eggs if they lack water. Only use water that you would drink yourself. Dirty water can make birds sick. Clean waterers regularly, especially in warmer climates where micro-organisms multiply more quickly.</p>
    <h3>Good Quality Feed</h3>
    <p>Good quality feed produces three key outcomes for poultry:</p>
    <ul>
      <li>Better health</li>
      <li>More eggs</li>
      <li>Birds grow faster</li>
    </ul>
    <p>Production can be classified by the type of product:</p>
    <ul>
      <li><strong>Meat breeds</strong> — great at producing meat but not efficient at egg production</li>
      <li><strong>Egg breeds</strong> — good egg production but poor meat production. Hens do not need males present to lay eggs.</li>
      <li><strong>Dual purpose breeds</strong> — produce both meat and eggs but at lower rates than specialist breeds</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Animal Diseases and Prevention</h2>
    <p>Poultry diseases can be caused by any condition that results in deviation from normal function. Diseases occur due to the interaction between three main factors: the <strong>agent</strong> (cause), the <strong>host</strong> (animal), and the <strong>environment</strong>.</p>
    <h3>Infectious Agents</h3>
    <ul>
      <li><strong>Bacteria</strong> — cause many diseases but can usually be treated with antibiotics</li>
      <li><strong>Viruses</strong> — cause diseases that cannot be treated. Prevention through vaccination is the only way to protect birds. Examples: Newcastle disease, fowl pox, Gumboro disease</li>
      <li><strong>Parasites</strong> — most can be treated with conventional medicine (anthelmintics) or traditional remedies</li>
      <li><strong>Fungi</strong> — no reliable treatment; antibiotics may help in some cases</li>
    </ul>
    <h3>Non-Infectious Agents</h3>
    <ul>
      <li><strong>Chemical</strong> — birds can come into contact with poisons when farms are not kept clean; poisons used to kill rodents; farm chemicals stored in chicken houses</li>
      <li><strong>Physical</strong> — injury to the bird from rough handling or equipment</li>
      <li><strong>Dietary deficiency</strong> — improper feed formulation or mixing leads to nutritional diseases</li>
    </ul>
    <h3>Host Factors</h3>
    <p>The following host factors affect an animal\'s vulnerability to disease: breed, age, sex, and immune status. The weaker the host, the more vulnerable it is to agents that cause stress and disease. Note that not all poultry health and production problems are caused by infectious agents — many can be traced to management factors.</p>
  </div>`,
  summary: [
    'The five key nutrients in animal feed are: protein, carbohydrates, fats and oils, minerals, and vitamins',
    'Water is the most important part of poultry nutrition — birds cannot lay eggs without a constant clean supply',
    'Poultry can be classified as meat breeds, egg breeds, or dual purpose breeds',
    'Diseases result from interaction between agent (pathogen), host (animal), and environment',
    'Viral diseases like Newcastle disease cannot be treated — vaccination is the only protection',
    'Non-infectious causes include chemical poisoning, physical injury, and dietary deficiency',
  ],
  quiz: [
    {q:'Which nutrient is the largest source of energy for chickens?', opts:['Protein','Carbohydrates','Minerals','Vitamins'], ans:1},
    {q:'What is the most important part of poultry nutrition?', opts:['Protein-rich feed','Mineral supplements','Fresh clean water','Vitamin injections'], ans:2},
    {q:'Why is vaccination the most important protection against Newcastle disease?', opts:['Newcastle disease can be cured with antibiotics','Newcastle disease is caused by a fungus','Newcastle disease is a viral disease that cannot be treated once contracted','Newcastle disease only affects older birds'], ans:2},
    {q:'Which of the following is a good source of minerals for poultry?', opts:['Rice bran and maize','Fresh plant leaves and fruits','Oyster shells, bone meal, and limestone','Fish meal and soybeans'], ans:2},
    {q:'What are the three factors that interact to cause animal disease?', opts:['Feed, water, and shelter','Agent, host, and environment','Breed, age, and immune status','Bacteria, viruses, and parasites'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/poultry-production-products/en/',label:'FAO Poultry',desc:'Poultry nutrition, disease management, and poultry production resources from the FAO.'},
  ]
};
