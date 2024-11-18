import React from 'react';
import { useCountdown } from '../hooks/useCountdown';

const CountdownModal = () => {
  const { isActive, timeLeft, progress } = useCountdown();

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
          Roast Call in Progress
        </h2>
        <div className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent animate-pulse">
          {timeLeft}
        </div>
        <div className="w-full bg-gray-700 h-3 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-amber-500 to-amber-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-300">
            Get ready to be roasted! 🔥
          </p>
          <p className="text-sm text-gray-400">
            Your phone will ring any moment now...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownModal;