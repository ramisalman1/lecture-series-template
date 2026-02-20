#!/usr/bin/env node

/**
 * Build Script — ألف باء الزواج
 * Converts Markdown lecture files into static HTML pages.
 *
 * Usage: node build.js
 *
 * To add new lectures:
 * 1. Add the markdown file to content/lectures/
 * 2. Add the lecture entry to the LECTURES array below
 * 3. Run: node build.js
 */

const fs = require('fs');
const path = require('path');

// --- Lectures Configuration ---
// Add new lectures here. The build script will generate HTML pages for each.
const LECTURES = [
  {
    id: 1,
    slug: 'lecture-01',
    title: 'بدايات وتنبيهات ومقدمات: حول المعلم والمتعلم أو الجمهور',
    shortTitle: 'حول المعلم والمتعلم',
    section: 'المقدمات والتنبيهات',
    arabicNum: '١'
  },
  {
    id: 2,
    slug: 'lecture-02',
    title: 'بدايات وتنبيهات ومقدمات: حول المجالس وأهميتها وما تقدّمه',
    shortTitle: 'حول المجالس وأهميتها',
    section: 'المقدمات والتنبيهات',
    arabicNum: '٢'
  },
  {
    id: 3,
    slug: 'lecture-03',
    title: 'جهالات ومخادعات ومغالطات (١): حول أمشاج النفس الإنسانية وحاجاتها',
    shortTitle: 'أمشاج النفس الإنسانية',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٣'
  },
  {
    id: 4,
    slug: 'lecture-04',
    title: 'جهالات ومخادعات ومغالطات (٢): حول الآخر أو الأُخرى أو الآخرين عامة',
    shortTitle: 'حول الآخر والآخرين',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٤'
  },
  {
    id: 5,
    slug: 'lecture-05',
    title: 'جهالات ومخادعات ومغالطات (٣): حول الخِطبة واختيار الزوج أو الزوجة (١)',
    shortTitle: 'الخِطبة واختيار الزوج (١)',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٥'
  },
  {
    id: 6,
    slug: 'lecture-06',
    title: 'جهالات ومخادعات ومغالطات (٤): حول الخِطبة واختيار الزوج أو الزوجة (٢)',
    shortTitle: 'الخِطبة واختيار الزوج (٢)',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٦'
  },
  {
    id: 7,
    slug: 'lecture-07',
    title: 'جهالات ومخادعات ومغالطات (٥): حول الخِطبة واختيار الزوج أو الزوجة (٣)',
    shortTitle: 'الخِطبة واختيار الزوج (٣)',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٧'
  },
  {
    id: 8,
    slug: 'lecture-08',
    title: 'جهالات ومخادعات ومغالطات (٦): حول عقد القِران أو النكاح وما قبل الزفاف',
    shortTitle: 'عقد القِران وما قبل الزفاف',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٨'
  },
  {
    id: 9,
    slug: 'lecture-09',
    title: 'جهالات ومخادعات ومغالطات (٧): حول حفل الزفاف وليلة الزفاف',
    shortTitle: 'حفل الزفاف وليلة الزفاف',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '٩'
  },
  {
    id: 10,
    slug: 'lecture-10',
    title: 'جهالات ومخادعات ومغالطات (٨): شهر العسل وسنة أولى زواج والمشكلات الزوجية والطلاق',
    shortTitle: 'شهر العسل والمشكلات الزوجية',
    section: 'جهالات ومخادعات ومغالطات',
    arabicNum: '١٠'
  },
  {
    id: 11,
    slug: 'lecture-11',
    title: 'أصول... ولكن! خُلاصات',
    shortTitle: 'أصول... ولكن! خُلاصات',
    section: 'خلاصات وأصول',
    arabicNum: '١١'
  },
  {
    id: 12,
    slug: 'lecture-12',
    title: 'خذ الحكمة من...! أمانات ووصايا',
    shortTitle: 'أمانات ووصايا',
    section: 'خلاصات وأصول',
    arabicNum: '١٢'
  },
  {
    id: 13,
    slug: 'lecture-13',
    title: 'خطة المجالس ومجالس الأسئلة ومنهاج المجالس القادمة',
    shortTitle: 'خطة المجالس ومنهاجها',
    section: 'خطة المجالس',
    arabicNum: '١٣'
  },
  {
    id: 14,
    slug: 'lecture-14',
    title: 'إجابة أسئلة مجالس المقدّمات (١)',
    shortTitle: 'إجابة الأسئلة (١)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٤'
  },
  {
    id: 15,
    slug: 'lecture-15',
    title: 'إجابة أسئلة مجالس المقدّمات (٢)',
    shortTitle: 'إجابة الأسئلة (٢)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٥'
  },
  {
    id: 16,
    slug: 'lecture-16',
    title: 'إجابة أسئلة مجالس المقدّمات (٣)',
    shortTitle: 'إجابة الأسئلة (٣)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٦'
  },
  {
    id: 17,
    slug: 'lecture-17',
    title: 'إجابة أسئلة مجالس المقدّمات (٤)',
    shortTitle: 'إجابة الأسئلة (٤)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٧'
  },
  {
    id: 18,
    slug: 'lecture-18',
    title: 'إجابة أسئلة مجالس المقدّمات (٥)',
    shortTitle: 'إجابة الأسئلة (٥)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٨'
  },
  {
    id: 19,
    slug: 'lecture-19',
    title: 'إجابة أسئلة مجالس المقدّمات (٦)',
    shortTitle: 'إجابة الأسئلة (٦)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '١٩'
  },
  {
    id: 20,
    slug: 'lecture-20',
    title: 'إجابة أسئلة مجالس المقدّمات (٧)',
    shortTitle: 'إجابة الأسئلة (٧)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '٢٠'
  },
  {
    id: 21,
    slug: 'lecture-21',
    title: 'إجابة أسئلة مجالس المقدّمات (٨)',
    shortTitle: 'إجابة الأسئلة (٨)',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '٢١'
  },
  {
    id: 22,
    slug: 'lecture-22',
    title: 'إجابة أسئلة مجالس المقدّمات (٩): خُلاصات إجابات الأسئلة',
    shortTitle: 'خُلاصات إجابات الأسئلة',
    section: 'إجابة أسئلة المقدمات',
    arabicNum: '٢٢'
  },
  {
    id: 23,
    slug: 'lecture-23',
    title: 'صوارف ومعوقات وموانع (١): الجهل والمخادعات',
    shortTitle: 'صوارف ومعوقات (١)',
    section: 'صوارف ومعوقات وموانع',
    arabicNum: '٢٣'
  },
  {
    id: 24,
    slug: 'lecture-24',
    title: 'صوارف ومعوقات وموانع (٢): الجهل والمخادعات',
    shortTitle: 'صوارف ومعوقات (٢)',
    section: 'صوارف ومعوقات وموانع',
    arabicNum: '٢٤'
  },
  {
    id: 25,
    slug: 'lecture-25',
    title: 'تعريف فقه النفس: بين الطمأنينة والسعادة',
    shortTitle: 'فقه النفس والطمأنينة',
    section: 'فقه النفس',
    arabicNum: '٢٥'
  },
  {
    id: 26,
    slug: 'lecture-26',
    title: 'ممّ تتكون النفس: كيف تتشكل النفس — أمشاج',
    shortTitle: 'تكوين النفس: الأمشاج',
    section: 'فقه النفس',
    arabicNum: '٢٦'
  },
  {
    id: 27,
    slug: 'lecture-27',
    title: 'ممّ تتكون النفس: الجسد والروح (١)',
    shortTitle: 'الجسد والروح (١)',
    section: 'فقه النفس',
    arabicNum: '٢٧'
  },
  {
    id: 28,
    slug: 'lecture-28',
    title: 'ممّ تتكون النفس: الجسد والروح (٢)',
    shortTitle: 'الجسد والروح (٢)',
    section: 'فقه النفس',
    arabicNum: '٢٨'
  },
  {
    id: 29,
    slug: 'lecture-29',
    title: 'ممّ تتكون النفس: الجسد والروح (٣) — الحاجات',
    shortTitle: 'الجسد والروح والحاجات',
    section: 'فقه النفس',
    arabicNum: '٢٩'
  },
  {
    id: 30,
    slug: 'lecture-30',
    title: 'الحاجات: الاستعداد المادي (١)',
    shortTitle: 'الاستعداد المادي (١)',
    section: 'الحاجات والاستعداد',
    arabicNum: '٣٠'
  },
  {
    id: 31,
    slug: 'lecture-31',
    title: 'الحاجات: الاستعداد المادي (٢)',
    shortTitle: 'الاستعداد المادي (٢)',
    section: 'الحاجات والاستعداد',
    arabicNum: '٣١'
  },
  {
    id: 32,
    slug: 'lecture-32',
    title: 'الحاجات: الاستعداد المادي (٣) — إجابة أسئلة الجمهور',
    shortTitle: 'الاستعداد المادي (٣)',
    section: 'الحاجات والاستعداد',
    arabicNum: '٣٢'
  },
  {
    id: 33,
    slug: 'lecture-33',
    title: 'الحاجات: الاستعداد المادي (٤) — إجابة أسئلة الجمهور',
    shortTitle: 'الاستعداد المادي (٤)',
    section: 'الحاجات والاستعداد',
    arabicNum: '٣٣'
  },
  {
    id: 34,
    slug: 'lecture-34',
    title: 'طلع الزّين من الحمّام: جلسة شبابية حول ترتيبات العريس للزواج (١)',
    shortTitle: 'ترتيبات العريس (١)',
    section: 'جلسات خاصة',
    arabicNum: '٣٤'
  },
  {
    id: 35,
    slug: 'lecture-35',
    title: 'طلع الزّين من الحمّام: جلسة شبابية حول ترتيبات العريس للزواج (٢)',
    shortTitle: 'ترتيبات العريس (٢)',
    section: 'جلسات خاصة',
    arabicNum: '٣٥'
  },
  {
    id: 36,
    slug: 'lecture-36',
    title: 'الحاجات: فقه الحاجات لحياة زوجية طيبة',
    shortTitle: 'فقه الحاجات الزوجية',
    section: 'فقه الحاجات',
    arabicNum: '٣٦'
  },
  {
    id: 37,
    slug: 'lecture-37',
    title: 'حاجة الحاجة: فقه القول ولسان النفس أو الإبانة والتعبير',
    shortTitle: 'فقه القول والإبانة',
    section: 'فقه الحاجات',
    arabicNum: '٣٧'
  },
  {
    id: 38,
    slug: 'lecture-38',
    title: 'أعمال وتطبيقات + خُلاصات وسرد + قصص واقعية',
    shortTitle: 'أعمال وتطبيقات وقصص',
    section: 'فقه الحاجات',
    arabicNum: '٣٨'
  },
  {
    id: 39,
    slug: 'lecture-39',
    title: 'مراجعات ما سبق عبر مشاركات الجمهور (١)',
    shortTitle: 'مراجعات ومشاركات (١)',
    section: 'مراجعات ومشاركات',
    arabicNum: '٣٩'
  },
  {
    id: 40,
    slug: 'lecture-40',
    title: 'مراجعات ما سبق عبر مشاركات الجمهور (٢)',
    shortTitle: 'مراجعات ومشاركات (٢)',
    section: 'مراجعات ومشاركات',
    arabicNum: '٤٠'
  },
  {
    id: 41,
    slug: 'lecture-41',
    title: 'مراجعات ما سبق عبر مشاركات الجمهور (٣)',
    shortTitle: 'مراجعات ومشاركات (٣)',
    section: 'مراجعات ومشاركات',
    arabicNum: '٤١'
  },
  {
    id: 42,
    slug: 'lecture-42',
    title: 'مراجعات ما سبق عبر مشاركات الجمهور (٤)',
    shortTitle: 'مراجعات ومشاركات (٤)',
    section: 'مراجعات ومشاركات',
    arabicNum: '٤٢'
  }
];

