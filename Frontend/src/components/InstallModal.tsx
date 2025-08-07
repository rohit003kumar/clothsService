import React from 'react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
}

const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, isIOS }) => {
  if (!isOpen) return null;

  const iOSInstructions = [
    {
      step: 1,
      text: "Tap the Share button",
      icon: "📤",
      description: "Look for the square with arrow icon at the bottom of Safari"
    },
    {
      step: 2,
      text: "Scroll down and tap 'Add to Home Screen'",
      icon: "📱",
      description: "Find this option in the share menu"
    },
    {
      step: 3,
      text: "Tap 'Add' to confirm",
      icon: "✅",
      description: "The app will appear on your home screen"
    }
  ];

  const genericInstructions = [
    {
      browser: "Chrome/Edge",
      instruction: "Look for the install icon in the address bar"
    },
    {
      browser: "Firefox",
      instruction: "Open menu > Install this site as an app"
    },
    {
      browser: "Safari",
      instruction: "Use Share > Add to Home Screen"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {isIOS ? "Add to Home Screen" : "Install App"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {isIOS ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Install FoldMate as an app on your iPhone/iPad:
              </p>
              {iOSInstructions.map((instruction) => (
                <div key={instruction.step} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {instruction.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{instruction.icon}</span>
                      <p className="font-medium text-gray-900">
                        {instruction.text}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {instruction.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Once installed, FoldMate will work like a native app with offline support!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Install FoldMate for the best experience:
              </p>
              {genericInstructions.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-blue-600 min-w-[80px]">
                    {item.browser}:
                  </div>
                  <div className="text-gray-700">{item.instruction}</div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✨ Or simply bookmark this page for quick access!
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallModal;
