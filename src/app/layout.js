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

export const metadata = {
  title: 'ألف باء الزواج',
  description: 'سلسلة مجالس معرفية مع عبد الرحمن ذاكر الهاشمي',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ألف باء الزواج',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NDHE99PQRH"
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
            gtag('config', 'G-NDHE99PQRH');
          `}
        </Script>
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
          <RegisterSW />
          <InstallBanner />
        </ProgressProvider>
      </body>
    </html>
  );
}
