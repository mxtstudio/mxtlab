/* MXT Lab — lesson content for 'g10-capture-fishery' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g10-capture-fishery'] = {
  title: 'Capture Fishery: Harvesting & Management',
  strand: 'Strand 4: Natural Resources · Unit 1-2', grade: 10, icon: '',
  lessons: ['Harvesting Methods & Gear','Capture Fishery Management Systems','Fishery Regulation & Monitoring'],
  currentLesson: 0,
  objectives: [
    'Explain the different methods and gears used to harvest capture fish in inland and marine waters',
    'Identify and describe capture fishery management systems used in different places and environments',
    'Discuss fishery regulation and monitoring practices used to ensure sustainable fisheries'
  ],
  keyTerms: [
    {word:'Capture fishery',def:'The harvesting of fish and other aquatic organisms from wild stocks in their natural habitats, as distinct from aquaculture.'},
    {word:'Static gear',def:'Fishing gear that is placed in one position and left to capture fish that approach it. Examples: gillnets, setlines, traps.'},
    {word:'Mobile gear',def:'Fishing gear that is actively moved or used to encircle fish. Examples: cast nets, trawls, seines.'},
    {word:'Total Allowable Catch (TAC)',def:'A fishery management tool that establishes the maximum fishing limit for each species controlled under a management plan for a specific time period.'},
    {word:'Maximum Sustainable Yield (MSY)',def:'The maximum amount of fish that can be harvested from a stock without reducing the long-term ability of that stock to regenerate.'},
    {word:'Monitoring, Control and Surveillance (MCS)',def:'An integral component of fisheries management involving the collection and analysis of fishing data, enforcement of regulations, and supervision of fishing activity.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Harvesting Methods and Gear</h2>
    <p>Many types of fishing gear exist to exploit inland and marine waters. The choice of gear depends on the characteristics of the water body, the target species, the season, the value of the fish, and the cost of the gear.</p>
    <h3>Three Main Categories of Fishing Gear</h3>
    <ul>
      <li><strong>Passive gear</strong> — gear in which the fish comes to the gear. Examples: gillnets, setlines, traps, brush parks, fish holes, lift nets.</li>
      <li><strong>Active gear</strong> — gear in which the gear engulfs the fish. Examples: trawls, seines, cast nets, dip netting, electric fishing.</li>
      <li><strong>Other methods</strong> — rod and line, poisons, explosives, fish parks and holes.</li>
    </ul>
    <h3>Harvesting in Inland Waters</h3>
    <p>In inland fisheries there is a much greater dependence on static gears such as gillnets or barrier traps, and small individually operated active gears such as cast nets. Gear choices are affected by: water depth, characteristics of the lake or river bed, target species and their habitat, season and flow regime, and the value of the fish.</p>
    <h3>Harvesting in Marine Waters</h3>
    <p>In marine fisheries, the most important commercially used methods are purse seining and trawling. These highly mechanised methods are rare in inland waters. Marine fishing vessels use GPS technology, acoustic fish detection, and satellite-based remote sensing to locate fish schools efficiently.</p>
  </div>
  <div class="lesson-section">
    <h2>Capture Fishery Management Systems</h2>
    <p>The goal of fisheries management is to produce sustainable biological, social, and economic benefits from renewable aquatic resources. Fishery management systems aim to achieve optimal and sustainable utilisation of fishery resources while safeguarding the ecosystem.</p>
    <p>Management is directed at maintaining a stock size that gives the Maximum Sustainable Yield (MSY) through various regulations aimed at controlling fishing effort and mortality. When fisheries are assessed, the certification body checks that:</p>
    <ul>
      <li>An effective legal or customary framework is in place that recognises the rights of people who depend on fishing for food and livelihoods</li>
      <li>Management objectives are consistent with Fisheries Standards</li>
      <li>Effective consultation and decision-making processes are in place</li>
      <li>A system exists to effectively enforce management rules</li>
      <li>The performance of the management system is regularly evaluated</li>
    </ul>
    <h3>Fishery Management Tools</h3>
    <ul>
      <li><strong>Total Allowable Catch (TAC)</strong> — establishes maximum fishing limits for each species during a specific timeframe</li>
      <li><strong>Fishing effort limits</strong> — restrictions on number of trips, hooks used, kilometres of nets, or number of boats</li>
      <li><strong>Size limits</strong> — minimum and maximum legal sizes for fish caught. Lets fish reach maturity, complete breeding cycles, and contribute to sustainable stocks</li>
      <li><strong>Gear restrictions</strong> — control minimum net mesh size, allow only specific gear types in particular fisheries</li>
      <li><strong>Access controls</strong> — commercial fishing licences and permits that define harvest rights and place limits on authorised harvesters</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Fishery Regulation and Monitoring</h2>
    <p><strong>Fishery regulation</strong> is a set of rules and laws governing the exploitation and other practices of fishery resources, especially in open-access waters.</p>
    <p><strong>Monitoring practices</strong> involve the collection, measurement, and analysis of fishing activity.</p>
    <p>Capture Fishery Monitoring, Control and Surveillance (MCS) programs generally include:</p>
    <ul>
      <li><strong>Monitoring</strong> — collection and analysis of catches, species composition, fishing effort, discards, and area of operation</li>
      <li><strong>Control</strong> — specification of terms and conditions under which resources can be harvested</li>
      <li><strong>Surveillance</strong> — checking and supervising fishing activity to ensure national legislation and management measures are observed</li>
    </ul>
    <p>Modern monitoring tools include: video cameras on vessels, GPS tracking of fishing locations, satellite-based monitoring systems, human observers on fishing trips, vessel logbooks (required by law for all licensed commercial fishing operations), and satellite-based tracking devices (mandatory on all commercial fishing vessels in many countries).</p>
  </div>`,
  summary: [
    'Passive fishing gear (gillnets, traps, setlines) waits for fish to approach; active gear (trawls, cast nets, seines) is moved to encircle fish',
    'Inland fisheries rely heavily on static gear; marine fisheries use mechanised purse seining and trawling',
    'Fishery management aims to achieve Maximum Sustainable Yield while protecting the ecosystem',
    'Key management tools: Total Allowable Catch, effort limits, size limits, gear restrictions, and fishing licences',
    'MCS programs involve monitoring (data collection), control (rules), and surveillance (enforcement)',
    'Modern monitoring uses GPS tracking, video cameras, satellite systems, and mandatory vessel logbooks',
  ],
  quiz: [
    {q:'Which type of fishing gear waits in one position for fish to approach it?', opts:['Active gear','Mobile gear','Static (passive) gear','Towed gear'], ans:2},
    {q:'What is the goal of the Total Allowable Catch (TAC) management tool?', opts:['To establish the maximum fishing limit for each species during a specific period','To ban all commercial fishing in protected areas','To regulate the size of fishing vessels allowed in national waters','To set the minimum price for fish at market'], ans:0},
    {q:'Why are size limits important in fishery management?', opts:['To ensure only large fish are eaten','To let fish reach maturity, complete breeding cycles, and contribute to sustainable stocks','To reduce the cost of fishing operations','To prevent small boats from catching large fish'], ans:1},
    {q:'What does MCS stand for in fisheries management?', opts:['Marine Catch Standards','Maximum Catch Sustainability','Monitoring, Control and Surveillance','Marine Conservation System'], ans:2},
    {q:'Which fishing method is most commonly used in marine commercial fisheries?', opts:['Handlining from canoes','Cast nets from the shoreline','Purse seining and trawling','Brush traps and fish holes'], ans:2},
  ],
  furtherReading: [
    {url:'https://www.fao.org/fishery/en/',label:'FAO Fisheries',desc:'Capture fishery management, regulation, and sustainable harvesting resources from the FAO.'},
  ]
};
