'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Strip Arabic tashkeel diacritics + normalize alef variants
function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // tashkeel
    .replace(/[\u0622\u0623\u0625]/g, '\u0627') // alef variants → bare alef
    .replace(/\u0629/g, '\u0647'); // taa marbuta → haa
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();

  // Load index on first open
  useEffect(() => {
    if (open && !index) {
      setLoading(true);
      fetch('/search-index.json')
        .then((r) => r.json())
        .then((data) => {
          // Pre-compute normalized text for each paragraph
          data.paragraphs.forEach((p) => {
            p._n = normalizeArabic(p.t);
          });
          setIndex(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [open, index]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  // Debounced search
  const doSearch = useCallback(
    (q) => {
      if (!index || !q.trim()) {
        setResults([]);
        return;
      }

      const needle = normalizeArabic(q.trim());
      if (needle.length < 2) {
        setResults([]);
        return;
      }

      const matched = [];
      const MAX = 50;

      for (const para of index.paragraphs) {
        if (matched.length >= MAX) break;
        if (para._n.includes(needle)) {
          matched.push(para);
        }
      }

      setResults(matched);
    },
    [index]
  );

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 250);
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleResultClick = (slug, pIdx) => {
    onClose();
    router.push(`/lectures/${slug}#p-${pIdx}`);
  };

  if (!open) return null;

  // Group results by lecture
  const grouped = [];
  const lectureMap = new Map();
  for (const r of results) {
    if (!lectureMap.has(r.l)) {
      const group = { lecture: index.lectures[r.l], items: [] };
      lectureMap.set(r.l, group);
      grouped.push(group);
    }
    lectureMap.get(r.l).items.push(r);
  }

  // Highlight matching text in snippet
  const highlight = (text, q) => {
    const needle = normalizeArabic(q.trim());
    if (!needle || needle.length < 2) return text;

    const normText = normalizeArabic(text);
    const parts = [];
    let searchFrom = 0;
    let origIdx = 0;

    // Find matches in normalized text, map back to original
    while (searchFrom < normText.length) {
      const matchPos = normText.indexOf(needle, searchFrom);
      if (matchPos === -1) {
        parts.push(text.slice(origIdx));
        break;
      }
      // We need to map normText positions to original text positions
      // Since normalization only removes characters (diacritics), we need a mapping
      break; // Fall back to simpler approach
    }

    // Simpler approach: find and highlight in original text by scanning
    return highlightSimple(text, q);
  };

  const highlightSimple = (text, q) => {
    const needle = normalizeArabic(q.trim());
    if (!needle || needle.length < 2) return text;

    // Build a position map: for each position in normalized text, track the original position
    const normChars = [];
    const origPositions = [];
    for (let i = 0; i < text.length; i++) {
      const norm = normalizeArabic(text[i]);
      if (norm.length > 0) {
        normChars.push(norm);
        origPositions.push(i);
      }
    }
    const normText = normChars.join('');

    const ranges = [];
    let searchFrom = 0;
    while (searchFrom < normText.length) {
      const pos = normText.indexOf(needle, searchFrom);
      if (pos === -1) break;
      const origStart = origPositions[pos];
      const origEnd = pos + needle.length < origPositions.length
        ? origPositions[pos + needle.length]
        : text.length;
      ranges.push([origStart, origEnd]);
      searchFrom = pos + 1;
    }

    if (ranges.length === 0) return text;

    const parts = [];
    let last = 0;
    for (const [start, end] of ranges) {
      if (start > last) parts.push(<span key={`t${last}`}>{text.slice(last, start)}</span>);
      parts.push(<mark key={`m${start}`} className="search-highlight">{text.slice(start, end)}</mark>);
      last = end;
    }
    if (last < text.length) parts.push(<span key={`t${last}`}>{text.slice(last)}</span>);
    return parts;
  };

  // Get snippet around match
  const getSnippet = (text, q) => {
    const needle = normalizeArabic(q.trim());
    const normText = normalizeArabic(text);
    const pos = normText.indexOf(needle);
    if (pos === -1) return text.slice(0, 120);

    // Map normalized position back to original
    let origPos = 0;
    let normCount = 0;
    for (let i = 0; i < text.length && normCount < pos; i++) {
      if (normalizeArabic(text[i]).length > 0) normCount++;
      origPos = i + 1;
    }

    const snippetStart = Math.max(0, origPos - 40);
    const snippetEnd = Math.min(text.length, origPos + 80);
    let snippet = text.slice(snippetStart, snippetEnd);
    if (snippetStart > 0) snippet = '...' + snippet;
    if (snippetEnd < text.length) snippet = snippet + '...';
    return snippet;
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <span className="material-icons-round search-header__icon">search</span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="ابحث في محتوى المجالس..."
            value={query}
            onChange={handleInput}
            dir="rtl"
          />
          <kbd className="search-kbd search-kbd--desktop">Esc</kbd>
          <button className="search-close-btn" onClick={onClose} aria-label="إغلاق البحث">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="search-body">
          {loading && (
            <div className="search-status">جارٍ تحميل فهرس البحث...</div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && index && (
            <div className="search-status">لا توجد نتائج لـ &quot;{query}&quot;</div>
          )}

          {!loading && query.trim().length > 0 && query.trim().length < 2 && (
            <div className="search-status">اكتب حرفين على الأقل للبحث</div>
          )}

          {!loading && !query.trim() && index && (
            <div className="search-status">ابحث في {index.paragraphs.length.toLocaleString('ar-EG')} فقرة عبر {index.lectures.length} مجلسًا</div>
          )}

          {results.length > 0 && (
            <div className="search-count">
              {results.length >= 50 ? '+٥٠' : results.length} نتيجة
            </div>
          )}

          <div className="search-results">
            {grouped.map((group) => (
              <div key={group.lecture.slug} className="search-group">
                <div className="search-group__header">
                  <span className="search-group__num">{group.lecture.arabicNum}</span>
                  <span className="search-group__title">{group.lecture.shortTitle}</span>
                  <span className="search-group__section">{group.lecture.section}</span>
                </div>
                {group.items.map((item) => {
                  const snippet = getSnippet(item.t, query);
                  return (
                    <button
                      key={`${item.l}-${item.p}`}
                      className="search-result"
                      onClick={() => handleResultClick(group.lecture.slug, item.p)}
                    >
                      {item.h && (
                        <span className="search-result__heading">{item.h}</span>
                      )}
                      <span className="search-result__text">
                        {highlight(snippet, query)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
