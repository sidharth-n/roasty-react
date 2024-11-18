import React, { useEffect, useRef } from 'react';

const PaymentModal = ({ isOpen, onClose, onSubmit, isProcessing, paymentError }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-100">
          Complete Payment
        </h2>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Pay $0.50 to receive your roast call
        </p>
        
        <div id="payment-element" className="mb-4" />
        
        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600 text-gray-900 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        
        <button
          onClick={onClose}
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
