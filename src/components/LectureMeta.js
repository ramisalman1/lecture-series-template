export default function LectureMeta({ ordinal, section, readingTime, frontmatter }) {
  return (
    <>
      <div className="lecture-meta">
        <span className="lecture-meta__badge">المجلس {ordinal}</span>
        <span className="lecture-meta__series">{section}</span>
        {readingTime && (
          <span className="lecture-meta__reading-time">
            <span className="material-icons-round lecture-meta__icon">schedule</span>
            {readingTime} دقيقة قراءة
          </span>
        )}
      </div>

      {frontmatter && (
        <div className="lecture-info">
          <p><strong>السلسلة:</strong> {frontmatter.series}</p>
          <p><strong>رقم المجلس:</strong> {String(frontmatter.number).padStart(2, '0')}</p>
          <p><strong>الموضوع:</strong> {frontmatter.topic}</p>
          <p><strong>المعلم:</strong> {frontmatter.speaker}</p>
          {frontmatter.youtube && (
            <p>
              <strong>المصدر:</strong>{' '}
              <a href={frontmatter.youtube} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </p>
          )}
        </div>
      )}
    </>
  );
}
