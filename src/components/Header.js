'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import FontSizeControl from './FontSizeControl';
import { LECTURES, ORDINAL_NAMES } from '../lib/constants';

const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false });

export default function Header({ lectures }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const pathname = usePathname();

  let subtitle = '';
  const match = pathname.match(/^\/lectures\/(lecture-\d+)/);
  if (match) {
    const index = LECTURES.findIndex((l) => l.slug === match[1]);
    if (index !== -1) {
      subtitle = `المجلس ${ORDINAL_NAMES[index]}`;
    }
  }

  // Detect Mac for keyboard shortcut hint
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="header">
        <button
          className="header__menu-btn"
          aria-label="القائمة"
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <div className="header__title">
          <Link href="/">
            <svg className="header__logo" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="6" className="header__logo-bg" />
              {/* ── عدّل الشعار واسم السلسلة ── */}
              <text x="16" y="23" textAnchor="middle" fontFamily="serif" fontSize="20" fontWeight="700" className="header__logo-text">أب</text>
            </svg>
            اسم السلسلة
          </Link>
        </div>
        <span className="header__subtitle">{subtitle}</span>
        <button
          className="header__search-btn"
          aria-label="بحث"
          onClick={() => setSearchOpen(true)}
        >
          <span className="material-icons-round header__search-icon">search</span>
          <span className="header__search-text">بحث في المجالس...</span>
          <kbd className="header__search-kbd">{isMac ? '⌘' : 'Ctrl+'}K</kbd>
        </button>
        <FontSizeControl />
        <DarkModeToggle />
      </header>

      <div
        className={`sidebar-overlay${sidebarOpen ? ' active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        lectures={lectures}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
