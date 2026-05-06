/* =============================================================================
   ZALES EDS — delayed.js
   Non-critical third-party scripts loaded after page is interactive.
   ============================================================================= */

/**
 * Lazy-load any analytics or marketing pixels here.
 * This file runs after LCP and TTI — never block the main thread.
 */

// Example: Performance monitoring
if ('performance' in window && 'PerformanceObserver' in window) {
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      // eslint-disable-next-line no-console
      console.debug('[Zales EDS] LCP:', Math.round(last.startTime), 'ms');
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (_) {
    // PerformanceObserver not supported, skip
  }
}

// Example: Consent-gated analytics stub
// Replace with real GTM/Adobe Analytics tag once consent is available
function loadAnalytics() {
  const consentGiven = document.cookie.includes('zales_consent=true');
  if (!consentGiven) return;

  // window.dataLayer = window.dataLayer || [];
  // loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX');
}

loadAnalytics();

// Prefetch next likely page navigations for faster subsequent loads
function prefetchLinks() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = link.href;
          if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
            const prefetchEl = document.createElement('link');
            prefetchEl.rel = 'prefetch';
            prefetchEl.href = href;
            document.head.appendChild(prefetchEl);
          }
          observer.unobserve(link);
        }
      });
    },
    { rootMargin: '200px' }
  );

  document.querySelectorAll('nav a, .hero a, .category-nav a').forEach((a) => {
    observer.observe(a);
  });
}

window.setTimeout(prefetchLinks, 500);
