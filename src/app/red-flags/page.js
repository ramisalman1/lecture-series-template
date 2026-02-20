import RedFlagsChecklist from '../../components/RedFlagsChecklist';

export const metadata = {
  title: 'العلامات الحمراء — ألف باء الزواج',
  description: 'علامات تحذيرية يجب الانتباه لها عند اختيار شريك الحياة — مستخرجة من سلسلة ألف باء الزواج',
};

export default function RedFlagsPage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="qa-page__header">
          <span className="material-icons-round qa-page__icon" style={{ color: '#E53935' }}>flag</span>
          <h1 className="qa-page__title">العلامات الحمراء</h1>
          <p className="qa-page__desc">علامات تحذيرية يجب الانتباه لها عند اختيار شريك الحياة — حدّد ما ينطبق على حالتك</p>
        </div>
        <RedFlagsChecklist />
      </div>
    </main>
  );
}
