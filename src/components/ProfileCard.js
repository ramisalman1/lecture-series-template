'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PROFILE_INTRO, PRIVACY_NOTE, SOURCE_NOTE, PROFILE_SECTIONS } from '../lib/profile-card-data';

const STORAGE_KEY = 'profile-card-data';

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ProfileCard() {
  const [fields, setFields] = useState({});
  const [expanded, setExpanded] = useState({});
  const [mounted, setMounted] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const saveTimerRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    setFields(loadData());
    setMounted(true);
  }, []);

  const debouncedSave = useCallback((newFields) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveData(newFields);
    }, 500);
  }, []);

  function handleField(sectionId, fieldId, value) {
    const key = `${sectionId}-${fieldId}`;
    const next = { ...fields, [key]: value };
    if (!value.trim()) delete next[key];
    setFields(next);
    debouncedSave(next);
  }

  function toggleSection(sectionId) {
    setExpanded(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function getFieldValue(sectionId, fieldId) {
    return fields[`${sectionId}-${fieldId}`] || '';
  }

  function getSectionFilledCount(sectionId) {
    const section = PROFILE_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.fields.filter(f => fields[`${sectionId}-${f.id}`]?.trim()).length;
  }

  function getSectionHasAny(sectionId) {
    return getSectionFilledCount(sectionId) > 0;
  }

  const totalFields = PROFILE_SECTIONS.reduce((sum, s) => sum + s.fields.length, 0);
  const totalFilled = PROFILE_SECTIONS.reduce((sum, s) => sum + getSectionFilledCount(s.id), 0);
  const progressPct = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0;

  function getFilledSections() {
    return PROFILE_SECTIONS.map((section, sIdx) => {
      const filledFields = section.fields.filter(f => fields[`${section.id}-${f.id}`]?.trim());
      return { ...section, sIdx, filledFields };
    }).filter(s => s.filledFields.length > 0);
  }

  function buildPdfElement(withLabels) {
    const container = document.createElement('div');
    container.style.cssText = 'direction:rtl;font-family:sans-serif;padding:32px;color:#1a1a1a;line-height:1.9;';

    getFilledSections().forEach((section, idx) => {
      const sectionTitle = document.createElement('h2');
      sectionTitle.textContent = `${section.sIdx + 1}. ${section.title}`;
      sectionTitle.style.cssText = `font-size:17px;color:#1565C0;margin:${idx === 0 ? '0' : '24px'} 0 12px;padding-bottom:6px;border-bottom:1px solid #ddd;`;
      container.appendChild(sectionTitle);

      section.filledFields.forEach(f => {
        const value = fields[`${section.id}-${f.id}`].trim();

        if (withLabels) {
          const label = document.createElement('p');
          label.textContent = f.label + ':';
          label.style.cssText = 'font-weight:bold;font-size:14px;margin:10px 0 2px;color:#333;';
          container.appendChild(label);
        }

        const val = document.createElement('p');
        val.textContent = value;
        val.style.cssText = `font-size:14px;margin:${withLabels ? '0' : '10px'} 0 12px;white-space:pre-wrap;color:#444;`;
        container.appendChild(val);
      });
    });

    return container;
  }

  async function downloadPdf() {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const container = buildPdfElement(showLabels);

      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: 'بطاقة-التعارف.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(container).save();
    } finally {
      setExporting(false);
      setShowPreview(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="profile-card-page__content">
      {/* Privacy Banner */}
      <div className="profile-card-page__privacy">
        <span className="material-icons-round">security</span>
        <span>{PRIVACY_NOTE}</span>
      </div>

      {/* Source Reference Banner */}
      <div className="profile-card-page__source">
        <span className="material-icons-round">menu_book</span>
        <span>
          {SOURCE_NOTE}{' '}
          <Link href="/lectures/lecture-5">المجلس الخامس</Link>
          {' · '}
          <Link href="/lectures/lecture-14">المجلس الرابع عشر</Link>
        </span>
      </div>

      {/* Intro Description */}
      <div className="profile-card-page__intro">
        <p>{PROFILE_INTRO}</p>
      </div>

      {/* Progress */}
      <div className="profile-card-page__progress">
        <div className="profile-card-page__progress-header">
          <span className="profile-card-page__progress-label">التقدم</span>
          <span className="profile-card-page__progress-count">{totalFilled} / {totalFields} حقل</span>
        </div>
        <div className="profile-card-page__progress-bar">
          <div className="profile-card-page__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="profile-card-page__toolbar">
        <button
          className="profile-card-page__toolbar-btn"
          onClick={() => setShowPreview(true)}
          disabled={totalFilled === 0}
        >
          <span className="material-icons-round">file_download</span>
          تصدير PDF
        </button>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="pdf-preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="pdf-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="pdf-preview-modal__header">
              <span className="pdf-preview-modal__title">معاينة قبل التصدير</span>
              <button className="pdf-preview-modal__close" onClick={() => setShowPreview(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div className="pdf-preview-modal__options">
              <label className="pdf-preview-modal__toggle">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={e => setShowLabels(e.target.checked)}
                />
                <span>إظهار عناوين الأسئلة</span>
              </label>
            </div>

            <div className="pdf-preview-modal__content" dir="rtl">
              {getFilledSections().map((section, idx) => (
                <div key={section.id}>
                  <h3 className="pdf-preview-modal__section-title">
                    {section.sIdx + 1}. {section.title}
                  </h3>
                  {section.filledFields.map(f => (
                    <div key={f.id} className="pdf-preview-modal__field">
                      {showLabels && (
                        <p className="pdf-preview-modal__label">{f.label}:</p>
                      )}
                      <p className="pdf-preview-modal__value">{fields[`${section.id}-${f.id}`].trim()}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="pdf-preview-modal__footer">
              <button
                className="pdf-preview-modal__btn pdf-preview-modal__btn--secondary"
                onClick={() => setShowPreview(false)}
              >
                إلغاء
              </button>
              <button
                className="pdf-preview-modal__btn pdf-preview-modal__btn--primary"
                onClick={downloadPdf}
                disabled={exporting}
              >
                <span className="material-icons-round">{exporting ? 'hourglass_empty' : 'file_download'}</span>
                {exporting ? 'جارٍ التصدير...' : 'تحميل PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Cards */}
      {PROFILE_SECTIONS.map((section, sIdx) => {
        const isExpanded = expanded[section.id];
        const filledCount = getSectionFilledCount(section.id);
        const hasAny = getSectionHasAny(section.id);

        return (
          <div key={section.id} className={`profile-card${isExpanded ? ' profile-card--expanded' : ''}${hasAny ? ' profile-card--answered' : ''}`}>
            <button className="profile-card__header" onClick={() => toggleSection(section.id)}>
              <span className="material-icons-round profile-card__icon">{section.icon}</span>
              <div className="profile-card__title-wrap">
                <span className="profile-card__number">{sIdx + 1}</span>
                <span className="profile-card__title">{section.title}</span>
              </div>
              <span className="profile-card__badge">{section.fields.length}</span>
              {hasAny && (
                <span className="material-icons-round profile-card__check">check_circle</span>
              )}
              {hasAny && filledCount < section.fields.length && (
                <span className="profile-card__partial">{filledCount}/{section.fields.length}</span>
              )}
              <span className={`material-icons-round profile-card__arrow${isExpanded ? ' profile-card__arrow--open' : ''}`}>
                expand_more
              </span>
            </button>

            {isExpanded && (
              <div className="profile-card__body">
                {section.description && (
                  <div className="profile-card__desc">
                    <p>{section.description}</p>
                  </div>
                )}

                <div className="profile-card__fields">
                  {section.fields.map(f => (
                    <div key={f.id} className="profile-card__field">
                      <label className="profile-card__field-label">{f.label}</label>
                      <textarea
                        className="profile-card__textarea"
                        placeholder={f.placeholder}
                        value={getFieldValue(section.id, f.id)}
                        onChange={(e) => handleField(section.id, f.id, e.target.value)}
                        dir="rtl"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
