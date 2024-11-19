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
  { value: '+91', label: '🇮🇳 +91' },   // India
  { value: '+1', label: '🇺🇸 +1' },    // USA
  { value: '+44', label: '🇬🇧 +44' },   // UK
  { value: '+353', label: '🇮🇪 +353' }, // Ireland
  { value: '+61', label: '🇦🇺 +61' },   // Australia
  { value: '+81', label: '🇯🇵 +81' },   // Japan
  { value: '+49', label: '🇩🇪 +49' },   // Germany
  { value: '+33', label: '🇫🇷 +33' },   // France
  { value: '+39', label: '🇮🇹 +39' },   // Italy
  { value: '+7', label: '🇷🇺 +7' },     // Russia
  { value: '+86', label: '🇨🇳 +86' },   // China
  { value: '+34', label: '🇪🇸 +34' },   // Spain
  { value: '+55', label: '🇧🇷 +55' },   // Brazil
  { value: '+27', label: '🇿🇦 +27' },   // South Africa
  { value: '+64', label: '🇳🇿 +64' },   // New Zealand
  { value: '+46', label: '🇸🇪 +46' },   // Sweden
  { value: '+31', label: '🇳🇱 +31' },   // Netherlands
  { value: '+41', label: '🇨🇭 +41' },   // Switzerland
  { value: '+52', label: '🇲🇽 +52' },   // Mexico
  { value: '+351', label: '🇵🇹 +351' }, // Portugal
  { value: '+65', label: '🇸🇬 +65' },   // Singapore
  { value: '+82', label: '🇰🇷 +82' },   // South Korea
  { value: '+90', label: '🇹🇷 +90' },   // Turkey
  { value: '+62', label: '🇮🇩 +62' },   // Indonesia
  { value: '+20', label: '🇪🇬 +20' },   // Egypt
  { value: '+94', label: '🇱🇰 +94' },   // Sri Lanka
  { value: '+60', label: '🇲🇾 +60' },   // Malaysia
  { value: '+966', label: '🇸🇦 +966' }, // Saudi Arabia
  { value: '+92', label: '🇵🇰 +92' },   // Pakistan
  { value: '+234', label: '🇳🇬 +234' }, // Nigeria
  { value: '+977', label: '🇳🇵 +977' }, // Nepal
  { value: '+971', label: '🇦🇪 +971' }, // UAE
  { value: '+48', label: '🇵🇱 +48' },   // Poland
  { value: '+358', label: '🇫🇮 +358' }, // Finland
  { value: '+420', label: '🇨🇿 +420' }, // Czech Republic
  { value: '+30', label: '🇬🇷 +30' },   // Greece
  { value: '+380', label: '🇺🇦 +380' }, // Ukraine
  { value: '+45', label: '🇩🇰 +45' },   // Denmark
  { value: '+47', label: '🇳🇴 +47' },   // Norway
  { value: '+32', label: '🇧🇪 +32' },   // Belgium
  { value: '+43', label: '🇦🇹 +43' },   // Austria
  { value: '+36', label: '🇭🇺 +36' },   // Hungary
  { value: '+40', label: '🇷🇴 +40' },   // Romania
  { value: '+359', label: '🇧🇬 +359' }, // Bulgaria
  { value: '+385', label: '🇭🇷 +385' }, // Croatia
  { value: '+63', label: '🇵🇭 +63' },   // Philippines
  { value: '+66', label: '🇹🇭 +66' },   // Thailand
  { value: '+84', label: '🇻🇳 +84' },   // Vietnam
  { value: '+506', label: '🇨🇷 +506' }, // Costa Rica
  { value: '+972', label: '🇮🇱 +972' }, // Israel
  { value: '+354', label: '🇮🇸 +354' }, // Iceland
  { value: '+371', label: '🇱🇻 +371' }, // Latvia
  { value: '+370', label: '🇱🇹 +370' }, // Lithuania
  { value: '+352', label: '🇱🇺 +352' }, // Luxembourg
  { value: '+356', label: '🇲🇹 +356' }, // Malta
  { value: '+886', label: '🇹🇼 +886' }, // Taiwan
  { value: '+852', label: '🇭🇰 +852' }, // Hong Kong
  { value: '+961', label: '🇱🇧 +961' }, // Lebanon
  { value: '+880', label: '🇧🇩 +880' }, // Bangladesh
  { value: '+855', label: '🇰🇭 +855' }, // Cambodia
  { value: '+95', label: '🇲🇲 +95' },   // Myanmar
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
  <div className="absolute z-50 bottom-full mb-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
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