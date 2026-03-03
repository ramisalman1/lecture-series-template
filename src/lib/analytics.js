import posthog from 'posthog-js';

export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined') {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
    posthog.capture(eventName, params);
  }
}
