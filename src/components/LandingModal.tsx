import React from 'react';
import { Phone, Heart, Globe, Coffee } from 'lucide-react';

interface LandingModalProps {
  onGetStarted: () => void;
  isVisible: boolean;
}

const LandingModal: React.FC<LandingModalProps> = ({ onGetStarted, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 rounded-xl w-full max-w-md mx-auto border border-gray-700 shadow-xl">
        <div className="p-4 md:p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">
              Roast Your Friend 🔥
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              AI-Powered Roast Calls That'll Make Your Friends Question Their Life Choices
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <Phone className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-400">AI Voice Calls</p>
            </div>
            <div className="space-y-1">
              <Heart className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-400">Free & Fun</p>
            </div>
            <div className="space-y-1">
              <Globe className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-400">Global Roasts</p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center bg-gray-900/50 p-3 rounded-lg">
            <p className="text-xs md:text-sm text-gray-300">
              We're keeping these roasts free to spread laughter worldwide! Your support helps keep the roasts rolling! 🙌
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <button
              onClick={onGetStarted}
              className="w-full py-3 px-4 rounded-lg text-gray-900 font-bold transition-all transform hover:scale-105 button-text"
              style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
            >
              Start Roasting Now 🔥
            </button>

            <a
              href="https://buy.stripe.com/fZefZp3U6dLsgNOdQQ"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 text-gray-900 text-center"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }}
            >
              <span className="flex items-center justify-center gap-2">
                <Coffee className="w-5 h-5" />
                <span>Support Our Roasts</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingModal;