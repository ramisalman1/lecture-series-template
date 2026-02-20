'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QA_INTRO, QA_CATEGORIES } from '../lib/qa-data';

export default function QAIndex() {
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  function toggleCategory(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = searchTerm.trim()
    ? QA_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item => item.question.includes(searchTerm)),
      })).filter(cat => cat.items.length > 0)
    : QA_CATEGORIES;

  const totalQuestions = QA_CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="qa-page__content">
      {/* Intro */}
      <div className="qa-page__intro">
        <span className="material-icons-round">info</span>
        <span>{QA_INTRO}</span>
      </div>

      {/* Stats */}
      <div className="qa-page__stats">
        <div className="qa-page__stat">
          <span className="material-icons-round">quiz</span>
          <span>{totalQuestions} سؤال</span>
        </div>
        <div className="qa-page__stat">
          <span className="material-icons-round">category</span>
          <span>{QA_CATEGORIES.length} أقسام</span>
        </div>
      </div>

      {/* Search */}
      <div className="qa-page__search">
        <span className="material-icons-round">search</span>
        <input
          type="text"
          placeholder="ابحث في الأسئلة..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="qa-page__search-input"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="qa-page__search-clear">
            <span className="material-icons-round">close</span>
          </button>
        )}
      </div>

      {/* Categories */}
      {filtered.map(category => {
        const isOpen = expanded[category.id] !== false;
        return (
          <div key={category.id} className="qa-section">
            <button className="qa-section__header" onClick={() => toggleCategory(category.id)}>
              <span className="material-icons-round qa-section__icon">{category.icon}</span>
              <div className="qa-section__title-wrap">
                <span className="qa-section__title">{category.title}</span>
                <span className="qa-section__count">{category.items.length} أسئلة</span>
              </div>
              <span className={`material-icons-round qa-section__arrow${isOpen ? ' qa-section__arrow--open' : ''}`}>
                expand_more
              </span>
            </button>

            {isOpen && (
              <div className="qa-section__body">
                {category.items.map(item => (
                  <Link
                    key={item.id}
                    href={`/lectures/${item.lectureSlug}#${item.sectionId}`}
                    className="qa-item-link"
                  >
                    <span className="material-icons-round qa-item-link__icon">help_outline</span>
                    <span className="qa-item-link__text">{item.question}</span>
                    <span className="qa-item-link__source">{item.source}</span>
                    <span className="material-icons-round qa-item-link__arrow">arrow_back</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="qa-page__empty">
          <span className="material-icons-round">search_off</span>
          <p>لا توجد نتائج لـ &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
