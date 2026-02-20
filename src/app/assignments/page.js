import AssignmentsTracker from '../../components/AssignmentsTracker';

export const metadata = {
  title: 'التكليفات — ألف باء الزواج',
  description: 'تكليفات عملية وكتابية من سلسلة ألف باء الزواج — تابع التزامك بها',
};

export default function AssignmentsPage() {
  return (
    <main className="main main--home">
      <div className="assignments-page">
        <div className="assignments-page__header">
          <span className="material-icons-round assignments-page__icon">task_alt</span>
          <h1 className="assignments-page__title">التكليفات</h1>
          <p className="assignments-page__desc">تكليفات عملية وكتابية مُستخرجة من المجالس — سجّل التزامك وتابع تقدّمك</p>
        </div>
        <AssignmentsTracker />
      </div>
    </main>
  );
}