// --- Arabic ordinal names ---
const ORDINAL_NAMES = [
  'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة',
  'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة',
  'الحادية عشرة', 'الثانية عشرة', 'الثالثة عشرة', 'الرابعة عشرة', 'الخامسة عشرة',
  'السادسة عشرة', 'السابعة عشرة', 'الثامنة عشرة', 'التاسعة عشرة', 'العشرون',
  'الحادية والعشرون', 'الثانية والعشرون', 'الثالثة والعشرون', 'الرابعة والعشرون', 'الخامسة والعشرون',
  'السادسة والعشرون', 'السابعة والعشرون', 'الثامنة والعشرون', 'التاسعة والعشرون', 'الثلاثون',
  'الحادية والثلاثون', 'الثانية والثلاثون', 'الثالثة والثلاثون', 'الرابعة والثلاثون', 'الخامسة والثلاثون',
  'السادسة والثلاثون', 'السابعة والثلاثون', 'الثامنة والثلاثون', 'التاسعة والثلاثون', 'الأربعون',
  'الحادية والأربعون', 'الثانية والأربعون'
];

// --- Simple Markdown to HTML Converter ---
function markdownToHtml(md) {
  let html = md;

  // Normalize line endings
  html = html.replace(/\r\n/g, '\n');

  // --- Block-level processing ---

  // Split into lines for block processing
  const lines = html.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = processInline(headingMatch[2]);
      blocks.push(`<h${level}>${text}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push('<hr>');
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      let quoteLines = [];
      while (i < lines.length && (lines[i].startsWith('>') || (lines[i].trim() !== '' && quoteLines.length > 0 && !lines[i].startsWith('#')))) {
        if (lines[i].startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
        } else {
          break;
        }
        i++;
      }
      const quoteContent = processInline(quoteLines.join('\n'));
      blocks.push(`<blockquote><p>${quoteContent}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const listResult = parseList(lines, i, 'ul');
      blocks.push(listResult.html);
      i = listResult.nextIndex;
      continue;
    }

    // Ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const listResult = parseList(lines, i, 'ol');
      blocks.push(listResult.html);
      i = listResult.nextIndex;
      continue;
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*[-:]+/.test(lines[i + 1])) {
      const tableResult = parseTable(lines, i);
      blocks.push(tableResult.html);
      i = tableResult.nextIndex;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    let paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' &&
           !lines[i].match(/^#{1,6}\s/) &&
           !lines[i].startsWith('>') &&
           !/^\s*[-*+]\s+/.test(lines[i]) &&
           !/^\s*\d+[.)]\s+/.test(lines[i]) &&
           !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const text = processInline(paraLines.join('\n'));
      blocks.push(`<p>${text}</p>`);
    }
  }

  return blocks.join('\n\n');
}

