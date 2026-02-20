import QAIndex from '../../components/QAIndex';

export const metadata = {
  title: 'فهرس الأسئلة والأجوبة — ألف باء الزواج',
  description: 'فهرس أسئلة من مجالس ألف باء الزواج مع روابط مباشرة إلى الإجابات في المجالس',
};

export default function QAPage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="qa-page__header">
          <span className="material-icons-round qa-page__icon">quiz</span>
          <h1 className="qa-page__title">فهرس الأسئلة والأجوبة</h1>
          <p className="qa-page__desc">أسئلة مُستخرجة من المجالس — اضغط على أيّ سؤال للانتقال إلى الإجابة الكاملة في سياقها</p>
        </div>
        <QAIndex />
      </div>
    </main>
  );
}
