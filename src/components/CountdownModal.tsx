// CountdownModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle,
  X,
  Share2,
  Phone,
  PhoneIncoming,
  PhoneCall,
  Crown,
  XCircle,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

interface CountdownModalProps {
  isVisible: boolean;
  currentCallId: string | null;
  onClose: () => void;
  onDonate: () => void;
}

const PROMO_MESSAGES = [
  "Wanna hear how they got roasted? ",
  "Recording will be available after the call... ",
  "Ready to share this epic roast with friends? "
];

const REQUIRED_SHARES = 5;

const CountdownModal: React.FC<CountdownModalProps> = ({ 
  isVisible, 
  currentCallId,
  onClose,
  onDonate
}) => {
  const [callTime, setCallTime] = useState(0);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  const [callDetails, setCallDetails] = useState<any>(null);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [displayText, setDisplayText] = useState('');

  // Reset states when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setCallTime(0);
      setTimeoutCounter(0);
      setHasTimedOut(false);
      setDisplayText('');
      setShareCount(0);
    }
  }, [isVisible]);

  // Typing animation effect
  useEffect(() => {
    if (callDetails?.status === 'in-progress') {
      let currentIndex = 0;
      let charIndex = 0;
      let isTypingIn = true;
      let currentMessage = PROMO_MESSAGES[currentIndex];
      
      const typeWriter = setInterval(() => {
        if (isTypingIn) {
          if (charIndex < currentMessage.length) {
            setDisplayText(currentMessage.substring(0, charIndex + 1));
            charIndex++;
          } else {
            setTimeout(() => {
              isTypingIn = false;
              charIndex = currentMessage.length;
            }, 2000);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentMessage.substring(0, charIndex - 1));
            charIndex--;
          } else {
            currentIndex = (currentIndex + 1) % PROMO_MESSAGES.length;
            currentMessage = PROMO_MESSAGES[currentIndex];
            isTypingIn = true;
            setTimeout(() => {
              charIndex = 0;
            }, 500);
          }
        }
      }, 50);

      return () => clearInterval(typeWriter);
    }
  }, [callDetails?.status]);

  // Call status checking effect
  useEffect(() => {
    if (!isVisible || !currentCallId) return;

    let timer: NodeJS.Timeout;
    let statusCheck: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;

    const startTimer = () => {
      timer = setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    };

    const startTimeoutCounter = () => {
      timeoutTimer = setInterval(() => {
        setTimeoutCounter(prev => {
          if (prev >= 60 - 1) {
            setHasTimedOut(true);
            clearInterval(timeoutTimer);
            clearInterval(timer);
            clearInterval(statusCheck);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    };

    const checkCallStatus = async () => {
      try {
        const response = await fetch(`https://roast-call-proxy.vercel.app/proxy/call?callId=${currentCallId}`);
        const data = await response.json();
        setCallDetails(data);

        if (data.status === 'in-progress') {
          if (!timer) {
            startTimer();
            clearInterval(timeoutTimer);
          }
        } else if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(timer);
          clearInterval(statusCheck);
          clearInterval(timeoutTimer);
          setCallTime(0);
        } else if (['queued', 'ringing'].includes(data.status)) {
          if (!timeoutTimer) {
            startTimeoutCounter();
          }
        }
      } catch (error) {
        console.error('Error fetching call details:', error);
      }
    };

    checkCallStatus();
    statusCheck = setInterval(checkCallStatus, 1000);
    startTimeoutCounter();

    return () => {
      clearInterval(timer);
      clearInterval(statusCheck);
      clearInterval(timeoutTimer);
    };
  }, [isVisible, currentCallId]);

  const handleGetRecording = () => {
    setShareModalVisible(true);
  };

const SHARE_MESSAGE = "🔥 LMAO! Just found this hilarious AI roasting agent! It's absolutely savage and free to try!\n\n😂 You guys have to check this out - it roasts people in real-time and the responses are absolutely wild!\n\n🎯 Try it now: https://www.roastyourfriend.fun";

const handleShare = async () => {
  // Try to use Web Share API first (for mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: '🔥 Epic AI Roasting Agent',
        text: SHARE_MESSAGE,
        url: 'https://www.roastyourfriend.fun'
      });
      setShareCount(prev => Math.min(prev + 1, REQUIRED_SHARES));
    } catch (error) {
      // If user cancels or share fails, fallback to WhatsApp
      const encodedMessage = encodeURIComponent(SHARE_MESSAGE);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
  } else {
    // Fallback for desktop or when Share API is not available
    const encodedMessage = encodeURIComponent(SHARE_MESSAGE);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  }
};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    if (hasTimedOut) {
      return <XCircle className="w-10 h-10 text-red-500" />;
    }
    
    switch (callDetails?.status) {
      case 'queued':
        return <Phone className="w-10 h-10 text-blue-500 animate-pulse" />;
      case 'ringing':
        return <PhoneIncoming className="w-10 h-10 text-yellow-500 animate-bounce" />;
      case 'in-progress':
        return <PhoneCall className="w-10 h-10 text-green-500 animate-pulse" />;
      case 'completed':
        return <Crown className="w-10 h-10 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-10 h-10 text-red-500" />;
      default:
        return <Phone className="w-10 h-10 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusMessage = () => {
    if (hasTimedOut) {
      return 'Call Not Connected ❌';
    }
    
    switch (callDetails?.status) {
      case 'queued':
        return 'Roast Queued...';
      case 'ringing':
        return 'Ringing... 🔔';
      case 'in-progress':
        return 'Roasting... 🔥';
      case 'completed':
        return 'Roasted! 💀';
      case 'failed':
        return 'Failed ❌';
      default:
        return 'Preparing...';
    }
  };

  const isShortCall = callDetails?.status === 'completed' && 
                     callDetails?.corrected_duration && 
                     callDetails?.corrected_duration < 20;

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-sm mx-auto text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-3">
            {getStatusIcon()}
          </div>

          <h2 className="text-xl font-bold mb-4 gradient-text">
            {getStatusMessage()}
          </h2>

          {hasTimedOut && (
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Looks like we couldn't connect the call. Please try again later.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg text-gray-400 font-medium hover:text-gray-300 transition-colors"
              >
                Try Again Later
              </button>
            </div>
          )}

          {!hasTimedOut && (
            <>
              {callDetails?.status === 'in-progress' && (
                <>
                  <div className="countdown-number gradient-text mb-3 text-2xl">
                    {formatTime(callTime)}
                  </div>
                  <div className="min-h-[80px] flex items-center justify-center">
                    <p className="text-lg text-gray-300">
                      {displayText}
                      <span className="inline-block w-0.5 h-5 bg-gray-300 ml-1 animate-blink"></span>
                    </p>
                  </div>
                </>
              )}

              {callDetails?.status === 'completed' && (
                <div className="space-y-3 mb-4">
                  {callDetails.corrected_duration && (
                    <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Duration</span>
                      </div>
                      <span className="text-sm text-gray-300">{callDetails.corrected_duration}s</span>
                    </div>
                  )}

                  {callDetails.call_ended_by && (
                    <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Ended By</span>
                      </div>
                      <span className="text-sm text-gray-300">
                        {callDetails.call_ended_by === 'ASSISTANT' ? 'Roasty' : 'Victim'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isShortCall && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-yellow-500 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="text-lg font-bold">Call Too Short</h3>
                    </div>
                    <p className="text-sm text-gray-300">
                      Recordings are only available for calls longer than 20 seconds.
                    </p>
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 rounded-lg text-gray-400 font-medium hover:text-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {callDetails?.status === 'completed' && 
               callDetails.corrected_duration >= 20 && 
               callDetails.recording_url && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-bold gradient-text">Epic Roast Captured! 🎯</h3>
                    <p className="text-sm text-gray-300">
                      Your victim just got served! Get the recording and share the destruction.
                    </p>
                    <button
                      onClick={handleGetRecording}
                      className="w-full py-3 px-4 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <PlayCircle className="w-5 h-5" />
                        <span>Get Recording</span>
                      </div>
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full py-2 px-4 rounded-lg text-gray-400 font-medium hover:text-gray-300 transition-colors"
                    >
                      Skip for now
                    </button>
                    <p className="text-[10px] text-gray-500">
                      *Small fee applies to keep roasting free for all 🎯
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-sm mx-auto text-center relative">
            <button 
              onClick={() => setShareModalVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

          {shareCount < REQUIRED_SHARES ? (
  <>
    <div className="flex justify-center mb-4">
      <Share2 className="w-12 h-12 text-yellow-400" />
    </div>
    
    <h2 className="text-xl font-bold mb-4 gradient-text">
      Unlock Your Roast Recording! 🔓
    </h2>
    
    <p className="text-gray-300 mb-6">
      Share this epic roast to <span className="text-yellow-400 font-bold">5 WhatsApp groups</span> to get access to the recording!
    </p>

    <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
      <div 
        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full transition-all duration-500"
        style={{ width: `${(shareCount / REQUIRED_SHARES) * 100}%` }}
      />
    </div>
    
    <p className="text-gray-400 mb-6">
      Shared: {shareCount}/{REQUIRED_SHARES} times
    </p>

    <button
      onClick={handleShare}
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

                {/* New Share/Download Button */}
                <button
                  onClick={() => {
                    // Check if Web Share API is available (mobile devices)
                    if (navigator.share) {
                      navigator.share({
                        title: 'Epic Roast Recording 🔥',
                        text: '🎯 Check out this savage roast! Absolutely destroyed!',
                        url: callDetails?.recording_url || "https://example.com/sample-roast.mp3"
                      }).catch(err => {
                        // Fallback to WhatsApp share
                        const message = encodeURIComponent(
                          "🔥 Check out this epic roast! Listen to the destruction: " + 
                          (callDetails?.recording_url || "https://example.com/sample-roast.mp3")
                        );
                        window.open(`https://wa.me/?text=${message}`, '_blank');
                      });
                    } else {
                      // Fallback to WhatsApp share
                      const message = encodeURIComponent(
                        "🔥 Check out this epic roast! Listen to the destruction: " + 
                        (callDetails?.recording_url || "https://example.com/sample-roast.mp3")
                      );
                      window.open(`https://wa.me/?text=${message}`, '_blank');
                    }
                  }}
                  className="w-full py-3 px-4 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg mb-4"
                  style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Share Recording</span>
                  </div>
                </button>

                <button
                  onClick={() => setShareModalVisible(false)}
                  className="w-full py-2 px-4 rounded-lg text-gray-400 font-medium hover:text-gray-300 transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CountdownModal;