// --- Parse nested lists ---
function parseList(lines, startIndex, type) {
  const items = [];
  let i = startIndex;
  const listPattern = type === 'ul' ? /^(\s*)[-*+]\s+(.+)/ : /^(\s*)\d+[.)]\s+(.+)/;
  const baseIndent = (lines[startIndex].match(/^\s*/) || [''])[0].length;

  while (i < lines.length) {
    const match = lines[i].match(listPattern);
    if (!match) {
      // Check if it's a continuation or sub-list
      const anyListMatch = lines[i].match(/^(\s*)(?:[-*+]|\d+[.)])\s+/);
      if (anyListMatch && anyListMatch[1].length > baseIndent) {
        // Sub-list — parse it
        const subType = /^\s*\d+[.)]\s+/.test(lines[i]) ? 'ol' : 'ul';
        const subResult = parseList(lines, i, subType);
        if (items.length > 0) {
          items[items.length - 1].sub = subResult.html;
        }
        i = subResult.nextIndex;
        continue;
      }
      break;
    }

    const indent = match[1].length;
    if (indent > baseIndent) {
      // Sub-list
      const subType = /^\s*\d+[.)]\s+/.test(lines[i]) ? 'ol' : 'ul';
      const subResult = parseList(lines, i, subType);
      if (items.length > 0) {
        items[items.length - 1].sub = subResult.html;
      }
      i = subResult.nextIndex;
      continue;
    }
    if (indent < baseIndent) break;

    items.push({ text: match[2], sub: '' });
    i++;
  }

  const tag = type;
  const itemsHtml = items.map(item => {
    const text = processInline(item.text);
    return `<li>${text}${item.sub ? '\n' + item.sub : ''}</li>`;
  }).join('\n');

  return {
    html: `<${tag}>\n${itemsHtml}\n</${tag}>`,
    nextIndex: i
  };
}

