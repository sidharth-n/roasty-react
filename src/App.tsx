import React, { useState } from 'react';
import RoastForm from './components/RoastForm';
import CountdownModal from './components/CountdownModal';
import { TermsModal } from './components/TermsModal';
import LandingModal from './components/LandingModal';
import MaintenanceModal from './components/MaintenanceModal';
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
      // API call removed during maintenance
      throw new Error('Service temporarily unavailable');
    } catch (error) {
      console.error('Call error:', error);
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
      
      <MaintenanceModal />
      
      <Analytics />
    </div>
  );
}

export default App;