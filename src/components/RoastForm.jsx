import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import { useStripe } from '../hooks/useStripe';

const RoastForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    description: '',
    phone: '',
    countryCode: '+1'
  });

  const { 
    isOpen, 
    isProcessing,
    paymentError,
    initializePayment,
    handlePayment,
    closeModal
  } = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await initializePayment(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      const phoneNumber = value.replace(/\D/g, '').substring(0, 15);
      setFormData(prev => ({ ...prev, phone: phoneNumber }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full rounded-lg px-4 py-2.5 bg-gray-900 border border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">Job</label>
          <input
            type="text"
            id="job"
            required
            value={formData.job}
            onChange={handleInputChange}
            className="w-full rounded-lg px-4 py-2.5 bg-gray-900 border border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Your occupation"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">
            Tell us about you in a sentence.
          </label>
          <textarea
            id="description"
            required
            maxLength={100}
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full rounded-lg px-4 py-2.5 bg-gray-900 border border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
            placeholder="Eg: An artist with ideas bigger than my canvas."
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-300">
            Phone Number
          </label>
          <div className="flex space-x-2">
            <select
              id="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="rounded-lg px-2 py-2.5 bg-gray-900 border border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-24"
            >
              <option value="+1">🇺🇸 +1</option>
              <option value="+91">🇮🇳 +91</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
              <option value="+49">🇩🇪 +49</option>
            </select>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="flex-1 rounded-lg px-4 py-2.5 bg-gray-900 border border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="Phone number"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600 text-gray-900 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'ROAST NOW ($0.50) 🔥'}
        </button>
      </form>

      <PaymentModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handlePayment}
        isProcessing={isProcessing}
        paymentError={paymentError}
      />
    </>
  );
};

export default RoastForm;