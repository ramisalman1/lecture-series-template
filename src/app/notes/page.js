import { LECTURES, ORDINAL_NAMES } from '../../lib/constants';
import AllNotesView from '../../components/AllNotesView';

export const metadata = {
  title: 'ملاحظاتي — ألف باء الزواج',
};

export default function NotesPage() {
  const lectures = LECTURES.map((l, i) => ({
    ...l,
    ordinal: ORDINAL_NAMES[i],
  }));

  return (
    <main className="main main--home">
      <div className="notes-page">
        <div className="notes-page__header">
          <span className="material-icons-round notes-page__icon">sticky_note_2</span>
          <h1 className="notes-page__title">ملاحظاتي</h1>
          <p className="notes-page__desc">جميع ملاحظاتك عبر المجالس في مكان واحد</p>
        </div>
        <AllNotesView lectures={lectures} />
      </div>
    </main>
  );
}
