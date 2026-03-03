import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Replicate the same heading renderer used in src/lib/lectures.js
const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const raw = tokens.map(t => t.raw || t.text || '').join('');
  const id = raw.trim().replace(/\s+/g, '-');
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
marked.use({ renderer });

// ── قائمة المجالس ──
// يجب أن تتطابق مع LECTURES في src/lib/constants.js
// أضف المجالس هنا عند إضافتها للسلسلة
const LECTURES = [
  { id: 1, slug: 'lecture-01', shortTitle: 'المجلس الأول', section: 'مقدمة', arabicNum: '١' },
];

const lecturesDir = path.join(process.cwd(), 'content', 'lectures');

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}

const index = { lectures: [], paragraphs: [] };

for (const lecture of LECTURES) {
  const lectureIndex = index.lectures.length;
  index.lectures.push({
    slug: lecture.slug,
    shortTitle: lecture.shortTitle,
    section: lecture.section,
    arabicNum: lecture.arabicNum,
  });

  const filePath = path.join(lecturesDir, `${lecture.slug}.md`);
  if (!fs.existsSync(filePath)) continue;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  const rawHtml = marked(content);

  let pIdx = 0;
  let currentHeading = '';

  const dataPRegex = /<(p|li|h[1-6]|blockquote|td)(\s[^>]*)?(>)/g;

  const matches = [];
  let m;
  while ((m = dataPRegex.exec(rawHtml)) !== null) {
    matches.push({ tag: m[1], pos: m.index, fullMatch: m[0] });
  }

  for (const match of matches) {
    const idx = pIdx++;
    const tag = match.tag;

    const afterOpen = match.pos + match.fullMatch.length;
    const closeTag = `</${tag}>`;
    const closePos = rawHtml.indexOf(closeTag, afterOpen);
    const innerHtml = closePos !== -1 ? rawHtml.slice(afterOpen, closePos) : '';
    const plainText = stripHtml(innerHtml).trim();

    if (/^h[2-3]$/.test(tag)) {
      currentHeading = plainText;
    }

    if (plainText.length > 0) {
      index.paragraphs.push({
        l: lectureIndex,
        p: idx,
        h: currentHeading,
        t: plainText,
      });
    }
  }
}

const outPath = path.join(process.cwd(), 'public', 'search-index.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(index));

const sizeMB = (Buffer.byteLength(JSON.stringify(index)) / 1024 / 1024).toFixed(2);
console.log(`Search index generated: ${index.lectures.length} lectures, ${index.paragraphs.length} paragraphs (${sizeMB} MB)`);
console.log(`Output: ${outPath}`);
