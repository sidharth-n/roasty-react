import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QLoJmFSKrtODH18wcVauQoeBU4dTWXMvcdcJXOR2PF3ndh4HoB8nPL1A6Tysi6QdBtyTva7BPdTvyxkn3pwtECM00pHNJCEut');

export const useStripe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [elements, setElements] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  
  useEffect(() => {
    // Check for payment confirmation on mount
    const checkPayment = async () => {
      const clientSecret = new URLSearchParams(window.location.search).get(
        'payment_intent_client_secret'
      );

      if (clientSecret) {
        const stripe = await stripePromise;
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          initiateRoastCall();
        }
      }
    };

    checkPayment();
  }, []);

  const initializePayment = async (formData) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Payment setup failed');

      const { clientSecret } = await response.json();
      const stripe = await stripePromise;
      
      const elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: { colorPrimary: '#f59e0b' },
        },
      });

      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
      
      setElements(elements);
      setIsOpen(true);
      localStorage.setItem('roastFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    if (elements) {
      elements.destroy();
    }
    localStorage.removeItem('roastFormData');
  };

  return {
    isOpen,
    closeModal,
    handlePayment,
    initializePayment,
    paymentError
  };
};