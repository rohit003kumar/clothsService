



// import { useEffect, useState } from 'react';

// const InstallPWAButton = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const handler = (e: any) => {
//       console.log('✅ beforeinstallprompt event fired');
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowButton(true);
//     };

//     window.addEventListener('beforeinstallprompt', handler);

//     return () => {
//       window.removeEventListener('beforeinstallprompt', handler);
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) {
//       alert("❌ Install prompt not available yet.\nTry interacting with the page (click or scroll) and reload.");
//       return;
//     }

//     deferredPrompt.prompt();

//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === 'accepted') {
//       console.log('✅ User accepted the install prompt');
//     } else {
//       console.log('❌ User dismissed the install prompt');
//     }

//     setDeferredPrompt(null);
//     setShowButton(false);
//   };

//   // Always show the button for now (debug mode)
//   // You can switch to `if (!showButton) return null;` for production
// if (!showButton) return null;
//   return (
//     <button
//       onClick={handleInstallClick}
//       className="block w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
//     >
//       📲 Download App
//     </button>
//   );
// };

// export default InstallPWAButton;












// "use client";

// import React, { useEffect, useState } from "react";

// const InstallPWAButton = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const handleBeforeInstallPrompt = (e: any) => {
//       console.log("✅ beforeinstallprompt fired");
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowButton(true);
//     };

//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;

//     deferredPrompt.prompt(); // show the install popup

//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === "accepted") {
//       console.log("✅ User accepted the install");
//     } else {
//       console.log("❌ User dismissed the install");
//     }

//     setDeferredPrompt(null);
//     setShowButton(false);
//   };

//   // Optional: hide button on iPhone (iOS doesn't support prompt)
//   useEffect(() => {
//     const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
//     if (isIos) {
//       setShowButton(false);
//     }
//   }, []);

//   if (!showButton) return null;

//   return (
//     <button
//       onClick={handleInstallClick}
//       className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg z-50"
//     >
//       📲 Install App
//     </button>
//   );
// };

// export default InstallPWAButton;












import React, { useEffect, useState } from "react";
import InstallModal from './InstallModal';
import { detectDevice, isPWAInstallable, debugPWA } from '../utils/pwaUtils';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect device types and standalone mode
    const device = detectDevice();
    
    setIsIOS(device.isIOS);
    setIsAndroid(device.isAndroid);
    setIsStandalone(device.isStandalone);

    // Debug PWA setup in development
    if (process.env.NODE_ENV === 'development') {
      debugPWA();
    }

    // Don't show button if already installed (standalone mode)
    if (device.isStandalone) {
      console.log('🚫 App already installed (standalone mode)');
      setShowButton(false);
      return;
    }

    // Handle beforeinstallprompt event (Android Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log("✅ beforeinstallprompt fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);

    // Always show button for mobile devices
    if (device.isMobile || device.isIOS || device.isAndroid) {
      console.log('📱 Mobile device detected, showing install button immediately');
      setShowButton(true);
    } else {
      // For desktop browsers - show button after some interaction
      console.log('💻 Desktop device detected, showing install button after delay');
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as any);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Standard PWA install for supported browsers
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === "accepted") {
          console.log("✅ User accepted the install");
        } else {
          console.log("❌ User dismissed the install");
        }
        
        setDeferredPrompt(null);
        setShowButton(false);
      } catch (error) {
        console.error("Install prompt error:", error);
      }
    } else {
      // Show modal with instructions for iOS and other browsers
      console.log('📋 Showing install instructions modal');
      setShowModal(true);
    }
  };

  // Don't show if already installed
  if (isStandalone || !showButton) return null;

  const getButtonText = () => {
    if (isIOS) return "📱 Add to Home Screen";
    if (isAndroid) return "📲 Install App";
    return "💻 Install App";
  };

  const getButtonIcon = () => {
    if (isIOS) return "📱";
    if (isAndroid) return "📲";
    return "💻";
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleInstallClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm font-medium"
          aria-label={getButtonText()}
        >
          <span className="text-lg">{getButtonIcon()}</span>
          <span className="hidden sm:inline">{getButtonText()}</span>
          <span className="sm:hidden">Install</span>
        </button>
      </div>
      
      <InstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isIOS={isIOS}
      />
    </>
  );
};

export default InstallPWAButton;

