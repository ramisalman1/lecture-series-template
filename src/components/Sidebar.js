'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressContext } from './ProgressProvider';
import CourseProgress from './CourseProgress';

export default function Sidebar({ lectures, isOpen, onClose }) {
  const pathname = usePathname();
  const progress = useProgressContext();

  return (
    <nav className={`sidebar${isOpen ? ' open' : ''}`}>
      <CourseProgress />

      <div className="sidebar__nav-links">
        <Link
          href="/notes"
          className={`sidebar__nav-link${pathname === '/notes' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">sticky_note_2</span>
          <span>ملاحظاتي</span>
        </Link>
        <Link
          href="/assignments"
          className={`sidebar__nav-link${pathname === '/assignments' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">task_alt</span>
          <span>التكليفات</span>
        </Link>
        <Link
          href="/qa"
          className={`sidebar__nav-link${pathname === '/qa' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">help_center</span>
          <span>أسئلة وأجوبة</span>
        </Link>
        <Link
          href="/profile-card"
          className={`sidebar__nav-link${pathname === '/profile-card' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">badge</span>
          <span>بطاقة التعارف</span>
        </Link>
        <Link
          href="/questions"
          className={`sidebar__nav-link${pathname === '/questions' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">quiz</span>
          <span>أسئلة الخِطبة</span>
        </Link>
        <Link
          href="/needs-female"
          className={`sidebar__nav-link${pathname === '/needs-female' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">female</span>
          <span>حاجات الأنثى</span>
        </Link>
        <Link
          href="/needs-male"
          className={`sidebar__nav-link${pathname === '/needs-male' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">male</span>
          <span>حاجات الرجل</span>
        </Link>
        <Link
          href="/resources"
          className={`sidebar__nav-link${pathname === '/resources' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">video_library</span>
          <span>مصادر إضافية</span>
        </Link>
        <Link
          href="/updates"
          className={`sidebar__nav-link${pathname === '/updates' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">update</span>
          <span>سجل التحديثات</span>
        </Link>
        <Link
          href="/settings"
          className={`sidebar__nav-link${pathname === '/settings' ? ' active' : ''}`}
          onClick={onClose}
        >
          <span className="material-icons-round">settings</span>
          <span>إدارة البيانات</span>
        </Link>
      </div>

      <div className="sidebar__header">المجالس</div>
      <ul className="sidebar__list">
        {lectures.map((l) => {
          const isActive = pathname === `/lectures/${l.slug}`;
          const read = progress?.mounted && progress.isRead(l.slug);
          const bookmarked = progress?.mounted && progress.isBookmarked(l.slug);
          return (
            <li key={l.slug} className="sidebar__item">
              <Link
                href={`/lectures/${l.slug}`}
                className={`sidebar__link${isActive ? ' active' : ''}${read ? ' sidebar__link--read' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar__number">{l.arabicNum}</span>
                <span className="sidebar__text">{l.shortTitle}</span>
                {bookmarked && (
                  <span className="sidebar__bookmark material-icons-round">bookmark</span>
                )}
                {read && !bookmarked && (
                  <span className="sidebar__check material-icons-round">check_circle</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
