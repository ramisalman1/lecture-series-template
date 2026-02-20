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

const LECTURES = [
  { id: 1, slug: 'lecture-01', shortTitle: 'حول المعلم والمتعلم', section: 'المقدمات والتنبيهات', arabicNum: '١' },
  { id: 2, slug: 'lecture-02', shortTitle: 'حول المجالس وأهميتها', section: 'المقدمات والتنبيهات', arabicNum: '٢' },
  { id: 3, slug: 'lecture-03', shortTitle: 'أمشاج النفس الإنسانية', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٣' },
  { id: 4, slug: 'lecture-04', shortTitle: 'حول الآخر والآخرين', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٤' },
  { id: 5, slug: 'lecture-05', shortTitle: 'الخِطبة واختيار الزوج (١)', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٥' },
  { id: 6, slug: 'lecture-06', shortTitle: 'الخِطبة واختيار الزوج (٢)', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٦' },
  { id: 7, slug: 'lecture-07', shortTitle: 'الخِطبة واختيار الزوج (٣)', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٧' },
  { id: 8, slug: 'lecture-08', shortTitle: 'عقد القِران وما قبل الزفاف', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٨' },
  { id: 9, slug: 'lecture-09', shortTitle: 'حفل الزفاف وليلة الزفاف', section: 'جهالات ومخادعات ومغالطات', arabicNum: '٩' },
  { id: 10, slug: 'lecture-10', shortTitle: 'شهر العسل والمشكلات الزوجية', section: 'جهالات ومخادعات ومغالطات', arabicNum: '١٠' },
  { id: 11, slug: 'lecture-11', shortTitle: 'أصول... ولكن! خُلاصات', section: 'خلاصات وأصول', arabicNum: '١١' },
  { id: 12, slug: 'lecture-12', shortTitle: 'أمانات ووصايا', section: 'خلاصات وأصول', arabicNum: '١٢' },
  { id: 13, slug: 'lecture-13', shortTitle: 'خطة المجالس ومنهاجها', section: 'خطة المجالس', arabicNum: '١٣' },
  { id: 14, slug: 'lecture-14', shortTitle: 'إجابة الأسئلة (١)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٤' },
  { id: 15, slug: 'lecture-15', shortTitle: 'إجابة الأسئلة (٢)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٥' },
  { id: 16, slug: 'lecture-16', shortTitle: 'إجابة الأسئلة (٣)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٦' },
  { id: 17, slug: 'lecture-17', shortTitle: 'إجابة الأسئلة (٤)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٧' },
  { id: 18, slug: 'lecture-18', shortTitle: 'إجابة الأسئلة (٥)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٨' },
  { id: 19, slug: 'lecture-19', shortTitle: 'إجابة الأسئلة (٦)', section: 'إجابة أسئلة المقدمات', arabicNum: '١٩' },
  { id: 20, slug: 'lecture-20', shortTitle: 'إجابة الأسئلة (٧)', section: 'إجابة أسئلة المقدمات', arabicNum: '٢٠' },
  { id: 21, slug: 'lecture-21', shortTitle: 'إجابة الأسئلة (٨)', section: 'إجابة أسئلة المقدمات', arabicNum: '٢١' },
  { id: 22, slug: 'lecture-22', shortTitle: 'خُلاصات إجابات الأسئلة', section: 'إجابة أسئلة المقدمات', arabicNum: '٢٢' },
  { id: 23, slug: 'lecture-23', shortTitle: 'صوارف ومعوقات (١)', section: 'صوارف ومعوقات وموانع', arabicNum: '٢٣' },
  { id: 24, slug: 'lecture-24', shortTitle: 'صوارف ومعوقات (٢)', section: 'صوارف ومعوقات وموانع', arabicNum: '٢٤' },
  { id: 25, slug: 'lecture-25', shortTitle: 'فقه النفس والطمأنينة', section: 'فقه النفس', arabicNum: '٢٥' },
  { id: 26, slug: 'lecture-26', shortTitle: 'تكوين النفس: الأمشاج', section: 'فقه النفس', arabicNum: '٢٦' },
  { id: 27, slug: 'lecture-27', shortTitle: 'الجسد والروح (١)', section: 'فقه النفس', arabicNum: '٢٧' },
  { id: 28, slug: 'lecture-28', shortTitle: 'الجسد والروح (٢)', section: 'فقه النفس', arabicNum: '٢٨' },
  { id: 29, slug: 'lecture-29', shortTitle: 'الجسد والروح والحاجات', section: 'فقه النفس', arabicNum: '٢٩' },
  { id: 30, slug: 'lecture-30', shortTitle: 'الاستعداد المادي (١)', section: 'الحاجات والاستعداد', arabicNum: '٣٠' },
  { id: 31, slug: 'lecture-31', shortTitle: 'الاستعداد المادي (٢)', section: 'الحاجات والاستعداد', arabicNum: '٣١' },
  { id: 32, slug: 'lecture-32', shortTitle: 'الاستعداد المادي (٣)', section: 'الحاجات والاستعداد', arabicNum: '٣٢' },
  { id: 33, slug: 'lecture-33', shortTitle: 'الاستعداد المادي (٤)', section: 'الحاجات والاستعداد', arabicNum: '٣٣' },
  { id: 34, slug: 'lecture-34', shortTitle: 'ترتيبات العريس (١)', section: 'جلسات خاصة', arabicNum: '٣٤' },
  { id: 35, slug: 'lecture-35', shortTitle: 'ترتيبات العريس (٢)', section: 'جلسات خاصة', arabicNum: '٣٥' },
  { id: 36, slug: 'lecture-36', shortTitle: 'فقه الحاجات الزوجية', section: 'فقه الحاجات', arabicNum: '٣٦' },
  { id: 37, slug: 'lecture-37', shortTitle: 'فقه القول والإبانة', section: 'فقه الحاجات', arabicNum: '٣٧' },
  { id: 38, slug: 'lecture-38', shortTitle: 'أعمال وتطبيقات وقصص', section: 'فقه الحاجات', arabicNum: '٣٨' },
  { id: 39, slug: 'lecture-39', shortTitle: 'مراجعات ومشاركات (١)', section: 'مراجعات ومشاركات', arabicNum: '٣٩' },
  { id: 40, slug: 'lecture-40', shortTitle: 'مراجعات ومشاركات (٢)', section: 'مراجعات ومشاركات', arabicNum: '٤٠' },
  { id: 41, slug: 'lecture-41', shortTitle: 'مراجعات ومشاركات (٣)', section: 'مراجعات ومشاركات', arabicNum: '٤١' },
  { id: 42, slug: 'lecture-42', shortTitle: 'مراجعات ومشاركات (٤)', section: 'مراجعات ومشاركات', arabicNum: '٤٢' },
  { id: 43, slug: 'lecture-43', shortTitle: 'مراجعات ومشاركات (٥)', section: 'مراجعات ومشاركات', arabicNum: '٤٣' },
  { id: 44, slug: 'lecture-44', shortTitle: 'مراجعات ومشاركات (٦)', section: 'مراجعات ومشاركات', arabicNum: '٤٤' },
  { id: 45, slug: 'lecture-45', shortTitle: 'مراجعات ومشاركات (٧)', section: 'مراجعات ومشاركات', arabicNum: '٤٥' },
  { id: 46, slug: 'lecture-46', shortTitle: 'خُلاصات حاجات الجنسين', section: 'خُلاصات حاجات الجنسين', arabicNum: '٤٦' },
  { id: 47, slug: 'lecture-47', shortTitle: 'حاجات الجنسين (١)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٤٧' },
  { id: 48, slug: 'lecture-48', shortTitle: 'حاجات الرجل (٢)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٤٨' },
  { id: 49, slug: 'lecture-49', shortTitle: 'حاجات المرأة (١)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٤٩' },
  { id: 50, slug: 'lecture-50', shortTitle: 'حاجات المرأة (٢)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٥٠' },
  { id: 51, slug: 'lecture-51', shortTitle: 'حاجات المرأة (٣)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٥١' },
  { id: 52, slug: 'lecture-52', shortTitle: 'حاجات المرأة (٤)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٥٢' },
  { id: 53, slug: 'lecture-53', shortTitle: 'حاجات المرأة (٥)', section: 'خُلاصات حاجات الجنسين', arabicNum: '٥٣' },
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
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);
  const rawHtml = marked(content);

  // Replicate the exact data-p indexing logic from src/lib/lectures.js (lines 42-50)
  let pIdx = 0;
  let currentHeading = '';

  // We need to walk the HTML to:
  // 1. Track heading context (most recent h2/h3 text)
  // 2. Assign data-p indices using the same regex as lectures.js
  // 3. Extract plain text for each matched element

  // First, collect all elements that get data-p in order
  const elementRegex = /<(p|li|h[1-6]|blockquote|td)(\s[^>]*)?(>)([\s\S]*?)(?=<\/\1>)/g;
  const dataPRegex = /<(p|li|h[1-6]|blockquote|td)(\s[^>]*)?(>)/g;

  // Walk through the HTML matching the same regex used in lectures.js for data-p assignment
  // to get the correct pIdx for each element
  const matches = [];
  let m;
  while ((m = dataPRegex.exec(rawHtml)) !== null) {
    matches.push({ tag: m[1], pos: m.index, fullMatch: m[0] });
  }

  // Now for each matched element, extract its inner content and track headings
  for (const match of matches) {
    const idx = pIdx++;
    const tag = match.tag;

    // Find the closing tag to extract inner content
    const afterOpen = match.pos + match.fullMatch.length;
    const closeTag = `</${tag}>`;
    const closePos = rawHtml.indexOf(closeTag, afterOpen);
    const innerHtml = closePos !== -1 ? rawHtml.slice(afterOpen, closePos) : '';
    const plainText = stripHtml(innerHtml).trim();

    // Track heading context
    if (/^h[2-3]$/.test(tag)) {
      currentHeading = plainText;
    }

    // Only index elements with meaningful text
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