// --- Parse tables ---
function parseTable(lines, startIndex) {
  let i = startIndex;
  const rows = [];

  // Header row
  const headerCells = lines[i].split('|').map(c => c.trim()).filter(c => c !== '');
  rows.push(headerCells);
  i++; // skip header

  // Separator row
  i++; // skip separator

  // Body rows
  while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
    const cells = lines[i].split('|').map(c => c.trim()).filter(c => c !== '');
    rows.push(cells);
    i++;
  }

  let tableHtml = '<table>\n<thead>\n<tr>';
  rows[0].forEach(cell => {
    tableHtml += `<th>${processInline(cell)}</th>`;
  });
  tableHtml += '</tr>\n</thead>\n<tbody>';

  for (let r = 1; r < rows.length; r++) {
    tableHtml += '\n<tr>';
    rows[r].forEach(cell => {
      tableHtml += `<td>${processInline(cell)}</td>`;
    });
    tableHtml += '</tr>';
  }
  tableHtml += '\n</tbody>\n</table>';

  return { html: tableHtml, nextIndex: i };
}

// --- Inline processing ---
function processInline(text) {
  let result = text;

  // Bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>');

  // Inline code: `text`
  result = result.replace(/`(.+?)`/g, '<code>$1</code>');

  // Links: [text](url)
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Line breaks
  result = result.replace(/\n/g, '<br>');

  return result;
}

