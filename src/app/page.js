import Link from 'next/link';
import { getAllLectures } from '../lib/lectures';
import HomeStats from '../components/HomeStats';
import SearchFilter from '../components/SearchFilter';

export default function HomePage() {
  const lectures = getAllLectures();

  return (
    <main className="main main--home">
      {/* Hero Banner */}
      <div className="home-banner">
        <img
          src="/hero-banner.jpg"
          alt="ألف باء الزواج — سلسلة مجالس مع عبد الرحمن ذاكر الهاشمي"
          className="home-banner__img"
        />
      </div>

      {/* Reading Progress */}
      <HomeStats totalLectures={lectures.length} />

      {/* About Section */}
      <div className="home-section">
        <div className="home-section__row">
          <div className="home-section__card">
            <div className="home-section__card-icon">
              <span className="material-icons-round">menu_book</span>
            </div>
            <h2 className="home-section__card-title">عن السلسلة</h2>
            <p className="home-section__card-text">
              &quot;ألف باء الزواج&quot; سلسلة مجالس يقدّمها الدكتور عبد الرحمن ذاكر الهاشمي، مُستفادة من مادة فقه النفس: اقرأ، ونفس، لتعارفوا. تتناول ما لا يسعك جهله من فقه النفس فيما يتعلق بالزواج، بدءًا من تشكّل النفس الإنسانية وأمشاجها وحاجاتها وعلاقتها بالمخلوقية، مرورًا بتصحيح المغالطات والجهالات الشائعة، وصولًا إلى التطبيقات العملية في مراحل الزواج المختلفة.
            </p>
          </div>

          <div className="home-section__card">
            <div className="home-section__card-icon">
              <span className="material-icons-round">person</span>
            </div>
            <h2 className="home-section__card-title">عن المعلم</h2>
            <p className="home-section__card-text">
              الدكتور عبد الرحمن ذاكر الهاشمي، مواليد العراق لأب عراقي وأم لبنانية، مقيم في الأردن. طبيب واستشاري العلاج النفسي والتربوي. حاصل على دبلوم في الفلسفة والدراسات الإسلامية، بكالوريوس علم النفس العام، بكالوريوس الطب والجراحة العامة، ماجستير علم النفس التربوي، وماجستير علم النفس العيادي. خبرة أكثر من ٢٠ عامًا في مجال العلاج الأسري والتربوي والنفسي. مؤسس مادة فقه النفس: اقرأ، ونفس، لتعارفوا. يقدّم مجموعة مجالس في مركز مكاني في الأردن.
            </p>
          </div>
        </div>

        <div className="home-section__card home-section__card--wide">
          <div className="home-section__card-icon">
            <span className="material-icons-round">auto_stories</span>
          </div>
          <h2 className="home-section__card-title">عن الموقع ومنهجيته</h2>
          <p className="home-section__card-text">
            هذا الموقع يُعيد تقديم محتوى المجالس المرئية في صورة نصية مُنظَّمة وسهلة التصفح والمراجعة. جرى تحويل كل مجلس من تسجيله المرئي إلى نص مُعاد هيكلته مع الحفاظ الكامل على جميع الأفكار والأمثلة والشروحات، مع إزالة التكرار اللفظي دون حذف أي فكرة أو توجيه.
          </p>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="home-tools-grid">
        <Link href="/questions" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon">quiz</span>
          <h3 className="home-tool-card__title">أسئلة الخاطب والمخطوبة</h3>
          <p className="home-tool-card__desc">كراسة أسئلة للتعارف قبل الزواج مبنية على فقه النفس. أجب عنها وصدّرها لمشاركتها.</p>
        </Link>

        <Link href="/profile-card" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon">badge</span>
          <h3 className="home-tool-card__title">بطاقة التعارف</h3>
          <p className="home-tool-card__desc">ورقة تعريف بالنفس تُرسل للطرف الآخر قبل اللقاء الشخصي. املأها وصدّرها كـ PDF.</p>
        </Link>

        <Link href="/assignments" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon">task_alt</span>
          <h3 className="home-tool-card__title">التكليفات</h3>
          <p className="home-tool-card__desc">تكليفات عملية وكتابية من المجالس. سجّل التزامك وتابع تقدّمك.</p>
        </Link>

        <Link href="/resources" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon">video_library</span>
          <h3 className="home-tool-card__title">مصادر إضافية</h3>
          <p className="home-tool-card__desc">جلسات وبثوث ومحتوى مكمّل من متحدثين آخرين حول الزواج والأسرة.</p>
        </Link>

        <Link href="/qa" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon">help_center</span>
          <h3 className="home-tool-card__title">أسئلة وأجوبة</h3>
          <p className="home-tool-card__desc">فهرس شامل للأسئلة والأجوبة من المجالس مُنظَّم حسب الموضوع.</p>
        </Link>

<Link href="/needs-female" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon" style={{ color: '#E91E63' }}>female</span>
          <h3 className="home-tool-card__title">حاجات الأنثى</h3>
          <p className="home-tool-card__desc">حاجات الأنثى الحقيقية في الزواج من الزوج والمنزل — مع التمييز بين الحاجة وما فوقها.</p>
        </Link>

        <Link href="/needs-male" className="home-tool-card">
          <span className="material-icons-round home-tool-card__icon" style={{ color: '#1565C0' }}>male</span>
          <h3 className="home-tool-card__title">حاجات الرجل</h3>
          <p className="home-tool-card__desc">حاجات الرجل الحقيقية في الزواج من الزوجة — مع التمييز بين الحاجة وما فوقها.</p>
        </Link>
      </div>

      {/* Lectures */}
      <SearchFilter lectures={lectures} />
    </main>
  );
}
