'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_KEY = 'tour-completed';
const PHASE_KEY = 'tour-phase';
const ANN_KEY = 'lecture-annotations';
const SAMPLE_ANN_ID = 'tour_sample_annotation';

function markComplete() {
  try {
    localStorage.setItem(TOUR_KEY, '1');
    localStorage.removeItem(PHASE_KEY);
  } catch {}
}

function injectSampleAnnotation() {
  try {
    const existing = JSON.parse(localStorage.getItem(ANN_KEY)) || [];
    if (existing.some(a => a.id === SAMPLE_ANN_ID)) return;
    existing.push({
      id: SAMPLE_ANN_ID,
      slug: 'lecture-01',
      pIndex: 0,
      selectedText: 'الحمد لله رب العالمين',
      note: 'هذه ملاحظة تجريبية — يمكنك تعديلها أو حذفها.',
      createdAt: Date.now(),
    });
    localStorage.setItem(ANN_KEY, JSON.stringify(existing));
  } catch {}
}

function addSkipButton(popover, tourDriver) {
  const navBtns = popover.footerButtons;
  if (!navBtns || navBtns.querySelector('.driver-popover-skip-btn')) return;
  const skipBtn = document.createElement('button');
  skipBtn.textContent = 'تخطي';
  skipBtn.className = 'driver-popover-skip-btn';
  skipBtn.addEventListener('click', () => {
    tourDriver.destroy();
  });
  navBtns.appendChild(skipBtn);
}

function runPhase1() {
  const tourDriver = driver({
    showProgress: true,
    progressText: '{{current}} من {{total}}',
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'التالي',
    popoverClass: 'driver-popover-rtl',
    allowClose: true,
    overlayColor: 'rgba(0,0,0,0.6)',
    onPopoverRender: (popover) => {
      addSkipButton(popover, tourDriver);
    },
    steps: [
      {
        popover: {
          title: 'مرحبًا بك 👋',
          description: 'دعنا نأخذك في جولة سريعة للتعرّف على الموقع وأدواته.',
        },
      },
      {
        element: '.sidebar__list',
        popover: {
          title: 'قائمة المجالس',
          description: 'هذه قائمة المجالس الـ ٥٣.\nيمكنك تتبع تقدمك وحفظ المفضلة من القائمة.',
          onHighlightStarted: () => {
            const menuBtn = document.querySelector('.header__menu-btn');
            if (menuBtn) menuBtn.click();
            return new Promise(resolve => setTimeout(resolve, 350));
          },
        },
      },
      {
        element: '.sidebar__nav-links',
        popover: {
          title: 'أدوات ومحتوى إضافي',
          description: 'ملاحظاتك، أسئلة الخِطبة، بطاقة التعارف، إدارة البيانات، والمزيد.',
        },
      },
      {
        element: '.home-stats',
        popover: {
          title: 'شريط التقدم',
          description: 'يُظهر عدد المجالس التي أتممتها من أصل ٥٣ مجلسًا.',
          onHighlightStarted: () => {
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.click();
            return new Promise(resolve => setTimeout(resolve, 300));
          },
        },
      },
      {
        element: '.home-tools-grid',
        popover: {
          title: 'أدوات تفاعلية',
          description: 'أدوات مبنية على محتوى المجالس.\nجرّبها بعد الجولة!',
          side: 'top',
          align: 'center',
        },
      },
      {
        popover: {
          title: 'لننتقل إلى المجلس الأول',
          description: 'الآن دعنا نفتح المجلس الأول ونتعرّف على أدوات القراءة والملاحظات.',
          onNextClick: () => {
            try {
              localStorage.setItem(PHASE_KEY, '2');
              injectSampleAnnotation();
            } catch {}
            window.location.href = '/lectures/lecture-01';
          },
        },
      },
    ],
    onDestroyed: () => {
      try {
        if (localStorage.getItem(PHASE_KEY) !== '2') {
          markComplete();
        }
      } catch {
        markComplete();
      }
    },
  });

  tourDriver.drive();
}

function runPhase2() {
  const tourDriver = driver({
    showProgress: true,
    progressText: '{{current}} من {{total}}',
    nextBtnText: 'التالي',
    prevBtnText: 'السابق',
    doneBtnText: 'إنهاء',
    popoverClass: 'driver-popover-rtl',
    allowClose: true,
    overlayColor: 'rgba(0,0,0,0.6)',
    onPopoverRender: (popover) => {
      addSkipButton(popover, tourDriver);
    },
    steps: [
      {
        element: '.content [data-p="0"]',
        popover: {
          title: 'نص المجلس',
          description: 'على الحاسوب: حدّد نصًا لإضافة ملاحظة.\nعلى الجوّال: اضغط زر + الأخضر ثم اضغط الفقرة.',
          side: 'bottom',
          align: 'center',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(2)',
        popover: {
          title: 'قُرئت',
          description: 'اضغط هنا لتحديد المجلس كمقروء.\nسيظهر ذلك في القائمة الجانبية وشريط التقدم.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(1)',
        popover: {
          title: 'المفضلة',
          description: 'أضف المجلس للمفضلة للعودة إليه بسرعة من القائمة الجانبية.',
        },
      },
      {
        element: '.notes-fab',
        popover: {
          title: 'درج الملاحظات',
          description: 'اضغط هنا لفتح درج الملاحظات واستعراض كل ملاحظاتك على هذا المجلس.',
        },
      },
      {
        element: '.lecture-toolbar__inner > :nth-child(3)',
        popover: {
          title: 'ملاحظات داخل النص',
          description: 'أظهر أو أخفِ الملاحظات داخل النص.\nأضفنا لك ملاحظة تجريبية — جرّب تعديلها أو حذفها!',
        },
      },
      {
        popover: {
          title: 'أنت جاهز! 🎉',
          description: 'استكشف المجالس بحرية.\nيمكنك تصدير واستيراد بياناتك من «إدارة البيانات» في القائمة الجانبية.\nرحلة معرفية ممتعة!',
        },
      },
    ],
    onDestroyed: () => {
      markComplete();
    },
  });

  tourDriver.drive();
}

export default function OnboardingTour() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (localStorage.getItem(TOUR_KEY)) return;
    } catch {
      return;
    }

    let timeout;

    try {
      const phase = localStorage.getItem(PHASE_KEY);

      if (phase === '2' && pathname.startsWith('/lectures/lecture-01')) {
        timeout = setTimeout(runPhase2, 800);
      } else if (!phase && pathname === '/') {
        timeout = setTimeout(runPhase1, 600);
      }
    } catch {}

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
