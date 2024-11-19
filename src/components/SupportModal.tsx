import React from 'react';
import { Heart, X, Coffee } from 'lucide-react';

interface SupportModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDonate: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isVisible, onClose, onDonate }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 p-6 rounded-xl max-w-sm w-full mx-4 relative border border-gray-700 shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold gradient-text">
              Your Roast Call is Live! 🔥
            </h2>
            
            <p className="text-gray-300">
              We're keeping these roasts free to spread laughter worldwide! Each call costs us 50¢/min, but hey - good comedy is priceless! 😄
            </p>

            <div className="text-amber-400 font-medium text-sm">
              Help keep the roast culture alive! 🙌
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onDonate}
              className="w-full py-3 px-4 rounded-lg text-gray-900 font-medium transition-all transform hover:scale-105 button-text"
              style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
            >
              <span className="flex items-center justify-center space-x-2">
                <Coffee className="w-5 h-5" />
                <span>Buy Us a Coffee</span>
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Skip (but our AI will be sad 😢)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;