// import { useEffect, useState } from 'react';

// const InstallPWAButton = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const handler = (e: any) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowButton(true);
//     };

//     window.addEventListener('beforeinstallprompt', handler);

//     return () => window.removeEventListener('beforeinstallprompt', handler);
//   }, []);

//   const handleInstallClick = () => {
//     if (!deferredPrompt) return;

//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then((choiceResult: any) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the install prompt');
//       } else {
//         console.log('User dismissed the install prompt');
//       }
//       setDeferredPrompt(null);
//       setShowButton(false);
//     });
//   };

//   if (!showButton) return null;

//   return (
//     <button
//       onClick={handleInstallClick}
//       className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
//     >
//       Download App
//     </button>
//   );
// };

// export default InstallPWAButton;














// import { useEffect, useState } from 'react';

// const InstallPWAButton = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [isSupported, setIsSupported] = useState(false);

//   useEffect(() => {
//     const handler = (e: any) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setIsSupported(true);
//     };

//     window.addEventListener('beforeinstallprompt', handler);

//     // Check basic support
//     if (window.matchMedia('(display-mode: browser)').matches) {
//       setIsSupported(true);
//     }

//     return () => window.removeEventListener('beforeinstallprompt', handler);
//   }, []);

//   const handleInstallClick = () => {
//     if (!deferredPrompt) {
//       alert("Install option is not available on this browser.");
//       return;
//     }

//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then((choiceResult: any) => {
//       if (choiceResult.outcome === 'accepted') {
//         console.log('User accepted the install prompt');
//       } else {
//         console.log('User dismissed the install prompt');
//       }
//       setDeferredPrompt(null);
//     });
//   };

//   if (!isSupported) return null;

//   return (
//     <button
//       onClick={handleInstallClick}
//       className="block w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
//     >
//       Download App
//     </button>
//   );
// };

// export default InstallPWAButton;









import { useEffect, useState } from 'react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true); // Only show when supported
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Install not supported");
      return;
    }

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("User accepted install");
    } else {
      console.log("User dismissed install");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Download App
    </button>
  );
};

export default InstallPWAButton;
