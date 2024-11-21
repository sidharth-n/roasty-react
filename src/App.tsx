import React, { useState } from 'react';
import RoastForm from './components/RoastForm';
import SupportModal from './components/SupportModal';
import { TermsModal } from './components/TermsModal';
import LandingModal from './components/LandingModal';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'terms' | 'form'>('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleGetStarted = () => {
    setCurrentStep('terms');
  };

  const handleTermsAccept = () => {
    setCurrentStep('form');
  };

  const handleDonate = () => {
    window.location.href = 'https://buy.stripe.com/fZefZp3U6dLsgNOdQQ';
  };

  const initiateRoastCall = async (formData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('https://roast-call-proxy.vercel.app/proxy/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: `${formData.countryCode}${formData.phone}`,
          task: `You are calling ${formData.name}. Their job is: ${formData.job}. and this is a crazy embarassing fact about them: ${formData.description}. Start by greeting and conforming their name and when they reply back start roasting them based on these details we have. mainly roast based on their job, name and then the crazy fact. roast them so hard and be as mean as possible. be hilarious too. the roast should be so sarcastic and hard and funny. no buttering.`,
          model: "enhanced",
          language: "en",
          voice: "nat",
          max_duration: 1.5,
          first_sentence: `Hello ${formData.name}! How are you doing today?`,
          wait_for_greeting: false,
        })
      });

      if (!response.ok) throw new Error('Call failed');
      setShowSupport(true);
    } catch (error) {
      console.error('Call error:', error);
      alert('Failed to make call: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const handleSupportClose = () => {
    setShowSupport(false);
    setIsSubmitting(false);
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
      
      {currentStep === 'terms' && <TermsModal onAccept={handleTermsAccept} />}
      
      <SupportModal 
        isVisible={showSupport}
        onClose={handleSupportClose}
        onDonate={handleDonate}
      />
      
      <Analytics />
    </div>
  );
}

export default App;