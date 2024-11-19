import React, { useState } from 'react';

interface RoastFormProps {
  onSubmit: (formData: {
    name: string;
    job: string;
    description: string;
    phone: string;
    countryCode: string;
  }) => void;
  isSubmitting: boolean;
}

const COUNTRY_CODES = [
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+1', label: '🇺🇸 +1' },
  { value: '+44', label: '🇬🇧 +44' },
  { value: '+61', label: '🇦🇺 +61' },
  { value: '+81', label: '🇯🇵 +81' },
  { value: '+49', label: '🇩🇪 +49' },
];

const RoastForm: React.FC<RoastFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    description: '',
    phone: '',
    countryCode: '+91',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, '').substring(0, 15);
    setFormData(prev => ({ ...prev, phone: phoneNumber }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300 heading-text">
          Name of the Unfortunate Soul 💀
        </label>
        <input 
          type="text" 
          required 
          className="input-field w-full rounded-lg px-4 py-2.5 focus:outline-none"
          placeholder="Who's getting destroyed today?"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300 heading-text">
          Their Sad Career 🎭
        </label>
        <input 
          type="text" 
          required 
          className="input-field w-full rounded-lg px-4 py-2.5 focus:outline-none"
          placeholder="e.g., CEO of xyz"
          value={formData.job}
          onChange={e => setFormData(prev => ({ ...prev, job: e.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300 heading-text">
          Something Embarrassing About Them 🎯
        </label>
        <textarea 
          required 
          maxLength={100} 
          rows={3} 
          className="input-field w-full rounded-lg px-4 py-2.5 focus:outline-none resize-none"
          placeholder="e.g., Has a secret crush on Teena"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300 heading-text">
          Their Doom Number ☎️
        </label>
        <div className="flex space-x-2">
          <select 
            className="input-field rounded-lg px-2 py-2.5 focus:outline-none w-24"
            value={formData.countryCode}
            onChange={e => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
          >
            {COUNTRY_CODES.map(code => (
              <option key={code.value} value={code.value}>
                {code.label}
              </option>
            ))}
          </select>
          <input 
            type="tel" 
            required 
            className="input-field flex-1 rounded-lg px-4 py-2.5 focus:outline-none"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handlePhoneChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full button-text py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-gray-900"
        style={{ background: 'linear-gradient(135deg, #d8cbb2, #e27b06)' }}
      >
        {isSubmitting ? 'Preparing the Roast... 🔪' : 'ROAST NOW 🔥'}
      </button>
    </form>
  );
};

export default RoastForm;