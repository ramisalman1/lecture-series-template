'use client';

import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'lecture-annotations';

function loadAnnotations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveAnnotations(anns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anns));
}

function getIsMobile() {
  return typeof window !== 'undefined' && window.innerWidth <= 768;
}

function findParagraph(node, boundary) {
  while (node && node !== boundary) {
    if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-p')) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

// SSR-safe: useLayoutEffect on client, useEffect during build/SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function getParagraphPreview(el) {
  const text = el?.textContent?.trim() || '';
  return text.slice(0, 120) + (text.length > 120 ? '...' : '');
}

export default function AnnotatedContent({ html, slug }) {
  const articleRef = useRef(null);
  const popupRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [selection, setSelection] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [generalNote, setGeneralNote] = useState('');
  const [generalSaved, setGeneralSaved] = useState(false);
  const generalTimer = useRef(null);
  const noteAutoSaveTimer = useRef(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const [annotateMode, setAnnotateMode] = useState(false);
  const [sheetData, setSheetData] = useState(null);
  const [showInline, setShowInline] = useState(false);
  const [inlineEditId, setInlineEditId] = useState(null);
  const [inlineEditText, setInlineEditText] = useState('');

  // Stable ref so DOM-injected delete handlers always read fresh annotations
  const annotationsRef = useRef(annotations);
  annotationsRef.current = annotations;

  const lectureAnns = useMemo(
    () => annotations.filter(a => a.slug === slug && a.pIndex !== undefined && a.pIndex !== -1),
    [annotations, slug]
  );

  useEffect(() => {
    const all = loadAnnotations();
    setAnnotations(all);
    try {
      const oldNotes = JSON.parse(localStorage.getItem('lecture-notes')) || {};
      if (oldNotes[slug]) setGeneralNote(oldNotes[slug]);
    } catch {}
    const gen = all.find(a => a.slug === slug && a.pIndex === -1);
    if (gen) setGeneralNote(gen.note);
    setShowInline(localStorage.getItem('inline-notes-visible') === 'true');
    setMounted(true);
  }, [slug]);

  // Listen for inline notes toggle from toolbar
  useEffect(() => {
    function handleToggle(e) {
      setShowInline(e.detail);
    }
    window.addEventListener('inline-notes-toggle', handleToggle);
    return () => window.removeEventListener('inline-notes-toggle', handleToggle);
  }, []);

  // Scroll to paragraph from URL hash
  useEffect(() => {
    if (!mounted || !articleRef.current) return;
    const hash = window.location.hash;
    if (!hash) return;
    const match = hash.match(/^#p-(\d+)$/);
    if (!match) return;
    const idx = match[1];
    if (document.getElementById(`p-${idx}`)) return;
    const el = articleRef.current.querySelector(`[data-p="${idx}"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('annotation-flash');
        setTimeout(() => el.classList.remove('annotation-flash'), 2000);
      }, 100);
    }
  }, [mounted]);

  // ── Paragraph highlighting (blue shadow + count badge) ──
  // useLayoutEffect runs synchronously BEFORE paint → no flicker.
  // No deps → runs on every render, guaranteeing classes survive any state change.
  // This is a fast O(n) scan so running every render is fine.
  useIsomorphicLayoutEffect(() => {
    if (!mounted || !articleRef.current) return;
    const byP = {};
    lectureAnns.forEach(a => {
      const key = String(a.pIndex);
      if (!byP[key]) byP[key] = [];
      byP[key].push(a);
    });
    articleRef.current.querySelectorAll('[data-p]').forEach(p => {
      const idx = p.getAttribute('data-p');
      if (byP[idx]) {
        p.classList.add('has-annotations');
        p.setAttribute('data-ann-count', byP[idx].length);
      } else {
        p.classList.remove('has-annotations');
        p.removeAttribute('data-ann-count');
      }
    });
  });

  const isAddingComment = !!(selection || sheetData);

  // ── Inline annotation blocks ──
  // Uses fingerprinting to avoid unnecessary DOM rebuilds (animation flicker).
  // Also checks DOM state to recover from any unexpected block removal.
  const inlineFingerprintRef = useRef('');

  // useLayoutEffect + no deps + fingerprint guard = runs every render but only
  // rebuilds DOM when annotation data actually changes. No flicker, no missed triggers.
  useIsomorphicLayoutEffect(() => {
    if (!mounted || !articleRef.current) return;

    const shouldShow = showInline && lectureAnns.length > 0 && !isAddingComment;
    const fingerprint = shouldShow
      ? lectureAnns.map(a => `${a.id}:${a.pIndex}:${a.note}`).join('|')
      : '';

    const existingBlocks = articleRef.current.querySelectorAll('.inline-ann-block');
    const blocksExist = existingBlocks.length > 0;

    // Skip rebuild if fingerprint matches AND DOM state is correct
    if (fingerprint === inlineFingerprintRef.current && shouldShow === blocksExist) {
      return;
    }

    inlineFingerprintRef.current = fingerprint;

    existingBlocks.forEach(el => el.remove());

    if (!shouldShow) return;

    // Group by paragraph
    const byP = {};
    lectureAnns.forEach(a => {
      const key = String(a.pIndex);
      if (!byP[key]) byP[key] = [];
      byP[key].push(a);
    });

    Object.entries(byP).forEach(([pIdx, anns]) => {
      const pEl = articleRef.current.querySelector(`[data-p="${pIdx}"]`);
      if (!pEl) return;

      const block = document.createElement('div');
      block.className = 'inline-ann-block';
      block.setAttribute('data-inline-p', pIdx);

      anns.forEach((ann, i) => {
        const item = document.createElement('div');
        item.className = 'inline-ann-item';
        item.setAttribute('data-ann-id', ann.id);

        if (ann.selectedText) {
          const quote = document.createElement('div');
          quote.className = 'inline-ann-quote';
          quote.textContent = '«' + ann.selectedText.slice(0, 150) + (ann.selectedText.length > 150 ? '...' : '') + '»';
          item.appendChild(quote);
        }

        const noteRow = document.createElement('div');
        noteRow.className = 'inline-ann-note-row';

        const note = document.createElement('div');
        note.className = 'inline-ann-note';
        note.textContent = ann.note;
        noteRow.appendChild(note);

        const actions = document.createElement('div');
        actions.className = 'inline-ann-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'inline-ann-btn';
        editBtn.title = 'تعديل';
        editBtn.innerHTML = '<span class="material-icons-round">edit</span>';
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          setInlineEditId(ann.id);
          setInlineEditText(ann.note);
        });
        actions.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'inline-ann-btn inline-ann-btn--danger';
        deleteBtn.title = 'حذف';
        deleteBtn.innerHTML = '<span class="material-icons-round">delete_outline</span>';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          const updated = annotationsRef.current.filter(a => a.id !== ann.id);
          saveAnnotations(updated);
          setAnnotations(updated);
        });
        actions.appendChild(deleteBtn);

        noteRow.appendChild(actions);
        item.appendChild(noteRow);

        if (i > 0) {
          const sep = document.createElement('hr');
          sep.className = 'inline-ann-sep';
          block.appendChild(sep);
        }
        block.appendChild(item);
      });

      pEl.insertAdjacentElement('afterend', block);
    });
  });

  // Handle inline edit save
  function saveInlineEdit() {
    if (!inlineEditText.trim() || !inlineEditId) return;
    const updated = annotations.map(a =>
      a.id === inlineEditId ? { ...a, note: inlineEditText.trim() } : a
    );
    saveAnnotations(updated);
    setAnnotations(updated);
    setInlineEditId(null);
    setInlineEditText('');
  }

  // Desktop: text selection → popup
  useEffect(() => {
    if (!mounted || !articleRef.current) return;
    let timer = null;

    function handleMouseUp(e) {
      if (e.target.closest('.annotation-popup') || e.target.closest('.notes-drawer') ||
          e.target.closest('.notes-fab') || e.target.closest('.mobile-sel-btn') ||
          e.target.closest('.mobile-note-sheet') || e.target.closest('.inline-ann-block')) return;
      if (getIsMobile()) return;

      clearTimeout(timer);
      timer = setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().trim();
        if (!text || text.length < 2) return;

        const pEl = findParagraph(sel.anchorNode, articleRef.current);
        if (!pEl) return;

        try {
          const pIndex = parseInt(pEl.getAttribute('data-p'));
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const wrapEl = articleRef.current.closest('.annotated-content-wrapper');
          const wrapRect = wrapEl.getBoundingClientRect();
          setSelection({
            text,
            pIndex,
            top: rect.bottom - wrapRect.top + 8,
            left: Math.max(8, rect.left - wrapRect.left),
          });
          setNoteText('');
          autoSaveIdRef.current = null;
          setNoteSaved(false);
        } catch {}
      }, 50);
    }

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(timer);
    };
  }, [mounted]);

  // Click on annotated paragraph → open drawer (only when inline is OFF)
  useEffect(() => {
    if (!mounted || !articleRef.current) return;
    function handleClick(e) {
      if (annotateMode) return;
      if (showInline) return;
      if (e.target.closest('.annotation-popup') || e.target.closest('.notes-fab') ||
          e.target.closest('.notes-drawer') || e.target.closest('.mobile-sel-btn') ||
          e.target.closest('.inline-ann-block')) return;
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) return;
      const p = e.target.closest('[data-ann-count]');
      if (p) {
        setDrawerOpen(true);
        const pIdx = p.getAttribute('data-p');
        setTimeout(() => {
          const noteEl = document.querySelector(`.notes-drawer__item[data-note-p="${pIdx}"]`);
          if (noteEl) noteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
    const article = articleRef.current;
    article.addEventListener('click', handleClick);
    return () => article.removeEventListener('click', handleClick);
  }, [mounted, annotateMode, showInline]);

  // Annotation mode: tap paragraph to open bottom sheet
  useEffect(() => {
    if (!mounted || !articleRef.current || !annotateMode) return;
    function handleTap(e) {
      if (e.target.closest('.notes-fab') || e.target.closest('.notes-drawer') ||
          e.target.closest('.mobile-note-sheet') || e.target.closest('.annotate-mode-banner')) return;
      const pEl = e.target.closest('[data-p]');
      if (pEl) {
        e.preventDefault();
        const pIndex = parseInt(pEl.getAttribute('data-p'));
        const preview = getParagraphPreview(pEl);
        setSheetData({ pIndex, preview });
        setNoteText('');
        autoSaveIdRef.current = null;
        setNoteSaved(false);
      }
    }
    const article = articleRef.current;
    article.addEventListener('click', handleTap);
    return () => article.removeEventListener('click', handleTap);
  }, [mounted, annotateMode]);

  // Toggle annotate mode class on article
  useEffect(() => {
    if (!articleRef.current) return;
    if (annotateMode) {
      articleRef.current.classList.add('annotate-mode');
    } else {
      articleRef.current.classList.remove('annotate-mode');
    }
  }, [annotateMode]);

  // Close popup on outside click (desktop)
  useEffect(() => {
    if (!selection) return;
    function handleOutsideClick(e) {
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      if (e.target.closest('.notes-drawer') || e.target.closest('.notes-fab')) return;
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length >= 2) return;
      setSelection(null);
    }
    const t = setTimeout(() => document.addEventListener('click', handleOutsideClick), 100);
    return () => { clearTimeout(t); document.removeEventListener('click', handleOutsideClick); };
  }, [selection]);

  const autoSaveIdRef = useRef(null);

  function addAnnotation() {
    const text = selection?.text || sheetData?.preview || '';
    const pIndex = selection?.pIndex ?? sheetData?.pIndex;
    if (!noteText.trim() || pIndex === undefined) return;
    if (autoSaveIdRef.current) {
      autoSaveIdRef.current = null;
      setSelection(null);
      setSheetData(null);
      setNoteText('');
      setNoteSaved(false);
      window.getSelection()?.removeAllRanges();
      return;
    }
    const ann = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      slug,
      pIndex,
      selectedText: text,
      note: noteText.trim(),
      createdAt: Date.now(),
    };
    const updated = [...annotations, ann];
    saveAnnotations(updated);
    setAnnotations(updated);
    setSelection(null);
    setSheetData(null);
    setNoteText('');
    setNoteSaved(false);
    window.getSelection()?.removeAllRanges();
  }

  function handleNoteTextChange(val) {
    setNoteText(val);
    setNoteSaved(false);
    clearTimeout(noteAutoSaveTimer.current);

    const text = selection?.text || sheetData?.preview || '';
    const pIndex = selection?.pIndex ?? sheetData?.pIndex;
    if (pIndex === undefined) return;

    noteAutoSaveTimer.current = setTimeout(() => {
      const all = loadAnnotations();
      if (val.trim()) {
        if (autoSaveIdRef.current) {
          const idx = all.findIndex(a => a.id === autoSaveIdRef.current);
          if (idx !== -1) {
            all[idx].note = val.trim();
          }
        } else {
          const newId = `ann_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          autoSaveIdRef.current = newId;
          all.push({
            id: newId,
            slug,
            pIndex,
            selectedText: text,
            note: val.trim(),
            createdAt: Date.now(),
          });
        }
        saveAnnotations(all);
        setAnnotations(all);
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 1500);
      } else {
        if (autoSaveIdRef.current) {
          const filtered = all.filter(a => a.id !== autoSaveIdRef.current);
          saveAnnotations(filtered);
          setAnnotations(filtered);
          autoSaveIdRef.current = null;
        }
      }
    }, 600);
  }

  function deleteAnnotation(id) {
    const updated = annotations.filter(a => a.id !== id);
    saveAnnotations(updated);
    setAnnotations(updated);
  }

  function startEdit(ann) {
    setEditingId(ann.id);
    setEditText(ann.note);
  }

  function saveEdit() {
    if (!editText.trim()) return;
    const updated = annotations.map(a =>
      a.id === editingId ? { ...a, note: editText.trim() } : a
    );
    saveAnnotations(updated);
    setAnnotations(updated);
    setEditingId(null);
    setEditText('');
  }

  function scrollToP(pIndex) {
    const p = articleRef.current?.querySelector(`[data-p="${pIndex}"]`);
    if (p) {
      p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      p.classList.add('annotation-flash');
      setTimeout(() => p.classList.remove('annotation-flash'), 2000);
    }
    setDrawerOpen(false);
  }

  function handleFabClick() {
    setDrawerOpen(true);
  }

  function handleAddFabClick() {
    setAnnotateMode(!annotateMode);
  }

  function enterAnnotateMode() {
    setDrawerOpen(false);
    setAnnotateMode(true);
  }

  function handleGeneralNote(e) {
    const val = e.target.value;
    setGeneralNote(val);
    setGeneralSaved(false);
    clearTimeout(generalTimer.current);
    generalTimer.current = setTimeout(() => {
      const all = loadAnnotations();
      const existingIdx = all.findIndex(a => a.slug === slug && a.pIndex === -1);
      if (val.trim()) {
        if (existingIdx !== -1) {
          all[existingIdx].note = val;
        } else {
          all.push({ id: `ann_general_${slug}`, slug, pIndex: -1, selectedText: '', note: val, createdAt: Date.now() });
        }
      } else if (existingIdx !== -1) {
        all.splice(existingIdx, 1);
      }
      saveAnnotations(all);
      setAnnotations(all);
      setGeneralSaved(true);
      setTimeout(() => setGeneralSaved(false), 1500);
    }, 500);
  }

  // Memoize the article element so React sees the same reference across renders.
  // This prevents React from reconciling the article subtree, preserving our
  // DOM modifications (classes, injected inline blocks) across re-renders.
  // MUST be before the early return to satisfy React's rules of hooks.
  const articleElement = useMemo(
    () => <article ref={articleRef} className="content" dangerouslySetInnerHTML={{ __html: html }} />,
    [html]
  );

  if (!mounted) {
    return <article className="content" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const sortedAnns = [...lectureAnns].sort((a, b) => a.pIndex - b.pIndex);
  const inlineEditAnn = inlineEditId ? annotations.find(a => a.id === inlineEditId) : null;

  return (
    <div className="annotated-content-wrapper">
      {articleElement}

      {/* Desktop: positioned popup near selection */}
      {selection && !selection.mobile && (
        <div
          ref={popupRef}
          className="annotation-popup"
          style={{ top: selection.top, left: selection.left }}
        >
          <div className="annotation-popup__quick-actions">
            <button
              className="annotation-popup__quick-btn"
              onClick={() => {
                navigator.clipboard.writeText(selection.text);
                setSelection(null);
                window.getSelection()?.removeAllRanges();
              }}
              title="نسخ"
            >
              <span className="material-icons-round">content_copy</span>
              نسخ
            </button>
          </div>
          <div className="annotation-popup__quote">
            &laquo;{selection.text.slice(0, 100)}{selection.text.length > 100 ? '...' : ''}&raquo;
          </div>
          <textarea
            className="annotation-popup__input"
            value={noteText}
            onChange={e => handleNoteTextChange(e.target.value)}
            placeholder="اكتب ملاحظتك هنا... (يُحفظ تلقائيًّا)"
            rows={3}
            dir="rtl"
            autoFocus
          />
          <div className="annotation-popup__actions">
            {noteSaved && <span className="notes-drawer__saved">تم الحفظ</span>}
            <button className="annotation-popup__btn annotation-popup__btn--cancel" onClick={() => { autoSaveIdRef.current = null; setSelection(null); setNoteSaved(false); }}>
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Annotation mode banner */}
      {annotateMode && (
        <div className="annotate-mode-banner" onClick={() => setAnnotateMode(false)} style={{ cursor: 'pointer' }}>
          <span className="material-icons-round">touch_app</span>
          اضغط على أي فقرة لإضافة ملاحظة
          <button className="annotate-mode-banner__cancel" onClick={(e) => { e.stopPropagation(); setAnnotateMode(false); }}>
            <span className="material-icons-round">close</span>
            إلغاء
          </button>
        </div>
      )}

      {/* Mobile bottom sheet for adding note */}
      {sheetData && (
        <>
          <div className="mobile-note-overlay" onClick={() => { autoSaveIdRef.current = null; setSheetData(null); setNoteSaved(false); }} />
          <div className="mobile-note-sheet">
            <div className="mobile-note-sheet__handle" />
            <div className="mobile-note-sheet__quote">
              &laquo;{sheetData.preview}&raquo;
            </div>
            <textarea
              className="mobile-note-sheet__input"
              value={noteText}
              onChange={e => handleNoteTextChange(e.target.value)}
              placeholder="اكتب ملاحظتك هنا... (يُحفظ تلقائيًّا)"
              rows={4}
              dir="rtl"
              autoFocus
            />
            <div className="mobile-note-sheet__actions">
              {noteSaved && <span className="notes-drawer__saved">تم الحفظ</span>}
              <button className="mobile-note-sheet__cancel" onClick={() => { autoSaveIdRef.current = null; setSheetData(null); setNoteSaved(false); }}>
                إغلاق
              </button>
            </div>
          </div>
        </>
      )}

      {/* Inline edit bottom sheet */}
      {inlineEditAnn && (
        <>
          <div className="mobile-note-overlay" onClick={() => { setInlineEditId(null); setInlineEditText(''); }} />
          <div className="mobile-note-sheet">
            <div className="mobile-note-sheet__handle" />
            <div className="mobile-note-sheet__header">
              <span className="material-icons-round">edit</span>
              تعديل الملاحظة
            </div>
            {inlineEditAnn.selectedText && (
              <div className="mobile-note-sheet__quote">
                &laquo;{inlineEditAnn.selectedText.slice(0, 150)}{inlineEditAnn.selectedText.length > 150 ? '...' : ''}&raquo;
              </div>
            )}
            <textarea
              className="mobile-note-sheet__input"
              value={inlineEditText}
              onChange={e => setInlineEditText(e.target.value)}
              dir="rtl"
              rows={4}
              autoFocus
            />
            <div className="mobile-note-sheet__actions mobile-note-sheet__actions--edit">
              <button className="mobile-note-sheet__save" onClick={saveInlineEdit}>
                <span className="material-icons-round">check</span>
                حفظ
              </button>
              <button className="mobile-note-sheet__cancel" onClick={() => { setInlineEditId(null); setInlineEditText(''); }}>
                إلغاء
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add-note FAB */}
      <button
        className={`notes-add-fab${annotateMode ? ' notes-add-fab--active' : ''}`}
        onClick={handleAddFabClick}
        title={annotateMode ? 'إلغاء وضع الملاحظات' : 'إضافة ملاحظة'}
      >
        <span className="material-icons-round">
          {annotateMode ? 'close' : 'add_comment'}
        </span>
      </button>

      {/* Notes FAB */}
      <button
        className={`notes-fab${lectureAnns.length > 0 ? ' notes-fab--has-notes' : ''}`}
        onClick={handleFabClick}
        title="ملاحظاتي"
      >
        <span className="material-icons-round">sticky_note_2</span>
        {lectureAnns.length > 0 && (
          <span className="notes-fab__count">{lectureAnns.length}</span>
        )}
      </button>

      {/* Notes drawer overlay */}
      {drawerOpen && <div className="notes-drawer-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* Notes drawer */}
      <div className={`notes-drawer${drawerOpen ? ' notes-drawer--open' : ''}`}>
        <div className="notes-drawer__header">
          <h3>
            <span className="material-icons-round">sticky_note_2</span>
            ملاحظاتي
          </h3>
          <div className="notes-drawer__header-actions">
            <Link href="/notes" className="notes-drawer__all-link" title="جميع الملاحظات">
              <span className="material-icons-round">library_books</span>
            </Link>
            <button onClick={() => setDrawerOpen(false)}>
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        <div className="notes-drawer__body">
          <button className="notes-drawer__add-btn" onClick={enterAnnotateMode}>
            <span className="material-icons-round">add_comment</span>
            إضافة ملاحظة على فقرة
          </button>

          <div className="notes-drawer__general">
            <label className="notes-drawer__general-label">
              <span className="material-icons-round">edit_note</span>
              ملاحظة عامة
              {generalSaved && <span className="notes-drawer__saved">تم الحفظ</span>}
            </label>
            <textarea
              className="notes-drawer__general-input"
              value={generalNote}
              onChange={handleGeneralNote}
              placeholder="اكتب ملاحظة عامة عن هذا المجلس..."
              rows={3}
              dir="rtl"
            />
          </div>

          {sortedAnns.length > 0 && (
            <div className="notes-drawer__section-label">
              <span className="material-icons-round">format_quote</span>
              ملاحظات مرتبطة بالنص ({sortedAnns.length})
            </div>
          )}

          {sortedAnns.length === 0 && !generalNote.trim() ? (
            <div className="notes-drawer__empty">
              <span className="material-icons-round">lightbulb</span>
              <p>اضغط الزر أعلاه لإضافة ملاحظات على فقرات المجلس</p>
              <p className="notes-drawer__empty-hint">أو اكتب ملاحظة عامة في الحقل أعلاه</p>
            </div>
          ) : (
            sortedAnns.map(ann => (
              <div key={ann.id} className="notes-drawer__item" data-note-p={ann.pIndex}>
                <button className="notes-drawer__goto" onClick={() => scrollToP(ann.pIndex)} title="الذهاب للفقرة">
                  <span className="material-icons-round">my_location</span>
                </button>
                <div className="notes-drawer__item-content">
                  <div className="notes-drawer__quote">
                    &laquo;{ann.selectedText.slice(0, 120)}{ann.selectedText.length > 120 ? '...' : ''}&raquo;
                  </div>
                  {editingId === ann.id ? (
                    <>
                      <textarea className="annotation-popup__input" value={editText} onChange={e => setEditText(e.target.value)} dir="rtl" rows={3} autoFocus />
                      <div className="notes-drawer__item-actions">
                        <button className="notes-drawer__action-btn" onClick={saveEdit}><span className="material-icons-round">check</span></button>
                        <button className="notes-drawer__action-btn" onClick={() => setEditingId(null)}><span className="material-icons-round">close</span></button>
                      </div>
                    </>
                  ) : (
                    <div className="notes-drawer__note">{ann.note}</div>
                  )}
                  {editingId !== ann.id && (
                    <div className="notes-drawer__item-actions">
                      <button className="notes-drawer__action-btn" onClick={() => startEdit(ann)} title="تعديل"><span className="material-icons-round">edit</span></button>
                      <button className="notes-drawer__action-btn notes-drawer__action-btn--danger" onClick={() => deleteAnnotation(ann.id)} title="حذف"><span className="material-icons-round">delete_outline</span></button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
