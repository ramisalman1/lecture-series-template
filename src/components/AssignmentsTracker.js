'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ASSIGNMENTS_INTRO, ONGOING_ASSIGNMENTS, ASSIGNMENT_SECTIONS } from '../lib/assignments-data';
import { trackEvent } from '../lib/analytics';

const STORAGE_KEY = 'assignments-progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function AssignmentsTracker() {
  const [checked, setChecked] = useState({});
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    setChecked(loadProgress());
    setMounted(true);
  }, []);

  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] };
    if (!next[id]) delete next[id];
    setChecked(next);
    saveProgress(next);
    trackEvent('assignment_toggle', { assignment: id, checked: !checked[id] });
  }

  function toggleSection(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  if (!mounted) return null;

  const allItems = [
    ...ONGOING_ASSIGNMENTS.map(a => a.id),
    ...ASSIGNMENT_SECTIONS.flatMap(s => s.items.map(i => i.id)),
  ];
  const totalCount = allItems.length;
  const doneCount = allItems.filter(id => checked[id]).length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const ongoingDone = ONGOING_ASSIGNMENTS.filter(a => checked[a.id]).length;

  return (
    <div className="assignments-page__content">
      {/* Intro */}
      <div className="assignments-page__intro">
        <span className="material-icons-round">info</span>
        <span>{ASSIGNMENTS_INTRO}</span>
      </div>

      {/* Progress */}
      <div className="assignments-page__progress">
        <div className="assignments-page__progress-header">
          <span className="assignments-page__progress-label">الالتزام</span>
          <span className="assignments-page__progress-count">{doneCount} / {totalCount}</span>
        </div>
        <div className="assignments-page__progress-bar">
          <div className="assignments-page__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="assignments-page__progress-msg">
          {pct === 100 ? 'أتممت جميع التكليفات — بارك الله فيك!' :
           pct >= 75 ? 'أوشكت على الإتمام — استمر!' :
           pct >= 50 ? 'تجاوزت النصف — أحسنت!' :
           pct > 0 ? 'بداية طيبة — واصل!' :
           'ابدأ بتسجيل التزامك بالتكليفات'}
        </div>
      </div>

      {/* Ongoing */}
      <div className="assign-section">
        <button className="assign-section__header" onClick={() => toggleSection('ongoing')}>
          <span className="material-icons-round assign-section__icon">repeat</span>
          <div className="assign-section__title-wrap">
            <span className="assign-section__title">تكليفات مستمرة</span>
            <span className="assign-section__subtitle">مطلوبة طوال السلسلة</span>
          </div>
          <span className="assign-section__badge">{ongoingDone}/{ONGOING_ASSIGNMENTS.length}</span>
          <span className={`material-icons-round assign-section__arrow${expanded['ongoing'] !== false ? ' assign-section__arrow--open' : ''}`}>
            expand_more
          </span>
        </button>

        {expanded['ongoing'] !== false && (
          <div className="assign-section__body">
            {ONGOING_ASSIGNMENTS.map(a => (
              <label key={a.id} className={`assign-item${checked[a.id] ? ' assign-item--done' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!checked[a.id]}
                  onChange={() => toggle(a.id)}
                  className="assign-item__check"
                />
                <span className={`material-icons-round assign-item__icon`}>{a.icon}</span>
                <div className="assign-item__content">
                  <span className="assign-item__text">{a.text}</span>
                  <span className="assign-item__detail">{a.detail}</span>
                  <span className="assign-item__source">{a.source}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      {ASSIGNMENT_SECTIONS.map(section => {
        const sectionDone = section.items.filter(i => checked[i.id]).length;
        const isOpen = expanded[section.id];

        return (
          <div key={section.id} className="assign-section">
            <button className="assign-section__header" onClick={() => toggleSection(section.id)}>
              <span className="material-icons-round assign-section__icon">{section.icon}</span>
              <div className="assign-section__title-wrap">
                <span className="assign-section__title">{section.title}</span>
                <span className="assign-section__subtitle">{section.description}</span>
              </div>
              <span className="assign-section__badge">{sectionDone}/{section.items.length}</span>
              <span className={`material-icons-round assign-section__arrow${isOpen ? ' assign-section__arrow--open' : ''}`}>
                expand_more
              </span>
            </button>

            {isOpen && (
              <div className="assign-section__body">
                {section.items.map(item => (
                  <label key={item.id} className={`assign-item${checked[item.id] ? ' assign-item--done' : ''}`}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="assign-item__check"
                    />
                    <div className="assign-item__content">
                      <span className="assign-item__text">{item.text}</span>
                      <span className="assign-item__detail">{item.detail}</span>
                      <span className="assign-item__source">{item.source}</span>
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
