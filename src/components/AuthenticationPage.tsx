import React from 'react';
import { SignInButton } from "@clerk/clerk-react";

const AuthenticationPage: React.FC = () => {
  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 gradient-text text-center">
        Welcome to RoastYourFriend 🔥
      </h1>
      
      <div className="space-y-6">
        <p className="text-gray-300 text-center">
          Sign in to start roasting your friends with AI-powered sass!
        </p>
        
        <div className="flex justify-center">
          <SignInButton mode="modal">
            <button 
              className="px-6 py-3 rounded-lg text-gray-900 font-bold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)'
              }}
            >
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
        
        <div className="text-sm text-gray-400 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;