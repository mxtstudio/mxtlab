const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Extract common components
const navMatch = indexHtml.match(/<nav id="navbar"[\s\S]*?<\/nav>/);
const footerMatch = indexHtml.match(/<footer>([\s\S]*?)<\/footer>/);
const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/);

let head = headMatch[1];
head = head.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/assets/css/style.css">');
head = head.replace(/<script>[\s\S]*?<\/script>/, '<script src="/assets/js/main.js" defer></script>');

// Fix nav links
let nav = navMatch[0].replace(/onclick="nav\('home'\);[\s\S]*?initReveal\(\);return false"/, 'href="/"');
nav = nav.replace(/onclick="nav\('(\w+)'\);return false;"/g, (m, p) => {
    const map = {modules:'/topics.html', about:'/about.html', blog:'/resources.html', careers:'/careers.html', contact:'/contact.html'};
    return `href="${map[p] || '/'}"`;
});
nav = nav.replace(/onclick="setGrade\((\d+)\);nav\('modules'\);return false"/g, 'href="/topics.html?grade=$1"');
nav = nav.replace(/onclick="nav\('(\w+)'\)"/g, (m, p) => {
    const map = {modules:'/topics.html', about:'/about.html', blog:'/resources.html', careers:'/careers.html', contact:'/contact.html'};
    return `href="${map[p] || '/'}"`;
});

// Fix footer
let footer = footerMatch[0].replace(/onclick="nav\('(\w+)'\)"/g, (m, p) => {
    const map = {privacy:'/privacy.html', terms:'/terms.html', contact:'/contact.html', about:'/about.html', home:'/', modules: '/topics.html'};
    return `href="${map[p] || '/'}"`;
});
footer = footer.replace(/onclick="setGrade\((\d+)\);nav\('modules'\)"/g, 'href="/topics.html?grade=$1"');
footer = footer.replace(/href="#blog"/g, 'href="/resources.html"');
footer = footer.replace(/href="#about"/g, 'href="/about.html"');
footer = footer.replace(/href="#contact"/g, 'href="/contact.html"');
footer = footer.replace(/href="#terms"/g, 'href="/terms.html"');
footer = footer.replace(/<a class="fl" href="#home"/, '<a class="fl" href="/"');

