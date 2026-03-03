// ── عدّل عنوان ووصف الصفحة ──
export const metadata = {
  title: 'سجل التحديثات — اسم السلسلة',
  description: 'سجل تحديثات وتطويرات الموقع',
};

// ── أضف التحديثات هنا ──
// كل تحديث يحتاج: date, dateGregorian, title, icon, items[]
const UPDATES = [
  // {
  //   date: 'التاريخ الهجري',
  //   dateGregorian: 'التاريخ الميلادي',
  //   title: 'عنوان التحديث',
  //   icon: 'rocket_launch',
  //   items: [
  //     'وصف التغيير الأول',
  //     'وصف التغيير الثاني',
  //   ],
  // },
];

export default function UpdatesPage() {
  return (
    <main className="main main--home">
      <div className="updates-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">update</span>
          </div>
          <h1 className="section-header__title">سجل التحديثات</h1>
          <p className="section-header__desc">تطويرات وتحديثات الموقع</p>
        </div>

        {UPDATES.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.6 }}>
            <span className="material-icons-round" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>update</span>
            <p>لا توجد تحديثات بعد.</p>
          </div>
        ) : (
          <div className="updates-page__timeline">
            {UPDATES.map((update, i) => (
              <div key={i} className="updates-page__entry">
                <div className="updates-page__entry-marker">
                  <span className="material-icons-round">{update.icon}</span>
                </div>
                <div className="updates-page__entry-content">
                  <div className="updates-page__entry-dates">
                    <span className="updates-page__entry-date">{update.date}</span>
                    <span className="updates-page__entry-date-g">{update.dateGregorian}</span>
                  </div>
                  <h2 className="updates-page__entry-title">{update.title}</h2>
                  <ul className="updates-page__entry-list">
                    {update.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
