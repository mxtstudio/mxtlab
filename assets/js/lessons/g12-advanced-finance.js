/* MXT Lab — lesson content for 'g12-advanced-finance' (auto-split from main.js) */
window.LESSONS = window.LESSONS || {};
window.LESSONS['g12-advanced-finance'] = {
  title: 'Advanced Agribusiness Finance & Capital',
  strand: 'Strand 5: Agribusiness · Unit 1', grade: 12, icon: '',
  lessons: ['Advanced Financial Analysis','Capital Management','Preparing Cash Flow Statements'],
  currentLesson: 0,
  objectives: [
    'Calculate and interpret key financial ratios including net profit margin, current ratio, and debt-to-equity ratio',
    'Explain working capital management and debt management in agribusiness',
    'Prepare and interpret a basic cash flow statement for an agricultural enterprise'
  ],
  keyTerms: [
    {word:'Working capital',def:'Current assets minus current liabilities — the capital available for day-to-day operations. Insufficient working capital causes cash flow problems.'},
    {word:'Net profit margin',def:'Net profit as a percentage of total revenue — measures how efficiently a business converts sales into profit.'},
    {word:'Current ratio',def:'Current assets divided by current liabilities — a ratio above 1.0 indicates the business can meet its short-term obligations.'},
    {word:'Accounts receivable',def:'Money owed to the business by customers for goods delivered but not yet paid — a current asset on the balance sheet.'},
    {word:'Return on equity (ROE)',def:'Net profit divided by owner\'s equity — measures how effectively the owner\'s investment is generating profit.'},
  ],
  content: `
  <div class="lesson-section">
    <h2>Advanced Financial Analysis</h2>
    <p>Key financial ratios for agribusiness analysis:</p>
    <ul>
      <li><strong>Net profit margin</strong> = (Net profit ÷ Total revenue) × 100. A higher margin means more revenue is kept as profit.</li>
      <li><strong>Current ratio</strong> = Current assets ÷ Current liabilities. Above 1.0 = good liquidity.</li>
      <li><strong>Debt-to-equity ratio</strong> = Total debt ÷ Total equity. A lower ratio = less financial risk.</li>
      <li><strong>Return on equity (ROE)</strong> = Net profit ÷ Owner\'s equity. Measures effectiveness of the owner\'s investment.</li>
    </ul>
  </div>
  <div class="lesson-section">
    <h2>Capital Management and Debt Management</h2>
    <p>Effective working capital management involves:</p>
    <ul>
      <li>Managing <strong>accounts receivable</strong> — ensure customers pay on time to maintain cash flow.</li>
      <li>Managing <strong>accounts payable</strong> — negotiate payment terms with suppliers to preserve working capital.</li>
      <li>Managing <strong>inventory</strong> — hold sufficient stock without tying up excessive capital.</li>
    </ul>
    <p>Debt management rules: loan repayments should not exceed a set proportion of operating cash flow; long-term assets (land, equipment) should be financed by long-term debt, not short-term credit.</p>
  </div>
  <div class="lesson-section">
    <h2>Preparing a Cash Flow Statement</h2>
    <p>A cash flow statement for a small agribusiness covers three sections:</p>
    <ol>
      <li><strong>Operating activities</strong> — cash from crop/livestock sales minus cash paid for inputs, feed, and labour.</li>
      <li><strong>Investing activities</strong> — cash paid for land, equipment, or vehicles; or received from selling long-term assets.</li>
      <li><strong>Financing activities</strong> — loan receipts minus loan repayments and interest payments.</li>
    </ol>
    <p>The sum of the three sections = <strong>net change in cash position</strong>. Positive = cash generated; negative = cash consumed.</p>
    <div class="info-box" style="background:var(--green-lt);padding:14px 16px;border-radius:8px;margin-top:14px">
      <strong>Example:</strong> A farmer receives K5,000 from sales (operating), pays K2,500 for feed, K800 loan repayment, K200 bank charges. Net cash flow = K5,000 − K2,500 − K800 − K200 = <strong>K1,500 positive</strong>.
    </div>
  </div>`,
  summary: [
    'Key financial ratios: net profit margin, current ratio, debt-to-equity ratio, and return on equity (ROE)',
    'Current ratio above 1.0 indicates the business can meet its short-term obligations',
    'Working capital = current assets minus current liabilities — the lifeblood of day-to-day operations',
    'Effective capital management: timely accounts receivable collection, supplier payment terms, and inventory control',
    'A cash flow statement has three sections: operating, investing, and financing activities',
    'Net change in cash position shows whether the business generated or consumed cash over the period',
  ],
  quiz: [
    {q:'What does the current ratio measure?', opts:['Business profitability per year','Whether the business can meet short-term obligations (current assets ÷ current liabilities)','Revenue proportion that becomes profit','Debt relative to equity'], ans:1},
    {q:'What is working capital?', opts:['Capital invested at business start','Current assets minus current liabilities','Total long-term debt','Cash received from crop sales'], ans:1},
    {q:'Which cash flow section records purchase of farm equipment?', opts:['Operating activities','Investing activities','Financing activities','Capital activities'], ans:1},
    {q:'A farmer receives K5,000 from sales, pays K2,500 for feed and K800 for loan repayments. What is the net cash flow?', opts:['K1,700','K1,500','K2,500','K5,000'], ans:0},
    {q:'What does a high debt-to-equity ratio indicate?', opts:['High profitability','High financial risk from heavy borrowing','Strong working capital management','Good return on equity'], ans:1},
  ],
  furtherReading: [
    {url:'https://www.fao.org/rural-employment/agribusiness/en/',label:'FAO Agribusiness Finance',desc:'FAO resources on agribusiness financial management, capital planning, and cash flow analysis.'},
  ]
};
