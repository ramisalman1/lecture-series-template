import Link from 'next/link';

export default function LectureNav({ prev, next }) {
  return (
    <div className="lecture-nav">
      {next ? (
        <Link href={`/lectures/${next.slug}`} className="lecture-nav__btn">
          <span className="material-icons-round">arrow_back</span>
          <div>
            <span className="lecture-nav__btn-label">المجلس التالي</span>
            <span className="lecture-nav__btn-title">{next.shortTitle}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {prev ? (
        <Link href={`/lectures/${prev.slug}`} className="lecture-nav__btn">
          <div>
            <span className="lecture-nav__btn-label">المجلس السابق</span>
            <span className="lecture-nav__btn-title">{prev.shortTitle}</span>
          </div>
          <span className="material-icons-round">arrow_forward</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
