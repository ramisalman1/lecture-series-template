'use client';

import { useState, useEffect, useRef } from 'react';
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

export default function AllNotesView({ lectures }) {
  const [annotations, setAnnotations] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAnnotations(loadAnnotations());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function exportNotes() {
    const data = JSON.stringify(annotations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ola-notes-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importNotes(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) return;
        const existing = loadAnnotations();
        const existingIds = new Set(existing.map(a => a.id));
        const merged = [...existing, ...imported.filter(a => a.id && !existingIds.has(a.id))];
        saveAnnotations(merged);
        setAnnotations(merged);
      } catch { /* invalid JSON, ignore */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function deleteAnnotation(id) {
    const updated = annotations.filter(a => a.id !== id);
    saveAnnotations(updated);
    setAnnotations(updated);
    if (editingId === id) setEditingId(null);
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

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  // Group by slug
  const bySlug = {};
  annotations.forEach(ann => {
    if (!bySlug[ann.slug]) bySlug[ann.slug] = [];
    bySlug[ann.slug].push(ann);
  });

  const lecturesWithNotes = lectures.filter(l => bySlug[l.slug]?.length > 0);
  const totalNotes = annotations.filter(a => a.pIndex !== -1).length;
  const totalGeneral = annotations.filter(a => a.pIndex === -1).length;

  const privacyBanner = (
    <div className="notes-page__privacy">
      <span className="material-icons-round">security</span>
      <span>ملاحظاتك محفوظة على جهازك فقط ولا تُشارك مع أي طرف</span>
    </div>
  );

  const toolbar = (
    <div className="notes-page__toolbar">
      <button className="notes-page__toolbar-btn" onClick={exportNotes} disabled={annotations.length === 0}>
        <span className="material-icons-round">file_download</span>
        تصدير
      </button>
      <button className="notes-page__toolbar-btn" onClick={() => fileInputRef.current?.click()}>
        <span className="material-icons-round">file_upload</span>
        استيراد
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importNotes}
        style={{ display: 'none' }}
      />
    </div>
  );

  if (annotations.length === 0) {
    return (
      <div className="notes-page__empty">
        {privacyBanner}
        {toolbar}
        <span className="material-icons-round">lightbulb</span>
        <h2>لا توجد ملاحظات بعد</h2>
        <p>افتح أي مجلس وحدد نصًا لإضافة ملاحظة مرتبطة، أو اكتب ملاحظة عامة</p>
        <Link href="/" className="notes-page__back-btn">
          <span className="material-icons-round">arrow_forward</span>
          العودة للمجالس
        </Link>
      </div>
    );
  }

  return (
    <div className="notes-page__content">
      {privacyBanner}
      {toolbar}
      <div className="notes-page__stats">
        <div className="notes-page__stat">
          <span className="material-icons-round">article</span>
          <span>{lecturesWithNotes.length} مجلس</span>
        </div>
        <div className="notes-page__stat">
          <span className="material-icons-round">format_quote</span>
          <span>{totalNotes} ملاحظة مرتبطة</span>
        </div>
        {totalGeneral > 0 && (
          <div className="notes-page__stat">
            <span className="material-icons-round">edit_note</span>
            <span>{totalGeneral} ملاحظة عامة</span>
          </div>
        )}
      </div>

      {lecturesWithNotes.map(lecture => {
        const anns = bySlug[lecture.slug] || [];
        const generalAnns = anns.filter(a => a.pIndex === -1);
        const textAnns = anns.filter(a => a.pIndex !== -1).sort((a, b) => a.pIndex - b.pIndex);

        return (
          <div key={lecture.slug} className="notes-page__lecture">
            <div className="notes-page__lecture-header">
              <Link href={`/lectures/${lecture.slug}`} className="notes-page__lecture-link">
                <span className="notes-page__lecture-num">{lecture.arabicNum}</span>
                <div>
                  <div className="notes-page__lecture-title">{lecture.shortTitle}</div>
                  <div className="notes-page__lecture-section">{lecture.section}</div>
                </div>
                <span className="material-icons-round notes-page__lecture-arrow">arrow_back</span>
              </Link>
            </div>

            {generalAnns.map(ann => (
              <div key={ann.id} className="notes-page__note notes-page__note--general">
                <div className="notes-page__note-label">
                  <span className="material-icons-round">edit_note</span>
                  ملاحظة عامة
                </div>
                {editingId === ann.id ? (
                  <div className="notes-page__note-edit">
                    <textarea
                      className="notes-page__note-edit-input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      dir="rtl"
                      rows={3}
                      autoFocus
                    />
                    <div className="notes-page__note-edit-actions">
                      <button className="notes-page__note-edit-save" onClick={saveEdit} disabled={!editText.trim()}>
                        <span className="material-icons-round">check</span> حفظ
                      </button>
                      <button className="notes-page__note-edit-cancel" onClick={cancelEdit}>
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="notes-page__note-text">{ann.note}</div>
                )}
                <div className="notes-page__note-footer">
                  {editingId !== ann.id && (
                    <button className="notes-page__note-edit-btn" onClick={() => startEdit(ann)} title="تعديل">
                      <span className="material-icons-round">edit</span>
                    </button>
                  )}
                  <button
                    className="notes-page__note-delete"
                    onClick={() => deleteAnnotation(ann.id)}
                  >
                    <span className="material-icons-round">delete_outline</span>
                  </button>
                </div>
              </div>
            ))}

            {textAnns.map(ann => (
              <div key={ann.id} className="notes-page__note">
                <div className="notes-page__note-quote">
                  &laquo;{ann.selectedText.slice(0, 150)}{ann.selectedText.length > 150 ? '...' : ''}&raquo;
                </div>
                {editingId === ann.id ? (
                  <div className="notes-page__note-edit">
                    <textarea
                      className="notes-page__note-edit-input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      dir="rtl"
                      rows={3}
                      autoFocus
                    />
                    <div className="notes-page__note-edit-actions">
                      <button className="notes-page__note-edit-save" onClick={saveEdit} disabled={!editText.trim()}>
                        <span className="material-icons-round">check</span> حفظ
                      </button>
                      <button className="notes-page__note-edit-cancel" onClick={cancelEdit}>
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="notes-page__note-text">{ann.note}</div>
                )}
                <div className="notes-page__note-footer">
                  <a
                    href={`/lectures/${ann.slug}#p-${ann.pIndex}`}
                    className="notes-page__note-goto"
                  >
                    <span className="material-icons-round">my_location</span>
                    الذهاب للموقع
                  </a>
                  {editingId !== ann.id && (
                    <button className="notes-page__note-edit-btn" onClick={() => startEdit(ann)} title="تعديل">
                      <span className="material-icons-round">edit</span>
                    </button>
                  )}
                  <button
                    className="notes-page__note-delete"
                    onClick={() => deleteAnnotation(ann.id)}
                  >
                    <span className="material-icons-round">delete_outline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