function wrap(content, title, description, canonical, relativePath = "") {
    let localHead = head.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
                        .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${description}">`);

    if (localHead.includes('<link rel="canonical"')) {
        localHead = localHead.replace(/<link rel="canonical" href=".*?">/, `<link rel="canonical" href="${canonical}">`);
    } else {
        localHead += `\n<link rel="canonical" href="${canonical}">`;
    }

    let assetPrefix = relativePath ? relativePath : "";

    let processedHead = localHead.replace(/href="\//g, `href="${assetPrefix}/`)
                                .replace(/src="\//g, `src="${assetPrefix}/`);

    if (assetPrefix) {
        processedHead = processedHead.replace(/href="favicon/g, `href="${assetPrefix}/favicon`)
                                     .replace(/href="Image/g, `href="${assetPrefix}/Image`)
                                     .replace(/src="Image/g, `src="${assetPrefix}/Image`);
    }

    let localNav = nav.replace(/href="\//g, `href="${assetPrefix}/`);
    let localFooter = footer.replace(/href="\//g, `href="${assetPrefix}/`);

    return `<!DOCTYPE html>
<html lang="en">
<head>
${processedHead}
</head>
<body>
    ${localNav}
    <main id="main">
        ${content}
    </main>
    ${localFooter}
</body>
</html>`;
}

const pages = {
    'index': { title: 'MXT Lab — Agriculture | Grade 9 & 10', desc: 'Interactive Agriculture learning for Grade 9 and Grade 10 students in Papua New Guinea.', canonical: 'https://mxtlab.online/', id: 'page-home' },
    'topics': { title: 'Topics — MXT Lab', desc: 'Browse Grade 9 and 10 Agriculture topics.', canonical: 'https://mxtlab.online/topics.html', id: 'page-modules' },
    'resources': { title: 'Resources — MXT Lab', desc: 'Agriculture resources and articles.', canonical: 'https://mxtlab.online/resources.html', id: 'page-blog' },
    'about': { title: 'About — MXT Lab', desc: 'About MXT Lab and our mission.', canonical: 'https://mxtlab.online/about.html', id: 'page-about' },
    'careers': { title: 'Careers — MXT Lab', desc: 'Agriculture careers and opportunities.', canonical: 'https://mxtlab.online/careers.html', id: 'page-careers' },
    'contact': { title: 'Contact — MXT Lab', desc: 'Get in touch with MXT Lab.', canonical: 'https://mxtlab.online/contact.html', id: 'page-contact' },
    'privacy': { title: 'Privacy Policy — MXT Lab', desc: 'Our privacy policy.', canonical: 'https://mxtlab.online/privacy.html', id: 'page-privacy' },
    'terms': { title: 'Terms of Service — MXT Lab', desc: 'Our terms of service.', canonical: 'https://mxtlab.online/terms.html', id: 'page-terms' }
};

for (const [fileId, info] of Object.entries(pages)) {
    const startRegex = new RegExp(`<div class="page[^"]*" id="${info.id}"[^>]*>`);
    const startMatch = indexHtml.match(startRegex);
    if (startMatch) {
        const startIndex = startMatch.index;
        const nextMatch = indexHtml.substring(startIndex + 1).match(/<div class="page/);
        let endIndex;
        if (nextMatch) {
            endIndex = startIndex + 1 + nextMatch.index;
        } else {
            endIndex = indexHtml.indexOf('</main>', startIndex);
        }

        let content = indexHtml.substring(startIndex, endIndex);

        // Ensure the page div is active for MPA
        if (!content.includes('active')) {
            content = content.replace(/class="page"/, 'class="page active"');
        } else {
            content = content.replace(/class="page active"/, 'class="page active"'); // redundant but safe
        }

        // Tag Conversion
        content = content.replace(/<button([^>]*?)onclick="nav\('(\w+)'\)"([^>]*?)>([\s\S]*?)<\/button>/g, (m, p1, p, p2, inner) => {
            const map = {modules:'/topics.html', about:'/about.html', blog:'/resources.html', careers:'/careers.html', contact:'/contact.html'};
            return `<a${p1}href="${map[p] || '/'}"${p2}>${inner}</a>`;
        });

        const convertDivToA = (html, className) => {
            const regex = new RegExp(`<div([^>]*?class="${className}"[^>]*?)onclick="([\\s\\S]*?)"([^>]*?)>([\\s\\S]*?)<\\/div>`, 'g');
            return html.replace(regex, (m, p1, onclick, p2, inner) => {
                let href = "/";
                const gMatch = onclick.match(/setGrade\((\d+)\)/);
                const nMatch = onclick.match(/nav\('(\w+)'\)/);
                if (gMatch) {
                    href = `/topics.html?grade=${gMatch[1]}`;
                } else if (nMatch) {
                    const map = {modules:'/topics.html', about:'/about.html', blog:'/resources.html', careers:'/careers.html', contact:'/contact.html'};
                    href = map[nMatch[1]] || '/';
                }
                return `<a${p1}href="${href}"${p2}>${inner}</a>`;
            });
        };

        content = convertDivToA(content, "sc");
        content = convertDivToA(content, "strand-card");

        content = content.replace(/onclick="nav\('(\w+)'\)"/g, (m, p) => {
            const map = {modules:'/topics.html', about:'/about.html', blog:'/resources.html', careers:'/careers.html', contact:'/contact.html'};
            return `href="${map[p] || '/'}"`;
        });

        fs.writeFileSync(`${fileId}.html`, wrap(content, info.title, info.desc, info.canonical));
    }
}

// 2. Lessons
const lessonsMatch = indexHtml.match(/const LESSONS = (\{[\s\S]*?\});/);
if (lessonsMatch) {
    const LESSONS = eval(`(${lessonsMatch[1]})`);
    if (!fs.existsSync('lessons')) fs.mkdirSync('lessons');

    for (const [id, lesson] of Object.entries(LESSONS)) {
        let content = `
        <div class="page active">
        <article class="lesson-content container">
            <header class="lesson-header">
                <h1>${lesson.title}</h1>
                <div class="lesson-meta">
                    <span class="grade-badge">Grade ${lesson.grade}</span>
                    <span class="category-tag">${lesson.strand || ''}</span>
                </div>
            </header>
            <div class="lesson-body">
                ${lesson.content}
            </div>
            <section id="quiz-section" class="quiz-container">
                <div class="quiz-card">
                    <h2>Test Your Knowledge</h2>
                    ${lesson.quiz.map((q, i) => `
                        <div class="quiz-q" data-ans="${q.ans}">
                            <p class="q-text"><strong>Q${i+1}:</strong> ${q.q}</p>
                            <div class="qopts">
                                ${q.opts.map((opt, oi) => `
                                    <label class="qopt">
                                        <input type="radio" name="q${i}" value="${oi}">
                                        <span class="opt-text">${opt}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                    <div class="quiz-actions">
                        <button id="quiz-submit-btn" class="btn primary" onclick="submitLessonQuiz()">Check Answers</button>
                    </div>
                    <div id="quiz-result" class="quiz-result" style="display:none"></div>
                </div>
            </section>
            <div class="lesson-footer-nav">
                <a href="/topics.html" class="btn secondary">← Back to Topics</a>
            </div>
        </article>
        </div>`;

        content = content.replace(/src="Image\//g, 'src="../Image/');
        const title = `${lesson.title} | Grade ${lesson.grade} Agriculture`;
        const desc = `Learn about ${lesson.title}. Interactive lesson for Grade ${lesson.grade} Agriculture.`;
        const canonical = `https://mxtlab.online/lessons/${id}.html`;
        fs.writeFileSync(`lessons/${id}.html`, wrap(content, title, desc, canonical, ".."));
    }
}

console.log("MPA generated successfully.");