// --- Generate Sidebar HTML ---
function generateSidebar(activeSlug) {
  const items = LECTURES.map(l => {
    const isActive = l.slug === activeSlug ? ' active' : '';
    return `        <li class="sidebar__item">
          <a href="${l.slug}.html" class="sidebar__link${isActive}">
            <span class="sidebar__number">${l.arabicNum}</span>
            <span class="sidebar__text">${l.shortTitle}</span>
          </a>
        </li>`;
  }).join('\n');

  return `    <nav class="sidebar">
      <div class="sidebar__header">المحاضرات</div>
      <ul class="sidebar__list">
${items}
      </ul>
    </nav>`;
}

// --- Generate Navigation ---
function generateNav(currentIndex) {
  const prev = currentIndex > 0 ? LECTURES[currentIndex - 1] : null;
  const next = currentIndex < LECTURES.length - 1 ? LECTURES[currentIndex + 1] : null;

  let html = '<div class="lecture-nav">\n';

  // Next lecture (appears on the right in RTL — arrow points left)
  if (next) {
    html += `  <a href="${next.slug}.html" class="lecture-nav__btn">
    <span class="material-icons-round">arrow_back</span>
    <div>
      <span class="lecture-nav__btn-label">المحاضرة التالية</span>
      <span class="lecture-nav__btn-title">${next.shortTitle}</span>
    </div>
  </a>\n`;
  } else {
    html += '  <div></div>\n';
  }

  // Previous lecture (appears on the left in RTL — arrow points right)
  if (prev) {
    html += `  <a href="${prev.slug}.html" class="lecture-nav__btn">
    <div>
      <span class="lecture-nav__btn-label">المحاضرة السابقة</span>
      <span class="lecture-nav__btn-title">${prev.shortTitle}</span>
    </div>
    <span class="material-icons-round">arrow_forward</span>
  </a>\n`;
  } else {
    html += '  <div></div>\n';
  }

  html += '</div>';
  return html;
}

