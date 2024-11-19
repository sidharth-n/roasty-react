import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

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
  { value: '+33', label: '🇫🇷 +33' },
  { value: '+39', label: '🇮🇹 +39' },
  { value: '+7', label: '🇷🇺 +7' },
  { value: '+86', label: '🇨🇳 +86' },
  { value: '+34', label: '🇪🇸 +34' },
  { value: '+55', label: '🇧🇷 +55' },
  { value: '+27', label: '🇿🇦 +27' },
  { value: '+64', label: '🇳🇿 +64' },
  { value: '+46', label: '🇸🇪 +46' },
  { value: '+31', label: '🇳🇱 +31' },
  { value: '+41', label: '🇨🇭 +41' },
  { value: '+52', label: '🇲🇽 +52' },
  { value: '+351', label: '🇵🇹 +351' },
  { value: '+65', label: '🇸🇬 +65' },
  { value: '+82', label: '🇰🇷 +82' },
  { value: '+90', label: '🇹🇷 +90' },
  { value: '+62', label: '🇮🇩 +62' },
  { value: '+20', label: '🇪🇬 +20' },
  { value: '+94', label: '🇱🇰 +94' },
  { value: '+60', label: '🇲🇾 +60' },
  { value: '+966', label: '🇸🇦 +966' },
  { value: '+92', label: '🇵🇰 +92' },
  { value: '+234', label: '🇳🇬 +234' },
  { value: '+977', label: '🇳🇵 +977' },
  { value: '+971', label: '🇦🇪 +971' },
  { value: '+48', label: '🇵🇱 +48' },
  { value: '+358', label: '🇫🇮 +358' },
  { value: '+420', label: '🇨🇿 +420' },
  { value: '+30', label: '🇬🇷 +30' },
  { value: '+380', label: '🇺🇦 +380' },
];

const RoastForm: React.FC<RoastFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    description: '',
    phone: '',
    countryCode: '+91',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="relative w-32" ref={dropdownRef}>
            <button
              type="button"
              className="input-field w-full rounded-lg px-2 py-2.5 focus:outline-none flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{COUNTRY_CODES.find(code => code.value === formData.countryCode)?.label}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                <div className="py-1">
                  {COUNTRY_CODES.map(code => (
                    <button
                      key={code.value}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-700 text-sm flex items-center space-x-2 transition-colors"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, countryCode: code.value }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span>{code.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
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