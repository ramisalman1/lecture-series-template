import { LECTURES, ORDINAL_NAMES } from '../../lib/constants';
import AllNotesView from '../../components/AllNotesView';

export const metadata = {
  // ── عدّل اسم السلسلة ──
  title: 'ملاحظاتي — اسم السلسلة',
};

export default function NotesPage() {
  const lectures = LECTURES.map((l, i) => ({
    ...l,
    ordinal: ORDINAL_NAMES[i],
  }));

  return (
    <main className="main main--home">
      <div className="notes-page">
        <div className="section-header">
          <div className="section-header__icon-wrap">
            <span className="material-icons-round">sticky_note_2</span>
          </div>
          <h1 className="section-header__title">ملاحظاتي</h1>
          <p className="section-header__desc">جميع ملاحظاتك عبر المجالس في مكان واحد</p>
        </div>
        <AllNotesView lectures={lectures} />
      </div>
    </main>
  );
}
