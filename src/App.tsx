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
          task: `You are calling ${formData.name}. Their job is: ${formData.job}. and this is a crazy embarassing fact about them: ${formData.description}. Start by greeting with their name and continue only after their reply and when they reply back start roasting them based on these details we have. mainly roast based on their job, name and then the crazy fact. roast them so hard and be as mean as possible. be hilarious too. the roast should be so sarcastic and hard and funny. no buttering. make it more like a conversation type. not like long speeche.`,
          model: "enhanced",
          language: "en",
          voice: "073eb2cd-2072-46a3-83b7-a49936ce0adb",
          max_duration: 1.5,
          first_sentence: `Hello, am I speaking with ${formData.name}?`,
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
            Roast Your Friend 🔥
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