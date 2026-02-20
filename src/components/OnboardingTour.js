'use client';

import { useState, useEffect } from 'react';

const TOUR_KEY = 'tour-completed';

const slides = [
  {
    icon: 'auto_stories',
    title: 'مرحبًا بك في ألف باء الزواج',
    body: 'سلسلة مجالس معرفية شاملة تتناول أسس الزواج ومقدماته.\nتصفّح المجالس بالترتيب أو اختر ما يناسبك من القائمة الجانبية.',
  },
  {
    icon: 'trending_up',
    title: 'تتبّع تقدمك',
    body: 'حدّد المجلس كـ«مقروء» لتتابع تقدّمك عبر شريط التقدم في القائمة الجانبية.\nيمكنك أيضًا حفظ المجالس في المفضلة للعودة إليها لاحقًا.',
  },
  {
    icon: 'edit_note',
    title: 'أضف ملاحظاتك',
    body: 'على الحاسوب: حدّد نصًا وستظهر نافذة لإضافة ملاحظتك.\nعلى الجوال: اضغط زر + الأخضر ثم اضغط على الفقرة المطلوبة.\nملاحظاتك خاصة ومحفوظة على جهازك فقط.',
  },
  {
    icon: 'folder_open',
    title: 'أدِر ملاحظاتك',
    body: 'عدّل أو احذف ملاحظاتك من الدرج الجانبي أو من صفحة الملاحظات.\nيمكنك تصدير ملاحظاتك واستيرادها للانتقال بين الأجهزة.',
  },
  {
    icon: 'handyman',
    title: 'أدوات تفاعلية',
    body: 'استكشف أدوات مخصصة: أسئلة الخِطبة، بطاقة التعارف، التكليفات، حاجات الأنثى والرجل من الزواج، أسئلة وأجوبة، والمزيد.\nتجدها في القائمة الجانبية أو على الصفحة الرئيسية.',
  },
  {
    icon: 'rocket_launch',
    title: 'ابدأ رحلتك المعرفية',
    body: 'ثلاثة وخمسون مجلسًا تنتظرك.\nابدأ من المجلس الأول أو اختر الموضوع الذي يهمك.',
  },
];

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_KEY)) {
        setShow(true);
      }
    } catch {}
  }, []);

  function dismiss() {
    try { localStorage.setItem(TOUR_KEY, '1'); } catch {}
    setShow(false);
  }

  function next() {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      dismiss();
    }
  }

  function prev() {
    if (current > 0) setCurrent(current - 1);
  }

  if (!show) return null;

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  return (
    <div className="tour-overlay">
      <div className="tour-slide">
        <button className="tour-skip" onClick={dismiss}>تخطّي</button>

        <span className="material-icons-round tour-slide__icon">{slide.icon}</span>
        <h2 className="tour-slide__title">{slide.title}</h2>
        <p className="tour-slide__body">{slide.body}</p>

        <div className="tour-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`tour-dot${i === current ? ' tour-dot--active' : ''}`}
            />
          ))}
        </div>

        <div className="tour-actions">
          {current > 0 && (
            <button className="tour-btn tour-btn--secondary" onClick={prev}>
              <span className="material-icons-round">arrow_forward</span>
              السابق
            </button>
          )}
          <button className="tour-btn tour-btn--primary" onClick={next}>
            {isLast ? 'ابدأ الآن' : 'التالي'}
            {!isLast && <span className="material-icons-round">arrow_back</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
