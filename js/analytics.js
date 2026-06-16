/**
 * KOK – King of Kits | Basic Analytics Tracking
 */

const SESSION_KEY = 'kok_session_id';

document.addEventListener('DOMContentLoaded', () => {
  initSession();
  
  // Wait a small bit so other scripts set the title etc.
  setTimeout(() => {
    trackEvent('pageview', {
      page: window.location.pathname + window.location.search
    });
  }, 1000);
});

function initSession() {
  if (!sessionStorage.getItem(SESSION_KEY)) {
    const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
}

function getSessionId() {
  return sessionStorage.getItem(SESSION_KEY);
}

/**
 * Track an event
 * @param {string} eventName 'pageview', 'product_view', 'add_to_cart', 'purchase'
 * @param {object} data
 */
async function trackEvent(eventName, data = {}) {
  try {
    const payload = {
      event: eventName,
      sessionId: getSessionId(),
      ...data
    };

    // Use sendBeacon if available for better reliability on page unload
    if (navigator.sendBeacon) {
      const url = '/api/analytics';
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      // Fallback to fetch
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(e => console.log('Analytics error (fetch)', e));
    }
  } catch (error) {
    console.log('Analytics error', error);
  }
}

// Expose to window for other scripts to use
window.trackEvent = trackEvent;
