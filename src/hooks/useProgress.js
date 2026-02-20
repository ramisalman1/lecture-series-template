'use client';

import { useState, useEffect, useCallback } from 'react';
import { trackEvent } from '../lib/analytics';

const STORAGE_KEY = 'lecture-progress';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(load());
    setMounted(true);
  }, []);

  const markRead = useCallback((slug) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: { ...prev[slug], read: true } };
      save(next);
      trackEvent('lecture_complete', { lecture: slug });
      return next;
    });
  }, []);

  const markUnread = useCallback((slug) => {
    setProgress((prev) => {
      const next = { ...prev, [slug]: { ...prev[slug], read: false } };
      save(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((slug) => {
    setProgress((prev) => {
      const current = prev[slug] || {};
      const next = { ...prev, [slug]: { ...current, bookmarked: !current.bookmarked } };
      save(next);
      trackEvent('lecture_bookmark', { lecture: slug });
      return next;
    });
  }, []);

  const isRead = useCallback((slug) => !!progress[slug]?.read, [progress]);
  const isBookmarked = useCallback((slug) => !!progress[slug]?.bookmarked, [progress]);

  const readCount = Object.values(progress).filter(p => p.read).length;

  return { mounted, markRead, markUnread, toggleBookmark, isRead, isBookmarked, readCount };
}
