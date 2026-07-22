/* MXT Lab — lesson content for 'g10-animal-physiology' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g10-animal-physiology'] = {
  title: 'Animal Physiology: Digestive & Reproductive Systems',
  strand: 'Strand 2: Animals · Unit 1', grade: 10, icon: '',
  lessons: ['Monogastric Digestive Physiology','Polygastric Digestive Physiology','Reproductive Physiology'],
  currentLesson: 0,
  objectives: [
    'Compare the digestive systems of monogastric and polygastric animals',
    'Describe the processes and functions in the digestive systems of different animal types',
    'Explain the reproductive estrus cycle and reproductive technologies in farm animals'
  ],
  keyTerms: [
    {word:'Physiology',def:'Derived from Greek — the study of nature or normal process or function. Animal physiology is the scientific study of the life-supporting functions of animals.'},
    {word:'Ruminant',def:'An animal with a four-chambered stomach (rumen, reticulum, omasum, abomasum) that digests food through microbial fermentation. Examples: cattle, goats, sheep.'},
    {word:'Cellulose',def:'The tough plant material that makes up cell walls. Polygastric animals can digest cellulose in the rumen; monogastric animals cannot.'},
    {word:'Estrus cycle',def:'The reproductive cycle in female mammals, characterised by periods of fertility (estrus) followed by periods of infertility.'},
    {word:'Artificial insemination',def:'A reproductive technology where sperm is introduced into the female reproductive tract without natural mating.'},
    {word:'Embryo transfer',def:'A reproductive technology where an embryo is removed from a donor animal and implanted into a recipient animal.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Monogastric Digestive System</h2>
    <p>Monogastric animals have a simple, single-chambered stomach. Food passes from the mouth, through the oesophagus, into the stomach where acid and enzymes begin breaking it down, then through the small intestine (where most nutrients are absorbed), and finally through the large intestine.</p>
    <p>Because monogastric animals have only one stomach chamber with no rumen, they cannot break down cellulose (the main structural component of plant cell walls). This means pigs and poultry cannot live on grass or high-fibre plant material as their sole food source — they require higher-quality feed with readily digestible nutrients.</p>
    <p>Monogastric animals include: pigs, rabbits, poultry (chickens, ducks, turkeys), and humans.</p>
  </div>
  <div class="lesson-section">
    <h2>Polygastric (Ruminant) Digestive System</h2>
    <p>Polygastric animals (ruminants) have a four-chambered stomach, allowing them to digest cellulose-rich plant material like grass, leaves, and crop residues. The four chambers are:</p>
    <ul>
      <li><strong>Rumen</strong> — the largest chamber. Microbial fermentation of cellulose takes place here, producing volatile fatty acids that provide energy to the animal.</li>
      <li><strong>Reticulum</strong> — the second chamber, which helps sort feed material. Heavy objects ingested accidentally (stones, wire) settle here.</li>
      <li><strong>Omasum</strong> — the third chamber, which absorbs water and further grinds feed material.</li>
      <li><strong>Abomasum</strong> — the fourth chamber, equivalent to the single stomach of monogastric animals. True enzymatic digestion takes place here.</li>
    </ul>
    <p>Ruminants regurgitate partially digested food (cud) and chew it again — this is called <em>rumination</em> or "chewing the cud." This further breaks down plant material before it passes to the omasum and abomasum.</p>
    <p>Polygastric animals include: cattle, goats, sheep, deer, and buffalo.</p>
  </div>
  <div class="lesson-section">
    <h2>Reproductive Physiology</h2>
    <p>Reproduction is necessary for the survival of any species. Understanding animal reproductive physiology is essential for effective farm management. Through improved understanding, reproductive technologies have been developed including:</p>
    <ul>
      <li><strong>Artificial insemination (AI)</strong> — sperm from a selected sire is introduced into the female without natural mating. Allows a single high-quality male to father many offspring and eliminates the need to keep a breeding male on every farm.</li>
      <li><strong>Embryo transfer</strong> — embryos are removed from a high-value donor female and implanted into surrogate recipient females. Allows a superior female to produce many more offspring than would be possible through natural reproduction.</li>
      <li><strong>Estrus synchronisation</strong> — hormonal treatments used to synchronise the reproductive cycles of a group of females, allowing them all to be mated or artificially inseminated at the same time.</li>
      <li><strong>Sexing of semen</strong> — technology that separates sperm carrying X chromosomes (producing females) from sperm carrying Y chromosomes (producing males), allowing farmers to choose the sex of offspring.</li>
    </ul>
    <p>By studying developmental biology, farmers can better understand crucial developmental periods during gestation and make appropriate adjustments in how animals are managed and fed during pregnancy.</p>
  </div>`,
  summary: [
    'Monogastric animals have one stomach and cannot digest cellulose — they need high-quality feed',
    'Polygastric (ruminant) animals have four stomach chambers: rumen, reticulum, omasum, and abomasum',
    'The rumen contains microbes that ferment cellulose, allowing ruminants to live on grass and plant material',
    'Rumination (chewing the cud) further breaks down plant material before it enters the abomasum',
    'Reproductive technologies include artificial insemination, embryo transfer, estrus synchronisation, and sexed semen',
    'These technologies allow farmers to improve livestock genetics and increase production efficiency',
  ],
  quiz: [
    {q:'In what order do the four stomach chambers of a ruminant occur?', opts:['Omasum, Rumen, Reticulum, Abomasum','Rumen, Reticulum, Omasum, Abomasum','Abomasum, Omasum, Reticulum, Rumen','Reticulum, Abomasum, Rumen, Omasum'], ans:1},
    {q:'What is the main function of the rumen?', opts:['Absorbing water from digested feed','Microbial fermentation of cellulose from plant material','Secreting digestive enzymes like the stomach','Grinding food with muscular contractions'], ans:1},
    {q:'Which reproductive technology allows one high-quality male to father many offspring without natural mating?', opts:['Embryo transfer','Estrus synchronisation','Artificial insemination','Sexing of semen'], ans:2},
    {q:'Why can polygastric animals survive on grass when monogastric animals cannot?', opts:['They have stronger teeth for grinding grass','They have microbes in their rumen that can ferment and digest cellulose','They need less energy than monogastric animals','They have a longer digestive tract'], ans:1},
    {q:'What is rumination?', opts:['The process of adding microbes to the rumen','The regurgitation and re-chewing of partially digested food (cud)','The absorption of nutrients in the small intestine','The fermentation of grain in the abomasum'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/animal-production/en/',label:'FAO Animal Production',desc:'Animal physiology, digestive systems, and reproductive science from the FAO.'},
  ]
};
