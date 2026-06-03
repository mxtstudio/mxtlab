const fs = require('fs');
const path = require('path');

const baseUrl = 'https://mxtlab.online';
const corePages = [
    '',
    'topics.html',
    'resources.html',
    'about.html',
    'careers.html',
    'contact.html',
    'privacy.html',
    'terms.html'
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add core pages
corePages.forEach(p => {
    const loc = p === '' ? `${baseUrl}/` : `${baseUrl}/${p}`;
    const priority = p === '' ? '1.0' : '0.8';
    sitemap += `  <url>
    <loc>${loc}</loc>
    <priority>${priority}</priority>
  </url>\n`;
});

// Add lesson pages
const lessonsDir = path.join(__dirname, 'lessons');
if (fs.existsSync(lessonsDir)) {
    const lessons = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.html'));
    lessons.forEach(l => {
        sitemap += `  <url>
    <loc>${baseUrl}/lessons/${l}</loc>
    <priority>0.6</priority>
  </url>\n`;
    });
}

sitemap += `</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('Sitemap generated.');
