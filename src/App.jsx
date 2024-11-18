import React from 'react';
import RoastForm from './components/RoastForm';

const App = () => {
  return (
    <div className="min-h-screen py-4 px-4 bg-gray-900">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl p-6">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
          🔥 Agent Roasty 🔥
        </h1>
        <RoastForm />
      </div>
    </div>
  );
};

export default App;