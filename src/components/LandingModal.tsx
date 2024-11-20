import React from 'react';
import { Phone, Heart, Globe } from 'lucide-react';

interface LandingModalProps {
  onGetStarted: () => void;
  isVisible: boolean;
}

const LandingModal: React.FC<LandingModalProps> = ({ onGetStarted, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 rounded-xl max-w-lg w-full mx-auto border border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold gradient-text">
              Roast Your Friend 🔥
            </h1>
            <p className="text-gray-300 text-lg">
              AI-Powered Roast Calls That'll Make Your Friends Question Their Life Choices
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <Phone className="w-8 h-8 mx-auto text-amber-500" />
              <h3 className="font-semibold text-gray-200">AI Voice Calls</h3>
              <p className="text-sm text-gray-400">Hilarious roasts delivered straight to their phone</p>
            </div>
            <div className="text-center space-y-2">
              <Heart className="w-8 h-8 mx-auto text-amber-500" />
              <h3 className="font-semibold text-gray-200">Free & Fun</h3>
              <p className="text-sm text-gray-400">No cost, just laughs. Support if you enjoy!</p>
            </div>
            <div className="text-center space-y-2">
              <Globe className="w-8 h-8 mx-auto text-amber-500" />
              <h3 className="font-semibold text-gray-200">Global Roasts</h3>
              <p className="text-sm text-gray-400">Available worldwide in multiple countries</p>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center bg-gray-900/50 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              We're keeping these roasts free to spread laughter worldwide! Each call costs us money, but we believe good comedy should be accessible to everyone. Your support helps keep the roasts rolling! 🙌
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="w-full py-4 px-6 rounded-lg text-gray-900 font-bold transition-all transform hover:scale-105 button-text text-lg"
            style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
          >
            Try For Free Now 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingModal;