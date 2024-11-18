// src/hooks/useStripe.js
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const useStripe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [elements, setElements] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const element = document.getElementById('payment-element');
        if (element && elements) {
          const paymentElement = elements.create('payment');
          paymentElement.mount(element);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, elements]);

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment setup failed');
      }

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;
      
      const newElements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: { colorPrimary: '#f59e0b' },
        },
      });

      setElements(newElements);
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
  };
};