// --- Generate Lecture Page ---
function generateLecturePage(lecture, contentHtml, index) {
  const sidebar = generateSidebar(lecture.slug);
  const nav = generateNav(index);
  const ordinal = ORDINAL_NAMES[index] || `رقم ${lecture.id}`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>المحاضرة ${ordinal} — ألف باء الزواج</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Header -->
  <header class="header">
    <button class="header__menu-btn" aria-label="القائمة">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
    </button>
    <div class="header__title">
      <a href="index.html">ألف باء الزواج</a>
    </div>
    <span class="header__subtitle">المحاضرة ${ordinal}</span>
  </header>

  <!-- Sidebar Overlay -->
  <div class="sidebar-overlay"></div>

  <!-- Layout -->
  <div class="layout">

    <!-- Sidebar -->
${sidebar}

    <!-- Main Content -->
    <main class="main">
      <div class="lecture-meta">
        <span class="lecture-meta__badge">المحاضرة ${ordinal}</span>
        <span class="lecture-meta__series">${lecture.section}</span>
      </div>

      <article class="content">
${contentHtml}
      </article>

      ${nav}
    </main>

  </div>

  <!-- Footer -->
  <footer class="footer">
    ألف باء الزواج — منصة معرفية تعليمية
  </footer>

  <!-- Scroll to Top -->
  <button class="scroll-top" aria-label="العودة للأعلى">
    <span class="material-icons-round">arrow_upward</span>
  </button>

  <script src="js/app.js"></script>
</body>
</html>`;
}

// --- Generate Index Page ---
function generateIndexPage() {
  const sidebar = generateSidebar('');

  const cards = LECTURES.map((l, index) => {
    const ordinal = ORDINAL_NAMES[index] || `رقم ${l.id}`;
    return `        <a href="${l.slug}.html" class="lecture-card">
          <div class="lecture-card__number">${l.arabicNum}</div>
          <div class="lecture-card__content">
            <div class="lecture-card__title">${l.title}</div>
            <div class="lecture-card__meta">المحاضرة ${ordinal} · ${l.section}</div>
          </div>
        </a>`;
  }).join('\n\n');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ألف باء الزواج — منصة معرفية</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Header -->
  <header class="header">
    <button class="header__menu-btn" aria-label="القائمة">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
    </button>
    <div class="header__title">
      <a href="index.html">ألف باء الزواج</a>
    </div>
    <span class="header__subtitle">منصة معرفية</span>
  </header>

  <!-- Sidebar Overlay -->
  <div class="sidebar-overlay"></div>

  <!-- Layout -->
  <div class="layout">

    <!-- Sidebar -->
${sidebar}

    <!-- Main Content -->
    <main class="main main--home">
      <div class="home-hero">
        <div class="home-hero__icon">📖</div>
        <h1 class="home-hero__title">ألف باء الزواج</h1>
        <p class="home-hero__desc">
          سلسلة محاضرات معرفية شاملة تتناول أسس الزواج ومقدماته، من فهم النفس الإنسانية وحاجاتها إلى اختيار الشريك وبناء حياة زوجية سليمة.
        </p>
      </div>

      <!-- Intro Sections -->
      <div class="home-intro">

        <section class="intro-section">
          <div class="intro-section__icon">
            <span class="material-icons-round">school</span>
          </div>
          <h2 class="intro-section__title">عن السلسلة</h2>
          <p class="intro-section__text">
            "ألف باء الزواج" سلسلة مجالس معرفية يقدّمها الدكتور عبد الرحمن ذاكر الهاشمي، تتناول موضوع الزواج تناولًا تأسيسيًا شاملًا بدءًا من فهم النفس الإنسانية وأمشاجها وحاجاتها، مرورًا بتصحيح المغالطات والجهالات الشائعة حول العلاقات والزواج، وصولًا إلى التطبيقات العملية في مراحل الزواج المختلفة: من الاستعداد والخِطبة إلى عقد القِران والزفاف وبناء الحياة الزوجية. السلسلة لا تزال مستمرة.
          </p>
          <p class="intro-section__text">
            تنتمي هذه السلسلة إلى مشروع معرفي أوسع يشمل مجالس "ألف باء التربية" و"فقه النفس" و"اقرأ" و"تعارفوا"، وتُعدّ امتدادًا طبيعيًا لها في تطبيق فقه النفس على موضوع الزواج والأسرة.
          </p>
        </section>

        <section class="intro-section">
          <div class="intro-section__icon">
            <span class="material-icons-round">person</span>
          </div>
          <h2 class="intro-section__title">عن المحاضر</h2>
          <p class="intro-section__text">
            الدكتور عبد الرحمن ذاكر الهاشمي، باحث ومحاضر متخصص في فقه النفس الإنسانية ومعالجة إشكالاتها من منظور يجمع بين العلم الشرعي والفهم العميق للطبيعة البشرية. يقدّم مجالسه العلمية عبر قنوات التليجرام واليوتيوب، ويُعرف بمنهجه التأسيسي القائم على بناء الفهم الصحيح قبل الانتقال إلى التطبيق، وتصحيح المغالطات السائدة قبل تقديم البدائل.
          </p>
        </section>

        <section class="intro-section">
          <div class="intro-section__icon">
            <span class="material-icons-round">auto_stories</span>
          </div>
          <h2 class="intro-section__title">عن الموقع ومنهجيته</h2>
          <p class="intro-section__text">
            هذا الموقع يُعيد تقديم محتوى مجالس "ألف باء الزواج" المرئية في صورة نصية مُنظَّمة وسهلة التصفح والمراجعة. جرى تحويل كل محاضرة من تسجيلها المرئي على يوتيوب إلى نص مُعاد هيكلته مع الحفاظ الكامل على جميع الأفكار والأمثلة والشروحات والتنبيهات التي قدّمها المحاضر.
          </p>
          <p class="intro-section__text">
            المنهجية المتّبعة: تفريغ المحاضرة ثم إعادة تنظيم المحتوى في موضوعات منطقية بعناوين واضحة، مع إزالة التكرار اللفظي والحشو الشفهي الطبيعي في الكلام المرتجل، دون حذف أي فكرة أو مثال أو توجيه. الهدف أن يجد القارئ كل ما في المحاضرة المرئية في نص مكتوب يسهل الرجوع إليه والبحث فيه.
          </p>
        </section>

      </div>

      <h2 class="home-lectures-heading">المحاضرات</h2>

      <div class="lectures-grid">
${cards}
      </div>
    </main>

  </div>

  <!-- Footer -->
  <footer class="footer">
    ألف باء الزواج — منصة معرفية تعليمية
  </footer>

  <!-- Scroll to Top -->
  <button class="scroll-top" aria-label="العودة للأعلى">
    <span class="material-icons-round">arrow_upward</span>
  </button>

  <script src="js/app.js"></script>
</body>
</html>`;
}

