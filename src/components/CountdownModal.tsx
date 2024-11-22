import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CallStatus from './CallStatus';
import ShareModal from './ShareModal';

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

const SHARE_MESSAGE = `Just found something interesting!
Just tried this AI that does friendly roasts on call
Actually quite entertaining - worth checking out
https://www.roastyourfriend.fun`;

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🔥 Epic AI Roasting Agent',
          text: SHARE_MESSAGE,
          url: 'https://www.roastyourfriend.fun'
        });
        setShareCount(prev => Math.min(prev + 1, REQUIRED_SHARES));
      } catch (error) {
        const encodedMessage = encodeURIComponent(SHARE_MESSAGE);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      }
    } else {
      const encodedMessage = encodeURIComponent(SHARE_MESSAGE);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
  };

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

          <CallStatus
            callDetails={callDetails}
            hasTimedOut={hasTimedOut}
            callTime={callTime}
            displayText={displayText}
            onGetRecording={() => setShareModalVisible(true)}
            onClose={onClose}
          />
        </div>
      </div>

      <ShareModal
        isVisible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        shareCount={shareCount}
        requiredShares={REQUIRED_SHARES}
        onShare={handleShare}
        callDetails={callDetails}
      />
    </>
  );
};

export default CountdownModal;