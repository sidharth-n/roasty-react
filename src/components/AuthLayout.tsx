import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { UserButton } from "@clerk/clerk-react";

const AuthLayout: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-white hover:text-amber-500 transition-colors">
            Dashboard
          </Link>
          <Link to="/roast" className="text-white hover:text-amber-500 transition-colors">
            New Roast
          </Link>
        </div>
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              rootBox: "relative",
              avatarBox: "w-10 h-10 rounded-full"
            }
          }}
        />
      </nav>
      <Outlet />
    </div>
  );
};

export default AuthLayout;