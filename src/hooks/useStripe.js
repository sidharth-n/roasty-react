// src/hooks/useStripe.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QLoJmFSKrtODH18wcVauQoeBU4dTWXMvcdcJXOR2PF3ndh4HoB8nPL1A6Tysi6QdBtyTva7BPdTvyxkn3pwtECM00pHNJCEut');

export const useStripe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [elements, setElements] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check for payment confirmation
    const checkPayment = async () => {
      const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      );

      if (clientSecret) {
        const stripe = await stripePromise;
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          // Clear stored data
          localStorage.removeItem('roastFormData');
          // Initiate call
          const storedData = localStorage.getItem('roastFormData');
          if (storedData) {
            initiateRoastCall(JSON.parse(storedData));
          }
        }
      }
    };

    checkPayment();
  }, []);

  const initializePayment = async (formData) => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // Save form data to localStorage
      localStorage.setItem('roastFormData', JSON.stringify(formData));

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Payment setup failed');
      }

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;

      const newElements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#f59e0b',
          },
        },
      });

      const paymentElement = newElements.create('payment');
      paymentElement.mount('#payment-element');

      setElements(newElements);
      setIsOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setPaymentError(error.message);
      localStorage.removeItem('roastFormData'); // Clear stored data on error
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!elements) return;

    setIsProcessing(true);
    setPaymentError('');

    try {
      const stripe = await stripePromise;
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
      });

      // Only reached if there's an immediate error
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      setPaymentError(error.message);
      localStorage.removeItem('roastFormData');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (elements) {
      elements.destroy();
    }
    localStorage.removeItem('roastFormData');
  };

  const handleOutsideClick = (event) => {
    if (event.target.id === 'payment-modal') {
      closeModal();
    }
  };

  return {
    isOpen,
    isProcessing,
    paymentError,
    closeModal,
    handlePayment,
    initializePayment,
    handleOutsideClick,
  };
};

// Helper function to initiate roast call
async function initiateRoastCall(formData) {
  try {
    const callResponse = await fetch('https://roast-call-proxy.vercel.app/proxy/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number: `${formData.countryCode}${formData.phone}`,
        task: `You are calling ${formData.name}. Their job is: ${formData.job}. Greet them very quickly and roast them hard for their hobby which is: ${formData.description}. Be as mean as possible`,
        model: "enhanced",
        language: "en",
        voice: "nat",
        max_duration: 12,
      })
    });

    if (!callResponse.ok) {
      throw new Error('Failed to initiate call');
    }

    // Start countdown will be handled by the countdown component
    return true;
  } catch (error) {
    console.error('Call initiation error:', error);
    throw error;
  }
}