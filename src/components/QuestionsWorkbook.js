'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { INTRO_GUIDELINES, QUESTIONS_SECTIONS, CLOSING_MESSAGE, CLOSING_DUA } from '../lib/questions-data';

const STORAGE_KEY = 'questions-answers';

function loadAnswers() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    // Migrate old keys (without -mine/-partner suffix) to new format
    const migrated = {};
    let didMigrate = false;
    for (const [key, value] of Object.entries(raw)) {
      if (!key.endsWith('-mine') && !key.endsWith('-partner')) {
        migrated[`${key}-mine`] = value;
        didMigrate = true;
      } else {
        migrated[key] = value;
      }
    }
    if (didMigrate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch { return {}; }
}

function saveAnswers(answers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export default function QuestionsWorkbook() {
  const [answers, setAnswers] = useState({});
  const [expanded, setExpanded] = useState({});
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const saveTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAnswers(loadAnswers());
    setMounted(true);
  }, []);

  const debouncedSave = useCallback((newAnswers) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveAnswers(newAnswers);
    }, 500);
  }, []);

  function handleAnswer(sectionId, qIndex, suffix, value) {
    const key = `${sectionId}-${qIndex}-${suffix}`;
    const next = { ...answers, [key]: value };
    if (!value.trim()) delete next[key];
    setAnswers(next);
    debouncedSave(next);
  }

  function toggleSection(sectionId) {
    setExpanded(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function questionHasAnswer(sectionId, qIndex) {
    return !!(
      answers[`${sectionId}-${qIndex}-mine`]?.trim() ||
      answers[`${sectionId}-${qIndex}-partner`]?.trim()
    );
  }

  function getSectionAnswered(sectionId) {
    return QUESTIONS_SECTIONS
      .find(s => s.id === sectionId)
      ?.questions.some((_, i) => questionHasAnswer(sectionId, i)) || false;
  }

  function getSectionAnsweredCount(sectionId) {
    const section = QUESTIONS_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.filter((_, i) => questionHasAnswer(sectionId, i)).length;
  }

  const totalSections = QUESTIONS_SECTIONS.length;
  const engagedSections = QUESTIONS_SECTIONS.filter(s => getSectionAnswered(s.id)).length;
  const progressPct = totalSections > 0 ? Math.round((engagedSections / totalSections) * 100) : 0;

  const totalQuestions = QUESTIONS_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
  const totalAnswered = QUESTIONS_SECTIONS.reduce((sum, s) => {
    return sum + s.questions.filter((_, i) => questionHasAnswer(s.id, i)).length;
  }, 0);

  const [exportingPdf, setExportingPdf] = useState(false);

  function exportAnswers() {
    const data = JSON.stringify(answers, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ola-questions-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPdf() {
    setExportingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const container = document.createElement('div');
      container.style.cssText = 'direction:rtl;font-family:sans-serif;padding:32px;color:#1a1a1a;line-height:1.9;';

      QUESTIONS_SECTIONS.forEach((section, sIdx) => {
        const answered = section.questions
          .map((q, i) => ({
            question: q,
            mine: answers[`${section.id}-${i}-mine`]?.trim() || '',
            partner: answers[`${section.id}-${i}-partner`]?.trim() || '',
          }))
          .filter(q => q.mine || q.partner);
        if (answered.length === 0) return;

        const title = document.createElement('h2');
        title.textContent = `${sIdx + 1}. ${section.title}`;
        title.style.cssText = `font-size:17px;color:#c26363;margin:${sIdx === 0 ? '0' : '24px'} 0 14px;padding-bottom:6px;border-bottom:1px solid #ddd;`;
        container.appendChild(title);

        answered.forEach(q => {
          const qText = document.createElement('p');
          qText.textContent = q.question;
          qText.style.cssText = 'font-weight:bold;font-size:13px;margin:12px 0 6px;color:#333;';
          container.appendChild(qText);

          if (q.mine) {
            const label = document.createElement('p');
            label.textContent = 'إجابتي:';
            label.style.cssText = 'font-size:12px;color:#c26363;font-weight:600;margin:4px 0 2px;';
            container.appendChild(label);

            const val = document.createElement('p');
            val.textContent = q.mine;
            val.style.cssText = 'font-size:13px;margin:0 0 8px;white-space:pre-wrap;color:#444;';
            container.appendChild(val);
          }

          if (q.partner) {
            const label = document.createElement('p');
            label.textContent = 'ملاحظاتي على إجابة الطرف الآخر:';
            label.style.cssText = 'font-size:12px;color:#e65100;font-weight:600;margin:4px 0 2px;';
            container.appendChild(label);

            const val = document.createElement('p');
            val.textContent = q.partner;
            val.style.cssText = 'font-size:13px;margin:0 0 8px;white-space:pre-wrap;color:#444;';
            container.appendChild(val);
          }
        });
      });

      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: 'كراسة-أسئلة-الخِطبة.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(container).save();
    } finally {
      setExportingPdf(false);
    }
  }

  function importAnswers(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (typeof imported !== 'object' || Array.isArray(imported)) return;
        // Migrate old-format keys from imported data too
        const migratedImport = {};
        for (const [key, value] of Object.entries(imported)) {
          if (!key.endsWith('-mine') && !key.endsWith('-partner')) {
            migratedImport[`${key}-mine`] = value;
          } else {
            migratedImport[key] = value;
          }
        }
        const merged = { ...answers, ...migratedImport };
        setAnswers(merged);
        saveAnswers(merged);
      } catch { /* invalid JSON */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // Preview mode: compute sections that have at least one answer
  const previewSections = previewMode
    ? QUESTIONS_SECTIONS.map(section => ({
        ...section,
        answeredQuestions: section.questions
          .map((q, i) => ({
            question: q,
            index: i,
            mine: answers[`${section.id}-${i}-mine`]?.trim() || '',
            partner: answers[`${section.id}-${i}-partner`]?.trim() || '',
          }))
          .filter(q => q.mine || q.partner),
      })).filter(s => s.answeredQuestions.length > 0)
    : [];

  if (!mounted) return null;

  return (
    <div className="questions-page__content">
      {/* Privacy Banner */}
      <div className="questions-page__privacy">
        <span className="material-icons-round">security</span>
        <span>إجاباتك محفوظة على جهازك فقط ولا تُشارك مع أي طرف</span>
      </div>

      {/* Progress */}
      <div className="questions-page__progress">
        <div className="questions-page__progress-header">
          <span className="questions-page__progress-label">التقدم</span>
          <span className="questions-page__progress-count">{engagedSections} / {totalSections} موضوع</span>
        </div>
        <div className="questions-page__progress-bar">
          <div className="questions-page__progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="questions-page__progress-detail">
          {totalAnswered} / {totalQuestions} سؤال تمت الإجابة عليه
        </div>
      </div>

      {/* Toolbar */}
      <div className="questions-page__toolbar">
        <button
          className={`questions-page__toolbar-btn${previewMode ? ' questions-page__toolbar-btn--active' : ''}`}
          onClick={() => setPreviewMode(!previewMode)}
          disabled={!previewMode && totalAnswered === 0}
        >
          <span className="material-icons-round">{previewMode ? 'edit' : 'visibility'}</span>
          {previewMode ? 'العودة للتحرير' : 'معاينة الإجابات'}
        </button>
        <button className="questions-page__toolbar-btn" onClick={exportPdf} disabled={totalAnswered === 0 || exportingPdf}>
          <span className="material-icons-round">{exportingPdf ? 'hourglass_empty' : 'picture_as_pdf'}</span>
          {exportingPdf ? 'جارٍ التصدير...' : 'تصدير PDF'}
        </button>
        <button className="questions-page__toolbar-btn" onClick={exportAnswers} disabled={totalAnswered === 0}>
          <span className="material-icons-round">file_download</span>
          نسخة احتياطية
        </button>
        <button className="questions-page__toolbar-btn" onClick={() => fileInputRef.current?.click()}>
          <span className="material-icons-round">file_upload</span>
          استيراد
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importAnswers}
          style={{ display: 'none' }}
        />
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        previewSections.length > 0 ? (
          previewSections.map((section) => (
            <div key={section.id} className="questions-card questions-card--expanded">
              <div className="questions-card__header questions-card__header--static">
                <span className="material-icons-round questions-card__icon">{section.icon}</span>
                <div className="questions-card__title-wrap">
                  <span className="questions-card__title">{section.title}</span>
                </div>
              </div>
              <div className="questions-card__body">
                <div className="questions-card__questions">
                  {section.answeredQuestions.map((q) => (
                    <div key={q.index} className="questions-card__question">
                      <div className="questions-card__question-header">
                        <span className="questions-card__question-num">{q.index + 1}</span>
                        <span className="questions-card__question-text">{q.question}</span>
                      </div>
                      <div className="questions-card__fields">
                        {q.mine && (
                          <div className="questions-card__field">
                            <span className="questions-card__preview-label questions-card__preview-label--mine">إجابتي</span>
                            <div className="questions-card__preview-answer">{q.mine}</div>
                          </div>
                        )}
                        {q.partner && (
                          <div className="questions-card__field">
                            <span className="questions-card__preview-label questions-card__preview-label--partner">ملاحظاتي</span>
                            <div className="questions-card__preview-answer">{q.partner}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="questions-preview-empty">
            <span className="material-icons-round">edit_note</span>
            <p>لا توجد إجابات بعد. ابدأ بالإجابة على الأسئلة أولاً.</p>
          </div>
        )
      ) : (
        <>
          {/* Guidelines Card */}
          <div className={`questions-intro${guidelinesOpen ? ' questions-intro--open' : ''}`}>
            <button className="questions-intro__toggle" onClick={() => setGuidelinesOpen(!guidelinesOpen)}>
              <span className="material-icons-round questions-intro__icon">info</span>
              <span>تنبيهات حول أسئلة الخِطبة</span>
              <span className={`material-icons-round questions-intro__arrow${guidelinesOpen ? ' questions-intro__arrow--open' : ''}`}>
                expand_more
              </span>
            </button>
            {guidelinesOpen && (
              <div className="questions-intro__body">
                {INTRO_GUIDELINES.map((p, i) => (
                  <p key={i} className="questions-intro__text">{p}</p>
                ))}
                <p className="questions-intro__transition">والآن مع الأسئلة مُقسَّمة ومعنونة بعناوين لغرض تسهيل فهم الفرق بينها.</p>
              </div>
            )}
          </div>

          {/* Topic Cards */}
          {QUESTIONS_SECTIONS.map((section, sIdx) => {
            const isExpanded = expanded[section.id];
            const answered = getSectionAnswered(section.id);
            const answeredCount = getSectionAnsweredCount(section.id);

            return (
              <div key={section.id} className={`questions-card${isExpanded ? ' questions-card--expanded' : ''}${answered ? ' questions-card--answered' : ''}`}>
                <button className="questions-card__header" onClick={() => toggleSection(section.id)}>
                  <span className="material-icons-round questions-card__icon">{section.icon}</span>
                  <div className="questions-card__title-wrap">
                    <span className="questions-card__number">{sIdx + 1}</span>
                    <span className="questions-card__title">{section.title}</span>
                  </div>
                  <span className="questions-card__badge">{section.questions.length}</span>
                  {answered && (
                    <span className="material-icons-round questions-card__check">check_circle</span>
                  )}
                  {answered && answeredCount < section.questions.length && (
                    <span className="questions-card__partial">{answeredCount}/{section.questions.length}</span>
                  )}
                  <span className={`material-icons-round questions-card__arrow${isExpanded ? ' questions-card__arrow--open' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="questions-card__body">
                    {section.intro.length > 0 && (
                      <div className="questions-card__intro">
                        {section.intro.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    )}

                    <div className="questions-card__questions">
                      {section.questions.map((q, qIdx) => (
                        <div key={qIdx} className="questions-card__question">
                          <div className="questions-card__question-header">
                            <span className="questions-card__question-num">{qIdx + 1}</span>
                            <span className="questions-card__question-text">{q}</span>
                          </div>
                          <div className="questions-card__fields">
                            <div className="questions-card__field">
                              <label className="questions-card__field-label questions-card__field-label--mine">إجابتي</label>
                              <textarea
                                className="questions-card__answer"
                                placeholder="اكتب إجابتك هنا..."
                                value={answers[`${section.id}-${qIdx}-mine`] || ''}
                                onChange={(e) => handleAnswer(section.id, qIdx, 'mine', e.target.value)}
                                dir="rtl"
                                rows={3}
                              />
                            </div>
                            <div className="questions-card__field">
                              <label className="questions-card__field-label questions-card__field-label--partner">ملاحظاتي على إجابة الطرف الآخر</label>
                              <textarea
                                className="questions-card__answer"
                                placeholder="اكتب ملاحظاتك على إجابة الطرف الآخر هنا..."
                                value={answers[`${section.id}-${qIdx}-partner`] || ''}
                                onChange={(e) => handleAnswer(section.id, qIdx, 'partner', e.target.value)}
                                dir="rtl"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {section.outro && (
                      <div className="questions-card__outro">
                        <p>{section.outro}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Closing Card */}
          <div className="questions-closing">
            <span className="material-icons-round questions-closing__icon">auto_awesome</span>
            <h3 className="questions-closing__title">تنبيه خاتم</h3>
            <div className="questions-closing__body">
              {CLOSING_MESSAGE.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="questions-closing__dua">
              {CLOSING_DUA}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
