'use client';

import { useProgressContext } from './ProgressProvider';
import { LECTURES } from '../lib/constants';

export default function CourseProgress() {
  const progress = useProgressContext();
  if (!progress?.mounted) return null;

  const total = LECTURES.length;
  const readCount = LECTURES.filter(l => progress.isRead(l.slug)).length;
  const pct = Math.round((readCount / total) * 100);

  if (readCount === 0) return null;

  return (
    <div className="course-progress">
      <div className="course-progress__header">
        <span className="course-progress__label">تقدم الدورة</span>
        <span className="course-progress__count">{readCount}/{total}</span>
      </div>
      <div className="course-progress__bar">
        <div className="course-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="course-progress__pct">{pct}%</div>
    </div>
  );
}