// --- Main Build ---
function build() {
  const contentDir = path.join(__dirname, 'content', 'lectures');
  const outputDir = path.join(__dirname, 'website');

  console.log('🔨 Building ألف باء الزواج website...\n');

  // Build index page
  const indexHtml = generateIndexPage();
  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml, 'utf-8');
  console.log('  ✅ Built index.html');

  let built = 0;
  let skipped = 0;

  LECTURES.forEach((lecture, index) => {
    const mdFile = path.join(contentDir, `${lecture.slug}.md`);

    if (!fs.existsSync(mdFile)) {
      console.log(`  ⏭  Skipping ${lecture.slug} — markdown file not found`);
      skipped++;
      return;
    }

    const markdown = fs.readFileSync(mdFile, 'utf-8');
    const contentHtml = markdownToHtml(markdown);
    const pageHtml = generateLecturePage(lecture, contentHtml, index);

    const outputFile = path.join(outputDir, `${lecture.slug}.html`);
    fs.writeFileSync(outputFile, pageHtml, 'utf-8');

    console.log(`  ✅ Built ${lecture.slug}.html`);
    built++;
  });

  console.log(`\n📊 Done: ${built} built, ${skipped} skipped`);
  console.log(`📁 Output: ${outputDir}/`);
}

build();
