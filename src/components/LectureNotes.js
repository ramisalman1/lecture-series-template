'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'lecture-notes';

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function LectureNotes({ slug }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const notes = loadNotes();
    setText(notes[slug] || '');
    setMounted(true);
  }, [slug]);

  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    setSaved(false);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const notes = loadNotes();
      if (val.trim()) {
        notes[slug] = val;
      } else {
        delete notes[slug];
      }
      saveNotes(notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 500);
  }

  if (!mounted) return null;

  const hasNotes = text.trim().length > 0;

  return (
    <div className={`lecture-notes${open ? ' lecture-notes--open' : ''}`}>
      <button className="lecture-notes__toggle" onClick={() => setOpen(!open)}>
        <span className="material-icons-round">edit_note</span>
        <span>ملاحظاتي</span>
        {hasNotes && !open && <span className="lecture-notes__dot" />}
        {saved && <span className="lecture-notes__saved">تم الحفظ</span>}
        <span className={`material-icons-round lecture-notes__arrow${open ? ' lecture-notes__arrow--open' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <div className="lecture-notes__body">
          <textarea
            className="lecture-notes__textarea"
            value={text}
            onChange={handleChange}
            placeholder="اكتب ملاحظاتك هنا... يتم الحفظ تلقائيًا"
            rows={6}
            dir="rtl"
          />
          <div className="lecture-notes__footer">
            <span className="lecture-notes__count">{text.length} حرف</span>
          </div>
        </div>
      )}
    </div>
  );
}
