import QuestionsWorkbook from '../../components/QuestionsWorkbook';

export const metadata = {
  title: 'أسئلة الخِطبة — ألف باء الزواج',
  description: 'كراسة تفاعلية لأسئلة الخاطب والمخطوبة — أسئلة للتأمل والتعارف قبل الزواج',
};

export default function QuestionsPage() {
  return (
    <main className="main main--home">
      <div className="questions-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">quiz</span>
          </div>
          <h1 className="section-header__title">كراسة أسئلة الخِطبة</h1>
          <p className="section-header__desc">أسئلة للتأمل والتعارف — للخاطب والمخطوبة</p>
        </div>
        <QuestionsWorkbook />
      </div>
    </main>
  );
}
