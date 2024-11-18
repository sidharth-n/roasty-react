import React, { useState } from 'react';
import { useStripe } from '../hooks/useStripe';


const RoastForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    description: '',
    phone: '',
    countryCode: '+1'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { initializePayment } = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await initializePayment(formData);
    } catch (error) {
      console.error('Error:', error);
      alert('Payment setup failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'phone') {
      // Only allow digits
      const phoneNumber = value.replace(/\D/g, '').substring(0, 15);
      setFormData(prev => ({ ...prev, phone: phoneNumber }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="name"
        label="Name"
        type="text"
        placeholder="Your name"
        value={formData.name}
        onChange={handleInputChange}
      />

      <FormField
        id="job"
        label="Job"
        type="text"
        placeholder="Your occupation"
        value={formData.job}
        onChange={handleInputChange}
      />

      <FormField
        id="description"
        label="Tell us about you in a sentence."
        type="textarea"
        placeholder="Eg: An artist with ideas bigger than my canvas."
        value={formData.description}
        onChange={handleInputChange}
        maxLength={100}
        rows={3}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          Phone Number
        </label>
        <div className="flex space-x-2">
          <select
            id="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            className="rounded-lg px-2 py-2.5 bg-gray-900 border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-amber-500 w-24"
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
            className="flex-1 rounded-lg px-4 py-2.5 bg-gray-900 border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-amber-500"
            placeholder="Phone number"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-amber-200 to-amber-600 text-gray-900 font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'ROAST NOW ($0.50) 🔥'}
      </button>
    </form>
  );
};

export default RoastForm;

const FormField = ({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  maxLength, 
  rows 
}) => {
  const baseClassName = "w-full rounded-lg px-4 py-2.5 bg-gray-900 border-gray-700 text-gray-100 focus:border-amber-500 focus:ring-amber-500";
  
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          required
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          rows={rows}
          className={`${baseClassName} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          required
          value={value}
          onChange={onChange}
          className={baseClassName}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};