'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_KEY = 'tour-completed';

export default function OnboardingTour() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    try {
      if (localStorage.getItem(TOUR_KEY)) return;
    } catch {
      return;
    }

    // Small delay so the page DOM is fully rendered
    const timeout = setTimeout(() => {
      const tourDriver = driver({
        showProgress: true,
        progressText: '{{current}} من {{total}}',
        nextBtnText: 'التالي',
        prevBtnText: 'السابق',
        doneBtnText: 'ابدأ الآن',
        popoverClass: 'driver-popover-rtl',
        allowClose: true,
        overlayColor: 'rgba(0,0,0,0.6)',
        steps: [
          {
            popover: {
              title: 'مرحبًا بك في ألف باء الزواج',
              description: 'سلسلة مجالس معرفية شاملة تتناول أسس الزواج ومقدماته. دعنا نأخذك في جولة سريعة!',
            },
          },
          {
            element: '.header__search-btn',
            popover: {
              title: 'البحث',
              description: 'استخدم البحث للوصول السريع لأي مجلس أو موضوع.',
            },
          },
          {
            element: '.dark-mode-toggle',
            popover: {
              title: 'الوضع الليلي',
              description: 'بدّل بين الوضع الفاتح والداكن حسب راحتك.',
            },
          },
          {
            element: '.home-banner',
            popover: {
              title: 'المجالس المعرفية',
              description: 'تصفّح ٥٣ مجلسًا معرفيًا بالترتيب أو اختر ما يناسبك.',
            },
          },
          {
            element: '.home-stats',
            popover: {
              title: 'تقدّمك',
              description: 'تابع تقدّمك في قراءة المجالس من شريط التقدم.',
            },
          },
          {
            element: '.home-tools-grid',
            popover: {
              title: 'أدوات تفاعلية',
              description: 'أدوات مخصصة: أسئلة الخِطبة، بطاقة التعارف، التكليفات، وغيرها.',
            },
          },
          {
            popover: {
              title: 'إدارة البيانات',
              description: 'يمكنك تصدير واستيراد جميع بياناتك من صفحة إدارة البيانات في القائمة الجانبية.',
            },
          },
        ],
        onDestroyed: () => {
          try {
            localStorage.setItem(TOUR_KEY, '1');
          } catch {}
        },
      });

      tourDriver.drive();
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
