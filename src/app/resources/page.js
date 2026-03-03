// ── عدّل عنوان ووصف الصفحة ──
export const metadata = {
  title: 'مصادر إضافية — اسم السلسلة',
  description: 'مصادر ومواد إضافية مكمّلة للسلسلة',
};

// ── أضف المصادر هنا ──
// كل مصدر يحتاج: id, title, description, speakers, type, url, icon
// يمكنك إضافة relatedLinks[] اختياريًا
//
// مثال:
// {
//   id: 'resource-1',
//   title: 'عنوان المصدر',
//   description: 'وصف المصدر.',
//   speakers: 'اسم المتحدث',
//   type: 'بث مباشر',
//   url: 'https://...',
//   icon: 'play_circle',
// },
const RESOURCES = [];

export default function ResourcesPage() {
  return (
    <main className="main main--home">
      <div className="resources-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">video_library</span>
          </div>
          <h1 className="section-header__title">مصادر إضافية</h1>
          <p className="section-header__desc">مصادر ومواد إضافية مكمّلة للسلسلة</p>
        </div>

        {RESOURCES.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.6 }}>
            <span className="material-icons-round" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>video_library</span>
            <p>لا توجد مصادر إضافية بعد.</p>
          </div>
        ) : (
          <div className="resources-page__list">
            {RESOURCES.map(r => (
              <div key={r.id} className="resource-card-wrapper">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                >
                  <span className={`material-icons-round resource-card__icon`}>{r.icon}</span>
                  <div className="resource-card__body">
                    <h2 className="resource-card__title">{r.title}</h2>
                    <p className="resource-card__desc">{r.description}</p>
                    <div className="resource-card__meta">
                      <span>{r.speakers}</span>
                      <span className="resource-card__badge">{r.type}</span>
                    </div>
                  </div>
                  <span className="material-icons-round resource-card__external">{r.url.startsWith('/') ? 'download' : 'open_in_new'}</span>
                </a>
                {r.relatedLinks && r.relatedLinks.length > 0 && (
                  <div className="resource-card__related">
                    <span className="resource-card__related-label">
                      <span className="material-icons-round">link</span>
                      شروحات مرتبطة
                    </span>
                    <div className="resource-card__related-links">
                      {r.relatedLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card__related-link"
                        >
                          <span className="material-icons-round">play_circle</span>
                          <span>{link.title}</span>
                          <span className="material-icons-round resource-card__related-ext">open_in_new</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
