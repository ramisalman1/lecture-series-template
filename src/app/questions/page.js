import QuestionsWorkbook from '../../components/QuestionsWorkbook';

export const metadata = {
  title: 'أسئلة الخِطبة — ألف باء الزواج',
  description: 'كراسة تفاعلية لأسئلة الخاطب والمخطوبة — أسئلة للتأمل والتعارف قبل الزواج',
};

export default function QuestionsPage() {
  return (
    <main className="main main--home">
      <div className="questions-page">
        <div className="questions-page__header">
          <span className="material-icons-round questions-page__icon">quiz</span>
          <h1 className="questions-page__title">كراسة أسئلة الخِطبة</h1>
          <p className="questions-page__desc">أسئلة للتأمل والتعارف — للخاطب والمخطوبة</p>
        </div>
        <QuestionsWorkbook />
      </div>
    </main>
  );
}
