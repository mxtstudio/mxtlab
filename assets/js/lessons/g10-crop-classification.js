/* MXT Lab — lesson content for 'g10-crop-classification' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g10-crop-classification'] = {
  title: 'Crop Classification',
  strand: 'Strand 1: Crops · Unit 2', grade: 10, icon: '',
  lessons: ['Classification by Growing Cycle & Species','Classification by Season & Land Type','Classification by Product & Processing'],
  currentLesson: 0,
  objectives: [
    'Classify crops by growing cycle, species, and varieties',
    'Classify crops by season, land type, and crop use',
    'Classify crops by cultivation method, type of product, and processing methods'
  ],
  content: `
  <div class="lesson-section">
    <h2>Why Classify Crops?</h2>
    <p>Classifying crops helps farmers, scientists, and agronomists understand which crops suit which conditions, how to manage them, and how to process and market them. In Grade 10, we go deeper into the multiple classification systems used in agriculture.</p>
  </div>
  <div class="lesson-section">
    <h2>Classification by Growing Cycle</h2>
    <ul>
      <li><strong>Annual crops</strong> — complete their life cycle in one season. Must be re-planted each year. Examples: maize, rice, beans, tomatoes, groundnuts</li>
      <li><strong>Biennial crops</strong> — complete their life cycle in two seasons. Examples: carrot, onion, sugar beet</li>
      <li><strong>Perennial crops</strong> — live for many years, producing continuously. Examples: coffee, cocoa, oil palm, coconut, banana, cassava</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Classification by Species and Varieties</h2>
    <p>Within each crop there are often many different <strong>varieties</strong> (also called cultivars) — each with different characteristics suited to specific environments or uses:</p>
    <ul>
      <li>Rice varieties: lowland rice vs highland rice; long-grain vs short-grain</li>
      <li>Sweet potato varieties: white-fleshed vs orange-fleshed (orange is richer in vitamin A)</li>
      <li>Coffee varieties: Arabica (Highland grown, premium quality) vs Robusta (lowland, stronger flavour)</li>
    </ul>
    <p>Selecting the right variety for local conditions is one of the most important decisions a farmer can make.</p>
  </div>
  <div class="lesson-section">
    <h2>Classification by Season</h2>
    <ul>
      <li><strong>Wet season crops</strong> — planted when rainfall begins, rely on natural moisture. Example: upland rice, taro</li>
      <li><strong>Dry season crops</strong> — planted in the dry season using irrigation. Example: vegetables, groundnuts</li>
      <li><strong>Year-round crops</strong> — perennial crops that produce continuously. Example: banana, coconut, cassava</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Classification by Land Type</h2>
    <ul>
      <li><strong>Upland crops</strong> — grown on well-drained, non-flooded land. Most food crops fall in this category</li>
      <li><strong>Lowland/wetland crops</strong> — grown in low-lying areas that can be flooded. Example: lowland rice, sago palm</li>
      <li><strong>Highland crops</strong> — grown at altitude where temperatures are cooler. Example: pyrethrum, tea, temperate vegetables (potatoes, cabbage)</li>
      <li><strong>Coastal crops</strong> — grown in tropical coastal lowlands. Example: coconut, sago, mangrove products</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Classification by Type of Product</h2>
    <ul>
      <li><strong>Grain crops</strong> — grown for their seeds. Examples: rice, maize, wheat, sorghum</li>
      <li><strong>Root and tuber crops</strong> — grown for their underground storage organs. Examples: sweet potato, cassava, taro, yam</li>
      <li><strong>Leaf and stem vegetables</strong> — grown for leaves or stems. Examples: cabbage, spinach, kaukau greens, sugarcane</li>
      <li><strong>Fruit vegetables</strong> — grown for their fruit. Examples: tomato, pumpkin, cucumber, pawpaw</li>
      <li><strong>Legumes</strong> — grown for protein-rich seeds or pods. Examples: beans, peas, peanuts</li>
      <li><strong>Industrial/cash crops</strong> — grown for processing and export. Examples: coffee, cocoa, oil palm, rubber</li>
    </ul>
  </div>`,
  keyTerms: [
    {word:'Cultivar / Variety', def:'A plant variety that has been selected and maintained for specific desirable characteristics'},
    {word:'Upland crop', def:'A crop grown on well-drained, non-flooded land'},
    {word:'Lowland/wetland crop', def:'A crop grown in low-lying areas that can be flooded, such as rice'},
    {word:'Legume', def:'A crop that produces seeds in pods and has bacteria on its roots that fix nitrogen from the air into the soil'},
    {word:'Cash crop', def:'A crop grown specifically for sale or export, not just for family consumption'},
  ],
  summary: [
    'Crops can be classified by growing cycle: annual (one season), biennial (two seasons), or perennial (many years)',
    'Within each crop, varieties differ in characteristics suited to specific environments or uses',
    'Classification by season distinguishes wet season, dry season, and year-round crops',
    'Classification by land type includes upland, lowland, highland, and coastal crops',
    'Classification by product type covers grains, root crops, vegetables, fruits, legumes, and cash crops'
  ],
  quiz: [
    {q:'Coffee in Papua New Guinea is an example of which type of crop by growing cycle?', opts:['Annual','Biennial','Perennial','Seasonal'], ans:2},
    {q:'Sweet potato is classified as which type of crop by product type?', opts:['Grain crop','Leaf vegetable','Root and tuber crop','Legume'], ans:2},
    {q:'Which type of crop is grown in low-lying flooded areas?', opts:['Upland crop','Lowland/wetland crop','Highland crop','Cash crop'], ans:1},
    {q:'What is a cultivar?', opts:['A large commercial farm','A plant variety selected for specific desirable characteristics','A type of soil testing','A method of irrigation'], ans:1},
    {q:'Arabica and Robusta are varieties of which crop?', opts:['Cocoa','Oil palm','Coffee','Coconut'], ans:2},
  ]
};
