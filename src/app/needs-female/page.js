import NeedsChecklist from '../../components/NeedsChecklist';
import { NEEDS_FEMALE_INTRO, NEEDS_FEMALE_NOTES, NEEDS_FEMALE_SECTIONS } from '../../lib/needs-female-data';

export const metadata = {
  title: 'حاجات الأنثى من الزواج — ألف باء الزواج',
  description: 'حاجات الأنثى الحقيقية في الزواج من الزوج والمنزل وحفل الزفاف — مستخرجة من مجالس ألف باء الزواج',
};

export default function NeedsFemalePage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">female</span>
          </div>
          <h1 className="section-header__title">حاجات الأنثى من الزواج</h1>
          <p className="section-header__desc">حاجات الأنثى الحقيقية في الزواج — من واقع مشاركات جمهور مجالس ألف باء الزواج</p>
        </div>
        <NeedsChecklist
          sections={NEEDS_FEMALE_SECTIONS}
          intro={NEEDS_FEMALE_INTRO}
          notes={NEEDS_FEMALE_NOTES}
        />
      </div>
    </main>
  );
}
