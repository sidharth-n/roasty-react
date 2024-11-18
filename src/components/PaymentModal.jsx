import React from 'react';
import { useStripe } from '../hooks/useStripe';

const PaymentModal = () => {
  const { isOpen, closeModal, handlePayment, paymentError } = useStripe();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-100">
          Complete Payment
        </h2>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Pay $0.50 to receive your roast call
        </p>
        
        <div id="payment-element" className="mb-4" />
        
        <button
          onClick={handlePayment}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600 text-gray-900 font-bold hover:opacity-90 transition-opacity"
        >
          Pay Now
        </button>
        
        <button
          onClick={closeModal}
          className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-300"
        >
          Cancel
        </button>

        {paymentError && (
          <div className="mt-4 text-sm text-center text-red-400">
            {paymentError}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;