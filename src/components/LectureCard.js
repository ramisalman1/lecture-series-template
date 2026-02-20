'use client';

import Link from 'next/link';
import { useProgressContext } from './ProgressProvider';

export default function LectureCard({ lecture, ordinal }) {
  const progress = useProgressContext();
  const read = progress?.mounted && progress.isRead(lecture.slug);
  const bookmarked = progress?.mounted && progress.isBookmarked(lecture.slug);

  return (
    <Link href={`/lectures/${lecture.slug}`} className={`lecture-card${read ? ' lecture-card--read' : ''}`}>
      <div className="lecture-card__number">{lecture.arabicNum}</div>
      <div className="lecture-card__content">
        <div className="lecture-card__title">
          {lecture.title}
          {bookmarked && (
            <span className="lecture-card__badge lecture-card__badge--bookmark material-icons-round">bookmark</span>
          )}
          {read && !bookmarked && (
            <span className="lecture-card__badge lecture-card__badge--read material-icons-round">check_circle</span>
          )}
        </div>
        <div className="lecture-card__meta">
          المجلس {ordinal} · {lecture.section}
          {lecture.readingTime && ` · ${lecture.readingTime} د`}
        </div>
      </div>
    </Link>
  );
}
