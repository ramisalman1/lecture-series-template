'use client';

import { useState, useEffect } from 'react';
import { REDFLAGS_INTRO, REDFLAGS_CATEGORIES } from '../lib/redflags-data';
import { trackEvent } from '../lib/analytics';

const STORAGE_KEY = 'redflags-checked';

function loadChecked() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveChecked(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function RedFlagsChecklist() {
  const [checked, setChecked] = useState({});
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setChecked(loadChecked());
    setMounted(true);
  }, []);

  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] };
    if (!next[id]) delete next[id];
    setChecked(next);
    saveChecked(next);
    trackEvent('redflag_toggle', { flag: id, checked: !checked[id] });
  }

  function toggleSection(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (!mounted) return null;

  const allItems = REDFLAGS_CATEGORIES.flatMap(c => c.items.map(i => i.id));
  const flaggedCount = allItems.filter(id => checked[id]).length;

  return (
    <div className="redflags-page__content">
      {/* Intro */}
      <div className="redflags-page__intro">
        <span className="material-icons-round">info</span>
        <span>{REDFLAGS_INTRO}</span>
      </div>

      {/* Summary */}
      <div className="redflags-page__summary">
        <div className="redflags-page__summary-icon">
          <span className="material-icons-round">flag</span>
        </div>
        <div className="redflags-page__summary-text">
          {flaggedCount === 0
            ? 'لم تُحدّد أي علامات بعد — راجع القائمة وحدّد ما ينطبق على حالتك'
            : `حدّدت ${flaggedCount} من ${allItems.length} علامة`}
        </div>
        {flaggedCount > 0 && flaggedCount <= 3 && (
          <div className="redflags-page__advice redflags-page__advice--low">
            <span className="material-icons-round">check_circle</span>
            عدد قليل — قد تكون قابلة للتعامل. ادرسها بعناية مع مستشار.
          </div>
        )}
        {flaggedCount > 3 && flaggedCount <= 7 && (
          <div className="redflags-page__advice redflags-page__advice--medium">
            <span className="material-icons-round">warning</span>
            عدد ملحوظ — تحتاج وقفة جادّة واستشارة قبل الإقدام.
          </div>
        )}
        {flaggedCount > 7 && (
          <div className="redflags-page__advice redflags-page__advice--high">
            <span className="material-icons-round">dangerous</span>
            عدد كبير — أعِد التفكير جدّيًّا واستشر أهل الخبرة.
          </div>
        )}
      </div>

      {/* Categories */}
      {REDFLAGS_CATEGORIES.map(category => {
        const catFlagged = category.items.filter(i => checked[i.id]).length;
        const isOpen = expanded[category.id] !== false;

        return (
          <div key={category.id} className="rf-section">
            <button className="rf-section__header" onClick={() => toggleSection(category.id)}>
              <span className="material-icons-round rf-section__icon">{category.icon}</span>
              <div className="rf-section__title-wrap">
                <span className="rf-section__title">{category.title}</span>
                <span className="rf-section__subtitle">{category.description}</span>
              </div>
              {catFlagged > 0 && (
                <span className="rf-section__badge">{catFlagged}</span>
              )}
              <span className={`material-icons-round rf-section__arrow${isOpen ? ' rf-section__arrow--open' : ''}`}>
                expand_more
              </span>
            </button>

            {isOpen && (
              <div className="rf-section__body">
                {category.items.map(item => (
                  <label key={item.id} className={`rf-item${checked[item.id] ? ' rf-item--flagged' : ''}`}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="rf-item__check"
                    />
                    <span className={`material-icons-round rf-item__flag${checked[item.id] ? ' rf-item__flag--active' : ''}`}>
                      flag
                    </span>
                    <div className="rf-item__content">
                      <span className="rf-item__text">{item.text}</span>
                      <span className="rf-item__detail">{item.detail}</span>
                      <span className="rf-item__source">{item.source}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
