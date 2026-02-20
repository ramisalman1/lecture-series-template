'use client';

import { useState } from 'react';

export default function NeedsChecklist({ sections, intro, notes, generalTips }) {
  const [expanded, setExpanded] = useState({});

  function toggleSection(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="needs-page__content">
      {/* Intro */}
      <div className="needs-page__intro">
        <span className="material-icons-round">info</span>
        <span>{intro}</span>
      </div>

      {/* Notes */}
      {notes && notes.length > 0 && (
        <div className="needs-page__notes">
          {notes.map((note, i) => (
            <div key={i} className="needs-page__note">
              <span className="material-icons-round">lightbulb</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map(group => (
        <div key={group.id} className="needs-group">
          <h2 className="needs-group__title">
            <span className="material-icons-round">auto_stories</span>
            {group.groupTitle}
          </h2>

          {group.categories.map(category => {
            const isOpen = expanded[category.id] !== false;
            const hasNeeds = category.needs && category.needs.length > 0;
            const hasBeyond = category.beyondNeed && category.beyondNeed.length > 0;
            const hasBeyondExtra = category.beyondNeedExtra;
            const hasExtraNotes = category.extraNotes && category.extraNotes.length > 0;
            const isEmpty = !hasNeeds && !hasBeyond && !hasBeyondExtra && !hasExtraNotes;

            return (
              <div key={category.id} className="needs-section">
                <button className="needs-section__header" onClick={() => toggleSection(category.id)}>
                  <span className="material-icons-round needs-section__icon">{category.icon}</span>
                  <span className="needs-section__title">{category.title}</span>
                  <span className={`material-icons-round needs-section__arrow${isOpen ? ' needs-section__arrow--open' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="needs-section__body">
                    {isEmpty && (
                      <p className="needs-section__empty">حاجة بذاتها دون تفاصيل إضافية.</p>
                    )}

                    {hasNeeds && (
                      <div className="needs-list">
                        <h4 className="needs-list__label">
                          <span className="material-icons-round">check_circle</span>
                          الحاجات
                        </h4>
                        <ul className="needs-list__items">
                          {category.needs.map((item, i) => (
                            <li key={i} className="needs-list__item">
                              <span className="needs-list__bullet" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasBeyond && (
                      <div className="needs-list needs-list--beyond">
                        <h4 className="needs-list__label needs-list__label--beyond">
                          <span className="material-icons-round">arrow_upward</span>
                          ما فوق الحاجة
                        </h4>
                        <ul className="needs-list__items">
                          {category.beyondNeed.map((item, i) => (
                            <li key={i} className="needs-list__item needs-list__item--beyond">
                              <span className="needs-list__bullet needs-list__bullet--beyond" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasBeyondExtra && (
                      <div className="needs-list needs-list--beyond">
                        <h4 className="needs-list__label needs-list__label--beyond">
                          <span className="material-icons-round">arrow_upward</span>
                          {category.beyondNeedExtra.title}
                        </h4>
                        <ul className="needs-list__items">
                          {category.beyondNeedExtra.items.map((item, i) => (
                            <li key={i} className="needs-list__item needs-list__item--beyond">
                              <span className="needs-list__bullet needs-list__bullet--beyond" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {hasExtraNotes && (
                      <div className="needs-list needs-list--notes">
                        <h4 className="needs-list__label needs-list__label--notes">
                          <span className="material-icons-round">tips_and_updates</span>
                          ملاحظات إضافية
                        </h4>
                        <ul className="needs-list__items">
                          {category.extraNotes.map((item, i) => (
                            <li key={i} className="needs-list__item">
                              <span className="needs-list__bullet needs-list__bullet--notes" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* General Tips */}
      {generalTips && generalTips.length > 0 && (
        <div className="needs-group">
          <h2 className="needs-group__title">
            <span className="material-icons-round">emoji_objects</span>
            نصائح عامة
          </h2>
          <div className="needs-tips">
            {generalTips.map((tip, i) => (
              <div key={i} className="needs-tips__item">
                <span className="material-icons-round">star</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
