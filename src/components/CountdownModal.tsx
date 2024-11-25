import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  XCircle,
  User,
  PhoneCall,
  PhoneIncoming,
  Crown,
  X,
  AlertCircle,
  LinkedinIcon,
  Twitter
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

const CALL_TIMEOUT_SECONDS = 90;

const CountdownModal: React.FC<CountdownModalProps> = ({ 
  isVisible, 
  currentCallId,
  onClose,
  onDonate
}) => {
  const [callTime, setCallTime] = useState(0);
  const [timeoutCounter, setTimeoutCounter] = useState(0);
  const [callDetails, setCallDetails] = useState<any>(null);
  const [displayText, setDisplayText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const isShortCall = callDetails?.status === 'completed' && 
                     callDetails?.corrected_duration && 
                     callDetails?.corrected_duration < 20;

  // Reset states when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      setCallTime(0);
      setTimeoutCounter(0);
      setHasTimedOut(false);
      setDisplayText('');
      setCurrentMessageIndex(0);
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
            setCurrentMessageIndex(currentIndex);
            setTimeout(() => {
              charIndex = 0;
            }, 500);
          }
        }
      }, 50);

      return () => clearInterval(typeWriter);
    }
  }, [callDetails?.status]);

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
          if (prev >= CALL_TIMEOUT_SECONDS - 1) {
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
    const message = encodeURIComponent(`Hey, I need the roasted recording for the call ID: ${currentCallId}`);
    window.location.href = `https://wa.me/+919746938443?text=${message}`;
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-sm mx-auto text-center relative">
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
              <div className="countdown-number gradient-text mb-3 text-2xl">
                {formatTime(callTime)}
              </div>
            )}

            {callDetails?.status === 'in-progress' && (
              <div className="min-h-[80px] flex items-center justify-center">
                <p className="text-lg text-gray-300">
                  {displayText}
                  <span className="inline-block w-0.5 h-5 bg-gray-300 ml-1 animate-blink"></span>
                </p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {callDetails?.status === 'completed' && callDetails?.corrected_duration && (
                <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Duration</span>
                  </div>
                  <span className="text-sm text-gray-300">{callDetails.corrected_duration}s</span>
                </div>
              )}

              {callDetails?.status === 'completed' && callDetails?.call_ended_by && (
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

              {callDetails?.error_message && (
                <div className="p-2 bg-red-900/20 rounded-lg">
                  <p className="text-xs text-red-400">{callDetails.error_message}</p>
                </div>
              )}
            </div>

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
             callDetails?.corrected_duration >= 20 && 
             callDetails?.recording_url && (
              <div className="border-t border-gray-700 pt-4">
                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4 space-y-3">
                  <h3 className="text-lg font-bold gradient-text">Epic Roast Recorded! 🎯</h3>
                  <p className="text-sm text-gray-300">
                    We served 10,000+ calls in just 2 days! 🚀 While we love keeping everything free, our server costs are getting intense. For now, calls stay free but we ask a small fee for recordings to keep roasting alive! 
                  </p>
                  <button
                    onClick={handleGetRecording}
                    className="w-full py-3 px-4 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
                  >
                    <div className="flex items-center justify-center text-sm space-x-2">
                      <PlayCircle className="w-5 h-5" />
                      <span>Get Recording on WhatsApp</span>
                    </div>
                  </button>
                  
                  <div className="pt-2 border-t border-gray-700/50">
                    <p className="text-xs text-gray-400 mb-2">Follow for more AI fun 🔥</p>
                    <div className="flex justify-center space-x-4">
                      <a 
                        href="https://x.com/sid_ai_dev" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-gray-300" />
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/sidharth-n-52828b226"
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                      >
                        <LinkedinIcon className="w-4 h-4 text-gray-300" />
                      </a>
                    </div>
                  </div>

            {/*       <p className="text-xs text-gray-400">
                    Support us to keep the roasts coming! 🔥
                  </p> */}
                </div>
              </div>
            )}

            <div className="mt-4">
            {/*   <p className="text-sm font-medium text-gray-300">
                {callDetails?.status === 'completed' 
                  ? "Roast level: Extra Crispy 🔥" 
                  : ""}
              </p> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountdownModal;