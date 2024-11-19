import React from 'react';
import { SignInButton } from "@clerk/clerk-react";
import { Flame, Shield, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto" style={{ backgroundColor: "#2a2a2a" }}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-extrabold gradient-text">
            Roast Your Friend 🔥
          </h1>
          <p className="text-gray-300 text-lg">
            AI-powered roast calls to destroy your friends
          </p>
        </div>

        {/* Quick Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center">
            <Flame className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-gray-300 text-sm">Savage AI Roasts</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Shield className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-gray-300 text-sm">Safe & Fun</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Sparkles className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-gray-300 text-sm">Custom Made</span>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="space-y-4">
          <SignInButton mode="modal">
            <button 
              className="w-full button-text py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-gray-900 font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
            >
              Start Roasting Now 🎯
            </button>
          </SignInButton>
          <p className="text-xs text-center text-gray-400">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;