'use client';

import { useState, useEffect } from 'react';

const SIZES = [14, 16, 18, 20];
const DEFAULT = 1;

export default function FontSizeControl() {
  const [sizeIndex, setSizeIndex] = useState(DEFAULT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fontSize');
    if (stored) {
      const idx = SIZES.indexOf(Number(stored));
      if (idx !== -1) {
        setSizeIndex(idx);
        document.documentElement.style.setProperty('--content-font-size', `${SIZES[idx]}px`);
      }
    }
    setMounted(true);
  }, []);

  function apply(idx) {
    setSizeIndex(idx);
    document.documentElement.style.setProperty('--content-font-size', `${SIZES[idx]}px`);
    localStorage.setItem('fontSize', SIZES[idx]);
  }

  if (!mounted) return null;

  return (
    <div className="font-size-control">
      <button
        className="font-size-control__btn"
        onClick={() => apply(Math.max(0, sizeIndex - 1))}
        disabled={sizeIndex <= 0}
        aria-label="تصغير الخط"
      >
        <span className="material-icons-round">remove</span>
      </button>
      <button
        className="font-size-control__btn"
        onClick={() => apply(Math.min(SIZES.length - 1, sizeIndex + 1))}
        disabled={sizeIndex >= SIZES.length - 1}
        aria-label="تكبير الخط"
      >
        <span className="material-icons-round">add</span>
      </button>
    </div>
  );
}
