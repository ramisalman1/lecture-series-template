import QAIndex from '../../components/QAIndex';

export const metadata = {
  title: 'فهرس الأسئلة والأجوبة — ألف باء الزواج',
  description: 'فهرس أسئلة من مجالس ألف باء الزواج مع روابط مباشرة إلى الإجابات في المجالس',
};

export default function QAPage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">help_center</span>
          </div>
          <h1 className="section-header__title">فهرس الأسئلة والأجوبة</h1>
          <p className="section-header__desc">أسئلة مُستخرجة من المجالس — اضغط على أيّ سؤال للانتقال إلى الإجابة الكاملة في سياقها</p>
        </div>
        <QAIndex />
      </div>
    </main>
  );
}
