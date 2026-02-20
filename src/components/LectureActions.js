'use client';

import { useProgressContext } from './ProgressProvider';

export default function LectureActions({ slug }) {
  const progress = useProgressContext();
  if (!progress?.mounted) return null;

  const read = progress.isRead(slug);
  const bookmarked = progress.isBookmarked(slug);

  return (
    <div className="lecture-actions">
      <button
        className={`lecture-actions__btn${bookmarked ? ' lecture-actions__btn--active' : ''}`}
        onClick={() => progress.toggleBookmark(slug)}
      >
        <span className="material-icons-round">
          {bookmarked ? 'bookmark' : 'bookmark_border'}
        </span>
        {bookmarked ? 'تمت الإضافة للمفضلة' : 'إضافة للمفضلة'}
      </button>
      <button
        className={`lecture-actions__btn${read ? ' lecture-actions__btn--active' : ''}`}
        onClick={() => progress.markRead(slug)}
        disabled={read}
      >
        <span className="material-icons-round">
          {read ? 'check_circle' : 'check_circle_outline'}
        </span>
        {read ? 'تمت القراءة' : 'تحديد كمقروءة'}
      </button>
    </div>
  );
}
