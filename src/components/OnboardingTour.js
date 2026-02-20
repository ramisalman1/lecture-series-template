'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const HOME_KEY = 'tour-home-done';
const LECTURE_KEY = 'tour-lecture-done';

function waitFor(selector, timeout = 4000) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) return resolve(true);
    const start = Date.now();
    const iv = setInterval(() => {
      if (document.querySelector(selector) || Date.now() - start > timeout) {
        clearInterval(iv);
        resolve(!!document.querySelector(selector));
      }
    }, 100);
  });
}

function runHomeTour() {
  const ref = {};
  ref.d = driver({
    showProgress: true,
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'تم',
    popoverClass: 'tour-popover',
    showButtons: ['next', 'previous', 'close'],
    allowClose: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    overlayOpacity: 1,
    stagePadding: 12,
    stageRadius: 12,
    smoothScroll: true,
    animate: true,
    onDestroyed: () => {
      try { localStorage.setItem(HOME_KEY, '1'); } catch {}
    },
    steps: [
      {
        element: '.sidebar__list',
        onHighlightStarted: () => {
          const btn = document.querySelector('.header__menu-btn');
          if (btn) btn.click();
          return new Promise(r => setTimeout(r, 350));
        },
        popover: {
          title: 'قائمة المجالس',
          description: '٥٣ مجلسًا مرتّبًا بعناية. كل مجلس يظهر حالته — مقروء أو في المفضّلة.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/notes"]',
        popover: {
          title: 'ملاحظاتي',
          description: 'جميع ملاحظاتك مجمّعة في مكان واحد، مرتّبة حسب المجلس.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/assignments"]',
        popover: {
          title: 'التكليفات',
          description: 'مهامّ عملية مطلوبة منك بعد كل مجلس لتطبيق ما تعلّمته.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/qa"]',
        popover: {
          title: 'أسئلة وأجوبة',
          description: 'فهرس لأهم الأسئلة المطروحة في المجالس مع إجاباتها.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/profile-card"]',
        popover: {
          title: 'بطاقة التعارف',
          description: 'أنشئ بطاقة تعريفية شخصية تلخّص معلوماتك الأساسية.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/questions"]',
        popover: {
          title: 'أسئلة الخِطبة',
          description: 'أسئلة مُعدّة للتعارف خلال مرحلة الخِطبة.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/needs-female"]',
        popover: {
          title: 'حاجات الذكر والأنثى',
          description: 'تجميع لأهم حاجات الطرفين من واقع مشاركات جمهور المجالس.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/resources"]',
        popover: {
          title: 'مصادر إضافية',
          description: 'مصادر إضافية ذُكرت في المحاضرات للتوسّع والاستزادة.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/updates"]',
        popover: {
          title: 'سجل التحديثات',
          description: 'يعرض كافة التحديثات والتغييرات على الموقع.',
        },
      },
      {
        element: '.sidebar__nav-link[href="/settings"]',
        popover: {
          title: 'الإعدادات',
          description: 'تصدير بياناتك واستيرادها، وتخصيص تجربتك.',
        },
      },
      {
        element: '.home-stats',
        onHighlightStarted: () => {
          const o = document.querySelector('.sidebar-overlay');
          if (o) o.click();
          return new Promise(r => setTimeout(r, 300));
        },
        popover: {
          title: 'شريط التقدّم',
          description: 'يوضّح كم مجلسًا أتممت من أصل ٥٣.',
        },
      },
    ],
  });
  ref.d.drive();
}

async function runLectureTour() {
  const ready = await waitFor('.lecture-toolbar__inner');
  if (!ready) return;
  await waitFor('.notes-fab');

  const ref = {};
  ref.d = driver({
    showProgress: true,
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'تم',
    popoverClass: 'tour-popover',
    showButtons: ['next', 'previous', 'close'],
    allowClose: true,
    overlayColor: 'rgba(0,0,0,0.5)',
    overlayOpacity: 1,
    stagePadding: 12,
    stageRadius: 12,
    smoothScroll: true,
    animate: true,
    onDestroyed: () => {
      try { localStorage.setItem(LECTURE_KEY, '1'); } catch {}
    },
    steps: [
      {
        element: '.content [data-p="0"]',
        popover: {
          title: 'نص المجلس',
          description: 'حدّد أي نص لإضافة ملاحظة شخصية عليه. على الجوّال: فعّل وضع التعليق ثم اضغط الفقرة.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(1)',
        popover: {
          title: 'المفضّلة',
          description: 'أضف المجلس للمفضّلة للعودة إليه بسرعة من القائمة الجانبية.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(2)',
        popover: {
          title: 'تحديد كمقروء',
          description: 'حدّد المجلس كمقروء ليُحتسب في شريط تقدّمك على الصفحة الرئيسية.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(3)',
        popover: {
          title: 'ملاحظات بجانب النص',
          description: 'أظهر أو أخفِ ملاحظاتك داخل النص مباشرة بجانب الفقرات المرتبطة بها.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(4)',
        popover: {
          title: 'تصدير PDF',
          description: 'صدّر المجلس كملف PDF مع ملاحظاتك لحفظه أو طباعته.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(5)',
        popover: {
          title: 'مشاركة المجلس',
          description: 'شارك رابط المجلس عبر تويتر أو تلغرام أو واتساب أو انسخ الرابط.',
        },
      },
      {
        element: '.notes-fab',
        popover: {
          title: 'درج الملاحظات',
          description: 'افتح درج الملاحظات لاستعراض كل ملاحظاتك على هذا المجلس وإضافة ملاحظات جديدة.',
        },
      },
    ],
  });
  ref.d.drive();
}

/* ── Welcome Modal (custom) ── */
function WelcomeModal({ onStart, onSkip }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div className={`welcome-overlay${visible ? ' welcome-overlay--visible' : ''}`}>
      <div className={`welcome-card${visible ? ' welcome-card--visible' : ''}`}>
        <div className="welcome-card__badge">ألف باء</div>
        <h1 className="welcome-card__title">أهلًا بك في ألف باء الزواج</h1>
        <p className="welcome-card__desc">
          سلسلة من <strong>٥٣ مجلسًا معرفيًا</strong> تتناول أسس الزواج ومقدّماته
          — من فهم النفس والآخر، إلى الخِطبة والحياة الزوجية.
        </p>
        <div className="welcome-card__features">
          <div className="welcome-card__feature">
            <span className="material-icons-round">menu_book</span>
            <span>٥٣ مجلسًا مرتّبًا</span>
          </div>
          <div className="welcome-card__feature">
            <span className="material-icons-round">edit_note</span>
            <span>ملاحظات شخصية</span>
          </div>
          <div className="welcome-card__feature">
            <span className="material-icons-round">quiz</span>
            <span>أدوات تفاعلية</span>
          </div>
        </div>
        <div className="welcome-card__actions">
          <button className="welcome-card__btn welcome-card__btn--primary" onClick={onStart}>
            خذني في جولة سريعة
          </button>
          <button className="welcome-card__btn welcome-card__btn--ghost" onClick={onSkip}>
            تخطّي، أريد استكشاف بنفسي
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingTour() {
  const pathname = usePathname();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLectureTip, setShowLectureTip] = useState(false);

  useEffect(() => {
    try {
      if (pathname === '/' && !localStorage.getItem(HOME_KEY)) {
        setShowWelcome(true);
      }
      const m = pathname.match(/^\/lectures\/(lecture-\d+)/);
      if (m && !localStorage.getItem(LECTURE_KEY)) {
        setShowLectureTip(true);
      }
    } catch {}
  }, [pathname]);

  const dismissWelcome = useCallback(() => {
    setShowWelcome(false);
    try { localStorage.setItem(HOME_KEY, '1'); } catch {}
  }, []);

  const startHomeTour = useCallback(() => {
    setShowWelcome(false);
    setTimeout(runHomeTour, 400);
  }, []);

  useEffect(() => {
    if (!showLectureTip) return;
    setShowLectureTip(false);
    setTimeout(() => runLectureTour(), 600);
  }, [showLectureTip]);

  if (showWelcome) {
    return <WelcomeModal onStart={startHomeTour} onSkip={dismissWelcome} />;
  }

  return null;
}
