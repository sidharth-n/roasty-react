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
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold gradient-text">
              Roast Your Friend 🔥
            </h1>
            <p className="text-sm md:text-base text-gray-300">
              The Most Hilarious AI Roasting Agent in History, Just a click away!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center py-2">
            <div className="space-y-1.5 bg-gray-900/40 p-2 rounded-lg">
              <Phone className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-300 font-medium">AI Voice Calls</p>
            </div>
            <div className="space-y-1.5 bg-gray-900/40 p-2 rounded-lg">
              <Heart className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-300 font-medium">Free & Fun</p>
            </div>
            <div className="space-y-1.5 bg-gray-900/40 p-2 rounded-lg">
              <Globe className="w-6 h-6 mx-auto text-amber-500" />
              <p className="text-xs text-gray-300 font-medium">Global Roasts</p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-4 rounded-lg border border-gray-700/50">
            <p className="text-sm text-gray-200">
              We're keeping these legendary roasts absolutely free because laughter should be unlimited! 
              <span className="block mt-2 text-amber-400 font-medium">
                If our AI makes you laugh (which it definitely will), consider supporting us to keep the roasts rolling worldwide! 🌍
              </span>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full py-3.5 px-4 rounded-lg text-gray-900 font-bold transition-all transform hover:scale-105 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }}
            >
             Start Roasting 🔥
            </button>

            <a
              href="https://buy.stripe.com/fZefZp3U6dLsgNOdQQ"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 px-4 rounded-lg font-bold transition-all transform hover:scale-105 hover:shadow-lg text-center bg-gradient-to-r from-emerald-500 to-emerald-600"
            >
              <span className="flex items-center justify-center gap-2 text-gray-900">
                <Coffee className="w-5 h-5" />
                <span>Support the Laughter </span>
              </span>
            </a>

            <p className="text-xs text-center text-gray-400">
              No limits. No cost. Just pure roasting fun!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingModal;