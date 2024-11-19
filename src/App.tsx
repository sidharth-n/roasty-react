import React, { useState } from 'react';
import RoastForm from './components/RoastForm';
import CountdownModal from './components/CountdownModal';
import { TermsModal } from './components/TermsModal';
import { Analytics } from "@vercel/analytics/react";
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { Layout } from 'lucide-react';
import { 
  SignedIn, 
  SignedOut, 
  UserButton,
  useAuth
} from "@clerk/clerk-react";

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showTerms, setShowTerms] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [credits] = useState(5); // This would normally come from your backend

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>;
  }

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
      <SignedIn>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="bg-gray-800 rounded-xl p-4 mb-4 shadow-lg">
            <div className="flex justify-between items-center">
              {/* Left side - Credits */}
              <div className="flex items-center space-x-2">
                <div className="text-amber-500 font-bold">
                  {credits} Credits
                </div>
              </div>
              
              {/* Right side - Dashboard toggle & UserButton */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#1a1a1a'
                  }}
                >
                  <Layout size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="app-container rounded-xl shadow-2xl p-6 bg-white">
            {showDashboard ? (
              <Dashboard />
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-extrabold gradient-text mb-6">
                  Roast Your Friend 🔥
                </h1>
                <RoastForm
                  onSubmit={initiateRoastCall}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </div>

          {showTerms && <TermsModal onAccept={handleTermsAccept} />}
          
          <CountdownModal
            isVisible={showCountdown}
            timeLeft={timeLeft}
            progress={((60 - timeLeft) / 60) * 100}
          />
        </div>
      </SignedIn>

      <SignedOut>
        <LandingPage />
      </SignedOut>

      <Analytics />
    </div>
  );
}

export default App;