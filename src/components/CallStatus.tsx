import React from 'react';
import { 
  Phone,
  PhoneIncoming,
  PhoneCall,
  Crown,
  XCircle,
  Clock,
  User,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

interface CallStatusProps {
  callDetails: any;
  hasTimedOut: boolean;
  callTime: number;
  displayText: string;
  onGetRecording: () => void;
  onClose: () => void;
}

const CallStatus: React.FC<CallStatusProps> = ({
  callDetails,
  hasTimedOut,
  callTime,
  displayText,
  onGetRecording,
  onClose
}) => {
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

  return (
    <>
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
                  onClick={onGetRecording}
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
    </>
  );
};

export default CallStatus;