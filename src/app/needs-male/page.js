import NeedsChecklist from '../../components/NeedsChecklist';
import { NEEDS_MALE_INTRO, NEEDS_MALE_NOTES, NEEDS_MALE_SECTIONS, NEEDS_MALE_GENERAL_TIPS } from '../../lib/needs-male-data';

export const metadata = {
  title: 'حاجات الرجل من الزواج — ألف باء الزواج',
  description: 'حاجات الرجل الحقيقية في الزواج من الزوجة — مستخرجة من مجالس ألف باء الزواج',
};

export default function NeedsMalePage() {
  return (
    <main className="main main--home">
      <div className="qa-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">male</span>
          </div>
          <h1 className="section-header__title">حاجات الرجل من الزواج</h1>
          <p className="section-header__desc">حاجات الرجل الحقيقية في الزواج — من واقع مشاركات جمهور مجالس ألف باء الزواج</p>
        </div>
        <NeedsChecklist
          sections={NEEDS_MALE_SECTIONS}
          intro={NEEDS_MALE_INTRO}
          notes={NEEDS_MALE_NOTES}
          generalTips={NEEDS_MALE_GENERAL_TIPS}
        />
      </div>
    </main>
  );
}
