import React, { useState, useEffect } from 'react';
import RoastForm from './components/RoastForm';
import CountdownModal from './components/CountdownModal';
import { TermsModal } from './components/TermsModal';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showTerms, setShowTerms] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('termsAccepted');
    if (accepted) {
      setShowTerms(false);
      setHasAcceptedTerms(true);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setShowTerms(false);
    setHasAcceptedTerms(true);
  };

  const initiateRoastCall = async (formData) => {
    if (!hasAcceptedTerms) {
      setShowTerms(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('https://roast-call-proxy.vercel.app/proxy/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: `${formData.countryCode}${formData.phone}`,
          task: `You are calling ${formData.name}. Their job is: ${formData.job}. and this is a crazy embarassing fact about them: ${formData.description}. Greet them very quickly as normally initially and then start roasting them based on these details we have. mainly roast based on their job, name and then the crazy fact. roast them so hard and be as mean as possible. be hilarious too`,
          model: "enhanced",
          language: "en",
          voice: "nat",
          max_duration: 1,
          wait_for_greeting: false,
        })
      });

      if (!response.ok) throw new Error('Call failed');
      startCountdown();
    } catch (error) {
      console.error('Call error:', error);
      alert('Failed to make call: ' + error.message);
      setIsSubmitting(false);
    }
  };

  const startCountdown = () => {
    setShowCountdown(true);
    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowCountdown(false);
          setIsSubmitting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-lg mx-auto app-container rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 gradient-text">
          Roast Your Friend 🔥
        </h1>
        
        <RoastForm 
          onSubmit={initiateRoastCall}
          isSubmitting={isSubmitting}
        />
      </div>

      {showTerms && <TermsModal onAccept={handleTermsAccept} />}
      
      <CountdownModal 
        isVisible={showCountdown}
        timeLeft={timeLeft}
        progress={((60 - timeLeft) / 60) * 100}
      />
      
      <Analytics />
    </div>
  );
}

export default App;