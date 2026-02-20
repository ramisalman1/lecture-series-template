'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '../lib/analytics';

const DISMISS_KEY = 'pwa-banner-dismissed';

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
  return { isIOS, isAndroid, isMobile: isIOS || isAndroid, isStandalone };
}

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch { return; }

    const info = getDeviceInfo();
    if (!info.isMobile || info.isStandalone) return;

    const t = setTimeout(() => {
      setDevice(info);
      setShow(true);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setShow(false);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
    trackEvent('pwa_banner_dismiss');
  }

  if (!show || !device) return null;

  return (
    <div className={`install-banner${show ? ' install-banner--visible' : ''}`}>
      <div className="install-banner__content">
        <span className="material-icons-round install-banner__icon">install_mobile</span>
        <div className="install-banner__text">
          <strong>ثبّت التطبيق على جهازك</strong>
          {device.isIOS ? (
            <span>
              اضغط على <span className="material-icons-round install-banner__inline-icon">ios_share</span> ثم «إضافة إلى الشاشة الرئيسية»
            </span>
          ) : (
            <span>
              اضغط على <span className="material-icons-round install-banner__inline-icon">more_vert</span> ثم «تثبيت التطبيق»
            </span>
          )}
        </div>
      </div>
      <button className="install-banner__close" onClick={dismiss} aria-label="إغلاق">
        <span className="material-icons-round">close</span>
      </button>
    </div>
  );
}
