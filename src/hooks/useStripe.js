// src/hooks/useStripe.js
import { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QLoJmFSKrtODH18wcVauQoeBU4dTWXMvcdcJXOR2PF3ndh4HoB8nPL1A6Tysi6QdBtyTva7BPdTvyxkn3pwtECM00pHNJCEut');

export const useStripe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [elements, setElements] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const checkPayment = async () => {
      const urlClientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      );

      if (urlClientSecret) {
        const stripe = await stripePromise;
        const { paymentIntent } = await stripe.retrievePaymentIntent(urlClientSecret);
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          const storedData = localStorage.getItem('roastFormData');
          if (storedData) {
            await initiateRoastCall(JSON.parse(storedData));
            localStorage.removeItem('roastFormData');
          }
        }
      }
    };

    checkPayment();
  }, []);

  const mountPaymentElement = useCallback(async (domElement) => {
    if (!clientSecret || !domElement) return;

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
    paymentElement.mount(domElement);
    setElements(newElements);
  }, [clientSecret]);

  const initializePayment = async (formData) => {
    setIsProcessing(true);
    setPaymentError('');

    try {
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

      const { clientSecret: newClientSecret } = await response.json();
      setClientSecret(newClientSecret);
      setIsOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setPaymentError(error.message);
      localStorage.removeItem('roastFormData');
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
    setClientSecret(null);
    if (elements) {
      elements.destroy();
      setElements(null);
    }
    localStorage.removeItem('roastFormData');
  };

  return {
    isOpen,
    isProcessing,
    paymentError,
    closeModal,
    handlePayment,
    initializePayment,
    mountPaymentElement,
  };
};

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

    return true;
  } catch (error) {
    console.error('Call initiation error:', error);
    throw error;
  }
}