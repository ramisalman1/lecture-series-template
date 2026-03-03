import AssignmentsTracker from '../../components/AssignmentsTracker';

export const metadata = {
  // ── عدّل اسم السلسلة ──
  title: 'التكليفات — اسم السلسلة',
  description: 'تكليفات عملية وكتابية من السلسلة — تابع التزامك بها',
};

export default function AssignmentsPage() {
  return (
    <main className="main main--home">
      <div className="assignments-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">task_alt</span>
          </div>
          <h1 className="section-header__title">التكليفات</h1>
          <p className="section-header__desc">تكليفات عملية وكتابية مُستخرجة من المجالس — سجّل التزامك وتابع تقدّمك</p>
        </div>
        <AssignmentsTracker />
      </div>
    </main>
  );
}
