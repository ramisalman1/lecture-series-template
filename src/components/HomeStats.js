'use client';

import { useProgressContext } from './ProgressProvider';

export default function HomeStats({ totalLectures }) {
  const progress = useProgressContext();
  if (!progress?.mounted) return null;

  const read = progress.readCount;
  const pct = totalLectures > 0 ? Math.round((read / totalLectures) * 100) : 0;

  return (
    <div className="home-stats">
      <div className="home-stats__bar-wrap">
        <div className="home-stats__bar">
          <div className="home-stats__fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="home-stats__pct">{pct}%</span>
      </div>
      <div className="home-stats__details">
        <div className="home-stats__item">
          <span className="material-icons-round">menu_book</span>
          <span><strong>{read}</strong> / {totalLectures} مجلسًا</span>
        </div>
        <div className="home-stats__item">
          <span className="material-icons-round">{pct === 100 ? 'emoji_events' : pct >= 50 ? 'local_fire_department' : 'flag'}</span>
          <span>{pct === 100 ? 'أتممت السلسلة!' : pct >= 75 ? 'أوشكت على الانتهاء!' : pct >= 50 ? 'تجاوزت النصف!' : pct > 0 ? 'استمر في القراءة' : 'ابدأ رحلتك'}</span>
        </div>
      </div>
    </div>
  );
}
