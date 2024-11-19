import React, { useState } from 'react';

export const TermsModal = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-3 z-50 overflow-hidden">
      <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[85vh] flex flex-col">
        <div className="p-4  sticky top-0 bg-gray-800 z-10 rounded-t-xl border-b border-gray-900" style={{  backgroundColor: "#2a2a2a"}}>
          <h2 className="text-xl font-bold gradient-text">Terms & Conditions</h2>
        </div>
        
        <div className="p-4 overflow-y-auto text-sm space-y-4 text-gray-300" style={{  backgroundColor: "#2a2a2a"}}>
          <section>
            <h3 className="font-semibold text-base mb-2 ">1. Service Overview</h3>
            <p>RoastCall provides AI-generated comedic roast calls for entertainment purposes. Our service uses advanced AI technology to create humorous content based on provided information.</p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">2. User Eligibility & Responsibilities</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Must be 18 years or older to use the service</li>
              <li>Required to obtain explicit consent from call recipients</li>
              <li>Prohibited from using for harassment or harmful purposes</li>
              <li>Responsible for ensuring call recipient comfort and consent</li>
              <li>Must not use service for commercial purposes without license</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">3. Service Usage & Limitations</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Calls are limited to specified duration based on credits</li>
              <li>Service may be unavailable during maintenance</li>
              <li>We reserve the right to modify or terminate service</li>
              <li>Usage may be restricted for violation of terms</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">4. Legal Disclaimers</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Service provided "as is" without warranties</li>
              <li>Users assume all risks associated with usage</li>
              <li>We're not liable for any damages or consequences</li>
              <li>Users indemnify us against all claims</li>
              <li>Local laws and regulations apply</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">5. Privacy & Data Collection</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>All calls are recorded and stored securely</li>
              <li>Call data retained for quality and safety</li>
              <li>Usage patterns analyzed for service improvement</li>
              <li>Personal data handled per Privacy Policy</li>
              <li>Data may be shared with law enforcement if required</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">6. Content & Behavior</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>No hate speech or discriminatory content</li>
              <li>No threats or intimidation</li>
              <li>No impersonation of officials or authorities</li>
              <li>Content must comply with local laws</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">7. Payment & Credits</h3>
            <ul className="list-disc pl-4 space-y-2">
              <li>Credits are non-refundable</li>
              <li>Purchases are final</li>
              <li>Pricing subject to change</li>
              <li>Credit expiration policies apply</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2 ">8. Contact & Support</h3>
            <p>For support inquiries or legal concerns, contact our support team. Response times vary based on inquiry type.</p>
          </section>
        </div>

        <div className="p-4 border-t border-gray-900 sticky bottom-0 bg-gray-800 rounded-b-xl" style={{  backgroundColor: "#2a2a2a"}}>
          <label className="flex items-start gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-600 text-amber-500"
            />
            <span className="text-xs text-gray-300">
              I have read, understood, and agree to the Terms & Conditions.
            </span>
          </label>

          <button
            onClick={() => isChecked && onAccept()}
            disabled={!isChecked}
            className="w-full button-text py-2.5 px-4 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isChecked ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'gray',
              color: '#1a1a1a'
            }}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};