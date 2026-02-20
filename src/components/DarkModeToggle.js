'use client';

import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (stored === 'light') {
      setDark(false);
      document.documentElement.removeAttribute('data-theme');
    } else {
      // Default to light mode for first-time visitors
      setDark(false);
      document.documentElement.removeAttribute('data-theme');
    }
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  if (!mounted) return null;

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggle}
      aria-label={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      <span className="material-icons-round">
        {dark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
