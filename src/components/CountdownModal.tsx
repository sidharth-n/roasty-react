import React from 'react';

interface CountdownModalProps {
  isVisible: boolean;
  timeLeft: number;
  progress: number;
}

const CountdownModal: React.FC<CountdownModalProps> = ({ isVisible, timeLeft, progress }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 countdown-container">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Emotional Damage Initiated...</h2>
        <div className="countdown-number gradient-text mb-4">{timeLeft}</div>
        <div className="w-full bg-gray-700 h-3 rounded-full mb-6 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              width: `${progress}%`
            }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-300">Hope they have good health insurance for this burn 🚑</p>
          <p className="text-sm text-gray-400">Roasty Aunty is choosing violence today 🔥</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownModal;