import RedFlagsChecklist from '../../components/RedFlagsChecklist';

export const metadata = {
  title: 'العلامات الحمراء — ألف باء الزواج',
  description: 'علامات تحذيرية يجب الانتباه لها عند اختيار شريك الحياة — مستخرجة من سلسلة ألف باء الزواج',
};

export default function RedFlagsPage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="section-header">
          <div className="section-header__icon-wrap section-header__icon-wrap--red">
            <span className="material-icons-round">flag</span>
          </div>
          <h1 className="section-header__title">العلامات الحمراء</h1>
          <p className="section-header__desc">علامات تحذيرية يجب الانتباه لها عند اختيار شريك الحياة — حدّد ما ينطبق على حالتك</p>
        </div>
        <RedFlagsChecklist />
      </div>
    </main>
  );
}
