'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`scroll-top${visible ? ' visible' : ''}`}
      aria-label="العودة للأعلى"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span className="material-icons-round">arrow_upward</span>
    </button>
  );
}
