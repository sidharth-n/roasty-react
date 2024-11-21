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
  X
} from 'lucide-react';

interface CountdownModalProps {
  isVisible: boolean;
  currentCallId: string | null;
  onClose: () => void;
  onDonate: () => void;
}

const CountdownModal: React.FC<CountdownModalProps> = ({ 
  isVisible, 
  currentCallId,
  onClose,
  onDonate
}) => {
  const [callTime, setCallTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [callDetails, setCallDetails] = useState<any>(null);

  useEffect(() => {
    if (!isVisible || !currentCallId) return;

    let timer: NodeJS.Timeout;
    let statusCheck: NodeJS.Timeout;

    const startTimer = () => {
      timer = setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    };

    const checkCallStatus = async () => {
      try {
        const response = await fetch(`https://roast-call-proxy.vercel.app/proxy/call?callId=${currentCallId}`);
        const data = await response.json();
        
   /*      console.log('Processed Call Details:', {
          status: data.status,
          callLength: Number(data.corrected_duration),
          answeredBy: data.answered_by,
          completed: data.completed,
          recordingUrl: data.recording_url,
          summary: data.summary,
          callEndedBy: data.call_ended_by,
          queueStatus: data.queue_status
        }); */

        setCallDetails(data);

        if (data.status === 'in-progress' && !timer) {
          startTimer();
        }

        if (data.status === 'completed' || data.status === 'failed') {
          console.log('Call ended with status:', data.status);
          clearInterval(timer);
          clearInterval(statusCheck);
        }
      } catch (error) {
        console.error('Error fetching call details:', error);
      }
    };

    checkCallStatus();
    statusCheck = setInterval(checkCallStatus, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(statusCheck);
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
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm mx-auto text-center relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Icon */}
        <div className="flex justify-center mb-3">
          {getStatusIcon()}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 gradient-text">
          {getStatusMessage()}
        </h2>

        {/* Live Timer */}
        {callDetails?.status === 'in-progress' && (
          <div className="countdown-number gradient-text mb-3 text-2xl">
            {formatTime(callTime)}
          </div>
        )}

        {/* Call Details */}
        <div className="space-y-3 mb-4">
          {/* Duration */}
          {callDetails?.status === 'completed' && callDetails?.corrected_duration && (
            <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Duration</span>
              </div>
              <span className="text-sm text-gray-300">{callDetails.corrected_duration}s</span>
            </div>
          )}

          {/* Ended By */}
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

          {/* Error */}
          {callDetails?.error_message && (
            <div className="p-2 bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-400">{callDetails.error_message}</p>
            </div>
          )}
        </div>

        {/* Recording Section */}
        {callDetails?.status === 'completed' && 
         callDetails?.corrected_duration > 20 && 
         callDetails?.recording_url && (
          <div className="border-t border-gray-700 pt-4">
            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-bold gradient-text">Emotional Damage Recorded! 💥</h3>
              <p className="text-sm text-gray-300">
                This roast deserves to go viral! Your friends won't believe what just happened.
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
              <p className="text-[10px] text-gray-500">
                *Small fee applies to keep roasting free for all 🎯
              </p>
            </div>
          </div>
        )}

        {/* Fun Message */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-300">
            {callDetails?.status === 'completed' 
              ? "Roast level: Extra Crispy 🔥" 
              : "Hope they have good insurance for these burns!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountdownModal;