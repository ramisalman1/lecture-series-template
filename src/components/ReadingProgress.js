'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const isLecture = pathname.startsWith('/lectures/');

  useEffect(() => {
    if (!isLecture) return;

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLecture]);

  if (!isLecture) return null;

  return (
    <div className="reading-progress" style={{ width: `${progress}%` }} />
  );
}
