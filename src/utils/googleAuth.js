/**
 * Google OAuth Integration Utility
 * Handles Google Sign-In functionality
 */

// Load Google Identity Services script
export const loadGoogleScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if script is already loaded
    if (window.google && window.google.accounts) {
      resolve(window.google);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        resolve(window.google);
      } else {
        reject(new Error('Google script loaded but API not available'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });
};

// Initialize Google OAuth with callback
export const initializeGoogleAuth = (clientId, callback) => {
  if (typeof window === 'undefined' || !window.google) return;

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false, // Disable FedCM to avoid CORS issues
    });
  } catch (error) {
    console.error('Error initializing Google Auth:', error);
  }
};

// Render Google Sign-In button
export const renderGoogleButton = (elementId, options = {}) => {
  if (typeof window === 'undefined' || !window.google) return;

  const defaultOptions = {
    theme: 'outline',
    size: 'large',
    width: '100%',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    ...options,
  };

  try {
    const element = document.getElementById(elementId);
    if (element) {
      window.google.accounts.id.renderButton(element, defaultOptions);
    }
  } catch (error) {
    console.error('Error rendering Google button:', error);
  }
};

// Prompt Google Sign-In
export const promptGoogleSignIn = () => {
  if (typeof window === 'undefined' || !window.google) return;

  try {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('Google Sign-In prompt not displayed:', notification.getNotDisplayedReason());
      }
    });
  } catch (error) {
    console.error('Error prompting Google Sign-In:', error);
  }
};

