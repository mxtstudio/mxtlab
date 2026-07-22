/* MXT Lab — lesson content for 'g10-forestry-tech' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g10-forestry-tech'] = {
  title: 'Forestry Technology: Harvesting & Processing',
  strand: 'Strand 4: Natural Resources · Unit 6', grade: 10, icon: '',
  lessons: ['Forest Monitoring & Preservation Technology','Forest Harvesting Technology','Processing Forest Products'],
  currentLesson: 0,
  objectives: [
    'Investigate and explain forest monitoring and preservation technology used in different environments',
    'Identify the tools and equipment used in harvesting and processing forest products',
    'Evaluate the strengths and weaknesses of technology used in forestry'
  ],
  keyTerms: [
    {word:'Forest protection',def:'A branch of forestry concerned with the preservation or improvement of a forest and the prevention and control of damage from natural or man-made causes.'},
    {word:'Remote sensing',def:'The use of satellite or aerial imagery to collect information about forest cover, deforestation, and forest health from a distance.'},
    {word:'Forest fire monitoring',def:'Systems and technology used to detect, track, and respond to wildfires in forest areas, including satellite monitoring, aerial patrolling, and sensor-based detection.'},
    {word:'Sawmill',def:'A facility where logs are cut into planks, boards, and other timber products using mechanical saws.'},
    {word:'Chainsaw',def:'A portable mechanical saw powered by a petrol or electric motor, used to fell trees and cut logs during harvesting operations.'},
    {word:'Reduced-impact logging',def:'A set of forestry practices designed to minimise the environmental impact of timber harvesting while maintaining commercial viability.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Forest Monitoring and Preservation Technology</h2>
    <p>Forests are among the most important resources for human survival and social development, protecting the balance of the earth's ecology. There is a need to design smart and efficient forest monitoring systems.</p>
    <p>Forest protection is a branch of forestry concerned with the preservation or improvement of forests and the prevention and control of damage from natural or man-made causes — including fire, animals, insects, fungi, injurious plants, and adverse climatic conditions.</p>
    <h3>Forest Fire Monitoring Technology</h3>
    <p>In recent years, prevention and monitoring of forest fires has become a global concern. Traditional forest fire monitoring measures include:</p>
    <ul>
      <li>Ground patrolling by forest rangers</li>
      <li>Watching towers providing elevated visual surveillance</li>
      <li>Aerial patrolling by aircraft or helicopters</li>
      <li>Long-distance video monitoring using cameras</li>
      <li>Satellite monitoring — detecting heat signatures and smoke from space</li>
    </ul>
    <p>Advanced technology now includes sensor-based detection systems that detect smoke or fires using sensors. Data from the sensors is processed in a microcontroller and transmitted wirelessly to a receiver unit, enabling immediate response.</p>
    <h3>Remote Sensing and GIS</h3>
    <ul>
      <li><strong>Satellite imagery</strong> — used to monitor forest cover change, identify deforestation hot-spots, and track forest fires across large areas</li>
      <li><strong>Drones (UAVs)</strong> — used for detailed aerial surveys of forest health, timber volume estimation, and post-fire assessment</li>
      <li><strong>GPS mapping</strong> — enables precise mapping of forest boundaries, logging roads, and protected areas</li>
      <li><strong>GIS (Geographic Information Systems)</strong> — software platforms that integrate satellite data, GPS data, and other information to produce detailed forest maps</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Forest Harvesting Technology</h2>
    <p>Forest harvesting requires a range of tools depending on the scale of the operation and the harvesting method used:</p>
    <h3>Hand Tools</h3>
    <ul>
      <li><strong>Chainsaws</strong> — portable mechanical saws for felling trees and cutting logs. Used in selective cutting and strip cutting operations.</li>
      <li><strong>Axes and machetes</strong> — used for clearing undergrowth, removing branches, and smaller cutting tasks.</li>
      <li><strong>Diameter tapes and hypsometers</strong> — measuring tools used to estimate tree diameter and height for timber volume calculations.</li>
    </ul>
    <h3>Heavy Machinery</h3>
    <ul>
      <li><strong>Skidders</strong> — wheeled or tracked machines that drag felled logs from the cutting site to loading areas, reducing manual labour.</li>
      <li><strong>Forwarders</strong> — carry logs on a trailer rather than dragging them, causing less soil compaction.</li>
      <li><strong>Log loaders</strong> — cranes or claw machines that lift and load logs onto trucks for transport to sawmills.</li>
      <li><strong>Bulldozers</strong> — used for road construction in forest areas to allow vehicle and machinery access.</li>
    </ul>
    <h3>Forest Processing Technology</h3>
    <ul>
      <li><strong>Sawmills</strong> — fixed or portable facilities where logs are cut into planks, boards, and timber products. Portable sawmills can operate without heavy road construction.</li>
      <li><strong>Wood chippers</strong> — machines that process small-diameter wood and branches into wood chips for paper production or biomass energy.</li>
      <li><strong>Kilns</strong> — drying chambers that remove moisture from sawn timber to prevent warping and improve strength and durability.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Strengths and Weaknesses of Forestry Technology</h2>
    <h3>Strengths</h3>
    <ul>
      <li>Increases speed and volume of timber harvesting operations</li>
      <li>Reduces physical danger to workers through mechanisation</li>
      <li>Enables better monitoring and conservation through remote sensing and GIS</li>
      <li>Improves accuracy of forest inventories and replanting schedules</li>
      <li>Sensor-based fire detection allows faster response to forest fires</li>
    </ul>
    <h3>Weaknesses</h3>
    <ul>
      <li>High capital cost of machinery is beyond the reach of small-scale operators and PNG rural communities</li>
      <li>Heavy machinery compacts soil, damages root systems, and leaves tracks that cause erosion</li>
      <li>Road construction for machinery access fragments forest habitats, increasing threats to biodiversity</li>
      <li>Technology enables faster harvesting — if not managed carefully, this can accelerate unsustainable deforestation</li>
      <li>Requires skilled operators and regular maintenance, which may not be available in remote PNG locations</li>
    </ul>
    <p>The solution is to apply <strong>reduced-impact logging</strong> techniques that minimise soil disturbance and damage to remaining trees, combined with sustainable harvesting quotas enforced through government regulation and forest inventory data.</p>
  </div>`,
  summary: [
    'Forest protection covers prevention and control of damage from fire, insects, fungi, animals, and climatic conditions',
    'Forest fire monitoring uses ground patrols, watch towers, aerial surveillance, satellites, and wireless sensor networks',
    'Remote sensing, drones, GPS, and GIS software enable large-scale forest monitoring without physical access to every area',
    'Harvesting tools include chainsaws, axes, skidders, forwarders, log loaders, and bulldozers',
    'Sawmills, wood chippers, and kilns process logs into usable timber products',
    'Strengths: efficiency, worker safety, better monitoring; Weaknesses: high cost, soil compaction, habitat fragmentation',
  ],
  quiz: [
    {q:'What is the purpose of a hypsometer in forestry?', opts:['To measure tree height for timber volume calculation','To detect fire and smoke in forest areas','To drill holes in trees for sap collection','To compact soil after logging operations'], ans:0},
    {q:'Which technology transmits fire and smoke detection data wirelessly to a receiver unit for immediate response?', opts:['Chainsaw GPS systems','Satellite-only monitoring','Sensor-based detection systems with wireless microcontrollers','Ground patrol radio communications'], ans:2},
    {q:'What is an advantage of portable sawmills over fixed sawmills in PNG forestry?', opts:['They produce higher quality timber products','They can operate without heavy road construction, reducing habitat fragmentation','They are cheaper to purchase and operate','They process larger logs than fixed sawmills'], ans:1},
    {q:'Which of the following is a weakness of using heavy machinery in forest harvesting?', opts:['Heavy machinery improves worker safety','Machinery enables better monitoring of forest health','Heavy machinery compacts soil and damages root systems','Machinery reduces the speed of timber harvesting'], ans:2},
    {q:'What does remote sensing allow foresters to do?', opts:['Operate chainsaws from a safe distance','Monitor forest cover change and detect deforestation from satellites without physical access to every area','Process logs into timber products more efficiently','Calculate the market price of timber products'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/forestry/en/',label:'FAO Forestry Technology',desc:'Forest monitoring technology, harvesting tools, and sustainable forestry practices from the FAO.'},
  ]
};
