'use client';

import { useState, useRef, useCallback } from 'react';
import LectureCard from './LectureCard';
import { ORDINAL_NAMES } from '../lib/constants';
import { trackEvent } from '../lib/analytics';

export default function SearchFilter({ lectures }) {
  const [query, setQuery] = useState('');
  const searchTimerRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setQuery(value);
    clearTimeout(searchTimerRef.current);
    const trimmed = value.trim();
    if (trimmed.length >= 2) {
      searchTimerRef.current = setTimeout(() => {
        trackEvent('search', { query: trimmed });
      }, 500);
    }
  }, []);

  const filtered = query.trim()
    ? lectures.filter((l) => {
        const q = query.trim();
        return (
          l.title.includes(q) ||
          l.shortTitle.includes(q) ||
          l.section.includes(q) ||
          String(l.id).includes(q) ||
          l.arabicNum.includes(q)
        );
      })
    : lectures;

  return (
    <>
      <div className="search-filter">
        <span className="material-icons-round search-filter__icon">search</span>
        <input
          type="text"
          className="search-filter__input"
          placeholder="ابحث في المجالس..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button
            className="search-filter__clear"
            onClick={() => setQuery('')}
            aria-label="مسح البحث"
          >
            <span className="material-icons-round">close</span>
          </button>
        )}
      </div>

      <h2 className="home-lectures-heading">
        المجالس
        {query && ` (${filtered.length})`}
      </h2>

      <div className="lectures-grid">
        {filtered.length > 0 ? (
          filtered.map((lecture) => (
            <LectureCard
              key={lecture.slug}
              lecture={lecture}
              ordinal={ORDINAL_NAMES[lecture.id - 1] || `رقم ${lecture.id}`}
            />
          ))
        ) : (
          <p className="search-filter__empty">لا توجد نتائج</p>
        )}
      </div>
    </>
  );
}
