import React, { useState } from 'react';
import RoastForm from './components/RoastForm';
import CountdownModal from './components/CountdownModal';
import { TermsModal } from './components/TermsModal';
import LandingModal from './components/LandingModal';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'terms' | 'form'>('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCallId, setCurrentCallId] = useState<string | null>(null);
  const [showCallStatus, setShowCallStatus] = useState(false);

  const handleGetStarted = () => {
    setCurrentStep('terms');
  };

  const handleTermsAccept = () => {
    setCurrentStep('form');
  };

  const handleDonate = () => {
    window.location.href = 'https://buy.stripe.com/fZefZp3U6dLsgNOdQQ';
  };

  const handleCloseCallStatus = () => {
    setShowCallStatus(false);
    setIsSubmitting(false);
    setCurrentCallId(null);
  };

  const initiateRoastCall = async (formData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('https://roast-call-proxy.vercel.app/proxy/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: `${formData.countryCode}${formData.phone}`,
          task: `You are Santa Claus calling ${formData.name}. Start the call with a cheerful laugh "Ho Ho Ho!" and greet them warmly by their name. Mention how happy you are to talk to them and make them feel special. Talk about their job or role (${formData.job}) in a positive and encouraging way, and share a few light-hearted and funny remarks to make them smile. Ensure your tone is cheerful, warm, and slow-paced, just like Santa. End the call by wishing them Merry Christmas and saying, "Remember, you are amazing, and Santa is proud of you!" Be kind, uplifting, and joyful throughout.`,
          model: "enhanced",
          language: "en",
          voice: "073eb2cd-2072-46a3-83b7-a49936ce0adb",
          max_duration: 3,
          first_sentence: `Ho Ho Ho! Hello, am I speaking with the wonderful ${formData.name}?`,
          wait_for_greeting: false,
          record: true,
          answered_by_enabled: true,
          analysis_schema: {
            call_duration: "number",
            answered_by: "string",
            call_successful: "boolean",
            customer_response: "string"
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initiate call');
      }

      const data = await response.json();
      setCurrentCallId(data.call_id);
      setShowCallStatus(true);
    } catch (error) {
      console.error('Call error:', error);
      alert('Failed to make call: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-4 px-4">
      {currentStep === 'form' && (
        <div className="max-w-lg mx-auto app-container rounded-xl shadow-2xl p-6">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-6 gradient-text">
            Santa's Special Call 🎅
          </h1>
          
          <RoastForm 
            onSubmit={initiateRoastCall}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      <LandingModal 
        isVisible={currentStep === 'landing'} 
        onGetStarted={handleGetStarted}
      />
      
      {currentStep === 'terms' && (
        <TermsModal onAccept={handleTermsAccept} />
      )}
      
      <CountdownModal 
        isVisible={showCallStatus}
        currentCallId={currentCallId}
        onClose={handleCloseCallStatus}
        onDonate={handleDonate}
      />
      
      <Analytics />
    </div>
  );
}

export default App;
