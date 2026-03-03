import Link from 'next/link';
import { getAllLectures } from '../lib/lectures';
import HomeStats from '../components/HomeStats';
import SearchFilter from '../components/SearchFilter';

export default function HomePage() {
  const lectures = getAllLectures();

  return (
    <main className="main main--home">
      {/* Hero Banner — أضف صورة البانر في public/hero-banner.jpg */}
      {/* <div className="home-banner">
        <img
          src="/hero-banner.jpg"
          alt="عنوان السلسلة"
          className="home-banner__img"
        />
      </div> */}

      {/* Reading Progress */}
      <HomeStats totalLectures={lectures.length} />

      {/* About Section — عدّل المحتوى ليناسب سلسلتك */}
      <div className="home-section">
        <div className="home-section__row">
          <div className="home-section__card">
            <div className="home-section__card-icon">
              <span className="material-icons-round">menu_book</span>
            </div>
            <h2 className="home-section__card-title">عن السلسلة</h2>
            <p className="home-section__card-text">
              أضف وصفًا للسلسلة هنا.
            </p>
          </div>

          <div className="home-section__card">
            <div className="home-section__card-icon">
              <span className="material-icons-round">person</span>
            </div>
            <h2 className="home-section__card-title">عن المعلم</h2>
            <p className="home-section__card-text">
              أضف وصفًا عن المعلم أو المقدّم هنا.
            </p>
          </div>
        </div>

        <div className="home-section__card home-section__card--wide">
          <div className="home-section__card-icon">
            <span className="material-icons-round">auto_stories</span>
          </div>
          <h2 className="home-section__card-title">عن الموقع ومنهجيته</h2>
          <p className="home-section__card-text">
            أضف وصفًا عن الموقع ومنهجيته هنا.
          </p>
        </div>
      </div>

      {/* Quick Tools — أضف أو احذف أدوات حسب سلسلتك */}
      <div className="home-tools-grid">
        <Link href="/assignments" className="home-tool-card">
          <div className="home-tool-card__icon-wrap">
            <span className="material-icons-round">task_alt</span>
          </div>
          <h3 className="home-tool-card__title">التكليفات</h3>
          <p className="home-tool-card__desc">تكليفات عملية وكتابية من المجالس. سجّل التزامك وتابع تقدّمك.</p>
        </Link>

        <Link href="/resources" className="home-tool-card">
          <div className="home-tool-card__icon-wrap">
            <span className="material-icons-round">video_library</span>
          </div>
          <h3 className="home-tool-card__title">مصادر إضافية</h3>
          <p className="home-tool-card__desc">مصادر ومواد إضافية مكمّلة للسلسلة.</p>
        </Link>
      </div>

      {/* Lectures */}
      <SearchFilter lectures={lectures} />
    </main>
  );
}
