export const metadata = {
  title: 'مصادر إضافية — ألف باء الزواج',
  description: 'مصادر ومواد إضافية مكمّلة لسلسلة ألف باء الزواج',
};

const RESOURCES = [
  {
    id: 'shaltoni-groom-01',
    title: 'طلع الزّين من الحمّام — جلسة شبابية حول ترتيبات العريس للزواج (الجزء الأول)',
    description: 'جلسة شبابية واقعية حول ترتيبات العريس للزواج يقدمها د. حسام شلتوني وعبد الرحمن مرعي.',
    speakers: 'د. حسام شلتوني · عبد الرحمن مرعي',
    type: 'بث مباشر',
    url: 'https://www.youtube.com/live/z9Lx3TGhPjQ?si=-mYPWTOBrsP_mQwS',
    icon: 'play_circle',
  },
  {
    id: 'shaltoni-groom-02',
    title: 'طلع الزّين من الحمّام — جلسة شبابية حول ترتيبات العريس للزواج (الجزء الثاني)',
    description: 'الجزء الثاني من الجلسة الشبابية الواقعية حول ترتيبات العريس للزواج.',
    speakers: 'د. حسام شلتوني · عبد الرحمن مرعي',
    type: 'بث مباشر',
    url: 'https://www.youtube.com/watch?v=xNeuXcF_r04',
    icon: 'play_circle',
  },
  {
    id: 'fiqh-muyssar-nikah',
    title: 'الفقه الميسّر — فقه الأسرة + كتاب النكاح',
    description: 'ملف PDF يتناول فقه الأسرة وكتاب النكاح من الفقه الميسّر. مرجع فقهي مُوصى به من المجالس.',
    speakers: 'عبدالله الطيّار وآخرون',
    type: 'كتاب PDF',
    url: '/fiqh-muyssar-nikah.pdf',
    icon: 'menu_book',
    relatedLinks: [
      { title: 'شرح كتاب النكاح في مجلس واحد', url: 'https://www.youtube.com/watch?v=fCAMhwHIABQ' },
      { title: 'شرح كتاب النكاح من كتاب هداية الراغب', url: 'https://www.youtube.com/watch?v=UD6bckpDU-Y&list=PLhQrMdd6h1uBHPYX5xGDt_yohw32SoFG7' },
      { title: 'شرح كتاب النكاح من المنهج المختصر في فقه الأثر', url: 'https://www.youtube.com/playlist?list=PLWywt1VgUZE29iFg6HEH4vlF7UJE6gj7o' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="main main--home">
      <div className="resources-page">
        <div className="resources-page__header">
          <span className="material-icons-round resources-page__icon">video_library</span>
          <h1 className="resources-page__title">مصادر إضافية</h1>
          <p className="resources-page__desc">مصادر ومجالي إضافية أحيل عليها خلال المجالس</p>
        </div>

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
      </div>
    </main>
  );
}
