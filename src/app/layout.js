import './globals.css';
import Link from 'next/link';
import Header from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';
import ReadingProgress from '../components/ReadingProgress';
import OnboardingTour from '../components/OnboardingTour';
import { ProgressProvider } from '../components/ProgressProvider';
import { getAllLectures } from '../lib/lectures';

export const metadata = {
  title: 'ألف باء الزواج',
  description: 'سلسلة مجالس معرفية مع عبد الرحمن ذاكر الهاشمي',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  const lectures = getAllLectures();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProgressProvider>
          <Header lectures={lectures} />
          <ReadingProgress />

          <div className="layout">
            {children}
          </div>

          <footer className="footer">
            <span>ألف باء الزواج</span>
            <Link href="/updates" className="footer__updates-link">
              <span className="material-icons-round">update</span>
              سجل التحديثات
            </Link>
          </footer>

          <ScrollToTop />
          <OnboardingTour />
        </ProgressProvider>
      </body>
    </html>
  );
}
