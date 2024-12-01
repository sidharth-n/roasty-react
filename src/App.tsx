import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      // Add your waitlist submission logic here
      // For example:
      // await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   body: JSON.stringify({ email }),
      // });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-lg mx-auto app-container rounded-xl shadow-2xl p-6">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 gradient-text">
          🔥 We're Making Things Even Better! 🔥
        </h1>

        <div className="mb-8 text-gray-400">
          <p className="mb-4">
            We're currently under maintenance, making the Roast Call experience even more epic!
          </p>
          <p className="mb-4">
            Thank you for all the amazing roasts so far - we've had a blast making people laugh (and cry 😈).
          </p>
          <p className="mb-4">
            Want to be notified when we're back? Join our waitlist!
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 bg-green-50 rounded-md">
            <p className="text-green-600 font-medium">
              Thanks for joining! We'll let you know when we're back with more roasts! 🎉
            </p>
          </div>
        )}

      
      </div>
      
      <Analytics />
    </div>
  );
}

export default App;