import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { LECTURES, ORDINAL_NAMES } from './constants';

const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const raw = tokens.map(t => t.raw || t.text || '').join('');
  const id = raw.trim().replace(/\s+/g, '-');
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
marked.use({ renderer });

const lecturesDir = path.join(process.cwd(), 'content', 'lectures');

export function getAllLectures() {
  return LECTURES.map((lecture, index) => {
    const filePath = path.join(lecturesDir, `${lecture.slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { content } = matter(fileContent);
    return {
      ...lecture,
      ordinal: ORDINAL_NAMES[index] || `رقم ${lecture.id}`,
      readingTime: calculateReadingTime(content),
    };
  });
}

export function getLecture(slug) {
  const index = LECTURES.findIndex((l) => l.slug === slug);
  if (index === -1) return null;

  const lecture = LECTURES[index];
  const filePath = path.join(lecturesDir, `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(fileContent);
  const rawHtml = marked(content);
  // Add data-p to all content elements for annotation anchoring (single pass for correct order)
  let pIdx = 0;
  const html = rawHtml.replace(/<(p|li|h[1-6]|blockquote|td)(\s[^>]*)?(>)/g, (match, tag, attrs, close) => {
    const idx = pIdx++;
    attrs = attrs || '';
    if (attrs.includes('id="')) {
      // Element already has an id (e.g. headings from TOC) — just add data-p
      return `<${tag} data-p="${idx}"${attrs}>`;
    }
    return `<${tag} data-p="${idx}" id="p-${idx}"${attrs}>`;
  });
  const readingTime = calculateReadingTime(content);

  const prev = index > 0 ? LECTURES[index - 1] : null;
  const next = index < LECTURES.length - 1 ? LECTURES[index + 1] : null;

  return {
    ...lecture,
    ordinal: ORDINAL_NAMES[index] || `رقم ${lecture.id}`,
    frontmatter,
    content: html,
    readingTime,
    prev,
    next,
  };
}

export function getAllSlugs() {
  return LECTURES.map((l) => l.slug);
}

function calculateReadingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
