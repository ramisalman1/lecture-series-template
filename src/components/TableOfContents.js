'use client';

import { useState, useEffect } from 'react';

export default function TableOfContents({ html }) {
  const [headings, setHeadings] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
    const found = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      found.push({
        level: Number(match[1]),
        id: match[2],
        text: match[3].replace(/<[^>]+>/g, ''),
      });
    }

    if (found.length === 0) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      doc.querySelectorAll('h2, h3').forEach((el) => {
        if (!el.id) {
          el.id = el.textContent.trim().replace(/\s+/g, '-');
        }
        found.push({
          level: Number(el.tagName[1]),
          id: el.id,
          text: el.textContent,
        });
      });
    }

    setHeadings(found);
  }, [html]);

  if (headings.length === 0) return null;

  return (
    <div className="toc">
      <button className="toc__toggle" onClick={() => setOpen(!open)}>
        <span className="material-icons-round">list</span>
        <span>فهرس المجلس</span>
        <span className={`material-icons-round toc__arrow${open ? ' toc__arrow--open' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <nav className="toc__list">
          {headings.map((h, i) => (
            <a
              key={i}
              href={`#${h.id}`}
              className={`toc__link toc__link--h${h.level}`}
              onClick={() => setOpen(false)}
            >
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
