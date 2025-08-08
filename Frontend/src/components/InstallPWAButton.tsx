



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












"use client";

import React, { useEffect, useState } from "react";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      console.log("✅ beforeinstallprompt fired");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // show the install popup

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ User accepted the install");
    } else {
      console.log("❌ User dismissed the install");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  // Optional: hide button on iPhone (iOS doesn't support prompt)
  useEffect(() => {
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    if (isIos) {
      setShowButton(false);
    }
  }, []);

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg z-50"
    >
      📲 Install App
    </button>
  );
};

export default InstallPWAButton;




