import './globals.css';
import Script from 'next/script';
import Link from 'next/link';
import Header from '../components/Header';
import ScrollToTop from '../components/ScrollToTop';
import ReadingProgress from '../components/ReadingProgress';
import OnboardingTour from '../components/OnboardingTour';
import RegisterSW from '../components/RegisterSW';
import InstallBanner from '../components/InstallBanner';
import { ProgressProvider } from '../components/ProgressProvider';
import { getAllLectures } from '../lib/lectures';

// ── عدّل البيانات الوصفية لسلسلتك ──
export const metadata = {
  title: 'اسم السلسلة',
  description: 'وصف السلسلة',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'اسم السلسلة',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport = {
  themeColor: '#1976D2',
};

export default function RootLayout({ children }) {
  const lectures = getAllLectures();

  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* ── Google Analytics — استبدل المعرّف بمعرّفك الخاص ── */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'granted'
            });
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}
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
            {/* ── عدّل اسم السلسلة في الفوتر ── */}
            <span>اسم السلسلة</span>
            <Link href="/updates" className="footer__updates-link">
              <span className="material-icons-round">update</span>
              سجل التحديثات
            </Link>
          </footer>

          <ScrollToTop />
          <OnboardingTour />
          <RegisterSW />
          <InstallBanner />
        </ProgressProvider>
      </body>
    </html>
  );
}
