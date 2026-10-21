/**
 * Google Auth Service for Client-Side Google Identity Services Integration
 */

let gsiScriptLoaded = false;
let gsiScriptLoadingPromise = null;

/**
 * Load Google Identity Services SDK script dynamically
 */
export function loadGsiScript() {
  if (gsiScriptLoaded && window.google?.accounts) {
    return Promise.resolve(window.google.accounts);
  }

  if (gsiScriptLoadingPromise) {
    return gsiScriptLoadingPromise;
  }

  gsiScriptLoadingPromise = new Promise((resolve, reject) => {
    if (document.getElementById('google-gsi-script')) {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts) {
          clearInterval(checkInterval);
          gsiScriptLoaded = true;
          resolve(window.google.accounts);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gsiScriptLoaded = true;
      resolve(window.google?.accounts);
    };
    script.onerror = (err) => {
      gsiScriptLoadingPromise = null;
      reject(new Error('Failed to load Google Identity Services SDK.'));
    };
    document.head.appendChild(script);
  });

  return gsiScriptLoadingPromise;
}

/**
 * Get configured Google Client ID from env or localStorage
 */
export function getStoredGoogleClientId() {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('ems_google_client_id') ||
    ''
  );
}

/**
 * Save custom Google Client ID to localStorage
 */
export function saveGoogleClientId(clientId) {
  if (clientId) {
    localStorage.setItem('ems_google_client_id', clientId.trim());
  } else {
    localStorage.removeItem('ems_google_client_id');
  }
}

/**
 * Decode base64 Google JWT credential payload safely
 */
export function decodeGoogleJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error parsing Google ID token JWT:', err);
    return null;
  }
}
