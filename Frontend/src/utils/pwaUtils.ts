// Utility functions for PWA functionality

export const detectDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  return {
    isIOS: /iphone|ipad|ipod/.test(userAgent),
    isAndroid: /android/.test(userAgent),
    isSafari: /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent),
    isChrome: /chrome/.test(userAgent) && !/edg/.test(userAgent),
    isEdge: /edg/.test(userAgent),
    isFirefox: /firefox/.test(userAgent),
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
                  (window.navigator as any).standalone === true,
    isMobile: /mobile|android|iphone|ipad|ipod/.test(userAgent)
  };
};

export const isPWAInstallable = () => {
  const device = detectDevice();
  
  // Don't show if already installed
  if (device.isStandalone) return false;
  
  // Mobile devices are generally installable
  if (device.isMobile) return true;
  
  // iOS Safari supports manual installation
  if (device.isIOS && device.isSafari) return true;
  
  // Android Chrome and other Chromium browsers support beforeinstallprompt
  if (device.isAndroid || device.isChrome || device.isEdge) return true;
  
  // Other browsers can still benefit from instructions
  return true;
};

export const getInstallInstructions = (deviceInfo: ReturnType<typeof detectDevice>) => {
  if (deviceInfo.isIOS) {
    return {
      title: "Add to Home Screen",
      steps: [
        "Tap the Share button (square with arrow) at the bottom of Safari",
        "Scroll down and tap 'Add to Home Screen'",
        "Tap 'Add' to confirm"
      ],
      note: "The app will appear on your home screen like a native app!"
    };
  }
  
  return {
    title: "Install App",
    browserInstructions: [
      { browser: "Chrome/Edge", instruction: "Look for the install icon in the address bar" },
      { browser: "Firefox", instruction: "Open menu > Install this site as an app" },
      { browser: "Safari", instruction: "Use Share > Add to Home Screen" }
    ],
    note: "Or simply bookmark this page for quick access!"
  };
};

// Check if the current page meets PWA criteria
export const validatePWA = () => {
  const checks = {
    manifest: !!document.querySelector('link[rel="manifest"]'),
    serviceWorker: 'serviceWorker' in navigator,
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    icons: true // We'll assume icons are properly configured
  };
  
  const isValid = Object.values(checks).every(check => check);
  
  return {
    isValid,
    checks,
    issues: Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check)
  };
};

// Log PWA status for debugging
export const debugPWA = () => {
  const device = detectDevice();
  const validation = validatePWA();
  
  console.group('PWA Debug Info');
  console.log('Device Info:', device);
  console.log('PWA Validation:', validation);
  console.log('Install Support:', isPWAInstallable());
  console.groupEnd();
  
  return { device, validation, installable: isPWAInstallable() };
};
