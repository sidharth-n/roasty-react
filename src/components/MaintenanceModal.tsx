import React from 'react';
import { AlertCircle, LinkedinIcon, Twitter } from 'lucide-react';

const MaintenanceModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 p-6 rounded-lg w-full max-w-sm mx-auto text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
        </div>

        <h2 className="text-xl font-bold mb-2 gradient-text">
          🔥 Server Overload 🔥
        </h2>

        <div className="space-y-4 text-gray-300">
          <p className="text-sm">
            Our servers crashed from 10,000+ roasts in 48 hours! 🔥 
            Working on bringing more fire power to handle the heat 🚀
          </p>
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            <p className="text-sm mb-3">Follow for comeback updates 👇</p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://x.com/sid_ai_dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors flex items-center space-x-2"
              >
                <Twitter className="w-5 h-5 text-gray-300" />
                <span className="text-sm text-gray-300">Twitter</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/sidharth-n-52828b226" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors flex items-center space-x-2"
              >
                <LinkedinIcon className="w-5 h-5 text-gray-300" />
                <span className="text-sm text-gray-300">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceModal;