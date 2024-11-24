import React from 'react';
import { X, Share2, Crown } from 'lucide-react';

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  shareCount: number;
  requiredShares: number;
  onShare: () => void;
  callDetails: any;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isVisible,
  onClose,
  shareCount,
  requiredShares,
  onShare,
  callDetails
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-sm mx-auto text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {shareCount < requiredShares ? (
          <>
            <div className="flex justify-center mb-4">
              <Share2 className="w-12 h-12 text-yellow-400" />
            </div>
            
            <h2 className="text-xl font-bold mb-4 gradient-text">
              Unlock Your Roast Recording! 🔓
            </h2>
            
            <p className="text-gray-300 mb-6">
              Share this epic roast app to <span className="text-yellow-400 font-bold">{requiredShares} WhatsApp groups</span> to get access to the recording!
            </p>

            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(shareCount / requiredShares) * 100}%` }}
              />
            </div>
            
            <p className="text-gray-400 mb-6">
              Shared: {shareCount}/{requiredShares} times
            </p>

            <button
              onClick={onShare}
              className="w-full py-3 px-4 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share to WhatsApp Group</span>
              </div>
            </button>

            <p className="text-xs text-gray-500">
              Share using WhatsApp groups to unlock recording
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-xl font-bold mb-4 gradient-text">
              Thanks for Spreading the Fire! 🔥
            </h2>
            
            <p className="text-gray-300 mb-6">
              Here's your epic roast recording. Enjoy and share the destruction!
            </p>

            <div className="bg-gray-700/30 p-4 rounded-lg mb-4">
              <audio 
                controls 
                className="w-full"
                src={callDetails?.recording_url || "https://example.com/sample-roast.mp3"}
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            <button
              onClick={onShare}
              className="w-full py-3 px-4 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg mb-4"
              style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
            >
              <div className="flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Recording</span>
              </div>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 px-4 rounded-lg text-gray-400 font-medium hover:text-gray-300 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareModal;