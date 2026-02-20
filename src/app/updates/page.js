export const metadata = {
  title: 'سجل التحديثات — ألف باء الزواج',
  description: 'سجل تحديثات وتطويرات موقع ألف باء الزواج',
};

const UPDATES = [
  {
    date: '١ رمضان ١٤٤٧',
    dateGregorian: '١٨ فبراير ٢٠٢٦',
    title: 'إطلاق الموقع',
    icon: 'rocket_launch',
    items: [
      'إطلاق الموقع بالنسخة الأولى مع ٥٣ مجلسًا مكتوبًا',
      'نظام ملاحظات وتعليقات على الفقرات مع حفظ تلقائي',
      'تصدير المجالس كـ PDF مع إمكانية تضمين الملاحظات',
      'كراسة أسئلة الخاطب والمخطوبة مع التصدير',
      'بطاقة التعارف مع التصدير كـ PDF',
      'صفحة التكليفات العملية',
      'صفحة المصادر الإضافية',
      'صفحة الأسئلة والأجوبة',
      'صفحة حاجات الأنثى وحاجات الرجل',
      'بحث شامل في جميع المجالس',
      'وضع ليلي ومتابعة تقدم القراءة',
    ],
  },
];

export default function UpdatesPage() {
  return (
    <main className="main main--home">
      <div className="updates-page">
        <div className="updates-page__header">
          <span className="material-icons-round updates-page__icon">update</span>
          <h1 className="updates-page__title">سجل التحديثات</h1>
          <p className="updates-page__desc">تطويرات وتحديثات الموقع</p>
        </div>

        <div className="updates-page__dua">
          <div className="updates-page__dua-body">
            <p className="updates-page__dua-text">
              الحمد لله ربّ العالمين، والصلاة والسلام على محمد وعلى آله وصحابته أجمعين.
            </p>
            <p className="updates-page__dua-text updates-page__dua-text--highlight">
              ربِّ اشرح لي صدري ويسّر لي أمري واحلل عقدةً من لساني يفقهوا قولي.
            </p>
            <p className="updates-page__dua-text">
              اللهم وجّهنا لما خلقتنا له، واصرفنا عمّا نهيتنا عنه، ولا تشغلنا بما تكفّلت لنا به. اجعلنا من جند الخير، دُلّنا عليك، أرشدنا إليك، فهّمنا عنك وعلّمنا منك، وأعِذنا من مُضلّات الفتن ما أحييتنا. انصرنا بالإسلام وانصر الإسلام بنا، واجعلنا حُجّةً له لا عليه، واجعله حُجّةً لنا لا علينا.
            </p>
            <p className="updates-page__dua-text">
              آنِس إخواننا المستضعفين في غزّة وكن لهم أُنسًا، وهيّئ لهم فرجًا عاجلًا، واجعلنا ممّن ينصرونهم، واغفر لنا تقصيرنا في حقّهم. اللهم آمين.
            </p>
            <cite className="updates-page__dua-cite">
              — من دعاء الدكتور عبد الرحمن ذاكر الهاشمي في افتتاح المجالس
            </cite>
          </div>
        </div>

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
      </div>
    </main>
  );
}
